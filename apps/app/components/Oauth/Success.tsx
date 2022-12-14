import { Text, VStack } from "@chakra-ui/react";

 export const Success = ({ integrationName }: { integrationName: string }) => (
   <VStack>
     <Text>Your {integrationName} workspace has been added to your account.</Text> 
     <Text>You may close this window.</Text>
   </VStack>
 )