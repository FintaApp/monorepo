import { DBEventPayload, DBDestination } from "../../../../../../functions/_lib/types";
import { graphql } from "../../graphql";
import * as logsnag from "../../logsnag";
import * as segment from "../../segment";
import { SegmentEventNames } from "../../../../../../functions/_lib/types";
import { Integrations_Enum } from "../../graphql/sdk";

export const on_insert_destination = async ({ body }: { body: DBEventPayload<'INSERT', DBDestination> }) => {
  const { session_variables, data: { new: { user_id, integration_id, created_at, id }}} = body.event;

  const trackPromise = session_variables["x-hasura-role"] === 'user' ? segment.track({
    userId: user_id,
    event: SegmentEventNames.DESTINATION_CREATED,
    properties: { integration: integration_id },
    timestamp: new Date(created_at)
  }) : true;

  const logsnagPromise = logsnag.publish({
    channel: logsnag.LogSnagChannel.ACTIVITY,
    event: logsnag.LogSnagEvent.DESTINATION_CREATED,
    icon: "🗺",
    notify: false,
    tags: { 
      [logsnag.LogSnagTags.INTEGRATION]: integration_id, 
      [logsnag.LogSnagTags.USER_ID]: user_id,
      [logsnag.LogSnagTags.DESTINATION_ID]: id
    }
  });

  await Promise.all([ trackPromise, logsnagPromise ]);
}