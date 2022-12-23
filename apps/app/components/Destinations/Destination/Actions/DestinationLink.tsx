import {
  IconButton
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { useDestination } from "../../context";
import { Integration } from "@prisma/client";

const getLink = ({ airtableBaseId, googleSpreadsheetId, integration }: { googleSpreadsheetId?: string; airtableBaseId?: string; integration: Integration}) => {
  if ( integration === Integration.Airtable ) { return `https://airtable.com/${airtableBaseId}` } 
  if ( integration === Integration.Coda ) { return `https://coda.io`}
  if ( integration === Integration.Google ) { return `https://docs.google.com/spreadsheets/d/${googleSpreadsheetId}/edit#gid=0`} 
  if ( integration === Integration.Notion ) { return `https://notion.so`}
}

export const DestinationLink = () => {
  const { integration, googleSpreadsheetId, airtableBaseId } = useDestination();
  const destinationLink = getLink({ airtableBaseId, googleSpreadsheetId, integration });

  return <IconButton 
    aria-label = "Go to destination"
    size = "sm" 
    variant = "ghost" 
    icon = { <ExternalLinkIcon /> } 
    onClick = { () => window.open(destinationLink, '_blank') } 
  />
}