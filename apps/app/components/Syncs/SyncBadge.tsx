import moment from "moment-timezone";
import { Badge, Icon, Text } from "@chakra-ui/react";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";

export const SyncBadge = ({ endedAt, isSuccess }: { endedAt: Date | null; isSuccess: boolean | null }) => (
  <Badge alignItems = "center" display = "flex" variant = { endedAt ? isSuccess ? 'success' : 'error' : 'outline' }>
    { endedAt && <Icon mr = "1" as = { isSuccess ? CheckCircledIcon : CrossCircledIcon } /> }
    <Text variant = "helper">{ endedAt ? moment(endedAt).format("MMM DD h:mm a") : 'In progress' }</Text>
  </Badge>
)