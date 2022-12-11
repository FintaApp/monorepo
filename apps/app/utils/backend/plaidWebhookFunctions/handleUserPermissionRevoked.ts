import { disablePlaidItem } from "../disablePlaidItem";
import * as segment from "~/utils/backend/analytics";
import { PlaidItemModel } from "~/types/backend/models";

export const handleUserPermissionRevoked = async ({ item }: { item: PlaidItemModel; }) => {
  await disablePlaidItem(item)
  .then(() => segment.trackInstitutionConsentRevoked({ userId: item.user.id, institution: item.institution.name }))
}