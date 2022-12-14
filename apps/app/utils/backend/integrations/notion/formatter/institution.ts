import moment from "moment-timezone";

import { PlaidItemModel } from "~/types/backend/models"
import { InstitutionsTableFields, TableConfig } from "~/types/shared/models";

export const institution = {
  new: ({ item, tableConfigFields }: { 
    item: PlaidItemModel;
    tableConfigFields: TableConfig['fields']
  }) => {
    const formattedItem = {
      [InstitutionsTableFields.ID]: { rich_text: [{ text: { content: item.id }}]},
      [InstitutionsTableFields.NAME]: { title: [{ text: { content: item.institution.name }}]},
      [InstitutionsTableFields.ERROR]: { rich_text: [{ text: { content: item.error || "" }}]}
    };

    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedItem[field.field];
      return [ field.field_id, value ]
    }))
  },
  updated: ({ item, tableConfigFields, timezone }: { 
    item: PlaidItemModel;
    tableConfigFields: TableConfig['fields'],
    timezone?: string
  }) => {
    const formattedItem = {
      [InstitutionsTableFields.LAST_UPDATE]: { date: { start: (timezone ? moment.tz(timezone) : moment()).toISOString(true) }},
      [InstitutionsTableFields.ERROR]: { rich_text: [{ text: { content: item.error || "" }}]}
    };

    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedItem[field.field];
      return [ field.field_id, value ]
    }))
  }
}