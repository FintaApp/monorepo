import { Field } from "@prisma/client";
import { FieldSet, Record as AirtableRecord } from "airtable";
import { TableConfig } from "~/types";

export const parseRecordProperties = ({ record, fieldConfigs }: { record: AirtableRecord<FieldSet>, fieldConfigs: TableConfig['fieldConfigs'] }) => {
  return Object.fromEntries(fieldConfigs.map(field => {
    const value = record.fields[field.fieldId];
    return [ field.field, value ]
  })) as Record<Field, any>
}