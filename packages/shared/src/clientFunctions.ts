import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { AccountsGetResponse, ItemPublicTokenExchangeResponse, Products, LinkTokenCreateResponse } from "plaid";
import { DestinationError, DestinationCredentials, DestinationTableTypes, TableConfig, TableConfigs, DestinationErrorCode } from './models';

export type FieldType = DatabaseObjectResponse['properties'][keyof DatabaseObjectResponse['properties']]['type'];

export type GetPlaidAccountsPayload = {
  accessToken: string;
};

export type GetPlaidAccountsResponse = {
  accounts: AccountsGetResponse['accounts'];
}

export type CreatePlaidLinkTokenPayload = {
  accessToken?: string;
  products: Products[];
  originUrl: string;
  plaidEnv: string;
  isAccountSelectionEnabled?: boolean
}

export type CreatePlaidLinkTokenResponse = LinkTokenCreateResponse;

export type ExchangePlaidPublicTokenPayload = {
  publicToken: string;
  plaidEnv: string;
}

export type ExchangePlaidPublicTokenResponse = ItemPublicTokenExchangeResponse;

export type DisablePlaidItemPayload = {
  plaidItemId: string;
}

export type DisablePlaidItemResponse = "OK";

export type DisableUserPayload = {}

export type DisableUserResponse = "OK";

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

export type CheckDestinationCredentialsPayload<IntegrationIdType> = {
  integrationId: IntegrationIdType,
  credentials: DestinationCredentials,
}

export type CheckDestinationCredentialsResponse = {
  isValid: boolean;
  errorCredential?: 'base_id' | 'api_key' | 'access_token';
  errorCode?: DestinationErrorCode
}

export type CheckDestinationTableConfigPayload<IntegrationIdType> = {
  integrationId: IntegrationIdType,
  credentials: DestinationCredentials,
  dataType: DestinationTableTypes;
  tableId: string;
  fields: TableConfig['fields']
}

export type CheckDestinationTableConfigResponse = {
  isValid: boolean;
  error?: DestinationError
}

export type GetDestinationTableDefaultConfigPayload<IntegrationIdType> = {
  integrationId: IntegrationIdType;
  credentials: DestinationCredentials,
}

export type GetDestinationTableDefaultConfigResponse = {
  tableConfigs: TableConfigs
}

export type GetDestinationTablesPayload<IntegrationIdType> = {
  integrationId: IntegrationIdType;
  credentials: DestinationCredentials,
}

export type GetDestinationTablesResponse = {
  tables: {
    tableId: string;
    name: string;
    fields: {
      fieldId: string;
      name: string;
      type?: FieldType
    }[]
  }[]
}

export type ExchangeNotionTokenPayload = {
  userId: string;
  code: string;
  redirectUri: string;
}

export type ExchangeNotionTokenResponse = "OK"