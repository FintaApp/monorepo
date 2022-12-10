import type { VercelRequest, VercelResponse } from '@vercel/node';
import { WrappedPublicFunction } from "../types";
import { Sentry } from "../sentry";
import * as logsnag from "../logsnag";

export const publicFunctionWrapper = (fn: WrappedPublicFunction) => async (req: VercelRequest, res: VercelResponse) => {
  const transaction = Sentry.startTransaction({ op: "wrapper", name: "public function"});
  const scope = new Sentry.Scope();

  const { status, message } = await fn(req)
  .catch(async error => {
    await logsnag.logError({ error, operation: "public function", scope })
    return { status: 500, message: "Internal Error" }
  })
  
  transaction.finish();
  await Sentry.flush(1000);
  res.setHeader('content-type', 'application/json')
  return res.status(status).send(message);
}