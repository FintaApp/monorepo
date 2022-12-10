import moment from 'moment-timezone';

import { functionWrapper, logsnag, Sentry, graphql, stripe, types } from "../_lib";

export default functionWrapper.client(async(req: types.CreateCheckoutPortalSessionRequest, user): Promise<types.CreateCheckoutPortalSessionResponse> => {
  const transaction = Sentry.startTransaction({ op: "app function", name: "create stripe checkout portal session" });
  const scope = new Sentry.Scope();
  scope.setContext("Request Body", req.body);
  scope.setUser({ id: user.id });

  const { priceId, successUrl, cancelUrl } = req.body;

  const { customer: { id: customerId }, trialEndsAt } = await graphql.GetUser({ user_id: user.id }).then(response => response.user!.stripeData)

  const trialEnd = moment(trialEndsAt).isSameOrAfter(moment().add(48, 'hour')) ? moment(trialEndsAt).unix() : undefined;
  const trialPeriodDays = moment(trialEndsAt).isSameOrAfter(moment().add(12, 'hour')) && moment(trialEndsAt).isBefore(moment().add(48, 'hour'))
    ? 1
    : undefined

  return stripe.createCheckoutPortalSession({ customerId, priceId, successUrl, cancelUrl, trialEnd, trialPeriodDays })
  .then(response => ({ status: 200, message: response }))
  .catch(async error => {
    await logsnag.logError({ error, scope, operation: "Create stripe checkout portal session", tags: { [logsnag.LogSnagTags.USER_ID]: user.id }})
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  })
  .finally(() => transaction.finish())
})
