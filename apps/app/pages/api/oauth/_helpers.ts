import { PlaidError } from "plaid";
import * as plaidWebhookFunctions from "~/lib/plaidWebhookFunctions"
import { Logger } from "next-axiom";
import { SyncError } from "@prisma/client";
import { db } from "~/lib/db";
import { OauthItem } from "~/types";

const authErrors = ["ITEM_LOGIN_REQUIRED"];

export const handlePlaidError = async ({ error, item, syncId, logger, destinationId } : {
  error: PlaidError;
  item: OauthItem;
  syncId?: string;
  destinationId?: string;
  logger: Logger
}) => {
  const { error_code } = error as PlaidError;
  if ( authErrors.includes(error_code) ) {
    await plaidWebhookFunctions.handleItemError({ item, logger, data: { error }});
    if ( syncId && destinationId ) {
      await db.syncResult.update({ 
        where: { syncId_plaidItemId_destinationId: { syncId, plaidItemId: item.id, destinationId }},
        data: { error: SyncError.ItemError }
      })
    }
    return { hasAuthError: true }
  }

  return { hasAuthError: false }
}