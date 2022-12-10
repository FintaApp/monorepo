import { graphql } from "../graphql";
import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as crypto from "../crypto";
import { WrappedOauthFunction } from "../types";
import { Sentry } from "../sentry";
import * as logsnag from "../logsnag";
import { plaidEnvFromVercelEnv } from "../plaid";

export const oauthFunctionWrapper = (fn: WrappedOauthFunction) => async (req: VercelRequest, res: VercelResponse) => {
  const transaction = Sentry.startTransaction({ op: "wrapper", name: "client function"});
  const scope = new Sentry.Scope();

  const auth = req.headers['authorization'];
  if ( !auth ) { return res.status(500).send("Missing authorization header"); }
  let token: string;
  let tokenHash: string;
  try {
    token = auth.split(' ')[1]
    tokenHash = crypto.hash(token);
  } catch ( error ) {
    return res.status(500).send("Invalid authorization header");
  }

  const destination = await graphql.GetDestinations({ where: { authentication: { _contains: { access_token_hash: tokenHash }}}}).then(response => response.destinations[0]);

  if ( !destination ) { return res.status(500).send("Invalid token")}
  if ( !destination.user.stripeData.hasAppAccess ) { return res.status(402)}

  const asAdmin = false;
  const authentication = destination.authentication || {};
  const plaidEnv = authentication.is_demo ? "sandbox" : plaidEnvFromVercelEnv as string;
  const { status, message } = await fn(req, destination, plaidEnv, asAdmin)
  .catch(async error => {
    await logsnag.logError({ error, operation: "client function", scope })
    return { status: 500, message: "Internal Error" }
  })

  transaction.finish();
  await Sentry.flush(1000);
  res.setHeader('content-type', 'application/json')
  return res.status(status).send(message)
};