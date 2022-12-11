import { useEffect, useState, useCallback } from "react";
import { Box, Button, Stack, Text, VStack } from "@chakra-ui/react";
import * as _ from "lodash";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

import { SUCCESS_TOAST_CONFIG } from "./constants";
import { Integrations_Enum, useUpdateDestinationMutation } from "~/graphql/frontend";
import { getDestinationTables, checkDestinationTableConfig } from "~/utils/frontend/functions";
import { GetDestinationTablesResponse } from "~/types/shared/functions";
import { DestinationModel } from "~/types/frontend";
import { DestinationCredentials, DestinationErrorCode, DestinationTableTypes, TableConfig as TableConfigType, TableConfigs as TableConfigsType, TransactionsTableFields } from "~/types/shared/models"
import { EnableSwitch } from "./EnableSwitch";
import { TableConfig } from "./TableConfig";
import { TableConfigErrorType, tableConfigs as validateTableConfigs } from "~/utils/frontend/validate";
import { useToast } from "~/utils/frontend/useToast";
import { SECURITIES_TABLE_FIELDS, CATEGORIES_TABLE_FIELDS } from "./constants"

interface TableConfigsProps {
  destination?: DestinationModel;
  tableConfigs: TableConfigsType;
  onChange?: (tableConfigs: TableConfigsType) => void;
  onSave?: (tableConfigs: TableConfigsType) => void;
  credentials: DestinationCredentials;
  integrationId: Integrations_Enum;
}

