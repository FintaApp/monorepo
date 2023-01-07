import { SyncError, Table } from "@prisma/client";
import _ from "lodash";

import { OauthAccount } from "@finta/shared";

import { oauthFunctionWrapper } from "~/lib/functionWrappers";
import { db } from "~/lib/db";
import { getAccounts, getLiabilities } from "~/lib/plaid";
import { getItemActiveAccounts } from "~/lib/getItemActiveAccounts";
import { AccountBase, LiabilitiesGetRequestOptions, LiabilitiesGetResponse, PlaidError } from "plaid";
import { handlePlaidError } from "./_helpers";
import * as formatter from "~/lib/integrations/coda/formatter"
import { logSyncCompleted } from "~/lib/logsnag";
import { trackSyncCompleted } from "~/lib/analytics";

export default oauthFunctionWrapper({ targetTable: Table.Accounts, allowItemError: false }, async ({ req, logger, destination, plaidItems, trigger, syncId }) => {
  await db.syncResult.createMany({
    data: plaidItems.map(item => ({
      syncId: syncId!,
      plaidItemId: item.id,
      destinationId: destination.id,
      shouldSyncAccounts: true
    })),
    skipDuplicates: true
  });

  return Promise.all(plaidItems.map(async item => {
    const getItemActiveAccountsResponse = await getItemActiveAccounts({ item, logger });
    if ( getItemActiveAccountsResponse.hasAuthError ) { 
      await db.syncResult.update({ 
        where: { syncId_plaidItemId_destinationId: { syncId: syncId!, plaidItemId: item.id, destinationId: destination.id }},
        data: { error: SyncError.ItemError }
      })
      return ({ accounts: [] as OauthAccount[], hasAuthError: true, itemId: item.id }) 
    }

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
        const { hasAuthError } = await handlePlaidError({ logger, error: errorData, item, syncId: syncId!, destinationId: destination.id });
        if ( !hasAuthError ) { logger.error(error, { data: errorData })};
        return ({ accounts: [] as AccountBase[], hasAuthError });
      })

    if ( !hasAuthError && plaidAccounts.length > 0 && products.includes('liabilities')) {
      liabilities = await getLiabilities({ accessToken, options })
        .then(response => response.data.liabilities)
        .catch(async err => {
          const error = err.response.data as PlaidError;
          if ( !['NO_LIABILITY_ACCOUNTS'].includes(error.error_code) ) {
            logger.error(err, { data: error })
          };
          return { student: [], mortgage: [], credit: [] } as LiabilitiesGetResponse['liabilities'];
        })
    }

    const formattedAccounts = plaidAccounts.map(plaidAccount => {
      const itemAccount = destination.accounts.find(account => account.id === plaidAccount.account_id)!;
      const liability = liabilities.student?.find(s => s.account_id === plaidAccount.account_id)
        || liabilities.mortgage?.find(s => s.account_id === plaidAccount.account_id)
        || liabilities.credit?.find(s => s.account_id === plaidAccount.account_id)
      
      return formatter.account({ itemId: item.id, plaidAccount, itemAccount, liability })
    });

    await db.syncResult.update({ 
      where: { syncId_plaidItemId_destinationId: { syncId: syncId!, plaidItemId: item.id, destinationId: destination.id }},
      data: { accountsAdded: { increment: formattedAccounts.length }}
    })

    return { hasAuthError, accounts: formattedAccounts, itemId: item.id }
  }))
  .then(async responses => {
    if ( !!responses.find(response => response.hasAuthError)) { 
      await db.sync.update({ where: { id: syncId! }, data: { isSuccess: false, error: SyncError.ItemError, endedAt: new Date() }})
      return { status: 428, message: "Has Error Item" }
    };

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
    ]);

    return { status: 200, message: { accounts: responses.reduce((all, response) => all.concat(response.accounts), [] as OauthAccount[] )}}
  })
});