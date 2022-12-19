import { Text } from "@chakra-ui/react";
import moment from "moment-timezone";
import { useUser } from "~/lib/context/useUser";

export const JoinedOn = () => {
  const { user } = useUser();
  if ( !user ) { return <></> } 
  return <Text variant = "helper">Joined on { moment(user.createdAt).format("LL") }</Text>
}