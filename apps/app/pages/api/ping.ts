import { AxiomRequest, withAxiom } from "next-axiom";
import { logError } from "~/utils/backend/logsnag";

export const config = { runtime: 'experimental-edge'};

const handler = async (req: AxiomRequest ) => {
  const route = req.nextUrl.pathname;
  const requestId = req.headers.get('x-vercel-id');
  const logger = req.log.with({ requestId });

  logger.info(`${route} request started`) 
  logger.info("Pong")
  await logError({ error: new Error("Test error"), logger, requestId})
  logger.info(`${route} request finished`, { status: 200, message: "Pong" });
  return new Response("Pong")
}

export default withAxiom(handler);