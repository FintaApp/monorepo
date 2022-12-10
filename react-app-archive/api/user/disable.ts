import { functionWrapper, Sentry, disableUser, types, logsnag } from "../_lib";

export default functionWrapper.client(async (req: types.DisableUserRequest, user): Promise<types.DisableUserResponse> => {
  const transaction = Sentry.startTransaction({ op: "app function", name: "Disable user" });
  const scope = new Sentry.Scope();
  scope.setContext("Request Body", req.body);
  scope.setUser({ id: user.id });

  const { status, message } = await disableUser(user.id)
  .then(() => ({ status: types.StatusCodes.OK, message: "OK" }))
  .catch(async error => {
    await logsnag.logError({ operation: "Disable user", error, scope, tags: {[logsnag.LogSnagTags.USER_ID]: user.id }})
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  });

  transaction.finish();
  return { status, message: message as any }
})