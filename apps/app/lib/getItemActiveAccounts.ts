import { handlePlaidError } from "~/pages/api/oauth/_helpers";
import { getAccounts } from "~/lib/plaid";
import { Logger } from "next-axiom";
import { PlaidError } from "plaid";
import { OauthItem } from "~/types";

export const getItemActiveAccounts = async ({ item, logger }: { item: OauthItem; logger: Logger}) => {
  const { accountIds: validAccountIds, hasAuthError } = await getAccounts({ accessToken: item.accessToken })
    .then(response => ({ accountIds: response.data.accounts.map(account => account.account_id), hasAuthError: false }))
    .catch(async err => {
      const error = err.response.data as PlaidError;
      const errorCode = error.error_code;
      logger.warn("Plaid Error", { error });
      if ( ['INVALID_API_KEYS', 'INVALID_ACCESS_TOKEN'].includes(errorCode) ) { throw new Error(errorCode)}
      const { hasAuthError } = await handlePlaidError({ error, item, logger });
      return { accountIds: [] as string[], hasAuthError }
    })
  if ( hasAuthError ) { return { accountIds: [], hasAuthError }};

  return {
    accountIds: validAccountIds,
    hasAuthError: false
  }
}