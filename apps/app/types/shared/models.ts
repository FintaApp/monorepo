import { PropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Field, Integration, Table, AirtableCredential, GoogleSheetsCredential, NotionCredential } from "@prisma/client";
import { z } from "zod";
import { RouterOutput } from "~/lib/trpc";
import { AirtableCredentialSchema, GoogleSheetsCredentialSchema, NotionCredentialSchema } from "~/prisma/generated/zod";

export type NotionPropertyType = PropertyItemObjectResponse['type'];
export type AirtableFieldType = 'checkbox' | 'currency' | 'date' | 'dateTime' | 'multipleRecordLinks' | 'multilineText' | 'multipleSelects' | 'number' | 'richText' | 'singleLineText' | 'singleSelect' | 'primary'
export type DestinationFieldType = NotionPropertyType | AirtableFieldType;

export type TableConfig =  { id?: string; isEnabled: boolean; table: Table; tableId: string; fieldConfigs: { id?: string; field: Field; fieldId: string; tableConfigId?: string}[], destinationId?: string }

export type AirtableCredentialZod = z.TypeOf<typeof AirtableCredentialSchema>;
export type GoogleSheetsCredentialZod = z.TypeOf<typeof GoogleSheetsCredentialSchema>;
export type NotionCredentialZod = z.TypeOf<typeof NotionCredentialSchema>;

export type DestinationCredentialZod = AirtableCredentialZod | GoogleSheetsCredentialZod | NotionCredentialZod
export type DestinationCredential = AirtableCredential | GoogleSheetsCredential | NotionCredential


// import { PropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";
// import { Integrations_Enum } from "~/graphql/frontend";
// export type NotionPropertyType = PropertyItemObjectResponse['type']
// export type AirtableFieldType = 'checkbox' | 'currency' | 'date' | 'dateTime' | 'multipleRecordLinks' | 'multilineText' | 'multipleSelects' | 'number' | 'richText' | 'singleLineText' | 'singleSelect' | 'primary'
// export type DestinationFieldType = NotionPropertyType | AirtableFieldType;

// export type AirtableAuthentication = {
//   base_id: string;
//   api_key?: string; // Only used for legacy Airtable integrations
// }

// export type OauthCredentials = {
//   connectionId: string;
// }

// export type GoogleSheetsAuthentication = {
//   spreadsheetId: string;
// }

// export type CodaCredentials = {
//   is_ready: boolean;
//   access_token_hash: boolean;
// }

// export type NotionAuthentication = { access_token: string, bot_id: string; }

// export type DestinationAuthentication = AirtableAuthentication | GoogleSheetsAuthentication | CodaCredentials | NotionAuthentication

// export enum AccountsTableFields {
//   ID = 'id',
//   NAME = 'name',
//   INSTITUTION = 'institution',
//   AVAILABLE = 'available',
//   CURRENT = 'current',
//   CURRENCY = 'currency',
//   MASK = 'mask',
//   TYPE = 'type',
//   SUBTYPE = 'subtype',
//   LIMIT = 'limit',
//   INTEREST_RATE = 'interest_rate',
//   LAST_PAYMENT_AMOUNT = 'last_payment_amount',
//   LAST_PAYMENT_DATE = 'last_payment_date',
//   NEXT_PAYMENT_DUE_DATE = 'next_payment_due_date',
//   LAST_STATEMENT_BALANCE = 'last_statement_balance',
//   MINIMUM_PAYMENT_AMOUNT = 'minimum_payment_amount',
//   NEXT_MONTHLY_PAYMENT = 'next_monthly_payment',
//   ORIGINATION_DATE = 'origination_date',
//   ORIGINATION_PRINCIPAL_AMOUNT = 'origination_principal_amount'
// }

