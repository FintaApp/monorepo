import { Security } from "plaid";

import { SecurityTableFields, TableConfig } from "~/types/shared/models";

export const security = {
  new: ({ security, tableConfigFields }: { security: Security, tableConfigFields: TableConfig['fields'] }) => {
    const formattedSecurity = {
      [SecurityTableFields.ID]: security.security_id,
      [SecurityTableFields.NAME]: security.name,
      [SecurityTableFields.SYMBOL]: security.ticker_symbol,
      [SecurityTableFields.CLOSE_PRICE]: security.close_price ?? (security.type === 'cash' ? 1 : undefined ),
      [SecurityTableFields.CLOSE_PRICE_AS_OF]: security.close_price_as_of,
      [SecurityTableFields.TYPE]: security.type,
    };
  
    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedSecurity[field.field];
      return [ field.field_id, value ]
    }))
  },
  updated: ({ security, tableConfigFields }: { security: Security; tableConfigFields: TableConfig['fields'] }) => {
    const formattedSecurity = {
      [SecurityTableFields.CLOSE_PRICE]: security.close_price || (security.type === 'cash' ? 1 : undefined ),
      [SecurityTableFields.CLOSE_PRICE_AS_OF]: security.close_price_as_of
    };

    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedSecurity[field.field];
      return [ field.field_id, value ]
    }))
  }
}
