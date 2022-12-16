import { Airtable, Google, Notion } from "./integrations";
import { Integrations_Enum } from "~/graphql/backend/sdk";
import { AirtableAuthentication, GoogleSheetsAuthentication, NotionAuthentication, DestinationAuthentication } from "~/types/shared/models";
import { Logger } from "./logger";

export const getDestinationObject = ({ integrationId, authentication, logger, userId }: { userId: string; integrationId: Integrations_Enum; authentication: DestinationAuthentication; logger: Logger }) => {
  if ( integrationId === Integrations_Enum.Airtable ) { return new Airtable({ userId, logger, authentication: authentication as AirtableAuthentication })};
  if ( integrationId === Integrations_Enum.Google ) { return new Google({ userId, logger, authentication: authentication as any as GoogleSheetsAuthentication }) };
  if ( integrationId === Integrations_Enum.Notion ) { return new Notion({ userId, logger, authentication: authentication as any as NotionAuthentication }) };
}