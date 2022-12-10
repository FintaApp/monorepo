import { functionWrapper, Sentry, getDestinationObject, types, logsnag } from "../_lib";

export default functionWrapper.client(async (req: types.CheckDestinationCredentialsRequest, user): Promise<types.CheckDestinationCredentialsResponse> => {
  const transaction = Sentry.startTransaction({ op: "app function", name: "Check destination credentials" });
  const scope = new Sentry.Scope();

  scope.setContext("Request Body", req.body);
  scope.setUser({ id: user.id });

  const { integrationId, credentials } = req.body;

  const Destination = getDestinationObject({ integrationId, credentials });
  if ( !Destination ) { return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }}

  transaction.finish();
  return Destination.checkAuthentication()
  .then(response => ({ status: types.StatusCodes.OK, message: response }))
  .catch(async error => {
    await logsnag.logError({ operation: "Check destination credentials", scope, error, tags: {[logsnag.LogSnagTags.USER_ID]: user.id }});
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR } 
  })
  .finally(() => transaction.finish())
})