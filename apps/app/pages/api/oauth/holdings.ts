import { Holding, InvestmentHoldingsGetRequestOptions, Security } from "plaid";

import * as formatter from "~/utils/backend/formatter";
import { graphql } from "~/graphql/backend";
import { wrapper } from "~/utils/backend/apiWrapper";
import * as plaid from "~/utils/backend/plaid";
import { getItemActiveAccounts } from "~/utils/backend/getItemActiveAccounts";
import { handlePlaidError, getOauthPlaidItems } from "./_helpers";
import { OauthHolding } from "@finta/shared";

export default wrapper('oauth', async function handler({ req, destination, plaidEnv, logger }) {
  const trigger = 'destination'
  const syncLog = await graphql.InsertSyncLog({ sync_log: { trigger,
    destination_sync_logs: { data: [{ destination_id: destination!.id }]},
    metadata: { 'target_table': 'holdings' }
  }}).then(response => response.sync_log!);
  logger.addContext({ syncLogId: syncLog.id });
  
  const holdingsTableConfig = destination!.table_configs.holdings;
  const shouldSyncHoldings = (holdingsTableConfig && holdingsTableConfig.is_enabled) || (!holdingsTableConfig && destination!.should_sync_investments)
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

  const { plaid_items, error_count } = await getOauthPlaidItems(destination!.id, syncLog.id);
  if ( error_count > 0 ) {
    return { status: 428, message: "Has Error Item" }
  }

  return Promise.all(plaid_items.map(async item => {
    const getItemActiveAccountsResponse = await getItemActiveAccounts(item, logger, plaidEnv);
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
      const { hasAuthError } = await handlePlaidError({ logger, error: errorData, item, syncLogId: syncLog.id });
      if ( !hasAuthError ) { 
        await logger.error(error, { data: errorData })
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
    if ( !!responses.find(response => response.hasAuthError )) { return { status: 428, message: "Has Error Item" } }

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
        targetTable: "holdings"
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
    return { status: 200, message: { holdings: responses.reduce((all, response) => all.concat(response.holdings), [] as OauthHolding[] )}}
  })
})