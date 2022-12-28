// Context is used for creating and updating a destination

import { Skeleton } from '@chakra-ui/react';
import { Field, Integration, SyncError, Table } from '@prisma/client';
import _ from 'lodash';
import moment from 'moment-timezone';
import { createContext, useContext, ReactNode, useMemo, useState, Dispatch, SetStateAction, useCallback, useEffect } from 'react';
import { useToast } from '~/lib/context/useToast';
import { tableConfigsMeta } from '~/lib/tableConfigsMeta';
import { trpc, RouterOutput } from '~/lib/trpc';

import { TableConfig } from '~/types/shared/models';

interface DestinationContextType {
  integration: Integration;
  destination?: RouterOutput['destinations']['getDestination'];
  refetchDestination: () => Promise<any>;
  validateCredentials: () => Promise<RouterOutput['destinations']['validateCredentials']>;
  isValidatingCredentials: boolean;
  credentialsValidation?: RouterOutput['destinations']['validateCredentials'];
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
  validateTableConfigs: () => void;
  isValidatingTableConfigs: boolean;
  isLoadingTables: boolean;
  refetchTables: () => Promise<any>;
  createDestination: (code?: string, shouldRefetch?: boolean) => Promise<void>;
  isCreatingDestination: boolean;
  isGettingDefaultTableConfig: boolean;
  credentialsHasChanges: boolean;
  isUpdatingCredentials: boolean;
  currentActiveSyncId?: string;
  setCurrentActiveSyncId: Dispatch<SetStateAction<string | undefined>>;

  googleSpreadsheetId?: string;
  setGoogleSpreadsheetId: Dispatch<SetStateAction<string>>;
  notionBotId?: string;
  setNotionBotId: Dispatch<SetStateAction<string>>;
  airtableBaseId?: string;
  setAirtableBaseId: Dispatch<SetStateAction<string>>;
  airtableApiKey?: string;
  isLegacyAirtable: boolean;
  disableDestination: () => Promise<void>;
  isDisablingDestination: boolean;
  isTriggeringManualSync: boolean;

  name: string;
  updateName: (newName: string, isSubmit: boolean) => Promise<void>

  syncStartDate: string;
  updateSyncStartDate: (newDate: string) => Promise<void>;
  triggerSync: (startDate?: string) => Promise<void>;
  createOauthToken: () => Promise<string>;
  isCreatingOauthToken: boolean;

  toggleTableConfigCoda: ({ isEnabled, table }: { isEnabled: boolean; table: Table }) => Promise<void>
}

const DestinationContext = createContext<DestinationContextType>({} as DestinationContextType)

