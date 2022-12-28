import { useEffect, useState, useCallback } from "react";
import { Box, Button, Stack, Text, VStack } from "@chakra-ui/react";
import * as _ from "lodash";
import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

import { Integrations_Enum, useUpdateDestinationMutation } from "~/graphql/frontend";
import { DestinationAuthentication, DestinationErrorCode, DestinationTableTypes, AirtableAuthentication, TableConfig as TableConfigType, TableConfigs as TableConfigsType, TransactionsTableFields, DestinationError } from "~/types/shared/models";
import { useLogger } from "~/utils/frontend/useLogger";
import { validateDestinationTableConfigs, getDestinationTables } from "~/utils/frontend/functions";
import { GetDestinationTablesResponse } from "~/types/shared/functions";
import { SECURITIES_TABLE_FIELDS, CATEGORIES_TABLE_FIELDS } from "~/types/shared/models";
import { SUCCESS_TOAST_CONFIG } from "./constants";
import { TableConfigErrorType, isDestinationTableConfigsFrontendValid } from "~/utils/frontend/validate";
import { useToast } from "~/utils/frontend/useToast";
import { EnableTableSwitch } from "./TableConfig/EnableTableSwitch";
import { TableConfig } from "./TableConfig";

interface TableConfigsProps {
  destinationId?: string;
  tableConfigs: TableConfigsType;
  integrationId: Integrations_Enum;
  authentication?: DestinationAuthentication;
  onChange?: (tableConfigs: TableConfigsType) => void;
  onSave?: (tableConfigs: TableConfigsType) => void;
}

export const TableConfigs = ({ destinationId, integrationId, authentication, tableConfigs: originalTableConfigs, onChange: onChangeProp, onSave: onSaveProp }: TableConfigsProps) => {
  const logger = useLogger();
  const renderToast = useToast();
  const [ isLoadingTables, setIsLoadingTables ] = useState(false);
  const [ hasLoadedInitialDestinationTables, setHasLoadedInitialDestinationTables ] = useState(false);
  const [ destinationTables, setDestinationTables ] = useState<GetDestinationTablesResponse['tables']>([]);
  const [ tableConfigs, setTablesConfig ] = useState<TableConfigsType>(originalTableConfigs);
  const [ isValidated, setIsValidated ] = useState(false);
  const [ isValidating, setIsValidating ] = useState(false);
  const [ errors, setErrors ] = useState<TableConfigErrorType[] | DestinationError[]>([]);
  const [ updateDestinationMutation, { loading: isUpdatingDestination } ] = useUpdateDestinationMutation();

  const refreshTables = useCallback(() => {
    if ( isLoadingTables || !authentication ) { return; }
    setIsLoadingTables(true);
    getDestinationTables({ integrationId, authentication })
      .then(({ tables }) => { setDestinationTables(tables) })
      .catch(error => logger.error(error, {}, true))
      .finally(() => { setIsLoadingTables(false); setHasLoadedInitialDestinationTables(true) })
  }, [ authentication, integrationId, isLoadingTables ]);

  useEffect(() => { !hasLoadedInitialDestinationTables && !isLoadingTables && refreshTables() }, [ hasLoadedInitialDestinationTables, isLoadingTables, refreshTables ]);
  useEffect(() => { setTablesConfig(originalTableConfigs)}, [ originalTableConfigs ]);

  const onChange = useCallback((tableType: DestinationTableTypes, config: TableConfigType) => {
    setTablesConfig(tableConfigs => {
      let newTableConfigs = { ...tableConfigs, [ tableType ]: config };
      const baseSecuritiesConfig = newTableConfigs.securities || { is_enabled: false, table_id: '', fields: SECURITIES_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' })) };
      const baseCategoriesConfig = newTableConfigs.categories || { is_enabled: false, table_id: '', fields: CATEGORIES_TABLE_FIELDS.filter(field => field.is_required).map(field => ({ field: field.field, field_id: '' })) };
      const securitiesConfig = { ...baseSecuritiesConfig, is_enabled: !!(newTableConfigs.holdings?.is_enabled || newTableConfigs.investment_transactions?.is_enabled) }
      const categoriesConfig = { ...baseCategoriesConfig, is_enabled: !!newTableConfigs.transactions?.is_enabled && !!newTableConfigs.transactions?.fields.find(field => field.field === TransactionsTableFields.CATEGORY)}
      
      newTableConfigs = { ...newTableConfigs, securities: securitiesConfig, categories: categoriesConfig }

      onChangeProp && onChangeProp(newTableConfigs);
      return newTableConfigs
    });
    setIsValidated(false);
  }, [ onChangeProp ]);

  const onCancel = () => setTablesConfig(originalTableConfigs);

  const onSave = async () => {
    // Check table configs
    const frontendErrors = isDestinationTableConfigsFrontendValid({ tableConfigs });
    if ( frontendErrors.length > 0 ) {
      setErrors(frontendErrors);
      setIsValidated(false);
      return;
    }

    setIsValidating(true);
    
    validateDestinationTableConfigs({ integrationId, tableConfigs, authentication: authentication! })
    .then(({ isValid, errors }) => {
      setErrors(errors || []);
      if ( !isValid ) {
        setIsValidated(false);
        return;
      }
      
      setIsValidated(true); 
      onSaveProp && onSaveProp(tableConfigs);

      if ( destinationId ) {
        updateDestinationMutation({ variables: { destinationId, _set: { table_configs: tableConfigs }}})
        .then(() => renderToast(SUCCESS_TOAST_CONFIG));
      }
    })
    .catch(error => { logger.error(error, {}, true)})
    .finally(() => setIsValidating(false));

  }

  const hasChanges = !_.isEqual(tableConfigs, originalTableConfigs);

  if ( integrationId === Integrations_Enum.Coda ) {
    return (
      <VStack spacing = "1">
        {[ DestinationTableTypes.TRANSACTIONS, DestinationTableTypes.HOLDINGS, DestinationTableTypes.INVESTMENT_TRANSACTIONS].map(tableType => (
          <Box width = "full" maxW = "md" key = { tableType }>
            <EnableTableSwitch
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
            errors = { (errors as TableConfigErrorType[]).filter(error => error.tableType === tableType) }
            key = { tableType }
            isLegacyAirtable = { integrationId === Integrations_Enum.Airtable && !!(authentication as AirtableAuthentication)?.api_key}
          />
        )
      })}

      <Text visibility = { errors.length > 0 ? "visible" : "hidden" } my = "2">Please fix the errors listed above before saving.</Text> 

      <Stack display = { destinationId && !hasChanges ? 'none' : 'flex' } mt = "4" justifyContent = {{ base: 'stretch', md: 'space-between' }} spacing = "1" direction = {{ base: 'column-reverse', md: 'row' }} width = 'full'>
        <Button leftIcon = {<Cross1Icon /> } onClick = { onCancel } visibility = { destinationId ? 'visible' : 'hidden' }>Cancel</Button>
        <Button 
          onClick = { onSave } 
          isDisabled = { isValidated } 
          leftIcon = {<CheckIcon /> } 
          variant = 'primary'
          isLoading = { isValidating || isUpdatingDestination }
        >{ destinationId ? "Save" : ( isValidated ? "Validated!" : "Check" )}</Button>
      </Stack>
    </VStack>
  )
}