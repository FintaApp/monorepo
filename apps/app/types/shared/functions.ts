import { Products, LinkTokenCreateResponse, ItemPublicTokenExchangeResponse } from "plaid"
import { DestinationCredentials, DestinationError, DestinationErrorCode, TableConfig, TableConfigs, DestinationTableTypes, DestinationFieldTypes } from "./models";
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

export type CheckDestinationCredentialsPayload = {
  integrationId: Integrations_Enum,
  credentials: DestinationCredentials,
}

export type CheckDestinationCredentialsResponse = {
  isValid: boolean;
  errorCredential?: 'base_id' | 'api_key' | 'access_token';
  errorCode?: DestinationErrorCode
}

export type GetDestinationTablesPayload = {
  integrationId: Integrations_Enum;
  credentials: DestinationCredentials,
}

export type GetDestinationTablesResponse = {
  tables: {
    tableId: string;
    name: string;
    fields: {
      fieldId: string;
      name: string;
      type?: DestinationFieldTypes
    }[]
  }[]
}

export type CheckDestinationTableConfigPayload = {
  integrationId: Integrations_Enum,
  credentials: DestinationCredentials,
  dataType: DestinationTableTypes;
  tableId: string;
  fields: TableConfig['fields']
}

export type CheckDestinationTableConfigResponse = {
  isValid: boolean;
  error?: DestinationError
}

export type GetDestinationTableDefaultConfigPayload = {
  integrationId: Integrations_Enum;
  credentials: DestinationCredentials,
}

export type GetDestinationTableDefaultConfigResponse = {
  tableConfigs: TableConfigs
}

export type CreatePlaidLinkTokenPayload = {
  accessToken?: string;
  products: Products[];
  originUrl: string;
  isAccountSelectionEnabled?: boolean
}

export type CreatePlaidLinkTokenResponse = LinkTokenCreateResponse;

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