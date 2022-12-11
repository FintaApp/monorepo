import moment from "moment-timezone";

import { PlaidItemModel } from "~/types/backend/models"
import { TableConfigFields, InstitutionsTableFields } from "~/types/shared/models";

export const institution = {
  new: ({ item, tableConfigFields }: { 
    item: PlaidItemModel;
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedItem = {
      [InstitutionsTableFields.ID]: { rich_text: [{ text: { content: item.id }}]},
      [InstitutionsTableFields.NAME]: { title: [{ text: { content: item.institution.name }}]},
      [InstitutionsTableFields.ERROR]: { rich_text: [{ text: { content: item.error || "" }}]}
    };

    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedItem[tableConfigField as keyof typeof formattedItem]
    }), {} as Record<string, any>);
  },
  updated: ({ item, tableConfigFields, timezone }: { 
    item: PlaidItemModel;
    tableConfigFields: Record<TableConfigFields, string> | {},
    timezone?: string
  }) => {
    const formattedItem = {
      [InstitutionsTableFields.LAST_UPDATE]: { date: { start: (timezone ? moment.tz(timezone) : moment()).toISOString(true) }}
    };

    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedItem[tableConfigField as keyof typeof formattedItem]
    }), {} as Record<string, any>);
  }
}