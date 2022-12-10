import { functionWrapper, Sentry, graphql, segment, zendesk, types, logsnag } from "../_lib";

export default functionWrapper.client(async(req: types.CreateSupportTicketRequest, user): Promise<types.CreateSupportTicketResponse> => {
  const transaction = Sentry.startTransaction({ op: "app function", name: "create support ticket" });
  const scope = new Sentry.Scope();
  scope.setContext("Request Body", req.body);
  scope.setUser({ id: user.id });

  const { body, subject } = req.body;
  const userData = await graphql.GetUser({ user_id: user.id }).then(response => response.user as types.UserModel);
  if ( !userData ) { return { status: 500, message: types.ErrorResponseMessages.INERNAL_ERROR } };

  const { status, message } = await zendesk.createTicket({ subject, body, user: userData })
  .then(async () => {
    await segment.track({
      userId: user.id,
      event: segment.Events.SUPPORT_TICKET_CREATED
    });
    return { status: types.StatusCodes.OK, message: "OK" }
  })
  .catch(async error => {
    await logsnag.logError({ error, operation: "create support ticket", scope, tags: { [logsnag.LogSnagTags.USER_ID]: user.id }})
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  });
  transaction.finish();
  return { status, message }
})