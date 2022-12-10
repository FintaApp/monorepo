import { functionWrapper, plaid, Sentry, types, logsnag } from "../_lib";

export default functionWrapper.client(async (req: types.GetPlaidAccountsRequest, user): Promise<types.GetPlaidAccountsResponse> => {
  const transaction = Sentry.startTransaction({ op: "app function", name: "Get Plaid accounts" });
  const scope = new Sentry.Scope();
  scope.setContext("Request Body", req.body);
  scope.setUser({ id: user.id });
  const { accessToken } = req.body;
  const response = await plaid.getAccounts({ accessToken })
  .catch(async error => {
    if ( error.response.data?.error_code === 'ITEM_LOGIN_REQUIRED' ) {
      // TODO: Send back to client
      return null;
    }
    scope.setContext("Plaid error response", error.response.data);
    await logsnag.logError({ operation: "Get Plaid accounts", scope, error: new Error("Get Plaid Item error"), tags: {[logsnag.LogSnagTags.USER_ID]: user.id } })
  });

  transaction.finish();

  if ( !response ) {
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  }

  return { status: types.StatusCodes.OK, message: { accounts: response.data.accounts }}
})