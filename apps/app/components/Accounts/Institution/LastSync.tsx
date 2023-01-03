import { Text } from "@chakra-ui/react";
import moment from "moment-timezone";

import { usePlaidItem } from "./context"

export const LastSync = () => {
  const { plaidItem: { lastSyncedAt} } = usePlaidItem();

  return (
    <Text fontSize = "sm" mt = "1" variant = "helper">
      { lastSyncedAt ? `Last sync: ${ moment(lastSyncedAt).format("MMMM D hh:mm a") }` : null}
    </Text>
  )
}