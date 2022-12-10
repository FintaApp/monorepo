import { DBEventPayload, DBUser } from "../../types";
import * as logsnag from "../../logsnag";
import * as segment from "../../segment";
import { graphql } from "../../graphql";
import { Frequencies_Enum } from "../../graphql/sdk";

export const on_insert_user = async ({ body }: { body: DBEventPayload<'INSERT', DBUser> }) => {
  const { event: { data: { new: user }} } = body;
  const logsnagPromise = logsnag.publish({
    channel: logsnag.LogSnagChannel.ACTIVITY,
    event: logsnag.LogSnagEvent.USER_SIGNED_UP,
    description: `${user.display_name} just signed up!`,
    icon: "👤",
    notify: true,
    tags: { [logsnag.LogSnagTags.USER_ID]: user.id }
  });

  const trackPromise = segment.track({
    userId: user.id,
    event: segment.Events.USER_SIGNED_UP,
    timestamp: new Date(user.created_at)
  });

  const createProfilePromise = graphql.InsertUserProfile({
    userProfile: {
      user_id: user.id,
      timezone: user.metadata?.timezone,
      is_subscribed_general: true,
      is_subscribed_sync_updates: true,
      sync_updates_frequency: Frequencies_Enum.Weekly
    }
  })

  return Promise.all([ logsnagPromise, trackPromise, createProfilePromise ]);
}