import { DBEventPayload, DBSyncLog } from "../../types";
import * as segment from "../../segment";
import { graphql } from "../../graphql";

export const on_upsert_sync_log = async ({ body }: { body: DBEventPayload<'INSERT', DBSyncLog> | DBEventPayload<'UPDATE', DBSyncLog> }) => {
  const { old: oldSyncLog, new: newSyncLog } = body.event.data;

  if ( (!oldSyncLog || !oldSyncLog.ended_at) && !!newSyncLog.ended_at ) {
    const syncLog = await graphql.GetSyncLog({ sync_log_id: newSyncLog.id }).then(response => response.sync_log!);

    const userId = syncLog.destination_sync_logs[0]?.destination?.user_id || syncLog.plaid_item_sync_logs[0]?.plaid_item.user_id;
    if ( !userId || syncLog.destination_sync_logs.length === 0 ) { return; }

    return Promise.all(syncLog.destination_sync_logs.map(destinationSyncLog => {
      const error = newSyncLog.error?.error_code || newSyncLog.error?.code || syncLog.destination_sync_logs.find(log => !!log.error)?.error?.error_code || syncLog.plaid_item_sync_logs.find(log => !!log.error)?.error?.error_code;
      return Promise.all([
        segment.track({
          userId,
          event: segment.Events.SYNC_COMPLETED,
          properties: {
            trigger: newSyncLog.trigger,
            is_success: newSyncLog.is_success,
            integration: destinationSyncLog.destination.integration_id,
            institutions_synced: syncLog.plaid_item_sync_logs.length,
            error,
            destinationId: destinationSyncLog.destination_id
          },
          timestamp: new Date(newSyncLog.ended_at)
        }),
      ])
    }))
  }
}