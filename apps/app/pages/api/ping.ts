import { AxiomRequest, withAxiom } from "next-axiom";

export const config = { runtime: 'experimental-edge'};

const handler = async (req: AxiomRequest ) => {
  const route = req.nextUrl.pathname;
  req.log.info(`${route} request started`, { id: req.headers.get('x-vercel-id'), testHost: req.headers.get('host'), keys: req.headers.keys });  
  req.log.info("Pong")
  req.log.info(`${route} request finished`, { status: 200, message: "Pong" });
  return new Response("Pong")
}

export default withAxiom(handler);