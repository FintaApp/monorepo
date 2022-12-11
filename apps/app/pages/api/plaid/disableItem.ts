import { wrapper } from "~/utils/backend/apiWrapper";
import { DisablePlaidItemPayload, DisablePlaidItemResponse } from "~/types/shared/functions";
import { graphql } from "~/graphql/backend";
import { removeItem } from "~/utils/backend/plaid"

export default wrapper('client', async function handler({ req, user, logger }) {
  const { plaidItemId } = req.body as DisablePlaidItemPayload;

  const plaidItem = await graphql.GetPlaidItem({ plaidItemId })
    .then(response => {
      logger.info("Plaid item fetched", { response });
      return response.plaidItem!
    })

  await Promise.all([
    removeItem({ accessToken: plaidItem.accessToken })
      .then(response => logger.info("Item's access token revoked", { data: response.data }))
      .catch(error => logger.error(new Error("Revoke access token error"), { error: error.response })),

    graphql.DeleteDestinationAccounts({ where: { account: { plaid_item_id: { _eq: plaidItemId }}}})
      .then(response => logger.info("Destination accounts deleted", { response }))
      .catch(error => logger.error(error, { error })),

    graphql.UpdatePlaidItem({ plaidItemId, _set: { disabled_at: new Date() }})
      .then(response => logger.info("Plaid item disabled", { response }))
      .catch(error => logger.error(error, { error }))
  ]);

  return { status: 200, message: "OK" as DisablePlaidItemResponse}
})