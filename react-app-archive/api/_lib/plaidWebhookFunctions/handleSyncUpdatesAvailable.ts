import { SyncUpdatesAvailableWebhook, Transaction, RemovedTransaction } from "plaid";
import * as _ from "lodash";

import { getAccounts, transactionsSync } from "../plaid";
import { graphql } from "../graphql";
import { PlaidItemModel, DestinationModel } from "../types";
import { DestinationTableTypes, DestinationError } from "@finta/types";
import { getDestinationObject } from "../getDestinationObject";
import * as segment from "../segment";
import { Integrations_Enum, Destination_Sync_Logs_Update_Column } from "../graphql/sdk";
import { Sentry } from "../sentry";
import * as logsnag from "../logsnag";

export const handleSyncUpdatesAvailable = async ({ item, data, destinations, scope, asAdmin }: { item: PlaidItemModel; data: SyncUpdatesAvailableWebhook, destinations: DestinationModel[], scope: Sentry.Scope, asAdmin: boolean }) => {
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
  scope.setContext("Sync Log ID", syncLog.id);
  await logsnag.publish({ 
    channel: logsnag.LogSnagChannel.SYNCS, 
    icon: '🏁', 
    event: logsnag.LogSnagEvent.SYNC_STARTED, 
    tags: {
      [logsnag.LogSnagTags.USER_ID]: item.user.id,
      [logsnag.LogSnagTags.ITEM_ID]: item.id,
      [logsnag.LogSnagTags.TRIGGER]: trigger,
      [logsnag.LogSnagTags.SYNC_LOG_ID]: syncLog.id
    }
  })

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
      scope.setContext("Plaid Error", error as any);
      const errorCode = error.response?.data?.error_code;
      const tags = {
        [logsnag.LogSnagTags.ITEM_ID]: item.id,
        [logsnag.LogSnagTags.USER_ID]: item.user.id
      }
      if ( errorCode === 'TRANSACTIONS_LIMIT' ) {
        await logsnag.publish({ 
          channel: logsnag.LogSnagChannel.ERRORS,
          event: 'Hitting rate limit for Transactions Sync',
          notify: true,
          icon: '≐',
          tags
        })
      } else {
        await logsnag.logError({ operation: 'Transactions sync webhook', scope, error: new Error("Sync Updates Available Error"), tags })
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
        segment.track({
          userId: item.user.id,
          event: segment.Events.DESTINATION_ERROR_TRIGGERED,
          properties: { 
            ...destinationCheck.error, 
            integration: destination.integration.id, 
            destinationName: destination.name,
            destinationId: destination.id,
            trigger: 'transactions_update'
          }
        }),
        logsnag.publish({
          channel: logsnag.LogSnagChannel.SYNCS,
          event: logsnag.LogSnagEvent.DESTINATION_ERROR_TRIGGERED,
          description: JSON.stringify(destinationCheck.error),
          icon: '🗺',
          tags: {
            [logsnag.LogSnagTags.SYNC_LOG_ID]: syncLog.id,
            [logsnag.LogSnagTags.DESTINATION_ID]: destination.id,
            [logsnag.LogSnagTags.ERROR]: destinationCheck.error?.errorCode
          }
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
    await logsnag.logError({ error, scope, operation: "Plaid webhook", tags: { [logsnag.LogSnagTags.USER_ID]: scope.getUser()?.id }})
    return { success: false, hasUnhandledError: true }
  }));

  if ( hasUnhandledError ) { syncLogError = { error_code: 'internal_error'}}

  await logsnag.publish({
    channel: logsnag.LogSnagChannel.SYNCS,
    event: success ? logsnag.LogSnagEvent.SYNC_COMPLETED : logsnag.LogSnagEvent.SYNC_FAILED,
    description: `${filteredDestinations.length} destination(s) synced`,
    icon: success ? '☑️' : '⏹',
    notify: hasUnhandledError,
    tags: {
      [logsnag.LogSnagTags.USER_ID]: item.user.id,
      [logsnag.LogSnagTags.IS_SUCCESS]: success,
      [logsnag.LogSnagTags.ITEM_ID]: item.id,
      [logsnag.LogSnagTags.SYNC_LOG_ID]: syncLog.id
    }
  })

  await graphql.UpdateSyncLog({
    sync_log_id: syncLog.id,
    _set: { is_success: success, ended_at: new Date(), error: syncLogError }
  })
  if ( success ) {
    await graphql.UpdatePlaidItem({
      plaid_item_id: item.id,
      _set: {
        is_initial_update_complete: initial_update_complete,
        is_historical_update_complete: historical_update_complete,
        plaid_sync_cursor: cursor,
        synced_at: new Date()
      }
    })
  }
}