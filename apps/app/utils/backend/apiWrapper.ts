import { NextApiRequest, NextApiResponse } from 'next';
import { Logger } from './logger';

import { GetUserFromToken } from '~/graphql/backend/sdk';
import { flushAnalytics } from './analytics';
import { nhost } from '~/utils/nhost';

type WrappedFunctionResponse = Promise<{ status: number; message: any }>;

type User = { id: string, displayName: string; email: string, createdAt: string }

export type WrappedFunction = ({ req, logger, user }: { req: NextApiRequest; logger: Logger; user: User}) => WrappedFunctionResponse;

export const wrapper = (type: 'public' | 'client', fn: WrappedFunction) => async (req: NextApiRequest, res: NextApiResponse) => {
  const route = req.url;
  const logger = new Logger({ context: { route }});

  logger.info(`${route} request started`, { body: req.body });

  let token: string | undefined;
  if ( ['client'].includes(type) ) {
    const auth = req.headers['authorization'] || '';
    token = auth.split(' ')[1];
    if ( !token ) { 
      logger.info("Missing authorization header", { headers: req.headers });
      await logger.info(`${route} request finished`);
      return res.status(400).send("Invalid authorization header")
    }
  }

  let user = { id: "", displayName: "", email: "", createdAt: "" }
  if ( type === 'client' ) {
    const { data, error } = await nhost.graphql.request(GetUserFromToken, {}, { headers: { Authorization: `Bearer ${token}` }});
    if ( error ) {
      logger.error(new Error("Error getting user from token"), { error });
      await logger.info(`${route} request finished`);
      return res.status(500).send("Internal Error")
    }
    if ( data.users.length === 0 ) {
      logger.info("User not found")
      await logger.info(`${route} request finished`);
      return res.status(400).send("Unauthorized")
    }

    user = data.users[0]
    logger.addContext({ user })
  }


  const { status, message } = await fn({ req, logger, user })
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