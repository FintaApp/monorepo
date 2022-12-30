import { Integrations_Enum } from "~/graphql/frontend";
import { InstitutionsTableFields, AccountsTableFields, CategoryTableFields, TransactionsTableFields, HoldingsTableFields, InvestmentTransactionsTableFields, SecurityTableFields, DestinationTableTypes, TableConfigFields, AirtableFieldType, NotionPropertyType, INSTITUTION_TABLE_FIELDS, ACCOUNTS_TABLE_FIELDS, TRANSACTIONS_TABLE_FIELDS, HOLDINGS_TABLE_FIELDS, CATEGORIES_TABLE_FIELDS, INVESTMENT_TRANSACTIONS_TABLE_FIELDS, SECURITIES_TABLE_FIELDS } from "~/types/shared/models"
import { ToastStatusType } from "~/components/Common/Toast";

export const ALWAYS_ENABLED_DATA_TYPES = [DestinationTableTypes.INSTITUTIONS, DestinationTableTypes.ACCOUNTS, DestinationTableTypes.SECURITIES, DestinationTableTypes.CATEGORIES];
export const SUCCESS_TOAST_CONFIG = { status: 'success' as ToastStatusType, title: 'Table Configuraton Saved' };



export const CODA_DESTINATION_TABLES = [
  DestinationTableTypes.TRANSACTIONS,
  DestinationTableTypes.HOLDINGS,
  DestinationTableTypes.INVESTMENT_TRANSACTIONS
]

export const ALL_DESTINATION_TABLES = [
  { tableType: DestinationTableTypes.INSTITUTIONS, allFields: INSTITUTION_TABLE_FIELDS },
  { tableType: DestinationTableTypes.ACCOUNTS, allFields: ACCOUNTS_TABLE_FIELDS },
  { tableType: DestinationTableTypes.TRANSACTIONS, allFields: TRANSACTIONS_TABLE_FIELDS },
  { tableType: DestinationTableTypes.CATEGORIES, allFields: CATEGORIES_TABLE_FIELDS },
  { tableType: DestinationTableTypes.HOLDINGS, allFields: HOLDINGS_TABLE_FIELDS },
  { tableType: DestinationTableTypes.INVESTMENT_TRANSACTIONS, allFields: INVESTMENT_TRANSACTIONS_TABLE_FIELDS },
  { tableType: DestinationTableTypes.SECURITIES, allFields: SECURITIES_TABLE_FIELDS },
] as { tableType: DestinationTableTypes, allFields: { field: TableConfigFields, label: string, is_required: boolean; hideFor?: Integrations_Enum[]}[]}[]

export const fieldHelperText = {
  notion: {
    'rich_text': "Field must have the type: 'Text'",
    'title': "Must be the title field for the database",
    'checkbox': "Field must have the type: 'Checkbox'",
    'date': "Field must have the type: 'Date'",
    'number': "Field must have the type: 'Number'",
    'select': "Field must have the type: 'Select'",
    'relation': "Field must have the type: 'Relation'"
  },
  airtable: {
    'primary': "Field must be the primary field for the table",
    'checkbox': "Field must have the type: 'Checkbox'",
    'currency': "Field must have the type: 'Currency'",
    'date': "Field must have the type: 'Date'",
    'dateTime': "Field must have the type: 'DateTime'",
    'multipleRecordLinks': "Field must have the type: 'Relation'",
    'multilineText': "Field must have the type: 'Multiline Text'",
    'multipleSelects': "Field must have the type: 'Multiple Selects'",
    'number': "Field must have the type: 'Number'",
    'richText': "Field must have the type: 'Rich Text'",
    'singleLineText': "Field must have the type: 'Singleline Text'",
    'singleSelect': "Field must have the type: 'Single Select'"
  }
} as { notion: Record<NotionPropertyType, string>, airtable: Record<AirtableFieldType, string>}