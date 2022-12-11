import moment from 'moment-timezone';

import { wrapper } from "~/utils/backend/apiWrapper";
import { createCheckoutPortalSession } from "~/utils/backend/stripe";


import { CreateCheckoutPortalSessionPayload, CreateCheckoutPortalSessionResponse } from "~/types/shared/functions";
import { graphql } from "~/graphql/backend";

export default wrapper('client', async function handler({ req, user, logger }) {
  const { priceId, successUrl, cancelUrl } = req.body as CreateCheckoutPortalSessionPayload;
  const { profile: { stripeData: { customer: { id: customerId }, trialEndsAt }} } = await graphql.GetUser({ userId: user.id })
    .then(response => {
      logger.info("Get user response", { response });
      return response.user!
    });
  
  const trialEnd = moment(trialEndsAt).isSameOrAfter(moment().add(48, 'hour')) ? moment(trialEndsAt).unix() : undefined;
  const trialPeriodDays = moment(trialEndsAt).isSameOrAfter(moment().add(12, 'hour')) && moment(trialEndsAt).isBefore(moment().add(48, 'hour'))
    ? 1
    : undefined

  return createCheckoutPortalSession({ customerId, priceId, successUrl, cancelUrl, trialEnd, trialPeriodDays })
  .then(response => ({ status: 200, message: response as CreateCheckoutPortalSessionResponse }))
})