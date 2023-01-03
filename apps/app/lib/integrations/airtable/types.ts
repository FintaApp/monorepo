import { AirtableFieldType } from "~/types";

export type GetBasesResponse = {
  bases: {
    id: string;
    name: string;
    permissionLevel: "none" | "read" | "comment" | "edit" | "create"
  }[]
}

export type GetBaseTablesResponse = {
  tables: {
    description: string;
    id: string;
    name: string;
    primaryFieldId: string;
    fields: {
      id: string;
      description: string;
      name: string;
      type: AirtableFieldType
    }[]
  }[]
}