interface DestinationProviderProps {
  children: ReactNode,
  isSetupMode: boolean;
  id?: string;
  integration?: Integration;
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

export const DestinationProvider = ({ children, isSetupMode, integration: integrationProp, id }: DestinationProviderProps) => {
  const renderToast = useToast();
  const { refetch: refetchDestinations } = trpc.useContext().destinations.getAllDestinations;
  const { data: allPlaidAccounts } = trpc.plaid.getAllPlaidAccounts.useQuery();
  const { mutateAsync: validateCredentialsMutation, isLoading: isValidatingCredentials } = trpc.destinations.validateCredentials.useMutation();
  const { mutateAsync: getDefaultTableConfigMutation, isLoading: isGettingDefaultTableConfig }= trpc.destinations.getDefaultTableConfig.useMutation();
  const { mutateAsync: validateTableConfigsMutation, isLoading: isValidatingTableConfigs } = trpc.destinations.validateTableConfigs.useMutation();
  const { mutateAsync: createDestinationMutation, isLoading: isCreatingDestination } = trpc.destinations.createDestination.useMutation();
  const { mutateAsync: updateConnectedAccounts } = trpc.destinations.updateConnectedAccounts.useMutation();
  const { mutateAsync: updateCredentials, isLoading: isUpdatingCredentials } = trpc.destinations.updateCredentials.useMutation();
  const { mutateAsync: updateDestination } = trpc.destinations.updateDestination.useMutation();
  const { mutateAsync: disableDestinationMutation, isLoading: isDisablingDestination } = trpc.destinations.disableDestination.useMutation();
  const { mutateAsync: createOauthTokenMutation, isLoading: isCreatingOauthToken } = trpc.destinations.createOauthCode.useMutation();
  const { mutateAsync: triggerManualSync, isLoading: isTriggeringManualSync } = trpc.destinations.triggerManualSync.useMutation();
  const { data: destination, isLoading: isLoadingDestination, isRefetching: isRefetchingDestination, refetch: refetchDestination } = trpc.destinations.getDestination.useQuery({ id: id! }, { enabled: !!id });
  const integration = (integrationProp || destination?.integration)!;
  const [ name, setName ] = useState( "My Budget");
  const [ syncStartDate, setSyncStartDate ] = useState<string>( destination?.syncStartDate || moment().format("YYYY-MM-DD") );
  const [ tableConfigs, setTableConfigs ] = useState<TableConfig[] | undefined>(destination?.tableConfigs || (isSetupMode && integration === Integration.Coda ? defaultCodaTableConfigs : undefined));
  const [ googleSpreadsheetId, setGoogleSpreadsheetId ] = useState<string | undefined>(destination?.googleSheetsCredential?.spreadsheetId);
  const [ notionBotId, setNotionBotId ] = useState<string | undefined>(destination?.notionCredential?.botId );
  const [ airtableBaseId, setAirtableBaseId ] = useState<string | undefined>( destination?.airtableCredential?.baseId );
  const [ airtableApiKey, setAirtableApiKey ] = useState<string | undefined>( destination?.airtableCredential?.apiKey || undefined );
  const [ selectedAccountIds, setSelectedAccountIds ] = useState<string[]>(destination?.accounts.map(account => account.id) || []);
  const [ currentActiveSyncId, setCurrentActiveSyncId ] = useState<string>();

  const [ credentialsValidation, setCredentialsValidation ] = useState<RouterOutput['destinations']['validateCredentials']>();
  const { data: tables, isLoading: isLoadingTables, isRefetching: isRefetchingTables, refetch: refetchTables } = trpc.destinations.getTables.useQuery(
    { integration, googleSpreadsheetId, notionBotId, airtableBaseId, airtableApiKey }, 
    { enabled: (isSetupMode && !!credentialsValidation && credentialsValidation.isValid) || (!isSetupMode && (!!googleSpreadsheetId || !!notionBotId || !!airtableBaseId )) }
  );
  const [ tableConfigsValidation, setTableConfigsValidation ] = useState<TableConfigsValidation>();

  useEffect(() => {
    if ( destination ) {
      setName(destination.name);
      setSyncStartDate(destination.syncStartDate);
      setTableConfigs(destination.tableConfigs);
      setGoogleSpreadsheetId(destination.googleSheetsCredential?.spreadsheetId);
      setNotionBotId(destination.notionCredential?.botId);
      setAirtableBaseId(destination.airtableCredential?.baseId);
      setAirtableApiKey(destination.airtableCredential?.apiKey || undefined);
      setSelectedAccountIds(destination.accounts.map(account => account.id))
    }
  }, [ destination ]);

  const toggleTableConfigCoda = useCallback(async ({ isEnabled, table }: { isEnabled: boolean; table: string}) => {
    if ( destination ) {
      updateDestination({ destinationId: destination.id, tableConfigs: tableConfigs!.map(config => config.table === table ? ({ ...config, isEnabled }) : config ) as RouterOutput['destinations']['getDestination']['tableConfigs']})
        .then(() => renderToast({ status: 'success', title: "Destination Settings Updated"}))
    } 
  }, [ destination, tableConfigs ])

  const createOauthToken = useCallback(async () => {
    const { code } = await createOauthTokenMutation();
    return code;
  }, [])

  const tableConfigsHasChanges = !_.isEqual(tableConfigs, destination?.tableConfigs as TableConfig[] );
  const credentialsHasChanges = (destination?.integration === Integration.Google && destination.googleSheetsCredential?.spreadsheetId !== googleSpreadsheetId)
    || (destination?.integration === Integration.Notion && destination.notionCredential?.botId !== notionBotId)
    || (destination?.integration === Integration.Airtable && destination.airtableCredential?.baseId !== airtableBaseId)

  const getCanValidateCredential = useCallback(() => {
    if ( integration === Integration.Google ) { return googleSpreadsheetId && googleSpreadsheetId.length > 0 };
    if ( integration === Integration.Notion ) { return !!notionBotId }
    if ( integration === Integration.Airtable ) { return !!airtableBaseId }
  }, [ integration, googleSpreadsheetId, notionBotId, airtableBaseId ]);

  const validateTableConfigs = useCallback(() => {
    const frontendErrors = areTableConfigsFrontendValid(tableConfigs!);
    if ( frontendErrors.length > 0 ) { setTableConfigsValidation({ isValid: false, errors: frontendErrors }); return; }

    validateTableConfigsMutation({ tableConfigs: tableConfigs!, googleSpreadsheetId, notionBotId, airtableApiKey, airtableBaseId, integration })
      .then(setTableConfigsValidation);

    if ( destination ) {
      updateDestination({ destinationId: destination.id, tableConfigs: tableConfigs as RouterOutput['destinations']['getDestination']['tableConfigs'] })
        .then(() => {
          refetchDestination()
            .then(() => renderToast({ status: 'success', title: "Destination Settings Updated"}))
        })
    }
  }, [ tableConfigs ])

  const onChangeTableConfig = useCallback((tableConfig: TableConfig) => {
    setTableConfigsValidation(undefined);
    setTableConfigs(prev => {
      let newTableConfigs = prev?.map(tc => tc.table === tableConfig.table ? tableConfig : tc)
      if ( integration === Integration.Coda ) { return newTableConfigs };

      const getRequiredFields = (table: Table) => tableConfigsMeta.find(config => config.table === table)!.fields.filter(field => field.isRequired && !field.hideFor?.includes(integration)).map(field => ({ field: field.field, fieldId: ''}))
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
  }, [ integration ])

  const createDestination = useCallback(async (code?: string, shouldRefetch = true) => {
    return createDestinationMutation({ name, tableConfigs: tableConfigs!, syncStartDate, integration, googleSpreadsheetId, notionBotId, airtableBaseId, codaCredentialId: code, connectedAccountIds: selectedAccountIds })
      .then(() => shouldRefetch ? refetchDestinations() : undefined)
  }, [ name, tableConfigs, syncStartDate, integration, googleSpreadsheetId, notionBotId, airtableBaseId, selectedAccountIds ]);

  const onCancelChanges = () => {
    if ( destination ) {
      setName(destination.name);
      setSyncStartDate(moment(destination.syncStartDate).format("YYYY-MM-DD"));
      setTableConfigs(destination.tableConfigs);
      setGoogleSpreadsheetId(destination.googleSheetsCredential?.spreadsheetId);
      setNotionBotId(destination.notionCredential?.botId);
      setAirtableBaseId(destination.airtableCredential?.baseId);
      setAirtableApiKey(destination.airtableCredential?.apiKey || undefined);
      setSelectedAccountIds(destination.accounts.map(account => account.id))
    }

    setCredentialsValidation(undefined);
  }

  const getDefaultTableConfig = useCallback(async () => {
    const defaultConfigs = await getDefaultTableConfigMutation({ integration, googleSpreadsheetId, notionBotId, airtableBaseId })
      .then(response => response.tableConfigs)
    setTableConfigs(defaultConfigs);

    // Manual handle changes for special tables
    const securitiesConfig = defaultConfigs.find(config => config.table === Table.Securities);
    securitiesConfig && onChangeTableConfig(securitiesConfig)
  }, [ googleSpreadsheetId, notionBotId, airtableBaseId, integration ]);

  const onToggleAccountIds = useCallback((accountIds: string[], action: 'add' | 'remove') => {
    const newAccountIds = action === 'add'
      ? _.uniq((selectedAccountIds || []).concat(accountIds))
      : _.difference((selectedAccountIds || []), accountIds);

      setSelectedAccountIds(newAccountIds);

      if ( destination ) {
        updateConnectedAccounts({ destinationId: destination.id, action, accountIds })
          .then(() => renderToast({ status: 'success', title: `Account${accountIds.length === 1 ? '' : 's'} ${action === 'add' ? 'Added' : "Removed"}`}))
      }
  }, [ selectedAccountIds ])

  const validateCredentials = async () => {
    return validateCredentialsMutation({ googleSpreadsheetId, notionBotId, airtableBaseId, airtableApiKey, integration })
      .then(response => {
        setCredentialsValidation(response);

        if ( destination && response.isValid ) {
          updateCredentials({ destinationId: destination.id, googleSpreadsheetId, notionBotId, airtableBaseId })
            .then(() => {
              renderToast({ status: 'success', title: getOnUpdateCredentialsToastTitle(integration)! });
              return refetchDestination();
            })
        }

        return response;
      })
  }

  const updateSyncStartDate = useCallback(async (newDate: string) => {
    setSyncStartDate(newDate);

    if ( destination ) {
      await Promise.all([
        updateDestination({ destinationId: destination.id, syncStartDate: newDate })
          .then(() => renderToast({ status: 'success', title: "Sync Start Date Updated"})), 
        newDate < destination.syncStartDate ? triggerSync(newDate) : Promise.resolve()
      ])
    }
  }, [ destination ]);

  const triggerSync = useCallback(async (startDate?: string) => {
    if ( destination ) {
      triggerManualSync({ destinationId: destination.id, startDate: startDate || destination.syncStartDate })
        .then(({ syncId }) => {
          if ( syncId ) { setCurrentActiveSyncId(syncId) }
        })
    }
  }, [ destination ]);

  const updateName = useCallback(async (newName: string, isSubmit: boolean) => {
    setName(newName);

    if ( destination && isSubmit && newName !== destination.name ) {
      updateDestination({ destinationId: destination.id, name: newName })
        .then(() => renderToast({ status: 'success', title: "Name Updated"}))
    }
  }, [ destination ]);

  const disableDestination = useCallback(async () => {
    disableDestinationMutation(destination!.id).then(refetchDestinations)
  }, [ destination ]);

  const memoedValue = useMemo(
    () => {
      const canValidateCredentials = getCanValidateCredential()
      return {
        integration,
        validateCredentials,
        isValidatingCredentials,
        credentialsValidation,
        onCancelChanges,
        canValidateCredentials,
        selectedAccountIds,
        onToggleAccountIds,
        allPlaidAccounts,
        name,
        updateName,
        syncStartDate,
        updateSyncStartDate,
        isSetupMode,
        tables,
        getDefaultTableConfig,
        tableConfigs,
        onChangeTableConfig,
        tableConfigsValidation,
        tableConfigsHasChanges,
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
        isLegacyAirtable: !!airtableApiKey && integration === Integration.Airtable,
        destination,
        refetchDestination,
        isUpdatingCredentials,
        currentActiveSyncId,
        setCurrentActiveSyncId,
        disableDestination,
        isDisablingDestination,
        triggerSync,
        createOauthToken, 
        isCreatingOauthToken,
        toggleTableConfigCoda,
        isTriggeringManualSync
      } as DestinationContextType
    }, [ 
      integration, validateCredentials, isValidatingCredentials, destination, refetchDestination,
      airtableApiKey, googleSpreadsheetId, setGoogleSpreadsheetId, notionBotId, setNotionBotId, airtableBaseId, setAirtableBaseId, airtableApiKey, credentialsValidation, allPlaidAccounts, refetchTables,
      onCancelChanges, selectedAccountIds, onToggleAccountIds, isLoadingTables, isRefetchingTables,
      name, updateName, syncStartDate, updateSyncStartDate, isSetupMode, tables, getDefaultTableConfig, isGettingDefaultTableConfig, tableConfigs,
      onChangeTableConfig, tableConfigsValidation, tableConfigsHasChanges, validateTableConfigs, isValidatingTableConfigs,
      createDestination, isCreatingDestination, credentialsHasChanges, isUpdatingCredentials, currentActiveSyncId, setCurrentActiveSyncId,
      disableDestination, isDisablingDestination, createOauthToken, isCreatingOauthToken, toggleTableConfigCoda, isTriggeringManualSync
    ]
  );

  if ( !isSetupMode && !destination ) {
    return <Skeleton height = "20" />
  }

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

// Helpers
const getOnUpdateCredentialsToastTitle = (integration: Integration) => {
  if ( integration === Integration.Airtable ) { return "Airtable Base Updated"}
  if ( integration === Integration.Google ) { return "Google Spreadsheet Updated" }
  if ( integration === Integration.Notion ) { return "Notion Workspace Updated"}
}

const defaultCodaTableConfigs = [
  { table: Table.Institutions, tableId: '', isEnabled: true, fieldConfigs: [] },
  { table: Table.Accounts, tableId: '', isEnabled: true, fieldConfigs: [] },
  { table: Table.Transactions, tableId: '', isEnabled: true, fieldConfigs: [] },
  { table: Table.InvestmentTransactions, tableId: '', isEnabled: true, fieldConfigs: [] },
  { table: Table.Holdings, tableId: '', isEnabled: true, fieldConfigs: [] },
] as TableConfig[];