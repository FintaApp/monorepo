import { DBEventPayload, DBPlaidItem } from "../../types";
import { graphql } from "../../graphql";
import * as logsnag from "../../logsnag";
import * as plaid from "../../plaid";
import * as segment from "../../segment";
import { Products } from "plaid";

export const on_insert_plaid_item = async ({ body }: { body: DBEventPayload<'INSERT', DBPlaidItem> }) => {
  const { event: { data: { new: { id, access_token, user_id }}} } = body;

  await Promise.all([
    graphql.GetPlaidItem({ plaid_item_id: id })
    .then(response => {
      const item = response.plaidItem!;

      const trackPromise = segment.track({
        userId: user_id,
        event: segment.Events.INSTITUTION_CREATED,
        properties: { institution: item.institution.name }
      });

      const logsnagPromise = logsnag.publish({
        channel: logsnag.LogSnagChannel.ACTIVITY,
        event: logsnag.LogSnagEvent.INSTITUTION_CREATED,
        icon: "🏦",
        tags: { 
          [logsnag.LogSnagTags.INSTITUTION ]: item.institution.name, 
          [logsnag.LogSnagTags.USER_ID]: user_id,
          [logsnag.LogSnagTags.ITEM_ID]: id
        }
      });
      
      return Promise.all([ trackPromise, logsnagPromise ])
    }),

    plaid.getItem({ accessToken: access_token })
    .then(async response => {
      const { data: { item: { available_products, billed_products }} } = response;

      if ( available_products.includes('investments' as Products) ) {
        await plaid.getHoldings({ accessToken: access_token }).catch(() => null)
      }

      if ( available_products.includes('liabilities' as Products)) {
        await plaid.getLiabilities({ accessToken: access_token }).catch(() => null)
      }

      if ( available_products.includes('transactions' as Products) || billed_products.includes('transactions' as Products)) {
        await plaid.transactionsSync({ accessToken: access_token })
      }

      return graphql.UpdatePlaidItem({ plaid_item_id: id, _set: { available_products, billed_products }})
    })
  ])
}