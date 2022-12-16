import { Box, FormControl, FormHelperText } from "@chakra-ui/react";
import moment from "moment-timezone";

import { DatePicker } from "~/components/DatePicker";
import { FormLabelWithTooltip } from "~/components/Forms/FormLabelWithTooltip";
import { useToast } from "~/utils/frontend/useToast";
import { triggerManualDestinationSync } from "~/utils/frontend/functions";
import { Integrations_Enum, useUpdateDestinationMutation } from "~/graphql/frontend";

export interface SyndStartDateProps {
  destinationId?: string;
  integrationId?: Integrations_Enum;
  value: Date;
  onChange?: (date: Date) => void;
}

const TOOLTIP_TEXT = "From what date should we import historical data?"

export const SyncStartDate = ({ destinationId, integrationId, value, onChange: onChangeProp }: SyndStartDateProps) => {
  const renderToast = useToast();
  const [ updateDestinationMutation ] = useUpdateDestinationMutation();

  const onChange = async (newDate: Date) => {
    onChangeProp && onChangeProp(newDate)
    if ( !destinationId ) { return; }

    const originalMoment = moment(value).utc(true);
    const newDateMoment = moment(newDate).utc(true);
    const todayMoment = moment().utc(true);

    const newDateString = newDateMoment.format("YYYY-MM-DD");
    const todayString = todayMoment.format("YYYY-MM-DD")

    if ( !originalMoment.isSame(newDateMoment) ) {
      if ( integrationId === Integrations_Enum.Coda || newDateMoment.isAfter(todayMoment) || newDateMoment.isAfter(originalMoment)) {
        updateDestinationMutation({ variables: { destinationId, _set: { sync_start_date: newDateString}}})
          .then(() => renderToast({ title: "Sync Start Date Updated", status: "success"}))
        return;
      }

      renderToast({
        title: "Historical Sync in Progress",
        status: "info",
        message: "Historical transactions starting from the new sync start date will be available shortly"
      })

      return triggerManualDestinationSync({ destinationId, startDate: newDateString, endDate: todayString })
        .then(({ has_error }) => {
          if ( has_error ) {
            renderToast({
              title: 'Refresh failed',
              status: 'error',
              message: "There was an error updating the sync start date for this destination. You can view more details on the sync logs page."
            })
            
            return;
          }

          renderToast({
            title: "Refresh Completed",
            status: "success"
          });
        })
    }
  }
  
  return (
    <FormControl>
      <FormLabelWithTooltip tooltipText = { destinationId ? TOOLTIP_TEXT : undefined }>Sync Start Date</FormLabelWithTooltip>
      <Box width = "full">
        <DatePicker selected = { value } onChange = { onChange } />
      </Box>
      { !destinationId && <FormHelperText mt = '1'>{ TOOLTIP_TEXT }</FormHelperText> }
    </FormControl>
  )
}