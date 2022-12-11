import { wrapper } from "~/utils/backend/apiWrapper";
import { disableUser } from "~/utils/backend/disableUser";

export default wrapper('client', async function handler({ req, user, logger }) {
  return disableUser(user.id)
  .then(() => ({ status: 200, message: "OK" }))
  .catch(async error => {
    await logger.error(error)
    return { status: 500, message: "Internal Error" }
  });
})