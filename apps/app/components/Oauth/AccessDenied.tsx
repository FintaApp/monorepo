import { Text, VStack } from "@chakra-ui/react"

 export const AccessDenied = ({ integrationName }: { integrationName: string }) => (
   <VStack>
     <Text>{integrationName} Access Denied</Text> 
     <Text>You may close this window.</Text>
   </VStack>
 )