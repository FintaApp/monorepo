import { graphql } from "~/graphql/backend";
import { removeItem } from "./plaid";
import { PlaidItemModel } from "~/types/backend/models";

export const disablePlaidItem = async (plaidItem: PlaidItemModel) => {
  const { accessToken } = plaidItem;
  return removeItem({ accessToken })
  .then(async response => {
    return Promise.all([
      graphql.DeleteDestinationAccounts({ where: { account: { plaid_item_id: { _eq: plaidItem.id }}}}),
      graphql.UpdatePlaidItem({ plaid_item_id: plaidItem.id, _set: { disabled_at: new Date() }})
    ]).then(() => response)
  })
}