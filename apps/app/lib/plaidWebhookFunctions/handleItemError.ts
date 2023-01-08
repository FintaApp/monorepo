import { Logger } from "next-axiom";
import { ItemErrorWebhook } from "plaid";

import { getDestinationObject } from "../integrations/getDestinationObject";
import { db } from "../db";

import { Table, Integration, SyncTrigger } from "@prisma/client";
import { logDestinationErrorTriggered, logInstitutionErrorTriggered, logSyncCompleted, logUnhandledEvent } from "../logsnag";
import { trackDestinationErrorTriggered, trackInstitutionErrorTriggered } from "../analytics";
import { OauthItem, PlaidWebhookDestination, PlaidWebhookItem } from "~/types";

export const handleItemError = async ({ item, data, destinations, logger }: { destinations?: PlaidWebhookDestination[]; logger: Logger, item: PlaidWebhookItem | OauthItem; data: ItemErrorWebhook | { error: { error_code: string }}; }) => {
  const { error_code } = data.error || { error_code: null };
  if ( error_code !== 'ITEM_LOGIN_REQUIRED' ) {
    logUnhandledEvent(`Unhandled Item Error Code - ${error_code}`);
    return;
  }

  const tableTypes = [ Table.Institutions ];
  const destinationFilter = (destination: PlaidWebhookDestination) => {
    const destinationItems = destination.accounts.map(account => account.plaidItemId);
    return destinationItems.includes(item.id) && destination.integration !== Integration.Coda;
  };
  
  const filteredDestinations = (destinations || []).filter(destinationFilter);
  logger.info("Filtered destinations", { count: filteredDestinations.length })
  if ( filteredDestinations.length > 0 ) {
    const trigger = SyncTrigger.ItemUpdate;
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
              shouldSyncInstitution: true
            }))
          }
        }
      }
    });
    logger.info("Sync created", { sync });

    await Promise.all(filteredDestinations.map(async destination => {
      const destinationLogger = logger.with({ destinationId: destination.id });
      const syncResultWhere = { syncId_plaidItemId_destinationId: { syncId: sync.id, destinationId: destination.id, plaidItemId: item.id }};
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

      const itemWithError = { ...item, error: error_code } as PlaidWebhookItem;
      const { records: institutionRecords, results: institutionResults } = await Destination.upsertItems({ items: [ itemWithError ] });
      destinationLogger.info("Upserted institution", { results: { added: institutionResults.added.length, updated: institutionResults.updated.length } });

      await Destination.updateItemsOnFinish({ items: [ itemWithError ], institutionRecords, timezone: (item as PlaidWebhookItem).user.timezone })

      return Promise.all([
        db.syncResult.update({
          where: syncResultWhere,
          data: {
            institutionsAdded: institutionResults.added.length,
            institutionsUpdated: institutionResults.updated.length
          }
        }).then(response => destinationLogger.info("Updated sync results", { response })),
  
        logSyncCompleted({ trigger, userId: item.userId, integration: destination.integration, destinationId: destination.id, syncId: sync.id, institutionsSynced: 1 }),
      ])
    }))
    .then(() => db.sync.update({ where: { id: sync.id }, data: { isSuccess: true, endedAt: new Date() }}))
  }

  const { userId, institution } = item;
  
  return Promise.all([
    db.plaidItem.update({ where: { id: item.id }, data: { error: error_code }})
      .then(() => logger.info("Updated item with new error")),

    logInstitutionErrorTriggered({ userId, institution: institution.name, itemId: item.id, error: error_code! }),

    trackInstitutionErrorTriggered({ userId, institution: institution.name, error: error_code!, itemId: item.id })

  ])
}