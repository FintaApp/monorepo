import { wrapper } from "~/utils/backend/apiWrapper";
import { createLinkToken, PlaidEnv } from "~/utils/backend/plaid";

import { CreatePlaidLinkTokenPayload, CreatePlaidLinkTokenResponse } from "~/types/shared/functions";
import { graphql } from "~/graphql/backend";

export default wrapper('client', async function handler({ req, user, logger }) {
  const { accessToken, products, originUrl, plaidEnv, isAccountSelectionEnabled } = req.body as CreatePlaidLinkTokenPayload;
  const webhookURL = `${originUrl}/api/plaid/webhook`;
  const redirectUri = `${originUrl}/plaid-oauth`;
  
  return createLinkToken({
    userId: user.id,
    products,
    accessToken,
    webhookURL,
    redirectUri,
    env: plaidEnv as PlaidEnv,
    isAccountSelectionEnabled
  })
  .then(async response => {
    logger.info("Link token created", { data: response.data });

    await graphql.UpdateUser({ userId: user.id, _append: { metadata: { activeLinkToken: response.data.link_token }}})
    return { status: 200, message: response.data as CreatePlaidLinkTokenResponse }
  })
  .catch(async error => {
    logger.error(error, { data: error.response.data });
    return { status: 500, message: "Internal Error"}
  }) 
})