// Context is used for creating and updating a destination

import { AirtableCredential, Field, GoogleSheetsCredential, Integration, NotionCredential, SyncError, Table } from '@prisma/client';
import _ from 'lodash';
import moment from 'moment-timezone';
import { createContext, useContext, ReactNode, useMemo, useState, Dispatch, SetStateAction, useCallback } from 'react';
import { tableConfigsMeta } from '~/lib/tableConfigsMeta';
import { trpc, RouterOutput } from '~/lib/trpc';

import { DestinationCredential, TableConfig } from '~/types/shared/models';

interface DestinationContextType {
  integration: Integration;
  validateCredentials: () => Promise<RouterOutput['destinations']['validateCredentials']>;
  isValidatingCredentials: boolean;
  credentialsValidation?: RouterOutput['destinations']['validateCredentials'];
  destinationId?: string;
  onCancelChanges: () => void;
  canValidateCredentials: boolean;
  selectedAccountIds: string[];
  onToggleAccountIds: (accountIds: string[], action: 'add' | 'remove') => void;
  allPlaidAccounts: RouterOutput['plaid']['getAllPlaidAccounts'];
  isSetupMode: boolean;
  tables?: RouterOutput['destinations']['getTables'];
  getDefaultTableConfig: () => Promise<void>;
  tableConfigs?: TableConfig[];
  onChangeTableConfig: (tableConfig: TableConfig) => void;
  tableConfigsValidation?: TableConfigsValidation;
  tableConfigsHasChanges: boolean;
  resetTableConfigs: () => void;
  validateTableConfigs: () => void;
  isValidatingTableConfigs: boolean;
  isLoadingTables: boolean;
  refetchTables: () => Promise<any>;
  createDestination: () => Promise<RouterOutput['destinations']['createDestination']>;
  isCreatingDestination: boolean;
  isGettingDefaultTableConfig: boolean;
  credentialsHasChanges: boolean;

  googleSpreadsheetId?: string;
  setGoogleSpreadsheetId: Dispatch<SetStateAction<string>>;
  notionBotId?: string;
  setNotionBotId: Dispatch<SetStateAction<string>>;
  airtableBaseId?: string;
  setAirtableBaseId: Dispatch<SetStateAction<string>>;
  airtableApiKey?: string;
  isLegacyAirtable: boolean;

  name: string;
  setName: Dispatch<SetStateAction<string>>;

  syncStartDate: string;
  setSyncStartDate: Dispatch<SetStateAction<string>>;
}

const DestinationContext = createContext<DestinationContextType>({} as DestinationContextType)

interface DestinationProviderProps {
  children: ReactNode,
  isSetupMode: boolean;
  destinationId?: string;
  integration: Integration;
}

export enum TableConfigErrorCode {
  DUPLICATE_TABLE = 'duplicate_table',
  DUPLICATE_FIELD = 'duplicate_field',
  TABLE_NOT_SELECTED = 'table_not_selected',
  FIELD_NOT_SELECTED = 'field_not_selected'
}

export type TableConfigError = 'duplicate_table' | 'duplicate_field' | 'table_not_selected' | 'field_not_selected'
export type ConfigError = SyncError | TableConfigError;
export type FrontendTableConfigErrorType = {
  code: ConfigError;
  table?: Table;
  tableId?: string;
  tableName?: string;
  field?: Field;
  fieldId?: string;
  fieldName?: string;
}

type TableConfigsValidation = { isValid: boolean; errors?: FrontendTableConfigErrorType[] | RouterOutput['destinations']['validateTableConfigs']['errors'] }

