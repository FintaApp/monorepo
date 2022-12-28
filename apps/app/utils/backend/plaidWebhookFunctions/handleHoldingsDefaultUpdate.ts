import { getDestinationObject } from "../getDestinationObject";
import { graphql } from "~/graphql/backend";
import { Integrations_Enum, Destination_Sync_Logs_Update_Column } from "~/graphql/backend/sdk";
import { getHoldings } from "../plaid";
import * as segment from "~/utils/backend/analytics";

import { PlaidItemModel, DestinationModel } from "~/types/backend/models";
import { DestinationError, DestinationTableTypes } from "~/types/shared/models";
import { Logger } from "../logger";

export const handleHoldingsDefaultUpdate = async ({ item, destinations, asAdmin, logger }: { item: PlaidItemModel; destinations: DestinationModel[], asAdmin: boolean; logger: Logger }) => {
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
  logger.addContext({ syncLogId: syncLog.id });

  let hasUnhandledError = false;
  let success = true;
  let syncLogError: { error_code: 'internal_error' } | undefined
  let destinationLogError = undefined as DestinationError;

  ({ success, hasUnhandledError } = await Promise.all(filteredDestinations.map(async destination => {
    const destinationAccounts = destination.account_connections.map(ac => ac.account.id);

    const Destination = getDestinationObject({ userId: destination.user.id, integrationId: destination.integration.id, authentication: destination.authentication, logger })!;
    await Destination.init();
    
    const destinationCheck = await Destination.validate({ tableConfigs: destination.table_configs, tableTypes: [DestinationTableTypes.ACCOUNTS, DestinationTableTypes.INSTITUTIONS, DestinationTableTypes.HOLDINGS, DestinationTableTypes.SECURITIES ] });

    if ( destinationCheck.isValid ) {
      await Destination.load({ tableTypes: [
        DestinationTableTypes.INSTITUTIONS, DestinationTableTypes.ACCOUNTS, DestinationTableTypes.HOLDINGS, DestinationTableTypes.SECURITIES
      ], tableConfigs: destination.table_configs });
      const results = await Destination.syncData({
        item,
        accounts: accounts.filter(account => destinationAccounts.includes(account.account_id)),
        holdings: holdings.filter(holding => destinationAccounts.includes(holding.account_id)),
        securities,
        timezone: destination.user.profile.timezone!
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
        segment.trackDestinationErrorTriggered({
          userId: item.user.id,
          error: destinationCheck.error!,
          integration: destination.integration.id,
          destinationName: destination.name,
          destinationId: destination.id,
          trigger
        }),
        logger.logDestinationErrorTriggered({
          userId: item.user.id,
          syncLogId: syncLog.id,
          destinationId: destination.id,
          error: destinationCheck.error!
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
    await logger.error(error);
    return { success: false, hasUnhandledError: true }
  }));

  if ( hasUnhandledError ) { syncLogError = { error_code: 'internal_error'} }

  await graphql.UpdateSyncLog({
    sync_log_id: syncLog.id,
    _set: { is_success: success, ended_at: new Date(), error: syncLogError }
  })

  if ( success ) {
    await graphql.UpdatePlaidItem({
      plaidItemId: item.id,
      _set: { synced_at: new Date() }
    })
  }
}