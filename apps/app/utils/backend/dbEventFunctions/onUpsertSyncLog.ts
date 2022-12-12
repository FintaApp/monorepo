import { graphql } from "~/graphql/backend";
import { DBEventPayload, DBSyncLog } from "~/types/backend/db";
import { Logger } from "../logger";
import { trackSyncCompleted } from "../analytics";

export const onUpsertSyncLog = async ({ body, logger }: { body: DBEventPayload<'INSERT', DBSyncLog> | DBEventPayload<'UPDATE', DBSyncLog>; logger: Logger }) => {
  const { op, data: { old: oldSyncLog, new: newSyncLog }} = body.event;

  if (( !oldSyncLog || !oldSyncLog.ended_at ) && !!newSyncLog.ended_at) {
    const syncLog = await graphql.GetSyncLog({ sync_log_id: newSyncLog.id })
      .then(response => {
        logger.info("Fetched sync log", { response });
        return response.sync_log!
      })
    
    const userId = syncLog.destination_sync_logs[0]?.destination?.user_id || syncLog.plaid_item_sync_logs[0]?.plaid_item.user_id;
    if ( !userId || syncLog.destination_sync_logs.length === 0 ) { return; }

    await Promise.all(syncLog.destination_sync_logs.map(async destinationSyncLog => {
      const error = newSyncLog.error?.error_code 
        || newSyncLog.error?.code 
        || syncLog.destination_sync_logs.find(log => !!log.error)?.error?.error_code 
        || syncLog.plaid_item_sync_logs.find(log => !!log.error)?.error?.error_code;
      
      return Promise.all([
        trackSyncCompleted({
          userId,
          error,
          trigger: newSyncLog.trigger,
          isSuccess: newSyncLog.is_success,
          integration: destinationSyncLog.destination.integration_id,
          institutionsSynced: syncLog.plaid_item_sync_logs.length,
          endedAt: newSyncLog.ended_at,
          destinationId: destinationSyncLog.destination_id
        }).then(() => logger.info("Sync completed event tracked")),

        logger.logSyncCompleted({
          userId,
          isSuccess: newSyncLog.is_success,
          syncLogId: syncLog.id,
          institutionsSynced: syncLog.plaid_item_sync_logs.length,
          integration: destinationSyncLog.destination.integration_id,
          destinationId: destinationSyncLog.destination_id,
          trigger: newSyncLog.trigger,
          error
        })
      ])
    }))
  }
}