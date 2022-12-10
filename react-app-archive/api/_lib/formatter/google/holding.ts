import { Holding } from "plaid";
import { TableConfigFields, HoldingsTableFields } from "@finta/types";

export const holding = {
  new: ({ holding, headerValues, tableConfigFields }: { 
    holding: Holding;
    headerValues: string[];
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedHolding = {
      [HoldingsTableFields.ACCOUNT]: holding.account_id,
      [HoldingsTableFields.COST_BASIS]: holding.cost_basis,
      [HoldingsTableFields.CURRENCY]: holding.iso_currency_code,
      [HoldingsTableFields.QUANTITY]: holding.quantity,
      [HoldingsTableFields.SECURITY_ID]: holding.security_id,
    };

    const userFieldMapping = Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      // eslint-disable-next-line
      [userDefinedField]: formattedHolding[tableConfigField as keyof typeof formattedHolding]
    }), {} as Record<string, any>);

    return headerValues.map(headerValue => userFieldMapping[headerValue] || undefined)
  },
  updated: ({ holding, headerValues, tableConfigFields }: { 
    holding: Holding;
    headerValues: string[];
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedHolding = {
      [HoldingsTableFields.COST_BASIS]: holding.cost_basis,
      [HoldingsTableFields.CURRENCY]: holding.iso_currency_code,
      [HoldingsTableFields.QUANTITY]: holding.quantity,
    };

    const userFieldMapping = Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      // eslint-disable-next-line
      [userDefinedField]: formattedHolding[tableConfigField as keyof typeof formattedHolding]
    }), {} as Record<string, any>);

    return headerValues.map(headerValue => userFieldMapping[headerValue] || undefined)
  }
}