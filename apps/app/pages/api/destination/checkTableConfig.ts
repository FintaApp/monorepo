import { wrapper } from "~/utils/backend/apiWrapper";
import { getDestinationObject } from "~/utils/backend/getDestinationObject";

export default wrapper('client', async function handler({ req, user, logger }) {
  const { integrationId, credentials, tableId, fields, dataType } = req.body;

  const Destination = getDestinationObject({ integrationId, credentials });
  if ( !Destination ) { return { status: 500, message: "Internal Error" }}

  await Destination.init();
  return Destination.checkTable({ tableId, fields, tableType: dataType })
  .then(({ isValid, error }) => {
    return { 
      status: 200, 
      message: { isValid, error: error ? { ...error, table: dataType } : undefined }
    }
  })
})