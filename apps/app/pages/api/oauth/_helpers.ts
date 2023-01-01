import { PlaidError } from "plaid";
import * as plaidWebhookFunctions from "~/utils/backend/plaidWebhookFunctions"
import { Logger } from "next-axiom";
import { PlaidItem, SyncError } from "@prisma/client";
import { db } from "~/lib/db";

const authErrors = ["ITEM_LOGIN_REQUIRED"];

export const handlePlaidError = async ({ error, item, syncId, logger, destinationId } : {
  error: PlaidError;
  item: PlaidItem;
  syncId?: string;
  destinationId?: string;
  logger: Logger
}) => {
  const { error_code } = error as PlaidError;
  if ( authErrors.includes(error_code) ) {
    await plaidWebhookFunctions.handleItemError({ item, logger, data: { error }});
    if ( syncId ) {
      await db.syncResult.update({ 
        where: { syncId_plaidItemId_destinationId: { syncId, plaidItemId: item.id, destinationId }},
        data: { error: SyncError.ItemError }
      })
    }
    return { hasAuthError: true }
  }

  return { hasAuthError: false }
}