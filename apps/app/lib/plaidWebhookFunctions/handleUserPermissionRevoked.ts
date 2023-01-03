import { trackInstitutionConsentRevoked } from "../analytics";
import { logInstitutionDeleted } from "../logsnag";
import { db } from "../db";
import { PlaidWebhookItem } from "~/types";


export const handleUserPermissionRevoked = async ({ item }: { item: PlaidWebhookItem; }) => {
  return Promise.all([
    trackInstitutionConsentRevoked({ userId: item.userId, institution: item.institution.name, itemId: item.id }),

    logInstitutionDeleted({ institution: item.institution.name, userId: item.userId, itemId: item.id }),

    db.plaidItem.update({ where: { id: item.id }, data: { disabledAt: new Date() }}),
  ])
}