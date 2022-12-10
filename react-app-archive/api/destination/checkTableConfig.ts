import { functionWrapper, Sentry, getDestinationObject, types, logsnag } from "../_lib";

export default functionWrapper.client(async (req: types.CheckDestinationTableConfigRequest, user): Promise<types.CheckDestinationTableConfigResponse> => {
  const transaction = Sentry.startTransaction({ op: "app function", name: "Check destination table config" });
  const scope = new Sentry.Scope();
  scope.setContext("Request Body", req.body);
  scope.setUser({ id: user.id });

  const { integrationId, credentials, tableId, fields, dataType } = req.body;

  const Destination = getDestinationObject({ integrationId, credentials });
  if ( !Destination ) { return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }}

  await Destination.init();
  return Destination.checkTable({ tableId, fields, tableType: dataType })
  .then(({ isValid, error }) => {
    transaction.finish();
    return { 
      status: types.StatusCodes.OK, 
      message: { isValid, error: error ? { ...error, table: dataType } : undefined }
    }
  })
  .catch(async error => {
    await logsnag.logError({ operation: "Check destination table config", scope, error, tags: {[logsnag.LogSnagTags.USER_ID]: user.id }});
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  })
})