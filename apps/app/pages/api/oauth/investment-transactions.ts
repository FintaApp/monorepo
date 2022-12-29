
import moment from "moment-timezone";
import { InvestmentsTransactionsGetRequestOptions, InvestmentTransaction } from "plaid";

import * as formatter from "~/utils/backend/formatter";
import { graphql } from "~/graphql/backend";
import { wrapper } from "~/utils/backend/apiWrapper";
import { getItemActiveAccounts } from "~/utils/backend/getItemActiveAccounts";
import { handlePlaidError, getOauthPlaidItems } from "./_helpers";
import { OauthInvestmentTransaction, GetTransactionsNextContinuation } from "@finta/shared";
import * as plaid from "~/utils/backend/plaid"

export default wrapper('oauth', async function handler({ req, destination, plaidEnv, logger }) {
  const trigger = 'destination'
  const syncLog = req.body.data?.syncLogId ? { id: req.body.data.syncLogId } : (await graphql.InsertSyncLog({ sync_log: { 
    trigger,
    destination_sync_logs: { data: [{ destination_id: destination!.id }]},
    metadata: { 'target_table': 'investment_transactions' }
  }}).then(response => response.sync_log!));
  logger.addContext({ syncLogId: syncLog.id });

  const investmentTransactionsTableConfig = destination!.table_configs.investment_transactions;
  const shouldSyncInvestmentTransactions = (investmentTransactionsTableConfig && investmentTransactionsTableConfig.is_enabled) || (!investmentTransactionsTableConfig && destination!.should_sync_investments)
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

  const { plaid_items, error_count } = await getOauthPlaidItems(destination!.id, syncLog.id);
  if ( error_count > 0 ) {
    return { status: 428, message: "Has Error Item" }
  };

  const endDate = moment().format("YYYY-MM-DD");
  const startDate = destination!.sync_start_date;
  const paginationByItem = req.body.data?.paginationByItem || [];

  return Promise.all(plaid_items.map(async item => {
    const pagination = paginationByItem.find((pbi: any) => pbi.itemId === item.id) || { hasMore: true, totalTransactions: 0 };
    const { hasMore, totalTransactions: previousTotalTransactions } = pagination;
    const getItemActiveAccountsResponse = await getItemActiveAccounts(item, logger, plaidEnv);
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
      const { hasAuthError } = await handlePlaidError({ logger, error: errorData, item });
      if ( !hasAuthError ) { 
        await logger.error(error, { data: errorData })
      };
      return ({ investment_transactions: [], total_investment_transactions: 0, hasAuthError, securities: [] })
    });

    const formattedInvestmentTransactions = (investment_transactions as InvestmentTransaction[]).map(investmentTransaction => {
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
    if ( !!responses.find(response => response.hasAuthError)) { return { status: 428, message: "Has Error Item" } }

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
          userId: destination!.user.id,
          trigger,
          isSuccess: true,
          integration: destination!.integration.id,
          institutionsSynced: plaid_items.length,
          syncLogId: syncLog.id,
          destinationId: destination!.id,
          targetTable: "investment transactions"
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
    }}
  })
})