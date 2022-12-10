import { PendingExpirationWebhook } from "plaid";

import { graphql } from "../graphql";
import { PlaidItemModel } from "../types";

export const handlePendingExpiration = async ({ item, data }: { item: PlaidItemModel; data: PendingExpirationWebhook }) => {
  const { consent_expiration_time } = data;
  await graphql.UpdatePlaidItem({ plaid_item_id: item.id, _set: { consentExpiresAt: consent_expiration_time }})
}