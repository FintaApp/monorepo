import axios from "axios";

import { graphql } from "~/graphql/backend";
import { wrapper } from "~/utils/backend/apiWrapper";

export default wrapper('client', async function handler({ req, user, logger }) {
  const { code, redirectUri } = req.body;

  return axios.post('https://api.notion.com/v1/oauth/token', {
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri
  }, { auth: {
    username: process.env.NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID!,
    password: process.env.NOTION_OAUTH_SECRET!
  }})
  .then(async response => {
    logger.info("Exchange Notion token response", { data: response.data })
    const { access_token, bot_id, workspace_name, workspace_icon, workspace_id, owner } = response.data;
    return graphql.InsertNotionConnection({
      notion_connection: {
        bot_id,
        access_token,
        workspace_name,
        workspace_icon,
        workspace_id,
        owner,
        user_id: user.id
      }
    })
    .then(async connection => {
      logger.info("Notion connection inserted", { response: connection });
      return ({ status: 200, message: "OK" })
    })
    .catch(error => {
      logger.error(error, { data: error.response.errors })
      return { status: 500, message: "Internal Error"}
    })
  })
  .catch(async error => {
    logger.error(error, { data: error.response.data })
    return { status: 500, message: "Internal Error"}
  })
});