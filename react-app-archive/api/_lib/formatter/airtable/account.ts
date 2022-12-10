import { AccountBase } from "plaid";

import { AccountsTableFields, TableConfigFields } from "@finta/types";

export const account = {
  new: ({ account, institutionRecordId, tableConfigFields }: {
    account: AccountBase;
    institutionRecordId: string;
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedAccount = {
      [AccountsTableFields.NAME]: account.official_name || account.name,
      [AccountsTableFields.INSTITUTION]: [ institutionRecordId ],
      [AccountsTableFields.AVAILABLE]: account.balances.available,
      [AccountsTableFields.CURRENT]: account.balances.current,
      [AccountsTableFields.CURRENCY]: account.balances.iso_currency_code,
      [AccountsTableFields.MASK]: account.mask,
      [AccountsTableFields.TYPE]: account.type,
      [AccountsTableFields.SUBTYPE]: account.subtype,
      [AccountsTableFields.LIMIT]: account.balances.limit,
      [AccountsTableFields.ID]: account.account_id
    };
  
    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedAccount[tableConfigField as keyof typeof formattedAccount]
    }), {} as Record<string, any>);
  },
  updated: ({ account, tableConfigFields }: {
    account: AccountBase
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedAccount = {
      [AccountsTableFields.AVAILABLE]: account.balances.available,
      [AccountsTableFields.CURRENT]: account.balances.current,
      [AccountsTableFields.LIMIT]: account.balances.limit
    }
  
    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedAccount[tableConfigField as keyof typeof formattedAccount]
    }), {} as Record<string, any>);
  }
}
