import { InvestmentTransaction } from "plaid";

import { InvestmentTransactionsTableFields, TableConfigFields } from "@finta/types";

export const investmentTransaction = {
  new: ({ investmentTransaction, accountRecordId, securityRecordId, tableConfigFields }: {
    investmentTransaction: InvestmentTransaction;
    accountRecordId: string;
    securityRecordId: string;
    tableConfigFields: Record<TableConfigFields, string> | {}
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
  
    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedTransaction[tableConfigField as keyof typeof formattedTransaction]
    }), {} as Record<string, any>);
  }
}
