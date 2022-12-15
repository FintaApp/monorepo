import { AxiomRequest, withAxiom } from "next-axiom";

export const config = { runtime: 'experimental-edge'};

const handler = async (req: AxiomRequest ) => {
  const route = req.nextUrl.pathname;
  const requestId = req.headers.get('x-vercel-id');
  const logger = req.log.with({ requestId });
  logger.info(`${route} request started`) 

  logger.info("Pong")

  logger.info(`${route} request finished`, { message: "Pong" });
  return new Response("Pong")
}

export default withAxiom(handler);