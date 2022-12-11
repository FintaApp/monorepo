import { Transaction } from "plaid";

import { TransactionsTableFields, TableConfigFields } from "~/types/shared/models";

export const transaction = {
  new: ({ transaction, accountRecordId, categoryRecordId, tableConfigFields }: {
    transaction: Transaction;
    accountRecordId: string;
    categoryRecordId?: string;
    tableConfigFields: Record<TableConfigFields, string> | {}
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
  
    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      // eslint-disable-next-line
      [userDefinedField]: formattedTransaction[tableConfigField as keyof typeof formattedTransaction]
    }), {} as Record<string, any>);
  },
  updated: ({ transaction, tableConfigFields, shouldOverrideTransactionName, oldTransactionRecord }: {
    transaction: Transaction;
    tableConfigFields: Record<TableConfigFields, string> | {},
    shouldOverrideTransactionName: boolean;
    oldTransactionRecord: {
      fields: {
        [field: string]: any;
      }
    }
  }) => {
    const formattedTransaction = {
      [TransactionsTableFields.SUMMARY]: shouldOverrideTransactionName ? transaction.name : oldTransactionRecord.fields.Summary,
      [TransactionsTableFields.ID]: transaction.transaction_id,
      [TransactionsTableFields.AMOUNT]: -transaction.amount,
      [TransactionsTableFields.PENDING]: transaction.pending,
      [TransactionsTableFields.SUB_ACCOUNT]: transaction.account_owner
    };
  
    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      // eslint-disable-next-line
      [userDefinedField]: formattedTransaction[tableConfigField as keyof typeof formattedTransaction]
    }), {} as Record<string, any>);
  }
}
