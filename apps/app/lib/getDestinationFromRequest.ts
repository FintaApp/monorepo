import { NextApiRequest } from 'next';
import { Logger } from 'next-axiom';
import { appRouter } from '~/server/routers';

import { hash } from './crypto';
import { db } from './db';

export const getDestinationFromRequest = async ({ req, logger }: { req: NextApiRequest; logger: Logger }) => {
  const auth = req.headers['authorization'] || '';
  const token = auth.split(' ')[1];
  if ( !token ) { return { destination: null, hasAppAccess: false }}

  const tokenHash = hash(token);
  const destination = await db.destination.findFirst({ 
    where: { codaCredential: { accessTokenHash: tokenHash }},
    include: { 
      accounts: { where: { item: { disabledAt: null } }, include: { item: { include: { institution: true }} }},
      tableConfigs: true,
      user: { select: { id: true, stripeCustomerId: true }}
    }
  });

  const router = appRouter.createCaller({ req, db, logger, res: {} as any, user: { id: destination.userId } });
  const { hasAppAccess } = await router.stripe.getSubscription({ customerId: destination.user.stripeCustomerId });
  return { destination, hasAppAccess }
}