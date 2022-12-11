import { InvestmentTransaction } from "plaid";

import { InvestmentTransactionsTableFields, TableConfigFields } from "~/types/shared/models";

export const investmentTransaction = {
  new: ({ investmentTransaction, accountPageId, securityPageId, tableConfigFields }: {
    investmentTransaction: InvestmentTransaction;
    accountPageId: string;
    securityPageId?: string;
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedTransaction = {
      [InvestmentTransactionsTableFields.ACCOUNT]: { relation: [{ id: accountPageId }]},
      [InvestmentTransactionsTableFields.AMOUNT]: { number: ['deposit', 'withdrawal', 'dividend', 'cash'].includes(investmentTransaction.type) ? -investmentTransaction.amount : investmentTransaction.amount },
      [InvestmentTransactionsTableFields.DATE]: investmentTransaction.date ? { date: { start: investmentTransaction.date }} : undefined,
      [InvestmentTransactionsTableFields.FEES]: { number: investmentTransaction.fees || 0 },
      [InvestmentTransactionsTableFields.ID]: { rich_text: [{ text: { content: investmentTransaction.investment_transaction_id }}]},
      [InvestmentTransactionsTableFields.CURRENCY]: { select: { name: investmentTransaction.iso_currency_code || investmentTransaction.unofficial_currency_code }},
      [InvestmentTransactionsTableFields.SUMMARY]: { title: [{ text: { content: investmentTransaction.name || "" }}]},
      [InvestmentTransactionsTableFields.PRICE]: { number: investmentTransaction.price },
      [InvestmentTransactionsTableFields.QUANTITY]: { number: ['sell'].includes(investmentTransaction.subtype) ? -investmentTransaction.quantity : investmentTransaction.quantity },
      [InvestmentTransactionsTableFields.SECURITY_ID]: securityPageId ? { relation: [{ id: securityPageId }]} : undefined,
      [InvestmentTransactionsTableFields.SUBTYPE]: { select: { name: investmentTransaction.subtype }},
      [InvestmentTransactionsTableFields.TYPE]: { select: { name: investmentTransaction.type }},
    }
  
    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedTransaction[tableConfigField as keyof typeof formattedTransaction]
    }), {} as Record<string, any>);
  }
}
