import axios from "axios";

import { nhost } from "../nhost";
import * as functionTypes from "~/types/shared/functions";

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