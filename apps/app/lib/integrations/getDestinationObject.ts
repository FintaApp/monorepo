import { Integration } from "@prisma/client";
import { z } from "zod";

import { AirtableCredential, GoogleSheetsCredential, NotionCredential, DestinationCredential } from "~/types/shared/models";
import { Google } from "./google";

export const getDestinationObject = ({ integration, credentials, userId }: { userId: string; integration: Integration; credentials: DestinationCredential  }) => {
  //if ( integration === Integration.Airtable ) { return new Airtable({ userId, logger, authentication: authentication as AirtableAuthentication })};
  if ( integration === Integration.Google ) { return new Google({ userId, credentials: credentials as GoogleSheetsCredential }) };
  //if ( integration === Integration.Notion ) { return new Notion({ userId, logger, authentication: authentication as any as NotionAuthentication }) };
}