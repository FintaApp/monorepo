import { Holding, InvestmentHoldingsGetRequestOptions, Security } from "plaid";
import { SyncError, SyncTrigger, Table } from "@prisma/client";
import _ from "lodash";

import { OauthHolding, OauthGetHoldingsResponse } from "@finta/shared";

import { wrapper } from "~/lib/apiWrapper";
import { db } from "~/lib/db";
import { handlePlaidError } from "./_helpers";
import * as formatter from "~/lib/integrations/coda/formatter"
import { logSyncCompleted } from "~/lib/logsnag";
import { trackSyncCompleted } from "~/lib/analytics";
import { getDestinationFromRequest } from "~/lib/getDestinationFromRequest";
import { getItemActiveAccounts } from "~/lib/getItemActiveAccounts";
import { getHoldings } from "~/lib/plaid";

export default wrapper(async ({ req, logger }) => {
  const trigger = SyncTrigger.Destination;
  const { destination, hasAppAccess } = await getDestinationFromRequest({ req, logger });
  if ( !destination ) { return { status: 404, message: "Destination not found" }};

  logger.info("Fetched destination", { destination, hasAppAccess });

  if ( !hasAppAccess ) {
    return db.sync.create({ data: {
      trigger,
      triggerDestinationId: destination.id,
      error: SyncError.NoSubscription,
      isSuccess: false,
      endedAt: new Date()
    }})
    .then(sync => {
      logger.info("Sync created", { sync });
      return { status: 200, message: "OK"}
    });
  }

  const tableConfig = destination.tableConfigs.find(config => config.table === Table.Holdings) || { isEnabled: false };
  if ( !tableConfig.isEnabled ) {
    return db.sync.create({ data: { 
        triggerDestinationId: destination.id, 
        isSuccess: false, 
        error: SyncError.HoldingsDisabled, 
        trigger,
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
      triggerDestinationId: destination.id,
      trigger,
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

  const sync = await db.sync.create({
    data: { 
      trigger, 
      triggerDestinationId: destination.id,
      results: {
        create: plaidItems.map(item => ({
          plaidItemid: item.id,
          destinationId: destination.id,
          shouldSyncHoldings: (item.billedProducts as string[]).concat(item.availableProducts as string[]).includes('investments')
        }))
      }
    }
  }).then(sync => { logger.info("Created sync", { sync }); return sync });

  return Promise.all(plaidItems.map(async item => {
    const getItemActiveAccountsResponse = await getItemActiveAccounts({ item, logger });
    if ( getItemActiveAccountsResponse.hasAuthError ) { return ({ holdings: [] as OauthHolding[], plaidAccountIds: [], hasAuthError: true, itemId: item.id }) }
    
    const destinationPlaidAccountIds = _.union(
      getItemActiveAccountsResponse.accountIds,
      destination.accounts
        .filter(account => account.plaidItemId === item.id)
        .map(account => account.id)
    );
    if ( destinationPlaidAccountIds.length === 0) { return ({ holdings: [] as OauthHolding[], plaidAccountIds: destinationPlaidAccountIds, hasAuthError: false, itemId: item.id }) };

    const { accessToken, billedProducts = [], availableProducts = [] } = item;
    const products = (billedProducts as string[]).concat(availableProducts as string[]);

    if ( !products.includes("investments") ) { return { holdings: [] as OauthHolding[], plaidAccountIds: destinationPlaidAccountIds, hasAuthError: false, itemId: item.id }};
    
    const options = { account_ids: destinationPlaidAccountIds } as InvestmentHoldingsGetRequestOptions;

    const { holdings, securities, hasAuthError } = await getHoldings({ accessToken, options })
    .then(response => ({ holdings: response.data.holdings as Holding[], securities: response.data.securities as Security[], hasAuthError: false }))
    .catch(async error => {
      const errorData = error.response.data;
      const { hasAuthError } = await handlePlaidError({ logger, error: errorData, item, syncId: sync.id });
      if ( !hasAuthError ) { logger.error(error, { data: errorData })};
      return ({ holdings: [] as Holding[], securities: [] as Security[], hasAuthError })
    });

    const formattedHoldings = holdings.map(holding => {
      const security = securities.find(sec => sec.security_id === holding.security_id);
      return formatter.holding({ holding, security })
    });

    await db.syncResult.update({ 
      where: { syncId_plaidItemId_destinationId: { syncId: sync.id, plaidItemId: item.id, destinationId: destination.id }},
      data: { holdingsAdded: { increment: formattedHoldings.length }}
    })

    return { hasAuthError, holdings: formattedHoldings, plaidAccountIds: destinationPlaidAccountIds, itemId: item.id }
  }))
  .then(async responses => {
    if ( !!responses.find(response => response.hasAuthError)) { 
      await db.sync.update({ where: { id: sync.id }, data: { isSuccess: false, error: SyncError.ItemError, endedAt: new Date() }})
      return { status: 428, message: "Has Error Item" }
    };

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
    ]);

    return { status: 200, message: { holdings: responses.reduce((all, response) => all.concat(response.holdings), [] as OauthHolding[] )} as OauthGetHoldingsResponse}
  })
});