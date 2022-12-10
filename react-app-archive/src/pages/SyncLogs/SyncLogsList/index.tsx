import { 
  Accordion,
  VStack 
} from "@chakra-ui/react";

import { DestinationSyncLog } from "./DestinationSyncLog";
import { PlaidItemSyncLog } from "./PlaidItemSyncLog";
import { SyncLogModel } from "src/types";

export const SyncLogsList = ({ syncLogs }: { syncLogs: SyncLogModel[] }) => (
    <Accordion allowToggle>
      <VStack spacing = "4">
        { 
          [...syncLogs ]
          .sort((l1, l2) => l1.created_at > l2.created_at ? -1 : 1)
          .map(log => ['destination', 'refresh', 'historical_sync'].includes(log.trigger) ? (
            <DestinationSyncLog key = { log.id } syncLog = { log } />
          ) : <PlaidItemSyncLog key = { log.id } syncLog = { log } />)
        }
      </VStack>
    </Accordion>
  )