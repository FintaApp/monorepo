import { Logger } from "next-axiom";
import moment from "moment-timezone";

import { getDestinationObject } from "../integrations/getDestinationObject";
import { db } from "../db";
import { getAllInvestmentTransactions } from "../plaid";

import { Table, Integration, SyncTrigger } from "@prisma/client";
import { logDestinationErrorTriggered, logSyncCompleted } from "../logsnag";
import { trackDestinationErrorTriggered, trackSyncCompleted } from "../analytics";
import { PlaidWebhookDestination, PlaidWebhookItem } from "~/types";

export const handleInvestmentTransactionsDefaultUpdate = async ({ item, destinations, logger }: { item: PlaidWebhookItem; destinations: PlaidWebhookDestination[], asAdmin: boolean; logger: Logger }) => {
  const tableTypes = [ Table.Institutions, Table.Accounts, Table.InvestmentTransactions, Table.Securities ];
  const destinationFilter = (destination: PlaidWebhookDestination) => {
    const destinationItems = destination.accounts.map(account => account.plaidItemId);
    const investmentTransactionsTableConfig = destination.tableConfigs.find(config => config.table === Table.InvestmentTransactions); 
    return investmentTransactionsTableConfig?.isEnabled && destinationItems.includes(item.id) && destination.integration !== Integration.Coda;
  };
  const { accessToken } = item;

  const filteredDestinations = destinations.filter(destinationFilter);
  if ( filteredDestinations.length === 0 ) { return true; }

  const { accounts, investmentTransactions, securities } = await getAllInvestmentTransactions({ accessToken, startDate: moment().subtract(14, 'days').format("YYYY-MM-DD"), endDate: moment().format("YYYY-MM-DD"), options: {}});
  
  const trigger = SyncTrigger.InvestmentTransactionsUpdate;
  const sync = await db.sync.create({
    data: {
      trigger,
      triggerPlaidItemId: item.id,
      userId: item.userId,
      results: {
        createMany: {
          data: filteredDestinations.map(destination => ({
            plaidItemId: item.id,
            destinationId: destination.id,
            shouldSyncInstitution: true,
            shouldSyncAccounts: true,
            shouldSyncInvestmentTransactions: true,
            shouldSyncSecurities: !!destination.tableConfigs.find(config => config.table === Table.Securities)?.isEnabled
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
    const destinationInvestmentTransactions = investmentTransactions.filter(transaction => destinationAccountIds.includes(transaction.account_id));
    const destinationSecurities = securities.filter(security => destinationInvestmentTransactions.map(transaction => transaction.security_id).includes(security.security_id))

    const { records: institutionRecords, results: institutionResults } = await Destination.upsertItems({ items: [ item ] });
    destinationLogger.info("Upserted institution", { results: { added: institutionResults.added.length, updated: institutionResults.updated.length } });

    const [
      { records: accountRecords, results: accountResults },
      { records: securityRecords, results: securityResults }
    ] = await Promise.all([
      Destination.upsertAccounts({ accounts: destinationAccounts, items: [ item ], institutionRecords })
        .then(response => { destinationLogger.info("Upserted accounts", { results: response.results }); return response }),

      Destination.upsertSecurities({ securities: destinationSecurities })
        .then(response => { destinationLogger.info("Upserted securities", { results: response.results }); return response })
    ]);

    const investmentTransactionResults = await Destination.upsertInvestmentTransactions({ investmentTransactions: destinationInvestmentTransactions, securityRecords, accountRecords })
      .then(response => { destinationLogger.info("Upserted investment transactions", { results: response }); return response });
    
    await Destination.updateItemsOnFinish({ items: [item], institutionRecords, timezone: item.user.timezone })
      .then(() => destinationLogger.info("Updated item record with last sync at"))

    await Promise.all([
      db.syncResult.update({
        where: syncResultWhere,
        data: {
          institutionsAdded: institutionResults.added.length,
          institutionsUpdated: institutionResults.updated.length,
          accountsAdded: accountResults.added.length,
          accountsUpdated: accountResults.updated.length,
          securitiesAdded: securityResults.added.length,
          securitiesUpdated: securityResults.updated.length,
          investmentTransactionsAdded: investmentTransactionResults.added.length
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