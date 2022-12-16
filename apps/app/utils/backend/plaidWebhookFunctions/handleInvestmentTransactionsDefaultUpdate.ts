import moment from "moment-timezone";

import { getDestinationObject } from "../getDestinationObject";
import { graphql } from "~/graphql/backend";
import { Integrations_Enum, Destination_Sync_Logs_Update_Column } from "~/graphql/backend/sdk";
import { getAllInvestmentTransactions } from "../plaid";
import * as segment from "~/utils/backend/analytics";
import { PlaidItemModel, DestinationModel } from "~/types/backend/models";
import { DestinationError, DestinationErrorCode, DestinationTableTypes } from "~/types/shared/models";
import { Logger } from "../logger";

export const handleInvestmentTransactionsDefaultUpdate = async ({ item, destinations, asAdmin, logger }: { item: PlaidItemModel; destinations: DestinationModel[]; logger: Logger, asAdmin: boolean  }) => {
  const destinationFilter = (destination: DestinationModel) => {
    const destinationItems = destination.account_connections.map(ac => ac.account.plaid_item_id);
    const investmentTransactionsTableConfig = destination.table_configs.investment_transactions; 
    return ((investmentTransactionsTableConfig && investmentTransactionsTableConfig.is_enabled) || (!investmentTransactionsTableConfig && destination.should_sync_investments)) && destinationItems.includes(item.id) && destination.integration.id !== Integrations_Enum.Coda;
  };
  const { accessToken } = item;

  const filteredDestinations = destinations.filter(destinationFilter);
  if ( filteredDestinations.length === 0 ) { return true; }

  const { accounts, investmentTransactions, securities } = await getAllInvestmentTransactions({ accessToken, startDate: moment().subtract(14, 'days').format("YYYY-MM-DD"), endDate: moment().format("YYYY-MM-DD"), options: {}});
  
  const trigger = 'investment_transactions_update'
  const syncLog = await graphql.InsertSyncLog({ sync_log: { trigger, metadata: { asAdmin }, plaid_item_sync_logs: { data: [{ plaid_item_id: item.id }]}
  }}).then(response => response.sync_log!); 
  logger.addContext({ syncLogId: syncLog.id });


  let hasUnhandledError = false;
  let success = true;
  let syncLogError: {
    error_code: 'internal_error'
  } | undefined
  let destinationLogError = undefined as DestinationError;

  ({ success, hasUnhandledError } = await Promise.all(filteredDestinations.map(async destination => {
    const destinationAccounts = destination.account_connections.map(ac => ac.account.id);

    const Destination = getDestinationObject({ userId: destination.user.id, integrationId: destination.integration.id, authentication: destination.authentication, logger })!;
    await Destination.init();
    
    const destinationCheck = await Destination.validate({ tableConfigs: destination.table_configs, tableTypes: [DestinationTableTypes.ACCOUNTS, DestinationTableTypes.INSTITUTIONS, DestinationTableTypes.INVESTMENT_TRANSACTIONS, DestinationTableTypes.SECURITIES ] });

    if ( destinationCheck.isValid ) {
      await Destination.load({ tableTypes: [
        DestinationTableTypes.INSTITUTIONS, DestinationTableTypes.ACCOUNTS, DestinationTableTypes.INVESTMENT_TRANSACTIONS, DestinationTableTypes.SECURITIES
      ], tableConfigs: destination.table_configs });
      const results = await Destination.syncData({
        item,
        accounts: accounts.filter(account => destinationAccounts.includes(account.account_id)),
        investmentTransactions: investmentTransactions.filter(transaction => destinationAccounts.includes(transaction.account_id) && transaction.date >= destination.sync_start_date),
        securities,
        timezone: destination.user.profile.timezone
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
      return Promise.all([
        segment.trackDestinationErrorTriggered({
          userId: item.user.id,
          error: destinationCheck.error,
          integration: destination.integration.id,
          destinationName: destination.name,
          destinationId: destination.id,
          trigger: 'investment_transactions_update'
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
      })]).then(() => ({ success: false }))
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