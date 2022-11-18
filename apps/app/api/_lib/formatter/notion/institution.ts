import moment from "moment-timezone";

import { PlaidItemModel } from "../../types"
import { TableConfigFields, InstitutionsTableFields } from "@finta/types";

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
      // eslint-disable-next-line
      [userDefinedField]: formattedItem[tableConfigField]
    }), {} as Record<string, string>);
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
      // eslint-disable-next-line
      [userDefinedField]: formattedItem[tableConfigField]
    }), {} as Record<string, string>);
  }
}