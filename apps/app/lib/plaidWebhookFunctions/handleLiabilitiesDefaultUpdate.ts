import { Logger } from "next-axiom";

import { getDestinationObject } from "../integrations/getDestinationObject";
import { db } from "../db";
import { getLiabilities } from "../plaid";
import {  Table, Integration, SyncTrigger } from "@prisma/client";
import { logDestinationErrorTriggered, logSyncCompleted } from "../logsnag";
import { trackDestinationErrorTriggered, trackSyncCompleted } from "../analytics";
import { PlaidWebhookDestination, PlaidWebhookItem } from "~/types";

export const handleLiabilitiesDefaultUpdate = async ({ item, destinations, logger }: { item: PlaidWebhookItem; destinations: PlaidWebhookDestination[], asAdmin: boolean; logger: Logger }) => {
  const tableTypes = [ Table.Institutions, Table.Accounts ];
  const destinationFilter = (destination: PlaidWebhookDestination) => {
    const destinationItems = destination.accounts.map(account => account.plaidItemId);
    return destinationItems.includes(item.id) && destination.integration !== Integration.Coda;
  };
  const { accessToken } = item;

  const filteredDestinations = destinations.filter(destinationFilter);
  if ( filteredDestinations.length === 0 ) { return true; }

  const { liabilities, accounts } = await getLiabilities({ accessToken }).then(response => response.data);

  const trigger = SyncTrigger.LiabilitiesUpdate;
  const sync = await db.sync.create({
    data: {
      trigger,
      triggerPlaidItemId: item.id,
      userIdOld: item.userId,
      userIdNew: item.userId,
      results: {
        createMany: {
          data: filteredDestinations.map(destination => ({
            plaidItemId: item.id,
            destinationId: destination.id,
            shouldSyncInstitution: true,
            shouldSyncAccounts: true
          }))
        }
      }
    }
  });
  logger.info("Sync created", { sync })

  return Promise.all(filteredDestinations.map(async destination => {
    const destinationLogger = logger.with({ destinationId: destination.id });
    const syncResultWhere = { syncId_plaidItemId_destinationId: { syncId: sync.id, destinationId: destination.id, plaidItemId: item.id }};
    const destinationAccountIds = destination.accounts.filter(account => account.plaidItemId === item.id).map(account => account.id);
    const credentials = ( destination.airtableCredential || destination.googleSheetsCredential || destination.notionCredential )!
    const Destination = getDestinationObject({ userId: destination.userId, integration: destination.integration, credentials })!;
    await Destination.init();

    // Validate credentials
    const validateCredentialsResponse = await Destination.validateCredentials();
    destinationLogger.info("Validate credentials response", { response: validateCredentialsResponse });
    if ( !validateCredentialsResponse.isValid ) {
      await Promise.all([
        db.syncResult.update({ where: syncResultWhere, data: { error: validateCredentialsResponse.error!.code }}),

        logDestinationErrorTriggered({
          userId: destination.userId,
          destinationId: destination.id,
          error: validateCredentialsResponse.error!,
          syncId: sync.id,
        }),
  
        trackDestinationErrorTriggered({
          userId: destination.userId,
          destinationId: destination.id,
          destinationName: destination.name,
          error: validateCredentialsResponse.error!,
          trigger,
          integration: destination.integration
        })
      ])
      return;
    }

    // Validate table configs
    const validateTableConfigsResponse = await Destination.validateTableConfigs({ tableTypes, tableConfigs: destination.tableConfigs });
    destinationLogger.info("Validate table configs response", { response: validateTableConfigsResponse });
    if ( !validateTableConfigsResponse.isValid ) {
      const { code: tableConfigErrorCode, ...tableConfigErrorMetaData } = validateTableConfigsResponse.errors[0];
      await Promise.all([
        db.syncResult.update({ where: syncResultWhere, data: { error: tableConfigErrorCode, errorMetadata: tableConfigErrorMetaData }}),

        logDestinationErrorTriggered({
          userId: destination.userId,
          destinationId: destination.id,
          error: validateTableConfigsResponse.errors[0]!,
          syncId: sync.id,
        }),
  
        trackDestinationErrorTriggered({
          userId: destination.userId,
          destinationId: destination.id,
          destinationName: destination.name,
          error: validateTableConfigsResponse.errors[0]!,
          trigger,
          integration: destination.integration
        })
      ])
      return;
    }

    await Destination.load({ tableTypes, tableConfigs: destination.tableConfigs });
    destinationLogger.info("Loaded destination data");

    const destinationAccounts = accounts.filter(account => destinationAccountIds.includes(account.account_id));
    const destinationCreditLiabilities = (liabilities.credit || []).filter(liab => destinationAccountIds.includes(liab.account_id || ""));
    const destinationStudentLiabilities = (liabilities.student || []).filter(liab => destinationAccountIds.includes(liab.account_id || ""));
    const destinationMortgageLiabilities = (liabilities.mortgage || []).filter(liab => destinationAccountIds.includes(liab.account_id || ""));

    const { record: institutionRecord, isNew: isInstitutionRecordNew } = await Destination.upsertItem({ item });
    destinationLogger.info("Upserted institution", { isNew: isInstitutionRecordNew })

    const [
      { results: accountResults }
    ] = await Promise.all([
      Destination.upsertAccounts({ accounts: destinationAccounts, item, institutionRecord, creditLiabilities: destinationCreditLiabilities, studentLiabilities: destinationStudentLiabilities, mortgageLiabilities: destinationMortgageLiabilities })
        .then(response => { destinationLogger.info("Upserted accounts", { results: response.results }); return response }),
    ]);

    await Destination.updateItemOnFinish({ item, institutionRecord, timezone: item.user.timezone })

    await Promise.all([
      db.syncResult.update({
        where: syncResultWhere,
        data: {
          institutionsAdded: isInstitutionRecordNew ? 1 : 0,
          institutionsUpdated: isInstitutionRecordNew ? 0 : 1,
          accountsAdded: accountResults.added,
          accountsUpdated: accountResults.updated,
        }
      }).then(response => destinationLogger.info("Updated sync results", { response })),

      logSyncCompleted({ trigger, userId: item.userId, integration: destination.integration, destinationId: destination.id, syncId: sync.id, institutionsSynced: 1 }),

      trackSyncCompleted({ userId: item.userId, trigger, integration: destination.integration, destinationId: destination.id, institutionsSynced: 1 })
    ])
  }))
  .then(() => {
    const endedAt = new Date();
    return Promise.all([
      db.plaidItem.update({ where: { id: item.id }, data: { lastSyncedAt: endedAt }})
        .then(() => logger.info("Updated item's last synced at", { lastSyncedAt: endedAt })),

      db.sync.update({ where: { id: sync.id }, data: { isSuccess: true, endedAt: endedAt }})
        .then(response => logger.info("Updated sync record", { response }))
    ])
  })
}