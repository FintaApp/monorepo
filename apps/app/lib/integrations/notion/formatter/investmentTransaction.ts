import { Field } from "@prisma/client";
import { InvestmentTransactionFormatter } from "../../base/types";

export const investmentTransaction = {
  new: ({ investmentTransaction, accountRecordId, securityRecordId }) => {
    return {
      [Field.Account]: accountRecordId ? { relation: [{ id: accountRecordId }]} : undefined,
      [Field.Amount]: { number: ['deposit', 'withdrawal', 'dividend', 'cash'].includes(investmentTransaction.type) ? -investmentTransaction.amount : investmentTransaction.amount },
      [Field.Date]: investmentTransaction.date ? { date: { start: investmentTransaction.date }} : undefined,
      [Field.Fees]: { number: investmentTransaction.fees || 0 },
      [Field.Id]: { rich_text: [{ text: { content: investmentTransaction.investment_transaction_id }}]},
      [Field.Currency]: { select: { name: investmentTransaction.iso_currency_code || investmentTransaction.unofficial_currency_code }},
      [Field.Summary]: { title: [{ text: { content: investmentTransaction.name || "" }}]},
      [Field.Price]: { number: investmentTransaction.price },
      [Field.Quantity]: { number: ['sell'].includes(investmentTransaction.subtype) ? -investmentTransaction.quantity : investmentTransaction.quantity },
      [Field.Security]: securityRecordId ? { relation: [{ id: securityRecordId }]} : undefined,
      [Field.Subtype]: { select: { name: investmentTransaction.subtype }},
      [Field.Type]: { select: { name: investmentTransaction.type }},
    }
  }
} as InvestmentTransactionFormatter