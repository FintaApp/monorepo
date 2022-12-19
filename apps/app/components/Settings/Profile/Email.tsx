import {
  Box,
  FormLabel,
  HStack,
  Text
} from "@chakra-ui/react";
import { useUser } from "~/lib/context/useUser";

export const Email = () => {
  const { user } = useUser();

  return (
    <HStack justifyContent = "space-between">
      <Box>
        <FormLabel>Email</FormLabel>
        <Text>{ user?.email }</Text>
      </Box>
    </HStack>
  )
}