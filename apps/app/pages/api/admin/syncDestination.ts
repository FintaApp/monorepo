import { publicFunctionWrapper } from "~/lib/functionWrappers";
import _ from "lodash";
import { inngest } from "~/lib/inngest";

export default publicFunctionWrapper(async ({ req, logger }) => {
  const destinationId = req.body.destinationId;
  if ( !destinationId ) { return { status: 400, message: "Missing destinationId" }};
  const response = await inngest.send({
    name: 'destination/sync',
    data: { destinationId }
  });

  return { status: 200, message: "OK"}
})