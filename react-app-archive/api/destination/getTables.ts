import { functionWrapper, Sentry, getDestinationObject, logsnag, types } from "../_lib";
import { Integrations_Enum } from "../_lib/graphql/sdk";

export default functionWrapper.client(async (req: types.GetDestinationTableDefaultConfigRequest, user): Promise<types.GetDestinationTablesResponse> => {
  const transaction = Sentry.startTransaction({ op: "app function", name: "Get destination tables" });
  const scope = new Sentry.Scope();
  scope.setContext("Request Body", req.body);
  scope.setUser({ id: user.id });

  const { integrationId, credentials } = req.body;

  if ( integrationId === Integrations_Enum.Coda ) { return { status: types.StatusCodes.OK, message: { tables: [] }} }
  const Destination = getDestinationObject({ integrationId, credentials });
  if ( !Destination ) { return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }}

  await Destination.init();
  return Destination.getTables()
  .then(tables => ({ status: types.StatusCodes.OK, message: { tables }}))
  .catch(async error => {
    await logsnag.logError({ operation: "Get destination tables", scope, error, tags: {[logsnag.LogSnagTags.USER_ID]: user.id }})
    transaction.finish();
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  })
})