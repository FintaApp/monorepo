import { PlaidItemModel } from "../../types";
import { OauthInstitution } from "@finta/types";

export const institution = ({ item }: { item: PlaidItemModel }): OauthInstitution => ({
  id: item.id,
  name: item.institution.name,
  created_at: item.created_at,
  synced_at: item.synced_at,
  error: item.error
})