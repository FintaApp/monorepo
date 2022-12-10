import { functionWrapper, plaid, Sentry, logsnag, types } from "../_lib";

export default functionWrapper.client(async (req: types.ExchangePlaidPublicTokenRequest, user): Promise<types.ExchangePlaidPublicTokenResponse> => {
  const transaction = Sentry.startTransaction({ op: "app function", name: "Exchange public token" });
  const scope = new Sentry.Scope();
  scope.setUser({ id: user.id });
  scope.setContext("Request Body", req.body);

  const { publicToken, plaidEnv } = req.body;

  return plaid.exchangePublicToken({ publicToken, env: plaidEnv as plaid.PlaidEnv })
  .then(response => ({ status: types.StatusCodes.OK, message: response.data }))
  .catch(async error => {
    await logsnag.logError({ operation: 'exchange public token', error, scope, tags: { [logsnag.LogSnagTags.USER_ID]: user.id }})
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  })
  .finally(() => transaction.finish())
})
