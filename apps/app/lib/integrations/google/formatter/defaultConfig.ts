import { GetDestinationTablesResponse } from "~/types/shared/functions";
import { TableConfigs, InstitutionsTableFields, CategoryTableFields, AccountsTableFields, TransactionsTableFields, HoldingsTableFields, InvestmentTransactionsTableFields, SecurityTableFields, CATEGORIES_TABLE_FIELDS, SECURITIES_TABLE_FIELDS, INVESTMENT_TRANSACTIONS_TABLE_FIELDS, HOLDINGS_TABLE_FIELDS, TRANSACTIONS_TABLE_FIELDS, ACCOUNTS_TABLE_FIELDS, INSTITUTION_TABLE_FIELDS } from "~/types/shared/models";

export const defaultConfig = ({ tables: sheets }: GetDestinationTablesResponse): TableConfigs => {
  const institutionsSheet = sheets.find(sheet => sheet.name === 'Institutions');
  const accountsSheet = sheets.find(sheet => sheet.name === 'Accounts');
  const transactionsSheet = sheets.find(sheet => sheet.name === 'Transactions');
  const holdingsSheet = sheets.find(sheet => sheet.name === 'Holdings');
  const investmentTransactionsSheet = sheets.find(sheet => sheet.name === 'Investment Transactions');
  const securitiesSheet = sheets.find(sheet => sheet.name === 'Securities');
  const categoriesSheet = sheets.find(sheet => sheet.name === "Categories");

  return {
    institutions: {
      is_enabled: true,
      table_id: institutionsSheet?.tableId,
      fields: institutionsSheet ? [
        { field: InstitutionsTableFields.ID, field_id: 'ID' },
        { field: InstitutionsTableFields.NAME, field_id: 'Name' },
        { field: InstitutionsTableFields.LAST_UPDATE, field_id: 'Last Update' },
        { field: InstitutionsTableFields.ERROR, field_id: 'Error' }
      ] : INSTITUTION_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' }))
    },
    accounts: {
      is_enabled: true,
      table_id: accountsSheet?.tableId,
      fields: accountsSheet ? [
        { field: AccountsTableFields.INSTITUTION, field_id: 'Institution ID' },
        { field: AccountsTableFields.ID, field_id: 'ID' },
        { field: AccountsTableFields.NAME, field_id: 'Name' },
        { field: AccountsTableFields.AVAILABLE, field_id: 'Available' },
        { field: AccountsTableFields.CURRENT, field_id: 'Current' },
        { field: AccountsTableFields.CURRENCY, field_id: 'Currency' },
        { field: AccountsTableFields.MASK, field_id: 'Mask' },
        { field: AccountsTableFields.TYPE, field_id: 'Type' },
        { field: AccountsTableFields.SUBTYPE, field_id: 'Subtype' },
        { field: AccountsTableFields.LIMIT, field_id: 'Limit' }
      ] : ACCOUNTS_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' }))
    },
    transactions: {
      is_enabled: true,
      table_id: transactionsSheet?.tableId,
      fields: transactionsSheet ? [
        { field: TransactionsTableFields.ACCOUNT, field_id: 'Account ID' },
        { field: TransactionsTableFields.ID, field_id: 'ID' },
        { field: TransactionsTableFields.SUMMARY, field_id: 'Summary' },
        { field: TransactionsTableFields.DATE, field_id: 'Date' },
        { field: TransactionsTableFields.AMOUNT, field_id: 'Amount' },
        { field: TransactionsTableFields.CURRENCY, field_id: 'Currency' },
        { field: TransactionsTableFields.PENDING, field_id: 'Pending?' },
        { field: TransactionsTableFields.CATEGORY, field_id: 'Category ID' },
        { field: TransactionsTableFields.SUB_ACCOUNT, field_id: 'Sub Account' }
      ] : TRANSACTIONS_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' }))
    },
    holdings: {
      is_enabled: true,
      table_id: holdingsSheet?.tableId,
      fields: holdingsSheet ? [
        { field: HoldingsTableFields.ACCOUNT, field_id: 'Account ID' },
        { field: HoldingsTableFields.COST_BASIS, field_id: 'Cost Basis'},
        { field: HoldingsTableFields.CURRENCY, field_id: 'Currency'},
        { field: HoldingsTableFields.QUANTITY, field_id: 'Quantity'},
        { field: HoldingsTableFields.SECURITY_ID, field_id: 'Security ID'}
      ] : HOLDINGS_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' }))
    },
    investment_transactions: {
      is_enabled: true,
      table_id: investmentTransactionsSheet?.tableId,
      fields: investmentTransactionsSheet ? [
        { field: InvestmentTransactionsTableFields.ACCOUNT, field_id: 'Account ID'},
        { field: InvestmentTransactionsTableFields.AMOUNT, field_id: 'Amount'},
        { field: InvestmentTransactionsTableFields.CURRENCY, field_id: 'Currency'},
        { field: InvestmentTransactionsTableFields.DATE, field_id: 'Date'},
        { field: InvestmentTransactionsTableFields.FEES, field_id: 'Fees'},
        { field: InvestmentTransactionsTableFields.ID, field_id: 'ID'},
        { field: InvestmentTransactionsTableFields.PRICE, field_id: 'Price'},
        { field: InvestmentTransactionsTableFields.QUANTITY, field_id: 'Quantity'},
        { field: InvestmentTransactionsTableFields.SECURITY_ID, field_id: 'Security ID'},
        { field: InvestmentTransactionsTableFields.SUBTYPE, field_id: 'Subtype'},
        { field: InvestmentTransactionsTableFields.SUMMARY, field_id: 'Summary'},
        { field: InvestmentTransactionsTableFields.TYPE, field_id: 'Type'}
      ] : INVESTMENT_TRANSACTIONS_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' }))
    },
    securities: {
      is_enabled: true,
      table_id: securitiesSheet?.tableId,
      fields: securitiesSheet ? [
        { field: SecurityTableFields.ID, field_id: 'ID'},
        { field: SecurityTableFields.SYMBOL, field_id: 'Symbol'},
        { field: SecurityTableFields.NAME, field_id: 'Name'},
        { field: SecurityTableFields.CLOSE_PRICE, field_id: 'Close Price'},
        { field: SecurityTableFields.CLOSE_PRICE_AS_OF, field_id: 'Close Price As Of'},
        { field: SecurityTableFields.TYPE, field_id: 'Type'},
      ] : SECURITIES_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' }))
    },
    categories: {
      is_enabled: true,
      table_id: categoriesSheet?.tableId,
      fields: transactionsSheet && categoriesSheet ? [
        { field: CategoryTableFields.ID, field_id: 'ID'},
        { field: CategoryTableFields.NAME, field_id: 'Name'},
        { field: CategoryTableFields.CATEGORY_GROUP, field_id: 'Category Group'}
      ] : CATEGORIES_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' }))
    }
  }
}