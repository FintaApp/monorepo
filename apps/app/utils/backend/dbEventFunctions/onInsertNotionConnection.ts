import { DBEventPayload, DBNotionConnection } from "~/types/backend/db";
import { Logger } from "../logger";
import { trackNotionConnectionAdded } from "../analytics";

export const onInsertNotionConnection = async ({ body, logger }: { body: DBEventPayload<'INSERT', DBNotionConnection>; logger: Logger }) => {
  const { op, data: { new: notionConnection } } = body.event;

  await Promise.all([
    trackNotionConnectionAdded({ userId: notionConnection.user_id })
      .then(() => logger.info("Notion connection event tracked")),
    logger.logNotionConnectionAdded({ userId: notionConnection.user_id })
  ])
}