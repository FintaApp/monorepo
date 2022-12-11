import { TableConfigs, InstitutionsTableFields, AccountsTableFields, TransactionsTableFields, HoldingsTableFields, InvestmentTransactionsTableFields, SecurityTableFields, CategoryTableFields } from "~/types/shared/models";

export const defaultConfig = (): TableConfigs => ({
  institutions: {
    is_enabled: true,
    table_id: 'Institutions',
    fields: [
      { field: InstitutionsTableFields.ID, field_id: 'ID' },
      { field: InstitutionsTableFields.NAME, field_id: 'Name' },
      { field: InstitutionsTableFields.LAST_UPDATE, field_id: 'Last Update' },
      { field: InstitutionsTableFields.ERROR, field_id: 'Error' },
    ]
  },
  accounts: {
    is_enabled: true,
    table_id: 'Accounts',
    fields: [
      { field: AccountsTableFields.INSTITUTION, field_id: 'Institution' },
      { field: AccountsTableFields.ID, field_id: 'ID' },
      { field: AccountsTableFields.NAME, field_id: 'Name' },
      { field: AccountsTableFields.AVAILABLE, field_id: 'Available' },
      { field: AccountsTableFields.CURRENT, field_id: 'Current' },
      { field: AccountsTableFields.CURRENCY, field_id: 'Currency' },
      { field: AccountsTableFields.MASK, field_id: 'Mask' },
      { field: AccountsTableFields.TYPE, field_id: 'Type' },
      { field: AccountsTableFields.SUBTYPE, field_id: 'Subtype' },
      { field: AccountsTableFields.LIMIT, field_id: 'Limit' },
    ]
  },
  transactions: {
    is_enabled: true,
    table_id: 'Transactions',
    fields: [
      { field: TransactionsTableFields.ACCOUNT, field_id: 'Account' },
      { field: TransactionsTableFields.ID, field_id: 'ID' },
      { field: TransactionsTableFields.SUMMARY, field_id: 'Summary' },
      { field: TransactionsTableFields.DATE, field_id: 'Date' },
      { field: TransactionsTableFields.AMOUNT, field_id: 'Amount' },
      { field: TransactionsTableFields.CURRENCY, field_id: 'Currency' },
      { field: TransactionsTableFields.PENDING, field_id: 'Pending?' },
      { field: TransactionsTableFields.CATEGORY, field_id: 'Category' },
      { field: TransactionsTableFields.SUB_ACCOUNT, field_id: 'Sub Account' }
    ]
  },
  holdings: { 
    is_enabled: true, 
    table_id: "Holdings", 
    fields: [
      { field: HoldingsTableFields.ACCOUNT, field_id: 'Account' },
      { field: HoldingsTableFields.COST_BASIS, field_id: 'Cost Basis'},
      { field: HoldingsTableFields.CURRENCY, field_id: 'Currency'},
      { field: HoldingsTableFields.QUANTITY, field_id: 'Quantity'},
      { field: HoldingsTableFields.SECURITY_ID, field_id: 'Security'},
      { field: HoldingsTableFields.SUMMARY, field_id: 'Summary'}
    ] 
  },
  investment_transactions: { 
    is_enabled: true, 
    table_id: "Investment Transactions", 
    fields: [
      { field: InvestmentTransactionsTableFields.ACCOUNT, field_id: 'Account'},
      { field: InvestmentTransactionsTableFields.AMOUNT, field_id: 'Amount'},
      { field: InvestmentTransactionsTableFields.CURRENCY, field_id: 'Currency'},
      { field: InvestmentTransactionsTableFields.DATE, field_id: 'Date'},
      { field: InvestmentTransactionsTableFields.FEES, field_id: 'Fees'},
      { field: InvestmentTransactionsTableFields.ID, field_id: 'ID'},
      { field: InvestmentTransactionsTableFields.PRICE, field_id: 'Price'},
      { field: InvestmentTransactionsTableFields.QUANTITY, field_id: 'Quantity'},
      { field: InvestmentTransactionsTableFields.SECURITY_ID, field_id: 'Security'},
      { field: InvestmentTransactionsTableFields.SUBTYPE, field_id: 'Subtype'},
      { field: InvestmentTransactionsTableFields.SUMMARY, field_id: 'Summary'},
      { field: InvestmentTransactionsTableFields.TYPE, field_id: 'Type'}
    ] 
  },
  securities: {
    is_enabled: true,
    table_id: "Securities",
    fields: [
      { field: SecurityTableFields.ID, field_id: 'ID'},
      { field: SecurityTableFields.SYMBOL, field_id: 'Symbol'},
      { field: SecurityTableFields.NAME, field_id: 'Name'},
      { field: SecurityTableFields.CLOSE_PRICE, field_id: 'Close Price'},
      { field: SecurityTableFields.CLOSE_PRICE_AS_OF, field_id: 'Close Price As Of'},
      { field: SecurityTableFields.TYPE, field_id: 'Type'}
    ]
  },
  categories: {
    is_enabled: true,
    table_id: "Categories",
    fields: [
      { field: CategoryTableFields.ID, field_id: 'ID'},
      { field: CategoryTableFields.NAME, field_id: 'Name'},
      { field: CategoryTableFields.CATEGORY_GROUP, field_id: 'Category Group'}
    ]
  }
})