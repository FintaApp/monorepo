import { SyncUpdatesAvailableWebhook, Transaction, RemovedTransaction } from "plaid";
import * as _ from "lodash";
import { Logger } from "next-axiom";

import { getDestinationObject } from "../integrations/getDestinationObject";
import { db } from "../db";
import { transactionsSync, getAccounts } from "../plaid";
import {  Table, Integration, SyncTrigger } from "@prisma/client";
import { logDestinationErrorTriggered, logSyncCompleted, logUnhandledEvent } from "../logsnag";
import { trackDestinationErrorTriggered, trackSyncCompleted } from "../analytics";
import { PlaidWebhookDestination, PlaidWebhookItem } from "~/types";

export const handleSyncUpdatesAvailable = async ({ item, data, destinations, logger }: { item: PlaidWebhookItem; data: SyncUpdatesAvailableWebhook, destinations: PlaidWebhookDestination[], logger: Logger, asAdmin: boolean }) => {
  const tableTypes = [ Table.Institutions, Table.Accounts, Table.Holdings, Table.Securities ];
  const { historical_update_complete, initial_update_complete } = data;

  const destinationFilter = (destination: PlaidWebhookDestination) => {
    const destinationItems = destination.accounts.map(account => account.plaidItemId);
    const transactionsTableConfig = destination.tableConfigs.find(config => config.table === Table.Transactions); 
    return transactionsTableConfig?.isEnabled && destinationItems.includes(item.id) && destination.integration !== Integration.Coda;
  };
  const { accessToken, plaidSyncCursor } = item;

  const filteredDestinations = destinations.filter(destinationFilter);
  if ( filteredDestinations.length === 0 ) { return true; }

  let cursor = plaidSyncCursor || undefined;
  let added: Array<Transaction> = [];
  let modified: Array<Transaction> = [];
  let removed: Array<RemovedTransaction> = [];
  let hasMore = true;

  const trigger = SyncTrigger.TransactionsUpdate;
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
            shouldSyncTransactions: true,
            shouldSyncCategories: !!destination.tableConfigs.find(config => config.table === Table.Categories)?.isEnabled
          }))
        }
      }
    }
  });
  logger.info("Sync created", { sync })

  while ( hasMore ) {
    try {
      const data = await transactionsSync({ accessToken, cursor }).then(response => response.data);
      added = added.concat(data.added);
      modified = modified.concat(data.modified);
      removed = removed.concat(data.removed);

      hasMore = data.has_more;
      cursor = data.next_cursor;
    } catch ( error ) {
      const errorCode = error.response?.data?.error_code;
      if ( errorCode !== 'TRANSACTIONS_LIMIT' ) {
        logUnhandledEvent(`Transactions sync error code = ${errorCode}`)
      }
      hasMore = false
    }
  }

  const transactions = added.concat(modified);
  const categories = _.uniqBy(transactions
    .filter(transaction => !!transaction.category_id && !!transaction.category)
    .map(transaction => ({ id: transaction.category_id!, name: transaction.category![transaction.category!.length -1]!, category_group: transaction.category![0]! }))
  , 'id')
  const accounts = await getAccounts({ accessToken }).then(response => response.data.accounts);

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
    const destinationTransactions = transactions.filter(transaction => destinationAccountIds.includes(transaction.account_id));
    const destinationCategories = categories.filter(category => destinationTransactions.map(transaction => transaction.category_id).includes(category.id));

    const { record: institutionRecord, isNew: isInstitutionRecordNew } = await Destination.upsertItem({ item });
    destinationLogger.info("Upserted institution", { isNew: isInstitutionRecordNew })

    const [
      { records: accountRecords, results: accountResults },
      { records: categoryRecords, results: categoryResults }
    ] = await Promise.all([
      Destination.upsertAccounts({ accounts: destinationAccounts, item, institutionRecord })
        .then(response => { destinationLogger.info("Upserted accounts", { results: response.results }); return response }),

      Destination.upsertCategories({ categories: destinationCategories })
        .then(response => { destinationLogger.info("Upserted categories", { results: response.results }); return response })
    ]);

    const transactionsResults = await Destination.upsertTransactions({ transactions: destinationTransactions, accountRecords, categoryRecords });

    const removedTransactionsResults = await Destination.removeTransactions({ removedTransactionIds: removed as string[] });

    await Destination.updateItemOnFinish({ item, institutionRecord, timezone: item.user.timezone });
    
    await Promise.all([
      db.syncResult.update({
        where: syncResultWhere,
        data: {
          institutionsAdded: isInstitutionRecordNew ? 1 : 0,
          institutionsUpdated: isInstitutionRecordNew ? 0 : 1,
          accountsAdded: accountResults.added,
          accountsUpdated: accountResults.updated,
          categoriesAdded: categoryResults.added,
          transactionsAdded: transactionsResults.added,
          transactionsUpdated: transactionsResults.updated,
          transactionsRemoved: removedTransactionsResults.removed
        }
      }).then(response => destinationLogger.info("Updated sync results", { response })),

      logSyncCompleted({ trigger, userId: item.userId, integration: destination.integration, destinationId: destination.id, syncId: sync.id, institutionsSynced: 1 }),

      trackSyncCompleted({ userId: item.userId, trigger, integration: destination.integration, destinationId: destination.id, institutionsSynced: 1 })
    ])
  }))
  .then(() => {
    const endedAt = new Date();
    return Promise.all([
      db.plaidItem.update({ where: { id: item.id }, data: { lastSyncedAt: endedAt, isInitialUpdateComplete: initial_update_complete, isHistoricalUpdateComplete: historical_update_complete, plaidSyncCursor: cursor }})
        .then(() => logger.info("Updated item's last synced at", { lastSyncedAt: endedAt })),

      db.sync.update({ where: { id: sync.id }, data: { isSuccess: true, endedAt: endedAt }})
        .then(response => logger.info("Updated sync record", { response }))
    ])
  })
}