import { Field } from "@prisma/client";
import { HoldingFormatter } from "../../base/types";

export const holding = {
  new: ({ holding }) => {
    return {
      [Field.Account]: holding.account_id,
      [Field.CostBasis]: holding.cost_basis,
      [Field.Currency]: holding.iso_currency_code,
      [Field.Quantity]: holding.quantity,
      [Field.Security]: holding.security_id
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