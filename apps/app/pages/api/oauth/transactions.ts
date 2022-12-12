import moment from "moment-timezone";
import { TransactionsGetRequestOptions, Transaction } from "plaid";
import * as formatter from "~/utils/backend/formatter";
import { graphql } from "~/graphql/backend";
import { wrapper } from "~/utils/backend/apiWrapper";
import { getItemActiveAccounts } from "~/utils/backend/getItemActiveAccounts";
import { handlePlaidError, getOauthPlaidItems } from "./_helpers";
import { OauthTransaction, GetTransactionsNextContinuation } from "@finta/shared";
import * as plaid from "~/utils/backend/plaid"

export default wrapper('oauth', async function handler({ req, logger, destination, plaidEnv }) {
  const trigger = 'destination';
  const syncLog = req.body.data?.syncLogId ? { id: req.body.data.syncLogId } : (await graphql.InsertSyncLog({ sync_log: { 
    trigger,
    destination_sync_logs: { data: [{ destination_id: destination.id }]},
    metadata: { 'target_table': 'transactions' }
  }}).then(response => response.sync_log!));
  logger.addContext({ syncLogId: syncLog.id });

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
    return { status: 428, message: "Has Error Item" }
  };

  const endDate = moment().format("YYYY-MM-DD");
  const startDate = destination.sync_start_date;
  const paginationByItem = req.body.data?.paginationByItem || [];

  return Promise.all(plaid_items.map(async item => {
    const pagination = paginationByItem.find((pbi: any) => pbi.itemId === item.id) || { hasMore: true, totalTransactions: 0 };
    const { hasMore, totalTransactions: previousTotalTransactions } = pagination;
    const getItemActiveAccountsResponse = await getItemActiveAccounts(item, logger, plaidEnv);
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
      const { hasAuthError } = await handlePlaidError({ logger, error: errorData, item, syncLogId: syncLog.id });
      if ( !hasAuthError ) { 
        await logger.error(error, { data: errorData })
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
    if ( !!responses.find(response => response.hasAuthError)) { return { status: 428, message: "Has Error Item" } }

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
      } as GetTransactionsNextContinuation : undefined;

    if ( !shouldContinue ) {
      await Promise.all([
        graphql.UpdateSyncLog({
          sync_log_id: syncLog.id,
          _set: {
            is_success: true,
            ended_at: new Date()
          }
        }),
        logger.logSyncCompleted({
          userId: destination.user.id,
          trigger,
          isSuccess: true,
          integration: destination.integration.id,
          institutionsSynced: plaid_items.length,
          syncLogId: syncLog.id,
          destinationId: destination.id,
          targetTable: "transactions"
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
    }}
  })
})