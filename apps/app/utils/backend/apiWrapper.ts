import { NextApiRequest, NextApiResponse } from 'next';
import { Logger } from './logger';

import { graphql } from '~/graphql/backend';
import { flushAnalytics } from './analytics';
import { DestinationModel } from '~/types/backend/models';
import { hash } from '~/utils/backend/crypto';
import { plaidEnvFromVercelEnv, PlaidEnv } from "~/utils/backend/plaid";

type WrappedFunctionResponse = Promise<{ status: number; message: any }>;

export type User = { id: string, displayName: string; email: string, createdAt: string }

export type WrappedFunction = ({ req, logger, user, destination, plaidEnv }: { req: NextApiRequest; logger: Logger; user: User; destination: DestinationModel | null, plaidEnv: PlaidEnv }) => WrappedFunctionResponse;

export const wrapper = (type: 'public' | 'client' | 'oauth', fn: WrappedFunction) => async (req: NextApiRequest, res: NextApiResponse) => {
  const route = req.url;
  const logger = new Logger({ context: { route }});

  logger.info(`${route} request started`, { body: req.body });

  let token: string | undefined;
  if ( ['client', 'oauth'].includes(type) ) {
    const auth = req.headers['authorization'] || '';
    token = auth.split(' ')[1];
    if ( !token ) { 
      logger.info("Missing authorization header", { headers: req.headers });
      await logger.info(`${route} request finished`);
      return res.status(400).send("Invalid authorization header")
    }
  }

  let user = { id: "", displayName: "", email: "", createdAt: "" }

  let destination = null as DestinationModel | null
  if ( type === 'oauth' ) {
    const tokenHash = hash(token!);
    destination = await graphql.GetDestinations({ where: { authentication: { _contains: { access_token_hash: tokenHash }}}})
      .then(response => {
        logger.info("Fetched destination", { tokenHash, response });
        return response.destinations[0] as DestinationModel
      });

    if ( !destination ) { return res.status(500).send("Invalid token")}
    if ( !destination.user.profile.stripeData.hasAppAccess ) { return res.status(402)}

    logger.addContext({ user: destination.user })
  }

  const plaidEnv = destination?.authentication?.is_demo ? "sandbox" : plaidEnvFromVercelEnv

  const { status, message } = await fn({ req, logger, user, destination, plaidEnv })
  .catch(async error => {
    logger.error(error);
    return { status: 500, message: "Internal Error" }
  });

  await flushAnalytics();
  await logger.info(`${route} request finished`, { status, body: message })
  await logger.flush();

  res.setHeader('content-type', 'application/json');
  return res.status(status).send(message);
}