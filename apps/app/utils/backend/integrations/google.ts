import { google, sheets_v4 } from "googleapis";
import { GoogleSpreadsheet, GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import * as _ from "lodash";
import moment from "moment-timezone";
import { AccountBase, Holding, InvestmentTransaction, Security, Transaction } from "plaid";

import { IntegrationBase } from "./base";
import { DestinationModel, PlaidItemModel } from "~/types/backend/models"
import { CheckAuthenticationFuncResponse, SyncDataFuncProps, CheckTableFuncProps, CheckTableFuncResponse, GetTablesFuncResponse, IntegrationConfig } from "~/types/backend/integrations";
import { DestinationErrorCode, AccountsTableFields, InstitutionsTableFields, TableConfigs, TransactionsTableFields, HoldingsTableFields, InvestmentTransactionsTableFields, SecurityTableFields, GoogleSheetsCredentials, CategoryTableFields } from "~/types/shared/models";
import * as formatter from "../formatter";

const CLIENT_EMAIL = "finta-app@finta-integration.iam.gserviceaccount.com";
const PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\nMIIEvwIBADANBgkqhkiG9w0BAQEFAASCBKkwggSlAgEAAoIBAQCorcJKsKFFVuov\nYuDp1fECwj95zv7YFjkxGLs2W/5lN7SL7hU0NQfsrv82MFee4zUAxKLsuh1caU1H\nzyde5xKY2adNrLawlmOmSz8G36+vx/Ifb4t6eDUqaw0xWK5euoyf6BL9XvKDYNP+\nFm6Pd3vRe28lzZ/2gn8BwGhWOn3BRDot7aMuRjsDEotokXnsChfqXM2UNVMMDwNi\nlIgCKp26nE/NGmRJ4bSLGHMDbG5XKo29Cq1Q488ExbX2SQNYrJfZuGqijDyGpFgD\nE2CCNQMcC7YZMmOx7nSAH/YJOFrOQxWWVXNjuPYurJJpKTdgERGKQQBlc17D2C89\nXd7bfriDAgMBAAECggEABZlrAy6008fsUzFdlPWQoA5RrBn2dLbcJCiVglrwaWy9\ndg2rr4V5I161wxc8uV4CcumUHPaapegq9BDI1komYGONPbNXhyoe2bTSvUgsnVGu\nVGPQBfs6jJNsJzCx7RwVMfOyua1usHTE5MDa37FQL2aBDIi0YCr5y1WXQRGE/ibX\nT2e2f6X0BvAA3A+VP4OuFA/fTVoKSrFrbRpBgslVYeB8n4aSr77OYdzw+s4YJ7zC\njX4+jM2OFwzHITjI03lxSvxxEutuZpGol5ALrjWcKWSOn5y+67rllGAey7C0frZd\nFMc7yRR9nSr97yiOykmCRELRqWKn4hJwSS7y5krUaQKBgQDgUprsyLDY2UV4DgTT\n/d8bEa0c8aBYY2zYrIv2KpQFaZwoCoK8OmVhrmSW9LXV++uCwiCGvUcLBFi4o5Qu\nscGk3LlSsTrXow16Mx7KxIq1zStzB4kSbB5bwVh62RDE9XIMTmoJo1XO13bpan35\ndkL3uoU8tPl/wY7UmHwkbW1Y+QKBgQDAf5fqivNiaVds5WleUG8rPYnuvZtREBpb\nXd/IQuzjmmLEJcTCcNyf+kJwta8gpJE0QQNyDxlWFOqk8ypDh4aozZrjEIA/4WfH\nIk+i1N8nH15oHcwWFeHUOhQCEJ4t1S9vZ8Ww6E4gQvULh3dLds1jcZWHiKo0Hoyf\nHbSXKH7YWwKBgQDckVy0JkF9d2XPPjmRGLcfLqpBI3S+dES6aC7Wxdb123ooBO23\nltPI0Gkn5UZGOYbA85B36/TG6Gc0ZeN2ZmI5cK7omEt7bF/8H/fO+KJLUInAeVBW\nROk030/Yu0a5431YjGHHSEs/Lq1FpehoOdhvLX+EyY3qCLAgai7mwpIaQQKBgQCh\n4iuVuOjZGBHHqF4mTKpQyN3Ygme9kjc4Iwfw2CdzeQAaSFDh3BwOBV4efwwZ/YuH\nUC1fnEcIV2rE8SHXzH94MgBReC0Ci8LEepxSKYbI1d6E3Jom8JwL6BOvcN41WRUd\nMT3VemdJRkXhPjkao3wyZvEDG/FXB2Hm5gpbHFkgBQKBgQDdXyOVyCYkbpDH1OI+\n6ZgaQKG/cjJ0eoq02MOZeCqXQEUzZap2uq3Bt0WBRIL9fwSoSlpf3is0RaxbTQ17\neG4xsD2PTuY0fB6FhsokQ216UEavBWhxNeIU1Y0kZYEGiQ1LlbOtP9pS4Y1P8qYq\nmDXC2rrtr01aBSj3CJOYcdNEoA==\n-----END PRIVATE KEY-----\n";

export class Google extends IntegrationBase {
  credentials!: GoogleSheetsCredentials;
  doc!: GoogleSpreadsheet;
  sheets: sheets_v4.Sheets

  constructor({destination, credentials }: {destination?: DestinationModel, credentials?: GoogleSheetsCredentials }) {
    super({ destination, credentials });

    const JwtClient = new google.auth.JWT(CLIENT_EMAIL, undefined, PRIVATE_KEY, ['https://www.googleapis.com/auth/drive']);
    this.sheets = google.sheets({ version: 'v4', auth: JwtClient });
    this.doc = new GoogleSpreadsheet(this.credentials.spreadsheetId);
  }

  async syncData({ item, accounts, transactions, removedTransactions, holdings, investmentTransactions, securities, categories }: SyncDataFuncProps) {
    return Promise.all([
      this.upsertInstitution({ item }),
      this.upsertAccounts({ accounts, itemId: item.id }),
      this.upsertTransactions({ transactions, removedTransactions }),
      this.upsertSecurities({ securities }),
      this.upsertHoldings({ holdings }),
      this.insertInvestmentTransactions({ investmentTransactions }),
      this.upsertCategories({ categories })
    ])
    .then(async responses => {
      const [ _, accountResults, transactionResults, __, holdingResults, investmentTransactionResults, ___ ] = responses;
      return { 
        accounts: accountResults,
        holdings: holdingResults,
        transactions: transactionResults,
        investmentTransactions: investmentTransactionResults
      }
    })
  }
  

  // External Helper Methods
  async init() {
    const doc = this.doc;
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    });
    await doc.loadInfo().then(() => { this.doc = doc; });
  };

  async load() {
    if ( this.destination && this.doc ) {
      this.config = Object.fromEntries(await Promise.all(Object.entries(this.config).map(async ([ tableType, { isEnabled, tableId, fields }]) => {
        if ( !isEnabled || !tableId ) return [ tableType, { tableId, fields }];
        const sheet = this.doc.sheetsById[tableId];
        if ( !sheet ) { return [ tableType, { tableId, fields }]; }
        const rows = await sheet.getRows();
        return [ tableType, { tableId, fields, sheet, rows }]
      }))) as IntegrationConfig
    }
  }

  async checkAuthentication(): Promise<CheckAuthenticationFuncResponse> {
    const JwtClient = new google.auth.JWT(CLIENT_EMAIL, undefined, PRIVATE_KEY, ['https://www.googleapis.com/auth/drive']);
    const drive = google.drive({ version: 'v3', auth: JwtClient });
    const sheets = google.sheets({ version: 'v4', auth: JwtClient });

    return sheets.spreadsheets.get({ spreadsheetId: this.credentials.spreadsheetId })
    .then(async () => {
      return drive.permissions.list({ fileId: this.credentials.spreadsheetId, supportsAllDrives: true })
      .then(() => ({ isValid: true }))
      .catch(() => ({ isValid: false, errorCode: DestinationErrorCode.INVALID_ROLE }))
    })
    .catch(err => {
      if ( !err.response) { console.log(err) }
      const error = err.response?.data.error.status;
      if ( error === 'NOT_FOUND' ) { return { isValid: false, errorCode: DestinationErrorCode.DESTINATION_NOT_FOUND }};
      if ( error === 'PERMISSION_DENIED' ) { return { isValid: false, errorCode: DestinationErrorCode.NOT_ALLOWED }};
      console.log(error);
      return { isValid: false }
    });
  };

  async checkTable({ tableId, fields, tableType }: CheckTableFuncProps): Promise<CheckTableFuncResponse> {
    const sheet = this.doc.sheetsById[tableId];
    if ( !sheet ) {
      return { isValid: false, error: {
        errorCode: DestinationErrorCode.MISSING_TABLE,
        tableType,
        tableId
      }}
    }
    return sheet.loadHeaderRow()
    .then(() => {
      const missingField = fields.find(field => !sheet.headerValues.includes(field.field_id));
      if ( missingField ) {
        return { isValid: false, error: {
          errorCode: DestinationErrorCode.MISSING_FIELD,
          table: sheet.title,
          tableId,
          tableType,
          fieldType: missingField.field,
          fieldId: missingField.field_id
        }}
      }
    return { isValid: true, error: null }
    })
    .catch(() => ({ isValid: false, error: { errorCode: DestinationErrorCode.NO_HEADER_ROW, tableType, table: sheet.title }}))
  }

  async getDefaultConfig(): Promise<TableConfigs> {
    const sheets = Object.entries(this.doc.sheetsById).map(([ sheetId, sheet ]: [ string, GoogleSpreadsheetWorksheet]) => ({ id: sheetId, name: sheet.title }));
    return formatter.google.defaultConfig({ sheets })
  };

  async getTables(): Promise<GetTablesFuncResponse> {
    const sheets = this.doc.sheetsById;
    return Promise.all(Object.entries(sheets).map(async ([ sheetId, sheet ]: [ string, GoogleSpreadsheetWorksheet]) => {
      return sheet.loadHeaderRow()
      .then(() => ({
        tableId: sheetId,
        name: sheet.title,
        fields: sheet.headerValues.map(headerValue => ({ fieldId: headerValue, name: headerValue }))
      }))
      .catch(() => ({
        tableId: sheetId,
        name: sheet.title,
        fields: []
      }))
    }))
  }

  // Internal Helper Methods
  async upsertInstitution({ item }: { item: PlaidItemModel }) {
    const { fields, sheet, rows } = this.config.institutions;
    if ( !sheet ) { return }

    const row = rows?.find(row => row[fields[InstitutionsTableFields.ID as keyof typeof fields]] === item.id);
    const lastUpdate = moment().tz(this.doc.timeZone).format("M/D/YYYY H:mm:SS")
    if ( row ) {
      row[fields[InstitutionsTableFields.ERROR as keyof typeof fields]] = item.error;
      row[fields[InstitutionsTableFields.LAST_UPDATE as keyof typeof fields]] = lastUpdate;
      await row.save();
      return;
    }

    await this.addRows({ sheet, data: [ formatter.google.institution({ item, lastUpdate, headerValues: sheet.headerValues, tableConfigFields: fields })] });
  };

  async upsertAccounts({ accounts, itemId }: { accounts: AccountBase[], itemId: string }) {
    const { fields, sheet, rows } = this.config.accounts;
    if ( !sheet ) { return { added: [], updated: []}}

    const accountIdHeader = fields[AccountsTableFields.ID as keyof typeof fields];
    const mappedAccounts = accounts.map(account => {
      const row = rows?.find(row => row[accountIdHeader] === account.account_id);
      return { account, row }
    });

    const newAccounts = mappedAccounts.filter(({ row }) => !row );
    const updatedAccounts = mappedAccounts.filter(({ row }) => !!row );

    const addAccountsPromise = this.addRows({ sheet, data: newAccounts.map(({ account }) => formatter.google.account.new({ account, itemId, headerValues: sheet.headerValues, tableConfigFields: fields}))})
    const updateAccountsPromise = this.updateRows({ sheet, data: updatedAccounts.map(({ account, row }) => {
      return { row: row!.rowIndex, values: formatter.google.account.updated({ account, headerValues: sheet.headerValues, tableConfigFields: fields })}
    })});

    await Promise.all([ addAccountsPromise, updateAccountsPromise ]);
    return { added: newAccounts.map(({ account }) => account.account_id ), updated: updatedAccounts.map(({ account }) => account.account_id )};
  }

  async upsertTransactions({ transactions, removedTransactions = [] }: { transactions?: Transaction[], removedTransactions?: string[] }) {
    const { fields, sheet, rows } = this.config.transactions;
    if ( !transactions || !sheet ) { return { added: 0, updated: 0, removed: 0 }};

    const transactionIdHeader = fields[TransactionsTableFields.ID as keyof typeof fields];
    const mappedTransactions = transactions.map(transaction => {
      const pendingRow = rows?.find(row => row[transactionIdHeader] === transaction.pending_transaction_id);
      const postedRow = rows?.find(row => row[transactionIdHeader] === transaction.transaction_id);
      return { transaction, row: pendingRow, isNew: !pendingRow && !postedRow }
    })

    const newTransactions = mappedTransactions.filter(({ isNew }) => isNew );
    const updatedTransactions = mappedTransactions.filter(({ row }) => !!row );

    const addTransactionsPromise = this.addRows({ sheet, data: newTransactions.map(({ transaction }) => formatter.google.transaction.new({ transaction, headerValues: sheet.headerValues, tableConfigFields: fields}))})
    const updateTransactionsPromise = this.updateRows({ sheet, data: updatedTransactions.map(({ transaction, row }) => {
      return { row: row!.rowIndex, values: formatter.google.transaction.updated({ transaction, headerValues: sheet.headerValues, tableConfigFields: fields })}
    })})
    const pendingTransactionIds = transactions.filter(transaction => !!transaction.pending_transaction_id).map(transaction => transaction.pending_transaction_id);
    const nonPendingRemovedTransactions = _.difference((removedTransactions || []), pendingTransactionIds)
    const removeTransactionsPromise = removedTransactions ? Promise.all(nonPendingRemovedTransactions.map(removedTransactionId => {
      const row = rows?.find(row => row[transactionIdHeader] === removedTransactionId);
      if ( row ) { return row.delete() }
    })) : Promise.all([]);

    await Promise.all([ addTransactionsPromise, updateTransactionsPromise, removeTransactionsPromise ]);
    return { added: newTransactions.length, updated: updatedTransactions.length, removed: nonPendingRemovedTransactions.length }
  };

  async upsertHoldings({ holdings }: { holdings?: Holding[] }) {
    const { fields, sheet, rows } = this.config.holdings;
    if ( !holdings || holdings.length === 0 || !sheet ) { return { added: 0, updated: 0 }};

    const securityIdHeader = fields[HoldingsTableFields.SECURITY_ID as keyof typeof fields];
    const accountIdHeader = fields[HoldingsTableFields.ACCOUNT as keyof typeof fields];

    const mappedHoldings = holdings.map(holding => {
      const row = rows?.find(row => row[accountIdHeader] === holding.account_id && row[securityIdHeader] === holding.security_id);
      return { holding, row };
    })

    const newMappedHoldings = mappedHoldings.filter(mappedHolding => !mappedHolding.row);
    const updatedMappedHoldings = mappedHoldings.filter(mappedHolding => !!mappedHolding.row);

    const addHoldingsPromise = this.addRows({ sheet, data: newMappedHoldings.map(({ holding }) => formatter.google.holding.new({ holding, headerValues: sheet.headerValues, tableConfigFields: fields}))})
    const updateHoldingsPromise = this.updateRows({ sheet, data: updatedMappedHoldings.map(({ holding, row }) => {
      return { row: row!.rowIndex, values: formatter.google.holding.updated({ holding, headerValues: sheet.headerValues, tableConfigFields: fields })}
    })})

    await Promise.all([ addHoldingsPromise, updateHoldingsPromise ]);
    return { added: newMappedHoldings.length, updated: updatedMappedHoldings.length };
  }

  async insertInvestmentTransactions({ investmentTransactions }: { investmentTransactions?: InvestmentTransaction[] }) {
    const { fields, sheet, rows } = this.config.investment_transactions;
    if ( !investmentTransactions || investmentTransactions.length === 0 || !sheet ) { return { added: 0 }};

    const transactionIdHeader = fields[InvestmentTransactionsTableFields.ID as keyof typeof fields];
    const transactionRowsPlaidIds = rows?.map(row => row[transactionIdHeader]) as string[];
    const newTransactions = investmentTransactions.filter(transaction => !transactionRowsPlaidIds.includes(transaction.investment_transaction_id));

    await this.addRows({ sheet, data: newTransactions.map(investmentTransaction => formatter.google.investmentTransaction.new({ headerValues: sheet.headerValues, investmentTransaction, tableConfigFields: fields }) )})
    return { added: newTransactions.length }; 
  }

  async upsertCategories({ categories }: { categories?: { id: string; name: string; category_group: string }[] }) {
    if ( !categories || categories.length === 0 ) { return; }
    const { fields, sheet, rows } = this.config.categories || { fields: [], sheet: undefined, rows: [] };
    if ( !sheet ) { return; };

    const categoryIdHeader = fields[CategoryTableFields.ID as keyof typeof fields];
    const categoryRowsPlaidIds = rows?.map(row => row[categoryIdHeader]) as string[];
    const newCategories = categories.filter(category => !categoryRowsPlaidIds.includes(category.id));

    await this.addRows({ sheet, data: newCategories.map(category => formatter.google.category.new({ category, headerValues: sheet.headerValues, tableConfigFields: fields }) )});
  };

  async upsertSecurities({ securities }: { securities?: Security[] }) {
    const { fields, sheet, rows } = this.config.securities;
    if ( !securities || securities.length === 0 || !sheet ) { return; };

    const securityIdHeader = fields[SecurityTableFields.ID as keyof typeof fields];
    const mappedSecurities = securities.map(security => {
      const securityRow = rows?.find(row => row[securityIdHeader] === security.security_id);
      return { security, row: securityRow } 
    });

    const newSecurities = mappedSecurities.filter(({ row }) => !row );
    const updatedSecurities = mappedSecurities.filter(({ row }) => !!row );
    const addSecuritiesPromise = this.addRows({ sheet, data: newSecurities.map(({ security }) => formatter.google.security.new({ security, headerValues: sheet.headerValues, tableConfigFields: fields}))});
    const updateSecuritiesPromise = this.updateRows({ sheet, data: updatedSecurities.map(({ security, row }) => {
      return { row: row!.rowIndex, values: formatter.google.security.updated({ security, headerValues: sheet.headerValues, tableConfigFields: fields })}
    })})
    await Promise.all([ addSecuritiesPromise, updateSecuritiesPromise ]);
  }

  updateCell({ sheet, row, header, value }: { sheet: GoogleSpreadsheetWorksheet, row: GoogleSpreadsheetRow, header?: string, value: any }) {
    if ( !header ) { return; };
    const cell = sheet.getCell(row.rowIndex - 1, sheet.headerValues.indexOf(header));
    cell.value = value;
  }

  async addRows({ sheet, data }: { sheet: GoogleSpreadsheetWorksheet, data: any[][] }) {
    return this.sheets.spreadsheets.values.append({
      spreadsheetId: this.credentials.spreadsheetId,
      range: `${sheet.title}!A:${sheet.lastColumnLetter}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: data
      }
    })
  }

  async updateRows({ sheet, data }: { sheet: GoogleSpreadsheetWorksheet, data: { row: number; values: any[] }[] }) {
    return this.sheets.spreadsheets.values.batchUpdate({
      spreadsheetId: this.credentials.spreadsheetId,
      requestBody: {
        valueInputOption: 'USER_ENTERED',
        data: data.map(d => ({
          range: `${sheet.title}!A${d.row}:${sheet.lastColumnLetter}${d.row}`,
          values: [ d.values ]
        }))
      }
    })
  }
}