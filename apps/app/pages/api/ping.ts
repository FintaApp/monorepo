import { withAxiom, AxiomRequest } from 'next-axiom'

export const config = { runtime: 'experimental-edge' };

async function handler(req: AxiomRequest) {
  //req.log.info("Pong", { headers: req.headers });
  req.log.info("Headers: " + JSON.stringify(req.headers), { headers: JSON.parse(JSON.stringify(req.headers))})
  return new Response("Pong")
}

export default withAxiom(handler);