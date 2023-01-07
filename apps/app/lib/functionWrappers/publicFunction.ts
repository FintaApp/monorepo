import crypto from "crypto";
import { withAxiom, AxiomAPIRequest, Logger } from 'next-axiom';
import { NextApiResponse } from "next";

import { logError } from "../logsnag";

type WrappedFunctionResponse = Promise<{ status: number; message: any }>;
type WrappedFunction = ({ req, logger }: { req: AxiomAPIRequest; logger: Logger }) => WrappedFunctionResponse;

export const publicFunctionWrapper = (fn: WrappedFunction) => withAxiom(async (req: AxiomAPIRequest, res: NextApiResponse ) => {
  const route = req.url;
  const requestId = crypto.randomUUID();
  const logger = req.log.with({ requestId });
  logger.info(`${route} request started`, { body: req.body });

  const { status, message } = await fn({ req, logger })
    .catch(async error => {
      logger.error(error);
      logError({ error, logRequestId: requestId});
      return { status: 500, message: "Internal Error"}
    });
  
  logger.info(`${route} request finished`, { status, body: message });
  res.setHeader('content-type', 'application/json');
  return res.status(status).send(message);
})