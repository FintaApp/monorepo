import {
  Box,
  Link,
  Image,
  Text
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { Integrations_Enum } from "~/graphql/frontend";

export const Templates = {
  [Integrations_Enum.Airtable]: () => (
    <Text>Copy the <Link href = "https://airtable.com/universe/expj8w5ARVcjz9b2Q/finta-budget-template" isExternal>Finta Budget Template <ExternalLinkIcon mx="2px" /></Link> to your desired workspace. Feel free to change the name of the base or add additional tables or columns.</Text>
  ),
  [Integrations_Enum.Coda]: () => (
    <Box>
      <Text>Copy the <Link href = "https://coda.io/@finta/budget-starter" isExternal>Budget Starter Template <ExternalLinkIcon mx = "2" /></Link></Text>
      <Image 
        src = "/coda-doc-preview.png"
        rounded = "sm"
      />
    </Box>
  ),
  [Integrations_Enum.Google]: () => (
    <Text>Copy the <Link isExternal href = "https://docs.google.com/spreadsheets/d/1vvALZDLcnJ4BXGKmJPBmjXWOA1ws1PtVj8rsUqQBiuY/edit?usp=sharing">Finta Budget Template <ExternalLinkIcon mx = "2px" /></Link> to your desired spreadsheet.</Text>
  ),
  [Integrations_Enum.Notion]: () => (
    <Text>Copy the <Link isExternal href = "https://www.notion.so/finta/Finta-Budget-Template-689da844985c4fe29df9bf9fed003da2">Finta Budget Template <ExternalLinkIcon mx = "2px" /></Link> to your desired workspace.</Text>
  ),
}