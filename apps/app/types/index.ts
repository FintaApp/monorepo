
import { PropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Field, Integration, Table, AirtableCredential, GoogleSheetsCredential, NotionCredential } from "@prisma/client";

export type PlaidProduct = 'transactions' | 'investments';

export type TableConfig =  { id?: string; isEnabled: boolean; table: Table; tableId: string; fieldConfigs: { id?: string; field: Field; fieldId: string; tableConfigId?: string}[], destinationId?: string }

export type NotionPropertyType = PropertyItemObjectResponse['type'];
export type AirtableFieldType = 'checkbox' | 'currency' | 'date' | 'dateTime' | 'multipleRecordLinks' | 'multilineText' | 'multipleSelects' | 'number' | 'richText' | 'singleLineText' | 'singleSelect' | 'primary'
export type DestinationFieldType = NotionPropertyType | AirtableFieldType;

export type DestinationCredential = AirtableCredential | GoogleSheetsCredential | NotionCredential