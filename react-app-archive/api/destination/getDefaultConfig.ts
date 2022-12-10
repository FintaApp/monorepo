import { functionWrapper, Sentry, getDestinationObject, types, logsnag } from "../_lib";

export default functionWrapper.client(async (req: types.GetDestinationTableDefaultConfigRequest, user): Promise<types.GetDestinationTableDefaultConfigResponse> => {
  const transaction = Sentry.startTransaction({ op: "app function", name: "Check destination default config" });
  const scope = new Sentry.Scope();
  scope.setContext("Request Body", req.body);
  scope.setUser({ id: user.id });

  const { integrationId, credentials } = req.body;

  const Destination = getDestinationObject({ integrationId, credentials });
  if ( !Destination ) { return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }}

  await Destination.init();
  return Destination.getDefaultConfig()
  .then(response => ({ status: types.StatusCodes.OK, message: { tableConfigs: response }}))
  .catch(async error => {
    await logsnag.logError({ operation: "Get destination default config", error, scope, tags: {[logsnag.LogSnagTags.USER_ID]: user.id }});
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  })
  .finally(() => transaction.finish())
})