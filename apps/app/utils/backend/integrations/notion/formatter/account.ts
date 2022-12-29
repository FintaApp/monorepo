import { AccountBase } from "plaid";
import { AccountsTableFields, TableConfig } from "~/types/shared/models";

export const account = {
  new: ({ account, itemRecordId, tableConfigFields }: { 
    account: AccountBase;
    itemRecordId: string;
    tableConfigFields: TableConfig['fields']
  }) => {
    const formattedAccount = {
      [AccountsTableFields.NAME]: { title: [{ text: { content: account.official_name || account.name || "" }}]},
      [AccountsTableFields.INSTITUTION]: { relation: [{ id: itemRecordId }]},
      [AccountsTableFields.AVAILABLE]: { number: account.balances.available },
      [AccountsTableFields.CURRENT]: { number: account.balances.current },
      [AccountsTableFields.CURRENCY]: { select: { name: account.balances.iso_currency_code }},
      [AccountsTableFields.MASK]: { rich_text: [{ text: { content: account.mask || "" }}]},
      [AccountsTableFields.TYPE]: { select: { name: account.type }},
      [AccountsTableFields.SUBTYPE]: { select: { name: account.subtype }},
      [AccountsTableFields.LIMIT]: { number: account.balances.limit },
      [AccountsTableFields.ID]: { rich_text: [{ text: { content: account.account_id }}]}
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
      [AccountsTableFields.AVAILABLE]: { number: account.balances.available },
      [AccountsTableFields.CURRENT]: { number: account.balances.current },
      [AccountsTableFields.LIMIT]: { number: account.balances.limit }
    }
  
    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedAccount[field.field as keyof typeof formattedAccount];
      return [ field.field_id, value ]
    }))
  }
}