import { wrapper } from "~/utils/backend/apiWrapper";
import { exchangePublicToken, PlaidEnv } from "~/utils/backend/plaid";

import { ExchangePlaidPublicTokenPayload, ExchangePlaidPublicTokenResponse } from "~/types/shared/functions";

export default wrapper('client', async function handler({ req, user, logger }) {
  const { publicToken } = req.body as ExchangePlaidPublicTokenPayload;

  return exchangePublicToken({ publicToken })
  .then(async response => {
    logger.info("Public token exchanged", { response: response.data });
    return { status: 200, message: response.data as ExchangePlaidPublicTokenResponse }
  })
  .catch(async error => {
    logger.error(error, { data: error.response.data });
    return { status: 500, message: "Internal Error"}
  })
})