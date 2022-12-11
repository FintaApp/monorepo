import { Security } from "plaid";

import { SecurityTableFields, TableConfigFields } from "~/types/shared/models";

export const security = {
  new: ({ security, tableConfigFields }: { security: Security, tableConfigFields: Record<TableConfigFields, string> | {} }) => {
    const formattedSecurity = {
      [SecurityTableFields.ID]: { rich_text: [{ text: { content: security.security_id }}]},
      [SecurityTableFields.NAME]: { rich_text: [{ text: { content: security.name || "" }}]},
      [SecurityTableFields.SYMBOL]: { title: [{ text: { content: security.ticker_symbol || security.name || "" }}]},
      [SecurityTableFields.CLOSE_PRICE]: security.close_price ? { number: security.close_price ?? (security.type === 'cash' ? 1 : undefined )} : undefined,
      [SecurityTableFields.CLOSE_PRICE_AS_OF]: security.close_price_as_of ? { date: { start: security.close_price_as_of }} : undefined,
      [SecurityTableFields.TYPE]: { select: { name: security.type }},
    };
  
    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedSecurity[tableConfigField as keyof typeof formattedSecurity]
    }), {} as Record<string, any>);
  },
  updated: ({ security, tableConfigFields }: { security: Security; tableConfigFields: Record<TableConfigFields, string> | {} }) => {
    const formattedSecurity = {
      [SecurityTableFields.CLOSE_PRICE]: security.close_price ? { number: security.close_price || (security.type === 'cash' ? 1 : undefined )} : undefined,
      [SecurityTableFields.CLOSE_PRICE_AS_OF]: security.close_price_as_of ? { date: { start: security.close_price_as_of }} : undefined
    };

    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedSecurity[tableConfigField as keyof typeof formattedSecurity]
    }), {} as Record<string, any>);
  }
}
