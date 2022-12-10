import { functionWrapper, formatter } from "../_lib";
import { OauthFunctionResponse } from "../_lib/types";
import { OauthGetDestinationResponse } from "@finta/types";

export default functionWrapper.oauth(async (req, destination) => ({ status: 200, message: formatter.coda.destination({ destination }) }) as OauthFunctionResponse<OauthGetDestinationResponse>);