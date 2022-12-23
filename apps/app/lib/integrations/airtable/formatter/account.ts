import { Field } from "@prisma/client";
import { AccountFormatter } from "../../base/types";

export const account = {
  new: ({ account, itemRecordId, accountName, credit, student, mortage }) => {
    const interestRate = (credit?.aprs.find(apr => apr.apr_type === 'purchase_apr')?.apr_percentage || mortage?.interest_rate.percentage || student?.interest_rate_percentage);
    const lastPaymentDate = student?.last_payment_date || mortage?.last_payment_date || credit?.last_payment_date;
    const nextPaymentDueDate = student?.next_payment_due_date || mortage?.next_payment_due_date || credit?.next_payment_due_date;
    const originationDate = student?.origination_date || mortage?.origination_date;

    return {
      [Field.Institution]: [ itemRecordId ],
      [Field.Id]: account.account_id,
      [Field.Name]: accountName,
      [Field.Available]: account.balances.available,
      [Field.Current]: account.balances.current,
      [Field.Currency]: account.balances.iso_currency_code,
      [Field.Mask]: account.mask,
      [Field.Type]: account.type,
      [Field.Subtype]: account.subtype,
      [Field.Limit]: account.balances.limit,
      [Field.InterestRate]: interestRate ? interestRate / 100.0 : undefined ,
      [Field.LastPaymentAmount]: student?.last_payment_amount || mortage?.last_payment_amount || credit?.last_payment_amount,
      [Field.LastPaymentDate]: lastPaymentDate,
      [Field.NextPaymentDueDate]: nextPaymentDueDate,
      [Field.LastStatementBalance]: credit?.last_statement_balance,
      [Field.MinimumPaymentAmount]: credit?.minimum_payment_amount || student?.minimum_payment_amount,
      [Field.NextMonthlyPayment]: mortage?.next_monthly_payment,
      [Field.OriginationDate]: originationDate,
      [Field.OriginationPrincipalAmount]: student?.origination_principal_amount || mortage?.origination_principal_amount
    }
  },
  updated: ({ account, credit, student, mortage }) => {
    const interestRate = (credit?.aprs.find(apr => apr.apr_type === 'purchase_apr')?.apr_percentage || mortage?.interest_rate.percentage || student?.interest_rate_percentage);
    const lastPaymentDate = student?.last_payment_date || mortage?.last_payment_date || credit?.last_payment_date;
    const nextPaymentDueDate = student?.next_payment_due_date || mortage?.next_payment_due_date || credit?.next_payment_due_date;
    const originationDate = student?.origination_date || mortage?.origination_date;
    
    return {
      [Field.Available]: account.balances.available,
      [Field.Current]: account.balances.current,
      [Field.Limit]: account.balances.limit,
      [Field.InterestRate]: interestRate ? interestRate / 100.0 : undefined ,
      [Field.LastPaymentAmount]: student?.last_payment_amount || mortage?.last_payment_amount || credit?.last_payment_amount,
      [Field.LastPaymentDate]: lastPaymentDate,
      [Field.NextPaymentDueDate]: nextPaymentDueDate,
      [Field.LastStatementBalance]: credit?.last_statement_balance,
      [Field.MinimumPaymentAmount]: credit?.minimum_payment_amount || student?.minimum_payment_amount,
      [Field.NextMonthlyPayment]: mortage?.next_monthly_payment,
      [Field.OriginationDate]: originationDate,
      [Field.OriginationPrincipalAmount]: student?.origination_principal_amount || mortage?.origination_principal_amount
    }
  }
} as AccountFormatter