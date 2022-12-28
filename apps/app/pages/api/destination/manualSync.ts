import moment from "moment-timezone";
import { Products } from "plaid";
import * as _ from "lodash";

import { Integrations_Enum, GetPlaidItemsQuery, Plaid_Item_Sync_Logs_Update_Column, Destination_Sync_Logs_Update_Column } from "~/graphql/backend/sdk";
import { DestinationTableTypes, DestinationError, DestinationErrorCode } from "~/types/shared/models";
import { wrapper } from "~/utils/backend/apiWrapper";
import { graphql } from "~/graphql/backend";
import { getDestinationObject } from "~/utils/backend/getDestinationObject";
import * as plaid from "~/utils/backend/plaid";
import * as segment from "~/utils/backend/analytics";
import { getItemActiveAccounts } from "~/utils/backend/getItemActiveAccounts";
import { DestinationModel } from "~/types/backend/models";
import { ManualDestinationSyncPayload } from "~/types/shared/functions";

export default wrapper('client', async function handler({ req, user, logger }) {
  const { destinationId, startDate, endDate } = req.body as ManualDestinationSyncPayload;
  const destination = await graphql.GetDestination({ destinationId }).then(response => response.destination as DestinationModel);
  if ( !destination ) { return { status: 404, message: "Destination not found" }}

  const newSyncStartDate = moment.min(moment(startDate), moment(destination.sync_start_date)).format("YYYY-MM-DD");

  const accountsQuery = { is_closed: { _eq: false }, destination_connections: { destination_id: { _eq: destinationId }}};
  const plaidItems = await graphql.GetPlaidItems({ 
    where: { accounts: accountsQuery },
    accounts_where: accountsQuery,
    include_removed_transactions: true,
    date: newSyncStartDate
  }).then(response => response.plaidItems.filter(item => item.error !== 'ITEM_LOGIN_REQUIRED'))
  logger.info("Available Plaid Items", { count: plaidItems })
  // Can't use _neq in filter because field is nullable

  if ( destination.integration.id === Integrations_Enum.Coda || plaidItems.length === 0 ) {
    await graphql.UpdateDestination({ destinationId, _set: { sync_start_date: newSyncStartDate }});
    return { status: 200, message: { sync_start_date: newSyncStartDate } }
  }

  const trigger = startDate === destination.sync_start_date ? "refresh" : 'historical_sync';
  const syncLog = await graphql.InsertSyncLog({ sync_log: { trigger }}).then(response => response.sync_log!);
  logger.addContext({ syncLogId: syncLog.id });

  let hasUnhandledError = false;
  let success = true;
  let syncLogError: { error_code: 'internal_error' } | undefined
  let destinationLogError = undefined as DestinationError;

  const Destination = getDestinationObject({ userId: user.id, integrationId: destination.integration.id, logger, authentication: destination.authentication })!;
  await Destination.init();
  
  const tableTypes = getDestinationTableTypes({ destination });
  const destinationCheck = await Destination.validate({ tableTypes, tableConfigs: destination.table_configs });
  logger.info("Destination check complete", { destinationCheck });

  if ( !destinationCheck.isValid ) {
    Promise.all([
      logger.logDestinationErrorTriggered({
        destinationId: destination.id,
        error: destinationCheck.error!,
        userId: destination.user.id,
        syncLogId: syncLog.id
      }),
      segment.trackDestinationErrorTriggered({
        userId: destination.user.id,
        error: destinationCheck.error!,
        integration: destination.integration.id,
        destinationName: destination.name,
        destinationId: destination.id,
        trigger
      }),
    ])

    destinationLogError = destinationCheck.error || undefined;
    success = false;
  }

  if ( destinationCheck.isValid ) {
    ({ success, hasUnhandledError } = await Promise.all(plaidItems.map(async item => {
      const getItemActiveAccountsResponse = await getItemActiveAccounts(item, logger);
      logger.info("Retrieved item active accounts", { plaidItemId: item.id, response: getItemActiveAccountsResponse })
      if ( item.error === 'ITEM_LOGIN_REQUIRED' || getItemActiveAccountsResponse.hasAuthError ) {
        return graphql.InsertPlaidItemSyncLog({
          plaid_item_sync_log: {
            plaid_item_id: item.id,
            sync_log_id: syncLog.id,
            error: { error_code: 'ITEM_LOGIN_REQUIRED' }
          },
          update_columns: [ Plaid_Item_Sync_Logs_Update_Column.Error ]
        }).then(() => ({ success: false }));
      }
  
      const accountIds = getItemActiveAccountsResponse.accountIds.filter(accountId => destination.account_connections.map(ac => ac.account.id).includes(accountId));
      logger.info("Total account ids", { plaidItemId: item.id, count: accountIds.length })
      if ( accountIds.length === 0 ) { return ({ success: true })};
      
      await Destination.load({ tableTypes: [
        DestinationTableTypes.INSTITUTIONS, DestinationTableTypes.ACCOUNTS, DestinationTableTypes.TRANSACTIONS, DestinationTableTypes.CATEGORIES, 
        DestinationTableTypes.INVESTMENT_TRANSACTIONS, DestinationTableTypes.HOLDINGS, DestinationTableTypes.SECURITIES
      ], tableConfigs: destination.table_configs });
      const { accounts, transactions, categories, removedTransactions, holdings, investmentTransactions, securities } = await getPlaidData({ item, accountIds, tableTypes, startDate: newSyncStartDate, endDate })
      const results = await Destination.syncData({
        item,
        accounts,
        transactions,
        removedTransactions,
        holdings,
        investmentTransactions,
        securities,
        categories,
        timezone: destination.user.profile.timezone!,
        shouldOverrideTransactionName: destination.should_override_transaction_name
      });
      logger.info("Sync results", { results, plaidItemId: item.id })

      return graphql.InsertPlaidItemSyncLog({
        plaid_item_sync_log: {
          plaid_item_id: item.id,
          sync_log_id: syncLog.id,
          accounts: results.accounts,
          transactions: results.transactions,
          holdings: results.holdings,
          investment_transactions: results.investmentTransactions
        },
        update_columns: [ Plaid_Item_Sync_Logs_Update_Column.Accounts, Plaid_Item_Sync_Logs_Update_Column.Transactions, Plaid_Item_Sync_Logs_Update_Column.Holdings, Plaid_Item_Sync_Logs_Update_Column.InvestmentTransactions ]
      }).then(() => ({ success: true }));
    }))
    .then(response => ({ success: !response.find(r => !r.success), hasUnhandledError: false }))
    .catch(async error => {
      const errorData = error.response?.data;      
      await logger.error(error, { data: errorData })
      return { success: false, hasUnhandledError: true }
    }));
  }

  if ( hasUnhandledError ) { syncLogError = { error_code: 'internal_error'}}

  await Promise.all([
    graphql.UpdateSyncLog({
      sync_log_id: syncLog.id,
      _set: { is_success: success, ended_at: new Date(), error: syncLogError }
    }),
    graphql.InsertDestinationSyncLog({
      destination_sync_log: {
        destination_id: destination.id,
        sync_log_id: syncLog.id,
        error: destinationLogError
      },
      update_columns: [ Destination_Sync_Logs_Update_Column.Error ]
    }),
    logger.logSyncCompleted({
      userId: destination.user.id,
      trigger,
      isSuccess: success,
      integration: destination.integration.id,
      institutionsSynced: plaidItems.length,
      syncLogId: syncLog.id,
      destinationId: destination.id,
      error: destinationLogError?.errorCode
    })
  ]);

  if ( success ) {
    await graphql.UpdateDestination({ destinationId, _set: { sync_start_date: newSyncStartDate }})
  }

  if ( success ) {
    return { status: 200, message: { sync_start_date: newSyncStartDate, has_error: false }}
  } else {
    if ( syncLogError?.error_code === 'internal_error' || destinationLogError?.errorCode === DestinationErrorCode.UNKNOWN_ERROR ) {
      return { status: 500, message: "Internal Error" }
    } else {
      return { status: 200, message: { has_error: true }}
    }
  }
})

