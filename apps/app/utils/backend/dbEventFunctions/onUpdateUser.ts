import { graphql } from "~/graphql/backend";
import { DBEventPayload, DBUser } from "~/types/backend/db";
import { Logger } from "../logger";
import { identify, trackUserDeleted } from "../analytics";
import { deleteJob } from "~/lib/easyCron";

export const onUpdateUser = async ({ body, logger }: { body: DBEventPayload<'UPDATE', DBUser>; logger: Logger }) => {
  const { old: oldUser, new: newUser } = body.event.data;

  if ( !oldUser.disabled && !!newUser.disabled ) {
    await Promise.all([
      trackUserDeleted({ userId: newUser.id })
        .then(() => logger.info("User deleted event tracked")),
      identify({ userId: newUser.id, traits: { email: undefined, name: undefined, deleted_at: new Date() }}),
      logger.logUserDeleted({ userId: newUser.id })
    ])

    const userProfile = await graphql.GetUserProfile({ userId: newUser.id })
      .then(response => {
        logger.info("Fetched user profile", { response });
        return response.userProfile!
      })
    if ( userProfile.syncUpdatesJobId ) {
      await deleteJob({ jobId: userProfile.syncUpdatesJobId })
        .then(() => logger.info("Sync updates job deleted"))
    }
  }
}