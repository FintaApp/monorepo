import moment from "moment-timezone";
import { TransactionsGetRequestOptions, Transaction } from "plaid";

import { functionWrapper, formatter, plaid, Sentry, graphql, getItemActiveAccounts, logsnag } from "../_lib";
import { handlePlaidError, getOauthPlaidItems } from "./_helpers";
import { OauthFunctionResponse, ErrorResponseMessages, CustomRequest } from "../_lib/types";
import { OauthTransaction, OauthGetTransactionsResponse, GetTransactionsNextContinuation } from "@finta/types";

export default functionWrapper.oauth(async (req: CustomRequest<GetTransactionsNextContinuation>, destination, plaidEnv, asAdmin) => {
  const transaction = Sentry.startTransaction({ op: "oauth function", name: "Get transactions" });
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
    metadata: { 'target_table': 'transactions', asAdmin }
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

  const transactionsTableConfig = destination.table_configs.transactions;
  const shouldSyncTransactions = (transactionsTableConfig && transactionsTableConfig.is_enabled) || (!transactionsTableConfig && destination.should_sync_transactions)
  if ( !shouldSyncTransactions ) {
    await graphql.UpdateSyncLog({
      sync_log_id: syncLog.id,
      _set: {
        error: { error_code: 'transactions_disabled' },
        is_success: false,
        ended_at: new Date()
      }
    });
    return { status: 200, message: { transactions: [] }}
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
    if ( getItemActiveAccountsResponse.hasAuthError ) { return ({ transactions: [] as OauthTransaction[], hasMore: false, totalTransactions: previousTotalTransactions, plaidAccountIds: [], hasAuthError: true, itemId: item.id })};
    const { accountIds: plaidAccountIds } = getItemActiveAccountsResponse;
    const { accessToken, billed_products = [], available_products = [] } = item;
    if ( plaidAccountIds.length === 0) { return ({ transactions: [] as OauthTransaction[], hasMore: false, totalTransactions: previousTotalTransactions, plaidAccountIds, hasAuthError: false, itemId: item.id }) }

    const products = billed_products.concat(available_products) as string[];
    if ( !products.includes('transactions') || !hasMore ) {
      return { hasAuthError: false, transactions: [] as OauthTransaction[], hasMore: false, totalTransactions: previousTotalTransactions, plaidAccountIds, itemId: item.id }
    }

    const options = { account_ids: plaidAccountIds, offset: previousTotalTransactions } as TransactionsGetRequestOptions;

    const { transactions, total_transactions, hasAuthError } = await plaid.getTransactions({ accessToken, startDate, endDate, options })
    .then(response => ({ ...response.data, hasAuthError: false }))
    .catch(async error => {
      const errorData = error.response.data;
      scope.setContext("Plaid error", errorData);
      const { hasAuthError } = await handlePlaidError({ error: errorData, item, syncLogId: syncLog.id });
      if ( !hasAuthError ) { 
        await logsnag.logError({ operation: "Get transactions", error, scope, tags: {[logsnag.LogSnagTags.USER_ID]: user.id } })
      };
      return ({ transactions: [], total_transactions: 0, hasAuthError })
    })

    const formattedTransactions = transactions.map((transaction: Transaction) => formatter.coda.transaction({ transaction }));
    const newTotalTransactions = previousTotalTransactions + formattedTransactions.length;
    const newHasMore = newTotalTransactions < total_transactions;

    return {
      hasAuthError,
      transactions: formattedTransactions,
      hasMore: newHasMore,
      totalTransactions: newTotalTransactions,
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
          totalTransactions: response.totalTransactions
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
          description: `${plaid_items.length} institutions(s) synced\nTarget table: transactions`,
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
            transactions: {
              added: response.totalTransactions,
              updated: 0,
              removed: 0
            }
          }))
        })
      ])
    }
    
    return { status: 200, message: {
      transactions: responses.reduce((all, response) => all.concat(response.transactions), [] as OauthTransaction[]),
      nextContinuation
    }} as OauthFunctionResponse<OauthGetTransactionsResponse>
  })
})