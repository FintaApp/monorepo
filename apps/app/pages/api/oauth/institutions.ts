import { SyncError, SyncTrigger } from "@prisma/client";
import _ from "lodash";

import { OauthGetInstitutionsResponse } from "@finta/shared";

import { wrapper } from "~/lib/apiWrapper";
import { db } from "~/lib/db";
import { getDestinationFromRequest } from "~/lib/getDestinationFromRequest";
import * as formatter from "~/lib/integrations/coda/formatter";
import { logSyncCompleted } from "~/lib/logsnag";
import { trackSyncCompleted } from "~/lib/analytics";

export default wrapper(async ({ req, logger }) => {
  const trigger = SyncTrigger.Destination;
  const { destination, hasAppAccess } = await getDestinationFromRequest({ req, logger });
  if ( !destination ) { return { status: 404, message: "Destination not found" }};

  logger.info("Fetched destination", { destination, hasAppAccess });

  if ( !hasAppAccess ) {
    return db.sync.create({ data: {
      trigger,
      triggerDestinationId: destination.id,
      error: SyncError.NoSubscription,
      isSuccess: false,
      endedAt: new Date()
    }})
    .then(sync => {
      logger.info("Sync created", { sync });
      return { status: 200, message: "OK"}
    });
  }

  const plaidItems = _.uniqBy(destination.accounts.map(account => account.item), 'id');
  const sync = await db.sync.create({
    data: {
      trigger,
      triggerDestinationId: destination.id,
      results: {
        createMany: {
          data: plaidItems.map(item => ({
            plaidItemId: item.id,
            destinationId: destination.id,
            shouldSyncInstitution: true,
            institutionsAdded: 1
          }))
        }
      }
    }
  }).then(sync => { logger.info("Created sync", { sync }); return sync; });

  const formattedItems = plaidItems.map(item => formatter.institution({ item }));

  await Promise.all([
    db.sync.update({ where: { id: sync.id }, data: { isSuccess: true, endedAt: new Date() }}),

    logSyncCompleted({
      userId: destination.user.id,
      trigger,
      integration: destination.integration,
      institutionsSynced: plaidItems.length,
      syncId: sync.id,
      destinationId: destination.id,
    }),

    trackSyncCompleted({ 
      userId: destination.user.id, 
      trigger, 
      integration: destination.integration, 
      institutionsSynced: plaidItems.length, 
      destinationId: destination.id 
    })
  ]);

  return { status: 200, message: { institutions: formattedItems } as OauthGetInstitutionsResponse}
});