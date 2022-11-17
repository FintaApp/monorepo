import { AccountBase } from "plaid";
import { TableConfigFields, AccountsTableFields } from "../../types/shared";

export const account = {
  new: ({ account, institutionPageId, tableConfigFields }: { 
    account: AccountBase;
    institutionPageId: string;
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedAccount = {
      [AccountsTableFields.NAME]: { title: [{ text: { content: account.official_name || account.name || "" }}]},
      [AccountsTableFields.INSTITUTION]: { relation: [{ id: institutionPageId }]},
      [AccountsTableFields.AVAILABLE]: { number: account.balances.available },
      [AccountsTableFields.CURRENT]: { number: account.balances.current },
      [AccountsTableFields.CURRENCY]: { select: { name: account.balances.iso_currency_code }},
      [AccountsTableFields.MASK]: { rich_text: [{ text: { content: account.mask || "" }}]},
      [AccountsTableFields.TYPE]: { select: { name: account.type }},
      [AccountsTableFields.SUBTYPE]: { select: { name: account.subtype }},
      [AccountsTableFields.LIMIT]: { number: account.balances.limit },
      [AccountsTableFields.ID]: { rich_text: [{ text: { content: account.account_id }}]}
    };

    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedAccount[tableConfigField]
    }), {} as Record<string, string>);
  },
  updated: ({ account, tableConfigFields }: {
    account: AccountBase
    tableConfigFields: Record<TableConfigFields, string> | {}
  }) => {
    const formattedAccount = {
      [AccountsTableFields.AVAILABLE]: { number: account.balances.available },
      [AccountsTableFields.CURRENT]: { number: account.balances.current },
      [AccountsTableFields.LIMIT]: { number: account.balances.limit }
    }
  
    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedAccount[tableConfigField]
    }), {} as Record<string, string>);
  }
}