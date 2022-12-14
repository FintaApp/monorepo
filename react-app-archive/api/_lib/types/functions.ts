import { VercelRequest } from "@vercel/node";
import { StatusCodes } from 'http-status-codes';

import * as shared from "@finta/types";
import { DestinationModel } from "./models";
import { Integrations_Enum } from "../graphql/sdk";

export { StatusCodes }

export type ActionPayload = {
  action: {
    name: "get_customer_subscription" | "get_subscription_prices"
  },
  input: {
    stripe_customer_id?: string;
    product_id?: string;
  },
  session_variables: {
    "x-hasura-user-id"?: string,
    "x-hasura-role": string
  },
  request_query: string;
}

export interface CustomRequest<T> extends VercelRequest {
  body: T
}

export enum ErrorResponseMessages {
  INERNAL_ERROR = "Internal Error",
  HAS_ERROR_ITEM = "User has at least one item in an error state",
  ITEM_NOT_FOUND = "Item not found",
  STRIPE_VERIFICATION_FAILED = "Webhook signature verification failed",
  UNHANDLED_WEBHOOK = "Unhandled Webhook",
  DESTINATION_NOT_FOUND = "Destination not found",
  NO_SUBSCRIPTION = "User does not have an active Finta subscription"
}

export type InternalErrorResponse = {
  status: StatusCodes.INTERNAL_SERVER_ERROR;
  message: ErrorResponseMessages.INERNAL_ERROR
}

export type SuccessResponse<T> = {
  status: StatusCodes;
  message: T
}

export type ErrorResponse = {
  status: StatusCodes;
  message: ErrorResponseMessages;
}

type OauthErrorStateResponse = {
  status: 428;
  message: ErrorResponseMessages.HAS_ERROR_ITEM
}

export type CustomResponse<T> = ErrorResponse | SuccessResponse<T>;
export type OauthFunctionResponse<T> = OauthErrorStateResponse | ErrorResponse | { status: 200, message: T};

export type WrappedPublicFunction = (req: VercelRequest) => Promise<{ status: StatusCodes; message: ErrorResponseMessages | string | object }>;
export type WrappedClientFunction = (req: VercelRequest, user: { id: string, asAdmin?: boolean }) => Promise<{ status: StatusCodes; message: string | object }>
export type WrappedOauthFunction = (req: VercelRequest, destination: DestinationModel, plaidEnv: string, asAdmin?: boolean ) => Promise<{ status: StatusCodes; message: string | object }>

/* Shared Types */
export type GetPlaidAccountsRequest = CustomRequest<shared.GetPlaidAccountsPayload>;
export type GetPlaidAccountsResponse = CustomResponse<shared.GetPlaidAccountsResponse>;

export type GetPlaidLinkTokenRequest = CustomRequest<shared.CreatePlaidLinkTokenPayload>;
export type GetPlaidLinkTokenResponse = CustomResponse<shared.CreatePlaidLinkTokenResponse>;

export type ExchangePlaidPublicTokenRequest = CustomRequest<shared.ExchangePlaidPublicTokenPayload>;
export type ExchangePlaidPublicTokenResponse = CustomResponse<shared.ExchangePlaidPublicTokenResponse>;

export type DisablePlaidItemRequest = CustomRequest<shared.DisablePlaidItemPayload>;
export type DisablePlaidItemResponse = CustomResponse<shared.DisablePlaidItemResponse>;

export type DisableUserRequest = CustomRequest<shared.DisableUserPayload>;
export type DisableUserResponse = CustomResponse<shared.DisableUserResponse>;

export type ManualDestinationSyncRequest = CustomRequest<shared.ManualDestinationSyncPayload>;
export type ManualDestinationSyncResponse = CustomResponse<shared.ManualDestinationSyncResponse>;

export type CreateSupportTicketRequest = CustomRequest<shared.CreateSupportTicketPayload>;
export type CreateSupportTicketResponse = CustomResponse<shared.CreateSupportTicketResponse>;

export type CreateBillingPortalSessionRequest = CustomRequest<shared.CreateBillingPortalSessionPayload>;
export type CreateBillingPortalSessionResponse = CustomResponse<shared.CreateBillingPortalSessionResponse>;

export type CreateCheckoutPortalSessionRequest = CustomRequest<shared.CreateCheckoutPortalSessionPayload>;
export type CreateCheckoutPortalSessionResponse = CustomResponse<shared.CreateCheckoutPortalSessionResponse>;

export type CheckDestinationCredentialsRequest = CustomRequest<shared.CheckDestinationCredentialsPayload<Integrations_Enum>>;
export type CheckDestinationCredentialsResponse = CustomResponse<shared.CheckDestinationCredentialsResponse>;

export type GetDestinationTableDefaultConfigRequest = CustomRequest<shared.GetDestinationTableDefaultConfigPayload<Integrations_Enum>>;
export type GetDestinationTableDefaultConfigResponse = CustomResponse<shared.GetDestinationTableDefaultConfigResponse>;

export type GetDestinationTablesRequest = CustomRequest<shared.GetDestinationTablesPayload<Integrations_Enum>>;
export type GetDestinationTablesResponse = CustomResponse<shared.GetDestinationTablesResponse>;

export type ExchangeNotionTokenRequest = CustomRequest<shared.ExchangeNotionTokenPayload>;
export type ExchangeNotionTokenResponse = CustomResponse<shared.ExchangeNotionTokenResponse>;

export type CreateCodeRequest = CustomRequest<shared.CreateCodePayload>;
export type CreateCodeResponse = CustomResponse<shared.CreateCodeResponse>;