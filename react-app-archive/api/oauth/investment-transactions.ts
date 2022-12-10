
import moment from "moment-timezone";
import { InvestmentsTransactionsGetRequestOptions } from "plaid";

import { functionWrapper, formatter, plaid, Sentry, graphql, getItemActiveAccounts, logsnag } from "../_lib";
import { handlePlaidError, getOauthPlaidItems } from "./_helpers";
import { OauthFunctionResponse, ErrorResponseMessages, CustomRequest } from "../_lib/types";
import { OauthInvestmentTransaction, OauthGetInvestmentTransactionsResponse, GetTransactionsNextContinuation } from "@finta/types";

export default functionWrapper.oauth(async (req: CustomRequest<GetTransactionsNextContinuation>, destination, plaidEnv, asAdmin) => {
  const transaction = Sentry.startTransaction({ op: "oauth function", name: "Get investment transactions" });
  const scope = new Sentry.Scope();

  const body = req.body;
  const { user } = destination;
  scope.setUser({ id: user.id, email: user.email });
  scope.setContext("Destination ID", destination.id);
  scope.setContext("Request Body", body);

  const trigger = 'destination'
  const syncLog = body.data?.syncLogId ? { id: body.data.syncLogId } : (await graphql.InsertSyncLog({ sync_log: { 
    trigger,
    destination_sync_logs: { data: [{ destination_id: destination.id }]},
    metadata: { 'target_table': 'investment_transactions', asAdmin }
  }}).then(response => response.sync_log!));
  scope.setContext("Sync Log ID", syncLog.id);
  await logsnag.publish({ 
    channel: logsnag.LogSnagChannel.SYNCS, 
    icon: '🏁', 
    event: logsnag.LogSnagEvent.SYNC_STARTED, 
    tags: {
      [logsnag.LogSnagTags.USER_ID]: destination.user.id,
      [logsnag.LogSnagTags.DESTINATION_ID]: destination.id,
      [logsnag.LogSnagTags.INTEGRATION]: destination.integration.id,
      [logsnag.LogSnagTags.TRIGGER]: trigger,
      [logsnag.LogSnagTags.SYNC_LOG_ID]: syncLog.id
    }
  })

  const investmentTransactionsTableConfig = destination.table_configs.investment_transactions;
  const shouldSyncInvestmentTransactions = (investmentTransactionsTableConfig && investmentTransactionsTableConfig.is_enabled) || (!investmentTransactionsTableConfig && destination.should_sync_investments)
  if ( !shouldSyncInvestmentTransactions ) {
    await graphql.UpdateSyncLog({
      sync_log_id: syncLog.id,
      _set: {
        error: { error_code: 'investment_transactions_disabled' },
        is_success: false,
        ended_at: new Date()
      }
    });
    return { status: 200, message: { investmentTransactions: [] }}
  }

  const { plaid_items, error_count } = await getOauthPlaidItems(destination.id, syncLog.id);
  if ( error_count > 0 ) {
    transaction.finish();
    return { status: 428, message: ErrorResponseMessages.HAS_ERROR_ITEM}
  };

  const endDate = moment().format("YYYY-MM-DD");
  const startDate = destination.sync_start_date;
  const paginationByItem = body.data?.paginationByItem || [];

  return Promise.all(plaid_items.map(async item => {
    const pagination = paginationByItem.find((pbi: any) => pbi.itemId === item.id) || { hasMore: true, totalTransactions: 0 };
    const { hasMore, totalTransactions: previousTotalTransactions } = pagination;
    const getItemActiveAccountsResponse = await getItemActiveAccounts(item, plaidEnv);
    if ( getItemActiveAccountsResponse.hasAuthError ) { return ({ investmentTransactions: [] as OauthInvestmentTransaction[], hasMore: false, totalInvestmentTransactions: previousTotalTransactions, plaidAccountIds: [], hasAuthError: true, itemId: item.id }) };
    const { accountIds: plaidAccountIds } = getItemActiveAccountsResponse;
    const { accessToken, billed_products = [], available_products = [], accounts } = item;
    if ( plaidAccountIds.length === 0) { return ({ investmentTransactions: [] as OauthInvestmentTransaction[], hasMore: false, totalInvestmentTransactions: previousTotalTransactions, plaidAccountIds, hasAuthError: false, itemId: item.id }) }

    const products = billed_products.concat(available_products) as string[];
    if ( !products.includes('investments') || !hasMore ) {
      return { hasAuthError: false, investmentTransactions: [], hasMore: false, totalInvestmentTransactions: previousTotalTransactions, itemId: item.id, plaidAccountIds }
    }
    
    const options = { account_ids: plaidAccountIds, offset: previousTotalTransactions} as InvestmentsTransactionsGetRequestOptions;

    const { investment_transactions, total_investment_transactions, securities, hasAuthError } = await plaid.getInvestmentTransactions({ accessToken, startDate, endDate, options })
    .then(response => ({ ...response.data, hasAuthError: false }))
    .catch(async error => {
      const errorData = error.response.data;
      scope.setContext("Plaid error", errorData);
      const { hasAuthError } = await handlePlaidError({ error: errorData, item });
      if ( !hasAuthError ) { 
        await logsnag.logError({ operation: "Get investment transactions", error, scope, tags: {[logsnag.LogSnagTags.USER_ID]: user.id } })
      };
      return ({ investment_transactions: [], total_investment_transactions: 0, hasAuthError, securities: [] })
    });

    const formattedInvestmentTransactions = investment_transactions.map(investmentTransaction => {
      const security = securities.find(sec => sec.security_id === investmentTransaction.security_id);
      return formatter.coda.investmentTransaction({ investmentTransaction, security })
    });

    const newTotalInvestmentTransactions = previousTotalTransactions + formattedInvestmentTransactions.length;
    const newHasMore = newTotalInvestmentTransactions < total_investment_transactions;

    return {
      hasAuthError,
      investmentTransactions: formattedInvestmentTransactions,
      hasMore: newHasMore,
      totalInvestmentTransactions: newTotalInvestmentTransactions,
      itemId: item.id,
      plaidAccountIds
    }
  }))
  .then(async responses => {
    transaction.finish();

    if ( !!responses.find(response => response.hasAuthError)) { return { status: 428, message: ErrorResponseMessages.HAS_ERROR_ITEM } }

    const shouldContinue = !!responses.find(response => response.hasMore );
    const nextContinuation = shouldContinue ? {
      data: {
        syncLogId: syncLog.id,
        paginationByItem: responses.map(response => ({
          itemId: response.itemId,
          hasMore: response.hasMore,
          totalTransactions: response.totalInvestmentTransactions
        }))
      }
      } : undefined;

    if ( !shouldContinue ) {
      await Promise.all([
        graphql.UpdateSyncLog({
          sync_log_id: syncLog.id,
          _set: {
            is_success: true,
            ended_at: new Date()
          }
        }),
        logsnag.publish({
          channel: logsnag.LogSnagChannel.SYNCS,
          event: logsnag.LogSnagEvent.SYNC_COMPLETED,
          description: `${plaid_items.length} institutions(s) synced\nTarget table: investment transactions`,
          icon: '☑️',
          tags: {
            [logsnag.LogSnagTags.USER_ID]: destination.user.id,
            [logsnag.LogSnagTags.IS_SUCCESS]: true,
            [logsnag.LogSnagTags.DESTINATION_ID]: destination.id,
            [logsnag.LogSnagTags.TRIGGER]: trigger,
            [logsnag.LogSnagTags.SYNC_LOG_ID]: syncLog.id
          }
        }),
        graphql.InsertPlaidItemSyncLogs({
          plaid_item_sync_logs: responses.map(response => ({
            plaid_item_id: response.itemId,
            accounts: {
              added: response.plaidAccountIds,
              updated: []
            },
            sync_log_id: syncLog.id,
            investment_transactions: {
              added: response.totalInvestmentTransactions,
              updated: 0,
              removed: 0
            }
          }))
        })
      ])
    }

    return { status: 200, message: {
      investmentTransactions: responses.reduce((all, response) => all.concat(response.investmentTransactions), [] as OauthInvestmentTransaction[]),
      nextContinuation
    }} as OauthFunctionResponse<OauthGetInvestmentTransactionsResponse>
  })
})