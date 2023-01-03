import { Field } from "@prisma/client";
import { InvestmentTransactionFormatter } from "../../base/types";

export const investmentTransaction = {
  new: ({ investmentTransaction  }) => {
    return {
      [Field.Account]: investmentTransaction.account_id,
      [Field.Amount]: ['deposit', 'withdrawal', 'dividend', 'cash'].includes(investmentTransaction.type) ? -investmentTransaction.amount : investmentTransaction.amount,
      [Field.Date]: investmentTransaction.date,
      [Field.Fees]: investmentTransaction.fees || 0,
      [Field.Id]: investmentTransaction.investment_transaction_id,
      [Field.Currency]: investmentTransaction.iso_currency_code || investmentTransaction.unofficial_currency_code,
      [Field.Summary]: investmentTransaction.name,
      [Field.Price]: investmentTransaction.price,
      [Field.Quantity]: ['sell'].includes(investmentTransaction.subtype) ? -investmentTransaction.quantity : investmentTransaction.quantity,
      [Field.Security]: investmentTransaction.security_id,
      [Field.Subtype]: investmentTransaction.subtype,
      [Field.Type]: investmentTransaction.type,
    }
  }
} as InvestmentTransactionFormatter