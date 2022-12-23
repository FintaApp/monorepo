import { Field } from "@prisma/client";
import { GoogleSpreadsheetRow } from "google-spreadsheet";
import { TableConfig } from "~/types/shared/models";

export const parseSheetProperties = ({ row, fieldConfigs }: { row: GoogleSpreadsheetRow, fieldConfigs: TableConfig['fieldConfigs'] }) => {
  return Object.fromEntries(fieldConfigs.map(field => {
    const value = row[field.fieldId];
    return [ field.field, value ]
  })) as Record<Field, any>
}