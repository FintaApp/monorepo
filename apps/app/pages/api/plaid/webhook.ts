import moment from "moment-timezone";

import { wrapper } from "~/utils/backend/apiWrapper";
import * as plaidWebhookFunctions from "~/utils/backend/plaidWebhookFunctions";
import { graphql } from "~/graphql/backend";
import { DestinationModel } from "~/types/backend/models";


export default wrapper('public', async function handler({ req, logger }) {
  const { webhook_type, webhook_code, item_id, asAdmin } = req.body;
  const item = await graphql.GetPlaidItem({ plaidItemId: item_id, include_removed_transactions: true, date: moment().subtract(24, 'hours').toISOString() }).then(response => response.plaidItem);
  logger.info("Fetched item");
  if ( !item ) { throw new Error("Item does not exist") }
  const { user } = item;
  logger.addContext({ user: { id: user.id }});

  const destinations = await graphql.GetDestinations({ 
    where: { disabled_at: { _is_null: true }, account_connections: { account: { plaid_item_id: { _eq: item.id }}}},
    account_connections_where: { account: { plaid_item_id: { _eq: item.id }}}
  }).then(response => response.destinations as DestinationModel[]);
  logger.info("Fetched destination", { destinationsCount: destinations.length });

  if ( webhook_type === 'HOLDINGS' ) {
    if ( webhook_code === 'DEFAULT_UPDATE' ) { await plaidWebhookFunctions.handleHoldingsDefaultUpdate({ item, destinations, logger, asAdmin })}

  } else if ( webhook_type === 'INVESTMENTS_TRANSACTIONS') {
    if ( webhook_code === 'DEFAULT_UPDATE' ) { await plaidWebhookFunctions.handleInvestmentTransactionsDefaultUpdate({ item, destinations, logger, asAdmin })}

  } else if ( webhook_type === 'ITEM') {
    if ( webhook_code === 'ERROR' ) { await plaidWebhookFunctions.handleItemError({ item, data: req.body, logger })}
    if ( webhook_code === 'NEW_ACCOUNTS_AVAILABLE' ) { await plaidWebhookFunctions.handleNewAccountsAvailable() }
    if ( webhook_code === 'PENDING_EXPIRATION' ) { await plaidWebhookFunctions.handlePendingExpiration({ item, data: req.body, logger })}
    if ( webhook_code === 'USER_PERMISSION_REVOKED' ) { await plaidWebhookFunctions.handleUserPermissionRevoked({ item })}
    if ( webhook_code === 'WEBHOOK_UPDATE_ACKNOWLEDGED' ) { await plaidWebhookFunctions.handleWebhookUpdateAcknowledged() }

  } else if ( webhook_type === 'LIABILITIES') {
    if ( webhook_code === 'DEFAULT_UPDATE' ) { await plaidWebhookFunctions.handleLiabilitiesDefaultUpdate() }

  } else if ( webhook_type === 'TRANSACTIONS') {
    if ( webhook_code === 'DEFAULT_UPDATE' ) { await plaidWebhookFunctions.handleTransactionsDefaultUpdate({ item, destinations, logger, data: req.body, asAdmin })}
    if ( webhook_code === 'HISTORICAL_UPDATE' ) { await plaidWebhookFunctions.handleTransactionsHistoricalUpdate({ item, data: req.body, destinations, logger, asAdmin })}
    if ( webhook_code == 'INITIAL_UPDATE'  ) { }
    if ( webhook_code === 'SYNC_UPDATES_AVAILABLE' ) { await plaidWebhookFunctions.handleSyncUpdatesAvailable({ item, data: req.body, destinations, logger, asAdmin }) }
    if ( webhook_code === 'TRANSACTIONS_REMOVED' ) { await plaidWebhookFunctions.handleTransactionsRemoved() }

  } else { throw new Error("Unknown webhook type") }

  return { status: 200, message: 'OK' }
})