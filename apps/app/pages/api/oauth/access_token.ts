import * as crypto from "~/utils/backend/crypto";
import { graphql } from "~/graphql/backend";
import { wrapper } from "~/utils/backend/apiWrapper";


export default wrapper('public', async function handler({ req, logger }) {
    const { client_id, client_secret, code } = req.body;
  const clientSecretHash = crypto.hash(client_secret);

  // Check client credentials
  const isAuthValid = await graphql.GetOauthClients({ where: {
    id: { _eq: client_id },
    secret_hash: { _eq: clientSecretHash }
  }}).then(response => {
    logger.info("Get Oauth clients response", { response });
    return response.oauth_clients.length === 1
  });

  if (!isAuthValid) {
    return { status: 401, message: "Not Authorized" }
  }

  // Check for code
  const oauthCodeData = await graphql.GetOauthCode({ code }).then(response => {
    logger.info("Get Oauth code response", { response });
    return response.oauth_code?.oauth_client_id === client_id ? response.oauth_code : null
  } )
  if ( !oauthCodeData ) {
    return { status: 404, message: "Code not found" }
  }

  // Set destination to ready
  const { access_token } = oauthCodeData;
  const accessTokenHash = crypto.hash(access_token);


  const destination = await graphql.GetDestinations({ where: { authentication: { _contains: { access_token_hash: accessTokenHash }}}})
  .then(response => {
    logger.info("Get Destinations response", { response });
    return response.destinations[0]
  })
  
  if ( !destination ) { 
    logger.error(new Error("Missing destination"), { accessTokenHash })
    return { status: 500, message: "Internal Error" }
  }

  await graphql.UpdateDestination({ destinationId: destination.id, _set: { is_ready: true }})
    .then(response => logger.info("Destination updated", { response }))

  return { status: 200, message: { access_token }}
})