// Source: https://github.com/Airtable/oauth-example/blob/main/index.js
import {  GetAirtableBasesPayload, GetAirtableBasesResponse } from "~/types/shared/functions";
import { wrapper } from "~/utils/backend/apiWrapper";
import { Airtable } from "~/utils/backend/integrations";

export default wrapper('client', async function handler({ req, user, logger }) {
  const {} = req.body as GetAirtableBasesPayload;
  
  const airtable = new Airtable({ logger, userId: user.id, authentication: { base_id: "" }});
  await airtable.init();
  
  return airtable.getBases()
  .then(response => {
    return { status: 200, message: response as GetAirtableBasesResponse }
  })
});