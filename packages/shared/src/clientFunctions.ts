import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";

import { AccountsGetResponse, ItemPublicTokenExchangeResponse, Products, LinkTokenCreateResponse } from "plaid";

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


export type ExchangeNotionTokenPayload = {
  userId: string;
  code: string;
  redirectUri: string;
}

export type ExchangeNotionTokenResponse = "OK"