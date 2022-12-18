import { Divider, HStack, Text, useColorModeValue as mode } from '@chakra-ui/react'

export const DividerWithText = ({ text }: { text: string } ) => {
  const color = mode('gray.light.11', 'gray.dark.11');
  
  return (
    <HStack width = "full">
      <Divider borderColor = { color }/>
        <Text color = { color } fontSize="sm" whiteSpace="nowrap">{ text }</Text>
        <Divider borderColor = { color }/>
    </HStack>
  )
}