// Helper Functions
const getPlaidData = async ({ item, accountIds, tableTypes, startDate, endDate }: { item: GetPlaidItemsQuery['plaidItems'][0], accountIds: string[], tableTypes: DestinationTableTypes[], startDate: string; endDate: string }) => {
  const { accessToken } = item;
  const products = (item.billed_products || []).concat(item.available_products || []) as Products[];
  const accounts = await plaid.getAccounts({ accessToken, options: { account_ids: accountIds }}).then(response => response.data.accounts);
  const transactions = (tableTypes.includes(DestinationTableTypes.TRANSACTIONS) && products.includes('transactions' as Products))
    ? (await plaid.getAllTransactions({ accessToken, options: { account_ids: accountIds }, startDate, endDate }).then(response => response.transactions))
    : undefined;

  const categories = (tableTypes.includes(DestinationTableTypes.CATEGORIES) && products.includes('transactions' as Products)) 
    ? _.uniqBy(transactions?.filter(transaction => !!transaction.category_id && !!transaction.category)
      .filter(transaction => !!transaction.category_id && !!transaction.category)
      .map(transaction => ({ id: transaction.category_id!, name: transaction.category![transaction.category!.length - 1], category_group: transaction.category![0] })) || [], 'id')
    : undefined;
  
  const removedTransactions = (tableTypes.includes(DestinationTableTypes.TRANSACTIONS) && products.includes('transactions' as Products))
    ? item.removed_transactions?.map(rt => rt.transaction_id)
    : undefined;

  const { holdings, securities: holdingsSecurities } = (tableTypes.includes(DestinationTableTypes.HOLDINGS) && products.includes('investments' as Products)) 
    ? await plaid.getHoldings({ accessToken, options: { account_ids: accountIds } }).then(response => response.data) 
    : { holdings: undefined, securities: undefined };
  
  const { investmentTransactions, securities: investmentTransactionsSecurities } = (tableTypes.includes(DestinationTableTypes.INVESTMENT_TRANSACTIONS) && products.includes('investments' as Products)) 
    ? await plaid.getAllInvestmentTransactions({ accessToken, startDate, endDate: moment().format("YYYY-MM-DD"), options: { account_ids: accountIds }})
    : { investmentTransactions: undefined, securities: undefined }
  
    const securities = _.uniqBy((holdingsSecurities || []).concat(investmentTransactionsSecurities || []), 'security_id')

  return {
    accounts,
    transactions,
    categories,
    removedTransactions,
    holdings,
    securities,
    investmentTransactions
  }
}

