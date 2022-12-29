import { Box, Button, Divider, Text, useColorModeValue as mode, VStack } from "@chakra-ui/react";
import { PlusIcon } from "@radix-ui/react-icons";

import { AccordionItem } from "~/components/AccordionItem";
import { FieldGroup } from "~/components/FieldGroup";
import { Integrations_Enum } from "~/graphql/frontend";
import { GetDestinationTablesResponse } from "~/types/shared/functions";
import { DestinationErrorCode, DestinationTableTypes, TableConfig as TableConfigType, TableConfigFields } from "~/types/shared/models";
import { TableConfigErrorType, TableConfigErrorCode } from "~/utils/frontend/validate";
import { ALWAYS_ENABLED_DATA_TYPES, ALL_DESTINATION_TABLES } from "../constants";
import { EnableTableSwitch } from "./EnableTableSwitch";
import { FieldMapping } from "./FieldMapping";
import { TableSelection } from "./TableSelection";

interface TableConfigProps {
  tableType: DestinationTableTypes;
  tableConfig: TableConfigType;
  errors?: TableConfigErrorType[];
  onChange: (tableConfig: TableConfigType) => void;
  isLegacyAirtable: boolean;
  destinationTables: GetDestinationTablesResponse['tables'];
  isLoadingTables: boolean;
  refreshTables: () => void;
  integrationId: Integrations_Enum;
}

export const TableConfig = ({ tableType, tableConfig, errors, integrationId, onChange, isLegacyAirtable, destinationTables, isLoadingTables, refreshTables }: TableConfigProps) => {
  const tableOptions = destinationTables.map(table => ({ label: table.name, value: table.tableId }));
  const tableFieldOptions = ALL_DESTINATION_TABLES
    .find(table => table.tableType === tableType)!.allFields
    .filter(tableField => !(tableField.hideFor || []).includes(integrationId))
    .map(tableField => ({ value: tableField.field, label: tableField.label, isRequired: tableField.is_required }))
  const destinationFieldOptions = destinationTables
    .find(table => table.tableId === tableConfig.table_id)?.fields
    .map(field => ({ label: field.name, value: field.fieldId, type: field.type })) || []

  const onChangeIsEnabled = (e: React.ChangeEvent<HTMLInputElement>) => onChange({ ...tableConfig, is_enabled: e.target.checked });
  const onChangeTableId = (newTableId: string) => onChange({ ...tableConfig, table_id: newTableId });
  const onChangeField = (action: 'insert' | 'update' | 'remove', field: { field: TableConfigType['fields'][0]['field'] | "", field_id: string }, index?: number) => {
    let newFields = tableConfig.fields;
    if ( action === 'insert' ) { newFields = newFields.concat(field as any) };
    if ( action === 'update' ) { newFields = newFields.map((f, idx) => idx === index ? field as any : f )}
    if ( action === 'remove' ) { newFields = newFields.filter(f => f.field !== field.field) }

    const newConfig = { ...tableConfig, fields: newFields };
    onChange(newConfig)
  }

  return (
    <AccordionItem 
      buttonLabel = { `${tableType.replaceAll("_", " ")} - ${tableConfig.is_enabled ? "Synced" : "Not Synced"}` }
      buttonChildren = { <></> }
      buttonLabelProps = {{ 
        textTransform: 'capitalize', 
        opacity: tableConfig.is_enabled ? 1 : 0.6, 
        color: errors && errors.length > 0 && tableConfig.is_enabled ? mode('tomato.light.11', 'tomato.dark.11') : 'unset'  
      }}
    >
      <VStack spacing = "2" maxW = "full" mx = "auto">
        { ALWAYS_ENABLED_DATA_TYPES.includes(tableType)
          ? <Text>{ getEnabledHelperText(tableType) }</Text>
          : <EnableTableSwitch tableType = { tableType } isEnabled = { tableConfig.is_enabled } onChange = { onChangeIsEnabled } />
        }

        <TableSelection
          isLegacyAirtable = { isLegacyAirtable }
          tableOptions = { tableOptions }
          onChange = { onChangeTableId }
          isDisabled = { !tableConfig.is_enabled }
          isLoadingTables = { isLoadingTables }
          refreshTables = { refreshTables }
          integrationId = { integrationId }
          errorMessage = { parseErrorCode(errors?.find(error => error.tableId === tableConfig.table_id && !error.fieldId && !error.fieldType)?.errorCode ) }
          tableId = { tableConfig.table_id }
        />

        <FieldGroup title = "Fields" description = { getFieldsDescription(integrationId) }>
          <VStack width = "full" mt = "1" spacing = "2" divider = { <Divider my = "1" borderColor = {{ base: mode('gray.light.8', 'gray.dark.8'), sm: 'transparent' }} /> }>
            { tableConfig.fields.map((field, index) => {
              const unavailableTableFields = tableConfig.fields.filter(f => f.field !== field.field).map(f => f.field)
              return (
                <FieldMapping
                  isLegacyAirtable = { isLegacyAirtable }
                  key = { field.field }
                  tableType = { tableType }
                  fintaFieldOptions = { tableFieldOptions.filter(option => !unavailableTableFields.includes(option.value)) }
                  destinationFieldOptions = { destinationFieldOptions }
                  isDisabled = { !tableConfig.is_enabled }
                  onChangeField = { onChangeField }
                  errorMessage = { parseErrorCode(errors?.find(error => error.tableId === tableConfig.table_id && (error.fieldType === field.field || error.fieldId === field.field_id))?.errorCode)}
                  index = { index }
                  integrationId = { integrationId }
                  field = { field }
                />
              )
            })}
          </VStack>

          { tableFieldOptions
            .filter(option => !tableConfig.fields.map(field => field.field).includes(option.value))
            .length > 0 && (
            <Box mt = "2" display = "flex" width = "full" justifyContent = {{ base: 'stretch', sm: 'flex-end' }}>
              <Button 
                width = {{ base: 'full', sm: 'unset'}}
                isDisabled = { !!tableConfig.fields.find(field => !field.field) || !tableConfig.is_enabled}
                onClick = { () => onChangeField('insert', { field: "" as TableConfigFields, field_id: "" })} 
                leftIcon = { <PlusIcon /> }>Add Field</Button>
            </Box>
          )}
        </FieldGroup>
      </VStack>
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