export const DestinationProvider = ({ children, isSetupMode, integration, destinationId }: DestinationProviderProps) => {
  const { data: allPlaidAccounts } = trpc.plaid.getAllPlaidAccounts.useQuery();
  const { mutateAsync: validateCredentialsMutation, isLoading: isValidatingCredentials } = trpc.destinations.validateCredentials.useMutation();
  const { mutateAsync: getDefaultTableConfigMutation, isLoading: isGettingDefaultTableConfig }= trpc.destinations.getDefaultTableConfig.useMutation();
  const { mutateAsync: validateTableConfigsMutation, isLoading: isValidatingTableConfigs } = trpc.destinations.validateTableConfigs.useMutation();
  const { mutateAsync: createDestinationMutation, isLoading: isCreatingDestination } = trpc.destinations.createDestination.useMutation();
  const [ credentialsValidation, setCredentialsValidation ] = useState<RouterOutput['destinations']['validateCredentials']>();
  const [ selectedAccountIds, setSelectedAccountIds ] = useState<string[]>([])
  const [ name, setName ] = useState("My Budget");
  const [ syncStartDate, setSyncStartDate ] = useState<string>(moment().format("YYYY-MM-DD"));
  const [ tableConfigs, setTableConfigs ] = useState<TableConfig[]>();
  const [ tableConfigsValidation, setTableConfigsValidation ] = useState<TableConfigsValidation>();

  const [ googleSpreadsheetId, setGoogleSpreadsheetId ] = useState<string>();
  const [ notionBotId, setNotionBotId ] = useState<string>();
  const [ airtableBaseId, setAirtableBaseId ] = useState<string>();
  const [ airtableApiKey, setAirtableApiKey ] = useState<string>();

  const { data: tables, isLoading: isLoadingTables, isRefetching: isRefetchingTables, refetch: refetchTables } = trpc.destinations.getTables.useQuery({ integration, googleSpreadsheetId, notionBotId, airtableBaseId, airtableApiKey }, { enabled: !!credentialsValidation && credentialsValidation.isValid });
  
  const tableConfigsHasChanges = !_.isEqual(tableConfigs, {}); // TODO: Put destination.tableConfigs here
  const credentialsHasChanges = false;
  const resetTableConfigs = () => null;

  const getCanValidateCredential = useCallback(() => {
    if ( integration === Integration.Google ) { return googleSpreadsheetId && googleSpreadsheetId.length > 0 };
    if ( integration === Integration.Notion ) { return !!notionBotId }
    if ( integration === Integration.Airtable ) { return !!airtableBaseId }
  }, [ integration, googleSpreadsheetId, notionBotId, airtableBaseId ]);

  const validateTableConfigs = useCallback(() => {
    const frontendErrors = areTableConfigsFrontendValid(tableConfigs!);
    if ( frontendErrors.length > 0 ) { setTableConfigsValidation({ isValid: false, errors: frontendErrors }); return; }

    validateTableConfigsMutation({ tableConfigs: tableConfigs!, googleSpreadsheetId, notionBotId, airtableApiKey, airtableBaseId, integration })
      .then(setTableConfigsValidation)
  }, [ tableConfigs ])

  const onChangeTableConfig = useCallback((tableConfig: TableConfig) => {
    setTableConfigsValidation(undefined);
    setTableConfigs(prev => {
      const getRequiredFields = (table: Table) => tableConfigsMeta.find(config => config.table === table)!.fields.filter(field => field.isRequired && !field.hideFor?.includes(integration)).map(field => ({ field: field.field, fieldId: ''}))
      let newTableConfigs = prev?.map(tc => tc.table === tableConfig.table ? tableConfig : tc)

      const baseSecuritiesConfig = newTableConfigs?.find(config => config.table === Table.Securities) || { isEnabled: false, tableId: '', table: Table.Securities, fieldConfigs: getRequiredFields(Table.Securities)};
      const baseCategoriesConfig = newTableConfigs?.find(config => config.table === Table.Categories) || { isEnabled: false, tableId: '', table: Table.Categories, fieldConfigs: getRequiredFields(Table.Categories)};
      const holdingsConfig = newTableConfigs?.find(config => config.table === Table.Holdings) || { isEnabled: false, tableId: '', table: Table.Holdings, fieldConfigs: getRequiredFields(Table.Holdings)};
      const investmentTransactionsConfig = newTableConfigs?.find(config => config.table === Table.InvestmentTransactions) || { isEnabled: false, tableId: '', table: Table.InvestmentTransactions, fieldConfigs: getRequiredFields(Table.InvestmentTransactions)};
      const TransactionsConfig = newTableConfigs?.find(config => config.table === Table.Transactions) || { isEnabled: false, tableId: '', table: Table.Transactions, fieldConfigs: getRequiredFields(Table.Transactions)};
      const securitiesConfig = { ...baseSecuritiesConfig, isEnabled: !!(holdingsConfig.isEnabled || investmentTransactionsConfig.isEnabled) }
      const categoriesConfig = { ...baseCategoriesConfig, isEnabled: !!TransactionsConfig.isEnabled && !!TransactionsConfig?.fieldConfigs.find(field => field.field === Field.Category)};

      newTableConfigs = newTableConfigs?.map(config => {
        if ( config.table === Table.Securities) { return securitiesConfig };
        if ( config.table === Table.Categories) { return categoriesConfig };
        return config;
      });

      return newTableConfigs;
    });
  }, [])

  const createDestination = useCallback(async () => {
    return createDestinationMutation({ name, tableConfigs: tableConfigs!, syncStartDate, integration, googleSpreadsheetId, notionBotId, airtableBaseId, connectedAccountIds: selectedAccountIds })
  }, [ name, tableConfigs, syncStartDate, integration, googleSpreadsheetId, notionBotId, airtableBaseId, selectedAccountIds ]);

  const onCancelChanges = () => {
    setCredentialsValidation(undefined);
    setSelectedAccountIds([])
  }

  const getDefaultTableConfig = useCallback(async () => {
    const defaultConfigs = await getDefaultTableConfigMutation({ integration, googleSpreadsheetId, notionBotId, airtableBaseId })
      .then(response => response.tableConfigs)
    setTableConfigs(defaultConfigs)
  }, [ googleSpreadsheetId, notionBotId, airtableBaseId, integration ]);

  const onToggleAccountIds = useCallback((accountIds: string[], action: 'add' | 'remove') => {
    const newAccountIds = action === 'add'
      ? _.uniq((selectedAccountIds || []).concat(accountIds))
      : _.difference((selectedAccountIds || []), accountIds);

      setSelectedAccountIds(newAccountIds);

      if ( destinationId ) {
        // TODO
      }
  }, [ selectedAccountIds ])

  const validateCredentials = () => {
    return validateCredentialsMutation({ googleSpreadsheetId, notionBotId, airtableBaseId, airtableApiKey, integration })
      .then(response => {
        setCredentialsValidation(response);

        if ( !isSetupMode ) {
          // TODO: Update destination
        }

        return response;
      })
  }

  const memoedValue = useMemo(
    () => {
      const canValidateCredentials = getCanValidateCredential()
      return {
        integration,
        validateCredentials,
        isValidatingCredentials,
        credentialsValidation,
        destinationId,
        onCancelChanges,
        canValidateCredentials,
        selectedAccountIds,
        onToggleAccountIds,
        allPlaidAccounts,
        name,
        setName,
        syncStartDate,
        setSyncStartDate,
        isSetupMode,
        tables,
        getDefaultTableConfig,
        tableConfigs,
        onChangeTableConfig,
        tableConfigsValidation,
        tableConfigsHasChanges,
        resetTableConfigs,
        validateTableConfigs,
        isValidatingTableConfigs,
        isLoadingTables: isLoadingTables || isRefetchingTables,
        refetchTables,
        createDestination,
        isCreatingDestination,
        isGettingDefaultTableConfig,
        credentialsHasChanges,
        googleSpreadsheetId,
        setGoogleSpreadsheetId,
        notionBotId,
        setNotionBotId,
        airtableBaseId,
        setAirtableBaseId,
        airtableApiKey,
        isLegacyAirtable: !!airtableApiKey && integration === Integration.Airtable
      } as DestinationContextType
    }, [ 
      destinationId, integration, validateCredentials, isValidatingCredentials, 
      airtableApiKey, googleSpreadsheetId, setGoogleSpreadsheetId, notionBotId, setNotionBotId, airtableBaseId, setAirtableBaseId, airtableApiKey, credentialsValidation, allPlaidAccounts, refetchTables,
      onCancelChanges, selectedAccountIds, onToggleAccountIds, isLoadingTables, isRefetchingTables,
      name, setName, syncStartDate, setSyncStartDate, isSetupMode, tables, getDefaultTableConfig, isGettingDefaultTableConfig, tableConfigs,
      onChangeTableConfig, tableConfigsValidation, tableConfigsHasChanges, resetTableConfigs, validateTableConfigs, isValidatingTableConfigs,
      createDestination, isCreatingDestination, credentialsHasChanges
    ]
  )
  return <DestinationContext.Provider value = { memoedValue }>{ children }</DestinationContext.Provider>
}

