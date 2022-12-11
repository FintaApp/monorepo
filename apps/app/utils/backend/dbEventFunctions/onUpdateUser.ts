import { graphql } from "~/graphql/backend";
import { DBEventPayload, DBUser } from "~/types/backend/db";
import { Logger } from "../logger";
import { updateCustomer } from "../stripe";
import { trackUserUpdated, identify } from "../analytics";

export const onUpdateUser = async ({ body, logger }: { body: DBEventPayload<'UPDATE', DBUser>; logger: Logger }) => {
  const { old: oldUser, new: newUser } = body.event.data;

  if ( newUser.display_name && newUser.display_name !== oldUser.display_name ) {
    const customerId = await graphql.GetUser({ userId: newUser.id })
      .then(response => {
        logger.info("Fetched user", { response });
        return response.user!.profile.stripeData.customer.id
      });
    
    await Promise.all([
      updateCustomer({ customerId, properties: { name: newUser.display_name }})
        .then(customer => logger.info("Stripe profile updated", { customer })),
      trackUserUpdated({ userId: newUser.id, field: 'display_name' })
        .then(() => logger.info("User updated event tracked")),
      identify({ userId: newUser.id, traits: { name: newUser.display_name }})
        .then(() => logger.info("User identified"))
    ])
  }
}