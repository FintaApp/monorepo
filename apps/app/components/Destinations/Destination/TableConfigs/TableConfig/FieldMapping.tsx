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
import { fieldToTypeMapping, TableConfigFields, DestinationFieldType, TableConfig, DestinationTableTypes } from "~/types/shared/models"
import { Integrations_Enum } from "~/graphql/frontend";
import { fieldHelperText } from "../constants";

interface FieldMappingProps {
  isLegacyAirtable: boolean;
  fintaFieldOptions: { value: TableConfigFields; label: string; isRequired: boolean; }[]
  destinationFieldOptions: { label: string; value: string, type?: DestinationFieldType }[];
  field: { field: TableConfigFields; field_id: string };
  isDisabled?: boolean;
  onChangeField: (action: 'insert' | 'update' | 'remove', field: { field: TableConfig['fields'][0]['field'] | "", field_id: string }, index?: number) => void;
  index: number;
  errorMessage?: string;
  tableType: DestinationTableTypes;
  integrationId: Integrations_Enum;
}

export const FieldMapping = ({ isLegacyAirtable, integrationId, tableType, onChangeField, fintaFieldOptions, field, isDisabled, index, errorMessage, destinationFieldOptions }: FieldMappingProps) => {
  const icon = useBreakpointValue({ base: ChevronDownIcon, sm: ChevronRightIcon });
  const fintaFieldValue = fintaFieldOptions.find(option => option.value === field.field);

  return (
    <HStack width = "full">
      <Stack width = "full" alignItems = "center" spacing = "1" direction = {{ base: 'column', sm: 'row' }}>
        <Select
          value = { fintaFieldValue }
          options = { fintaFieldOptions }
          noOptionsMessage = { () => "There are no remaining fields" }
          placeholder = "Finta Field"
          isDisabled = { isDisabled }
          onChange = { (item: typeof fintaFieldOptions[0]) => onChangeField('update', { field: item?.value || "", field_id: field?.field_id || "" }, index ) }
        />

        <Icon as = { icon } />

        <FormControl isInvalid = { !!errorMessage }>
          { isLegacyAirtable
            ? <Input 
                isDisabled = { isDisabled } 
                placeholder = "Destination Field" 
                value = { field.field_id }
                onChange = { e => onChangeField('update', { field: field.field, field_id: e.target.value }, index )}
              />
            : <Select 
                isDisabled = { isDisabled }
                placeholder = "Destination Field"
                options = { getAllowedFieldOptions(integrationId, tableType, field.field, destinationFieldOptions )}
                value = { destinationFieldOptions.find(option => option.value === field.field_id )}
                onChange = { (item: typeof destinationFieldOptions[0]) => onChangeField('update', { field: field.field, field_id: item.value }, index)}
              />
          }
          <FormErrorMessage mt = "0">{ errorMessage }</FormErrorMessage>
        </FormControl>
      </Stack>

      <IconButton 
        aria-label = "Remove field mapping"
        icon = { <TrashIcon /> }
        isDisabled = { fintaFieldValue?.isRequired || isDisabled }
        visibility = { fintaFieldValue?.isRequired ? 'hidden' : 'visible'}
        onClick = { () => onChangeField('remove', field) }
      />
    </HStack>
  )
}

// Helper
const getAllowedFieldOptions = (integrationId: Integrations_Enum, tableType: DestinationTableTypes, field: TableConfigFields, fieldOptions: { label: string; value: string, type?: DestinationFieldType }[] ) => {
  if ( ![Integrations_Enum.Notion, Integrations_Enum.Airtable].includes(integrationId) ) { return fieldOptions }
  const fieldToTypeMappingforFieldType = fieldToTypeMapping[tableType][field]
  if ( integrationId === Integrations_Enum.Notion && fieldToTypeMappingforFieldType ) {
    return fieldToTypeMappingforFieldType.notion.map(type => ({ label: fieldHelperText.notion[type], options: fieldOptions.filter(option => type === option.type) }))
  }
  if ( integrationId === Integrations_Enum.Airtable && fieldToTypeMappingforFieldType ) {
    return fieldToTypeMappingforFieldType.airtable.map(type => ({ label: fieldHelperText.airtable[type], options: fieldOptions.filter(option => type === option.type) }))
  }
}