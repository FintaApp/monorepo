import { AccountBase } from "plaid";
import { TableConfigFields, AccountsTableFields } from "../../../../../../functions/_lib/types/shared";

export const account = {
  new: ({ account, headerValues, itemId, tableConfigFields }: { 
    account: AccountBase;
    headerValues: string[];
    itemId: string;
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedAccount = {
      [AccountsTableFields.NAME]: account.official_name || account.name,
      [AccountsTableFields.INSTITUTION]: itemId,
      [AccountsTableFields.AVAILABLE]: account.balances.available,
      [AccountsTableFields.CURRENT]: account.balances.current,
      [AccountsTableFields.CURRENCY]: account.balances.iso_currency_code,
      [AccountsTableFields.MASK]: account.mask,
      [AccountsTableFields.TYPE]: account.type,
      [AccountsTableFields.SUBTYPE]: account.subtype,
      [AccountsTableFields.LIMIT]: account.balances.limit,
      [AccountsTableFields.ID]: account.account_id
    };

    const userFieldMapping = Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedAccount[tableConfigField]
    }), {} as Record<string, string>);

    return headerValues.map(headerValue => userFieldMapping[headerValue] || undefined)
  },
  updated: ({ account, headerValues, tableConfigFields }: { 
    account: AccountBase;
    headerValues: string[];
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedAccount = {
      [AccountsTableFields.AVAILABLE]: account.balances.available,
      [AccountsTableFields.CURRENT]: account.balances.current,
      [AccountsTableFields.LIMIT]: account.balances.limit
    };

    const userFieldMapping = Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedAccount[tableConfigField]
    }), {} as Record<string, string>);

    return headerValues.map(headerValue => userFieldMapping[headerValue] || undefined)
  }
}