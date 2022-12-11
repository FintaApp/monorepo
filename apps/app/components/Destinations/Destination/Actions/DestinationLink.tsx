import {
  IconButton
} from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";

import { DestinationModel } from "~/types/frontend";
import { AirtableCredentials, GoogleSheetsCredentials } from "~/types/shared/models";
import { Integrations_Enum } from "~/graphql/frontend";

const getLink = (destination: DestinationModel) => {
  if ( destination.integration_id === Integrations_Enum.Airtable ) {
    const { base_id } = destination.authentication as AirtableCredentials;
    return `https://airtable.com/${base_id}`
  } else if ( destination.integration_id === Integrations_Enum.Coda ) {
    return `https://coda.io`
  } else if ( destination.integration_id === Integrations_Enum.Google ) {
    const { spreadsheetId } = destination.authentication as GoogleSheetsCredentials;
    return `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit#gid=0`
  } else if ( destination.integration_id === Integrations_Enum.Notion ) {
    return `https://notion.so`
  }
}

export const DestinationLink = ({ destination }: { destination: DestinationModel }) => {
  const destinationLink = getLink(destination);

  return <IconButton 
    aria-label = "Go to destination"
    size = "sm" 
    variant = "ghost" 
    icon = { <ExternalLinkIcon /> } 
    onClick = { () => window.open(destinationLink, '_blank') } 
  />
}