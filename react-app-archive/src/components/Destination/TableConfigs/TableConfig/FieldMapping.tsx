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
import { Input } from "src/components/Input";
import { TrashIcon } from "@radix-ui/react-icons";
import { fieldToTypeMapping } from "@finta/types"

import { fieldHelperText } from "../constants";
import { INSTITUTION_TABLE_FIELDS, ACCOUNTS_TABLE_FIELDS, TRANSACTIONS_TABLE_FIELDS, SECURITIES_TABLE_FIELDS, HOLDINGS_TABLE_FIELDS, INVESTMENT_TRANSACTIONS_TABLE_FIELDS, CATEGORIES_TABLE_FIELDS } from "../constants";
import { Select } from "src/components/Select";
import { DestinationTableTypes, TableConfigFields, TableConfig as TableConfigType, FieldType } from "src/types";
import { Integrations_Enum } from "src/graphql";

type FieldMappingProps = {
  showFieldIdAs: 'select' | 'text',
  field: { field: TableConfigFields; field_id: string }
  tableType: DestinationTableTypes ;
  tableFieldOptions: { value: TableConfigFields, label: string }[];
  tableFieldValue:  { value: TableConfigFields | string, label: string };
  fieldOptions: { label: string; value: string, type?: FieldType }[];
  isDisabled?: boolean;
  onChangeField: (action: 'insert' | 'update' | 'remove', field: { field: TableConfigType['fields'][0]['field'], field_id: string }, index?: number) => void
  errorMessage?: string;
  index: number;
  integrationId: Integrations_Enum
}

const getTableField = (tableType: DestinationTableTypes, field: TableConfigFields) => {
  if (tableType === DestinationTableTypes.INSTITUTIONS ) { return INSTITUTION_TABLE_FIELDS.find(tableField => tableField.field === field ) || { is_required: false, field: "" } }
  if (tableType === DestinationTableTypes.ACCOUNTS ) { return ACCOUNTS_TABLE_FIELDS.find(tableField => tableField.field === field ) || { is_required: false, field: "" } }
  if (tableType === DestinationTableTypes.TRANSACTIONS ) { return TRANSACTIONS_TABLE_FIELDS.find(tableField => tableField.field === field ) || { is_required: false, field: "" } }
  if (tableType === DestinationTableTypes.CATEGORIES ) { return CATEGORIES_TABLE_FIELDS.find(tableField => tableField.field === field ) || { is_required: false, field: "" } }
  if (tableType === DestinationTableTypes.HOLDINGS ) { return HOLDINGS_TABLE_FIELDS.find(tableField => tableField.field === field ) || { is_required: false, field: "" } }
  if (tableType === DestinationTableTypes.INVESTMENT_TRANSACTIONS) { return INVESTMENT_TRANSACTIONS_TABLE_FIELDS.find(tableField => tableField.field === field ) || { is_required: false, field: "" } } 
  return SECURITIES_TABLE_FIELDS.find(tableField => tableField.field === field ) || { is_required: false, field: "" }
}

const getAllowedFieldOptions = (integrationId: Integrations_Enum, tableType: DestinationTableTypes, field: TableConfigFields, fieldOptions: { label: string; value: string, type?: FieldType }[] ) => {
  if ( ![Integrations_Enum.Notion].includes(integrationId) ) { return fieldOptions }
  const fieldToTypeMappingforFieldType = fieldToTypeMapping[tableType][field]
  if ( integrationId === Integrations_Enum.Notion && fieldToTypeMappingforFieldType ) {
    return fieldToTypeMappingforFieldType.notion.map(type => ({ label: fieldHelperText.notion[type], options: fieldOptions.filter(option => type === option.type) }))
  }
}

export const FieldMapping = ({ integrationId, index, errorMessage, fieldOptions, onChangeField, isDisabled = false, tableFieldOptions, tableFieldValue, showFieldIdAs, field, tableType }: FieldMappingProps) => {
  const icon = useBreakpointValue({ base: ChevronDownIcon, sm: ChevronRightIcon });
  const tableField = getTableField(tableType, field.field)!;

  return (
    <HStack width = "full">
      <Stack width = "full" alignItems = "center" spacing = "1" direction = {{ base: 'column', sm: 'row' }}>
        <Select 
          value = { tableFieldValue } 
          options = { tableFieldOptions } 
          noOptionsMessage = { () => "There are no remaining fields"}
          placeholder = "Finta Field"
          isDisabled = { isDisabled }
          onChange = { (item: any) => onChangeField('update', { field: item?.value || "", field_id: field?.field_id || "" }, index )}
        />
        <Icon as = { icon } />
        <FormControl isInvalid = { !!errorMessage }>
          { showFieldIdAs === 'select' 
            ? <Select 
                isDisabled = { isDisabled } 
                placeholder = "Destination Field" 
                options = { getAllowedFieldOptions(integrationId, tableType, field.field, fieldOptions) }
                value = { fieldOptions.find(option => option.value === field.field_id) }
                onChange = { (item: any) => onChangeField('update', { field: field.field, field_id: item.value }, index)}
              /> 
            : (
            <Input 
              isDisabled = { isDisabled } 
              placeholder = "Destination Field" 
              value = { field.field_id }
              onChange = { e => onChangeField('update', { field: field.field, field_id: e.target.value }, index )}
            /> 
            )}
          <FormErrorMessage mt = "0">{ errorMessage }</FormErrorMessage>
        </FormControl>
      </Stack>

      <IconButton 
        aria-label = "Remove field mapping"
        icon = { <TrashIcon /> }
        isDisabled = { tableField.is_required }
        visibility = { tableField.is_required ? 'hidden' : 'visible'}
        onClick = { () => onChangeField('remove', field) }
      />
    </HStack>
  )
}