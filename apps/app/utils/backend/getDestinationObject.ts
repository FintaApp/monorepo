import { Airtable, Google, Notion } from "./integrations";
import { Integrations_Enum } from "~/graphql/backend/sdk";
import { DestinationModel } from "~/types/backend/models";
import { AirtableCredentials, GoogleSheetsCredentials, NotionCredentials } from "~/types/shared/models";
import { CheckDestinationCredentialsPayload } from "~/types/shared/functions"

type Credentials = CheckDestinationCredentialsPayload['credentials'];

export const getDestinationObject = ({ destination, integrationId, credentials }: { destination?: DestinationModel; integrationId?: Integrations_Enum; credentials?: Credentials }) => {
  if ( destination?.integration.id === Integrations_Enum.Airtable || integrationId === Integrations_Enum.Airtable ) { return new Airtable({ destination, credentials: credentials as AirtableCredentials })};
  if ( destination?.integration.id === Integrations_Enum.Google || integrationId === Integrations_Enum.Google ) { return new Google({ destination, credentials: credentials as any as GoogleSheetsCredentials }) };
  if ( destination?.integration.id === Integrations_Enum.Notion || integrationId === Integrations_Enum.Notion ) { return new Notion({ destination, credentials: credentials as any as NotionCredentials }) };
}