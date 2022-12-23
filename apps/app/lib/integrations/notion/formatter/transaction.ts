import { Field } from "@prisma/client";
import { TransactionFormatter } from "../../base/types";

export const transaction = {
  new: ({ transaction, accountRecordId, categoryRecordId }) => {
    return {
      [Field.Summary]: { title: [{ text: { content: transaction.name || transaction.merchant_name || "" }}]},
      [Field.Date]: transaction.date ? { date: { start: transaction.date }} : undefined,
      [Field.Account]: categoryRecordId ? { relation: [{ id: accountRecordId }]} : undefined,
      [Field.Category]: categoryRecordId ? { relation: [{ id: categoryRecordId }]} : undefined,
      [Field.Amount]: { number: -transaction.amount },
      [Field.Currency]: { select: { name: transaction.iso_currency_code }},
      [Field.IsPending]: { checkbox: transaction.pending },
      [Field.Id]: { rich_text: [{ text: { content: transaction.transaction_id }}]},
      [Field.SubAccount]: transaction.account_owner ? { rich_text: [{ text: { content: transaction.account_owner }}]} : undefined
    }
  },
  updated: ({ transaction }) => {
    return {
      [Field.Id]: { rich_text: [{ text: { content: transaction.transaction_id }}]},
      [Field.Amount]:{ number: -transaction.amount },
      [Field.IsPending]: { checkbox: transaction.pending },
      [Field.SubAccount]: transaction.account_owner ? { rich_text: [{ text: { content: transaction.account_owner }}]} : undefined
    }
  }
} as TransactionFormatter