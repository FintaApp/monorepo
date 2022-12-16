import axios from "axios";
import moment from "moment-timezone";

import { graphql } from "~/graphql/backend";
import { ExchangeAirtableTokenPayload, ExchangeAirtableTokenResponse } from "~/types/shared/functions";
import { wrapper } from "~/utils/backend/apiWrapper";
import { getAuthorizationHeader } from "~/utils/backend/integrations/airtable/_helpers";

export default wrapper('client', async function handler({ req, user, logger }) {
  const { code, redirectUri, state } = req.body as ExchangeAirtableTokenPayload;

  const authorizationCache = await graphql.GetUser({ userId: user.id })
    .then(response => {
      logger.info("User fetched", { response });
      return response.user!.metadata.airtableAuthorizationCache
    });
  
  const cached = authorizationCache[state];
  if ( !cached ) {
    return { status: 400, message: "Invalid request" }
  }

  await graphql.UpdateUser({ userId: user.id, _delete_key: { metadata: 'airtableAuthorizationCache' }})
    .then(() => logger.info("Deleted airtableAuthorizationCache from user's metadata"))
  
  const codeVerifier = cached.codeVerifier;

  await axios.post(`https://www.airtable.com/oauth2/v1/token`, {
    code_verifier: codeVerifier,
    redirect_uri: redirectUri,
    code,
    grant_type: 'authorization_code'
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Authorization': getAuthorizationHeader()
    }
  })
  .then(async ({ data }) => {
    logger.info("Airtable oauth2 token response", { data });
    return graphql.InsertAirtableToken({ token: {
      userId: user.id,
      accessToken: data.access_token,
      refreshToken: data.refresh_token,
      tokenType: data.token_type,
      scope: data.scope,
      accessTokenExpiresAt: moment().add(parseInt(data.expires_in), 'seconds').toDate(),
      refreshTokenExpiresAt: moment().add(parseInt(data.refresh_expires_in), 'seconds').toDate()
    }});
  })

  return { status: 200, message: "OK" as ExchangeAirtableTokenResponse }
});