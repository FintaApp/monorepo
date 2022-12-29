import { InvestmentTransaction } from "plaid";

import { InvestmentTransactionsTableFields, TableConfig } from "~/types/shared/models";

export const investmentTransaction = {
  new: ({ investmentTransaction, accountRecordId, securityRecordId, tableConfigFields }: {
    investmentTransaction: InvestmentTransaction;
    accountRecordId: string;
    securityRecordId: string;
    tableConfigFields: TableConfig['fields']
  }) => {
    const formattedTransaction = {
      [InvestmentTransactionsTableFields.ACCOUNT]: [ accountRecordId ],
      [InvestmentTransactionsTableFields.AMOUNT]: ['deposit', 'withdrawal', 'dividend', 'cash'].includes(investmentTransaction.type) ? -investmentTransaction.amount : investmentTransaction.amount,
      [InvestmentTransactionsTableFields.DATE]: investmentTransaction.date,
      [InvestmentTransactionsTableFields.FEES]: investmentTransaction.fees || 0,
      [InvestmentTransactionsTableFields.ID]: investmentTransaction.investment_transaction_id,
      [InvestmentTransactionsTableFields.CURRENCY]: investmentTransaction.iso_currency_code || investmentTransaction.unofficial_currency_code,
      [InvestmentTransactionsTableFields.SUMMARY]: investmentTransaction.name,
      [InvestmentTransactionsTableFields.PRICE]: investmentTransaction.price,
      [InvestmentTransactionsTableFields.QUANTITY]: ['sell'].includes(investmentTransaction.subtype) ? -investmentTransaction.quantity : investmentTransaction.quantity,
      [InvestmentTransactionsTableFields.SECURITY_ID]: [ securityRecordId ],
      [InvestmentTransactionsTableFields.SUBTYPE]: investmentTransaction.subtype,
      [InvestmentTransactionsTableFields.TYPE]: investmentTransaction.type,
    }
  
    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedTransaction[field.field as keyof typeof formattedTransaction];
      return [ field.field_id, value ]
    }))
  }
}
