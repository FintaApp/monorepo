import { DBEventPayload, DBDestination } from "../../types";
import * as logsnag from "../../logsnag";
import * as segment from "../../segment";

export const on_update_destination = async ({ body }: { body: DBEventPayload<'UPDATE', DBDestination> }) => {
  const { session_variables, data: { old: { id, user_id, integration_id, disabled_at: oldDisabledAt }, new: { disabled_at: newDisabledAt }}} = body.event;

  if ( !oldDisabledAt && !!newDisabledAt ) {
    const trackPromise = session_variables["x-hasura-role"] === 'user' ? segment.track({
      userId: user_id,
      event: segment.Events.DESTINATION_DELETED,
      properties: { integration: integration_id }
    }) : true;

    const logsnagPromise = logsnag.publish({
      channel: logsnag.LogSnagChannel.ACTIVITY,
      event: logsnag.LogSnagEvent.DESTINATION_DELETED,
      icon: "🗺",
      notify: false,
      tags: { 
        [logsnag.LogSnagTags.INTEGRATION]: integration_id, 
        [logsnag.LogSnagTags.USER_ID]: user_id,
        [logsnag.LogSnagTags.DESTINATION_ID]: id
      }
    });

    return Promise.all([ trackPromise, logsnagPromise ])
  }
}