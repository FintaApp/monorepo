import { Transaction } from "plaid";
import { TableConfigFields, TransactionsTableFields } from "@finta/types";

export const transaction = {
  new: ({ transaction, headerValues, tableConfigFields }: { 
    transaction: Transaction;
    headerValues: string[];
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedAccount = {
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

    const userFieldMapping = Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      // eslint-disable-next-line
      [userDefinedField]: formattedAccount[tableConfigField]
    }), {} as Record<string, string>);

    return headerValues.map(headerValue => userFieldMapping[headerValue] || undefined)
  },
  updated: ({ transaction, headerValues, tableConfigFields }: { 
    transaction: Transaction;
    headerValues: string[];
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedAccount = {
      [TransactionsTableFields.SUMMARY]: transaction.name,
      [TransactionsTableFields.AMOUNT]: -transaction.amount,
      [TransactionsTableFields.ID]: transaction.transaction_id,
      [TransactionsTableFields.SUB_ACCOUNT]: transaction.account_owner
    };

    const userFieldMapping = Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      // eslint-disable-next-line
      [userDefinedField]: formattedAccount[tableConfigField]
    }), {} as Record<string, string>);

    return headerValues.map(headerValue => userFieldMapping[headerValue] || undefined)
  }
}