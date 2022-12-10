import { PlaidError } from "plaid";
import { graphql, plaidWebhookFunctions } from "../_lib";
import { PlaidItemModel } from "../_lib/types";

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

export const handlePlaidError = async ({ error, item, syncLogId } : {
  error: PlaidError;
  item: PlaidItemModel;
  syncLogId?: string
}) => {
  const { error_code } = error;

  if ( authErrors.includes(error_code) ) {
    await plaidWebhookFunctions.handleItemError({ item, data: { error }});
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