const getDestinationTableTypes = ({ destination }: { destination: DestinationModel }) => {
  const transactionsTableConfig = destination.table_configs.transactions;
  const shouldSyncTransactions = (transactionsTableConfig && transactionsTableConfig.is_enabled) || (!transactionsTableConfig && destination.should_sync_transactions)
  const holdingsTableConfig = destination.table_configs.holdings;
  const shouldSyncHoldings = (holdingsTableConfig && holdingsTableConfig.is_enabled) || (!holdingsTableConfig && destination.should_sync_investments)
  const investmentTransactionsTableConfig = destination.table_configs.investment_transactions;
  const shouldSyncInvestmentTransactions = (investmentTransactionsTableConfig && investmentTransactionsTableConfig.is_enabled) || (!investmentTransactionsTableConfig && destination.should_sync_investments)
  const categoriesTableConfig = destination.table_configs.categories;
  const shouldSyncCategories = (categoriesTableConfig && categoriesTableConfig.is_enabled)

  let tableTypes = [DestinationTableTypes.ACCOUNTS, DestinationTableTypes.INSTITUTIONS];
  if ( shouldSyncTransactions ) { tableTypes = tableTypes.concat(DestinationTableTypes.TRANSACTIONS) }
  if ( shouldSyncHoldings ) { tableTypes = tableTypes.concat(DestinationTableTypes.HOLDINGS) }
  if ( shouldSyncInvestmentTransactions ) { tableTypes = tableTypes.concat(DestinationTableTypes.INVESTMENT_TRANSACTIONS) }
  if ( shouldSyncHoldings || shouldSyncInvestmentTransactions ) { tableTypes = tableTypes.concat(DestinationTableTypes.SECURITIES) }
  if ( shouldSyncCategories ) { tableTypes = tableTypes.concat(DestinationTableTypes.CATEGORIES)}

  return tableTypes;
}