// export enum TransactionsTableFields {
//   ID = 'id',
//   SUMMARY = 'summary',
//   DATE = 'date',
//   ACCOUNT = 'account',
//   SUB_ACCOUNT = 'sub_account',
//   AMOUNT = 'amount',
//   CURRENCY = 'currency',
//   PENDING = 'is_pending',
//   CATEGORY = 'category'
// }

// export enum HoldingsTableFields {
//   ACCOUNT = 'account',
//   COST_BASIS = 'cost_basis',
//   CURRENCY = 'currency',
//   QUANTITY = 'quantity',
//   SECURITY_ID = 'security_id',
//   SUMMARY = 'summary'
// }

// export enum InvestmentTransactionsTableFields {
//   ACCOUNT = 'account',
//   AMOUNT = 'amount',
//   DATE = 'date',
//   FEES = 'fees',
//   ID = 'id',
//   CURRENCY = 'currency',
//   SUMMARY = 'summary',
//   PRICE = 'price',
//   QUANTITY = 'quantity',
//   SECURITY_ID = 'security_id',
//   SUBTYPE = 'subtype',
//   TYPE = 'type'
// }

// export enum SecurityTableFields {
//   ID = 'id',
//   SYMBOL = 'symbol',
//   NAME = 'name',
//   CLOSE_PRICE = 'close_price',
//   CLOSE_PRICE_AS_OF = 'close_price_as_of',
//   TYPE = 'type'
// }

// export enum CategoryTableFields {
//   ID = 'id',
//   NAME = 'name',
//   CATEGORY_GROUP = 'category_group'
// }

// export type TableConfigFields = AccountsTableFields | TransactionsTableFields | HoldingsTableFields | InvestmentTransactionsTableFields | SecurityTableFields | CategoryTableFields;

// export type TableConfig = {
//   is_enabled: boolean;
//   table_id?: string;
//   fields: {
//     field: TableConfigFields;
//     field_id: string;
//   }[]
// }

// export enum DestinationTableTypes {
//   INSTITUTIONS = 'institutions',
//   ACCOUNTS = 'accounts',
//   TRANSACTIONS = 'transactions',
//   HOLDINGS = 'holdings',
//   INVESTMENT_TRANSACTIONS = 'investment_transactions',
//   SECURITIES = 'securities',
//   CATEGORIES = 'categories'
// }

// export type TableConfigs = {
//   [DestinationTableTypes.INSTITUTIONS]?: TableConfig;
//   [DestinationTableTypes.ACCOUNTS]?: TableConfig;
//   [DestinationTableTypes.TRANSACTIONS]?: TableConfig;
//   [DestinationTableTypes.HOLDINGS]?: TableConfig;
//   [DestinationTableTypes.INVESTMENT_TRANSACTIONS]?: TableConfig;
//   [DestinationTableTypes.SECURITIES]?: TableConfig
//   [DestinationTableTypes.CATEGORIES]?: TableConfig
// }

// export enum DestinationErrorCode {
//   INVALID_CREDENTIALS = 'invalid_credentials',
//   DESTINATION_NOT_FOUND = 'destination_not_found', // E.g. the spreadsheet doesn't exist
//   NOT_ALLOWED = 'not_allowed', // E.g. Finta doesn't have access to the spreadsheet
//   INVALID_ROLE = 'invalid_role', // E.g. Finta doesn't have write-access to the destination
//   NO_HEADER_ROW = 'no_header_row', // No header row in google sheets
//   MISSING_TABLE = 'missing_table',
//   MISSING_FIELD = 'missing_field',
//   UNKNOWN_ERROR = 'unknown_error',
//   INCORRECT_FIELD_TYPE = 'incorrect_field_type',
//   TEMPLATE_DESTINATION = 'template_destination'
// }

// export type DestinationError = {
//   errorCode: DestinationErrorCode;
//   table?: string; // The user-defined representation of the table
//   field?: string; // The user-defined representation of the field
//   tableId?: string;
//   fieldId?: string;
//   tableType?: DestinationTableTypes;
//   fieldType?: TableConfigFields
// } | undefined; 

