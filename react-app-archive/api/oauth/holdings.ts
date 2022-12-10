import { functionWrapper, Sentry, graphql, getItemActiveAccounts, plaid, formatter, logsnag } from "../_lib";
import { handlePlaidError, getOauthPlaidItems } from "./_helpers";
import { Holding, InvestmentHoldingsGetRequestOptions, Security } from "plaid";
import { OauthFunctionResponse, ErrorResponseMessages } from "../_lib/types";
import { OauthGetHoldingsResponse, OauthHolding } from "@finta/types";

export default functionWrapper.oauth(async (req, destination, plaidEnv, asAdmin) => {
  const transaction = Sentry.startTransaction({ op: "oauth function", name: "Get holdings" });
  const scope = new Sentry.Scope();

  const { user } = destination;
  scope.setUser({ id: user.id, email: user.email });
  scope.setContext("Destination ID", destination.id);

  const trigger = 'destination'
  const syncLog = await graphql.InsertSyncLog({ sync_log: { trigger,
    destination_sync_logs: { data: [{ destination_id: destination.id }]},
    metadata: { 'target_table': 'holdings', asAdmin }
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
  
  const holdingsTableConfig = destination.table_configs.holdings;
  const shouldSyncHoldings = (holdingsTableConfig && holdingsTableConfig.is_enabled) || (!holdingsTableConfig && destination.should_sync_investments)
  if ( !shouldSyncHoldings ) {
    await graphql.UpdateSyncLog({
      sync_log_id: syncLog.id,
      _set: {
        error: { error_code: 'investments_disabled' },
        is_success: false,
        ended_at: new Date()
      }
    });
    return { status: 200, message: { holdings: [] }}
  };

  const { plaid_items, error_count } = await getOauthPlaidItems(destination.id, syncLog.id);
  if ( error_count > 0 ) {
    transaction.finish();
    return { status: 428, message: ErrorResponseMessages.HAS_ERROR_ITEM }
  }

  return Promise.all(plaid_items.map(async item => {
    const getItemActiveAccountsResponse = await getItemActiveAccounts(item, plaidEnv);
    if ( getItemActiveAccountsResponse.hasAuthError ) { return ({ holdings: [] as OauthHolding[], plaidAccountIds: [], hasAuthError: true, itemId: item.id }) }
    const { accountIds: plaidAccountIds } = getItemActiveAccountsResponse;
    const { accessToken, billed_products = [], available_products = [] } = item;
    if ( plaidAccountIds.length === 0) { return ({ holdings: [] as OauthHolding[], plaidAccountIds, hasAuthError: false, itemId: item.id }) }

    const products = billed_products.concat(available_products) as string[];
    if ( !products.includes("investments") ) { return { holdings: [] as OauthHolding[], plaidAccountIds, hasAuthError: false, itemId: item.id }}

    const options = { account_ids: plaidAccountIds } as InvestmentHoldingsGetRequestOptions;

    const { holdings, securities, hasAuthError } = await plaid.getHoldings({ accessToken, options })
    .then(response => ({ holdings: response.data.holdings as Holding[], securities: response.data.securities as Security[], hasAuthError: false }))
    .catch(async error => {
      const errorData = error.response.data;
      scope.setContext("Plaid error", errorData);
      const { hasAuthError } = await handlePlaidError({ error: errorData, item, syncLogId: syncLog.id });
      if ( !hasAuthError ) { 
        await logsnag.logError({ operation: "Get holdings", error, scope, tags: {[logsnag.LogSnagTags.USER_ID]: user.id } })
      };
      return ({ holdings: [] as Holding[], securities: [] as Security[], hasAuthError })
    });

    const formattedHoldings = holdings.map(holding => {
      const security = securities.find(sec => sec.security_id === holding.security_id);
      return formatter.coda.holding({ holding, security })
    });

    return { hasAuthError, holdings: formattedHoldings, plaidAccountIds, itemId: item.id }
  }))
  .then(async responses => {
    transaction.finish();
    if ( !!responses.find(response => response.hasAuthError )) { return { status: 428, message: ErrorResponseMessages.HAS_ERROR_ITEM } }

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
        description: `${plaid_items.length} institutions(s) synced\nTarget table: holdings`,
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
          holdings: {
            added: response.holdings.length,
            updated: 0
          }
        }))
      })
    ])
    return { status: 200, message: { holdings: responses.reduce((all, response) => all.concat(response.holdings), [] as OauthHolding[] )}} as OauthFunctionResponse<OauthGetHoldingsResponse>
  })
})