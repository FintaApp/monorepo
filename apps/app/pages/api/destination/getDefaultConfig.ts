import { GetDestinationTableDefaultConfigPayload, GetDestinationTableDefaultConfigResponse } from "~/types/shared/functions";
import { wrapper } from "~/utils/backend/apiWrapper";
import { getDestinationObject } from "~/utils/backend/getDestinationObject";

export default wrapper('client', async function handler({ req, user, logger }) {
  const { integrationId, authentication } = req.body as GetDestinationTableDefaultConfigPayload;

  const Destination = getDestinationObject({ integrationId, authentication, logger, userId: user.id });
  if ( !Destination ) { return { status: 500, message: "Internal Error" }}

  await Destination.init();

  return Destination.getDefaultConfig()
  .then(response => ({ status: 200, message: { tableConfigs: response as GetDestinationTableDefaultConfigResponse }}))
})