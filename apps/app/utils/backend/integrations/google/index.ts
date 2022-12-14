import { GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { DestinationErrorCode, GoogleSheetsAuthentication, TableConfig, TableConfigFields } from "~/types/shared/models";
import { IntegrationBase, IntegrationBaseProps, IntegrationRecord } from "../base";
import { google, sheets_v4, drive_v3, Auth } from "googleapis";

import { GOOGLE_CLIENT_EMAIL, GOOGLE_PRIVATE_KEY } from "./config"
import { GetDestinationTablesResponse, ValidateDestinationCredentialsResponse } from "~/types/shared/functions";
import { Integrations_Enum } from "~/graphql/backend/sdk";
import * as formatter from "./formatter";
import { parseSheetProperties } from "./formatter/helper";

export class Google extends IntegrationBase {
  doc: GoogleSpreadsheet;
  spreadsheetId: string;
  sheets: sheets_v4.Sheets;
  drive: drive_v3.Drive;

  constructor({ authentication, logger, userId }: IntegrationBaseProps) { 
    super({ authentication, userId, logger }); 
    this.integration = Integrations_Enum.Google;
  }

  formatter = formatter;

  async init(): Promise<void> {
    const { spreadsheetId } = this.authentication as GoogleSheetsAuthentication
    const doc = new GoogleSpreadsheet(spreadsheetId);
    await doc.useServiceAccountAuth({ client_email: GOOGLE_CLIENT_EMAIL, private_key: GOOGLE_PRIVATE_KEY });
    await doc.loadInfo();
    this.doc = doc;
    this.spreadsheetId = spreadsheetId;
    const JwtClient = new google.auth.JWT(GOOGLE_CLIENT_EMAIL, undefined, GOOGLE_PRIVATE_KEY, ['https://www.googleapis.com/auth/drive']);
    this.sheets = google.sheets({ version: 'v4', auth: JwtClient });
    this.drive = google.drive({ version: 'v3', auth: JwtClient })
  }

  async validateAuthentication(): Promise<ValidateDestinationCredentialsResponse> {
    const spreadsheetId = this.spreadsheetId;
    if ( spreadsheetId === "1vvALZDLcnJ4BXGKmJPBmjXWOA1ws1PtVj8rsUqQBiuY" ) {
      return { isValid: false, errorCode: DestinationErrorCode.TEMPLATE_DESTINATION, message: "You cannot setup a destination with the template's spreadsheet ID" }
    }

    this.sheets.spreadsheets.get({ spreadsheetId })
      .then(async response => {
        this.logger.info("Get spreadsheet response", { response: response.data });
        return this.drive.permissions.list({ fileId: spreadsheetId, supportsAllDrives: true })
          .then(response => {
            this.logger.info("List permissions response", { response: response.data });
            return { isValid: true }
          })
          .catch(error => {
            this.logger.info("List permissions response", { response: error.response?.data });
            return {
              isValid: false,
              errorCode: DestinationErrorCode.INVALID_ROLE,
              message: `Please give Finta "Editor" access to your spreadsheet.`
            }
          })
      })
      .catch(error => {
        this.logger.info("Get spreadsheet response", { response: error.response?.data })
        const errorStatus = error.response?.data.error.status;
        if ( errorStatus === 'NOT_FOUND' ) {
          return {
            isValid: false,
            errorCode: DestinationErrorCode.DESTINATION_NOT_FOUND,
            message: "A spreadsheet with this ID cannot be found"
          }
        }
        if ( errorStatus === 'PERMISSION_DENIED' ) {
          return {
            isValid: false,
            errorCode: DestinationErrorCode.NOT_ALLOWED,
            message: "Please share your spreadsheet with the email listed above"
          }
        }

        throw new Error("Unhandled destination authentication validation error - " + errorStatus)
      })
  }

  async getTables(): Promise<GetDestinationTablesResponse> {
    const sheets = this.doc.sheetsById;
    const tables = await Promise.all(Object.entries(sheets).map(async ([ sheetId, sheet ]: [string, GoogleSpreadsheetWorksheet ]) => {
      return sheet.loadHeaderRow()
      .then(() => ({ 
        tableId: sheetId, 
        name: sheet.title, 
        fields: sheet.headerValues.map(headerValue => ({ fieldId: headerValue, name: headerValue }))}))
      .catch(error => {
        this.logger.info("Load header row error", { data: error.response?.data });
        return { tableId: sheetId, name: sheet.title, fields: [] }
      })
    }))
    return { tables }
  }

  async queryTable({ tableId, tableConfigFields }: { tableId: string; tableConfigFields: { field: TableConfigFields; field_id: string; }[]; }): Promise<IntegrationRecord[]> {
    const sheet = this.doc.sheetsById[tableId];
    if ( !sheet ) { return [] };
    const rows = await sheet.getRows();
    return rows.map(row => ({
      id: row.rowIndex,
      properties: parseSheetProperties({ row, tableConfigFields }),
      object: row
    }))
  }

  async createRecords({ tableId, data, tableConfigFields }: { tableId: string, data: Record<string, any>[]; tableConfigFields: TableConfig['fields']}): Promise<IntegrationRecord[]> { 
    return this.doc.sheetsById[tableId].addRows(data)
      .then(rows => rows.map(row => ({ id: row.rowIndex, properties: parseSheetProperties({ row, tableConfigFields }), object: row })))

    // return this.sheets.spreadsheets.values.append({
    //   spreadsheetId: this.spreadsheetId,
    //   range: `${sheet.title}!A:${sheet.lastColumnLetter}`,
    //   valueInputOption: 'USER_ENTERED',
    //   requestBody: {
    //     values: data
    //   }
    // })
  }

  async updateRecords({ tableId, data, tableConfigFields }: { tableId: string, data: { fields: Record<string, any>, record: IntegrationRecord }[]; tableConfigFields: TableConfig['fields']}): Promise<IntegrationRecord[]> { 
    const sheet = this.doc.sheetsById[tableId];

    for ( const { record, fields } of data ) {
      const row = record.object as GoogleSpreadsheetRow;
      for ( const key in Object.keys(fields) ) {
        row[key] = fields[key]
      }
    }
    
    //     return this.sheets.spreadsheets.values.batchUpdate({
    //       spreadsheetId: this.spreadsheetId,
    //       requestBody: {
    //         valueInputOption: 'USER_ENTERED',
    //         data: data.map(d => ({
    //           range: `${sheet.title}!A${d.row}:${sheet.lastColumnLetter}${d.row}`,
    //           values: [ d.values ]
    //         }))
    //       }
    //     })
    //   }

    await sheet.saveUpdatedCells();
    return data.map(d => d.record)
  }

  async deleteRecords({ records }: { tableId: string; records: IntegrationRecord[]}): Promise<void> {
    await Promise.all(records.map(async record => (record.object as GoogleSpreadsheetRow).delete()))
  }
}