import { graphql } from "~/graphql/backend";
import { DBEventPayload, DBPlaidItem } from "~/types/backend/db";
import { Logger } from "../logger";
import { trackInstitutionCreated } from "../analytics";
import * as plaid from "~/utils/backend/plaid";
import { Products } from "plaid";

export const onInsertPlaidItem = async ({ body, logger }: { body: DBEventPayload<'INSERT', DBPlaidItem> | DBEventPayload<'MANUAL', DBPlaidItem>; logger: Logger }) => {
  const { op, data: { new: newPlaidItem } } = body.event;

  if ( op === 'INSERT' ) {
    const plaidItem = await graphql.GetPlaidItem({ plaidItemId: newPlaidItem.id })
      .then(response => {
        logger.info("Fetched Plaid item", { response });
        return response.plaidItem!
      })

    await Promise.all([
      trackInstitutionCreated({ userId: newPlaidItem.user_id, institution: plaidItem.institution.name, itemId: newPlaidItem.id })
        .then(() => logger.info("Institution created event tracked")),
      logger.logInstitutionCreated({ institution: plaidItem.institution.name, userId: newPlaidItem.user_id, itemId: newPlaidItem.id })
    ]);
  }

  const accessToken = newPlaidItem.access_token;

  return plaid.getItem({ accessToken })
  .then(async response => {
    logger.info("Fetched Plaid data", { data: response.data });
    const { data: { item: { available_products, billed_products }}} = response;

    if ( available_products.includes('investments' as Products)) {
      await plaid.getHoldings({ accessToken })
        .then(() => logger.info("Initiated holdings"))
        .catch(error => logger.info("Failed to initiate holdings", { error: error.response.data }))
    }

    if ( available_products.includes('liabilities' as Products)) {
      await plaid.getLiabilities({ accessToken })
        .then(() => logger.info("Initiated liabilities"))
        .catch(error => logger.info("Failed to initiate liabilities", { error: error.response.data }))
    }

    if ( available_products.includes('transactions' as Products) || billed_products.includes('transactions' as Products)) {
      await plaid.transactionsSync({ accessToken })
        .then(() => logger.info("Initiated transactions"))
        .catch(error => logger.info("Failed to initiate transactions", { error: error.response.data }))
    }

    return graphql.UpdatePlaidItem({ plaidItemId: newPlaidItem.id, _set: { available_products, billed_products }})
      .then(response => logger.info("Updated plaid item", { response }))
  })
}