import * as formatter from "~/utils/backend/formatter";
import { graphql } from "~/graphql/backend";
import { wrapper } from "~/utils/backend/apiWrapper";

import { getOauthPlaidItems } from "./_helpers";
import { OauthGetInstitutionsResponse } from "@finta/shared";

export default wrapper('oauth', async ({ req, destination, plaidEnv, logger }) => {
  const trigger = 'destination'
  const syncLog = await graphql.InsertSyncLog({ sync_log: { 
    trigger,
    destination_sync_logs: { data: [{ destination_id: destination.id }]},
    metadata: { 'target_table': 'institutions' }
  }}).then(response => response.sync_log!);
  logger.addContext({ syncLogId: syncLog.id });

  return getOauthPlaidItems(destination.id, undefined, true)
  .then(async data => {
    const items = data.plaid_items.map(item => formatter.coda.institution({ item }));
    await Promise.all([
      graphql.InsertPlaidItemSyncLogs({ 
      plaid_item_sync_logs: items.map(item => ({ 
        plaid_item_id: item.id,
        sync_log_id: syncLog.id,
      }))
    }),
    logger.logSyncCompleted({
      userId: destination.user.id,
      trigger,
      isSuccess: true,
      integration: destination.integration.id,
      institutionsSynced: items.length,
      syncLogId: syncLog.id,
      destinationId: destination.id,
      targetTable: "institutions"
    }),
    graphql.UpdateSyncLog({
      sync_log_id: syncLog.id,
      _set: {
        is_success: true,
        ended_at: new Date()
      }
    })
  ])

    return { status: 200, message: { institutions: items }}
  })
  .catch(async error => {
    await graphql.UpdateSyncLog({
      sync_log_id: syncLog.id,
      _set: {
        error: {
          error_code: 'internal_error'
        },
        is_success: false,
        ended_at: new Date()
      }
    });
    logger.error(error)
    return { status: 500, message: "Internal Error" }
  });
})