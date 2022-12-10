import moment from "moment-timezone";

import { functionWrapper, graphql, plaidWebhookFunctions, logsnag, Sentry, types } from "../_lib";

export default functionWrapper.public(async (req) => {
  const transaction = Sentry.startTransaction({ op: "Webhook", name: "Plaid Webhook" });
  const scope = new Sentry.Scope();
  scope.setContext("Request Body", req.body);
  const { webhook_type, webhook_code, item_id, asAdmin } = req.body;

  try {
    const item = await graphql.GetPlaidItem({ plaid_item_id: item_id, include_removed_transactions: true, date: moment().subtract(24, 'hours').toISOString() }).then(response => response.plaidItem);
    if ( !item ) { throw new Error("Item does not exist") }
    const { user } = item;
    scope.setUser({ id: user.id, email: user.email })

    const destinations = await graphql.GetDestinations({ 
      where: { disabled_at: { _is_null: true }, account_connections: { account: { plaid_item_id: { _eq: item.id }}}},
      account_connections_where: { account: { plaid_item_id: { _eq: item.id }}}
    }).then(response => response.destinations);



    if ( webhook_type === 'HOLDINGS' ) {
      if ( webhook_code === 'DEFAULT_UPDATE' ) { await plaidWebhookFunctions.handleHoldingsDefaultUpdate({ item, destinations, scope, asAdmin })}

    } else if ( webhook_type === 'INVESTMENTS_TRANSACTIONS') {
      if ( webhook_code === 'DEFAULT_UPDATE' ) { await plaidWebhookFunctions.handleInvestmentTransactionsDefaultUpdate({ item, destinations, scope, asAdmin })}

    } else if ( webhook_type === 'ITEM') {
      if ( webhook_code === 'ERROR' ) { await plaidWebhookFunctions.handleItemError({ item, data: req.body })}
      if ( webhook_code === 'NEW_ACCOUNTS_AVAILABLE' ) { await plaidWebhookFunctions.handleNewAccountsAvailable() }
      if ( webhook_code === 'PENDING_EXPIRATION' ) { await plaidWebhookFunctions.handlePendingExpiration({ item, data: req.body })}
      if ( webhook_code === 'USER_PERMISSION_REVOKED' ) { await plaidWebhookFunctions.handleUserPermissionRevoked({ item })}
      if ( webhook_code === 'WEBHOOK_UPDATE_ACKNOWLEDGED' ) { await plaidWebhookFunctions.handleWebhookUpdateAcknowledged() }

    } else if ( webhook_type === 'LIABILITIES') {
      if ( webhook_code === 'DEFAULT_UPDATE' ) { await plaidWebhookFunctions.handleLiabilitiesDefaultUpdate() }

    } else if ( webhook_type === 'TRANSACTIONS') {
      if ( webhook_code === 'DEFAULT_UPDATE' ) { await plaidWebhookFunctions.handleTransactionsDefaultUpdate({ item, destinations, scope, data: req.body, asAdmin })}
      if ( webhook_code === 'HISTORICAL_UPDATE' ) { await plaidWebhookFunctions.handleTransactionsHistoricalUpdate({ item, data: req.body, destinations, scope, asAdmin })}
      if ( webhook_code == 'INITIAL_UPDATE'  ) { }
      if ( webhook_code === 'SYNC_UPDATES_AVAILABLE' ) { await plaidWebhookFunctions.handleSyncUpdatesAvailable({ item, data: req.body, destinations, scope, asAdmin }) }
      if ( webhook_code === 'TRANSACTIONS_REMOVED' ) { await plaidWebhookFunctions.handleTransactionsRemoved() }

    } else { throw new Error("Unknown webhook type") }

    return { status: types.StatusCodes.OK, message: 'OK' }
  } catch (error) {
    await logsnag.logError({ error, scope, operation: "Plaid webhook", tags: { [logsnag.LogSnagTags.USER_ID]: scope.getUser()?.id, [logsnag.LogSnagTags.ITEM_ID]: item_id }})
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  } finally { transaction.finish() } 
})
