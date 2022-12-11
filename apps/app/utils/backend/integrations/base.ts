import { SyncDataFuncProps, SyncDataFuncResponse, CheckTablesFuncProps, CheckTablesFuncResponse, IIntegration, IntegrationConfig, CheckAuthenticationFuncResponse, ValidateFuncProps, ValidateFuncResponse, CheckTableFuncProps, CheckTableFuncResponse, GetTablesFuncResponse } from "~/types/backend/integrations";
import { DestinationCredentials, DestinationError, DestinationTableTypes, TableConfigFields, TableConfigs } from "~/types/shared/models";
import { DestinationModel } from "~/types/backend/models";

export class IntegrationBase implements IIntegration {
  destination?: DestinationModel;
  credentials: DestinationCredentials;
  config: IntegrationConfig;

  constructor({ destination, credentials }: { destination?: DestinationModel, credentials?: DestinationCredentials }) {
    this.destination = destination;
    this.credentials = destination?.notion_connection || destination?.authentication || credentials;
    const tableConfigs = destination?.table_configs;

    if ( tableConfigs ) {
      const tableTypes = [
        DestinationTableTypes.ACCOUNTS, DestinationTableTypes.CATEGORIES, DestinationTableTypes.HOLDINGS, 
        DestinationTableTypes.INSTITUTIONS, DestinationTableTypes.INVESTMENT_TRANSACTIONS, DestinationTableTypes.SECURITIES, 
        DestinationTableTypes.TRANSACTIONS
      ];

      this.config = Object.fromEntries(tableTypes.map(tableType => {
        const config = tableConfigs[tableType];
        return [ tableType, {
          tableId: config?.table_id,
          fields: (config?.fields.reduce((obj, field) => ({ ...obj, [field.field]: field.field_id }), {}) || {}) as Record<TableConfigFields, string>,
          isEnabled: config?.is_enabled
        }]
      })) as IntegrationConfig // Object.fromEntries doesn't preserve type of key
    } else { 
      this.config = { 
        institutions: { isEnabled: false, fields: [], tableId: ""},
        accounts: { isEnabled: false, fields: [], tableId: ""},
        transactions: { isEnabled: false, fields: [], tableId: ""},
        categories: { isEnabled: false, fields: [], tableId: ""},
        holdings: { isEnabled: false, fields: [], tableId: ""},
        investment_transactions: { isEnabled: false, fields: [], tableId: ""},
        securities: { isEnabled: false, fields: [], tableId: ""},
      } 
    }
  }

  // External Helper Methods
  async validate({ tableTypes }: ValidateFuncProps): Promise<ValidateFuncResponse> {
    let isValid = true;
    let error = undefined as DestinationError;

    const authCheck = await this.checkAuthentication();
    if ( !authCheck.isValid ) {
      isValid = false;
      error = { errorCode: authCheck.errorCode! }
    } else {
      const tableCheck = await this.checkTables({ tableTypes });
      if ( !tableCheck.isValid ) {
        isValid = false;
        error = tableCheck.error!
      }
    }

    return { isValid, error }
  }

  async init() {}

  async load() {}

  async checkTables({ tableTypes }: CheckTablesFuncProps): Promise<CheckTablesFuncResponse> {
    const tableConfigs = this.destination!.table_configs;
    return Promise.all(tableTypes.map(tableType => {
      const tableConfig = tableConfigs[tableType]!;
      const { table_id, fields, is_enabled } = tableConfig;
      if ( !is_enabled ) { return { isValid: true, error: null }};
      return this.checkTable({ tableId: table_id!, fields, tableType })
    }))
    .then(responses => {
      const invalidResponse = responses.find(response => !response.isValid);
      return { isValid: !invalidResponse, error: invalidResponse?.error }
    })
  }

  // Overridden methods
  async checkAuthentication(): Promise<CheckAuthenticationFuncResponse> { return {} as CheckAuthenticationFuncResponse };
  async syncData(_: SyncDataFuncProps): Promise<SyncDataFuncResponse> { return {} as SyncDataFuncResponse}
  async checkTable(_: CheckTableFuncProps): Promise<CheckTableFuncResponse> { return {} as CheckTableFuncResponse};
  async getTables(): Promise<GetTablesFuncResponse> { return [] }
  async getDefaultConfig(): Promise<TableConfigs> { return {}}

  // Internal Helper Methods
}