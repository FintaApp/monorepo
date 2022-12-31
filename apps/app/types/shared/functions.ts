import { Products, LinkTokenCreateResponse, ItemPublicTokenExchangeResponse } from "plaid"
import { DestinationAuthentication, DestinationError, DestinationErrorCode, TableConfig, TableConfigs, DestinationTableTypes, DestinationFieldType } from "./models";
import { Integrations_Enum } from "~/graphql/frontend";

export type CreateBillingPortalSessionPayload = {
  returnUrl: string;
}

export type CreateBillingPortalSessionResponse = {
  id: string;
  url: string;
}

export type CreateCheckoutPortalSessionPayload = {
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}

export type CreateCheckoutPortalSessionResponse = {
  id: string;
  url: string | null;
}

export type GetDestinationTablesPayload = {
  integrationId: Integrations_Enum;
  authentication: DestinationAuthentication,
}

export type GetDestinationTablesResponse = {
  tables: {
    tableId: string;
    name: string;
    fields: {
      fieldId: string;
      name: string;
      type?: DestinationFieldType
    }[]
  }[]
}

export type ValidateDestinationTableConfigsPayload = {
  integrationId: Integrations_Enum,
  authentication: DestinationAuthentication,
  tableConfigs: TableConfigs
}

export type ValidateDestinationTableConfigsResponse = {
  isValid: boolean;
  errors?: DestinationError[]
}

export type GetDestinationTableDefaultConfigPayload = {
  integrationId: Integrations_Enum;
  authentication: DestinationAuthentication,
}

export type GetDestinationTableDefaultConfigResponse = {
  tableConfigs: TableConfigs
}

export type DisablePlaidItemPayload = {
  plaidItemId: string;
}

export type DisablePlaidItemResponse = "OK";

export type ExchangePlaidPublicTokenPayload = {
  publicToken: string;
}

export type ExchangePlaidPublicTokenResponse = ItemPublicTokenExchangeResponse;

export type CreateCodePayload = {
  clientId: string;
}

export type CreateCodeResponse = {
  code: string;
  accessTokenHash: string;
}

export type ManualDestinationSyncPayload = {
  destinationId: string;
  startDate: string;
  endDate: string;
}

export type ManualDestinationSyncResponse = {
  sync_start_date?: string;
  has_error?: boolean;
}

export type CreateSupportTicketPayload = {
  subject: string;
  body: string;
}

export type CreateSupportTicketResponse = string;


export type ExchangeNotionTokenPayload = {
  code: string;
  redirectUri: string;
}

export type ExchangeNotionTokenResponse = "OK"

export type ValidateDestinationCredentialsPayload = {
  integrationId: Integrations_Enum,
  authentication: DestinationAuthentication
}
export type ValidateDestinationCredentialsResponse = { isValid: boolean; errorCode?: DestinationErrorCode, message?: string }

export type GetAirtableBasesPayload = {}
export type GetAirtableBasesResponse = {
  bases: {
    id: string;
    name: string;
  }[]
}