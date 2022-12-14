import { Integrations_Enum } from "~/graphql/frontend";
import { TableConfigs, DestinationTableTypes, DestinationErrorCode, TableConfig, TableConfigFields, GoogleSheetsAuthentication, NotionAuthentication, DestinationAuthentication, AirtableAuthentication } from "~/types/shared/models";

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

export function isDestinationTableConfigsFrontendValid({ tableConfigs }: { tableConfigs: TableConfigs }): TableConfigErrorType[] {
  let errors = [] as TableConfigErrorType[];

  const enabledTableConfigs = Object.entries(tableConfigs).filter(([_, config]) => config.is_enabled) as [DestinationTableTypes, TableConfig][];
  
  // Check that each tableId is unique
  const configsWithDuplicateTableIds = enabledTableConfigs
    .filter(([ _, config]) => enabledTableConfigs.filter(([ _, c]) => c.table_id === config.table_id).length > 1);
  const duplicateTableIdErrors = configsWithDuplicateTableIds.map(([ tableType, config ]) => ({ tableType, errorCode: TableConfigErrorCode.DUPLICATE_TABLE, tableId: config.table_id }))
  errors = errors.concat(duplicateTableIdErrors);

  // Individual config checks 
  const tableConfigErrors = enabledTableConfigs.map(([ tableType, config ]) => validateTableConfig(tableType, config)).reduce((allErrors, tableErrors) => allErrors.concat(tableErrors), []);
  errors = errors.concat(tableConfigErrors);

  return errors
}

function validateTableConfig(tableType: DestinationTableTypes, config: TableConfig) {
  let errors = [] as TableConfigErrorType[];

  // Is there a table ID
  if ( !config.table_id ) { errors = errors.concat({ tableType, errorCode: TableConfigErrorCode.TABLE_NOT_SELECTED }) }

  // Do all fields have an ID
  const nonSelectedFields = config.fields.filter(field => !field.field_id || !field.field );
  errors = errors.concat(nonSelectedFields.map(field => ({ tableType, errorCode: TableConfigErrorCode.FIELD_NOT_SELECTED, tableId: config.table_id, fieldId: field.field_id, fieldType: field.field })));

  // Are all fields unique
  const duplicateFields = config.fields.filter(field => config.fields.filter(f => f.field_id === field.field_id).length > 1);
  errors = errors.concat(duplicateFields.map(field => ({ tableType, tableId: config.table_id, fieldId: field.field_id, fieldType: field.field, errorCode: TableConfigErrorCode.DUPLICATE_FIELD })))

  return errors;
}