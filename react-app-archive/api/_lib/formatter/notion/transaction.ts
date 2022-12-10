import { Transaction } from "plaid";

import { TransactionsTableFields, TableConfigFields } from "@finta/types";

export const transaction = {
  new: ({ transaction, accountPageId, categoryPageId, tableConfigFields }: {
    transaction: Transaction;
    accountPageId: string;
    categoryPageId?: string;
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedTransaction = {
      [TransactionsTableFields.SUMMARY]: { title: [{ text: { content: transaction.name || transaction.merchant_name || "" }}]},
      [TransactionsTableFields.DATE]: transaction.date ? { date: { start: transaction.date }} : undefined,
      [TransactionsTableFields.ACCOUNT]: { relation: [{ id: accountPageId }]},
      [TransactionsTableFields.CATEGORY]: categoryPageId ? { relation: [{ id: categoryPageId }]} : undefined,
      [TransactionsTableFields.AMOUNT]: { number: -transaction.amount },
      [TransactionsTableFields.CURRENCY]: { select: { name: transaction.iso_currency_code }},
      [TransactionsTableFields.PENDING]: { checkbox: transaction.pending },
      [TransactionsTableFields.ID]: { rich_text: [{ text: { content: transaction.transaction_id }}]},
      [TransactionsTableFields.SUB_ACCOUNT]: transaction.account_owner ? { rich_text: [{ text: { content: transaction.account_owner }}]} : undefined
    };
  
    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedTransaction[tableConfigField as keyof typeof formattedTransaction]
    }), {} as Record<string, any>);
  },
  updated: ({ transaction, tableConfigFields }: {
    transaction: Transaction;
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedTransaction = {
      [TransactionsTableFields.SUMMARY]: { title: [{ text: { content: transaction.name || transaction.merchant_name }}]},
      [TransactionsTableFields.ID]: { rich_text: [{ text: { content: transaction.transaction_id }}]},
      [TransactionsTableFields.AMOUNT]:{ number: -transaction.amount },
      [TransactionsTableFields.PENDING]: { checkbox: transaction.pending },
      [TransactionsTableFields.SUB_ACCOUNT]: transaction.account_owner ? { rich_text: [{ text: { content: transaction.account_owner }}]} : undefined
    };


  
    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedTransaction[tableConfigField as keyof typeof formattedTransaction]
    }), {} as Record<string, any>);
  }
}
