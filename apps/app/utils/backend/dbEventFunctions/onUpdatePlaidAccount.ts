import { graphql } from "~/graphql/backend";
import { DBEventPayload, DBPlaidAccount } from "~/types/backend/db";
import { Logger } from "../logger";
import { trackPlaidAccountUpdated } from "../analytics";

export const onUpdatePlaidAccount = async ({ body, logger }: { body: DBEventPayload<'UPDATE', DBPlaidAccount> ; logger: Logger }) => {
  const { old: oldPlaidAccount, new: newPlaidAccount } = body.event.data;
  const plaidAccount = await graphql.GetPlaidAccount({ plaidAccountId: newPlaidAccount.id })
    .then(response => {
      logger.info("Fetched Plaid account", { response });
      return response.plaidAccount!
    })
  
  if ( oldPlaidAccount.name !== newPlaidAccount.name ) {
    await trackPlaidAccountUpdated({ userId: plaidAccount.item.user.id, field: 'name' })
      .then(() => logger.info("Plaid account updated event tracked"))
  }
}