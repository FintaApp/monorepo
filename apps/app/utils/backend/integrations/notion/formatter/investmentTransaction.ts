import { InvestmentTransaction } from "plaid";

import { InvestmentTransactionsTableFields, TableConfig } from "~/types/shared/models";

export const investmentTransaction = {
  new: ({ investmentTransaction, accountRecordId, securityRecordId, tableConfigFields }: {
    investmentTransaction: InvestmentTransaction;
    accountRecordId: string;
    securityRecordId?: string;
    tableConfigFields: TableConfig['fields']
  }) => {
    const formattedTransaction = {
      [InvestmentTransactionsTableFields.ACCOUNT]: { relation: [{ id: accountRecordId }]},
      [InvestmentTransactionsTableFields.AMOUNT]: { number: ['deposit', 'withdrawal', 'dividend', 'cash'].includes(investmentTransaction.type) ? -investmentTransaction.amount : investmentTransaction.amount },
      [InvestmentTransactionsTableFields.DATE]: investmentTransaction.date ? { date: { start: investmentTransaction.date }} : undefined,
      [InvestmentTransactionsTableFields.FEES]: { number: investmentTransaction.fees || 0 },
      [InvestmentTransactionsTableFields.ID]: { rich_text: [{ text: { content: investmentTransaction.investment_transaction_id }}]},
      [InvestmentTransactionsTableFields.CURRENCY]: { select: { name: investmentTransaction.iso_currency_code || investmentTransaction.unofficial_currency_code }},
      [InvestmentTransactionsTableFields.SUMMARY]: { title: [{ text: { content: investmentTransaction.name || "" }}]},
      [InvestmentTransactionsTableFields.PRICE]: { number: investmentTransaction.price },
      [InvestmentTransactionsTableFields.QUANTITY]: { number: ['sell'].includes(investmentTransaction.subtype) ? -investmentTransaction.quantity : investmentTransaction.quantity },
      [InvestmentTransactionsTableFields.SECURITY_ID]: securityRecordId ? { relation: [{ id: securityRecordId }]} : undefined,
      [InvestmentTransactionsTableFields.SUBTYPE]: { select: { name: investmentTransaction.subtype }},
      [InvestmentTransactionsTableFields.TYPE]: { select: { name: investmentTransaction.type }},
    }
  
    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedTransaction[field.field as keyof typeof formattedTransaction];
      return [ field.field_id, value ]
    }))
  }
}