export const useDestination = () => useContext(DestinationContext)

// Helper
const areTableConfigsFrontendValid = (tableConfigs: TableConfig[]): FrontendTableConfigErrorType[] => {
  let errors = [] as FrontendTableConfigErrorType[];
  const enabledTableConfigs = tableConfigs.filter(config => config.isEnabled);

  // Check that each tableId is unique;
  const configsWithDuplicateTableIds = enabledTableConfigs
    .filter(config => config.tableId.length > 0)
    .filter(config => enabledTableConfigs.filter(c => c.tableId === config.tableId).length > 1);
  errors = errors.concat(configsWithDuplicateTableIds.map(config => ({ table: config.table, code: TableConfigErrorCode.DUPLICATE_TABLE, tableId: config.tableId })))

  // Individual config checks
  const individualConfigErrors = enabledTableConfigs.map(config => {
    let iErrors = [] as FrontendTableConfigErrorType[];

    // Is there a table ID?
    if ( !config.tableId || config.tableId.length === 0 ) { iErrors = iErrors.concat({ table: config.table, code: TableConfigErrorCode.TABLE_NOT_SELECTED })};

    // Do all fields have an ID?
    const fieldsWithoutId = config.fieldConfigs.filter(field => !field.fieldId || !field.field );
    iErrors = iErrors.concat(fieldsWithoutId.map(field => ({ table: config.table, code: TableConfigErrorCode.FIELD_NOT_SELECTED, tableId: config.tableId, fieldId: field.fieldId, field: field.field })));

    // Are all fields unique?
    const duplicateFields = config.fieldConfigs.filter(field => config.fieldConfigs.filter(f => f.fieldId === field.fieldId).length > 1);
    iErrors = iErrors.concat(duplicateFields.map(field => ({ table: config.table, tableId: config.tableId, fieldId: field.fieldId, field: field.field, code: TableConfigErrorCode.DUPLICATE_FIELD })));

    return iErrors;
  }).reduce((allErrors, curr) => allErrors.concat(curr), []);
  errors = errors.concat(individualConfigErrors)

  return errors;
}