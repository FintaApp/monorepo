import { publicFunctionWrapper } from "~/lib/functionWrappers";
import { db } from "~/lib/db";
import { removeItem } from "~/lib/plaid";

export default publicFunctionWrapper(async ({ req, logger }) => {
  const { user_id: userId } = req.body;

  const user = await db.user.findFirstOrThrow({ where: { id: userId }});
  logger.info("Fetched user", { user });

  await db.plaidItem.findMany({ where: { userId }})
    .then(items => Promise.all(items.map(item => removeItem({ accessToken: item.accessToken }).catch(() => null))));

  await db.plaidItem.updateMany({ where: { userId }, data: { disabledAt: new Date() }})

  return { status: 200, message: "OK" }
})