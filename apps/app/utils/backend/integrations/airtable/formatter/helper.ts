import { FieldSet, Record as AirtableRecord } from "airtable";
import { TableConfigFields } from "~/types/shared/models";

export const parseRecordProperties = ({ record, tableConfigFields }: { record: AirtableRecord<FieldSet>, tableConfigFields: { field: TableConfigFields, field_id: string }[] }) => {
  return Object.fromEntries(tableConfigFields.map(field => {
    const value = record.fields[field.field_id];
    return [ field.field, value ]
  })) as Record<TableConfigFields, any>
}