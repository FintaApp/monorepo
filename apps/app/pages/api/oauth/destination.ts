import { oauthFunctionWrapper } from "~/lib/functionWrappers";
import * as formatter from "~/lib/integrations/coda/formatter";

import { OauthGetDestinationResponse } from "@finta/shared";

export default oauthFunctionWrapper({ allowItemError: true }, async ({ destination }) => {
  return { status: 200, message: formatter.destination({ destination: destination! }) as OauthGetDestinationResponse }
});