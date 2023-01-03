import { Spinner, Text, VStack } from "@chakra-ui/react"

export const LoadingSpinner = () => (
  <VStack width = "full" alignContent = "center" spacing = "4" py = "4">
    <Text fontWeight = "light" fontSize = "xl">Loading</Text>
    <Spinner 
      color = "brand.400" 
      size = "xl" 
      thickness="4px"
      speed="0.65s"
    />
  </VStack>
);