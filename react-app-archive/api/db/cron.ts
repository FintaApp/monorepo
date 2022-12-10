import { functionWrapper, cronFunctions, logsnag, Sentry, types } from "../_lib";

type CronEvent = 'insights';

export default functionWrapper.public(async (req) => {
  const transaction = Sentry.startTransaction({ op: "cron function", name: "Database Cron Event" });
  const scope = new Sentry.Scope();
  scope.setContext("Request Body", req.body);
  const { name } = req.body as { name: CronEvent };

  try {
    switch ( name ) {
      case 'insights': {
        await cronFunctions.insights();
        break;
      }
      default:
        throw new Error(`Unhandled cron event ${name}.`)
    }

    return { status: types.StatusCodes.OK, message: 'OK' }
  } catch (error) {
    await logsnag.logError({ error, operation: "Database Cron Event", scope })
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  } finally { transaction.finish(); }
})