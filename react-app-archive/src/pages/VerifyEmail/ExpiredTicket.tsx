import { Box, Button, Heading, VStack, Text } from '@chakra-ui/react';
import { Link as RouterLink } from "react-router-dom";

export const ExpiredTicket = () => (
  <Box>
    <VStack spacing = "8">
      <Heading fontSize = "3xl" fontWeight = "normal">Invalid Link</Heading>
      <Text>The link you used is expired. Please try again.</Text>
      <Button variant = "primary" as = { RouterLink } to = "/">Back to Finta</Button>
    </VStack>
  </Box>
)