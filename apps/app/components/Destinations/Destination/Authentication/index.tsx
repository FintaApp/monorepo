import { Integrations_Enum } from "~/graphql/frontend";
import { DestinationModel } from "~/types/frontend";

import { AirtableAuthentication } from "./AirtableAuthentication";
import { Google } from "./Google";
import { Notion } from "./Notion";

export const DestinationAuthentication = ({ destination }: { destination: DestinationModel }) => {
  const integrationId = destination.integration_id;
  if ( integrationId === Integrations_Enum.Airtable ) {
    return <AirtableAuthentication destination = { destination } />
  }

  if ( integrationId === Integrations_Enum.Google ) {
    return <Google destination = { destination } />
  }

  if ( integrationId === Integrations_Enum.Notion ) {
    return <Notion destination = { destination } />
  }
  
  return <></>;
}