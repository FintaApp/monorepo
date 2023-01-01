import { Field, Integration, Table, AirtableCredential, GoogleSheetsCredential, NotionCredential } from "@prisma/client";

export type PlaidProduct = 'transactions' | 'investments';

export type TableConfig =  { id?: string; isEnabled: boolean; table: Table; tableId: string; fieldConfigs: { id?: string; field: Field; fieldId: string; tableConfigId?: string}[], destinationId?: string }