import { FieldSet, Record as AirtableRecord } from "airtable";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { GoogleSpreadsheetRow } from "google-spreadsheet";

import { AirtableCredential, Field, GoogleSheetsCredential, NotionCredential, PlaidAccount, PlaidInstitution, PlaidItem as DBPlaidItem, SyncError, Table } from "@prisma/client";
import { DestinationFieldType, TableConfig, TableConfigError } from "~/types";
import { AccountBase, CreditCardLiability, Holding, InvestmentTransaction, MortgageLiability, Security, StudentLoan, Transaction } from "plaid";

export interface IntegrationBaseProps {
  userId: string;
  credentials: AirtableCredential | GoogleSheetsCredential | NotionCredential
}

export type ValidateTableConfigProps = {
  tableId: string;
  fields: {
    id?: string | undefined;
    field: Field;
    fieldId: string;
    tableConfigId?: string | undefined;
  }[];
  table: Table
}
export type AirtableLegacyValidateResponse = { isValid: boolean, error?: {
  code: SyncError,
  table?: Table,
  tableId?: string,
  tableName?: string,
  field?: Field,
  fieldId?: string;
}}

// Universal record type for all integrations
export type IntegrationRecord = {
  id: string | number; // The sheet / page / record id used by the integration
  properties: Record<Field, any>;
  object: GoogleSpreadsheetRow | PageObjectResponse | AirtableRecord<FieldSet> | {}
}

export type IntegrationConfig = {
  table: Table;
  tableId: string;
  isEnabled: boolean;
  fieldConfigs: TableConfig['fieldConfigs'];
  records: IntegrationRecord[]
}[]

export type Category = { id: string; name: string; category_group: string }
export type PlaidItem = (DBPlaidItem & {
  accounts: PlaidAccount[];
  institution: PlaidInstitution;
})

export type ValidateDestinationCredentialsResponse = { isValid: boolean; error?: { code: SyncError, message: string }}
export type GetDestinationTablesRepsonse = { tables: { tableId: string; name: string; fields: { fieldId: string; name: string; type?: DestinationFieldType }[] }[]}
export type GetDefaultTableConfigsResponse = { tableConfigs: TableConfig[]}
export type ValidateTableConfigsFuncProps = { tableTypes?: Table[] | 'all'; tableConfigs: TableConfig[] };
export type ValidateTableConfigsFuncResponse = { isValid: boolean; errors: TableConfigError[] };

export type InstitutionFormatter = {
  new: ({ item }: { item: PlaidItem}) => Record<Field, any>
  updated: ({ item, timezone }: { item: PlaidItem, timezone?: string }) => Record<Field, any>
}

export type AccountFormatter = {
  new: ({ account, accountName, itemRecordId, student, credit, mortage }: { accountName: string; account: AccountBase; itemRecordId: string; student?: StudentLoan; credit?: CreditCardLiability; mortage?: MortgageLiability}) => Record<Field, any>,
  updated: ({ account, student, credit, mortage }: { account: AccountBase; student?: StudentLoan; credit?: CreditCardLiability; mortage?: MortgageLiability }) => Record<Field, any>
}

export type CategoryFormatter = {
  new: ({ category }: { category: Category, }) => Record<Field, any>
}

export type TransactionFormatter = {
  new: ({ transaction, accountRecordId, categoryRecordId }: { transaction: Transaction; accountRecordId: string; categoryRecordId?: string; }) => Record<Field, any>,
  updated: ({ transaction }: { transaction: Transaction; }) => Record<Field, any>
}

export type SecurityFormatter = {
  new: ({ security }: { security: Security;  }) => Record<Field, any>,
  updated: ({ security }: { security: Security;  }) => Record<Field, any>
}

export type HoldingFormatter = {
  new: ({ holding, accountRecordId, securityRecordId, symbol }: { holding: Holding; accountRecordId?: string; securityRecordId?: string; symbol?: string; }) => Record<Field, any>,
  updated: ({ holding }: { holding: Holding; }) => Record<Field, any>
}

export type InvestmentTransactionFormatter = {
  new: ({ investmentTransaction, accountRecordId, securityRecordId }: { investmentTransaction: InvestmentTransaction; accountRecordId?: string; securityRecordId?: string; }) => Record<Field, any>,
}