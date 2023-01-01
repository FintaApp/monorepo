import { useState } from "react";
import { 
  HStack,
  IconButton,
  Text,
  Tooltip
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";

import { useToast } from "~/utils/frontend/useToast";
import { useDestination } from "../../../context";
import { Integration } from "@prisma/client";
import { SyncProgress } from "./SyncProgress";

export const SyncDestination = () => {
  const { currentActiveSyncId, isTriggeringManualSync, triggerSync, destination } = useDestination();

  return (
    <HStack>
      <SyncProgress />
      <Tooltip label = { destination?.integration === Integration.Coda ? "Refresh your tables within your Coda doc": "Manually refresh the data in your destination."}>
        <IconButton
          aria-label = "Refresh destination"
          icon = { <RepeatIcon /> }
          onClick = { () => triggerSync() }
          size = "sm"
          variant = "ghost"
          isLoading = { !!currentActiveSyncId || isTriggeringManualSync }
          isDisabled = { destination?.integration === Integration.Coda }
        />
      </Tooltip>
    </HStack>
  )
}