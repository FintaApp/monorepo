import { InvestmentTransaction } from "plaid";
import { TableConfigFields, InvestmentTransactionsTableFields } from "@finta/types";

export const investmentTransaction = {
  new: ({ investmentTransaction, headerValues, tableConfigFields }: { 
    investmentTransaction: InvestmentTransaction;
    headerValues: string[];
    tableConfigFields: Record<TableConfigFields, string> | {}
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

    const userFieldMapping = Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      // eslint-disable-next-line
      [userDefinedField]: formattedTransaction[tableConfigField]
    }), {} as Record<string, string>);

    return headerValues.map(headerValue => userFieldMapping[headerValue] || undefined)
  }
}