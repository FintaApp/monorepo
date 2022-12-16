import { InvestmentTransaction } from "plaid";
import { TableConfig, InvestmentTransactionsTableFields } from "~/types/shared/models";

export const investmentTransaction = {
  new: ({ investmentTransaction, tableConfigFields }: { 
    investmentTransaction: InvestmentTransaction;
    tableConfigFields: TableConfig['fields']
  }) => {
    const formattedTransaction = {
      [InvestmentTransactionsTableFields.ACCOUNT]: investmentTransaction.account_id,
      [InvestmentTransactionsTableFields.AMOUNT]: ['deposit', 'withdrawal', 'dividend', 'cash'].includes(investmentTransaction.type) ? -investmentTransaction.amount : investmentTransaction.amount,
      [InvestmentTransactionsTableFields.DATE]: investmentTransaction.date,
      [InvestmentTransactionsTableFields.FEES]: investmentTransaction.fees || 0,
      [InvestmentTransactionsTableFields.ID]: investmentTransaction.investment_transaction_id,
      [InvestmentTransactionsTableFields.CURRENCY]: investmentTransaction.iso_currency_code || investmentTransaction.unofficial_currency_code,
      [InvestmentTransactionsTableFields.SUMMARY]: investmentTransaction.name,
      [InvestmentTransactionsTableFields.PRICE]: investmentTransaction.price,
      [InvestmentTransactionsTableFields.QUANTITY]: ['sell'].includes(investmentTransaction.subtype) ? -investmentTransaction.quantity : investmentTransaction.quantity,
      [InvestmentTransactionsTableFields.SECURITY_ID]: investmentTransaction.security_id,
      [InvestmentTransactionsTableFields.SUBTYPE]: investmentTransaction.subtype,
      [InvestmentTransactionsTableFields.TYPE]: investmentTransaction.type,
    }

    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedTransaction[field.field];
      return [ field.field_id, value ]
    }))
  }
}