import { Button, Flex, FormControl, FormErrorMessage, Stack } from "@chakra-ui/react";
import { SymbolIcon } from "@radix-ui/react-icons";

import { Integrations_Enum } from "~/graphql/frontend";
import { Input, Select, FormLabelWithTooltip } from "~/components/Forms";

interface TableSelectionProps {
  isLegacyAirtable: boolean;
  isDisabled: boolean;
  integrationId: Integrations_Enum;
  errorMessage?: string;
  tableId?: string;
  onChange: (newTableId: string) => void;
  tableOptions: { label: string; value: string }[];
  isLoadingTables: boolean;
  refreshTables: () => void;
}

export const TableSelection = ({ isLegacyAirtable, integrationId, errorMessage, isDisabled, tableId, onChange, tableOptions, isLoadingTables, refreshTables }: TableSelectionProps) => {
  const { label, tooltipText } = getConstants(integrationId);
  return (
    <FormControl isInvalid = { !!errorMessage } opacity = { isDisabled ? 0.6 : 1 }>
      <Stack direction = {{ base: 'column', sm: 'row' }} width = "full">
        <FormLabelWithTooltip tooltipText = { tooltipText }>{ label }</FormLabelWithTooltip>
        { isLegacyAirtable 
          ? <Input ml = {{ base: 0, sm: 2 }} mode = 'edit' value = { tableId } onChange = { e => onChange(e.target.value) } maxW = 'xs' isDisabled = { isDisabled } />
          : (
            <Flex width = "full" justifyContent = "space-between">
              <Select
                options = { tableOptions }
                onChange = { (item: any) => onChange(item.value) }
                isMulti = { false }
                value = { tableOptions.find(option => option.value === tableId) }
              />

              <Button ml = "2" isLoading = { isLoadingTables } onClick = { refreshTables } variant = "icon"><SymbolIcon /></Button>
            </Flex>
          )
        }
      </Stack>
      <FormErrorMessage mt = "0" display = "flex" justifyContent = "flex-end">{ errorMessage }</FormErrorMessage>
    </FormControl>
  )
}

const getConstants = (integrationId: Integrations_Enum ): { label: string; tooltipText: string;} => {
  if ( integrationId === Integrations_Enum.Airtable ) {
    return { 
      label: "Table Name", 
      tooltipText: "The value entered here must exactly match the name of table as it appears in Airtable",
    }
  }

  if ( integrationId === Integrations_Enum.Google ) {
    return {
      label: "Sheet Name",
      tooltipText: "After saving the destination, you are free to change the name of the sheet in your Google Sheet",
    }
  }

  if ( integrationId === Integrations_Enum.Notion ) {
    return {
      label: "Database",
      tooltipText: "After saving the destination, you are free to change the name of the database in your Notion workspace. Missing a database? Make sure that Finta has access to the pages containing the database by clicking 'Reauthorize Finta' within the 'Credentials' section.",
    }
  }

  return { label: '', tooltipText: ''}
}