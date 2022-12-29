import moment from "moment-timezone";
import { PlaidItemModel } from "~/types/backend/models"
import { InstitutionsTableFields, TableConfig } from "~/types/shared/models";

export const institution = {
  new: ({ item, headerValues, tableConfigFields }: { 
    item: PlaidItemModel;
    headerValues: string[];
    tableConfigFields: TableConfig['fields']
  }) => {
    const formattedItem = {
      [InstitutionsTableFields.ID]: item.id,
      [InstitutionsTableFields.NAME]: item.institution.name,
      [InstitutionsTableFields.ERROR]: item.error || "",
      [InstitutionsTableFields.LAST_UPDATE]: moment().toISOString()
    };

    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedItem[field.field as keyof typeof formattedItem];
      return [ field.field_id, value ]
    }))

    //return headerValues.map(headerValue => userFieldMapping[headerValue] || undefined)
  },
  updated: ({ item, headerValues, tableConfigFields }: { 
    item: PlaidItemModel;
    headerValues: string[];
    tableConfigFields: TableConfig['fields']
  }) => {
    const formattedItem = {
      [InstitutionsTableFields.ID]: item.id,
      [InstitutionsTableFields.NAME]: item.institution.name,
      [InstitutionsTableFields.ERROR]: item.error || "",
      [InstitutionsTableFields.LAST_UPDATE]: moment().toISOString()
    };

    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedItem[field.field as keyof typeof formattedItem];
      return [ field.field_id, value ]
    }))

    //return headerValues.map(headerValue => userFieldMapping[headerValue] || undefined)
  }
}