import { 
  Stack,
  FormControl,
  FormErrorMessage,
  Icon,
  IconButton,
  useBreakpointValue,
  HStack
}
from "@chakra-ui/react";
import { ChevronRightIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { Input, Select } from "~/components/Forms";
import { TrashIcon } from "@radix-ui/react-icons";
import {  DestinationFieldType } from "~/types/shared/models"

import { fieldHelperText } from "../constants";
import { ConfigError, useDestination } from "~/components/Destinations/context";
import { Field, Integration, Table } from "@prisma/client";
import { tableConfigsMeta } from "~/lib/tableConfigsMeta";

interface FieldMappingProps {
  fintaFieldOptions: { value: Field; label: string; isRequired: boolean; }[]
  destinationFieldOptions: { label: string; value: string, type?: DestinationFieldType }[];
  field: Field;
  index: number;
  tableType: Table;
  onChange: (action: 'insert' | 'update' | 'remove', fieldConfig: { id?: string; field: Field, fieldId: string }, index?: number) => void;
}

export const FieldMapping = ({ onChange, tableType, fintaFieldOptions, field, index, destinationFieldOptions }: FieldMappingProps) => {
  const { isLegacyAirtable, integration, tableConfigs, tableConfigsValidation, onChangeTableConfig } = useDestination();
  const tableConfig = tableConfigs?.find(config => config.table === tableType) || { table: tableType, tableId: '', isEnabled: false, fieldConfigs: [] };
  const fieldConfig = tableConfig.fieldConfigs.find(f => f.field === field)!;
  
  const icon = useBreakpointValue({ base: ChevronDownIcon, sm: ChevronRightIcon });
  const fintaFieldValue = fintaFieldOptions.find(option => option.value === field);

  const error = tableConfigsValidation?.errors?.find(error => error.tableId === tableConfig.tableId && (error.field === field || error.fieldId === fieldConfig?.fieldId))?.code;

  return (
    <HStack width = "full">
      <Stack width = "full" alignItems = "center" spacing = "1" direction = {{ base: 'column', sm: 'row' }}>
        <Select
          value = { fintaFieldValue }
          options = { fintaFieldOptions }
          noOptionsMessage = { () => "There are no remaining fields" }
          placeholder = "Finta Field"
          isDisabled = { !tableConfig.isEnabled }
          onChange = { (item: any) => onChange('update', { field: item?.value || "", fieldId: fieldConfig?.fieldId || "" }, index ) }
        />

        <Icon as = { icon } />

        <FormControl isInvalid = { !!error }>
          { isLegacyAirtable
            ? <Input 
                isDisabled = { !tableConfig.isEnabled } 
                placeholder = "Destination Field" 
                value = { fieldConfig?.fieldId }
                onChange = { e => onChange('update', { field, fieldId: e.target.value }, index )}
              />
            : <Select 
                isDisabled = { !tableConfig.isEnabled }
                placeholder = "Destination Field"
                options = { getAllowedFieldOptions(integration, tableType, field, destinationFieldOptions )}
                value = { destinationFieldOptions.find(option => option.value === fieldConfig?.fieldId )}
                onChange = { (item: any) => onChange('update', { field, fieldId: item.value }, index)}
              />
          }
          <FormErrorMessage mt = "0">{ parseErrorCode(error) }</FormErrorMessage>
        </FormControl>
      </Stack>

      <IconButton 
        aria-label = "Remove field mapping"
        icon = { <TrashIcon /> }
        isDisabled = { fintaFieldValue?.isRequired || !tableConfig.isEnabled }
        visibility = { fintaFieldValue?.isRequired ? 'hidden' : 'visible'}
        onClick = { () => onChange('remove', fieldConfig) }
      />
    </HStack>
  )
}

// Helper
const getAllowedFieldOptions = (integration: Integration, tableType: Table, field: Field, fieldOptions: { label: string; value: string, type?: DestinationFieldType }[] ) => {
  if ( integration === Integration.Google || integration === Integration.Coda ) { return fieldOptions }
  const fieldToTypeMappingforFieldType = tableConfigsMeta.find(meta => meta.table === tableType)!.fields.find(f => f.field === field)?.allowedTypes;
  if ( integration === Integration.Notion && fieldToTypeMappingforFieldType ) {
    return fieldToTypeMappingforFieldType?.Notion.map(type => ({ label: fieldHelperText.Notion[type], options: fieldOptions.filter(option => type === option.type) }))
  }
  if ( integration === Integration.Airtable && fieldToTypeMappingforFieldType ) {
    return fieldToTypeMappingforFieldType?.Airtable.map(type => ({ label: fieldHelperText.Airtable[type], options: fieldOptions.filter(option => type === option.type) }))
  }
}

const parseErrorCode = (error?: ConfigError ) => {
  if ( error === 'duplicate_field' ) return "This field is already in use";
  if ( error === 'field_not_selected' ) return "Please select a field";
  if ( error === 'MissingField' ) return "This field cannot be found in your destination"
  if ( error === 'IncorrectFieldType' ) return "This field has the wrong type in your destination"
  return ""
}