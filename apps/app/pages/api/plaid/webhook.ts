import { publicFunctionWrapper } from "~/lib/functionWrappers";
import { db } from "~/lib/db";
import { logUnhandledEvent } from "~/lib/logsnag";
import * as plaidWebhookFunctions from "~/lib/plaidWebhookFunctions";

export default publicFunctionWrapper(async ({ req, logger }) => {
  const { webhook_type, webhook_code, item_id, asAdmin } = req.body;
  const item = await db.plaidItem.findFirst({ where: { id: item_id }, include: { accounts: true, institution: true, user: true }});
  logger.info("Fetched item", { item });
  if ( !item ) {
    logUnhandledEvent(`Item does not exist - ${item_id}`)
    return { status: 404, message: "Item not found"}
  }

  const destinations = await db.destination.findMany({ 
    where: { disabledAt: null, accounts: { some: { plaidItemId: item_id }}},
    include: { accounts: true, tableConfigs: { include: { fieldConfigs: true } }, airtableCredential: true, googleSheetsCredential: true, notionCredential: true }
  });

  logger.info("Connected destinations", { count: destinations.length });

  if ( webhook_type === 'HOLDINGS' ) {
    if ( webhook_code === 'DEFAULT_UPDATE' ) { await plaidWebhookFunctions.handleHoldingsDefaultUpdate({ item, destinations, logger, asAdmin })}

  } else if ( webhook_type === 'INVESTMENTS_TRANSACTIONS') {
    if ( webhook_code === 'DEFAULT_UPDATE' ) { await plaidWebhookFunctions.handleInvestmentTransactionsDefaultUpdate({ item, destinations, logger, asAdmin })}

  } else if ( webhook_type === 'ITEM') {
    if ( webhook_code === 'ERROR' ) { await plaidWebhookFunctions.handleItemError({ item, data: req.body, logger, destinations })}
    if ( webhook_code === 'NEW_ACCOUNTS_AVAILABLE' ) { await plaidWebhookFunctions.handleNewAccountsAvailable() }
    if ( webhook_code === 'PENDING_EXPIRATION' ) { await plaidWebhookFunctions.handlePendingExpiration({ item, data: req.body, logger })}
    if ( webhook_code === 'USER_PERMISSION_REVOKED' ) { await plaidWebhookFunctions.handleUserPermissionRevoked({ item })}
    if ( webhook_code === 'WEBHOOK_UPDATE_ACKNOWLEDGED' ) { await plaidWebhookFunctions.handleWebhookUpdateAcknowledged() }

  } else if ( webhook_type === 'LIABILITIES') {
    if ( webhook_code === 'DEFAULT_UPDATE' ) { await plaidWebhookFunctions.handleLiabilitiesDefaultUpdate({ item, logger, destinations, asAdmin }) }

  } else if ( webhook_type === 'TRANSACTIONS') {
    if ( webhook_code === 'DEFAULT_UPDATE' ) { await plaidWebhookFunctions.handleTransactionsDefaultUpdate({ item, destinations, logger, data: req.body, asAdmin })}
    if ( webhook_code === 'HISTORICAL_UPDATE' ) { await plaidWebhookFunctions.handleTransactionsHistoricalUpdate({ item, data: req.body, destinations, logger, asAdmin })}
    if ( webhook_code == 'INITIAL_UPDATE'  ) { }
    if ( webhook_code === 'SYNC_UPDATES_AVAILABLE' ) { await plaidWebhookFunctions.handleSyncUpdatesAvailable({ item, data: req.body, destinations, logger, asAdmin }) }
    if ( webhook_code === 'TRANSACTIONS_REMOVED' ) { await plaidWebhookFunctions.handleTransactionsRemoved() }

  } else { throw new Error("Unknown webhook type") }

  return { status: 200, message: 'OK' }
})