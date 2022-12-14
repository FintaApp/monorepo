import { Holding } from "plaid";

import { HoldingsTableFields, TableConfig } from "~/types/shared/models";

export const holding = {
  new: ({ holding, accountRecordId, securityRecordId, symbol, tableConfigFields }: {
    holding: Holding;
    accountRecordId: string;
    securityRecordId: string;
    symbol: string;
    tableConfigFields: TableConfig['fields']
  }) => {
    const formattedHolding = {
      [HoldingsTableFields.ACCOUNT]: { relation: [{ id: accountRecordId }]},
      [HoldingsTableFields.COST_BASIS]: { number: holding.cost_basis },
      [HoldingsTableFields.CURRENCY]: { select: { name: holding.iso_currency_code }},
      [HoldingsTableFields.QUANTITY]: { number: holding.quantity },
      [HoldingsTableFields.SECURITY_ID]: { relation: [{ id: securityRecordId }]},
      [HoldingsTableFields.SUMMARY]: { title: [{ text: { content: `${symbol} Holding` || "" }}]}
    };
  
    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedHolding[field.field];
      return [ field.field_id, value ]
    }))
  },
  updated: ({ holding, tableConfigFields }: {
    holding: Holding;
    tableConfigFields: TableConfig['fields']
  }) => {
    const formattedHolding = {
      [HoldingsTableFields.COST_BASIS]: { number: holding.cost_basis },
      [HoldingsTableFields.CURRENCY]: { select: { name: holding.iso_currency_code }},
      [HoldingsTableFields.QUANTITY]: { number: holding.quantity }
    }
  
    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedHolding[field.field];
      return [ field.field_id, value ]
    }))
  }
}
