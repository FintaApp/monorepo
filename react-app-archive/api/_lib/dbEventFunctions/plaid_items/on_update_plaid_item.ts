import { DBEventPayload, DBPlaidItem } from "../../types";
import { graphql } from "../../graphql";
import * as logsnag from "../../logsnag";
import * as segment from "../../segment";

export const on_update_plaid_item = async ({ body }: { body: DBEventPayload<'UPDATE', DBPlaidItem> }) => {
  const { session_variables, data: { old: oldPlaidItem, new: newPlaidItem}}  = body.event;

  const userId = newPlaidItem.user_id;
  const itemId = newPlaidItem.id;

  if ( (oldPlaidItem.error === 'ITEM_LOGIN_REQUIRED' && !newPlaidItem.error) || (!!oldPlaidItem.consent_expires_at && !newPlaidItem.consent_expires_at) ) {
    await segment.track({
      userId,
      event: segment.Events.INSTITUTION_RECONNECTED,
      properties: { plaidItemId: newPlaidItem.id } 
    });
  }

  if ( !oldPlaidItem.disabled_at && !!newPlaidItem.disabled_at ) {
    const { plaidItem } = await graphql.GetPlaidItem({ plaid_item_id: itemId });
    
    const trackPromise = session_variables["x-hasura-role"] === 'user' ? segment.track({
      userId: userId,
      event: segment.Events.INSTITUTION_DELETED,
      properties: { provider: 'plaid' }
    }) : true;

    const logsnagPromise = logsnag.publish({
      channel: logsnag.LogSnagChannel.ACTIVITY,
      event: logsnag.LogSnagEvent.INSTITUTION_DELETED,
      icon: "🏦",
      notify: false,
      tags: { 
        [logsnag.LogSnagTags.INSTITUTION]: plaidItem!.institution.name, 
        [logsnag.LogSnagTags.USER_ID]: userId,
        [logsnag.LogSnagTags.ITEM_ID]: itemId
      }
    });

    return Promise.all([ trackPromise, logsnagPromise ])
  }
}