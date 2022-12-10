import { DBEventPayload, DBUserProfile } from "../../types";
import * as easyCron from "../../easyCron";
import { graphql } from "../../graphql";

export const handleUpsertUserProfle = async ({ body }: { body: DBEventPayload<'INSERT', DBUserProfile> | DBEventPayload<'UPDATE', DBUserProfile> }) => {
  const { old: oldUserProfile, new: newUserProfile } = body.event.data;
  const { user } = await graphql.GetBaseUser({ user_id: newUserProfile.user_id })

  let jobId = newUserProfile.sync_updates_job_id;
  if ( 
    (!jobId || (!!oldUserProfile && (
    oldUserProfile.sync_updates_frequency !== newUserProfile.sync_updates_frequency || 
    oldUserProfile.is_subscribed_sync_updates !== newUserProfile.is_subscribed_sync_updates ||
    oldUserProfile.timezone !== newUserProfile.timezone)))
    && !user?.disabled
  ) {
    const response = await easyCron.upsertJob({ 
      jobId, 
      job: { 
        frequency: newUserProfile.sync_updates_frequency!, 
        timezone: newUserProfile.timezone!,
        userId: newUserProfile.user_id,
        isEnabled: newUserProfile.is_subscribed_sync_updates
      }})

    if ( !jobId && response.cron_job_id ) {
      await graphql.UpdateUserProfile({ userId: newUserProfile.user_id, _set: { sync_updates_job_id: response.cron_job_id }})
    }
  }
}