import { withAxiom, AxiomRequest } from 'next-axiom'

export const config = { runtime: 'experimental-edge' };

async function handler(req: AxiomRequest) {
  req.log.info("Pong", { headers: req.headers });
  return new Response("Pong")
}

export default withAxiom(handler);