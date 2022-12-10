import { Security } from "plaid";
import { TableConfigFields, SecurityTableFields } from "@finta/types";

export const security = {
  new: ({ security, headerValues, tableConfigFields }: { 
    security: Security;
    headerValues: string[];
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedSecurity = {
      [SecurityTableFields.ID]: security.security_id,
      [SecurityTableFields.NAME]: security.name,
      [SecurityTableFields.SYMBOL]: security.ticker_symbol,
      [SecurityTableFields.CLOSE_PRICE]: security.close_price ?? (security.type === 'cash' ? 1 : undefined ),
      [SecurityTableFields.CLOSE_PRICE_AS_OF]: security.close_price_as_of,
      [SecurityTableFields.TYPE]: security.type,
    };

    const userFieldMapping = Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedSecurity[tableConfigField as keyof typeof formattedSecurity]
    }), {} as Record<string, any>);

    return headerValues.map(headerValue => userFieldMapping[headerValue] || undefined)
  },
  updated: ({ security, headerValues, tableConfigFields }: { 
    security: Security;
    headerValues: string[];
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedSecurity = {
      [SecurityTableFields.CLOSE_PRICE]: security.close_price || (security.type === 'cash' ? 1 : undefined ),
      [SecurityTableFields.CLOSE_PRICE_AS_OF]: security.close_price_as_of
    };

    const userFieldMapping = Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedSecurity[tableConfigField as keyof typeof formattedSecurity]
    }), {} as Record<string, any>);

    return headerValues.map(headerValue => userFieldMapping[headerValue] || undefined)
  }
}