import { wrapper } from "~/utils/backend/apiWrapper";
import { db } from "~/lib/db";

export default wrapper('public', async function handler({ req, logger }) {
    const { code } = req.body;

  // Check for code
  const codaCredential = await db.codaCredential.findFirstOrThrow({ where: { id: code }});
  logger.info("Get Coda credential response", { codaCredential });
  if ( !codaCredential ) {
    return { status: 404, message: "Code not found" }
  }

  const { accessToken } = codaCredential;

  await db.codaCredential.update({ where: { id: code }, data: { exchangedAt: new Date() }})

  return { status: 200, message: { access_token: accessToken }}
})