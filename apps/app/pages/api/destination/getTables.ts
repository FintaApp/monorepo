import { wrapper } from "~/utils/backend/apiWrapper";
import { getDestinationObject } from "~/utils/backend/getDestinationObject";
import { Integrations_Enum } from "~/graphql/backend/sdk";

export default wrapper('client', async function handler({ req, user }) {
  const { integrationId, credentials } = req.body;

  if ( integrationId === Integrations_Enum.Coda ) { return { status: 200, message: { tables: [] }} }
  const Destination = getDestinationObject({ integrationId, credentials });
  if ( !Destination ) { return { status: 500, message: "Internal Error" }}

  await Destination.init();
  return Destination.getTables()
  .then(tables => ({ status: 200, message: { tables }}))
})