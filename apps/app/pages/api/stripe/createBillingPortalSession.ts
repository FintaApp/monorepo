import { wrapper } from "~/utils/backend/apiWrapper";
import { createBillingPortalSession } from "~/utils/backend/stripe";

import { CreateBillingPortalSessionPayload, CreateBillingPortalSessionResponse } from "~/types/shared/functions";
import { graphql } from "~/graphql/backend";

export default wrapper('client', async function handler({ req, user, logger }) {
  const { returnUrl } = req.body as CreateBillingPortalSessionPayload;
  const customerId = await graphql.GetUser({ userId: user.id })
    .then(response => {
      logger.info("Get user response", { response });
      return response.user!.profile.stripeData.customer.id
    });

  return createBillingPortalSession({ customerId, returnUrl })
  .then(response => ({ status: 200, message: response as CreateBillingPortalSessionResponse }))
})