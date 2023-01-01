import { Avatar, HStack, Text, useColorModeValue as mode } from "@chakra-ui/react";
import { AiOutlineBank } from "react-icons/ai";

import { usePlaidItem } from "./context"

export const PlaidItemHeader = () => {
  const { plaidItem } = usePlaidItem();

  return (
    <HStack>
      <Avatar
        size = "sm"
        mr = "1"
        src = { plaidItem.institution.logoUrl || undefined }
        icon = { <AiOutlineBank /> } 
        fontSize = "1.25rem"
        shadow = { mode('xs', 'dark.xs') }
        borderColor = { mode('gray.light.7', 'gray.dark.7') }
      />
        <Text fontWeight = "semibold">{ plaidItem.institution.name }</Text>
    </HStack>
  )
}