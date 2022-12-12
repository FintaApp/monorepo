export enum LogSnagTag {
  USER_ID = 'user-id',
  INSTITUTION = 'institution',
  ITEM_ID = 'item-id',
  SYNC_LOG_ID = 'sync-log-id',
  DESTINATION_ID = 'destination-id',
}

export enum LogSnagChannel {
  ACTIVITY = 'activity',
  ERRORS = 'errors',
  SYNCS = 'syncs'
}

export enum LogSnagEvent {
  USER_SIGNED_UP = "User Signed Up",
  USER_DELETED = "User Deleted",
  INSTITUTION_CREATED = "Institution Created",
  INSTITUTION_RECONNECTED = "Institution Reconnected",
  INSTITUTION_DELETED = "Institution Deleted",
  UNHANDLED = "Unhandled",
  SYNC_COMPLETED = "Sync Completed",
  SYNC_FAILED = "Sync Failed",
  INSTITUTION_ERROR_TRIGGERED = 'Institution Error Triggered',
  DESTINATION_ERROR_TRIGGERED = "Destination Error Triggered"
}