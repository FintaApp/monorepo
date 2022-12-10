import { dbEventFunctions, functionWrapper, Sentry, types, logsnag } from "../_lib";

export default functionWrapper.public(async (req) => {
  const body = req.body as types.DBEventPayload;

  const transaction = Sentry.startTransaction({ op: "database event", name: body.trigger.name });
  const scope = new Sentry.Scope();
  scope.setContext("Request Body", req.body);

  const func = dbEventFunctions[body.trigger.name as keyof typeof dbEventFunctions];

  if ( !func ) { 
    await logsnag.logError({ operation: "database event", error: new Error("Trigger doesn't have an event function"), scope}) 
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  }

  const response = await func({ body })
  .then(() => {
    return { status: types.StatusCodes.OK, message: "OK" }
  })
  .catch(async error => {
    await logsnag.logError({ operation: "database event", error, scope})
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  })

  transaction.finish();
  return response;
})