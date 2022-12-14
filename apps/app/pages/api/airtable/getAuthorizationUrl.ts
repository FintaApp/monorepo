// Source: https://github.com/Airtable/oauth-example/blob/main/index.js
import crypto from "crypto";

import { graphql } from "~/graphql/backend";
import { GetAirtableAuthorizationUrlPayload, GetAirtableAuthorizationUrlResponse } from "~/types/shared/functions";
import { wrapper } from "~/utils/backend/apiWrapper";

const redirectUriByEnv = {
  production: 'https://app.finta.io/auth/airtable',
  preview: 'https://staging.app.finta.io/auth/airtable',
  development: 'http://localhost:3000/auth/airtable'
}

export default wrapper('client', async function handler({ req, user, logger }) {
  const {} = req.body as GetAirtableAuthorizationUrlPayload;
  const state = crypto.randomBytes(100).toString('base64url');
  const codeVerifier = crypto.randomBytes(96).toString('base64url');
  const codeChallengeMethod = 'S256'
  const codeChallenge = crypto
        .createHash('sha256')
        .update(codeVerifier) // hash the code verifier with the sha256 algorithm
        .digest('base64') // base64 encode, needs to be transformed to base64url
        .replace(/=/g, '') // remove =
        .replace(/\+/g, '-') // replace + with -
        .replace(/\//g, '_'); // replace / with _ now base64url encoded
  const authorizationCache = { [state]: { codeVerifier }}

  await graphql.UpdateUser({ userId: user.id, _append: { metadata: { airtableAuthorizationCache: authorizationCache }}})
  .then(response => {
    logger.info("Added authorization cache to user's metata", { response });
  });

  const authorizationUrl = new URL(`https://www.airtable.com/oauth2/v1/authorize`);
  authorizationUrl.searchParams.set('code_challenge', codeChallenge);
  authorizationUrl.searchParams.set('code_challenge_method', codeChallengeMethod);
  authorizationUrl.searchParams.set('state', state);
  authorizationUrl.searchParams.set('client_id', process.env.AIRTABLE_OAUTH_CLIENT_ID );
  authorizationUrl.searchParams.set('redirect_uri', redirectUriByEnv[process.env.VERCEL_ENV || 'production']);
  authorizationUrl.searchParams.set('response_type', 'code');
  authorizationUrl.searchParams.set('scope', 'data.records:read data.records:write schema.bases:read schema.bases:write');

  return { status: 200, message: { url: authorizationUrl.toString() } as GetAirtableAuthorizationUrlResponse}
});