import { graphql } from "~/graphql/backend";
import { DBEventPayload, DBPlaidItem } from "~/types/backend/db";
import { Logger } from "../logger";
import { trackInstitutionDeleted, trackInstitutionReconnected } from "../analytics";

export const onUpdatePlaidItem = async ({ body, logger }: { body: DBEventPayload<'UPDATE', DBPlaidItem> ; logger: Logger }) => {
  const { old: oldPlaidItem, new: newPlaidItem } = body.event.data;

  const { user_id: userId, id: itemId } = newPlaidItem;
  const plaidItem = await graphql.GetPlaidItem({ plaidItemId: itemId })
      .then(response => {
        logger.info("Fetched Plaid item", { response });
        return response.plaidItem!
      })

  if (( oldPlaidItem.error === 'ITEM_LOGIN_REQUIRED' && !newPlaidItem.error ) || ( !!oldPlaidItem.consent_expires_at && !newPlaidItem.consent_expires_at )) {
    await Promise.all([
      trackInstitutionReconnected({ userId, itemId })
        .then(() => logger.info("Institution reconnected event tracked")),
      logger.logInstitutionReconnected({ userId, institution: plaidItem.institution.name, itemId })
    ])
  }

  if ( !oldPlaidItem.disabled_at && !!newPlaidItem.disabled_at ) {
    await Promise.all([
      trackInstitutionDeleted({ userId, itemId })
        .then(() => logger.info("Institution deleted event tracked")),
      logger.logInstitutionDeleted({ institution: plaidItem.institution.name, userId, itemId })
    ])
  }
}