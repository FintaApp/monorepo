import { getDestinationObject } from "../getDestinationObject";
import { graphql } from "../graphql";
import { Integrations_Enum, Destination_Sync_Logs_Update_Column } from "../graphql/sdk";
import { getHoldings } from "../plaid";
import * as segment from "../segment";
import { Sentry } from "../sentry";
import * as logsnag from "../logsnag";

import { PlaidItemModel, DestinationModel } from "../types";
import { DestinationError, DestinationTableTypes } from "@finta/types";

export const handleHoldingsDefaultUpdate = async ({ item, destinations, scope, asAdmin }: { item: PlaidItemModel; destinations: DestinationModel[], scope: Sentry.Scope, asAdmin: boolean }) => {
  const destinationFilter = (destination: DestinationModel) => {
    const destinationItems = destination.account_connections.map(ac => ac.account.plaid_item_id);
    const holdingsTableConfig = destination.table_configs.holdings; 
    return ((holdingsTableConfig && holdingsTableConfig.is_enabled) || (!holdingsTableConfig && destination.should_sync_investments)) && destinationItems.includes(item.id) && destination.integration.id !== Integrations_Enum.Coda;
  };
  const { accessToken } = item;

  const filteredDestinations = destinations.filter(destinationFilter);
  if ( filteredDestinations.length === 0 ) { return true; }

  const { holdings, accounts, securities } = await getHoldings({ accessToken }).then(response => response.data);

  const trigger = 'holdings_update'
  const syncLog = await graphql.InsertSyncLog({ sync_log: { trigger, metadata: { asAdmin }, plaid_item_sync_logs: { data: [{ plaid_item_id: item.id }]}
  }}).then(response => response.sync_log!); 
  scope.setContext("Sync Log ID", syncLog.id)

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
  let syncLogError: { error_code: 'internal_error' } | undefined
  let destinationLogError = undefined as DestinationError;

  ({ success, hasUnhandledError } = await Promise.all(filteredDestinations.map(async destination => {
    const destinationAccounts = destination.account_connections.map(ac => ac.account.id);

    const Destination = getDestinationObject({ destination })!;
    await Destination.init();
    const destinationCheck = await Destination.validate({ tableTypes: [DestinationTableTypes.ACCOUNTS, DestinationTableTypes.INSTITUTIONS, DestinationTableTypes.HOLDINGS, DestinationTableTypes.SECURITIES ] });

    if ( destinationCheck.isValid ) {
      await Destination.load();
      const results = await Destination.syncData({
        item,
        accounts: accounts.filter(account => destinationAccounts.includes(account.account_id)),
        holdings: holdings.filter(holding => destinationAccounts.includes(holding.account_id)),
        securities
      })

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
            trigger
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
  .then(response => ({ success: !response.find(r => !r.success), hasUnhandledError: false }))
  .catch(async error => {
    await logsnag.logError({ error, scope, operation: "Plaid webhook", tags: { [logsnag.LogSnagTags.USER_ID]: scope.getUser()?.id }})
    return { success: false, hasUnhandledError: true }
  }));

  if ( hasUnhandledError ) { syncLogError = { error_code: 'internal_error'} }

  await graphql.UpdateSyncLog({
    sync_log_id: syncLog.id,
    _set: { is_success: success, ended_at: new Date(), error: syncLogError }
  })

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

  if ( success ) {
    await graphql.UpdatePlaidItem({
      plaid_item_id: item.id,
      _set: { synced_at: new Date() }
    })
  }
}