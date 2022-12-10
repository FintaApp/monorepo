import { functionWrapper, Sentry, graphql, formatter, logsnag, types } from "../_lib";
import { getOauthPlaidItems } from "./_helpers";
import { OauthGetInstitutionsResponse } from "@finta/types";

export default functionWrapper.oauth(async (req, destination, plaidEnv, asAdmin) => {
  const transaction = Sentry.startTransaction({ op: "oauth function", name: "Get institutions" });
  const scope = new Sentry.Scope();

  const { user } = destination;
  scope.setUser({ id: user.id, email: user.email });
  scope.setContext("Destination ID", destination.id);

  const trigger = 'destination'
  const syncLog = await graphql.InsertSyncLog({ sync_log: { 
    trigger,
    destination_sync_logs: { data: [{ destination_id: destination.id }]},
    metadata: { 'target_table': 'institutions', asAdmin }
  }}).then(response => response.sync_log!);
  scope.setContext("Sync Log ID", syncLog.id);
  await logsnag.publish({ 
    channel: logsnag.LogSnagChannel.SYNCS, 
    icon: '🏁', 
    event: logsnag.LogSnagEvent.SYNC_STARTED, 
    tags: {
      [logsnag.LogSnagTags.USER_ID]: destination.user.id,
      [logsnag.LogSnagTags.DESTINATION_ID]: destination.id,
      [logsnag.LogSnagTags.INTEGRATION]: destination.integration.id,
      [logsnag.LogSnagTags.TRIGGER]: trigger,
      [logsnag.LogSnagTags.SYNC_LOG_ID]: syncLog.id
    }
  })

  return getOauthPlaidItems(destination.id, undefined, true)
  .then(async data => {
    const items = data.plaid_items.map(item => formatter.coda.institution({ item }));
    await Promise.all([
      graphql.InsertPlaidItemSyncLogs({ 
      plaid_item_sync_logs: items.map(item => ({ 
        plaid_item_id: item.id,
        sync_log_id: syncLog.id,
      }))
    }),
    logsnag.publish({
      channel: logsnag.LogSnagChannel.SYNCS,
      event: logsnag.LogSnagEvent.SYNC_COMPLETED,
      description: `${items.length} institutions(s) synced\nTarget table: instututions`,
      icon: '☑️',
      tags: {
        [logsnag.LogSnagTags.USER_ID]: destination.user.id,
        [logsnag.LogSnagTags.IS_SUCCESS]: true,
        [logsnag.LogSnagTags.DESTINATION_ID]: destination.id,
        [logsnag.LogSnagTags.TRIGGER]: trigger,
        [logsnag.LogSnagTags.SYNC_LOG_ID]: syncLog.id
      }
    }),
    graphql.UpdateSyncLog({
      sync_log_id: syncLog.id,
      _set: {
        is_success: true,
        ended_at: new Date()
      }
    })
  ])

    return { status: types.StatusCodes.OK, message: { institutions: items }} as types.OauthFunctionResponse<OauthGetInstitutionsResponse>
  })
  .catch(async error => {
    await graphql.UpdateSyncLog({
      sync_log_id: syncLog.id,
      _set: {
        error: {
          error_code: 'internal_error'
        },
        is_success: false,
        ended_at: new Date()
      }
    });
    await logsnag.logError({ error, scope, operation: 'oauth sync institutions', tags: { [logsnag.LogSnagTags.SYNC_LOG_ID]: syncLog.id, [logsnag.LogSnagTags.DESTINATION_ID]: destination.id }})
    transaction.finish();
    return { status: types.StatusCodes.INTERNAL_SERVER_ERROR, message: types.ErrorResponseMessages.INERNAL_ERROR }
  });
})