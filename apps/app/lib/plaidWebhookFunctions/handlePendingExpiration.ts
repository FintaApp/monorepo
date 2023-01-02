import { PendingExpirationWebhook } from "plaid";
import { Logger } from "next-axiom";

import { db } from "../db";
import { PlaidItem, PlaidAccount, PlaidInstitution } from "@prisma/client";

type Item = PlaidItem & {
  accounts: PlaidAccount[];
  institution: PlaidInstitution;
}

export const handlePendingExpiration = async ({ item, data, logger }: { item: Item; data: PendingExpirationWebhook; logger: Logger }) => {
  const { consent_expiration_time } = data;
  return db.plaidItem.update({ where: { id: item.id }, data: { consentExpiresAt: consent_expiration_time }})
    .then(response => logger.info("Plaid item consent expiration time updated", { response }))
}