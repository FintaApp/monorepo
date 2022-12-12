import { wrapper } from "~/utils/backend/apiWrapper";
import { getDestinationObject } from "~/utils/backend/getDestinationObject";

export default wrapper('client', async function handler({ req, user }) {
  const { integrationId, credentials } = req.body;

  const Destination = getDestinationObject({ integrationId, credentials });
  if ( !Destination ) { return { status: 500, message: "Internal Error" }}

  await Destination.init();
  return Destination.getDefaultConfig()
  .then(response => ({ status: 200, message: { tableConfigs: response }}))
})