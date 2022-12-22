import { GoogleSheetsCredential, Integration, SyncError } from "@prisma/client";
import { GoogleSpreadsheet, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { drive_v3, google, sheets_v4 } from "googleapis";
import { GetDestinationTablesRepsonse, IntegrationBase, IntegrationBaseProps, ValidateDestinationCredentialsResponse } from "../base";

interface GoogleProps extends IntegrationBaseProps {
  credentials: GoogleSheetsCredential
}

export class Google extends IntegrationBase {
  spreadsheetId: string;
  doc?: GoogleSpreadsheet;
  sheets: sheets_v4.Sheets;
  drive: drive_v3.Drive;

  constructor({ userId, credentials }: GoogleProps) {
    super({ userId, credentials })
    this.spreadsheetId = credentials.spreadsheetId;
    this.integration = Integration.Google;

    const JwtClient = new google.auth.JWT(process.env.GOOGLE_CLIENT_EMAIL, undefined, process.env.GOOGLE_PRIVATE_KEY, ['https://www.googleapis.com/auth/drive']);
    this.sheets = google.sheets({ version: 'v4', auth: JwtClient });
    this.drive = google.drive({ version: 'v3', auth: JwtClient });
  }

  async init(): Promise<void> {
    const doc = new GoogleSpreadsheet(this.spreadsheetId);
    await doc.useServiceAccountAuth({ client_email: process.env.GOOGLE_CLIENT_EMAIL!, private_key: process.env.GOOGLE_PRIVATE_KEY! })
    await doc.loadInfo()
    .catch(() => null) // Catching the error here because it will be dealt with in validateCredentials
    
    this.doc = doc;
  }

  async validateCredentials(): Promise<ValidateDestinationCredentialsResponse> {
    const spreadsheetId = this.spreadsheetId;

    if ( spreadsheetId === "1vvALZDLcnJ4BXGKmJPBmjXWOA1ws1PtVj8rsUqQBiuY" ) {
      return { isValid: false, error: { code: SyncError.TemplateDestination, message: "You cannot setup a destination with the template's spreadsheet ID"} }
    }

    return this.sheets.spreadsheets.get({ spreadsheetId })
      .then(async () => {
        return this.drive.permissions.list({ fileId: spreadsheetId, supportsAllDrives: true })
          .then(() => ({ isValid: true }))
          .catch(() => {
            return {
              isValid: false,
              error: {
                code: SyncError.InvalidRole,
                message: `Please give Finta "Editor" access to your spreadsheet.`
              }
            }
          })
      })
      .catch(error => {
        const errorStatus = error.response?.data.error.status;
        if ( errorStatus === 'NOT_FOUND' ) {
          return {
            isValid: false,
            error: {
              code: SyncError.DestinationNotFound,
              message: "A spreadsheet with this ID cannot be found"
            }
          }
        }
        if ( errorStatus === 'PERMISSION_DENIED' ) {
          return {
            isValid: false,
            error: {
              code: SyncError.NotAllowed,
              message: "Please share your spreadsheet with the email listed above"
            }
          }
        }

        throw new Error("Unhandled destination authentication validation error - " + errorStatus)
      })
  }

  async getTables(): Promise<GetDestinationTablesRepsonse> {
    const sheets = this.doc!.sheetsById;
    const tables = await Promise.all(Object.entries(sheets).map(async ([ sheetId, sheet ]: [string, GoogleSpreadsheetWorksheet ]) => {
      return sheet.loadHeaderRow()
      .then(() => ({ 
        tableId: sheetId, 
        name: sheet.title, 
        fields: sheet.headerValues.map(headerValue => ({ fieldId: headerValue, name: headerValue }))}))
      .catch(() => ({ tableId: sheetId, name: sheet.title, fields: [] }))
    }))
    return { tables }
  }
}