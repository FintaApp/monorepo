import { AxiomRequest, Logger } from 'next-axiom'

export const edgeConfig = { runtime: 'experimental-edge'}

type WrappedFunctionResponse = Promise<{ status: number; message: any }>;
export type WrappedFunction = ({ req, logger }: { req: AxiomRequest, logger: Logger }) => WrappedFunctionResponse;

export const wrapper = (fn: WrappedFunction) => async (req: AxiomRequest) => {
  const route = req.url;
  req.log.info(`${route} request started`, { headers: req.headers });

  const logger = req.log.with({});

  const { status, message } = await fn({ req, logger })
    .catch(error => {
      logger.error(error);
      return { status: 500, message: "Internal Error"}
    })
  
  logger.info(`${route} request finished`, { status, body: message })
  return new Response(JSON.stringify(message), { status })
}