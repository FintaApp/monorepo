import React, { useEffect, useMemo, useState } from "react";
import { Box, Button, Divider, Stack, Text, useColorModeValue as mode } from "@chakra-ui/react";
import * as _ from "lodash";
import { PlusIcon } from "@radix-ui/react-icons";

import { GetDestinationTablesResponse } from "~/types/shared/functions";
import { DestinationErrorCode, DestinationTableTypes, TableConfig as TableConfigType, TableConfigFields } from "~/types/shared/models";
import { AccordionItem } from "~/components/AccordionItem";
import { EnableSwitch } from "../EnableSwitch";
import { TableSelection } from "./TableSelection";
import { ALWAYS_ENABLED_DATA_TYPES, SECURITIES_TABLE_FIELDS, INVESTMENT_TRANSACTIONS_TABLE_FIELDS, HOLDINGS_TABLE_FIELDS, TRANSACTIONS_TABLE_FIELDS, ACCOUNTS_TABLE_FIELDS, INSTITUTION_TABLE_FIELDS, CATEGORIES_TABLE_FIELDS } from "../constants";
import { Integrations_Enum } from "~/graphql/frontend";
import { TableConfigErrorType, TableConfigErrorCode } from "~/utils/frontend/validate";
import { FieldGroup } from "~/components/FieldGroup";
import { FieldMapping } from "./FieldMapping";

type TableConfigProps = {
  tableType: DestinationTableTypes;
  destinationTables: GetDestinationTablesResponse['tables'];
  tableConfig: TableConfigType
  refreshTables: () => void;
  onChange: (tableConfig: TableConfigType) => void;
  isLoadingTables: boolean;
  integrationId: Integrations_Enum;
  errors?: TableConfigErrorType[];
}

export const TableConfig = ({ tableType, destinationTables, tableConfig, refreshTables, isLoadingTables, onChange, errors, integrationId }: TableConfigProps) => {
  const TABLE_FIELDS = useMemo(() => getTableFields(tableType, integrationId)!, [ tableType, integrationId ]);
  const [ hasSetRequiredFields, setHasSetRequiredFields ] = useState(false);

  useEffect(() => {
    if ( !hasSetRequiredFields ) {
      const requiredTableFields = TABLE_FIELDS.filter(tableField => tableField.is_required).map(tableField => ({ field: tableField.field, field_id: "" }));
      const allTableFields = _.unionWith((tableConfig.fields || []).concat(requiredTableFields), (field1, field2) => field1.field === field2.field);
      if ( allTableFields.length !== (tableConfig.fields || []).length ) { 
        onChange({ ...tableConfig, fields: allTableFields });
        setHasSetRequiredFields(true)
      }
    }
  }, [ TABLE_FIELDS, tableConfig, onChange, hasSetRequiredFields ]);

  const tableOptions = destinationTables.map(table => ({ label: table.name, value: table.tableId }));
  const fieldOptions = destinationTables
    .find(table => table.tableId === tableConfig.table_id)?.fields
    .map(field => ({ label: field.name, value: field.fieldId, type: field.type })) || []
  const tableFieldOptions = getTableFieldOptions({ tableType, integrationId, fields: tableConfig.fields });

  const onChangeIsEnabled = (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...tableConfig, is_enabled: e.target.checked });
  const onChangeTableId = (newTableId: string) => onChange({ ...tableConfig, table_id: newTableId });
  const onChangeField = (action: 'insert' | 'update' | 'remove', field: { field: TableConfigType['fields'][0]['field'], field_id: string }, index?: number) => {
    let newFields = tableConfig.fields;
    if ( action === 'insert' ) { newFields = newFields.concat(field) };
    if ( action === 'update' ) { newFields = newFields.map((f, idx) => idx === index ? field : f )}
    if ( action === 'remove' ) { newFields = newFields.filter(f => f.field !== field.field) }

    const newConfig = { ...tableConfig, fields: newFields };
    onChange(newConfig)
  }

  return (
    <AccordionItem
      buttonLabel = { `${tableType.replaceAll("_", " ")} - ${tableConfig.is_enabled ? "Synced" : "Not Synced"}` }
      buttonChildren = { <></> }
      buttonLabelProps = {{ textTransform: 'capitalize', opacity: tableConfig.is_enabled ? 1 : 0.6, color: errors && errors.length > 0 ? mode('tomato.light.11', 'tomato.dark.11') : 'unset'  }}
    >
      <Stack direction = "column" spacing = "2" maxW = "full" mx = "auto">
        { ALWAYS_ENABLED_DATA_TYPES.includes(tableType) ? <Text>{ getEnabledHelperText(tableType) }</Text> : <EnableSwitch tableType = { tableType } isEnabled = { tableConfig.is_enabled } onChange = { onChangeIsEnabled } /> }

        <TableSelection 
          options = { tableOptions }
          onChange = { onChangeTableId }
          isDisabled = { !tableConfig.is_enabled }
          isLoading = { isLoadingTables }
          refreshTables = { refreshTables }
          integrationId = { integrationId }
          tableId = { tableConfig.table_id }
          errorMessage = { parseErrorCode(errors?.find(error => error.tableId === tableConfig.table_id && !error.fieldId && !error.fieldType)?.errorCode ) }
        />

        <FieldGroup title = "Fields" description = { getFieldsDescription(integrationId) }>
          <Stack mt = "1" spacing = "2" divider = { <Divider my = "1" borderColor = {{ base: mode('gray.light.8', 'gray.dark.8'), sm: 'transparent' }} /> }>
            { tableConfig.fields.map((field, index) => (
              <FieldMapping
                showFieldIdAs = { integrationId === Integrations_Enum.Airtable ? 'text' : 'select' }
                key = { field.field }
                field = { field }
                tableType = { tableType }
                tableFieldOptions = { tableFieldOptions }
                tableFieldValue = { getTableFieldValue({ tableType, integrationId, field })! }
                fieldOptions = { fieldOptions }
                isDisabled = { !tableConfig.is_enabled }
                onChangeField = { onChangeField }
                errorMessage = { parseErrorCode(errors?.find(error => error.tableId === tableConfig.table_id && (error.fieldType === field.field || error.fieldId === field.field_id))?.errorCode)}
                index = { index }
                integrationId = { integrationId }
              />
            ))}
          </Stack>
          { tableFieldOptions.length > 0 && (
          <Box mt = "2" display = "flex" width = "full" justifyContent = {{ base: 'stretch', sm: 'flex-end' }}>
            <Button 
              width = {{ base: 'full', sm: 'unset'}}
              isDisabled = { !!tableConfig.fields.find(field => !field.field || !field.field_id )}
              onClick = { () => onChangeField('insert', { field: "" as TableConfigFields, field_id: "" })} 
              leftIcon = { <PlusIcon /> }>Add Field</Button>
          </Box>
          )}

        </FieldGroup>
      </Stack>
    </AccordionItem>
  )
}

