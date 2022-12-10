import type { VercelRequest, VercelResponse } from '@vercel/node';

import { getUserFromToken } from './getUserFromToken';
import * as logsnag from "../logsnag";
import { Sentry } from "../sentry";
import { WrappedClientFunction } from "../types";

export const clientFunctionWrapper = (fn: WrappedClientFunction) => async (req: VercelRequest, res: VercelResponse) => {
  const transaction = Sentry.startTransaction({ op: "wrapper", name: "client function"});
  const scope = new Sentry.Scope();

  let user = null as {
    id: string;
    asAdmin?: boolean
  } | null; 

  try {
    const auth = req.headers['authorization'] || '';
    const token = auth.split(' ')[1];

    user = req.body.userId ? { id: req.body.userId, asAdmin: true } : await getUserFromToken(token).then(response => response as { id: string });
  } catch (error) {
    await logsnag.logError({ operation: 'client function', error, scope });
    transaction.finish();
    return { status: 500, message: "Internal Error" }
  };

  if ( !user ) { return res.status(500).send("Invalid authorization header"); }

  const { status, message } = await fn(req, user)
  .catch(async error => {
    await logsnag.logError({ operation: 'client function', error, scope, tags: {
      [logsnag.LogSnagTags.USER_ID]: user!.id
    }});

    transaction.finish();
    return { status: 500, message: "Internal Error" }
  });

  transaction.finish();
  return res.status(status).send(message);
}