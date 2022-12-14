import { wrapper } from "~/utils/backend/apiWrapper";
import { getDestinationObject } from "~/utils/backend/getDestinationObject";
import { Integrations_Enum } from "~/graphql/backend/sdk";
import { GetDestinationTablesPayload, GetDestinationTablesResponse } from "~/types/shared/functions";

export default wrapper('client', async function handler({ req, user, logger }) {
  const { integrationId, authentication } = req.body as GetDestinationTablesPayload;

  if ( integrationId === Integrations_Enum.Coda ) { return { status: 200, message: { tables: [] }} }
  const Destination = getDestinationObject({ integrationId, authentication, logger, userId: user.id });
  if ( !Destination ) { return { status: 500, message: "Internal Error" }}
  await Destination.init();

  return Destination.getTables()
  .then(response => ({ status: 200, message: response as GetDestinationTablesResponse }))
})