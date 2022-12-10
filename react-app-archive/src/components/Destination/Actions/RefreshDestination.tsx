import { useState } from "react";
import { 
  HStack,
  IconButton,
  Text,
  Tooltip
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";

import { triggerManualDestinationSync } from "src/lib/functions";
import { useToast } from "src/lib/useToast";
import moment from "moment-timezone";
import { DestinationModel } from "src/types";

export const RefreshDestination = ({ destination }: { destination: DestinationModel }) => {
  const toast = useToast();
  const [ isRefreshing, toggleIsRefreshing ] = useState(false);

  const onRefresh = async () => {
    toggleIsRefreshing(true);
    toast({ 
      title: "Refresh in Progress",
      status: "info"
    })

    triggerManualDestinationSync({ destinationId: destination.id, startDate: destination.sync_start_date, endDate: moment.utc().format("YYYY-MM-DD") })
    .then(({ has_error }) => {
      toggleIsRefreshing(false);      
      if ( has_error ) {
        toast({
          title: 'Refresh failed',
          status: 'error',
          message: "There was an error refreshing this destination. You can view more details on the sync logs page."
        })
      } else {
        toast({
          title: "Refresh Completed",
          status: "success"
        });
      }
    })
    .catch(err => {
      toggleIsRefreshing(false);
      toast({ 
        title: "Uh Oh",
        status: "error",
        message: "There was an error refreshing this destination. Please try again later."
      })
    })
  }

  return (
    <HStack>
      { isRefreshing ? <Text>Refresh in progress</Text> : null }
      <Tooltip label = "Manually refresh the data in your destination.">
        <IconButton
          aria-label = "Refresh destination"
          icon = { <RepeatIcon /> }
          onClick = { onRefresh }
          size = "sm"
          variant = "ghost"
          isLoading = { isRefreshing }
        />
      </Tooltip>
    </HStack>
  )
}