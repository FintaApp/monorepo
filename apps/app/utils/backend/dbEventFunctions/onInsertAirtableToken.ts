import { DBAirtableToken, DBEventPayload } from "~/types/backend/db";
import { Logger } from "../logger";
import { trackAirtableTokenAdded } from "../analytics";

export const onInsertAirtableToken = async ({ body, logger }: { body: DBEventPayload<'INSERT', DBAirtableToken>; logger: Logger }) => {
  const { op, data: { new: airtableToken } } = body.event;

  await Promise.all([
    trackAirtableTokenAdded({ userId: airtableToken.user_id })
      .then(() => logger.info("Airtable token added event tracked")),
    logger.logAirtableTokenAdded({ userId: airtableToken.user_id })
  ])
}