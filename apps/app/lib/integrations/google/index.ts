import { Field, GoogleSheetsCredential, Integration, SyncError } from "@prisma/client";
import { GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { drive_v3, google, sheets_v4 } from "googleapis";
import { IntegrationBase } from "../base";
import { parseSheetProperties } from "./formatter/helpers";
import * as formatter from "./formatter";
import * as types from "../base/types"

interface GoogleProps extends types.IntegrationBaseProps {
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
    this.formatter = formatter;
    this.isGoogle = true;

    const JwtClient = new google.auth.JWT(process.env.GOOGLE_CLIENT_EMAIL, undefined, process.env.GOOGLE_PRIVATE_KEY?.replace(/(\\r)|(\\n)/g, '\n'), ['https://www.googleapis.com/auth/drive']);
    this.sheets = google.sheets({ version: 'v4', auth: JwtClient });
    this.drive = google.drive({ version: 'v3', auth: JwtClient });
  }

  async init(): Promise<void> {
    const doc = new GoogleSpreadsheet(this.spreadsheetId);
    await doc.useServiceAccountAuth({ client_email: process.env.GOOGLE_CLIENT_EMAIL!, private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/(\\r)|(\\n)/g, '\n')! })
    await doc.loadInfo()
    .catch(() => null) // Catching the error here because it will be dealt with in validateCredentials
    
    this.doc = doc;
  }

  async validateCredentials(): Promise<types.ValidateDestinationCredentialsResponse> {
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

  async getTables(): Promise<types.GetDestinationTablesRepsonse> {
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

  async queryTable({ tableId, fieldConfigs }: { tableId: string; fieldConfigs: { id?: string | undefined; field: Field; fieldId: string; tableConfigId?: string | undefined; }[]; }): Promise<types.IntegrationRecord[]> {
    if ( !this.doc ) { throw new Error("Didn't initialized Google")}
    const sheet = this.doc.sheetsById[tableId];
    if ( !sheet ) { return [] };
    const rows = await sheet.getRows();
    return rows.map(row => ({
      id: row.rowIndex,
      properties: parseSheetProperties({ row, fieldConfigs }),
      object: row
    }))
  }

  async createRecords({ tableId, data, fieldConfigs }: { tableId: string; data: Record<string, any>[]; fieldConfigs: { id?: string | undefined; field: Field; fieldId: string; tableConfigId?: string | undefined; }[]; }): Promise<types.IntegrationRecord[]> {
    if ( !this.doc ) { throw new Error("Didn't initialized Google")}
    return this.doc.sheetsById[tableId].addRows(data)
      .then(rows => rows.map(row => ({ id: row.rowIndex, properties: parseSheetProperties({ row, fieldConfigs }), object: row })))
  }

  async updateRecords({ tableId, data }: { tableId: string; data: { fields: Record<string, any>; record: types.IntegrationRecord; }[]; fieldConfigs: { id?: string | undefined; field: Field; fieldId: string; tableConfigId?: string | undefined; }[]; }): Promise<types.IntegrationRecord[]> {
    if ( !this.doc ) { throw new Error("Didn't initialized Google")}
    const sheet = this.doc.sheetsById[tableId];
    await sheet.loadHeaderRow();
    const headerRow = sheet.headerValues;

    return this.sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: this.spreadsheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: data.map(d => ({
          range: `${sheet.title}!A${d.record.id}:${sheet.lastColumnLetter}${d.record.id}`,
          values: [ headerRow.map(header => d.fields[header as keyof typeof d.fields]) ]
        }))
      }
    })
    .then(() => data.map(d => d.record))
  }

  async deleteRecords({ records }: { tableId: string; records: types.IntegrationRecord[]; }): Promise<void> {
    await Promise.all(records.map(async record => (record.object as GoogleSpreadsheetRow).delete()))
  }
}