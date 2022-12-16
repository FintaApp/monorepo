import { DBEventPayload, DBUser } from "~/types/backend/db";
import { Logger } from "../logger";
import { trackUserSignedUp, identify } from "../analytics";

export const onInsertUser = async ({ body, logger }: { body: DBEventPayload<'INSERT', DBUser> | DBEventPayload<'MANUAL', DBUser>; logger: Logger }) => {
  const { op, data: { new: user } } = body.event;

  if ( op === 'INSERT' ) {
    await Promise.all([
      logger.logUserSignedUp({ displayName: user.display_name, userId: user.id }),
      trackUserSignedUp({ userId: user.id, createdAt: user.created_at })
        .then(() => logger.info("User signed up event tracked"))
    ])
  }

  return identify({
    userId: user.id,
    traits: {
      email: user.email,
      name: user.display_name,
      created_at: new Date(user.created_at)
    }
  })
}