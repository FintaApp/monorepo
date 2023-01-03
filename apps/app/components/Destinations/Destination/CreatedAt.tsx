import { Text } from "@chakra-ui/react";
import moment from "moment-timezone";

import { useDestination } from "../context"

export const CreatedAt = () => {
  const { destination } = useDestination();
  return <Text width = "full" fontSize = "sm" variant = "helper">Created { moment(destination!.createdAt).format("LL") }</Text> 
}