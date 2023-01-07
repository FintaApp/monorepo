import crypto from "crypto";
import { withAxiom, AxiomAPIRequest, Logger } from 'next-axiom';
import { NextApiResponse } from "next";
import { SyncError, SyncTrigger, Table, Destination as IDestination, User, PlaidAccount, PlaidItem as IPlaidItem, DestinationTableConfig, PlaidInstitution } from "@prisma/client";

import { logError } from "../logsnag";
import { hash } from '../crypto';
import { db } from '../db';
import { appRouter } from '~/server/routers';
import { SyncMetadata } from "~/types";
import _ from "lodash";

type PlaidItem = (IPlaidItem & {
  institution: PlaidInstitution;
})

type Destination = (IDestination & {
  user: User;
  accounts: (PlaidAccount & {
      item: PlaidItem;
  })[];
  tableConfigs: DestinationTableConfig[];
});
type WrappedFunctionResponse = Promise<{ status: number; message: any }>;

type WrappedFunction = ({ req, logger, destination, plaidItems, trigger, syncId }: { syncId?: string; trigger: SyncTrigger, req: AxiomAPIRequest; logger: Logger; destination: Destination; plaidItems: PlaidItem[] }) => WrappedFunctionResponse;

export const oauthFunctionWrapper = ({ targetTable, allowItemError = false }: { targetTable?: Table, allowItemError: boolean}, fn: WrappedFunction) => withAxiom(async (req: AxiomAPIRequest, res: NextApiResponse) => {
  const route = req.url;
  const requestId = crypto.randomUUID();
  const logger = req.log.with({ requestId });
  logger.info(`${route} request started`, { body: req.body });

  const auth = req.headers['authorization'] || '';
  const token = auth.split(' ')[1];
  if ( !token ) { 
    logger.info("Incorrect auth header", { authHeader: req.headers['authorization']})
    return res.status(400).send("Incorrect authorization header"); 
  }
  logger.debug("Request has token")
  const tokenHash = hash(token);

  const destination = await db.destination.findFirst({ 
    where: { codaCredential: { accessTokenHash: tokenHash }},
    include: { 
      accounts: { where: { item: { disabledAt: null } }, include: { item: { include: { institution: true }} }},
      tableConfigs: true,
      user: true
    }
  });

  if ( !destination ) { 
    logger.info("No destination found");
    return res.status(400).send("Invalid token")
  }
  logger.debug("Destination fetched", { destination })

  const trigger = SyncTrigger.Destination;
  const syncId = req.body?.data?.syncId ? req.body?.data?.syncId as string : (
    targetTable
    ? await db.sync.create({ data: {
      trigger,
      triggerDestinationId: destination.id,
      userId: destination.user.id,
      metadata: { targetTable } as SyncMetadata
    }}).then(sync => sync.id)
    : undefined
  )
  logger.debug("Sync Id", { syncId })
  const syncLogger = syncId ? logger.with({ syncId }) : logger;

  const router = appRouter.createCaller({ req, db, logger, res: {} as any, user: destination.user });
  const { hasAppAccess } = await router.stripe.getSubscription();
  if ( !hasAppAccess ) {
    syncLogger.info("User doesn't have app access");
    if ( syncId ) {
      await db.sync.update({ where: { id: syncId }, data: { endedAt: new Date(), isSuccess: false, error: SyncError.NoSubscription }})
    };
    return res.status(402).send("Finta subscription not active")
  }
  logger.debug("User has active trial or subscription");

  const plaidItems = _.uniqBy(destination.accounts.map(account => account.item), 'id');
  if ( !allowItemError && syncId ) {
    const errorItems = plaidItems.filter(item => item.error === 'ITEM_LOGIN_REQUIRED');
    if ( errorItems.length > 0 ) {
      await db.syncResult.createMany({
        data: errorItems.map(item => ({
          plaidItemId: item.id,
          error: SyncError.ItemError,
          destinationId: destination.id,
          syncId
        }))
      }).then(() => db.sync.update({ where: { id: syncId }, data: { error: SyncError.ItemError, isSuccess: false, endedAt: new Date() }}));
      logger.info("Has error bank account connection")
      return res.status(428).send("Has error bank account connection")
    }
  }
  logger.debug("Destination doesn't have any error items");

  if ( syncId && targetTable && ([ Table.Transactions, Table.Holdings, Table.InvestmentTransactions] as Table[]).includes(targetTable) ) {
    const tableConfig = destination.tableConfigs.find(config => config.table === targetTable) || { isEnabled: false };
    if ( !tableConfig.isEnabled ) {
      await db.sync.update({
        where: { id: syncId },
        data: {
          isSuccess: false,
          error: SyncError.TableDisabled,
          endedAt: new Date()
        }
      });
      return res.status(428).send("Sync table not enabled")
    }
  }
  
  logger.debug("Data is enabled")
  const { status, message } = await fn({ req, logger: syncLogger, destination, plaidItems, trigger, syncId })
    .catch(async error => {
      syncLogger.error(error);
      logError({ error, logRequestId: requestId});
      return { status: 500, message: "Internal Error"}
    });
  
  logger.info(`${route} request finished`, { status, body: message });
  res.setHeader('content-type', 'application/json');
  return res.status(status).send(message);
})