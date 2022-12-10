import { Holding } from "plaid";

import { HoldingsTableFields, TableConfigFields } from "@finta/types";

export const holding = {
  new: ({ holding, accountPageId, securityPageId, symbol, tableConfigFields }: {
    holding: Holding;
    accountPageId: string;
    securityPageId: string;
    symbol: string;
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedHolding = {
      [HoldingsTableFields.ACCOUNT]: { relation: [{ id: accountPageId }]},
      [HoldingsTableFields.COST_BASIS]: { number: holding.cost_basis },
      [HoldingsTableFields.CURRENCY]: { select: { name: holding.iso_currency_code }},
      [HoldingsTableFields.QUANTITY]: { number: holding.quantity },
      [HoldingsTableFields.SECURITY_ID]: { relation: [{ id: securityPageId }]},
      [HoldingsTableFields.SUMMARY]: { title: [{ text: { content: `${symbol} Holding` || "" }}]}
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
      [HoldingsTableFields.COST_BASIS]: { number: holding.cost_basis },
      [HoldingsTableFields.CURRENCY]: { select: { name: holding.iso_currency_code }},
      [HoldingsTableFields.QUANTITY]: { number: holding.quantity }
    }
  
    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedHolding[tableConfigField as keyof typeof formattedHolding]
    }), {} as Record<string, any>);
  }
}
