import { Integrations_Enum } from "src/graphql";
import { DestinationModel } from "src/types";

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