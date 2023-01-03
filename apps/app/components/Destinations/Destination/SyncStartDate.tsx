import { Box, FormControl, FormHelperText } from "@chakra-ui/react";
import moment from "moment-timezone";

import { DatePicker } from "~/components/Common/DatePicker";
import { FormLabelWithTooltip } from "~/components/Forms/FormLabelWithTooltip";
import { useDestination } from "../context";

const TOOLTIP_TEXT = "From what date should we import historical data?"

export const SyncStartDate = () => {
  const { isSetupMode, syncStartDate, updateSyncStartDate, currentActiveSyncId } = useDestination();
  const onChange = async (newDate: Date) => {
    updateSyncStartDate(moment(newDate).utc(true).format("YYYY-MM-DD"))
    if ( isSetupMode ) { return; }
  }
  
  return (
    <FormControl>
      <FormLabelWithTooltip tooltipText = { !isSetupMode && TOOLTIP_TEXT }>Sync Start Date</FormLabelWithTooltip>
      <Box width = "full">
        <DatePicker isDisabled = { !!currentActiveSyncId } selected = { moment(syncStartDate, true).toDate() } onChange = { onChange } />
      </Box>
      { isSetupMode && <FormHelperText mt = '1'>{ TOOLTIP_TEXT }</FormHelperText> }
    </FormControl>
  )
}