import { wrapper } from "~/utils/backend/apiWrapper";
import { getDestinationObject } from "~/utils/backend/getDestinationObject";

export default wrapper('client', async function handler({ req, user, logger }) {
  const { integrationId, credentials } = req.body;

  const Destination = getDestinationObject({ integrationId, credentials });
  if ( !Destination ) { return { status: 500, message: "Internal Error" }}

  return Destination.checkAuthentication()
  .then(response => ({ status: 200, message: response }))
})