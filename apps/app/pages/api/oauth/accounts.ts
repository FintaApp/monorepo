import * as formatter from "~/utils/backend/formatter";
import { graphql } from "~/graphql/backend";
import { wrapper } from "~/utils/backend/apiWrapper";
import { getItemActiveAccounts } from "~/utils/backend/getItemActiveAccounts";
import * as plaid from "~/utils/backend/plaid"

import { getOauthPlaidItems, handlePlaidError } from "./_helpers"
import { OauthAccount } from "@finta/shared";
import { LiabilitiesGetRequestOptions, AccountBase, CreditCardLiability, MortgageLiability, StudentLoan } from "plaid";

export default wrapper('oauth', async function handler({ req, destination, plaidEnv, logger }) {
  const trigger = 'destination';
  const syncLog = await graphql.InsertSyncLog({ sync_log: { trigger,
    destination_sync_logs: { data: [{ destination_id: destination!.id }]},
    metadata: { 'target_table': 'accounts' }
  }}).then(response => response.sync_log!);
  logger.addContext({ syncLogId: syncLog.id });

  const { plaid_items, error_count } = await getOauthPlaidItems(destination!.id, syncLog.id);
  if ( error_count > 0 ) {
    return { status: 428, message: "Has Error Item" }
  }

  return Promise.all(plaid_items.map(async item => {
    const getItemActiveAccountsResponse = await getItemActiveAccounts(item, logger, plaidEnv);
    if ( getItemActiveAccountsResponse.hasAuthError ) { return ({ accounts: [] as OauthAccount[], hasAuthError: true, itemId: item.id }) }
    
    const { accountIds: plaidAccountIds } = getItemActiveAccountsResponse;
    const { accessToken, billed_products = [], available_products = [] } = item;
    if ( plaidAccountIds.length === 0) { return ({ accounts: [] as OauthAccount[], hasAuthError: false, itemId: item.id }) }

    const products = billed_products.concat(available_products) as string[];
    const options = { account_ids: plaidAccountIds } as LiabilitiesGetRequestOptions;

    let liabilities = [] as (CreditCardLiability | MortgageLiability | StudentLoan)[];
    const { accounts: plaidAccounts, hasAuthError } = await plaid.getAccounts({ accessToken, options })
    .then(response => ({ accounts: response.data.accounts as AccountBase[], hasAuthError: false }))
    .catch(async error => {
      const errorData = error.response.data;
      const { hasAuthError } = await handlePlaidError({ logger, error: errorData, item, syncLogId: syncLog.id });
      if ( !hasAuthError ) { 
        await logger.error(error, { data: errorData })
      };
      return ({ accounts: [] as AccountBase[], hasAuthError });
    })

    if ( !hasAuthError && plaidAccounts.length > 0 && products.includes('liabilities') ) {
      liabilities = await plaid.getLiabilities({ accessToken, options })
      .then(liabilitiesResponse => {
        const { credit, mortgage, student } = liabilitiesResponse.data.liabilities;
        return ([] as (CreditCardLiability | MortgageLiability | StudentLoan)[]).concat(credit || []).concat(mortgage || []).concat(student || [])
      })
      .catch(async err => {
        const errorData = err.response?.data;
        const errorCode = errorData?.error_code;
        if ( !['NO_LIABILITY_ACCOUNTS'].includes(errorCode) ) {
          await logger.error(err, { data: errorData })
        }
        return []
      })
    }

    const formattedAccounts = plaidAccounts.map(plaidAccount => {
      const itemAccount = item.accounts.find(account => account.id === plaidAccount.account_id)!;
      const liability = liabilities.find(liab => liab.account_id === plaidAccount.account_id);
      return formatter.coda.account({ itemId: item.id, plaidAccount, itemAccount, liability })
    })

    return { hasAuthError, accounts: formattedAccounts, itemId: item.id }
  }))
  .then(async responses => {
    if ( !!responses.find(response => response.hasAuthError) ) { return { status: 428, message: "Has Error Item" } }

    await Promise.all([
      graphql.UpdateSyncLog({
        sync_log_id: syncLog.id,
        _set: {
          is_success: true,
          ended_at: new Date()
        }
      }),
      graphql.InsertPlaidItemSyncLogs({
        plaid_item_sync_logs: responses.map(response => ({
          plaid_item_id: response.itemId,
          accounts: {
            added: response.accounts.map(account => account.id),
            updated: []
          },
          sync_log_id: syncLog.id
        }))
      }),
      logger.logSyncCompleted({
        userId: destination!.user.id,
        trigger,
        isSuccess: true,
        integration: destination!.integration.id,
        institutionsSynced: plaid_items.length,
        syncLogId: syncLog.id,
        destinationId: destination!.id,
        targetTable: "accounts"
      })
    ])
    return { status: 200, message: { accounts: responses.reduce((all, response) => all.concat(response.accounts), [] as OauthAccount[] )}}
  })
})