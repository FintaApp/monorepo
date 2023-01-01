import { Button, Flex, FormControl, FormErrorMessage, Stack } from "@chakra-ui/react";
import { SymbolIcon } from "@radix-ui/react-icons";

import { Input, Select, FormLabelWithTooltip } from "~/components/Forms";
import { ConfigError, useDestination } from "~/components/Destinations/context";
import { Integration, SyncError, Table } from "@prisma/client";

interface TableSelectionProps {
  tableOptions: { label: string; value: string }[];
  tableType: Table
}

export const TableSelection = ({ tableType, tableOptions }: TableSelectionProps) => {
  const { integration, tableConfigsValidation, tableConfigs, isLoadingTables, refetchTables, onChangeTableConfig, isLegacyAirtable } = useDestination();
  const tableConfig = tableConfigs?.find(config => config.table === tableType) || { table: tableType, tableId: '', isEnabled: false, fieldConfigs: [] };
  const error = tableConfigsValidation?.errors?.find(error => error.tableId === tableConfig.tableId && !error.fieldId && !error.field)?.code;
  const { label, tooltipText } = getConstants(integration);

  const onChange = (newValue: string ) => {
    onChangeTableConfig({ ...tableConfig, tableId: newValue })
  }

  return (
    <FormControl isInvalid = { !!error } opacity = { tableConfig.isEnabled ? 1 : 0.6 }>
      <Stack direction = {{ base: 'column', sm: 'row' }} width = "full">
        <FormLabelWithTooltip tooltipText = { tooltipText }>{ label }</FormLabelWithTooltip>
        { isLegacyAirtable 
          ? <Input ml = {{ base: 0, sm: 2 }} mode = 'edit' value = { tableConfig.tableId } onChange = { e => onChange(e.target.value) } maxW = 'xs' isDisabled = { !tableConfig.isEnabled } />
          : (
            <Flex width = "full" justifyContent = "space-between">
              <Select
                options = { tableOptions }
                onChange = { (item: any) => onChange(item.value) }
                isMulti = { false }
                value = { tableOptions.find(option => option.value === tableConfig.tableId) }
              />

              <Button ml = "2" isLoading = { isLoadingTables } onClick = { refetchTables } variant = "icon"><SymbolIcon /></Button>
            </Flex>
          )
        }
      </Stack>
      <FormErrorMessage mt = "0" display = "flex" justifyContent = "flex-end">{ parseErrorCode(error) }</FormErrorMessage>
    </FormControl>
  )
}

const getConstants = (integration: Integration ): { label: string; tooltipText: string;} => {
  if ( integration === Integration.Airtable ) {
    return { 
      label: "Table Name", 
      tooltipText: "The value entered here must exactly match the name of table as it appears in Airtable",
    }
  }

  if ( integration === Integration.Google ) {
    return {
      label: "Sheet Name",
      tooltipText: "After saving the destination, you are free to change the name of the sheet in your Google Sheet",
    }
  }

  if ( integration === Integration.Notion ) {
    return {
      label: "Database",
      tooltipText: "After saving the destination, you are free to change the name of the database in your Notion workspace. Missing a database? Make sure that Finta has access to the pages containing the database by clicking 'Reauthorize Finta' within the 'Credentials' section.",
    }
  }

  return { label: "", tooltipText: "" }
}

const parseErrorCode = (error?: ConfigError ) => {
  if ( error === 'duplicate_table' ) return "This table is already in use";
  if ( error === 'table_not_selected' ) return "Please select a table";
  if ( error === 'MissingTable' ) return "This table cannot be found in your destination"
  return ""
}