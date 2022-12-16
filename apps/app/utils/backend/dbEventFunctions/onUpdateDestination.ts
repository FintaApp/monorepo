import { DBEventPayload, DBDestination } from "~/types/backend/db";
import { Logger } from "../logger";
import { trackDestinationDeleted, trackDestinationUpdated } from "../analytics";
import * as _ from "lodash";

export const onUpdateDestination = async ({ body, logger }: { body: DBEventPayload<'UPDATE', DBDestination>; logger: Logger }) => {
  const { op, data: { old: oldDestination, new: newDestination } } = body.event;

  const { id: destinationId, integration_id: integration, user_id: userId } = newDestination;

  if ( oldDestination.name !== newDestination.name ) {
    await trackDestinationUpdated({ userId, integration, destinationId, field: 'name' })
      .then(() => logger.info("Destination updated event tracked"))
  }

  if ( !_.isEqual(oldDestination.table_configs, newDestination.table_configs ) ) {
    await trackDestinationUpdated({ userId, integration, destinationId, field: 'table_configs'})
      .then(() => logger.info("Destination updated event tracked"))
  }

  if ( !oldDestination.disabled_at && !!newDestination.disabled_at ) {
    await Promise.all([
      trackDestinationDeleted({ userId, integration, destinationId })
        .then(() => logger.info("Destination deleted event tracked")),
      logger.logDestinationDeleted({ userId, integration, destinationId })
    ])
  }



}