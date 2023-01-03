import { Text } from "@chakra-ui/react";
import { Table } from "@prisma/client";

export const CodaPreface = ({ targetTable }: { targetTable?: Table }) => targetTable 
  ? (
    <Text>The following was synced to the { targetTable } sync table.</Text>
  )
  : <></>