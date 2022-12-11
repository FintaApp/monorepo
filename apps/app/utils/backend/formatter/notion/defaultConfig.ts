import { TableConfigs, InstitutionsTableFields, SecurityTableFields, AccountsTableFields, TransactionsTableFields, HoldingsTableFields, InvestmentTransactionsTableFields, CategoryTableFields } from "~/types/shared/models";
import { GetDestinationTablesResponse } from "~/types/shared/functions";

export const defaultConfig = ({ tables }: { tables: GetDestinationTablesResponse['tables'] }): TableConfigs => {
  const institutionsDatabase = tables.find(table => table.name === 'Institutions');
  const accountsDatabase = tables.find(table => table.name === "Accounts");
  const transactionsDatabase = tables.find(table => table.name === "Transactions");
  const holdingsDatabase = tables.find(table => table.name === "Holdings");
  const investmentTransactionsDatabase = tables.find(table => table.name === "Investment Transactions");
  const securitiesDatabase = tables.find(table => table.name === "Securities");
  const categoriesDatabase = tables.find(table => ["Budget", "Categories"].includes(table.name))

  return {
    institutions: {
      is_enabled: true,
      table_id: institutionsDatabase?.tableId || '',
      fields: institutionsDatabase ? [
        { field: InstitutionsTableFields.ID, field_id: institutionsDatabase.fields.find(field => field.name === 'ID')?.fieldId || ''},
        { field: InstitutionsTableFields.NAME, field_id: institutionsDatabase.fields.find(field => field.name === 'Name')?.fieldId || ''},
        { field: InstitutionsTableFields.LAST_UPDATE, field_id: institutionsDatabase.fields.find(field => field.name === 'Last Update')?.fieldId || ''},
        { field: InstitutionsTableFields.ERROR, field_id: institutionsDatabase.fields.find(field => field.name === 'Error')?.fieldId || '' }
      ] : []
    },
    accounts: {
      is_enabled: true,
      table_id: accountsDatabase?.tableId || '',
      fields: accountsDatabase ? [
        { field: AccountsTableFields.INSTITUTION, field_id: accountsDatabase.fields.find(field => field.name === 'Institution')?.fieldId || ''},
        { field: AccountsTableFields.ID, field_id: accountsDatabase.fields.find(field => field.name === 'ID')?.fieldId || ''},
        { field: AccountsTableFields.NAME, field_id: accountsDatabase.fields.find(field => field.name === 'Name')?.fieldId || ''},
        { field: AccountsTableFields.AVAILABLE, field_id: accountsDatabase.fields.find(field => field.name === 'Available')?.fieldId || ''},
        { field: AccountsTableFields.CURRENT, field_id: accountsDatabase.fields.find(field => field.name === 'Current')?.fieldId || ''},
        { field: AccountsTableFields.CURRENCY, field_id: accountsDatabase.fields.find(field => field.name === 'Currency')?.fieldId || ''},
        { field: AccountsTableFields.MASK, field_id: accountsDatabase.fields.find(field => field.name === 'Mask')?.fieldId || ''},
        { field: AccountsTableFields.TYPE, field_id: accountsDatabase.fields.find(field => field.name === 'Type')?.fieldId || ''},
        { field: AccountsTableFields.SUBTYPE, field_id: accountsDatabase.fields.find(field => field.name === 'Subtype')?.fieldId || ''},
        { field: AccountsTableFields.LIMIT, field_id: accountsDatabase.fields.find(field => field.name === 'Limit')?.fieldId || '' }
      ] : []
    },
    transactions: {
      is_enabled: true,
      table_id: transactionsDatabase?.tableId || '',
      fields: transactionsDatabase ? [
        { field: TransactionsTableFields.ACCOUNT, field_id: transactionsDatabase.fields.find(field => field.name === 'Account')?.fieldId || ''},
        { field: TransactionsTableFields.ID, field_id: transactionsDatabase.fields.find(field => field.name === 'ID')?.fieldId || ''},
        { field: TransactionsTableFields.SUMMARY, field_id: transactionsDatabase.fields.find(field => field.name === 'Summary')?.fieldId || ''},
        { field: TransactionsTableFields.DATE, field_id: transactionsDatabase.fields.find(field => field.name === 'Date')?.fieldId || ''},
        { field: TransactionsTableFields.AMOUNT, field_id: transactionsDatabase.fields.find(field => field.name === 'Amount')?.fieldId || ''},
        { field: TransactionsTableFields.CURRENCY, field_id: transactionsDatabase.fields.find(field => field.name === 'Currency')?.fieldId || ''},
        { field: TransactionsTableFields.PENDING, field_id: transactionsDatabase.fields.find(field => field.name === 'Pending?')?.fieldId || '' },
        { field: TransactionsTableFields.CATEGORY, field_id: transactionsDatabase.fields.find(field => field.name === 'Category')?.fieldId || '' },
        { field: TransactionsTableFields.SUB_ACCOUNT, field_id: transactionsDatabase.fields.find(field => field.name === 'Sub Account')?.fieldId || '' }
      ] : []
    },
    holdings: {
      is_enabled: true,
      table_id: holdingsDatabase?.tableId || '',
      fields: holdingsDatabase ? [
        { field: HoldingsTableFields.SUMMARY, field_id: holdingsDatabase.fields.find(field => field.name === 'Summary')?.fieldId || '' },
        { field: HoldingsTableFields.ACCOUNT, field_id: holdingsDatabase.fields.find(field => field.name === 'Account')?.fieldId || '' },
        { field: HoldingsTableFields.COST_BASIS, field_id: holdingsDatabase.fields.find(field => field.name === 'Cost Basis')?.fieldId || '' },
        { field: HoldingsTableFields.CURRENCY, field_id: holdingsDatabase.fields.find(field => field.name === 'Currency')?.fieldId || '' },
        { field: HoldingsTableFields.QUANTITY, field_id: holdingsDatabase.fields.find(field => field.name === 'Quantity')?.fieldId || '' },
        { field: HoldingsTableFields.SECURITY_ID, field_id: holdingsDatabase.fields.find(field => field.name === 'Security')?.fieldId || '' },
      ] : []
    },
    investment_transactions: {
      is_enabled: true,
      table_id: investmentTransactionsDatabase?.tableId || '',
      fields: investmentTransactionsDatabase ? [
        { field: InvestmentTransactionsTableFields.ACCOUNT, field_id: investmentTransactionsDatabase.fields.find(field => field.name === 'Account')?.fieldId || '' },
        { field: InvestmentTransactionsTableFields.AMOUNT, field_id: investmentTransactionsDatabase.fields.find(field => field.name === 'Amount')?.fieldId || '' },
        { field: InvestmentTransactionsTableFields.CURRENCY, field_id: investmentTransactionsDatabase.fields.find(field => field.name === 'Currency')?.fieldId || '' },
        { field: InvestmentTransactionsTableFields.DATE, field_id: investmentTransactionsDatabase.fields.find(field => field.name === 'Date')?.fieldId || '' },
        { field: InvestmentTransactionsTableFields.FEES, field_id: investmentTransactionsDatabase.fields.find(field => field.name === 'Fees')?.fieldId || '' },
        { field: InvestmentTransactionsTableFields.ID, field_id: investmentTransactionsDatabase.fields.find(field => field.name === 'ID')?.fieldId || '' },
        { field: InvestmentTransactionsTableFields.PRICE, field_id: investmentTransactionsDatabase.fields.find(field => field.name === 'Price')?.fieldId || '' },
        { field: InvestmentTransactionsTableFields.QUANTITY, field_id: investmentTransactionsDatabase.fields.find(field => field.name === 'Quantity')?.fieldId || '' },
        { field: InvestmentTransactionsTableFields.SECURITY_ID, field_id: investmentTransactionsDatabase.fields.find(field => field.name === 'Security')?.fieldId || '' },
        { field: InvestmentTransactionsTableFields.SUBTYPE, field_id: investmentTransactionsDatabase.fields.find(field => field.name === 'Subtype')?.fieldId || '' },
        { field: InvestmentTransactionsTableFields.SUMMARY, field_id: investmentTransactionsDatabase.fields.find(field => field.name === 'Summary')?.fieldId || '' },
        { field: InvestmentTransactionsTableFields.TYPE, field_id: investmentTransactionsDatabase.fields.find(field => field.name === 'Type')?.fieldId || ''}
      ] : []
    },
    securities: {
      is_enabled: true,
      table_id: securitiesDatabase?.tableId || '',
      fields: securitiesDatabase ? [
        { field: SecurityTableFields.ID, field_id: securitiesDatabase.fields.find(field => field.name === 'ID')?.fieldId || ''},
        { field: SecurityTableFields.SYMBOL, field_id: securitiesDatabase.fields.find(field => field.name === 'Symbol')?.fieldId || ''},
        { field: SecurityTableFields.NAME, field_id: securitiesDatabase.fields.find(field => field.name === 'Name')?.fieldId || ''},
        { field: SecurityTableFields.CLOSE_PRICE, field_id: securitiesDatabase.fields.find(field => field.name === 'Close Price')?.fieldId || ''},
        { field: SecurityTableFields.CLOSE_PRICE_AS_OF, field_id: securitiesDatabase.fields.find(field => field.name === 'Close Price As Of')?.fieldId || ''},
        { field: SecurityTableFields.TYPE, field_id: securitiesDatabase.fields.find(field => field.name === 'Type')?.fieldId || ''},
      ] : []
    },
    categories: {
      is_enabled: true,
      table_id: categoriesDatabase?.tableId || '',
      fields: categoriesDatabase ? [
        { field: CategoryTableFields.ID, field_id: categoriesDatabase.fields.find(field => field.name === 'ID')?.fieldId || ''},
        { field: CategoryTableFields.NAME, field_id: categoriesDatabase.fields.find(field => field.name === 'Name')?.fieldId || ''},
        { field: CategoryTableFields.CATEGORY_GROUP, field_id: categoriesDatabase.fields.find(field => field.name === 'Type')?.fieldId || ''}
      ] : []
    }
  }
}