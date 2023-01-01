import { PlaidInstitution, PlaidItem } from "@prisma/client";
import { OauthInstitution } from "@finta/shared";

interface Item extends PlaidItem {
  institution: PlaidInstitution
}

export const institution = ({ item }: { item: Item }): OauthInstitution => ({
  id: item.id,
  name: item.institution.name,
  created_at: item.createdAt.toISOString(),
  synced_at: item.lastSyncedAt.toISOString(),
  error: item.error
})