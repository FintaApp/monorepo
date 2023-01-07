
import moment from "moment-timezone";
import { InvestmentsTransactionsGetRequestOptions, InvestmentTransaction } from "plaid";
import _ from "lodash";

import { OauthInvestmentTransaction, GetTransactionsNextContinuation } from "@finta/shared";

import { oauthFunctionWrapper } from "~/lib/functionWrappers";
import { db } from "~/lib/db";
import * as formatter from "~/lib/integrations/coda/formatter";
import { getItemActiveAccounts } from "~/lib/getItemActiveAccounts";
import { handlePlaidError } from "./_helpers";
import * as plaid from "~/lib/plaid"
import { SyncError, Table } from "@prisma/client";
import { logSyncCompleted } from "~/lib/logsnag";
import { trackSyncCompleted } from "~/lib/analytics";

export default oauthFunctionWrapper({ targetTable: Table.InvestmentTransactions, allowItemError: false }, async ({ req, logger, destination, plaidItems, trigger, syncId }) => {
  const body = req.body as GetTransactionsNextContinuation;
  await db.syncResult.createMany({
    data: plaidItems.map(item => ({
      syncId: syncId!,
      plaidItemId: item.id,
      destinationId: destination.id,
      shouldSyncInvestmentTransactions: (item.billedProducts as string[]).concat(item.availableProducts as string[]).includes('investments')
    })),
    skipDuplicates: true
  });

  const endDate = moment().format("YYYY-MM-DD");
  const startDate = destination.syncStartDate;
  const paginationByItem = body.data?.paginationByItem || [];

  return Promise.all(plaidItems.map(async item => {
    const pagination = paginationByItem.find((pbi: any) => pbi.itemId === item.id) || { hasMore: true, totalTransactions: 0 };
    const { hasMore, totalTransactions: previousTotalTransactions } = pagination;
    const getItemActiveAccountsResponse = await getItemActiveAccounts({ item, logger });
    if ( getItemActiveAccountsResponse.hasAuthError ) { return ({ investmentTransactions: [] as OauthInvestmentTransaction[], hasMore: false, totalInvestmentTransactions: previousTotalTransactions, plaidAccountIds: [], hasAuthError: true, itemId: item.id }) };
    
    const destinationPlaidAccountIds = _.union(
      getItemActiveAccountsResponse.accountIds,
      destination.accounts
        .filter(account => account.plaidItemId === item.id)
        .map(account => account.id)
    )

    if ( destinationPlaidAccountIds.length === 0) { return ({ investmentTransactions: [] as OauthInvestmentTransaction[], hasMore: false, totalInvestmentTransactions: previousTotalTransactions, plaidAccountIds: destinationPlaidAccountIds, hasAuthError: false, itemId: item.id }) }

    const { accessToken, billedProducts = [], availableProducts = [] } = item;
    const products = (billedProducts as string[]).concat(availableProducts as string[]);
    if ( !products.includes('investments') || !hasMore ) {
      return { hasAuthError: false, investmentTransactions: [], hasMore: false, totalInvestmentTransactions: previousTotalTransactions, itemId: item.id, plaidAccountIds: destinationPlaidAccountIds }
    }

    const options = { account_ids: destinationPlaidAccountIds, offset: previousTotalTransactions} as InvestmentsTransactionsGetRequestOptions;

    const { investment_transactions, total_investment_transactions, securities, hasAuthError } = await plaid.getInvestmentTransactions({ accessToken, startDate, endDate, options })
    .then(response => ({ ...response.data, hasAuthError: false }))
    .catch(async error => {
      const errorData = error.response.data;
      const { hasAuthError } = await handlePlaidError({ logger, error: errorData, item, syncId: syncId!, destinationId: destination.id });
      if ( !hasAuthError ) { logger.error(error, { data: errorData })};
      return ({ investment_transactions: [], total_investment_transactions: 0, hasAuthError, securities: [] })
    });

    const formattedInvestmentTransactions = (investment_transactions as InvestmentTransaction[]).map(investmentTransaction => {
      const security = securities.find(sec => sec.security_id === investmentTransaction.security_id);
      return formatter.investmentTransaction({ investmentTransaction, security })
    });

    const newTotalInvestmentTransactions = previousTotalTransactions + formattedInvestmentTransactions.length;
    const newHasMore = newTotalInvestmentTransactions < total_investment_transactions;

    await db.syncResult.update({ 
      where: { syncId_plaidItemId_destinationId: { syncId: syncId!, plaidItemId: item.id, destinationId: destination.id }},
      data: { investmentTransactionsAdded: { increment: formattedInvestmentTransactions.length }}
    });

    return {
      hasAuthError,
      investmentTransactions: formattedInvestmentTransactions,
      hasMore: newHasMore,
      totalInvestmentTransactions: newTotalInvestmentTransactions,
      itemId: item.id,
      plaidAccountIds: destinationPlaidAccountIds
    }
  }))
  .then(async responses => {
    if ( !!responses.find(response => response.hasAuthError)) { 
      await db.sync.update({ where: { id: syncId! }, data: { isSuccess: false, error: SyncError.ItemError, endedAt: new Date() }})
      return { status: 428, message: "Has Error Item" }
    };

    const shouldContinue = !!responses.find(response => response.hasMore );
    const nextContinuation = shouldContinue ? {
      data: {
        syncId: syncId!,
        paginationByItem: responses.map(response => ({
          itemId: response.itemId,
          hasMore: response.hasMore,
          totalTransactions: response.totalInvestmentTransactions
        }))
      }
    } as GetTransactionsNextContinuation : undefined;

    if ( !shouldContinue ) {
      await Promise.all([
        db.sync.update({ where: { id: syncId! }, data: { isSuccess: true, endedAt: new Date() }}),

        logSyncCompleted({
          userId: destination.user.id,
          trigger,
          integration: destination.integration,
          institutionsSynced: plaidItems.length,
          syncId: syncId!,
          destinationId: destination.id,
        }),

        trackSyncCompleted({ 
          userId: destination.user.id, 
          trigger, 
          integration: destination.integration, 
          institutionsSynced: plaidItems.length, 
          destinationId: destination.id 
        })
      ])
    };

    return { status: 200, message: {
      investmentTransactions: responses.reduce((all, response) => all.concat(response.investmentTransactions), [] as OauthInvestmentTransaction[]),
      nextContinuation
    }}
  })
});