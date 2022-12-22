import { Integration } from "@prisma/client";

import { useDestination } from "../../context";

// import { Airtable } from "./Airtable";
import { Coda } from "./Coda";
import { Google } from "./Google";
import { Notion } from "./Notion";
// import { DestinationAuthentication as DestinationAuthenticationType, AirtableAuthentication, GoogleSheetsAuthentication, NotionAuthentication } from "~/types/shared/models";




// interface DestinationAuthenticationProps { 
//   integration: Integration; 
//   // destinationId?: string; 
//   // authentication: DestinationAuthenticationType; 
//   // onChange?: (newAuthentication: DestinationAuthenticationType) => void; 
//   // errorMessage?: string;
// }

// export const DestinationAuthentication = ({ integration }: DestinationAuthenticationProps) => {
//   if ( integrationId === Integrations_Enum.Airtable ) {
//     return <Airtable destinationId = { destinationId } authentication = { authentication as AirtableAuthentication } onChange = { onChange } errorMessage = { errorMessage } />
//   }

//   if ( integrationId === Integrations_Enum.Google ) {
//     return <Google destinationId = { destinationId } authentication = { authentication as GoogleSheetsAuthentication } onChange = { onChange } errorMessage = { errorMessage } />
//   }

//   if ( integrationId === Integrations_Enum.Notion ) {
//     return <Notion destinationId = { destinationId } authentication = { authentication as NotionAuthentication } onChange = { onChange } errorMessage = { errorMessage } />
//   }
  
//   if ( integration === Integrations_Enum.Coda ) {
//     return <Coda />
//   }
// }

export const DestinationCredentials = () => {
  const { integration } = useDestination();

  if ( integration === Integration.Airtable ) {

  }

  if ( integration === Integration.Coda ) { return <Coda />  }
  if ( integration === Integration.Google ) { return <Google /> }
  if ( integration === Integration.Notion ) { return <Notion />}

  return <></>
}