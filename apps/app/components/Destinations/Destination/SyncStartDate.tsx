import { Box, FormControl, FormHelperText } from "@chakra-ui/react";
import moment from "moment-timezone";

import { DatePicker } from "~/components/DatePicker";
import { FormLabelWithTooltip } from "~/components/Forms/FormLabelWithTooltip";
import { useDestination } from "../context";

const TOOLTIP_TEXT = "From what date should we import historical data?"

export const SyncStartDate = () => {
  const { isSetupMode, syncStartDate, updateSyncStartDate, currentActiveSyncId } = useDestination();
  const onChange = async (newDate: Date) => {
    updateSyncStartDate(moment(newDate).utc(true).format("YYYY-MM-DD"))
    if ( isSetupMode ) { return; }

    // const originalMoment = moment(value).utc(true);
    // const newDateMoment = moment(newDate).utc(true);
    // const todayMoment = moment().utc(true);

    // const newDateString = newDateMoment.format("YYYY-MM-DD");
    // const todayString = todayMoment.format("YYYY-MM-DD")

    // if ( !originalMoment.isSame(newDateMoment) ) {
    //   if ( integrationId === Integrations_Enum.Coda || newDateMoment.isAfter(todayMoment) || newDateMoment.isAfter(originalMoment)) {
    //     updateDestinationMutation({ variables: { destinationId, _set: { sync_start_date: newDateString}}})
    //       .then(() => renderToast({ title: "Sync Start Date Updated", status: "success"}))
    //     return;
    //   }

    //   renderToast({
    //     title: "Historical Sync in Progress",
    //     status: "info",
    //     message: "Historical transactions starting from the new sync start date will be available shortly"
    //   })

    //   return triggerManualDestinationSync({ destinationId, startDate: newDateString, endDate: todayString })
    //     .then(({ has_error }) => {
    //       if ( has_error ) {
    //         renderToast({
    //           title: 'Refresh failed',
    //           status: 'error',
    //           message: "There was an error updating the sync start date for this destination. You can view more details on the sync logs page."
    //         })
            
    //         return;
    //       }

    //       renderToast({
    //         title: "Refresh Completed",
    //         status: "success"
    //       });
    //     })
    // }
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