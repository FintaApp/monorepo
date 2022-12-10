import { crypto, graphql, Sentry, functionWrapper, logsnag } from "../_lib";


export default functionWrapper.public(async(req) => {
  const transaction = Sentry.startTransaction({ op: "oauth function", name: "Exchange access token" });
  const scope = new Sentry.Scope();
  
  const { body } = req;
  scope.setContext("Request Body", body);

  const { client_id, client_secret, code } = body;
  const clientSecretHash = crypto.hash(client_secret);

  // Check client credentials
  const isAuthValid = await graphql.GetOauthClients({ where: {
    id: { _eq: client_id },
    secret_hash: { _eq: clientSecretHash }
  }}).then(response => response.oauth_clients.length === 1);

  if (!isAuthValid) {
    transaction.finish();
    return { status: 401, message: "Not Authorized" }
  }

  // Check for code
  const oauthCodeData = await graphql.GetOauthCode({ code }).then(response => response.oauth_code?.oauth_client_id === client_id ? response.oauth_code : null )
  if ( !oauthCodeData ) {
    transaction.finish();
    return { status: 404, message: "Code not found" }
  }

  // Set destination to ready
  const { access_token } = oauthCodeData;
  const accessTokenHash = crypto.hash(access_token);


  const destination = await graphql.GetDestinations({ where: { authentication: { _contains: { access_token_hash: accessTokenHash }}}})
  .then(response => response.destinations[0])
  
  if ( !destination ) { 
    scope.setContext("Data", { accessTokenHash });
    await logsnag.logError({ operation: "Exchange access token", scope, error: new Error("Missing Destination") })
    transaction.finish();
    return { status: 500, message: "Internal Error" }
  }

  await graphql.UpdateDestination({ destination_id: destination.id, _set: { is_ready: true }})

  return { status: 200, message: { access_token }}
})