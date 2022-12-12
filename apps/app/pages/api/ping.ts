import { wrapper } from "~/utils/backend/apiWrapper";

export default wrapper('public', async function handler({ req, logger }) {
  logger.info("Pong");
  return { status: 200, message: "Pong"}
})