export const TableConfigs = ({ destination, integrationId, credentials, tableConfigs: tableConfigsProp, onChange: onChangeProp, onSave: onSaveProp }: TableConfigsProps ) => {
  const renderToast = useToast();
  const [ isLoadingTables, setIsLoadingTables ] = useState(false);
  const [ destinationTables, setDestinationTables ] = useState<GetDestinationTablesResponse['tables']>([]);
  const [ hasLoadedInitialDestinationTables, setHasLoadedInitialDestinationTables ] = useState(false);
  const [ tableConfigs, setTablesConfig ] = useState<TableConfigsType>(tableConfigsProp);
  const [ errors, setErrors ] = useState<TableConfigErrorType[]>([]);
  const [ isValidated, setIsValidated ] = useState(false);
  const [ isValidating, setIsValidating ] = useState(false);
  const [ updateDestinationMutation, { loading: isUpdatingDestination } ] = useUpdateDestinationMutation();

  const onCancel = () => setTablesConfig(tableConfigsProp);

  const refreshTables = useCallback(() => {
    if (Object.keys(credentials).length === 0 || isLoadingTables ) { return; };
    setIsLoadingTables(true);
    getDestinationTables({ integrationId, credentials })
    .then(({ tables }) => { setDestinationTables(tables)})
    .catch(err => {
      console.log(err);
      setTimeout(refreshTables, 2000)
    })
    .finally(() => {
      setIsLoadingTables(false);
      setHasLoadedInitialDestinationTables(true);
    });
  }, [ credentials, integrationId, isLoadingTables ]);

  useEffect(() => { hasLoadedInitialDestinationTables === false && isLoadingTables === false && refreshTables() }, [hasLoadedInitialDestinationTables, refreshTables, isLoadingTables]);
  useEffect(() => {setTablesConfig(tableConfigsProp)}, [tableConfigsProp]);

  const onChange = useCallback((tableType: DestinationTableTypes, config: TableConfigType) => {
    setTablesConfig(tableConfigs => {
      let newTableConfigs = { ...tableConfigs, [ tableType ]: config };
      const baseSecuritiesConfig = newTableConfigs.securities || { is_enabled: false, table_id: '', fields: SECURITIES_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' })) };
      const baseCategoriesConfig = newTableConfigs.categories || { is_enabled: false, table_id: '', fields: CATEGORIES_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' })) };
      const securitiesConfig = { ...baseSecuritiesConfig, is_enabled: !!(newTableConfigs.holdings?.is_enabled || newTableConfigs.investment_transactions?.is_enabled) }
      const categoriesConfig = { ...baseCategoriesConfig, is_enabled: !!newTableConfigs.transactions?.is_enabled && !!newTableConfigs.transactions?.fields.find(field => field.field === TransactionsTableFields.CATEGORY)}

      onChangeProp && onChangeProp(newTableConfigs);
      return { ...newTableConfigs, securities: securitiesConfig, categories: categoriesConfig }
    });
    setIsValidated(false);
  }, [ onChangeProp ]);

  const onSave = async () => {
    // Check table configs
    const frontEndErrors = validateTableConfigs(tableConfigs);
    if ( frontEndErrors.length > 0 ) {
      setErrors(frontEndErrors);
      setIsValidated(false);
      return;
    }

    setIsValidating(true);
    const backEndErrors = await Promise.all(Object.entries(tableConfigs).map(([ tableType, config ]) => {
      if ( !config.is_enabled ) { return null };
      if ( !config.table_id ) { return { tableType, errorCode: 'missing_table' }}
      return checkDestinationTableConfig({ integrationId, dataType: tableType as DestinationTableTypes, tableId: config.table_id, credentials, fields: config.fields })
      .then(({ error }) => {
        if (!error) { return null }
        return { tableType, errorCode: error.errorCode, tableId: error.tableId, fieldId: error.fieldId, fieldType: error.fieldType }
      })
      .catch(err => {
        console.log(err);
        return { tableType, errorCode: DestinationErrorCode.UNKNOWN_ERROR }
      })
    })).then(responses => responses.filter(response => response) as TableConfigErrorType[])
    .finally(() => setIsValidating(false));

    if ( backEndErrors.length > 0 ) {
      setErrors(backEndErrors);
      setIsValidated(false);
      return;
    }

    setErrors([]);
    setIsValidated(true);

    onSaveProp && onSaveProp(tableConfigs);

    if ( destination ) {
      updateDestinationMutation({ variables: { destination_id: destination.id, _set: { table_configs: tableConfigs }}})
      .then(() => renderToast(SUCCESS_TOAST_CONFIG));
    }
  }

  const hasChanges = !_.isEqual(tableConfigs, destination?.table_configs);

  if ( integrationId === Integrations_Enum.Coda ) {
    return (
      <VStack spacing = "1">
        {[ DestinationTableTypes.TRANSACTIONS, DestinationTableTypes.HOLDINGS, DestinationTableTypes.INVESTMENT_TRANSACTIONS].map(tableType => (
          <Box width = "full" maxW = "md" key = { tableType }>
            <EnableSwitch
              tableType = { tableType }
              isEnabled = { tableConfigs[tableType]?.is_enabled || false }
              onChange = { e => onChange(tableType, { is_enabled: e.target.checked, table_id: '', fields: [] })}
            />
          </Box>
        ))}
      </VStack>
    )
  };
  return (
    <VStack spacing = "0">
      {[ DestinationTableTypes.INSTITUTIONS, DestinationTableTypes.ACCOUNTS, DestinationTableTypes.TRANSACTIONS, DestinationTableTypes.CATEGORIES, DestinationTableTypes.HOLDINGS, DestinationTableTypes.INVESTMENT_TRANSACTIONS, DestinationTableTypes.SECURITIES ].map(tableType => {
        const tableConfig = tableConfigs[tableType] || { is_enabled: false, table_id: '', fields: [] };

        return (
          <TableConfig
            tableType = { tableType }
            destinationTables = { destinationTables || [] }
            tableConfig = { tableConfig }
            refreshTables = { refreshTables }
            onChange = { newTableConfig => onChange(tableType, newTableConfig )}
            isLoadingTables = { isLoadingTables }
            integrationId = { integrationId }
            errors = { errors.filter(error => error.tableType === tableType) }
            key = { tableType }
          />
        )
      })}

      <Text visibility = { errors.length > 0 ? "visible" : "hidden" } my = "2">Please fix the errors listed above before saving.</Text> 

      <Stack display = { destination && !hasChanges ? 'none' : 'flex' } mt = "4" justifyContent = {{ base: 'stretch', md: 'space-between' }} spacing = "1" direction = {{ base: 'column-reverse', md: 'row' }} width = 'full'>
        <Button leftIcon = {<Cross1Icon /> } onClick = { onCancel } visibility = { destination ? 'visible' : 'hidden' }>Cancel</Button>
        <Button 
          onClick = { onSave } 
          isDisabled = { isValidated } 
          leftIcon = {<CheckIcon /> } 
          variant = 'primary'
          isLoading = { isValidating || isUpdatingDestination }
        >{ destination ? "Save" : ( isValidated ? "Validated!" : "Check" )}</Button>
      </Stack>
    </VStack>
  )
}

// Helper Functions