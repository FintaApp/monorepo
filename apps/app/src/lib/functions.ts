import axios from "axios";
import { Products } from "plaid";

import { Integrations_Enum } from "src/graphql";
import { nhost } from "src/lib/nhost";
import * as types from "src/types";

const isDemoUser = () => {
  const user = nhost.auth.getUser();
  return user?.email === "demo@finta.io";
}

const getPlaidEnv = () => 
  process.env.VERCEL_ENV === "production" ? "production" : "sandbox"

const client = axios.create({
  baseURL: `${window.location.origin}/api`
});

client.interceptors.request.use(config => {
  const accessToken = nhost.auth.getAccessToken();
  if ( accessToken ) { config.headers = { ...(config.headers || {}), Authorization: `Bearer ${accessToken}`}}
  return config;
});

export const exchangePlaidPublicToken = async ({ publicToken }: { publicToken: string }): Promise<types.ExchangePlaidPublicTokenResponse> => {
  const plaidEnv = isDemoUser() ? "sandbox" : getPlaidEnv();

  return client.post('/plaid/exchangePublicToken', { publicToken, plaidEnv } as types.ExchangePlaidPublicTokenPayload)
  .then(response => response.data)
}

export const createPlaidLinkToken = async ({ products, accessToken, isAccountSelectionEnabled = false }: {
  products: Products[];
  accessToken?: string;
  isAccountSelectionEnabled?: boolean;
}): Promise<types.CreatePlaidLinkTokenResponse> => {
  const plaidEnv = isDemoUser() ? "sandbox" : getPlaidEnv();
  return client.post('/plaid/createLinkToken', { products, originUrl: window.location.origin, plaidEnv, accessToken, isAccountSelectionEnabled } as types.CreatePlaidLinkTokenPayload)
  .then(response => response.data)
}

export const disablePlaidItem = async ({ plaidItemId }: { plaidItemId: string }): Promise<types.DisablePlaidItemResponse> =>
  client.post('/plaid/disableItem', { plaidItemId } as types.DisablePlaidItemPayload)
  .then(response => response.data)

export const disableUser = async () => client.post('/user/disable', {});

export const createSupportTicket = (props: types.CreateSupportTicketPayload): Promise<types.CreateSupportTicketResponse> => 
  client.post('/user/createSupportTicket', props)
  .then(response => response.data)

export const createBillingPortalSession = (props: types.CreateBillingPortalSessionPayload): Promise<types.CreateBillingPortalSessionResponse> =>
  client.post('/stripe/createBillingPortalSession', props)
  .then(response => response.data)

export const createCheckoutPortalSession = (props: types.CreateCheckoutPortalSessionPayload): Promise<types.CreateCheckoutPortalSessionResponse> =>
  client.post('/stripe/createCheckoutPortalSession', props)
  .then(response => response.data)

export const triggerManualDestinationSync = (props: types.ManualDestinationSyncPayload): Promise<types.ManualDestinationSyncResponse> => 
  client.post('/destination/manualSync', props)
  .then(response => response.data)

export const checkDestinationCredentials = (props: types.CheckDestinationCredentialsPayload<Integrations_Enum>): Promise<types.CheckDestinationCredentialsResponse> =>
  client.post('/destination/checkCredentials', props)
  .then(response => response.data)

export const checkDestinationTableConfig = (props: types.CheckDestinationTableConfigPayload<Integrations_Enum>): Promise<types.CheckDestinationTableConfigResponse> =>
  client.post('/destination/checkTableConfig', props)
  .then(response => response.data)

export const getDestinationDefaultConfig = (props: types.GetDestinationTableDefaultConfigPayload<Integrations_Enum>): Promise<types.GetDestinationTableDefaultConfigResponse> =>
  client.post('/destination/getDefaultConfig', props)
  .then(response => response.data)

export const getDestinationTables = (props: types.GetDestinationTablesPayload<Integrations_Enum>): Promise<types.GetDestinationTablesResponse> => 
  client.post('/destination/getTables', props)
  .then(response => response.data)

export const exchangeNotionToken = (props: types.ExchangeNotionTokenPayload): Promise<types.ExchangeNotionTokenResponse> =>
  client.post('/notion/exchangeToken', props)
  .then(response => response.data)

export const createOauthCode = (props: types.CreateCodePayload): Promise<types.CreateCodeResponse> =>
  client.post('/oauth/createCode', props)
  .then(response => response.data)

export const getAccounts = (props: types.GetPlaidAccountsPayload): Promise<types.GetPlaidAccountsResponse> =>
  client.post('/plaid/getAccounts', props)
  .then(response => response.data)