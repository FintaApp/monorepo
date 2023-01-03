import { Box, Button, Divider, Text, useColorModeValue as mode, VStack } from "@chakra-ui/react";
import { PlusIcon } from "@radix-ui/react-icons";

import { Field, Integration, Table } from "@prisma/client";
import { useDestination } from "~/components/Destinations/context";
import { tableConfigsMeta } from "~/lib/tableConfigsMeta";
import { TableConfig as TableConfigType } from "~/types";

import { AccordionItem } from "~/components/Common/AccordionItem";
import { EnableTableSwitch } from "./EnableTableSwitch";
import { TableSelection } from "./TableSelection";
import { FieldGroup } from "~/components/Common/FieldGroup";
import { FieldMapping } from "./FieldMapping";

export const TableConfig = ({ tableType }: { tableType: Table }) => {
  const { tableConfigs, tables, integration, tableConfigsValidation, onChangeTableConfig } = useDestination();
  const tableConfig = tableConfigs?.find(config => config.table === tableType) || { table: tableType, tableId: '', isEnabled: false, fieldConfigs: [] };
  const tableConfigMeta = tableConfigsMeta.find(meta => meta.table === tableType)!;

  const tableOptions = tables?.map(table => ({ label: table.name, value: table.tableId }));
  const tableFieldOptions = tableConfigMeta.fields
    .filter(field => !(field.hideFor || []).includes(integration))
    .map(field => ({ value: field.field, label: field.label, isRequired: field.isRequired }));
  const destinationFieldOptions = tables?.find(table => table.tableId === tableConfig.tableId)?.fields
    .map(field => ({ label: field.name, value: field.fieldId, type: field.type })) || [];
  const errors = tableConfigsValidation?.errors?.filter(error => error.table === tableConfig.table);

  const onChangeField = (action: 'insert' | 'update' | 'remove', fieldConfig: { id?: string; field: Field, fieldId: string }, index?: number) => {
    let newFields = tableConfig.fieldConfigs;
    if ( action === 'insert' ) { newFields = newFields.concat(fieldConfig) };
    if ( action === 'update' ) { newFields = newFields.map((f, idx) => idx === index ? fieldConfig : f )}
    if ( action === 'remove' ) { newFields = newFields.filter(f => f.field !== fieldConfig.field) }

    onChangeTableConfig({ ...tableConfig, fieldConfigs: newFields })
  }

  return (
    <AccordionItem
      buttonLabel = { `${tableType === Table.InvestmentTransactions ? "Investment Transactions" : tableType} - ${tableConfig.isEnabled ? "Synced" : "Not Synced"}` }
      buttonChildren = { <></> }
      buttonLabelProps = {{ 
        textTransform: 'capitalize', 
        opacity: tableConfig.isEnabled ? 1 : 0.6, 
        color: errors && errors.length > 0 && tableConfig.isEnabled ? mode('tomato.light.11', 'tomato.dark.11') : 'unset'  
      }}
    >
      <VStack spacing = "2" maxW = "full" mx = "auto">
        { tableConfigMeta.isRequired 
          ? <Text>{ getEnabledHelperText(tableType, tableConfig) }</Text>
          : <EnableTableSwitch tableType = { tableType } />
        }

        <TableSelection tableType = { tableType } tableOptions = { tableOptions || [] } />

        <FieldGroup title = "Fields" description = { getFieldsDescription(integration) }>
          <VStack width = "full" mt = "1" spacing = "2" divider = { <Divider my = "1" borderColor = {{ base: mode('gray.light.8', 'gray.dark.8'), sm: 'transparent' }} /> }>
            { tableConfig.fieldConfigs.map((fieldConfig, index) => {
              const unavailableTableFields = tableConfig.fieldConfigs.filter(f => f.field !== fieldConfig.field).map(f => f.field);
              return (
                <FieldMapping
                  key = { fieldConfig.field }
                  tableType = { tableType }
                  fintaFieldOptions = { tableFieldOptions.filter(option => !unavailableTableFields.includes(option.value)) }
                  destinationFieldOptions = { destinationFieldOptions }
                  onChange = { onChangeField }
                  index = { index }
                  field = { fieldConfig.field }
                />
              )
            })}
          </VStack>

          { tableFieldOptions
            .filter(option => !tableConfig.fieldConfigs.map(fieldConfig => fieldConfig.field).includes(option.value))
            .length > 0 && (
            <Box mt = "2" display = "flex" width = "full" justifyContent = {{ base: 'stretch', sm: 'flex-end' }}>
              <Button 
                width = {{ base: 'full', sm: 'unset'}}
                isDisabled = { !!tableConfig.fieldConfigs.find(fieldConfig => !fieldConfig.field) || !tableConfig.isEnabled}
                onClick = { () => onChangeField('insert', { field: "" as Field, fieldId: "" })} 
                leftIcon = { <PlusIcon /> }>Add Field</Button>
            </Box>
          )}
        </FieldGroup>
      </VStack>
    </AccordionItem>
  )
}

// Helper Functions
const getEnabledHelperText = (tableType: Table, tableConfig: TableConfigType) => {
  if ( tableType === Table.Categories) { 
    if ( tableConfig.isEnabled ) {
      return "Remove the 'Category' field in the Transactions table to disable the Categories table"
    }
    return "Add the 'Category' field in the Transactions table to enable the Categories table"
  }
  if ( tableType === Table.Securities) { return "Either the Investment Transactions or Holdings table must be enabled to sync securities"}
  return ""
}

const getFieldsDescription = (integration: Integration) => {
  if ( integration === Integration.Airtable ) { return "Each field corresponds to column in your Airtable table"};
  if ( integration === Integration.Google ) { return "Each field corresponds to a column in your Google Sheet"};
  if ( integration === Integration.Notion ) { return "Each field corresponds to a column in your Notion database"};
  return ""
}