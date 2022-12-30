import axios from "axios";
import { Products } from "plaid";

import { nhost } from "../nhost";
import * as functionTypes from "~/types/shared/functions";

const isDemoUser = () => {
  const user = nhost.auth.getUser();
  return user?.email === "demo@finta.io";
}

const client = axios.create({
  baseURL: `/api`
});

client.interceptors.request.use(config => {
  const accessToken = nhost.auth.getAccessToken();
  if ( accessToken ) { config.headers = { ...(config.headers || {}), Authorization: `Bearer ${accessToken}`}}
  return config;
});
  
export const exchangePlaidPublicToken = async ({ publicToken }: { publicToken: string }) => {
  const plaidEnv = isDemoUser() ? "sandbox" : undefined;

  return client.post('/plaid/exchangePublicToken', { publicToken, plaidEnv } as functionTypes.ExchangePlaidPublicTokenPayload)
  .then(response => response.data as functionTypes.ExchangePlaidPublicTokenResponse)
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

export const validateDestinationAuthentication = (props: functionTypes.ValidateDestinationCredentialsPayload) =>
  client.post('/destination/validateAuthentication', props)
  .then(response => response.data as functionTypes.ValidateDestinationCredentialsResponse)

export const validateDestinationTableConfigs = (props: functionTypes.ValidateDestinationTableConfigsPayload) =>
  client.post('/destination/validateTableConfigs', props)
  .then(response => response.data as functionTypes.ValidateDestinationTableConfigsResponse)

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

export const getAirtableAuthorizationUrl = (props: functionTypes.GetAirtableAuthorizationUrlPayload) =>
  client.post('/airtable/getAuthorizationUrl', props)
  .then(response => response.data as functionTypes.GetAirtableAuthorizationUrlResponse)

export const exchangeAirtableToken = (props: functionTypes.ExchangeAirtableTokenPayload) =>
  client.post('/airtable/exchangeToken', props)
  .then(response => response.data as functionTypes.ExchangeAirtableTokenResponse)

export const getAirtableBases = (props: functionTypes.GetAirtableBasesPayload) =>
  client.post('/airtable/getBases', props)
  .then(response => response.data as functionTypes.GetAirtableBasesResponse)