import { DBEventPayload, DBDestination } from "~/types/backend/db";
import { Logger } from "../logger";
import { trackDestinationCreated } from "../analytics";

export const onInsertDestination = async ({ body, logger }: { body: DBEventPayload<'INSERT', DBDestination>; logger: Logger }) => {
  const { op, data: { new: destination } } = body.event;

  const { user_id: userId, id: destinationId, integration_id: integration } = destination;

  await Promise.all([
    logger.logDestinationCreated({ userId, destinationId, integration }),
    trackDestinationCreated({ userId, destinationId, integration })
      .then(() => logger.info("Destination created event tracked"))
  ])
}