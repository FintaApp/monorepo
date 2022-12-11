import { PendingExpirationWebhook } from "plaid";

import { graphql } from "~/graphql/backend";
import { PlaidItemModel } from "~/types/backend/models";
import { Logger } from "../logger";

export const handlePendingExpiration = async ({ item, data, logger }: { item: PlaidItemModel; data: PendingExpirationWebhook; logger: Logger }) => {
  const { consent_expiration_time } = data;
  await graphql.UpdatePlaidItem({ plaidItemId: item.id, _set: { consentExpiresAt: consent_expiration_time }})
    .then(response => logger.info("Plaid item updated", { response }))
}