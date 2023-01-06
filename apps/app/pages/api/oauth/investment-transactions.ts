
import moment from "moment-timezone";
import { InvestmentsTransactionsGetRequestOptions, InvestmentTransaction } from "plaid";
import _ from "lodash";

import { OauthInvestmentTransaction, GetTransactionsNextContinuation } from "@finta/shared";

import { wrapper } from "~/lib/apiWrapper";
import { db } from "~/lib/db";
import * as formatter from "~/lib/integrations/coda/formatter";
import { getDestinationFromRequest } from "~/lib/getDestinationFromRequest";
import { getItemActiveAccounts } from "~/lib/getItemActiveAccounts";
import { handlePlaidError } from "./_helpers";
import * as plaid from "~/lib/plaid"
import { SyncError, SyncTrigger, Table } from "@prisma/client";
import { logSyncCompleted } from "~/lib/logsnag";
import { trackSyncCompleted } from "~/lib/analytics";
import { SyncMetadata } from "~/types";

export default wrapper(async ({ req, logger }) => {
  const trigger = SyncTrigger.Destination;
  const { destination, hasAppAccess } = await getDestinationFromRequest({ req, logger });
  if ( !destination ) { return { status: 404, message: "Destination not found" }};

  logger.info("Fetched destination", { destination, hasAppAccess });

  const syncData = { trigger, triggerDestinationId: destination.id, userId: destination.userId, metadata: { targetTable: Table.InvestmentTransactions } as SyncMetadata }

  if ( !hasAppAccess ) {
    return db.sync.create({ data: {
      ...syncData,
      error: SyncError.NoSubscription,
      isSuccess: false,
      endedAt: new Date()
    }})
    .then(sync => {
      logger.info("Sync created", { sync });
      return { status: 200, message: "OK"}
    });
  }

  const tableConfig = destination.tableConfigs.find(config => config.table === Table.InvestmentTransactions) || { isEnabled: false };
  if ( !tableConfig.isEnabled ) {
    return db.sync.create({ data: { 
        ...syncData,
        isSuccess: false, 
        error: SyncError.InvestmentTransactionsDisabled, 
        endedAt: new Date()
      }})
      .then(sync => {
        logger.info("Sync created", { sync });
        return { status: 200, message: "OK" }
      })
  }

  const plaidItems = _.uniqBy(destination.accounts.map(account => account.item), 'id');

  const errorItems = plaidItems.filter(item => item.error === 'ITEM_LOGIN_REQUIRED');
  if ( errorItems.length > 0 ) {
    return db.sync.create({ data: {
      ...syncData,
      isSuccess: false,
      error: SyncError.ItemError,
      endedAt: new Date(),
      results: { createMany: { data: errorItems.map(item => ({ plaidItemId: item.id, error: SyncError.ItemError, destinationId: destination.id }))}
      }
    }})
    .then(response => {
      logger.info("Sync created", { sync: response });
      return { status: 428, message: "Has Error Item" }
    })
  }

  const body = req.body as GetTransactionsNextContinuation;

  const sync = req.body.data?.syncId 
    ? { id: body.data.syncId }
    : (await db.sync.create({
      data: { 
        ...syncData,
        results: {
          create: plaidItems.map(item => ({
            plaidItemId: item.id,
            destinationId: destination.id,
            shouldSyncInvestmentTransactions: (item.billedProducts as string[]).concat(item.availableProducts as string[]).includes('investments')
          }))
        }
      }
    }).then(sync => { logger.info("Created sync", { sync }); return sync }));

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
      const { hasAuthError } = await handlePlaidError({ logger, error: errorData, item, syncId: sync.id, destinationId: destination.id });
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
      where: { syncId_plaidItemId_destinationId: { syncId: sync.id, plaidItemId: item.id, destinationId: destination.id }},
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
      await db.sync.update({ where: { id: sync.id }, data: { isSuccess: false, error: SyncError.ItemError, endedAt: new Date() }})
      return { status: 428, message: "Has Error Item" }
    };

    const shouldContinue = !!responses.find(response => response.hasMore );
    const nextContinuation = shouldContinue ? {
      data: {
        syncId: sync.id,
        paginationByItem: responses.map(response => ({
          itemId: response.itemId,
          hasMore: response.hasMore,
          totalTransactions: response.totalInvestmentTransactions
        }))
      }
    } as GetTransactionsNextContinuation : undefined;

    if ( !shouldContinue ) {
      await Promise.all([
        db.sync.update({ where: { id: sync.id }, data: { isSuccess: true, endedAt: new Date() }}),

        logSyncCompleted({
          userId: destination.user.id,
          trigger,
          integration: destination.integration,
          institutionsSynced: plaidItems.length,
          syncId: sync.id,
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