import { InvestmentTransaction, Security } from "plaid";
import { OauthInvestmentTransaction } from "@finta/types";

export const investmentTransaction = ({ security, investmentTransaction }: {
  security?: Security,
  investmentTransaction: InvestmentTransaction
}): OauthInvestmentTransaction => ({
  id: investmentTransaction.investment_transaction_id,
  name: investmentTransaction.name,
  account_id: investmentTransaction.account_id,
  amount: ['deposit', 'withdrawal', 'dividend', 'cash'].includes(investmentTransaction.type) ? -investmentTransaction.amount : investmentTransaction.amount,
  date: investmentTransaction.date,
  fees: investmentTransaction.fees || 0,
  currency: investmentTransaction.iso_currency_code || investmentTransaction.unofficial_currency_code || undefined,
  price: investmentTransaction.price,
  quantity: ['sell'].includes(investmentTransaction.subtype) ? -investmentTransaction.quantity : investmentTransaction.quantity,
  type: investmentTransaction.type,
  subtype: investmentTransaction.subtype,
  symbol: security?.ticker_symbol || undefined,
  security_name: security?.name || undefined,
  security_type: security?.type || undefined
})