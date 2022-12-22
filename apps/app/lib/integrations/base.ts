import { AirtableCredential, Destination, Field, GoogleSheetsCredential, Integration, NotionCredential, SyncError, Table } from "@prisma/client";
import { ALL_DESTINATION_TABLES } from "~/components/Destinations/Destination/TableConfigs/constants";
import { DestinationFieldType, TableConfig } from "~/types/shared/models";
import { tableConfigsMeta } from "../tableConfigsMeta";

export interface IntegrationBaseProps {
  userId: string;
  credentials: AirtableCredential | GoogleSheetsCredential | NotionCredential
}

export type ValidateDestinationCredentialsResponse = { isValid: boolean; error?: { code: SyncError, message: string }}
export type GetDestinationTablesRepsonse = { tables: { tableId: string; name: string; fields: { fieldId: string; name: string; type?: DestinationFieldType }[] }[]}
export type GetDefaultTableConfigsResponse = { tableConfigs: TableConfig[]}
export type ValidateTableConfigsFuncProps = { tableTypes?: Table[] | 'all'; tableConfigs: TableConfig[] };
export type ValidateTableConfigsFuncResponse = { isValid: boolean; errors: { code: SyncError, table?: Table, tableId?: string; tableName?: string; field?: Field; fieldId?: string; fieldName?: string; }[]};

export class IntegrationBase {
  credentials: AirtableCredential | GoogleSheetsCredential | NotionCredential;
  userId: string;
  integration?: Integration
  isLegacy: boolean;

  constructor({ userId, credentials }: IntegrationBaseProps) {
    this.credentials = credentials;
    this.userId = userId;
    this.isLegacy = false;
  }

  async getDefaulTableConfigs(): Promise<GetDefaultTableConfigsResponse> {
    const { tables } = await this.getTables();
    return {
      tableConfigs: tableConfigsMeta.map(tableConfig => {
        const table = tables.find(t => t.name === tableConfig.templateName);
        return {
          isEnabled: tableConfig.isRequired || !!table,
          table: tableConfig.table,
          tableId: table?.tableId || '',
          fieldConfigs: tableConfig.fields
            .filter(field => (field.isRequired && !field.hideFor?.includes(this.integration!)) || field.field === Field.Category) 
            .map(fieldConfig => {
              const field = table?.fields.find(f => this.integration === Integration.Google && fieldConfig.templateName.withId ? fieldConfig.templateName.withId === f.name : fieldConfig.templateName.withoutId === f.name)
              return {
                field: fieldConfig.field,
                fieldId: field?.fieldId || ''
              }
            })
        }
      })
    }
  }

  async validateTableConfigs({ tableTypes, tableConfigs }: ValidateTableConfigsFuncProps): Promise<ValidateTableConfigsFuncResponse> {
    const { tables } = await this.getTables();
    const tableTypesToCheck = tableTypes === 'all' ? ALL_DESTINATION_TABLES as Table[] : (tableTypes || tableConfigs.map(config => config.table));
    return Promise.all(tableTypesToCheck.map(tableType => {
      const tableConfig = tableConfigs.find(config => config.table === tableType)!; // Need to guarantee that every destination will always have all types of table configs
      const { tableId, isEnabled, fieldConfigs } = tableConfig;
      if ( !isEnabled ) { return { isValid: true }};

      const table = tables.find(t => t.tableId === tableId);
      if ( !table ) {
        return {
          isValid: false,
          error: {
            code: SyncError.MissingTable,
            table: tableType,
            tableId
          }
        }
      }

      const tableFieldIds = table.fields.map(field => field.fieldId);
      const missingField = fieldConfigs.find(field => !tableFieldIds.includes(field.fieldId ));
      if ( missingField ) {
        return {
          isValid: false,
          error: {
            code: SyncError.MissingField,
            table: tableType,
            tableId,
            tableName: table.name,
            field: missingField.field,
            fieldId: missingField.fieldId
          }
        }
      }

      if ( (this.integration === Integration.Airtable || this.integration === Integration.Notion) && !this.isLegacy ) {
        const fieldWithIncorrectType = fieldConfigs.find(field => {
          const tableField = table.fields.find(f => f.fieldId === field.fieldId)!;
          const allowedTypes = tableConfigsMeta.find(config => config.table === tableType)!.fields.find(f => f.field === field.field)!.allowedTypes[this.integration!]! as DestinationFieldType[]
          return tableField.type && !allowedTypes.includes(tableField.type!)
        });

        if ( fieldWithIncorrectType ) {
          return {
            isValid: false,
            error: {
              code: SyncError.IncorrectFieldType,
              table: tableType,
              tableId,
              tableName: table.name,
              field: fieldWithIncorrectType.field,
              fieldId: fieldWithIncorrectType.fieldId,
              fieldName: table.fields.find(f => f.fieldId === fieldWithIncorrectType.fieldId)!.name
            }
          }
        }
      }

      return { isValid: true }
    }))
    .then(responses => {
      const invalidResponses = responses.filter(response => !response.isValid );
      return { isValid: invalidResponses.length === 0, errors: invalidResponses.map(resp => resp.error!) }
    })
  }

  // Externally-used methods handled in sub-classes
  async init(): Promise<void> {}
  async validateCredentials(): Promise<ValidateDestinationCredentialsResponse> { return {} as ValidateDestinationCredentialsResponse }
  async getTables(): Promise<GetDestinationTablesRepsonse> { return {} as GetDestinationTablesRepsonse }

  // Formatting
  formatter = {

  } as {

  }
}