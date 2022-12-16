import { PlaidError } from "plaid";
import { graphql } from "~/graphql/backend";
import * as plaidWebhookFunctions from "~/utils/backend/plaidWebhookFunctions"
import { PlaidItemModel } from "~/types/backend/models";
import { Logger } from "~/utils/backend/logger";

const authErrors = ["ITEM_LOGIN_REQUIRED"];

export const getOauthPlaidItems = async (destinationId: string, syncLogId?: string, returnIfNoAccounts = false) => {
  const accountsFilter = { destination_connections: { destination_id: { _eq: destinationId }}};
  return graphql.GetPlaidItems({ where: { accounts: accountsFilter }, accounts_where: accountsFilter })
  .then(async response => {
    const plaid_items = response.plaidItems.filter(item => returnIfNoAccounts || item.error !== 'NO_ACCOUNTS');
    const errorCount = plaid_items.filter(item => item.error && authErrors.includes(item.error)).length;

    if ( errorCount > 0 && syncLogId ) {
      await graphql.UpdateSyncLog({
        sync_log_id: syncLogId,
        _set: {
          error: { code: 'has_error_item' },
          is_success: false,
          ended_at: new Date()
        }
      });
    }
    return {
      plaid_items,
      error_count: errorCount
    }
  })
} 

export const handlePlaidError = async ({ error, item, syncLogId, logger } : {
  error: PlaidError;
  item: PlaidItemModel;
  syncLogId?: string;
  logger: Logger
}) => {
  const { error_code } = error;

  if ( authErrors.includes(error_code) ) {
    await plaidWebhookFunctions.handleItemError({ item, logger, data: { error }});
    if ( syncLogId ) {
      await graphql.UpdateSyncLog({
        sync_log_id: syncLogId,
        _set: {
          error: { code: 'has_error_item' },
          is_success: false,
          ended_at: new Date()
        }
      });
    }
    return { hasAuthError: true }
  }

  return { hasAuthError: false }
}