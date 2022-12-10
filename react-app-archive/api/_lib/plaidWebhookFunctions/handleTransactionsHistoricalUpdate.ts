import { HistoricalUpdateWebhook, WebhookEnvironmentValues } from "plaid";
import { handleSyncUpdatesAvailable } from "./handleSyncUpdatesAvailable";
import { DestinationModel, PlaidItemModel } from "../types"
import { Sentry } from "../sentry";

export const handleTransactionsHistoricalUpdate = async ({ item, destinations, scope, asAdmin }: {
  item: PlaidItemModel;
  data: HistoricalUpdateWebhook;
  destinations: DestinationModel[];
  scope: Sentry.Scope,
  asAdmin: boolean;
}) => {
  const { plaid_sync_cursor } = item;
  if ( plaid_sync_cursor ) { return; }
  return handleSyncUpdatesAvailable({ 
    item, 
    data: { 
      historical_update_complete: true, 
      initial_update_complete: item.is_initial_update_complete,
      webhook_type: 'TRANSACTIONS',
      webhook_code: 'SYNC_UPDATES_AVAILABLE',
      item_id: item.id,
      environment: WebhookEnvironmentValues.Production
    }, 
    destinations,
    scope,
    asAdmin
  });
}