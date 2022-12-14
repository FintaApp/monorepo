import { TableConfigs, InstitutionsTableFields, CategoryTableFields, AccountsTableFields, TransactionsTableFields, HoldingsTableFields, InvestmentTransactionsTableFields, SecurityTableFields, INSTITUTION_TABLE_FIELDS, ACCOUNTS_TABLE_FIELDS, TRANSACTIONS_TABLE_FIELDS, HOLDINGS_TABLE_FIELDS, INVESTMENT_TRANSACTIONS_TABLE_FIELDS, SECURITIES_TABLE_FIELDS, CATEGORIES_TABLE_FIELDS } from "~/types/shared/models";
import { GetDestinationTablesResponse } from "~/types/shared/functions";

export const defaultConfig = ({ tables }: GetDestinationTablesResponse): TableConfigs => {
  const institutionsTable = tables.find(table => table.name === 'Institutions');
  const accountsTable = tables.find(table => table.name === 'Accounts');
  const transactionsTable = tables.find(table => table.name === 'Transactions');
  const holdingsTable = tables.find(table => table.name === 'Holdings');
  const investmentTransactionsTable = tables.find(table => table.name === 'Investment Transactions');
  const securitiesTable = tables.find(table => table.name === 'Securities');
  const categoriesTable = tables.find(table => table.name === "Categories");

  return {
    institutions: {
      is_enabled: true,
      table_id: institutionsTable?.tableId,
      fields: institutionsTable ? [
        { field: InstitutionsTableFields.ID, field_id: institutionsTable.fields.find(field => field.name === 'ID')?.fieldId || '' },
        { field: InstitutionsTableFields.NAME, field_id: institutionsTable.fields.find(field => field.name === 'Name')?.fieldId || '' },
        { field: InstitutionsTableFields.LAST_UPDATE, field_id: institutionsTable.fields.find(field => field.name === 'Last Update')?.fieldId || '' },
        { field: InstitutionsTableFields.ERROR, field_id: institutionsTable.fields.find(field => field.name === 'Error')?.fieldId || '' }
      ] : INSTITUTION_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' }))
    },
    accounts: {
      is_enabled: true,
      table_id: accountsTable?.tableId,
      fields: accountsTable ? [
        { field: AccountsTableFields.INSTITUTION, field_id: accountsTable.fields.find(field => field.name === 'Institution')?.fieldId || '' },
        { field: AccountsTableFields.ID, field_id: accountsTable.fields.find(field => field.name === 'ID')?.fieldId || '' },
        { field: AccountsTableFields.NAME, field_id: accountsTable.fields.find(field => field.name === 'Name')?.fieldId || '' },
        { field: AccountsTableFields.AVAILABLE, field_id: accountsTable.fields.find(field => field.name === 'Available')?.fieldId || '' },
        { field: AccountsTableFields.CURRENT, field_id: accountsTable.fields.find(field => field.name === 'Current')?.fieldId || '' },
        { field: AccountsTableFields.CURRENCY, field_id: accountsTable.fields.find(field => field.name === 'Currency')?.fieldId || '' },
        { field: AccountsTableFields.MASK, field_id: accountsTable.fields.find(field => field.name === 'Mask')?.fieldId || '' },
        { field: AccountsTableFields.TYPE, field_id: accountsTable.fields.find(field => field.name === 'Type')?.fieldId || '' },
        { field: AccountsTableFields.SUBTYPE, field_id: accountsTable.fields.find(field => field.name === 'Subtype')?.fieldId || '' },
        { field: AccountsTableFields.LIMIT, field_id: accountsTable.fields.find(field => field.name === 'Limit')?.fieldId || '' }
      ] : ACCOUNTS_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' }))
    },
    transactions: {
      is_enabled: true,
      table_id: transactionsTable?.tableId,
      fields: transactionsTable ? [
        { field: TransactionsTableFields.ACCOUNT, field_id: transactionsTable.fields.find(field => field.name === 'Account ID')?.fieldId || '' },
        { field: TransactionsTableFields.ID, field_id: transactionsTable.fields.find(field => field.name === 'ID')?.fieldId || '' },
        { field: TransactionsTableFields.SUMMARY, field_id: transactionsTable.fields.find(field => field.name === 'Summary')?.fieldId || '' },
        { field: TransactionsTableFields.DATE, field_id: transactionsTable.fields.find(field => field.name === 'Date')?.fieldId || '' },
        { field: TransactionsTableFields.AMOUNT, field_id: transactionsTable.fields.find(field => field.name === 'Amount')?.fieldId || '' },
        { field: TransactionsTableFields.CURRENCY, field_id: transactionsTable.fields.find(field => field.name === 'Currency')?.fieldId || '' },
        { field: TransactionsTableFields.PENDING, field_id: transactionsTable.fields.find(field => field.name === 'Pending?')?.fieldId || '' },
        { field: TransactionsTableFields.CATEGORY, field_id: transactionsTable.fields.find(field => field.name === 'Category ID')?.fieldId || '' },
      ] : TRANSACTIONS_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' }))
    },
    holdings: {
      is_enabled: true,
      table_id: holdingsTable?.tableId,
      fields: holdingsTable ? [
        { field: HoldingsTableFields.ACCOUNT, field_id: holdingsTable.fields.find(field => field.name === 'Account ID')?.fieldId || '' },
        { field: HoldingsTableFields.COST_BASIS, field_id: holdingsTable.fields.find(field => field.name === 'Cost Basis')?.fieldId || ''},
        { field: HoldingsTableFields.CURRENCY, field_id: holdingsTable.fields.find(field => field.name === 'Currency')?.fieldId || ''},
        { field: HoldingsTableFields.QUANTITY, field_id: holdingsTable.fields.find(field => field.name === 'Quantity')?.fieldId || ''},
        { field: HoldingsTableFields.SECURITY_ID, field_id: holdingsTable.fields.find(field => field.name === 'Security ID')?.fieldId || ''}
      ] : HOLDINGS_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' }))
    },
    investment_transactions: {
      is_enabled: true,
      table_id: investmentTransactionsTable?.tableId,
      fields: investmentTransactionsTable ? [
        { field: InvestmentTransactionsTableFields.ACCOUNT, field_id: investmentTransactionsTable.fields.find(field => field.name === 'Account ID')?.fieldId || ''},
        { field: InvestmentTransactionsTableFields.AMOUNT, field_id: investmentTransactionsTable.fields.find(field => field.name === 'Amount')?.fieldId || ''},
        { field: InvestmentTransactionsTableFields.CURRENCY, field_id: investmentTransactionsTable.fields.find(field => field.name === 'Currency')?.fieldId || ''},
        { field: InvestmentTransactionsTableFields.DATE, field_id: investmentTransactionsTable.fields.find(field => field.name === 'Date')?.fieldId || ''},
        { field: InvestmentTransactionsTableFields.FEES, field_id: investmentTransactionsTable.fields.find(field => field.name === 'Fees')?.fieldId || ''},
        { field: InvestmentTransactionsTableFields.ID, field_id: investmentTransactionsTable.fields.find(field => field.name === 'ID')?.fieldId || ''},
        { field: InvestmentTransactionsTableFields.PRICE, field_id: investmentTransactionsTable.fields.find(field => field.name === 'Price')?.fieldId || ''},
        { field: InvestmentTransactionsTableFields.QUANTITY, field_id: investmentTransactionsTable.fields.find(field => field.name === 'Quantity')?.fieldId || ''},
        { field: InvestmentTransactionsTableFields.SECURITY_ID, field_id: investmentTransactionsTable.fields.find(field => field.name === 'Security ID')?.fieldId || ''},
        { field: InvestmentTransactionsTableFields.SUBTYPE, field_id: investmentTransactionsTable.fields.find(field => field.name === 'Subtype')?.fieldId || ''},
        { field: InvestmentTransactionsTableFields.SUMMARY, field_id: investmentTransactionsTable.fields.find(field => field.name === 'Summary')?.fieldId || ''},
        { field: InvestmentTransactionsTableFields.TYPE, field_id: investmentTransactionsTable.fields.find(field => field.name === 'Type')?.fieldId || ''}
      ] : INVESTMENT_TRANSACTIONS_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' }))
    },
    securities: {
      is_enabled: true,
      table_id: securitiesTable?.tableId,
      fields: securitiesTable ? [
        { field: SecurityTableFields.ID, field_id: securitiesTable.fields.find(field => field.name === 'ID')?.fieldId || ''},
        { field: SecurityTableFields.SYMBOL, field_id: securitiesTable.fields.find(field => field.name === 'Symbol')?.fieldId || ''},
        { field: SecurityTableFields.NAME, field_id: securitiesTable.fields.find(field => field.name === 'Name')?.fieldId || ''},
        { field: SecurityTableFields.CLOSE_PRICE, field_id: securitiesTable.fields.find(field => field.name === 'Close Price')?.fieldId || ''},
        { field: SecurityTableFields.CLOSE_PRICE_AS_OF, field_id: securitiesTable.fields.find(field => field.name === 'Close Price As Of')?.fieldId || ''},
        { field: SecurityTableFields.TYPE, field_id: securitiesTable.fields.find(field => field.name === 'Type')?.fieldId || ''},
      ] : SECURITIES_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' }))
    },
    categories: {
      is_enabled: true,
      table_id: categoriesTable?.tableId,
      fields: transactionsTable && categoriesTable ? [
        { field: CategoryTableFields.ID, field_id: categoriesTable.fields.find(field => field.name === 'ID')?.fieldId || ''},
        { field: CategoryTableFields.NAME, field_id: categoriesTable.fields.find(field => field.name === 'Name')?.fieldId || ''},
        { field: CategoryTableFields.CATEGORY_GROUP, field_id: categoriesTable.fields.find(field => field.name === 'Category Group')?.fieldId || ''}
      ] : CATEGORIES_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' }))
    }
  }
}