import { DefaultUpdateWebhook, WebhookEnvironmentValues } from "plaid";
import { handleSyncUpdatesAvailable } from "./handleSyncUpdatesAvailable";
import { PlaidItemModel, DestinationModel } from "~/types/backend/models";
import { Logger } from "../logger";

export const handleTransactionsDefaultUpdate = async ({ item, destinations, logger, asAdmin }: {
  item: PlaidItemModel;
  data: DefaultUpdateWebhook;
  destinations: DestinationModel[]
  logger: Logger,
  asAdmin: boolean
}) => {
  const { plaid_sync_cursor } = item;
  if ( plaid_sync_cursor ) { return; }
  return handleSyncUpdatesAvailable({ 
    item, 
    data: { 
      historical_update_complete: item.is_historical_update_complete, 
      initial_update_complete: item.is_initial_update_complete,
      webhook_type: 'TRANSACTIONS',
      webhook_code: 'SYNC_UPDATES_AVAILABLE',
      item_id: item.id,
      environment: WebhookEnvironmentValues.Production
    }, 
    destinations,
    logger,
    asAdmin
  });
}