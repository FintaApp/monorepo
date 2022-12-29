import { Integrations_Enum } from "~/graphql/frontend";

import { Airtable } from "./Airtable";
import { Coda } from "./Coda";
import { Google } from "./Google";
import { Notion } from "./Notion";
import { DestinationAuthentication as DestinationAuthenticationType, AirtableAuthentication, GoogleSheetsAuthentication, NotionAuthentication } from "~/types/shared/models";

interface DestinationAuthenticationProps { 
  integrationId: Integrations_Enum; 
  destinationId?: string; 
  authentication: DestinationAuthenticationType; 
  onChange?: (newAuthentication: DestinationAuthenticationType) => void; 
  errorMessage?: string;
}

export const DestinationAuthentication = ({ destinationId, authentication, integrationId, onChange, errorMessage }: DestinationAuthenticationProps) => {
  if ( integrationId === Integrations_Enum.Airtable ) {
    return <Airtable destinationId = { destinationId } authentication = { authentication as AirtableAuthentication } onChange = { onChange } errorMessage = { errorMessage } />
  }

  if ( integrationId === Integrations_Enum.Google ) {
    return <Google destinationId = { destinationId } authentication = { authentication as GoogleSheetsAuthentication } onChange = { onChange } errorMessage = { errorMessage } />
  }

  if ( integrationId === Integrations_Enum.Notion ) {
    return <Notion destinationId = { destinationId } authentication = { authentication as NotionAuthentication } onChange = { onChange } errorMessage = { errorMessage } />
  }
  
  if ( integrationId === Integrations_Enum.Coda ) {
    return <Coda />
  }

  return <></>
}