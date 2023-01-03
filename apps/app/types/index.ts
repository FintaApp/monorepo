
import { PropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Field, Table, AirtableCredential, GoogleSheetsCredential, NotionCredential, PlaidItem, PlaidInstitution, PlaidAccount, DestinationTableConfig, DestinationFieldConfig, Destination, User, SyncError } from "@prisma/client";

export type PlaidProduct = 'transactions' | 'investments';

export type TableConfig =  { id?: string; isEnabled: boolean; table: Table; tableId: string; fieldConfigs: { id?: string; field: Field; fieldId: string; tableConfigId?: string}[], destinationId?: string }

export type NotionPropertyType = PropertyItemObjectResponse['type'];
export type AirtableFieldType = 'checkbox' | 'currency' | 'date' | 'dateTime' | 'multipleRecordLinks' | 'multilineText' | 'multipleSelects' | 'number' | 'richText' | 'singleLineText' | 'singleSelect' | 'primary'
export type DestinationFieldType = NotionPropertyType | AirtableFieldType;

export type DestinationCredential = AirtableCredential | GoogleSheetsCredential | NotionCredential;

export type PlaidWebhookDestination = (Destination & { 
  airtableCredential: AirtableCredential | null;
  googleSheetsCredential: GoogleSheetsCredential | null;
  notionCredential: NotionCredential | null;
  accounts: PlaidAccount[];
  tableConfigs: (DestinationTableConfig & { fieldConfigs: DestinationFieldConfig[] })[];
})

export type PlaidWebhookItem = PlaidItem & {
  accounts: PlaidAccount[];
  institution: PlaidInstitution;
  user: User;
}

export type OauthItem = PlaidItem & {
  institution: PlaidInstitution;
}

export interface TableConfigError {
  code: SyncError;
  table?: Table;
  tableId?: string;
  tableName?: string;
  field?: Field;
  fieldId?: string;
  fieldName?: string;
}

// JSON Field Types
export type SyncMetadata = { targetTable: Table };
export type SyncErrorMetadata = Omit<TableConfigError, 'code'>