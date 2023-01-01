import { CheckIcon, Cross1Icon } from "@radix-ui/react-icons";

import { Box, Button, Stack, Text, VStack } from "@chakra-ui/react";
import { Integration } from "@prisma/client";
import { useDestination } from "../../context"
import { ALL_DESTINATION_TABLES, CODA_DESTINATION_TABLES } from "./constants";
import { TableConfig } from "./TableConfig";
import { EnableTableSwitch } from "./TableConfig/EnableTableSwitch";

export const TableConfigs = () => {
  const { integration, tableConfigsValidation, isSetupMode, tableConfigsHasChanges, onCancelChanges, validateTableConfigs, isValidatingTableConfigs } = useDestination();

  if ( integration === Integration.Coda ) {
    return (
      <VStack spacing = "1">
        { CODA_DESTINATION_TABLES.map(tableType => (
          <Box width = "full" maxW = "md" key = { tableType }>
            <EnableTableSwitch tableType = { tableType } />
          </Box>
        ))}
      </VStack>
    )
  }

  return (
    <VStack spacing = "0" width = "full">
      { ALL_DESTINATION_TABLES.map(tableType => ( <TableConfig tableType = { tableType } key = { tableType } /> ))}

      <Text visibility = { (tableConfigsValidation?.errors?.length || 0) > 0 ? "visible" : "hidden" } my = "2">Please fix the errors listed above before saving.</Text>

      <Stack display = { isSetupMode || tableConfigsHasChanges ? 'flex' : 'none' } mt = "4" justifyContent = {{ base: 'stretch', md: 'space-between' }} spacing = "1" direction = {{ base: 'column-reverse', md: 'row' }} width = 'full'>
        <Button leftIcon = {<Cross1Icon /> } onClick = { onCancelChanges } visibility = { isSetupMode ? 'hidden' : 'visible' }>Cancel</Button>
        <Button
          onClick = { validateTableConfigs }
          isDisabled = { tableConfigsValidation?.isValid || !tableConfigsHasChanges }
          leftIcon = {<CheckIcon /> } 
          variant = "primary"
          isLoading = { isValidatingTableConfigs }
        >{ isSetupMode ? ( tableConfigsValidation?.isValid ? "Validated!" : "Check" ) : "Save" }</Button>
      </Stack>
    </VStack>
  )
}