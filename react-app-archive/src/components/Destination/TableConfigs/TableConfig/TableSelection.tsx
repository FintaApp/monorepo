import { Button, Flex, FormControl, FormErrorMessage, Stack } from "@chakra-ui/react";
import { SymbolIcon } from "@radix-ui/react-icons";

import { Input } from "src/components/Input";
import { Select } from "src/components/Select";
import { FormLabelWithTooltip } from "src/components/FormLabelWithTooltip";
import { Integrations_Enum } from "src/graphql";

interface TableSelectionProps {
  integrationId: Integrations_Enum;
  tableId?: string;
  onChange: (newTableId: string) => void;
  isDisabled: boolean;
  errorMessage?: string;
  options: { label: string; value: string }[];
  isLoading: boolean;
  refreshTables: () => void;
}

export const TableSelection = ({ integrationId, tableId, onChange, errorMessage, isDisabled, options, isLoading, refreshTables }: TableSelectionProps) => {
  const { label, tooltipText, type } = getConstants(integrationId);
  const isInvalid = !!errorMessage;
  return (
    <FormControl isInvalid = { isInvalid } opacity = { isDisabled ? 0.6 : 1 }>
      <Stack direction = {{ base: 'column', sm: 'row' }}  width = "full">
        <FormLabelWithTooltip tooltipText = { tooltipText }>{ label }</FormLabelWithTooltip>
        { type === 'input' && (
          <Input 
            ml = {{ base: 0, sm: 2 }}
            mode = { 'edit' }
            value = { tableId }
            onChange = { e => onChange(e.target.value) }
            maxW = 'xs'
            isDisabled = { isDisabled }
          />
        )}

        { type === 'select' && (
          <Flex width = "full" justifyContent = 'space-between'>
            <Select 
              options = { options }
              onChange = { (item: any) => onChange(item.value) }
              isMulti = { false }
              value = { options.find(option => option.value === tableId) }
            />
            <Button ml = "2" isLoading = { isLoading } onClick = { refreshTables } variant = "icon">
              <SymbolIcon />
            </Button>
          </Flex>
        )}
      </Stack>
      <FormErrorMessage mt = "0" display = "flex" justifyContent = "flex-end">{ errorMessage }</FormErrorMessage>
    </FormControl>
  )
}

const getConstants = (integrationId: Integrations_Enum ): { label: string; tooltipText: string; type: 'input' | 'select'} => {
  if ( integrationId === Integrations_Enum.Airtable ) {
    return { 
      label: "Table Name", 
      tooltipText: "The value entered here must exactly match the name of table as it appears in Airtable",
      type: 'input'
    }
  }

  if ( integrationId === Integrations_Enum.Google ) {
    return {
      label: "Sheet Name",
      tooltipText: "After saving the destination, you are free to change the name of the sheet in your Google Sheet",
      type: 'select'
    }
  }

  if ( integrationId === Integrations_Enum.Notion ) {
    return {
      label: "Database",
      tooltipText: "After saving the destination, you are free to change the name of the database in your Notion workspace. Missing a database? Make sure that Finta has access to the pages containing the database by clicking 'Reauthorize Finta' within the 'Credentials' section.",
      type: 'select'
    }
  }

  return {
    label: "",
    tooltipText: "",
    type: 'input'
  }
}