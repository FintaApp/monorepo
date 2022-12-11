import { InitialUpdateWebhook, WebhookEnvironmentValues } from "plaid";

import { handleSyncUpdatesAvailable } from "./handleSyncUpdatesAvailable";
import { PlaidItemModel, DestinationModel } from "~/types/backend/models";
import { Logger } from "../logger";

export const handleTransactionsInitialUpdate = async ({ item, destinations, logger, asAdmin }: {
  item: PlaidItemModel;
  data: InitialUpdateWebhook;
  destinations: DestinationModel[];
  logger: Logger;
  asAdmin: boolean;
}) => {
  const { plaid_sync_cursor } = item;
  if ( plaid_sync_cursor ) { return; }
  return handleSyncUpdatesAvailable({ 
    item, 
    data: { 
      historical_update_complete: item.is_historical_update_complete, 
      initial_update_complete: true,
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