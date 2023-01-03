import { NotionPropertyType, AirtableFieldType } from "~/types";
import { ToastStatusType } from "~/components/Common/Toast";
import { Integration, Table } from "@prisma/client";

export const SUCCESS_TOAST_CONFIG = { status: 'success' as ToastStatusType, title: 'Table Configuraton Saved' };

export const CODA_DESTINATION_TABLES = [
  Table.Transactions,
  Table.Holdings,
  Table.InvestmentTransactions
]

export const ALL_DESTINATION_TABLES = [
  Table.Institutions,
  Table.Accounts,
  Table.Transactions,
  Table.Categories,
  Table.Holdings,
  Table.InvestmentTransactions,
  Table.Securities
]

export const fieldHelperText = {
  [Integration.Notion]: {
    'rich_text': "Field must have the type: 'Text'",
    'title': "Must be the title field for the database",
    'checkbox': "Field must have the type: 'Checkbox'",
    'date': "Field must have the type: 'Date'",
    'number': "Field must have the type: 'Number'",
    'select': "Field must have the type: 'Select'",
    'relation': "Field must have the type: 'Relation'"
  },
  [Integration.Airtable]: {
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
} as { [Integration.Notion]: Record<NotionPropertyType, string>, [Integration.Airtable]: Record<AirtableFieldType, string>}