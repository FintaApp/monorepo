import { DBEventPayload } from "~/types/backend/db";
import { wrapper } from "~/utils/backend/apiWrapper";
import * as dbEventFunctions from "~/utils/backend/dbEventFunctions";

export default wrapper('public', async function handler({ req, logger }) {
  const body = req.body as DBEventPayload;
  
  const func = dbEventFunctions[body.trigger.name as keyof typeof dbEventFunctions];
  
  if ( !func ) { logger.error(new Error("Trigger doesn't have an event function"))};

  return func({ body, logger }).then(() => ({ status: 200, message: "OK"}))
})