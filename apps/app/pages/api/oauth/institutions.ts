import {  Table } from "@prisma/client";
import _ from "lodash";

import { OauthGetInstitutionsResponse } from "@finta/shared";

import { oauthFunctionWrapper } from "~/lib/functionWrappers";
import { db } from "~/lib/db";
import * as formatter from "~/lib/integrations/coda/formatter";
import { logSyncCompleted } from "~/lib/logsnag";
import { trackSyncCompleted } from "~/lib/analytics";

export default oauthFunctionWrapper({ targetTable: Table.Institutions, allowItemError: true }, async ({ destination, plaidItems, trigger, syncId }) => {
  const formattedItems = plaidItems.map(item => formatter.institution({ item }));
  await db.syncResult.createMany({
    data: plaidItems.map(item => ({
      plaidItemId: item.id,
      destinationId: destination.id,
      shouldSyncInstitution: true,
      institutionsAdded: 1,
      syncId: syncId!,
    })),
    skipDuplicates: true
  });

  await Promise.all([
    db.sync.update({ where: { id: syncId! }, data: { isSuccess: true, endedAt: new Date() }}),

    logSyncCompleted({
      userId: destination.user.id,
      trigger,
      integration: destination.integration,
      institutionsSynced: plaidItems.length,
      syncId: syncId!,
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