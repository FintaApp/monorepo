import { Integrations_Enum } from "~/graphql/frontend";

export enum TableConfigErrorCode {
  DUPLICATE_TABLE = 'duplicate_table',
  DUPLICATE_FIELD = 'duplicate_field',
  TABLE_NOT_SELECTED = 'table_not_selected',
  FIELD_NOT_SELECTED = 'field_not_selected'
}

export type TableConfigErrorType = {
  tableType?: DestinationTableTypes;
  errorCode?: DestinationErrorCode | TableConfigErrorCode ;
  tableId?: string;
  fieldId?: string;
  fieldType?: TableConfigFields
}

export function password(password: string): boolean { return password.length >= 8 };

export function isDestinationAuthenticationFrontendValid({ integrationId, authentication = {} }: { integrationId: Integrations_Enum, authentication?: DestinationAuthentication | {} }) {
  if ( integrationId === Integrations_Enum.Google ) { return (authentication as GoogleSheetsAuthentication).spreadsheetId?.length > 0 }
  if ( integrationId === Integrations_Enum.Airtable ) { return (authentication as AirtableAuthentication).base_id?.length > 0 }
  if ( integrationId === Integrations_Enum.Notion ) { return (authentication as NotionAuthentication).access_token?.length > 0 }
}