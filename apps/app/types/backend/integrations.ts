import { GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { Transaction, AccountBase, Holding, InvestmentTransaction, Security } from "plaid";
import { DestinationModel, PlaidItemModel } from "~/types/backend/models";

import { GetDestinationTablesResponse } from "~/types/shared/functions";
import { DestinationTableTypes, TableConfigFields, TableConfigs, DestinationCredentials, DestinationError, DestinationErrorCode, TableConfig } from "~/types/shared/models";

export type IntegrationConfig = {
  [k in DestinationTableTypes]: {
    tableId: string;
    fields: Record<TableConfigFields, string> | {};
    sheet?: GoogleSpreadsheetWorksheet;
    rows?: GoogleSpreadsheetRow[];
    records?: { id: string, properties: Record<TableConfigFields, any> }[],
    isEnabled: boolean;
  }
}

export type ValidateFuncProps = { tableTypes: DestinationTableTypes[] };
export type ValidateFuncResponse = { isValid: boolean; error: DestinationError | null};
export type CheckAuthenticationFuncResponse = { isValid: boolean; errorCode?: DestinationErrorCode; errorCredential?: 'api_key' | 'base_id' | 'access_token' }
export type CheckTablesFuncProps = { tableTypes: DestinationTableTypes[] };
export type CheckTablesFuncResponse = { isValid: boolean; error: DestinationError | null};
export type SyncDataFuncProps = { 
  item: PlaidItemModel, 
  accounts: AccountBase[], 
  transactions?: Transaction[], 
  removedTransactions?: string[], 
  holdings?: Holding[], 
  investmentTransactions?: InvestmentTransaction[], 
  securities?: Security[],
  categories?: { id: string; name: string; category_group: string }[]
};
export type SyncDataFuncResponse = { 
  accounts: { added: string[], updated: string[]},
  holdings: { added: number; updated: number},
  transactions: { added: number; updated: number, removed: number},
  investmentTransactions: { added: number }
};
export type CheckTableFuncProps = { tableId: string; fields: TableConfig['fields'], tableType: DestinationTableTypes };
export type CheckTableFuncResponse = { isValid: boolean; error: DestinationError | null};
export type GetTablesFuncResponse = GetDestinationTablesResponse['tables'];

export interface IIntegration {
  destination?: DestinationModel;
  credentials: DestinationCredentials;
  config: IntegrationConfig;

  validate(_: ValidateFuncProps): Promise<ValidateFuncResponse>
  init(): Promise<void>;
  checkAuthentication(): Promise<CheckAuthenticationFuncResponse>
  checkTables(_: CheckTablesFuncProps): Promise<CheckTablesFuncResponse>;
  syncData(_: SyncDataFuncProps): Promise<SyncDataFuncResponse>;
  checkTable(_: CheckTableFuncProps): Promise<CheckTableFuncResponse>;
  getTables(): Promise<GetTablesFuncResponse>;
  getDefaultConfig(): Promise<TableConfigs>
}