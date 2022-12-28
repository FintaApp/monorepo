import { AccountBase } from "plaid";

import { AccountsTableFields, TableConfig } from "~/types/shared/models";

export const account = {
  new: ({ account, itemRecordId, tableConfigFields }: {
    account: AccountBase;
    itemRecordId: string;
    tableConfigFields: TableConfig['fields']
  }) => {
    const formattedAccount = {
      [AccountsTableFields.NAME]: account.official_name || account.name,
      [AccountsTableFields.INSTITUTION]: [ itemRecordId ],
      [AccountsTableFields.AVAILABLE]: account.balances.available,
      [AccountsTableFields.CURRENT]: account.balances.current,
      [AccountsTableFields.CURRENCY]: account.balances.iso_currency_code,
      [AccountsTableFields.MASK]: account.mask,
      [AccountsTableFields.TYPE]: account.type,
      [AccountsTableFields.SUBTYPE]: account.subtype,
      [AccountsTableFields.LIMIT]: account.balances.limit,
      [AccountsTableFields.ID]: account.account_id
    };
  
    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedAccount[field.field as keyof typeof formattedAccount];
      return [ field.field_id, value ]
    }))
  },
  updated: ({ account, tableConfigFields }: {
    account: AccountBase
    tableConfigFields: TableConfig['fields']
  }) => {
    const formattedAccount = {
      [AccountsTableFields.AVAILABLE]: account.balances.available,
      [AccountsTableFields.CURRENT]: account.balances.current,
      [AccountsTableFields.LIMIT]: account.balances.limit
    }
  
    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedAccount[field.field as keyof typeof formattedAccount];
      return [ field.field_id, value ]
    }))
  }
}
