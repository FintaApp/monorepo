import { PropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";
export type NotionPropertyTypes = PropertyItemObjectResponse['type']
export type DestinationFieldTypes = NotionPropertyTypes;

export type AirtableCredentials = {
  api_key: string;
  base_id: string;
}

export type OauthCredentials = {
  connectionId: string;
}

export type GoogleSheetsCredentials = {
  spreadsheetId: string;
}

export type CodaCredentials = {
  is_ready: boolean;
  access_token_hash: boolean;
}

export type NotionCredentials = { access_token: string, bot_id: string; }

export type DestinationCredentials = AirtableCredentials | GoogleSheetsCredentials | CodaCredentials | NotionCredentials

export enum InstitutionsTableFields {
  ID = 'id',
  NAME = 'name',
  ERROR = 'error',
  LAST_UPDATE = 'last_update'
}

export enum AccountsTableFields {
  ID = 'id',
  NAME = 'name',
  INSTITUTION = 'institution',
  AVAILABLE = 'available',
  CURRENT = 'current',
  CURRENCY = 'currency',
  MASK = 'mask',
  TYPE = 'type',
  SUBTYPE = 'subtype',
  LIMIT = 'limit'
}

export enum TransactionsTableFields {
  ID = 'id',
  SUMMARY = 'summary',
  DATE = 'date',
  ACCOUNT = 'account',
  SUB_ACCOUNT = 'sub_account',
  AMOUNT = 'amount',
  CURRENCY = 'currency',
  PENDING = 'is_pending',
  CATEGORY = 'category'
}

export enum HoldingsTableFields {
  ACCOUNT = 'account',
  COST_BASIS = 'cost_basis',
  CURRENCY = 'currency',
  QUANTITY = 'quantity',
  SECURITY_ID = 'security_id',
  SUMMARY = 'summary'
}

export enum InvestmentTransactionsTableFields {
  ACCOUNT = 'account',
  AMOUNT = 'amount',
  DATE = 'date',
  FEES = 'fees',
  ID = 'id',
  CURRENCY = 'currency',
  SUMMARY = 'summary',
  PRICE = 'price',
  QUANTITY = 'quantity',
  SECURITY_ID = 'security_id',
  SUBTYPE = 'subtype',
  TYPE = 'type'
}

export enum SecurityTableFields {
  ID = 'id',
  SYMBOL = 'symbol',
  NAME = 'name',
  CLOSE_PRICE = 'close_price',
  CLOSE_PRICE_AS_OF = 'close_price_as_of',
  TYPE = 'type'
}

export enum CategoryTableFields {
  ID = 'id',
  NAME = 'name',
  CATEGORY_GROUP = 'category_group'
}

export type TableConfigFields = InstitutionsTableFields | AccountsTableFields | TransactionsTableFields | HoldingsTableFields | InvestmentTransactionsTableFields | SecurityTableFields | CategoryTableFields;

export type TableConfig = {
  is_enabled: boolean;
  table_id?: string;
  fields: {
    field: TableConfigFields;
    field_id: string;
  }[]
}

export enum DestinationTableTypes {
  INSTITUTIONS = 'institutions',
  ACCOUNTS = 'accounts',
  TRANSACTIONS = 'transactions',
  HOLDINGS = 'holdings',
  INVESTMENT_TRANSACTIONS = 'investment_transactions',
  SECURITIES = 'securities',
  CATEGORIES = 'categories'
}

export type TableConfigs = {
  [DestinationTableTypes.INSTITUTIONS]?: TableConfig;
  [DestinationTableTypes.ACCOUNTS]?: TableConfig;
  [DestinationTableTypes.TRANSACTIONS]?: TableConfig;
  [DestinationTableTypes.HOLDINGS]?: TableConfig;
  [DestinationTableTypes.INVESTMENT_TRANSACTIONS]?: TableConfig;
  [DestinationTableTypes.SECURITIES]?: TableConfig
  [DestinationTableTypes.CATEGORIES]?: TableConfig
}

export enum DestinationErrorCode {
  INVALID_CREDENTIALS = 'invalid_credentials',
  DESTINATION_NOT_FOUND = 'destination_not_found', // E.g. the spreadsheet doesn't exist
  NOT_ALLOWED = 'not_allowed', // E.g. Finta doesn't have access to the spreadsheet
  INVALID_ROLE = 'invalid_role', // E.g. Finta doesn't have write-access to the destination
  NO_HEADER_ROW = 'no_header_row', // No header row in google sheets
  MISSING_TABLE = 'missing_table',
  MISSING_FIELD = 'missing_field',
  UNKNOWN_ERROR = 'unknown_error',
  INCORRECT_FIELD_TYPE = 'incorrect_field_type'
}

export type DestinationError = {
  errorCode: DestinationErrorCode;
  table?: string; // The user-defined representation of the table
  field?: string; // The user-defined representation of the field
  tableId?: string;
  fieldId?: string;
  tableType?: DestinationTableTypes;
  fieldType?: TableConfigFields
} | undefined;

export const fieldToTypeMapping = {
  [DestinationTableTypes.INSTITUTIONS]: {
    [InstitutionsTableFields.ID]: {
      notion: [ 'rich_text' ]
    },
    [InstitutionsTableFields.NAME]: {
      notion: [ 'title' ]
    },
    [InstitutionsTableFields.ERROR]: {
      notion: ['rich_text']
    },
    [InstitutionsTableFields.LAST_UPDATE]: {
      notion: [ 'date' ]
    }
  },
  [DestinationTableTypes.ACCOUNTS]: {
    [AccountsTableFields.ID]: {
      notion: [ 'rich_text' ]
    },
    [AccountsTableFields.NAME]: {
      notion: [ 'title' ]
    },
    [AccountsTableFields.INSTITUTION]: {
      notion: [ 'relation' ]
    },
    [AccountsTableFields.AVAILABLE]: {
      notion: [ 'number' ]
    },
    [AccountsTableFields.CURRENT]: {
      notion: [ 'number' ]
    },
    [AccountsTableFields.CURRENCY]: {
      notion: [ 'select' ]
    },
    [AccountsTableFields.MASK]: {
      notion: [ 'rich_text' ]
    },
    [AccountsTableFields.TYPE]: {
      notion: [ 'select' ]
    },
    [AccountsTableFields.SUBTYPE]: {
      notion: [ 'select' ]
    },
    [AccountsTableFields.LIMIT]: {
      notion: [ 'number' ]
    }
  },
  [DestinationTableTypes.CATEGORIES]: {
    [CategoryTableFields.ID]: {
      notion: [ 'rich_text' ]
    },
    [CategoryTableFields.CATEGORY_GROUP]: {
      notion: ['select']
    },
    [CategoryTableFields.NAME]: {
      notion: ['title']
    }
  },
  [DestinationTableTypes.HOLDINGS]: {
    [HoldingsTableFields.ACCOUNT]: {
      notion: ['relation']
    },
    [HoldingsTableFields.COST_BASIS]: {
      notion: ['number']
    },
    [HoldingsTableFields.CURRENCY]: {
      notion: ['select']
    },
    [HoldingsTableFields.QUANTITY]: {
      notion: ['number']
    },
    [HoldingsTableFields.SECURITY_ID]: {
      notion: ['relation']
    },
    [HoldingsTableFields.SUMMARY]: {
      notion: ['title']
    }
  },
  [DestinationTableTypes.INVESTMENT_TRANSACTIONS]: {
    [InvestmentTransactionsTableFields.ACCOUNT]: {
      notion: ['relation']
    },
    [InvestmentTransactionsTableFields.AMOUNT]: {
      notion: ['number']
    },
    [InvestmentTransactionsTableFields.DATE]: {
      notion: ['date']
    },
    [InvestmentTransactionsTableFields.FEES]: {
      notion: ['number']
    },
    [InvestmentTransactionsTableFields.ID]: {
      notion: ['rich_text']
    },
    [InvestmentTransactionsTableFields.CURRENCY]: {
      notion: ['select']
    },
    [InvestmentTransactionsTableFields.SUMMARY]: {
      notion: ['title']
    },
    [InvestmentTransactionsTableFields.PRICE]: {
      notion: ['number']
    },
    [InvestmentTransactionsTableFields.QUANTITY]: {
      notion: ['number']
    },
    [InvestmentTransactionsTableFields.SECURITY_ID]: {
      notion: ['relation']
    },
    [InvestmentTransactionsTableFields.SUBTYPE]: {
      notion: ['select']
    },
    [InvestmentTransactionsTableFields.TYPE]: {
      notion: ['select']
    }
  },
  [DestinationTableTypes.SECURITIES]: {
    [SecurityTableFields.ID]: {
      notion: ['rich_text']
    },
    [SecurityTableFields.NAME]: {
      notion: ['rich_text']
    },
    [SecurityTableFields.SYMBOL]: {
      notion: ['title']
    },
    [SecurityTableFields.CLOSE_PRICE]: {
      notion: ['number']
    },
    [SecurityTableFields.CLOSE_PRICE_AS_OF]: {
      notion: ['date']
    },
    [SecurityTableFields.TYPE]: {
      notion: ['select']
    },
  },
  [DestinationTableTypes.TRANSACTIONS]: {
    [TransactionsTableFields.SUMMARY]: {
      notion: ['title']
    },
    [TransactionsTableFields.DATE]: {
      notion: ['date']
    },
    [TransactionsTableFields.ACCOUNT]: {
      notion: ['relation']
    },
    [TransactionsTableFields.CATEGORY]: {
      notion: ['relation']
    },
    [TransactionsTableFields.AMOUNT]: {
      notion: ['number']
    },
    [TransactionsTableFields.CURRENCY]: {
      notion: ['select']
    },
    [TransactionsTableFields.PENDING]: {
      notion: ['checkbox']
    },
    [TransactionsTableFields.ID]: {
      notion: ['rich_text']
    },
    [TransactionsTableFields.SUB_ACCOUNT]: {
      notion: ['rich_text']
    }
  }
} as Record<DestinationTableTypes, Record<TableConfigFields, { notion: NotionPropertyTypes[] }>>


