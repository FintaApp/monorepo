import { Divider, HStack, Text } from '@chakra-ui/react'

export const DividerWithText = ({ text }: { text: string } ) => (
  <HStack>
    <Divider />
      <Text fontSize="md" whiteSpace="nowrap">{ text }</Text>
    <Divider />
  </HStack>
)