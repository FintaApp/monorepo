import { functionWrapper, Sentry, graphql, disablePlaidItem, types, logsnag } from "../_lib"

export default functionWrapper.client(async (req: types.DisablePlaidItemRequest, user): Promise<types.DisablePlaidItemResponse> => {
  const transaction = Sentry.startTransaction({ op: "app function", name: "Revoke access token" });
  const scope = new Sentry.Scope();
  scope.setContext("Request Body", req.body);
  scope.setUser({ id: user.id });

  const { plaidItemId } = req.body;
  const { plaidItem } = await graphql.GetPlaidItem({ plaid_item_id: plaidItemId });
  if ( !plaidItem ) { return { status: types.StatusCodes.NOT_FOUND, message: types.ErrorResponseMessages.ITEM_NOT_FOUND }};

  const response = await disablePlaidItem(plaidItem)
  .catch(async error => {
    scope.setContext("Plaid error response", error.response.data);
    await logsnag.logError({ 
      operation: "Revoke access token", 
      error: new Error("Revoke access token error"),
      scope,
      tags: { [logsnag.LogSnagTags.USER_ID]: user.id }
    })
  });

  transaction.finish();

  if ( !response ) { return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }}

  return { status: types.StatusCodes.OK, message: "OK" }
})