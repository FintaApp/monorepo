import { Security } from "plaid";

import { SecurityTableFields, TableConfigFields } from "~/types/shared/models";

export const security = {
  new: ({ security, tableConfigFields }: { security: Security, tableConfigFields: Record<TableConfigFields, string> | {} }) => {
    const formattedSecurity = {
      [SecurityTableFields.ID]: security.security_id,
      [SecurityTableFields.NAME]: security.name,
      [SecurityTableFields.SYMBOL]: security.ticker_symbol,
      [SecurityTableFields.CLOSE_PRICE]: security.close_price ?? (security.type === 'cash' ? 1 : undefined ),
      [SecurityTableFields.CLOSE_PRICE_AS_OF]: security.close_price_as_of,
      [SecurityTableFields.TYPE]: security.type,
    };
  
    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      // eslint-disable-next-line
      [userDefinedField]: formattedSecurity[tableConfigField as keyof typeof formattedSecurity]
    }), {} as Record<string, any>);
  },
  updated: ({ security, tableConfigFields }: { security: Security; tableConfigFields: Record<TableConfigFields, string> | {} }) => {
    const formattedSecurity = {
      [SecurityTableFields.CLOSE_PRICE]: security.close_price || (security.type === 'cash' ? 1 : undefined ),
      [SecurityTableFields.CLOSE_PRICE_AS_OF]: security.close_price_as_of
    };

    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      // eslint-disable-next-line
      [userDefinedField]: formattedSecurity[tableConfigField as keyof typeof formattedSecurity]
    }), {} as Record<string, any>);
  }
}
