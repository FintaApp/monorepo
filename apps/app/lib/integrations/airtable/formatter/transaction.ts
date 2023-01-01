import { Field } from "@prisma/client";
import { TransactionFormatter } from "../../base/types";

export const transaction = {
  new: ({ transaction, accountRecordId, categoryRecordId }) => {
    return {
      [Field.Summary]: transaction.name,
      [Field.Date]: transaction.date,
      [Field.Account]: [ accountRecordId ],
      [Field.Category]: categoryRecordId ? [ categoryRecordId ] : undefined,
      [Field.Amount]: -transaction.amount,
      [Field.Currency]: transaction.iso_currency_code,
      [Field.IsPending]: transaction.pending,
      [Field.Id]: transaction.transaction_id,
      [Field.SubAccount]: transaction.account_owner
    }
  },
  updated: ({ transaction }) => {
    return {
      [Field.Id]: transaction.transaction_id,
      [Field.Amount]: -transaction.amount,
      [Field.IsPending]: transaction.pending,
      [Field.SubAccount]: transaction.account_owner
    }
  }
} as TransactionFormatter