import * as formatter from "~/utils/backend/formatter";
import { wrapper } from "~/utils/backend/apiWrapper";

import { OauthGetDestinationResponse } from "@finta/shared";

export default wrapper('oauth', async function handler({ req, destination }) {
  return ({ status: 200, message: formatter.coda.destination({ destination: destination! }) })
})
