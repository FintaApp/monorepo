import { SyncUpdatesAvailableWebhook, Transaction, RemovedTransaction } from "plaid";
import * as _ from "lodash";

import { getAccounts, transactionsSync } from "../plaid";
import { graphql } from "~/graphql/backend";
import { PlaidItemModel, DestinationModel } from "~/types/backend/models";
import { DestinationError, DestinationTableTypes } from "~/types/shared/models";
import { getDestinationObject } from "../getDestinationObject";
import * as segment from "~/utils/backend/analytics";
import { Integrations_Enum, Destination_Sync_Logs_Update_Column } from "~/graphql/backend/sdk";
import { Logger } from "../logger";

export const handleSyncUpdatesAvailable = async ({ item, data, destinations, logger, asAdmin }: { item: PlaidItemModel; data: SyncUpdatesAvailableWebhook, destinations: DestinationModel[], logger: Logger, asAdmin: boolean }) => {
  const destinationFilter = (destination: DestinationModel) => {
    const destinationItems = destination.account_connections.map(ac => ac.account.plaid_item_id);
    const transactionsTableConfig = destination.table_configs.transactions; 
    return ((transactionsTableConfig && transactionsTableConfig.is_enabled) || (!transactionsTableConfig && destination.should_sync_transactions)) && destinationItems.includes(item.id) && destination.integration.id !== Integrations_Enum.Coda;
  };
  const { historical_update_complete, initial_update_complete } = data;
  const { accessToken, plaid_sync_cursor } = item;

  const filteredDestinations = destinations.filter(destinationFilter);
  if ( filteredDestinations.length === 0 ) { return true; }

  let cursor = plaid_sync_cursor || undefined;
  let added: Array<Transaction> = [];
  let modified: Array<Transaction> = [];
  let removed: Array<RemovedTransaction> = [];
  let hasMore = true;

  const trigger = 'transactions_update';
  const syncLog = await graphql.InsertSyncLog({ sync_log: { trigger, metadata: { asAdmin }, plaid_item_sync_logs: { data: [{ plaid_item_id: item.id }]}
  }}).then(response => response.sync_log!);
  logger.addContext({ syncLogId: syncLog.id });

  let hasUnhandledError = false;
  let success = true;
  let syncLogError: {
    error_code: 'internal_error'
  } | undefined
  let destinationLogError = undefined as DestinationError;

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
        await logger.error(new Error("Sync Updates Available Error"), { errorCode })
      }
      hasMore = false
    }
  }

  const transactions = added.concat(modified);
  const categories = _.uniqBy(transactions
    .filter(transaction => !!transaction.category_id && !!transaction.category)
    .map(transaction => ({ id: transaction.category_id!, name: transaction.category![transaction.category!.length -1], category_group: transaction.category![0] }))
  , 'id')
  const accounts = await getAccounts({ accessToken }).then(response => response.data.accounts);
  
  ({ success, hasUnhandledError } = await Promise.all(filteredDestinations.map(async destination => {
    const destinationAccounts = destination.account_connections.map(ac => ac.account.id);

    const Destination = getDestinationObject({ destination })!;
    await Destination.init();
    const destinationCheck = await Destination.validate({ tableTypes: [DestinationTableTypes.ACCOUNTS, DestinationTableTypes.INSTITUTIONS, DestinationTableTypes.TRANSACTIONS] });

    if ( destinationCheck.isValid ) {
      await Destination.load();
      const results = await Destination.syncData({
        item,
        accounts: accounts.filter(account => destinationAccounts.includes(account.account_id)),
        transactions: transactions.filter(transaction => destinationAccounts.includes(transaction.account_id) && transaction.date >= destination.sync_start_date),
        removedTransactions: removed as string[],
        categories
      });

      return graphql.InsertDestinationSyncLog({
        destination_sync_log: {
          destination_id: destination.id,
          sync_log_id: syncLog.id,
          accounts: results.accounts,
          transactions: results.transactions,
          holdings: results.holdings,
          investment_transactions: results.investmentTransactions
        },
        update_columns: [ Destination_Sync_Logs_Update_Column.Accounts, Destination_Sync_Logs_Update_Column.Transactions, Destination_Sync_Logs_Update_Column.Holdings, Destination_Sync_Logs_Update_Column.InvestmentTransactions ]
      }).then(() => ({ success: true }));
    } else {
      destinationLogError = destinationCheck.error || undefined;
      return Promise.all([
        segment.trackDestinationErrorTriggered({
          userId: item.user.id,
          error: destinationCheck.error,
          integration: destination.integration.id,
          destinationName: destination.name,
          destinationId: destination.id,
          trigger: 'transactions_update'
        }),
        logger.logDestinationErrorTriggered({
          userId: item.user.id,
          syncLogId: syncLog.id,
          destinationId: destination.id,
          error: destinationCheck.error
        }),
        graphql.InsertDestinationSyncLog({
        destination_sync_log: {
          destination_id: destination.id,
          sync_log_id: syncLog.id,
          error: destinationLogError
        },
        update_columns: [ Destination_Sync_Logs_Update_Column.Accounts, Destination_Sync_Logs_Update_Column.Transactions, Destination_Sync_Logs_Update_Column.Holdings, Destination_Sync_Logs_Update_Column.InvestmentTransactions ]
      })
    ]).then(() => ({ success: false }))
    }
  }))
  .then(response => ({ success: !response.find(r => !r?.success), hasUnhandledError: false }))
  .catch(async error => {
    await logger.error(error);
    return { success: false, hasUnhandledError: true }
  }));

  if ( hasUnhandledError ) { syncLogError = { error_code: 'internal_error'}}

  await logger.logSyncCompleted({
    userId: item.user.id,
    isSuccess: success,
    itemId: item.id,
    syncLogId: syncLog.id,
    destinationsSynced: filteredDestinations.length,
    shouldNotify: hasUnhandledError
  })

  await graphql.UpdateSyncLog({
    sync_log_id: syncLog.id,
    _set: { is_success: success, ended_at: new Date(), error: syncLogError }
  })
  if ( success ) {
    await graphql.UpdatePlaidItem({
      plaidItemId: item.id,
      _set: {
        is_initial_update_complete: initial_update_complete,
        is_historical_update_complete: historical_update_complete,
        plaid_sync_cursor: cursor,
        synced_at: new Date()
      }
    })
  }
}