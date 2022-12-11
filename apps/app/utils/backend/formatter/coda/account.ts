import { AccountBase, CreditCardLiability, StudentLoan, MortgageLiability, MortgageInterestRate, APR } from "plaid";
import { PlaidItemModel } from "~/types/backend/models";
import { OauthAccount } from "@finta/shared";

export const account = ({ itemId, plaidAccount, itemAccount, liability }: { 
  itemId: string; plaidAccount: AccountBase; itemAccount: PlaidItemModel['accounts'][0]; liability?: CreditCardLiability | StudentLoan | MortgageLiability
}): OauthAccount => {
  const interestRate = liability?.interest_rate ? (liability.interest_rate as MortgageInterestRate).percentage : null;
  const purchaseApr = liability?.aprs ? (liability.aprs as APR[]).find(apr => apr.apr_type === 'purchase_apr')?.apr_percentage : null

  return {
    id: plaidAccount.account_id,
    plaid_item_id: itemId,
    name: itemAccount.name,
    mask: itemAccount.mask || undefined,
    type: plaidAccount.type,
    subtype: plaidAccount.subtype || "",
    available_balance: plaidAccount.balances.available ?? undefined,
    current_balance: plaidAccount.balances.current ?? undefined,
    limit: plaidAccount.balances.limit ?? undefined,
    currency: plaidAccount.balances.iso_currency_code || undefined,
    interest_rate:  interestRate ?? purchaseApr ?? liability?.interest_rate_percentage,
    last_payment_amount: liability?.last_payment_amount ?? undefined,
    last_payment_date: liability?.last_payment_date ?? undefined,
    next_payment_due_date: liability?.next_payment_due_date ?? undefined,
    last_statement_balance: liability?.last_statement_balance,
    minimum_payment_amount: liability?.minimum_payment_amount,
    next_monthly_payment: liability?.next_monthly_payment,
    origination_date: liability?.origination_date,
    origination_principal_amount: liability?.origination_principal_amount
  };
}