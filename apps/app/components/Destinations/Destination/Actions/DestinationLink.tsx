import {
  IconButton
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { DestinationAuthentication, GoogleSheetsAuthentication, AirtableAuthentication } from "~/types/shared/models";
import { Integrations_Enum } from "~/graphql/frontend";

interface DestinationLinkProps {
  authentication: DestinationAuthentication;
  integrationId: string;
}

const getLink = ({ authentication, integrationId }: DestinationLinkProps) => {
  if ( integrationId === Integrations_Enum.Airtable ) {
    const { base_id } = authentication as AirtableAuthentication
    return `https://airtable.com/${base_id}`
  } else if ( integrationId === Integrations_Enum.Coda ) {
    return `https://coda.io`
  } else if ( integrationId === Integrations_Enum.Google ) {
    const { spreadsheetId } = authentication as GoogleSheetsAuthentication;
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0`
  } else if ( integrationId === Integrations_Enum.Notion ) {
    return `https://notion.so`
  }
}

export const DestinationLink = ({ authentication, integrationId }: DestinationLinkProps) => {
  const destinationLink = getLink({ authentication, integrationId });

  return <IconButton 
    aria-label = "Go to destination"
    size = "sm" 
    variant = "ghost" 
    icon = { <ExternalLinkIcon /> } 
    onClick = { () => window.open(destinationLink, '_blank') } 
  />
}