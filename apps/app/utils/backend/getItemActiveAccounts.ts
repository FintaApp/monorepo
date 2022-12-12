import { handlePlaidError } from "~/pages/api/oauth/_helpers";
import * as plaid from "./plaid";
import { graphql } from "~/graphql/backend";
import { PlaidItemModel } from "~/types/backend/models";
import { Logger } from "./logger";

export const getItemActiveAccounts = async (item: PlaidItemModel, logger: Logger, plaidEnv?: string ) => {
  const { accessToken } = item;
  const { accountIds: validAccountIds, hasAuthError } = await plaid.getAccounts({ accessToken })
    .then(response => ({ accountIds: response.data.accounts.map(account => account.account_id), hasAuthError: false }))
    .catch(async err => {
      const error = err.response.data;
      console.log(error)
      if ( ['INVALID_API_KEYS', 'INVALID_ACCESS_TOKEN'].includes(error.error_code) ) { throw new Error(error.error_code)}
      const { hasAuthError } = await handlePlaidError({ error, item, logger });
      return { accountIds: [] as string[], hasAuthError }
    })

  if ( hasAuthError ) {
    return { accountIds: [], hasAuthError }
  }

  const newlyClosedAccounts = item.accounts
    .filter(account => !validAccountIds.includes(account.id))
    .map(account => account.id);

  // if ( newlyClosedAccounts.length > 0 ) {
  //   Promise.all([
  //     graphql.UpdatePlaidAccounts({
  //       where: { id: { _in: newlyClosedAccounts }},
  //       _set: { is_closed: true }
  //     }),
  //     graphql.DeleteDestinationAccounts({ where: { account_id: { _in: newlyClosedAccounts }}})
  //   ])
  // }

  return { 
    accountIds: item.accounts
      .filter(account => !newlyClosedAccounts.includes(account.id))
      .map(account => account.id),
    hasAuthError: false
  }
}