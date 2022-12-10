import { functionWrapper, graphql, plaid, Sentry, formatter, getItemActiveAccounts, logsnag } from "../_lib";
import { getOauthPlaidItems, handlePlaidError } from "./_helpers"
import { OauthFunctionResponse, ErrorResponseMessages } from "../_lib/types";
import { OauthAccount, OauthGetAccountsResponse } from "@finta/types";
import { LiabilitiesGetRequestOptions, AccountBase, CreditCardLiability, MortgageLiability, StudentLoan } from "plaid";

export default functionWrapper.oauth(async (req, destination, plaidEnv, asAdmin) => {
  const transaction = Sentry.startTransaction({ op: "oauth function", name: "Get accounts" });
  const scope = new Sentry.Scope();

  const { user } = destination;
  scope.setUser({ id: user.id, email: user.email });
  scope.setContext("Destination ID", destination.id);

  const trigger = 'destination';
  const syncLog = await graphql.InsertSyncLog({ sync_log: { trigger,
    destination_sync_logs: { data: [{ destination_id: destination.id }]},
    metadata: { 'target_table': 'accounts', asAdmin }
  }}).then(response => response.sync_log!);
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

  const { plaid_items, error_count } = await getOauthPlaidItems(destination.id, syncLog.id);
  if ( error_count > 0 ) {
    transaction.finish();
    return { status: 428, message: ErrorResponseMessages.HAS_ERROR_ITEM }
  }

  return Promise.all(plaid_items.map(async item => {
    const getItemActiveAccountsResponse = await getItemActiveAccounts(item, plaidEnv);
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
      scope.setContext("Plaid error", errorData);
      const { hasAuthError } = await handlePlaidError({ error: errorData, item, syncLogId: syncLog.id });
      if ( !hasAuthError ) { 
        await logsnag.logError({ 
          operation: "Get accounts", 
          error, 
          scope, 
          tags: {[logsnag.LogSnagTags.USER_ID]: user.id } 
        })
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
          scope.setContext("Plaid Get Liabilities Response", errorData ? errorData : err.response)
          await logsnag.logError({ 
            operation: "Get accounts", 
            error: new Error("Plaid Get Liabilities Error"), 
            scope, 
            tags: {[logsnag.LogSnagTags.USER_ID]: user.id } 
          })
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
    transaction.finish();

    if ( !!responses.find(response => response.hasAuthError) ) { return { status: 428, message: ErrorResponseMessages.HAS_ERROR_ITEM } }

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
      logsnag.publish({
        channel: logsnag.LogSnagChannel.SYNCS,
        event: logsnag.LogSnagEvent.SYNC_COMPLETED,
        description: `${plaid_items.length} institutions(s) synced\nTarget table: accounts`,
        icon: '☑️',
        tags: {
          [logsnag.LogSnagTags.USER_ID]: destination.user.id,
          [logsnag.LogSnagTags.IS_SUCCESS]: true,
          [logsnag.LogSnagTags.DESTINATION_ID]: destination.id,
          [logsnag.LogSnagTags.TRIGGER]: trigger,
          [logsnag.LogSnagTags.SYNC_LOG_ID]: syncLog.id
        }
      })
    ])
    return { status: 200, message: { accounts: responses.reduce((all, response) => all.concat(response.accounts), [] as OauthAccount[] )}} as OauthFunctionResponse<OauthGetAccountsResponse>
  })
})