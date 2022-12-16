import { Text } from "@chakra-ui/react";
import moment from "moment-timezone";

import { useAuth } from "~/utils/frontend/useAuth"

export const JoinedOn = () => {
  const { user } = useAuth();
  return <Text variant = "helper">Joined on { moment(user.createdAt).format("LL") }</Text>
}