import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { TableConfigFields } from "~/types/shared/models";

export const parseSheetProperties = ({ row, tableConfigFields }: { row: GoogleSpreadsheetRow, tableConfigFields: { field: TableConfigFields, field_id: string }[] }) => {
  return Object.fromEntries(tableConfigFields.map(field => {
    const value = row[field.field_id];
    return [ field.field, value ]
  })) as Record<TableConfigFields, any>
}