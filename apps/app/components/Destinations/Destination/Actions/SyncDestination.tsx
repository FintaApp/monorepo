import { useState } from "react";
import { 
  HStack,
  IconButton,
  Text,
  Tooltip
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";

import { useToast } from "~/utils/frontend/useToast";
import { useDestination } from "../../context";

export const SyncDestination = () => {
  const { currentActiveSyncLogId, triggerSync } = useDestination();

  // const onRefresh = async () => {
  //   toggleIsRefreshing(true);
  //   toast({ 
  //     title: "Refresh in Progress",
  //     status: "info"
  //   })

  //   triggerManualDestinationSync({ destinationId, startDate: syncStartDate, endDate: moment.utc().format("YYYY-MM-DD") })
  //   .then(({ has_error }) => {
  //     toggleIsRefreshing(false);      
  //     if ( has_error ) {
  //       toast({
  //         title: 'Refresh failed',
  //         status: 'error',
  //         message: "There was an error refreshing this destination. You can view more details on the sync logs page."
  //       })
  //     } else {
  //       toast({
  //         title: "Refresh Completed",
  //         status: "success"
  //       });
  //     }
  //   })
  //   .catch(err => {
  //     toggleIsRefreshing(false);
  //     toast({ 
  //       title: "Uh Oh",
  //       status: "error",
  //       message: "There was an error refreshing this destination. Please try again later."
  //     })
  //   })
  // }

  return (
    <HStack>
      { !!currentActiveSyncLogId ? <Text fontSize = "sm">Sync in progress</Text> : null }
      <Tooltip label = "Manually refresh the data in your destination.">
        <IconButton
          aria-label = "Refresh destination"
          icon = { <RepeatIcon /> }
          onClick = { triggerSync }
          size = "sm"
          variant = "ghost"
          isLoading = { !!currentActiveSyncLogId }
        />
      </Tooltip>
    </HStack>
  )
}