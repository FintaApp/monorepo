import { Field } from "@prisma/client";
import { AccountFormatter } from "../../base/types";

export const account = {
  new: ({ account, itemRecordId, accountName, credit, student, mortage }) => {
    const interestRate = (credit?.aprs.find(apr => apr.apr_type === 'purchase_apr')?.apr_percentage || mortage?.interest_rate.percentage || student?.interest_rate_percentage);
    const lastPaymentDate = student?.last_payment_date || mortage?.last_payment_date || credit?.last_payment_date;
    const nextPaymentDueDate = student?.next_payment_due_date || mortage?.next_payment_due_date || credit?.next_payment_due_date;
    const originationDate = student?.origination_date || mortage?.origination_date;
    const lastPaymentAmount = student?.last_payment_amount || mortage?.last_payment_amount || credit?.last_payment_amount;
    const lastStatementBalance = credit?.last_statement_balance;
    const minimumPaymentAmount = credit?.minimum_payment_amount || student?.minimum_payment_amount;
    const nextMonthlyPayment = mortage?.next_monthly_payment;
    const originationPrincipalAmount = student?.origination_principal_amount || mortage?.origination_principal_amount;
    const { limit, available, current } = account.balances;

    return {
      [Field.Institution]: { relation: [{ id: itemRecordId }]},
      [Field.Id]: { rich_text: [{ text: { content: account.account_id }}]},
      [Field.Name]: { title: [{ text: { content: accountName || "" }}]},
      [Field.Available]: available || available === 0 ? { number: available } : undefined,
      [Field.Current]: current || current === 0 ? { number: current } : undefined,
      [Field.Currency]: { select: { name: account.balances.iso_currency_code }},
      [Field.Mask]: { rich_text: [{ text: { content: account.mask || "" }}]},
      [Field.Type]: { select: { name: account.type }},
      [Field.Subtype]: { select: { name: account.subtype }},
      [Field.Limit]: limit || limit === 0 ? { number: limit } : undefined,
      [Field.InterestRate]: interestRate || interestRate === 0 ? { number: interestRate / 100.0 } : undefined ,
      [Field.LastPaymentAmount]: lastPaymentAmount || lastPaymentAmount === 0  ? { number: lastPaymentAmount } : undefined,
      [Field.LastPaymentDate]: lastPaymentDate ? { date: { start: lastPaymentDate }} : undefined,
      [Field.NextPaymentDueDate]: nextPaymentDueDate ? { date: { start: nextPaymentDueDate }} : undefined,
      [Field.LastStatementBalance]: lastStatementBalance || lastStatementBalance === 0 ? { number: lastStatementBalance } : undefined,
      [Field.MinimumPaymentAmount]: minimumPaymentAmount || minimumPaymentAmount === 0 ? { number: minimumPaymentAmount } : undefined,
      [Field.NextMonthlyPayment]: nextMonthlyPayment || nextMonthlyPayment === 0 ? { number: nextMonthlyPayment } : undefined,
      [Field.OriginationDate]: originationDate ? { date: { start: originationDate }} : undefined,
      [Field.OriginationPrincipalAmount]: originationPrincipalAmount || originationPrincipalAmount === 0 ? { number: originationPrincipalAmount } : undefined
    }
  },
  updated: ({ account, credit, student, mortage }) => {
    const interestRate = (credit?.aprs.find(apr => apr.apr_type === 'purchase_apr')?.apr_percentage || mortage?.interest_rate.percentage || student?.interest_rate_percentage);
    const lastPaymentDate = student?.last_payment_date || mortage?.last_payment_date || credit?.last_payment_date;
    const nextPaymentDueDate = student?.next_payment_due_date || mortage?.next_payment_due_date || credit?.next_payment_due_date;
    const originationDate = student?.origination_date || mortage?.origination_date;
    const lastPaymentAmount = student?.last_payment_amount || mortage?.last_payment_amount || credit?.last_payment_amount;
    const originationPrincipalAmount = student?.origination_principal_amount || mortage?.origination_principal_amount;
    const minimumPaymentAmount = credit?.minimum_payment_amount || student?.minimum_payment_amount;
    const nextMonthlyPayment = mortage?.next_monthly_payment;
    const lastStatementBalance = credit?.last_statement_balance;
    const { limit, available, current } = account.balances;
    
    return {
      [Field.Available]: available || available === 0 ? { number: available } : undefined,
      [Field.Current]: current || current === 0 ? { number: current } : undefined,
      [Field.Limit]: limit || limit === 0 ? { number: limit } : undefined,
      [Field.InterestRate]: interestRate || interestRate === 0 ? { number: interestRate / 100.0 } : undefined,
      [Field.LastPaymentAmount]: lastPaymentAmount || lastPaymentAmount === 0  ? { number: lastPaymentAmount } : undefined,
      [Field.LastPaymentDate]: lastPaymentDate ? { date: { start: lastPaymentDate }} : undefined,
      [Field.NextPaymentDueDate]: nextPaymentDueDate ? { date: { start: nextPaymentDueDate }} : undefined,
      [Field.LastStatementBalance]: lastStatementBalance || lastStatementBalance === 0 ? { number: lastStatementBalance } : undefined,
      [Field.MinimumPaymentAmount]: minimumPaymentAmount || minimumPaymentAmount === 0 ? { number: minimumPaymentAmount } : undefined,
      [Field.NextMonthlyPayment]: nextMonthlyPayment || nextMonthlyPayment === 0 ? { number: nextMonthlyPayment } : undefined,
      [Field.OriginationDate]: originationDate ? { date: { start: originationDate }} : undefined,
      [Field.OriginationPrincipalAmount]: originationPrincipalAmount || originationPrincipalAmount === 0 ? { number: originationPrincipalAmount } : undefined
    }
  }
} as AccountFormatter