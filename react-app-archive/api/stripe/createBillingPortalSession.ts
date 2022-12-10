import { functionWrapper, Sentry, graphql, stripe, logsnag, types } from "../_lib";

export default functionWrapper.client(async (req: types.CreateBillingPortalSessionRequest, user): Promise<types.CreateBillingPortalSessionResponse> => {
  const transaction = Sentry.startTransaction({ op: "app function", name: "create stripe billing portal session" });
  const scope = new Sentry.Scope();
  scope.setContext("Request Body", req.body);
  scope.setUser({ id: user.id });

  const { returnUrl } = req.body;

  const customerId = await graphql.GetUser({ user_id: user.id }).then(response => response.user!.stripeData.customer.id);

  return stripe.createBillingPortalSession({ customerId, returnUrl })
  .then(response => ({ status: types.StatusCodes.OK, message: response }))
  .catch(async error => {
    await logsnag.logError({ error, scope, operation: "Create stripe billing portal session", tags: { [logsnag.LogSnagTags.USER_ID]: user.id }})
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  })
  .finally(() => transaction.finish())
})