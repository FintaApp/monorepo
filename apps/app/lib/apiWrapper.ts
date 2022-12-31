import crypto from "crypto";
import { NextApiResponse } from "next"
import { Logger } from "next-axiom";
import { withAxiom, AxiomAPIRequest } from 'next-axiom';

type WrappedFunctionResponse = Promise<{ status: number; message: any }>;
type WrappedFunction = ({ req, logger }: { req: AxiomAPIRequest; logger: Logger }) => WrappedFunctionResponse;

export const wrapper = (fn: WrappedFunction) => withAxiom(async (req: AxiomAPIRequest, res: NextApiResponse ) => {
  const route = req.url;
  const requestId = crypto.randomUUID();
  const logger = req.log.with({ requestId });
  logger.info(`${route} request started`, { body: req.body });

  const { status, message } = await fn({ req, logger })
    .catch(async error => {
      logger.error(error);
      return { status: 500, message: "Internal Error"}
    });
  
  logger.info(`${route} request finished`, { status, body: message });
  res.setHeader('content-type', 'application/json');
  return res.status(status).send(message);
})