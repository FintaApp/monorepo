import { Transaction } from "plaid";

import { TransactionsTableFields, TableConfig } from "~/types/shared/models";

export const transaction = {
  new: ({ transaction, accountRecordId, categoryRecordId, tableConfigFields }: {
    transaction: Transaction;
    accountRecordId: string;
    categoryRecordId?: string;
    tableConfigFields: TableConfig['fields']
  }) => {

    const formattedTransaction = {
      [TransactionsTableFields.SUMMARY]: { title: [{ text: { content: transaction.name || transaction.merchant_name || "" }}]},
      [TransactionsTableFields.DATE]: transaction.date ? { date: { start: transaction.date }} : undefined,
      [TransactionsTableFields.ACCOUNT]: { relation: [{ id: accountRecordId }]},
      [TransactionsTableFields.CATEGORY]: categoryRecordId ? { relation: [{ id: categoryRecordId }]} : undefined,
      [TransactionsTableFields.AMOUNT]: { number: -transaction.amount },
      [TransactionsTableFields.CURRENCY]: { select: { name: transaction.iso_currency_code }},
      [TransactionsTableFields.PENDING]: { checkbox: transaction.pending },
      [TransactionsTableFields.ID]: { rich_text: [{ text: { content: transaction.transaction_id }}]},
      [TransactionsTableFields.SUB_ACCOUNT]: transaction.account_owner ? { rich_text: [{ text: { content: transaction.account_owner }}]} : undefined
    };

    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedTransaction[field.field];
      return [ field.field_id, value ]
    }))
  },
  updated: ({ transaction, tableConfigFields, shouldOverrideTransactionName, oldTransactionSummary }: {
    transaction: Transaction;
    tableConfigFields: TableConfig['fields'];
    shouldOverrideTransactionName: boolean;
    oldTransactionSummary: string;
  }) => {
    const formattedTransaction = {
      [TransactionsTableFields.SUMMARY]: { title: [{ text: { content: shouldOverrideTransactionName ? transaction.name || transaction.merchant_name : oldTransactionSummary }}]},
      [TransactionsTableFields.ID]: { rich_text: [{ text: { content: transaction.transaction_id }}]},
      [TransactionsTableFields.AMOUNT]:{ number: -transaction.amount },
      [TransactionsTableFields.PENDING]: { checkbox: transaction.pending },
      [TransactionsTableFields.SUB_ACCOUNT]: transaction.account_owner ? { rich_text: [{ text: { content: transaction.account_owner }}]} : undefined
    };

    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedTransaction[field.field];
      return [ field.field_id, value ]
    }))
  }
}
