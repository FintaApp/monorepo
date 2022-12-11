import { Box, FormControl, FormHelperText } from "@chakra-ui/react";
import moment from "moment-timezone";
import { useApolloClient } from "@apollo/client";

import { DatePicker } from "~/components/DatePicker";
import { FormLabelWithTooltip } from "~/components/FormLabelWithTooltip";
import { useToast } from "~/utils/frontend/useToast";
import { triggerManualDestinationSync } from "~/utils/frontend/functions";
import { Integrations_Enum, useUpdateDestinationMutation } from "~/graphql/frontend";
import { DestinationModel } from "~/types/frontend";

export interface SyndStartDateProps {
  destination?: DestinationModel;
  value?: Date;
  onChange?: (date: Date) => void;
}

const TOOLTIP_TEXT = "From what date should we import historical data?"

export const SyncStartDate = ({ destination, value, onChange: onChangeProp }: SyndStartDateProps) => {
  const apolloClient = useApolloClient();

  const renderToast = useToast();
  const [ updateDestinationMutation ] = useUpdateDestinationMutation();

  const onChange = async (date: Date) => {
    if ( destination ) {
      await updateSyncStartDate(date)
    }
    onChangeProp && onChangeProp(date)
  }


  const updateSyncStartDate = async (newDate: Date) => {
    const syncStartDate = moment(newDate).utc(true).format("YYYY-MM-DD");
    const today = moment().format("YYYY-MM-DD");
    if ( !destination ) { return; }
    if ( syncStartDate !== destination.sync_start_date ) {
      if ( syncStartDate > today || syncStartDate > destination.sync_start_date ) {
        updateDestinationMutation({ variables: { destination_id: destination.id, _set: { sync_start_date: syncStartDate }}})
        .then(() => {
          renderToast({
            title: "Sync Start Date Updated",
            status: "success"
          });
        })
        return;
      }

      if ( destination.integration_id !== Integrations_Enum.Coda ) {
        renderToast({
          title: "Historical Sync in Progress",
          status: "info",
          message: "Historical transactions starting from the new sync start date will be available shortly"
        })
      }
  
      return triggerManualDestinationSync({ 
        destinationId: destination.id,
        startDate: syncStartDate,
        endDate: moment.utc().format("YYYY-MM-DD")
      })
      .then(({ has_error }) => {
        if ( has_error ) {
          renderToast({
            title: 'Refresh failed',
            status: 'error',
            message: "There was an error updating the sync start date for this destination. You can view more details on the sync logs page."
          })
          
          return;
        }

        apolloClient.refetchQueries({ include: 'all' })

        if ( destination!.integration_id === Integrations_Enum.Coda ) {
          renderToast({
            title: "Sync Start Date Updated",
            message: "You should see historical transactions in your Coda doc after the next sync.",
            status: "success"
          });
        } else {
          renderToast({
            title: "Refresh Completed",
            status: "success"
          });
        }
      })
      .catch(err => {
        console.log(err);
      })
    }
  }
  
  return (
    <FormControl>
      <FormLabelWithTooltip tooltipText = { destination ? TOOLTIP_TEXT : undefined }>Sync Start Date</FormLabelWithTooltip>
      <Box width = "full">
        <DatePicker selected = { destination ? moment(destination?.sync_start_date).toDate() : value! } onChange = { onChange } />
      </Box>
      { !destination && <FormHelperText mt = '1'>{ TOOLTIP_TEXT }</FormHelperText> }
    </FormControl>
  )
}