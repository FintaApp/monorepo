import { InstitutionsTableFields, TableConfig } from "~/types/shared/models";
import { PlaidItemModel } from "~/types/backend/models";
import moment from "moment-timezone";

export const institution = {
  new: ({ item, tableConfigFields }: { item: PlaidItemModel, tableConfigFields: TableConfig['fields'] }) => {
    const formattedItem = {
      [InstitutionsTableFields.ID]: item.id,
      [InstitutionsTableFields.NAME]: item.institution.name,
      [InstitutionsTableFields.ERROR]: item.error
    };
  
    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedItem[field.field];
      return [ field.field_id, value ]
    }))
  },
  updated: ({ item, tableConfigFields }: { item: PlaidItemModel; tableConfigFields: TableConfig['fields'] }) => {
    const formattedItem = {
      [InstitutionsTableFields.LAST_UPDATE]: moment().toISOString(true),
      [InstitutionsTableFields.ERROR]: item.error
    }

    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedItem[field.field];
      return [ field.field_id, value ]
    }))
  }
}
