import { wrapper } from "~/utils/backend/apiWrapper";
import * as zendesk from "~/utils/backend/zendesk";
import { trackSupportTicketCreated } from "~/utils/backend/analytics";
import { CreateSupportTicketPayload, CreateSupportTicketResponse } from "~/types/shared/functions";

export default wrapper('client', async function handler({ req, user, logger }) {
  const { body, subject } = req.body as CreateSupportTicketPayload;
  
  return zendesk.createTicket({ subject, body, user })
  .then(() => {
    trackSupportTicketCreated({ userId: user.id });
    logger.info("Support ticket sent");
    return { status: 200, message: "OK" as CreateSupportTicketResponse}
  })
})