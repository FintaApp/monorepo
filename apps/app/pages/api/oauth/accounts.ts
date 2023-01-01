import moment from "moment-timezone";
import { SyncError, SyncTrigger, Table } from "@prisma/client";
import _ from "lodash";

import { OauthAccount } from "@finta/shared";

import { wrapper } from "~/lib/apiWrapper";
import { db } from "~/lib/db";
import { getAccounts, getLiabilities } from "~/lib/plaid";
import { getDestinationFromRequest } from "~/lib/getDestinationFromRequest";
import { getItemActiveAccounts } from "~/lib/getItemActiveAccounts";
import { AccountBase, CreditCardLiability, LiabilitiesGetRequestOptions, LiabilitiesGetResponse, MortgageLiability, PlaidError, StudentLoan } from "plaid";
import { handlePlaidError } from "./_helpers";
import * as formatter from "~/lib/integrations/coda/formatter"
import { logSyncCompleted } from "~/lib/logsnag";
import { trackSyncCompleted } from "~/lib/analytics";

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
          shouldSyncAccounts: true
        }))
      }
    }
  }).then(sync => { logger.info("Created sync", { sync }); return sync });

  return Promise.all(plaidItems.map(async item => {
    const getItemActiveAccountsResponse = await getItemActiveAccounts({ item, logger });
    if ( getItemActiveAccountsResponse.hasAuthError ) { return ({ accounts: [] as OauthAccount[], hasAuthError: true, itemId: item.id }) }

    const destinationPlaidAccountIds = _.union(
      getItemActiveAccountsResponse.accountIds,
      destination.accounts
        .filter(account => account.plaidItemId === item.id)
        .map(account => account.id)
    );

    if ( destinationPlaidAccountIds.length === 0) { return ({ accounts: [] as OauthAccount[], hasAuthError: false, itemId: item.id }) };

    const { accessToken, billedProducts = [], availableProducts = [] } = item;
    const products = (billedProducts as string[]).concat(availableProducts as string[]);

    const options = { account_ids: destinationPlaidAccountIds } as LiabilitiesGetRequestOptions;

    let liabilities = { student: [], mortgage: [], credit: [] } as LiabilitiesGetResponse['liabilities'];
    const { accounts: plaidAccounts, hasAuthError } = await getAccounts({ accessToken, options })
      .then(response => ({ accounts: response.data.accounts as AccountBase[], hasAuthError: false }))
      .catch(async error => {
        const errorData = error.response.data;
        const { hasAuthError } = await handlePlaidError({ logger, error: errorData, item, syncId: sync.id });
        if ( !hasAuthError ) { logger.error(error, { data: errorData })};
        return ({ accounts: [] as AccountBase[], hasAuthError });
      })

    if ( !hasAuthError && plaidAccounts.length > 0 && products.includes('liabilities')) {
      liabilities = await getLiabilities({ accessToken, options })
        .then(response => response.data.liabilities)
        .catch(async err => {
          const error = err.response.error as PlaidError;
          if ( !['NO_LIABILITY_ACCOUNTS'].includes(error.error_code) ) {
            logger.error(err, { data: error })
          };
          return { student: [], mortgage: [], credit: [] } as LiabilitiesGetResponse['liabilities'];
        })
    }

    const formattedAccounts = plaidAccounts.map(plaidAccount => {
      const itemAccount = destination.accounts.find(account => account.id === plaidAccount.account_id)!;
      const liability = liabilities.student.find(s => s.account_id === plaidAccount.account_id)
        || liabilities.mortgage.find(s => s.account_id === plaidAccount.account_id)
        || liabilities.credit.find(s => s.account_id === plaidAccount.account_id)
      
      return formatter.account({ itemId: item.id, plaidAccount, itemAccount, liability })
    });

    await db.syncResult.update({ 
      where: { syncId_plaidItemId_destinationId: { syncId: sync.id, plaidItemId: item.id, destinationId: destination.id }},
      data: { accountsAdded: { increment: formattedAccounts.length }}
    })

    return { hasAuthError, accounts: formattedAccounts, itemId: item.id }
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

    return { status: 200, message: { accounts: responses.reduce((all, response) => all.concat(response.accounts), [] as OauthAccount[] )}}
  })
});