import { graphql } from "~/graphql/backend";
import { DBEventPayload, DBUserProfile } from "~/types/backend/db";
import { Logger } from "../logger";
import * as easyCron from "~/utils/backend/easyCron";
import { identify, formatSubscriptionForIdentify, trackUserProfileUpdated } from "../analytics";
import { Frequencies_Enum } from "~/graphql/backend/sdk";

export const onUpsertUserProfile = async ({ body, logger }: { body: DBEventPayload<'INSERT', DBUserProfile> | DBEventPayload<'UPDATE', DBUserProfile> | DBEventPayload<'MANUAL', DBUserProfile>; logger: Logger }) => {
  const { op, data: { old: oldUserProfile, new: newUserProfile }} = body.event;

  const { user_id: userId, sync_updates_job_id: jobId, sync_updates_frequency, timezone, is_subscribed_sync_updates } = newUserProfile;

  if ( !oldUserProfile?.stripe_customer_id && !!newUserProfile.stripe_customer_id ) {
    const user = await graphql.GetUser({ userId: newUserProfile.user_id })
      .then(response => {
        logger.info("User fetched", { response });
        return response.user!
      })
    
    const { subscription, trialEndsAt } = user.profile.stripeData;
    await identify({
      userId,
      traits: {
        ...( subscription ? formatSubscriptionForIdentify({ subscriptionFromSchema: subscription }) : {}),
        trial_ends_at: new Date(trialEndsAt)
      }
    }).then(() => logger.info("Identified user with stripe data"))
  }

  await easyCron.upsertJob({
    jobId: jobId || undefined,
    job: {
      frequency: sync_updates_frequency || Frequencies_Enum.Weekly,
      timezone: timezone!,
      userId,
      isEnabled: is_subscribed_sync_updates
    }
  }).then(async response => {
    logger.info("Sync updates job upserted", { response });
    if ( !jobId ) {
      return graphql.UpdateUserProfile({ userId, _set: { syncUpdatesJobId: response.cron_job_id }})
        .then(response => logger.info("Job ID added to user profile", { response }))
    }
  })

  if ( op === 'UPDATE' ) {
    if ( oldUserProfile?.timezone !== newUserProfile.timezone ) {
      await trackUserProfileUpdated({ userId, field: 'timezone', oldValue: oldUserProfile?.timezone, newValue: newUserProfile.timezone })
        .then(() => logger.info("User profile updated event tracked"))
    }

    if ( oldUserProfile?.is_subscribed_general !== newUserProfile.is_subscribed_general ) {
      await trackUserProfileUpdated({ userId, field: 'is_subscribed_general', oldValue: oldUserProfile?.is_subscribed_general, newValue: newUserProfile.is_subscribed_general })
        .then(() => logger.info("User profile updated event tracked"))
    }

    if ( oldUserProfile?.is_subscribed_sync_updates !== newUserProfile.is_subscribed_sync_updates ) {
      await trackUserProfileUpdated({ userId, field: 'is_subscribed_sync_updates', oldValue: oldUserProfile?.is_subscribed_sync_updates, newValue: newUserProfile.is_subscribed_sync_updates })
        .then(() => logger.info("User profile updated event tracked"))
    }

    if ( oldUserProfile?.sync_updates_frequency !== newUserProfile.sync_updates_frequency ) {
      await trackUserProfileUpdated({ userId, field: 'sync_updates_frequency', oldValue: oldUserProfile?.sync_updates_frequency, newValue: newUserProfile.sync_updates_frequency })
        .then(() => logger.info("User profile updated event tracked"))
    }
  }


  await identify({
    userId: newUserProfile.user_id,
    traits: {
      timezone: timezone!,
      unsubscribed: !newUserProfile.is_subscribed_general,
      is_subscribed_sync_updates,
      sync_updates_frequency: sync_updates_frequency || undefined
    }
  }).then(() => logger.info("Identified user with profile data"))
}