import { graphql, functionWrapper, crypto, Sentry, types, logsnag } from "../_lib";

export default functionWrapper.client(async (req: types.CreateCodeRequest, user): Promise<types.CreateCodeResponse> => {
  const transaction = Sentry.startTransaction({ op: "app function", name: "Create oauth code" });
  const scope = new Sentry.Scope();
  scope.setContext("Request Body", req.body);
  scope.setUser({ id: user.id });
  const { clientId } = req.body;

  const accessToken = crypto.createToken()!;
  const hash = crypto.hash(accessToken);

  const { status, message } = await graphql.InsertOauthCode({ oauth_code: { oauth_client_id: clientId, access_token: accessToken }})
  .then(response => {
    const { code } = response.oauth_code!;
    return { status: types.StatusCodes.OK , message: {
      code,
      accessTokenHash: hash
    }}
  })
  .catch(async error => {
    await logsnag.logError({ operation: "Create oauth code" , scope, error, tags: { [logsnag.LogSnagTags.USER_ID]: user.id }})
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  })

  transaction.finish();
  return { status, message }
})