import { Integration, AirtableCredential, GoogleSheetsCredential, NotionCredential } from "@prisma/client";

import { DestinationCredential } from "~/types/shared/models";
import { Google } from "./google";
import { Notion } from "./notion";

export const getDestinationObject = ({ integration, credentials, userId }: { userId: string; integration: Integration; credentials: DestinationCredential  }) => {
  //if ( integration === Integration.Airtable ) { return new Airtable({ userId, logger, authentication: authentication as AirtableAuthentication })};
  if ( integration === Integration.Google ) { return new Google({ userId, credentials: credentials as GoogleSheetsCredential }) };
  if ( integration === Integration.Notion ) { return new Notion({ userId, credentials: credentials as NotionCredential }) };
}