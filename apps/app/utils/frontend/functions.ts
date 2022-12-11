import axios from "axios";
import { Products } from "plaid";

import { nhost } from "../nhost";
import * as functionTypes from "~/types/shared/functions";

const isDemoUser = () => {
  const user = nhost.auth.getUser();
  return user?.email === "demo@finta.io";
}

const getPlaidEnv = () => 
  ['development', 'preview'].includes(process.env.VERCEL_ENV || "") ? "sandbox" : "production"

const client = axios.create({
  baseURL: `/api`
});

client.interceptors.request.use(config => {
  const accessToken = nhost.auth.getAccessToken();
  if ( accessToken ) { config.headers = { ...(config.headers || {}), Authorization: `Bearer ${accessToken}`}}
  return config;
});

export const disableUser = async () => client.post('/user/disable', {});

export const createBillingPortalSession = (props: functionTypes.CreateBillingPortalSessionPayload) =>
  client.post('/stripe/createBillingPortalSession', props)
  .then(response => response.data as functionTypes.CreateBillingPortalSessionResponse)

export const createCheckoutPortalSession = (props: functionTypes.CreateCheckoutPortalSessionPayload) =>
  client.post('/stripe/createCheckoutPortalSession', props)
  .then(response => response.data as functionTypes.CreateCheckoutPortalSessionResponse)
  
export const exchangePlaidPublicToken = async ({ publicToken }: { publicToken: string }) => {
  const plaidEnv = isDemoUser() ? "sandbox" : getPlaidEnv();

  return client.post('/plaid/exchangePublicToken', { publicToken, plaidEnv } as functionTypes.ExchangePlaidPublicTokenPayload)
  .then(response => response.data as functionTypes.ExchangePlaidPublicTokenResponse)
}

export const createPlaidLinkToken = async ({ products, accessToken, isAccountSelectionEnabled = false }: {
  products: Products[];
  accessToken?: string;
  isAccountSelectionEnabled?: boolean;
}): Promise<functionTypes.CreatePlaidLinkTokenResponse> => {
  const plaidEnv = isDemoUser() ? "sandbox" : getPlaidEnv();
  return client.post('/plaid/createLinkToken', { products, originUrl: window.location.origin, plaidEnv, accessToken, isAccountSelectionEnabled } as functionTypes.CreatePlaidLinkTokenPayload)
  .then(response => response.data)
}

export const disablePlaidItem = async ({ plaidItemId }: { plaidItemId: string }) =>
  client.post('/plaid/disableItem', { plaidItemId } as functionTypes.DisablePlaidItemPayload)
  .then(response => response.data as functionTypes.DisablePlaidItemResponse)

export const createSupportTicket = (props: functionTypes.CreateSupportTicketPayload) => 
  client.post('/user/createSupportTicket', props)
  .then(response => response.data as functionTypes.CreateSupportTicketResponse)

export const triggerManualDestinationSync = (props: functionTypes.ManualDestinationSyncPayload) => 
  client.post('/destination/manualSync', props)
  .then(response => response.data as functionTypes.ManualDestinationSyncResponse)

export const checkDestinationCredentials = (props: functionTypes.CheckDestinationCredentialsPayload) =>
  client.post('/destination/checkCredentials', props)
  .then(response => response.data as functionTypes.CheckDestinationCredentialsPayload)

export const checkDestinationTableConfig = (props: functionTypes.CheckDestinationTableConfigPayload) =>
  client.post('/destination/checkTableConfig', props)
  .then(response => response.data as functionTypes.CheckDestinationTableConfigResponse)

export const getDestinationDefaultConfig = (props: functionTypes.GetDestinationTableDefaultConfigPayload) =>
  client.post('/destination/getDefaultConfig', props)
  .then(response => response.data as functionTypes.GetDestinationTableDefaultConfigResponse)

export const getDestinationTables = (props: functionTypes.GetDestinationTablesPayload) => 
  client.post('/destination/getTables', props)
  .then(response => response.data as functionTypes.GetDestinationTablesResponse)

export const exchangeNotionToken = (props: functionTypes.ExchangeNotionTokenPayload) =>
  client.post('/notion/exchangeToken', props)
  .then(response => response.data as functionTypes.ExchangeNotionTokenResponse)

export const createOauthCode = (props: functionTypes.CreateCodePayload) =>
  client.post('/oauth/createCode', props)
  .then(response => response.data as functionTypes.CreateCodeResponse)