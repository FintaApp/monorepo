import { ItemErrorWebhook } from "plaid";

import { graphql } from "~/graphql/backend";
import * as segment from "~/utils/backend/analytics";
import { PlaidItemModel } from "~/types/backend/models";
import { Logger } from "../logger";

export const handleItemError = async ({ item, data, logger }: { logger: Logger, item: PlaidItemModel; data: ItemErrorWebhook | { error: { error_code: string }}; }) => {
  const { error_code } = data.error || { error_code: null };
  const { user, institution } = item;
  if ( !user.email ) { return; }

  await logger.logInstitutionErrorTriggered({
    userId: item.user.id,
    institution: item.institution.name,
    itemId: item.id,
    error: error_code
  })

  await graphql.UpdatePlaidItem({ plaidItemId: item.id, _set: { error: error_code }})
  .then(() => {
    return Promise.all([
      segment.trackInstitutionErrorTriggered({
        userId: user.id,
        institution: institution.name,
        error: error_code,
        plaidItemId: item.id
      })
    ])
  })
}