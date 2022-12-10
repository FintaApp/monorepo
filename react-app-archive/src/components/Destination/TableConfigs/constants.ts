import { PropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints"

import { Integrations_Enum } from "src/graphql";
import { InstitutionsTableFields, AccountsTableFields, CategoryTableFields, TransactionsTableFields, HoldingsTableFields, InvestmentTransactionsTableFields, SecurityTableFields, DestinationTableTypes } from "@finta/types";
import { ToastStatusType } from "../../Toast";

type NotionPropertyTypes = PropertyItemObjectResponse['type']

export const ALWAYS_ENABLED_DATA_TYPES = [DestinationTableTypes.INSTITUTIONS, DestinationTableTypes.ACCOUNTS, DestinationTableTypes.SECURITIES, DestinationTableTypes.CATEGORIES];
export const SUCCESS_TOAST_CONFIG = { status: 'success' as ToastStatusType, title: 'Table Configuraton Saved' };

export const INSTITUTION_TABLE_FIELDS = [
  {
    field: InstitutionsTableFields.ID,
    label: 'Institution ID',
    is_required: true
  }, {
    field: InstitutionsTableFields.NAME,
    label: 'Institution Name',
    is_required: true
  }, {
    field: InstitutionsTableFields.LAST_UPDATE,
    label: "Last Update",
    is_required: true
  }, {
    field: InstitutionsTableFields.ERROR,
    label: 'Error',
    is_required: false
  }
]

export const ACCOUNTS_TABLE_FIELDS = [
  {
    field: AccountsTableFields.INSTITUTION,
    label: "Related Institution",
    is_required: true
  }, {
    field: AccountsTableFields.ID,
    label: "Account ID",
    is_required: true
  }, {
    field: AccountsTableFields.NAME,
    label: "Account Name",
    is_required: true
  }, {
    field: AccountsTableFields.AVAILABLE,
    label: "Available Balance",
    is_required: false
  }, {
    field: AccountsTableFields.CURRENT,
    label: "Current Balance",
    is_required: false,
  }, {
    field: AccountsTableFields.CURRENCY,
    label: "Account Currency",
    is_required: false,
  }, {
    field: AccountsTableFields.MASK,
    label: "Account Mask",
    is_required: false
  }, {
    field: AccountsTableFields.TYPE,
    label: "Account Type",
    is_required: false
  }, {
    field: AccountsTableFields.SUBTYPE,
    label: "Account Subtype",
    is_required: false
  }, {
    field: AccountsTableFields.LIMIT,
    label: "Account Limit",
    is_required: false,
  }
]

export const TRANSACTIONS_TABLE_FIELDS = [
  {
    field: TransactionsTableFields.ACCOUNT,
    label: "Related Account",
    is_required: true
  }, {
    field: TransactionsTableFields.ID,
    label: "Transaction ID",
    is_required: true
  }, {
    field: TransactionsTableFields.DATE,
    label: "Transaction Date",
    is_required: true
  }, {
    field: TransactionsTableFields.SUMMARY,
    label: "Transaction Summary",
    is_required: true
  }, {
    field: TransactionsTableFields.AMOUNT,
    label: "Transaction Amount",
    is_required: true
  }, {
    field: TransactionsTableFields.CURRENCY,
    label: "Transaction Currency",
    is_required: false
  }, {
    field: TransactionsTableFields.PENDING,
    label: "Transaction Pending Status",
    is_required: false
  }, {
    field: TransactionsTableFields.CATEGORY,
    label: "Transaction Category",
    is_required: false
  }, {
    field: TransactionsTableFields.SUB_ACCOUNT,
    label: "Transaction Sub Account",
    is_required: false
  }
]

export const HOLDINGS_TABLE_FIELDS = [
  {
    field: HoldingsTableFields.ACCOUNT,
    label: "Related Account",
    is_required: true
  }, {
    field: HoldingsTableFields.SECURITY_ID,
    label: "Related Security",
    is_required: true
  }, {
    field: HoldingsTableFields.SUMMARY,
    label: "Holding Summary",
    is_required: true,
    hideFor: [Integrations_Enum.Google]
  }, {
    field: HoldingsTableFields.QUANTITY,
    label: "Holding Quantity",
    is_required: true
  }, {
    field: HoldingsTableFields.COST_BASIS,
    label: "Holding Cost Basis",
    is_required: false
  }, {
    field: HoldingsTableFields.CURRENCY,
    label: "Holding Base Currency",
    is_required: false
  }
]

export const INVESTMENT_TRANSACTIONS_TABLE_FIELDS = [
  {
    field: InvestmentTransactionsTableFields.ACCOUNT,
    label: "Related Account",
    is_required: true
  }, {
    field: InvestmentTransactionsTableFields.ID,
    label: "Transaction ID",
    is_required: true
  }, {
    field: InvestmentTransactionsTableFields.DATE,
    label: "Transaction Date",
    is_required: true
  }, {
    field: InvestmentTransactionsTableFields.QUANTITY,
    label: "Transaction Quantity",
    is_required: true
  }, {
    field: InvestmentTransactionsTableFields.PRICE,
    label: "Security Price",
    is_required: true
  }, {
    field: InvestmentTransactionsTableFields.AMOUNT,
    label: "Transaction Amount",
    is_required: false
  }, {
    field: InvestmentTransactionsTableFields.FEES,
    label: "Transaction Fees",
    is_required: false
  }, {
    field: InvestmentTransactionsTableFields.CURRENCY,
    label: "Transaction Base Currency",
    is_required: false
  }, {
    field: InvestmentTransactionsTableFields.SUMMARY,
    label: "Transaction Summary",
    is_required: false
  }, {
    field: InvestmentTransactionsTableFields.TYPE,
    label: "Transaction Type",
    is_required: false
  }, {
    field: InvestmentTransactionsTableFields.SUBTYPE,
    label: "Transaction Subtype",
    is_required: false
  }, {
    field: InvestmentTransactionsTableFields.SECURITY_ID,
    label: "Related Security",
    is_required: false
  }
]

export const SECURITIES_TABLE_FIELDS = [
  {
    field: SecurityTableFields.ID,
    label: "Security ID",
    is_required: true
  }, {
    field: SecurityTableFields.SYMBOL,
    label: "Security Symbol",
    is_required: true
  }, {
    field: SecurityTableFields.NAME,
    label: "Security Name",
    is_required: false
  }, {
    field: SecurityTableFields.CLOSE_PRICE,
    label: "Close Price",
    is_required: false
  }, {
    field: SecurityTableFields.CLOSE_PRICE_AS_OF,
    label: "Close Price As Of",
    is_required: false
  }, {
    field: SecurityTableFields.TYPE,
    label: "Security Type",
    is_required: false
  },
]

export const CATEGORIES_TABLE_FIELDS = [
  {
    field: CategoryTableFields.ID,
    label: "Category ID",
    is_required: true
  }, {
    field: CategoryTableFields.NAME,
    label: "Category Name",
    is_required: true
  }, {
    field: CategoryTableFields.CATEGORY_GROUP,
    label: "Category Group",
    is_required: false
  }
]

export const fieldHelperText = {
  notion: {
    'rich_text': "Field must have the type: 'Text'",
    'title': "Must be the title field for the database",
    'checkbox': "Field must have the type: 'Checkbox'",
    'date': "Field must have the type: 'Date'",
    'number': "Field must have the type: 'Number'",
    'select': "Field must have the type: 'Select'",
    'relation': "Field must have the type: 'Relation'"
  }
} as { notion: Record<NotionPropertyTypes, string>}