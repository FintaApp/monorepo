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
      [TransactionsTableFields.SUMMARY]: transaction.name,
      [TransactionsTableFields.DATE]: transaction.date,
      [TransactionsTableFields.ACCOUNT]: [ accountRecordId ],
      [TransactionsTableFields.CATEGORY]: categoryRecordId ? [ categoryRecordId ] : undefined,
      [TransactionsTableFields.AMOUNT]: -transaction.amount,
      [TransactionsTableFields.CURRENCY]: transaction.iso_currency_code,
      [TransactionsTableFields.PENDING]: transaction.pending,
      [TransactionsTableFields.ID]: transaction.transaction_id,
      [TransactionsTableFields.SUB_ACCOUNT]: transaction.account_owner
    };
  
    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedTransaction[field.field];
      return [ field.field_id, value ]
    }))
  },
  updated: ({ transaction, tableConfigFields, shouldOverrideTransactionName, oldTransactionSummary }: {
    transaction: Transaction;
    tableConfigFields: TableConfig['fields'],
    shouldOverrideTransactionName: boolean;
    oldTransactionSummary: string;
  }) => {
    const formattedTransaction = {
      [TransactionsTableFields.SUMMARY]: shouldOverrideTransactionName ? transaction.name : oldTransactionSummary,
      [TransactionsTableFields.ID]: transaction.transaction_id,
      [TransactionsTableFields.AMOUNT]: -transaction.amount,
      [TransactionsTableFields.PENDING]: transaction.pending,
      [TransactionsTableFields.SUB_ACCOUNT]: transaction.account_owner
    };
  
    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedTransaction[field.field];
      return [ field.field_id, value ]
    }))
  }
}
