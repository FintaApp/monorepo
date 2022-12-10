import AirtableError from "airtable/lib/airtable_error";
import { DestinationError, DestinationErrorCode, DestinationTableTypes } from "@finta/types"

import * as logsnag from "../logsnag";

export const parseAirtableError = async (err: AirtableError, table: string, tableType: DestinationTableTypes): Promise<DestinationError> => {
  if ( err.message === 'Could not find what you are looking for' || err.error === "AUTHENTICATION_REQUIRED" || err.message === 'Base not found') {
    return {
      errorCode: DestinationErrorCode.INVALID_CREDENTIALS
    }
  } else if ( err.message.startsWith("Could not find table") ) {
    return {
      errorCode: DestinationErrorCode.MISSING_TABLE,
      table,
      tableId: table,
      tableType
    }
  } else if ( err.error === "UNKNOWN_FIELD_NAME" ) {
    const field = err.message.split(": ")[1].replace(/"/g, '')
    return {
      errorCode: DestinationErrorCode.MISSING_FIELD,
      table,
      field,
      tableId: table,
      fieldId: field,
      tableType
    }
  } else {
    await logsnag.publish({
      channel: logsnag.LogSnagChannel.ERRORS,
      event: logsnag.LogSnagEvent.UNHANDLED,
      description: `Unhandled Airtable error - ${err.error}: ${err.message}`,
      icon: '😶'
    })

    return {
      errorCode: DestinationErrorCode.UNKNOWN_ERROR,
      tableType
    }
  }
};