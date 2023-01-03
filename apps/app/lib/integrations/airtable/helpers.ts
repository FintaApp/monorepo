import { Field, SyncError, Table } from "@prisma/client";
import AirtableError from "airtable/lib/airtable_error";

import { logUnhandledEvent } from "../../logsnag"

export const parseAirtableError = async (err: AirtableError, tableId: string, table: Table): Promise<{ code: SyncError, table?: Table, tableId?: string; field?: Field, fieldId?: string; }> => {
  if ( err.message === 'Could not find what you are looking for' || err.error === "AUTHENTICATION_REQUIRED" || err.message === 'Base not found') {
    return {
      code: SyncError.InvalidCredentials
    }
  } else if ( err.message.startsWith("Could not find table") ) {
    return {
      code: SyncError.MissingTable,
      table,
      tableId: table,
    }
  } else if ( err.error === "UNKNOWN_FIELD_NAME" ) {
    const fieldId = err.message.split(": ")[1].replace(/"/g, '')
    return {
      code: SyncError.MissingField,
      table,
      tableId,
      fieldId
    }
  } else {
    await logUnhandledEvent(`Unhandled Airtable error - ${err.error}: ${err.message}`)

    return {
      code: SyncError.UnknownError,
      table
    }
  }
};

export const getAuthorizationHeader = () => {
  const encodedCredentials = Buffer.from(`${process.env.AIRTABLE_OAUTH_CLIENT_ID}:${process.env.AIRTABLE_OAUTH_SECRET}`).toString('base64');
  return `Basic ${encodedCredentials}`
}