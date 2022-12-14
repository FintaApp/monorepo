import { ValidateDestinationTableConfigsPayload, ValidateDestinationTableConfigsResponse } from "~/types/shared/functions";
import { wrapper } from "~/utils/backend/apiWrapper";
import { getDestinationObject } from "~/utils/backend/getDestinationObject";

export default wrapper('client', async function handler({ req, user, logger }) {
  const { integrationId, authentication, tableConfigs } = req.body as ValidateDestinationTableConfigsPayload;

  const Destination = getDestinationObject({ integrationId, authentication, logger, userId: user.id });
  if ( !Destination ) { return { status: 500, message: "Internal Error" }}

  await Destination.init();

  return Destination.validateTableConfigs({ tableConfigs })
  .then(({ isValid, errors }) => {
    return { 
      status: 200, 
      message: { isValid, errors } as ValidateDestinationTableConfigsResponse
    }
  })
})