import {
  // Badge,
  Box,
  FormLabel,
  HStack,
  Text
} from "@chakra-ui/react";
import { useAuth } from "~/utils/frontend/useAuth";

export const Email = () => {
  const { user } = useAuth();

  return (
    <HStack justifyContent = "space-between">
      <Box>
        <FormLabel>Email</FormLabel>
        <Text>{ user!.email }</Text>
      </Box>
      {/* <Badge variant = { user!.email_verified ? "success" : "error"  }>{ user!.email_verified ? "Verified" : "Not Verified" }</Badge> */}
    </HStack>
  )
}