import { wrapper } from "~/utils/backend/apiWrapper";

import { disableUser } from "~/utils/backend/disableUser";

export default wrapper('public', async function handler({ req, logger }) {
  const { user_id } = req.body;
  
  return disableUser(user_id)
  .then(() => {
    logger.info("User disabled");
    return { status: 200, message: "OK" }
  })
});