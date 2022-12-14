import { FormControl, FormLabel, Switch } from "@chakra-ui/react";

import {  DestinationTableTypes } from "~/types/shared/models";

interface EnableSwitchProps {
  tableType: DestinationTableTypes;
  isEnabled: boolean;
  onChange: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined
}

export const EnableTableSwitch = ({ tableType, isEnabled, onChange }: EnableSwitchProps) => (
  <FormControl display = "flex" alignItems = "center" justifyContent = "space-between">
    <FormLabel textTransform = 'capitalize' htmlFor = { `enable-${tableType}`} mb = '0'>Enable {tableType.replaceAll("_", " ")}</FormLabel>
    <Switch isChecked = { isEnabled } onChange = { onChange } id = {`enable-${tableType}`} />
  </FormControl>
)