// Helper Functions
const getEnabledHelperText = (tableType: DestinationTableTypes) => {
  if ( tableType === DestinationTableTypes.CATEGORIES) { return "The 'Categories' field in the Transactions table must be enabled to sync categories"}
  if ( tableType === DestinationTableTypes.SECURITIES) { return "Either the Investment Transactions or Holdings table must be enabled to sync securities"}
  return ""
}

const parseErrorCode = (errorCode?: TableConfigErrorCode | DestinationErrorCode ) => {
  if ( errorCode === TableConfigErrorCode.DUPLICATE_TABLE ) return "This table is already in use";
  if ( errorCode === TableConfigErrorCode.TABLE_NOT_SELECTED ) return "Please select a table";
  if ( errorCode === TableConfigErrorCode.DUPLICATE_FIELD ) return "This field is already in use";
  if ( errorCode === TableConfigErrorCode.FIELD_NOT_SELECTED ) return "Please select a field";
  if ( errorCode === DestinationErrorCode.MISSING_FIELD ) return "This field cannot be found in your destination"
  if ( errorCode === DestinationErrorCode.MISSING_TABLE ) return "This table cannot be found in your destination"
  if ( errorCode === DestinationErrorCode.INCORRECT_FIELD_TYPE ) return "This field has the wrong type in your destination"
  return ""
}

const getFieldsDescription = (integrationId: Integrations_Enum) => {
  if ( integrationId === Integrations_Enum.Airtable ) { return "Each field corresponds to column in your Airtable table"};
  if ( integrationId === Integrations_Enum.Google ) { return "Each field corresponds to a column in your Google Sheet"};
  if ( integrationId === Integrations_Enum.Notion ) { return "Each field corresponds to a column in your Notion database"};
  return ""
}

