import { Field } from "@prisma/client";
import { HoldingFormatter } from "../../base/types";

export const holding = {
  new: ({ holding: { cost_basis, iso_currency_code, quantity }, accountRecordId, securityRecordId, symbol }) => {
    return {
      [Field.Account]: accountRecordId ? { relation: [{ id: accountRecordId }]} : undefined,
      [Field.CostBasis]: cost_basis || cost_basis === 0 ? { number: cost_basis } : undefined,
      [Field.Currency]: iso_currency_code ? { select: { name: iso_currency_code }}: undefined,
      [Field.Quantity]: quantity || quantity === 0 ? { number: quantity } : undefined,
      [Field.Security]: securityRecordId ? { relation: [{ id: securityRecordId }]} : undefined,
      [Field.Summary]: { title: [{ text: { content: `${symbol} Holding` || "" }}]}
    }
  },
  updated: ({ holding: { cost_basis, iso_currency_code, quantity} }) => {
    return {
      [Field.CostBasis]: cost_basis || cost_basis === 0 ? { number: cost_basis } : undefined,
      [Field.Currency]: iso_currency_code ? { select: { name: iso_currency_code }}: undefined,
      [Field.Quantity]: quantity || quantity === 0 ? { number: quantity } : undefined
    }
  }
} as HoldingFormatter