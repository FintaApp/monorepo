import { Field } from "@prisma/client";
import { HoldingFormatter } from "../../base/types";

export const holding = {
  new: ({ holding, accountRecordId, securityRecordId, symbol }) => {
    return {
      [Field.Account]: accountRecordId ? [ accountRecordId ] : undefined,
      [Field.CostBasis]: holding.cost_basis,
      [Field.Currency]: holding.iso_currency_code,
      [Field.Quantity]: holding.quantity,
      [Field.Security]: securityRecordId ? [ securityRecordId ] : undefined,
      [Field.Summary]: `${symbol} Holding`
    }
  },
  updated: ({ holding }) => {
    return {
      [Field.CostBasis]: holding.cost_basis,
      [Field.Currency]: holding.iso_currency_code,
      [Field.Quantity]: holding.quantity
    }
  }
} as HoldingFormatter