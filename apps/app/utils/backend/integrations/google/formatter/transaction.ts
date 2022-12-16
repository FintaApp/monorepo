import { Transaction } from "plaid";
import { TableConfig, TransactionsTableFields } from "~/types/shared/models";

export const transaction = {
  new: ({ transaction, tableConfigFields }: { 
    transaction: Transaction;
    tableConfigFields: TableConfig['fields']
  }) => {
    const formattedTransaction = {
      [TransactionsTableFields.SUMMARY]: transaction.name,
      [TransactionsTableFields.DATE]: transaction.date,
      [TransactionsTableFields.ACCOUNT]: transaction.account_id,
      [TransactionsTableFields.CATEGORY]: transaction.category_id,
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
    tableConfigFields: TableConfig['fields'];
    shouldOverrideTransactionName: boolean;
    oldTransactionSummary: string;
  }) => {
    const formattedTransaction = {
      [TransactionsTableFields.SUMMARY]: shouldOverrideTransactionName ? transaction.name : oldTransactionSummary,
      [TransactionsTableFields.AMOUNT]: -transaction.amount,
      [TransactionsTableFields.ID]: transaction.transaction_id,
      [TransactionsTableFields.SUB_ACCOUNT]: transaction.account_owner
    };

    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedTransaction[field.field];
      return [ field.field_id, value ]
    }))
  }
}