import { DBEventPayload, DBUser } from "../../types";
import * as segment from "../../segment";
import { graphql } from "../../graphql";
import * as easyCron from "../../easyCron";

export const on_update_user = async ({ body }: { body: DBEventPayload<'UPDATE', DBUser> }) => {
  const { event: { data: { new: { id, display_name: newDisplayName, metadata: newMetadata, disabled: newDisabled }, old: { display_name: oldDisplayName, metadata: oldMetadata, disabled: oldDisabled }}} } = body;

  if ( oldMetadata?.timezone != newMetadata?.timezone ) {
    await segment.track({
      userId: id,
      event: segment.Events.USER_UPDATED,
      properties: { field: 'timezone' }
    })
  }

  if ( !oldDisabled && !!newDisabled ) { 
    const { userProfile } = await graphql.GetUserProfile({ userId: id });
    if ( userProfile ) {
      if ( userProfile.sync_updates_job_id ) {
        await easyCron.deleteJob({ jobId: userProfile.sync_updates_job_id })
      }

      await graphql.UpdateUserProfile({
        userId: id,
        _set: {
          is_subscribed_general: false,
          is_subscribed_sync_updates: false,
          sync_updates_job_id: null,
          sync_updates_frequency: null
        }
      })
    }
  }
}