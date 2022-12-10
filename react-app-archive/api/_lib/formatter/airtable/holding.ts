import { Holding } from "plaid";

import { HoldingsTableFields, TableConfigFields } from "@finta/types";

export const holding = {
  new: ({ holding, accountRecordId, securityRecordId, symbol, tableConfigFields }: {
    holding: Holding;
    accountRecordId: string;
    securityRecordId?: string;
    symbol: string;
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedHolding = {
      [HoldingsTableFields.ACCOUNT]: [ accountRecordId ],
      [HoldingsTableFields.COST_BASIS]: holding.cost_basis,
      [HoldingsTableFields.CURRENCY]: holding.iso_currency_code,
      [HoldingsTableFields.QUANTITY]: holding.quantity,
      [HoldingsTableFields.SECURITY_ID]: [ securityRecordId ],
      [HoldingsTableFields.SUMMARY]: `${symbol} Holding`
    };
  
    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedHolding[tableConfigField as keyof typeof formattedHolding]
    }), {} as Record<string, any>);
  },
  updated: ({ holding, tableConfigFields }: {
    holding: Holding;
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedHolding = {
      [HoldingsTableFields.COST_BASIS]: holding.cost_basis,
      [HoldingsTableFields.CURRENCY]: holding.iso_currency_code,
      [HoldingsTableFields.QUANTITY]: holding.quantity
    }
  
    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedHolding[tableConfigField as keyof typeof formattedHolding]
    }), {} as Record<string, any>);
  }
}
