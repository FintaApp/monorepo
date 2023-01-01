import {
  Box,
  Icon,
  Link,
  Text,
  Image
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@radix-ui/react-icons";
import { Integration } from "@prisma/client";

const templateData = {
  [Integration.Airtable]: {
    templateUrl: "https://airtable.com/universe/expj8w5ARVcjz9b2Q/finta-budget-template",
    templateName: "Finta Budget Template",
    noun: "workspace",
    image: null
  },
  [Integration.Coda]: {
    templateUrl: "https://coda.io/@finta/budget-starter",
    templateName: "Budget Starter Template",
    noun: "workspace",
    image:"/coda-doc-preview.png"
  },
  [Integration.Google]: {
    templateUrl: "https://docs.google.com/spreadsheets/d/1vvALZDLcnJ4BXGKmJPBmjXWOA1ws1PtVj8rsUqQBiuY/edit?usp=sharing",
    templateName: "Finta Budget Template",
    noun: "spreadsheet",
    image: null
  },
  [Integration.Notion]: {
    templateUrl: "https://www.notion.so/finta/Finta-Budget-Template-689da844985c4fe29df9bf9fed003da2",
    templateName: "Finta Budget Template",
    noun: "workspace",
    image: null
  }
}

export const CopyTemplate = ({ integration }: { integration: Integration }) => {
  const { templateUrl, noun, image, templateName } = templateData[integration]
  return (
    <Box>
      <Text>Copy the <Link href = { templateUrl } isExternal>{ templateName } <Icon mx = "2" as = { ExternalLinkIcon } /></Link> to your desired {noun}.</Text>
      { image && (
        <Image 
          src = { image }
          rounded = "sm"
        />
      )}
    </Box>
  )
}