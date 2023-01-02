import { Logger } from "next-axiom";
import { InitialUpdateWebhook, WebhookEnvironmentValues } from "plaid";

import { handleSyncUpdatesAvailable } from "./handleSyncUpdatesAvailable";

import { Destinations, Item } from "./types";

export const handleTransactionsInitialUpdate = async ({ item, destinations, logger, asAdmin }: {
  item: Item;
  data: InitialUpdateWebhook;
  destinations: Destinations;
  logger: Logger;
  asAdmin: boolean;
}) => {
  const { plaidSyncCursor } = item;
  if ( plaidSyncCursor ) { return; }
  return handleSyncUpdatesAvailable({ 
    item, 
    data: { 
      historical_update_complete: item.isHistoricalUpdateComplete, 
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