const getTableFields = (tableType: DestinationTableTypes, integrationId: Integrations_Enum): { field: TableConfigFields, label: string, is_required: boolean }[] => {
  if ( tableType === DestinationTableTypes.INSTITUTIONS ) { return INSTITUTION_TABLE_FIELDS }
  if ( tableType === DestinationTableTypes.ACCOUNTS ) { return ACCOUNTS_TABLE_FIELDS }
  if ( tableType === DestinationTableTypes.TRANSACTIONS ) { return TRANSACTIONS_TABLE_FIELDS }
  if ( tableType === DestinationTableTypes.CATEGORIES ) { return CATEGORIES_TABLE_FIELDS }
  if ( tableType === DestinationTableTypes.HOLDINGS ) { return HOLDINGS_TABLE_FIELDS.filter(field => !field.hideFor || !field.hideFor.includes(integrationId)) }
  if ( tableType === DestinationTableTypes.INVESTMENT_TRANSACTIONS ) { return INVESTMENT_TRANSACTIONS_TABLE_FIELDS }
  return SECURITIES_TABLE_FIELDS
}

const getTableFieldOptions = ({ tableType, integrationId, fields } : { tableType: DestinationTableTypes, integrationId: Integrations_Enum, fields: TableConfigType['fields'] }) => {
  if ( integrationId === Integrations_Enum.Coda ) { return [] };
  const currentFields = fields?.map(field => field.field) || [];
  if ( tableType === DestinationTableTypes.INSTITUTIONS ) { return INSTITUTION_TABLE_FIELDS.filter(tableField => !currentFields.includes(tableField.field)).map(tableField => ({ value: tableField.field, label: tableField.label })) };
  if ( tableType === DestinationTableTypes.ACCOUNTS ) { return ACCOUNTS_TABLE_FIELDS.filter(tableField => !currentFields.includes(tableField.field)).map(tableField => ({ value: tableField.field, label: tableField.label })) };
  if ( tableType === DestinationTableTypes.TRANSACTIONS ) { return TRANSACTIONS_TABLE_FIELDS.filter(tableField => !currentFields.includes(tableField.field)).map(tableField => ({ value: tableField.field, label: tableField.label })) };
  if ( tableType === DestinationTableTypes.CATEGORIES ) { return CATEGORIES_TABLE_FIELDS.filter(tableField => !currentFields.includes(tableField.field)).map(tableField => ({ value: tableField.field, label: tableField.label })) };
  if ( tableType === DestinationTableTypes.HOLDINGS) { return HOLDINGS_TABLE_FIELDS.filter(tableField => !currentFields.includes(tableField.field)).map(tableField => ({ value: tableField.field, label: tableField.label })) };
  if ( tableType === DestinationTableTypes.INVESTMENT_TRANSACTIONS) { return INVESTMENT_TRANSACTIONS_TABLE_FIELDS.filter(tableField => !currentFields.includes(tableField.field)).map(tableField => ({ value: tableField.field, label: tableField.label }))}
  return SECURITIES_TABLE_FIELDS.filter(tableField => !currentFields.includes(tableField.field)).map(tableField => ({ value: tableField.field, label: tableField.label }))
}

const getTableFieldValue = ({ tableType, integrationId, field } : { tableType: DestinationTableTypes, integrationId: Integrations_Enum, field: TableConfigType['fields'][0] }) => {
  if ( integrationId === Integrations_Enum.Coda ) { return { value: "", label: "" } };
  if ( tableType === DestinationTableTypes.INSTITUTIONS ) { return INSTITUTION_TABLE_FIELDS.map(tableField => ({ value: tableField.field, label: tableField.label })).find(tableField => tableField.value === field.field) }
  if ( tableType === DestinationTableTypes.ACCOUNTS ) { return ACCOUNTS_TABLE_FIELDS.map(tableField => ({ value: tableField.field, label: tableField.label })).find(tableField => tableField.value === field.field) }
  if ( tableType === DestinationTableTypes.TRANSACTIONS ) { return TRANSACTIONS_TABLE_FIELDS.map(tableField => ({ value: tableField.field, label: tableField.label })).find(tableField => tableField.value === field.field) }
  if ( tableType === DestinationTableTypes.CATEGORIES ) { return CATEGORIES_TABLE_FIELDS.map(tableField => ({ value: tableField.field, label: tableField.label })).find(tableField => tableField.value === field.field) }
  if ( tableType === DestinationTableTypes.HOLDINGS) { return HOLDINGS_TABLE_FIELDS.map(tableField => ({ value: tableField.field, label: tableField.label })).find(tableField => tableField.value === field.field) }
  if ( tableType === DestinationTableTypes.INVESTMENT_TRANSACTIONS) { return INVESTMENT_TRANSACTIONS_TABLE_FIELDS.map(tableField => ({ value: tableField.field, label: tableField.label })).find(tableField => tableField.value === field.field) }
  return SECURITIES_TABLE_FIELDS.map(tableField => ({ value: tableField.field, label: tableField.label })).find(tableField => tableField.value === field.field)
} 