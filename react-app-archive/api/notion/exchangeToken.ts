import axios from "axios";

import { graphql, functionWrapper, Sentry, types, segment, logsnag } from "../_lib";

export default functionWrapper.client(async (req: types.ExchangeNotionTokenRequest, user): Promise<types.ExchangeNotionTokenResponse> => {
  const transaction = Sentry.startTransaction({ op: "app function", name: "Exchange notion token" });
  const scope = new Sentry.Scope();
  scope.setContext("Request Body", req.body);
  scope.setUser({ id: user.id });

  const { code, redirectUri } = req.body;

  return axios.post('https://api.notion.com/v1/oauth/token', {
    grant_type: "authorization_code",
    code,
    redirect_uri: redirectUri
  }, { auth: {
    username: process.env.REACT_APP_NOTION_OAUTH_CLIENT_ID!,
    password: process.env.NOTION_OAUTH_SECRET!
  }})
  .then(response => {
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
    .then(async () => {
      await segment.track({
        userId: user.id,
        event: segment.Events.NOTION_CONNECTION_ADDED
      })
      return { status: types.StatusCodes.OK, message: "OK" as "OK" }
    })
    .catch(error => {
      scope.setContext("Notion Connection Insert Error", error.response.errors);
      throw error
    })
  })
  .catch(async error => {
    await logsnag.logError({ operation: "Exchange notion token", error, scope, tags: { [logsnag.LogSnagTags.USER_ID]: user.id }})
    transaction.finish();
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  })
})