import { Holding } from "plaid";
import { TableConfig, HoldingsTableFields } from "~/types/shared/models";

export const holding = {
  new: ({ holding, tableConfigFields }: { 
    holding: Holding;
    tableConfigFields: TableConfig['fields']
  }) => {
    const formattedHolding = {
      [HoldingsTableFields.ACCOUNT]: holding.account_id,
      [HoldingsTableFields.COST_BASIS]: holding.cost_basis,
      [HoldingsTableFields.CURRENCY]: holding.iso_currency_code,
      [HoldingsTableFields.QUANTITY]: holding.quantity,
      [HoldingsTableFields.SECURITY_ID]: holding.security_id,
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
      [HoldingsTableFields.COST_BASIS]: holding.cost_basis,
      [HoldingsTableFields.CURRENCY]: holding.iso_currency_code,
      [HoldingsTableFields.QUANTITY]: holding.quantity,
    };

    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedHolding[field.field];
      return [ field.field_id, value ]
    }))
  }
}