import { graphql } from "~/graphql/backend";
import * as crypto from "~/utils/backend/crypto";
import { wrapper } from "~/utils/backend/apiWrapper";

export default wrapper('client', async function handler({ req, user, logger }) {
  const { clientId } = req.body;

  const accessToken = crypto.createToken()!;
  const hash = crypto.hash(accessToken);

  const { status, message } = await graphql.InsertOauthCode({ oauth_code: { oauth_client_id: clientId, access_token: accessToken }})
  .then(response => {
    const { code } = response.oauth_code!;
    return { status: 200 , message: {
      code,
      accessTokenHash: hash
    }}
  })
  .catch(async error => {
    await logger.error(error);
    return { status: 500, message: "Internal Error"}
  })

  return { status, message }
})