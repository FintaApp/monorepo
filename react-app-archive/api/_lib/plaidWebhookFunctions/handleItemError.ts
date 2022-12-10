import { ItemErrorWebhook } from "plaid";

import { graphql } from "../graphql";
import * as segment from "../segment";
import { PlaidItemModel } from "../types";
import * as logsnag from "../logsnag";

export const handleItemError = async ({ item, data }: { item: PlaidItemModel; data: ItemErrorWebhook | { error: { error_code: string }}; }) => {
  const { error_code } = data.error || { error_code: null };
  const { user, institution } = item;
  if ( !user.email ) { return; }

  await logsnag.publish({
    event: logsnag.LogSnagEvent.INSTITUTION_ERROR_TRIGGERED,
    channel: logsnag.LogSnagChannel.ACTIVITY,
    description: `Error: ${error_code}`,
    icon: '🏦',
    tags: {
      [logsnag.LogSnagTags.USER_ID]: item.user.id,
      [logsnag.LogSnagTags.INSTITUTION]: item.institution.name,
      [logsnag.LogSnagTags.ITEM_ID]: item.id
    }
  })

  await graphql.UpdatePlaidItem({ plaid_item_id: item.id, _set: { error: error_code }})
  .then(() => {
    return Promise.all([
      segment.track({
        userId: user.id,
        event: segment.Events.INSTITUTION_ERROR_TRIGGERED,
        properties: {
          provider: 'plaid',
          institution: institution.name,
          error: error_code,
          plaidItemId: item.id
        }
      })
    ])
  })
}

// TODO: Update destinations