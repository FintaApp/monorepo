import { Destination, PlaidItem, PlaidAccount, DestinationTableConfig, AirtableCredential, GoogleSheetsCredential, NotionCredential, DestinationFieldConfig, PlaidInstitution } from "@prisma/client";

export type Destinations = (Destination & { 
  airtableCredential: AirtableCredential | null;
  googleSheetsCredential: GoogleSheetsCredential | null;
  notionCredential: NotionCredential | null;
  accounts: PlaidAccount[];
  tableConfigs: (DestinationTableConfig & { fieldConfigs: DestinationFieldConfig[] })[];
})[]

export type Item = PlaidItem & {
  accounts: PlaidAccount[];
  institution: PlaidInstitution;
}