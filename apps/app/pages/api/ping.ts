import { AxiomRequest, withAxiom } from "next-axiom";

export const config = { runtime: 'experimental-edge'};

const handler = async (req: AxiomRequest ) => {
  const route = req.nextUrl.pathname;
  req.log.info(`${route} request started`, { headers: req.headers, route: req.nextUrl, req });  
  req.log.info("Pong")
  req.log.info(`${route} request finished`, { status: 200, message: "Pong" });
  return new Response("Pong")
}

export default withAxiom(handler);