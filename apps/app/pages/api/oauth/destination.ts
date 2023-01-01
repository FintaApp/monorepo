import { wrapper } from "~/lib/apiWrapper";
import * as formatter from "~/lib/integrations/coda/formatter";
import { getDestinationFromRequest } from "~/lib/getDestinationFromRequest";

import { OauthGetDestinationResponse } from "@finta/shared";

export default wrapper(async ({ req, logger }) => {
  const { destination } = await getDestinationFromRequest({ req, logger });
  if ( !destination ) { return { status: 404, message: "Destination not found" }};
  return { status: 200, message: formatter.destination({ destination: destination! }) as OauthGetDestinationResponse }
});