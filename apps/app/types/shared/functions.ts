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

export type GetDestinationTableDefaultConfigPayload = {
  integrationId: Integrations_Enum;
  credentials: DestinationCredentials,
}

export type GetDestinationTableDefaultConfigResponse = {
  tableConfigs: TableConfigs
}