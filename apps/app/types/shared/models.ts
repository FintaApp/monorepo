import { PropertyItemObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Integrations_Enum } from "~/graphql/frontend";
export type NotionPropertyType = PropertyItemObjectResponse['type']
export type AirtableFieldType = 'checkbox' | 'currency' | 'date' | 'dateTime' | 'multipleRecordLinks' | 'multilineText' | 'multipleSelects' | 'number' | 'richText' | 'singleLineText' | 'singleSelect' | 'primary'
export type DestinationFieldType = NotionPropertyType | AirtableFieldType;

export type AirtableAuthentication = {
  base_id: string;
  api_key?: string; // Only used for legacy Airtable integrations
}

export type OauthCredentials = {
  connectionId: string;
}

export type GoogleSheetsAuthentication = {
  spreadsheetId: string;
}

export type CodaCredentials = {
  is_ready: boolean;
  access_token_hash: boolean;
}

export type NotionAuthentication = { access_token: string, bot_id: string; }

export type DestinationAuthentication = AirtableAuthentication | GoogleSheetsAuthentication | CodaCredentials | NotionAuthentication

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
  LIMIT = 'limit',
  INTEREST_RATE = 'interest_rate',
  LAST_PAYMENT_AMOUNT = 'last_payment_amount',
  LAST_PAYMENT_DATE = 'last_payment_date',
  NEXT_PAYMENT_DUE_DATE = 'next_payment_due_date',
  LAST_STATEMENT_BALANCE = 'last_statement_balance',
  MINIMUM_PAYMENT_AMOUNT = 'minimum_payment_amount',
  NEXT_MONTHLY_PAYMENT = 'next_monthly_payment',
  ORIGINATION_DATE = 'origination_date',
  ORIGINATION_PRINCIPAL_AMOUNT = 'origination_principal_amount'
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
  INCORRECT_FIELD_TYPE = 'incorrect_field_type',
  TEMPLATE_DESTINATION = 'template_destination'
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

export const INSTITUTION_TABLE_FIELDS = [
  {
    field: InstitutionsTableFields.ID,
    label: 'Institution ID',
    is_required: true
  }, {
    field: InstitutionsTableFields.NAME,
    label: 'Institution Name',
    is_required: true
  }, {
    field: InstitutionsTableFields.LAST_UPDATE,
    label: "Last Update",
    is_required: true
  }, {
    field: InstitutionsTableFields.ERROR,
    label: 'Error',
    is_required: false
  }
]

export const ACCOUNTS_TABLE_FIELDS = [
  {
    field: AccountsTableFields.INSTITUTION,
    label: "Related Institution",
    is_required: true
  }, {
    field: AccountsTableFields.ID,
    label: "Account ID",
    is_required: true
  }, {
    field: AccountsTableFields.NAME,
    label: "Account Name",
    is_required: true
  }, {
    field: AccountsTableFields.AVAILABLE,
    label: "Available Balance",
    is_required: false
  }, {
    field: AccountsTableFields.CURRENT,
    label: "Current Balance",
    is_required: false,
  }, {
    field: AccountsTableFields.CURRENCY,
    label: "Account Currency",
    is_required: false,
  }, {
    field: AccountsTableFields.MASK,
    label: "Account Mask",
    is_required: false
  }, {
    field: AccountsTableFields.TYPE,
    label: "Account Type",
    is_required: false
  }, {
    field: AccountsTableFields.SUBTYPE,
    label: "Account Subtype",
    is_required: false
  }, {
    field: AccountsTableFields.LIMIT,
    label: "Account Limit",
    is_required: false,
  }, {
    field: AccountsTableFields.INTEREST_RATE,
    label: "Liability Interest Rate",
    is_required: false,
  }, {
    field: AccountsTableFields.LAST_PAYMENT_AMOUNT,
    label: "Last Payment Amount",
    is_required: false,
  }, {
    field: AccountsTableFields.LAST_PAYMENT_DATE,
    label: "Last Payment Date",
    is_required: false,
  }, {
    field: AccountsTableFields.NEXT_PAYMENT_DUE_DATE,
    label: "Next Payment Due Date",
    is_required: false,
  }, {
    field: AccountsTableFields.LAST_STATEMENT_BALANCE,
    label: "Last Statement Balance",
    is_required: false,
  }, {
    field: AccountsTableFields.MINIMUM_PAYMENT_AMOUNT,
    label: "Minimum Payment Amount",
    is_required: false,
  }, {
    field: AccountsTableFields.NEXT_MONTHLY_PAYMENT,
    label: "Next Monthly Payment",
    is_required: false,
  }, {
    field: AccountsTableFields.ORIGINATION_DATE,
    label: "Origination Date",
    is_required: false,
  }, {
    field: AccountsTableFields.ORIGINATION_PRINCIPAL_AMOUNT,
    label: "Origination Principal Amount",
    is_required: false,
  }
]

export const TRANSACTIONS_TABLE_FIELDS = [
  {
    field: TransactionsTableFields.ACCOUNT,
    label: "Related Account",
    is_required: true
  }, {
    field: TransactionsTableFields.ID,
    label: "Transaction ID",
    is_required: true
  }, {
    field: TransactionsTableFields.DATE,
    label: "Transaction Date",
    is_required: true
  }, {
    field: TransactionsTableFields.SUMMARY,
    label: "Transaction Summary",
    is_required: true
  }, {
    field: TransactionsTableFields.AMOUNT,
    label: "Transaction Amount",
    is_required: true
  }, {
    field: TransactionsTableFields.CURRENCY,
    label: "Transaction Currency",
    is_required: false
  }, {
    field: TransactionsTableFields.PENDING,
    label: "Transaction Pending Status",
    is_required: false
  }, {
    field: TransactionsTableFields.CATEGORY,
    label: "Transaction Category",
    is_required: false
  }, {
    field: TransactionsTableFields.SUB_ACCOUNT,
    label: "Transaction Sub Account",
    is_required: false
  }
]

export const HOLDINGS_TABLE_FIELDS = [
  {
    field: HoldingsTableFields.ACCOUNT,
    label: "Related Account",
    is_required: true
  }, {
    field: HoldingsTableFields.SECURITY_ID,
    label: "Related Security",
    is_required: true
  }, {
    field: HoldingsTableFields.SUMMARY,
    label: "Holding Summary",
    is_required: true,
    hideFor: [Integrations_Enum.Google]
  }, {
    field: HoldingsTableFields.QUANTITY,
    label: "Holding Quantity",
    is_required: true
  }, {
    field: HoldingsTableFields.COST_BASIS,
    label: "Holding Cost Basis",
    is_required: false
  }, {
    field: HoldingsTableFields.CURRENCY,
    label: "Holding Base Currency",
    is_required: false
  }
]

export const INVESTMENT_TRANSACTIONS_TABLE_FIELDS = [
  {
    field: InvestmentTransactionsTableFields.ACCOUNT,
    label: "Related Account",
    is_required: true
  }, {
    field: InvestmentTransactionsTableFields.ID,
    label: "Transaction ID",
    is_required: true
  }, {
    field: InvestmentTransactionsTableFields.DATE,
    label: "Transaction Date",
    is_required: true
  }, {
    field: InvestmentTransactionsTableFields.QUANTITY,
    label: "Transaction Quantity",
    is_required: true
  }, {
    field: InvestmentTransactionsTableFields.PRICE,
    label: "Security Price",
    is_required: true
  }, {
    field: InvestmentTransactionsTableFields.AMOUNT,
    label: "Transaction Amount",
    is_required: false
  }, {
    field: InvestmentTransactionsTableFields.FEES,
    label: "Transaction Fees",
    is_required: false
  }, {
    field: InvestmentTransactionsTableFields.CURRENCY,
    label: "Transaction Base Currency",
    is_required: false
  }, {
    field: InvestmentTransactionsTableFields.SUMMARY,
    label: "Transaction Summary",
    is_required: false
  }, {
    field: InvestmentTransactionsTableFields.TYPE,
    label: "Transaction Type",
    is_required: false
  }, {
    field: InvestmentTransactionsTableFields.SUBTYPE,
    label: "Transaction Subtype",
    is_required: false
  }, {
    field: InvestmentTransactionsTableFields.SECURITY_ID,
    label: "Related Security",
    is_required: false
  }
]

export const SECURITIES_TABLE_FIELDS = [
  {
    field: SecurityTableFields.ID,
    label: "Security ID",
    is_required: true
  }, {
    field: SecurityTableFields.SYMBOL,
    label: "Security Symbol",
    is_required: true
  }, {
    field: SecurityTableFields.NAME,
    label: "Security Name",
    is_required: false
  }, {
    field: SecurityTableFields.CLOSE_PRICE,
    label: "Close Price",
    is_required: false
  }, {
    field: SecurityTableFields.CLOSE_PRICE_AS_OF,
    label: "Close Price As Of",
    is_required: false
  }, {
    field: SecurityTableFields.TYPE,
    label: "Security Type",
    is_required: false
  },
]

export const CATEGORIES_TABLE_FIELDS = [
  {
    field: CategoryTableFields.ID,
    label: "Category ID",
    is_required: true
  }, {
    field: CategoryTableFields.NAME,
    label: "Category Name",
    is_required: true
  }, {
    field: CategoryTableFields.CATEGORY_GROUP,
    label: "Category Group",
    is_required: false
  }
]

export const fieldToTypeMapping = {
  [DestinationTableTypes.INSTITUTIONS]: {
    [InstitutionsTableFields.ID]: {
      notion: [ 'rich_text' ],
      airtable: [ 'singleLineText', 'richText', 'multilineText' ]
    },
    [InstitutionsTableFields.NAME]: {
      notion: [ 'title' ],
      airtable: [ 'primary' ]
    },
    [InstitutionsTableFields.ERROR]: {
      notion: ['rich_text'],
      airtable: [ 'singleLineText', 'richText', 'multilineText' ]
    },
    [InstitutionsTableFields.LAST_UPDATE]: {
      notion: [ 'date' ],
      airtable: [ 'date', 'dateTime' ]
    }
  },
  [DestinationTableTypes.ACCOUNTS]: {
    [AccountsTableFields.ID]: {
      notion: [ 'rich_text' ],
      airtable: [ 'singleLineText', 'richText', 'multilineText' ]
    },
    [AccountsTableFields.NAME]: {
      notion: [ 'title' ],
      airtable: [ 'primary' ]
    },
    [AccountsTableFields.INSTITUTION]: {
      notion: [ 'relation' ],
      airtable: ['multipleRecordLinks']
    },
    [AccountsTableFields.AVAILABLE]: {
      notion: [ 'number' ],
      airtable: [ 'currency', 'number']
    },
    [AccountsTableFields.CURRENT]: {
      notion: [ 'number' ],
      airtable: [ 'currency', 'number']
    },
    [AccountsTableFields.CURRENCY]: {
      notion: [ 'select' ],
      airtable: [ 'multipleSelects', 'singleSelect', 'singleLineText', 'richText', 'multilineText' ]
    },
    [AccountsTableFields.MASK]: {
      notion: [ 'rich_text' ],
      airtable: [ 'singleLineText', 'richText', 'multilineText' ]
    },
    [AccountsTableFields.TYPE]: {
      notion: [ 'select' ],
      airtable: [ 'multipleSelects', 'singleSelect' ]
    },
    [AccountsTableFields.SUBTYPE]: {
      notion: [ 'select' ],
      airtable: [ 'multipleSelects', 'singleSelect' ]
    },
    [AccountsTableFields.LIMIT]: {
      notion: [ 'number' ],
      airtable: [ 'currency', 'number']
    },
    [AccountsTableFields.INTEREST_RATE]: {
      notion: [ 'number' ],
      airtable: [ 'currency', 'number']
    },
    [AccountsTableFields.LAST_PAYMENT_AMOUNT]: {
      notion: [ 'number' ],
      airtable: [ 'currency', 'number']
    },
    [AccountsTableFields.LAST_PAYMENT_DATE]: {
      notion: [ 'date' ],
      airtable: [ 'date', 'dateTime' ]
    },
    [AccountsTableFields.NEXT_PAYMENT_DUE_DATE]: {
      notion: [ 'date' ],
      airtable: [ 'date', 'dateTime' ]
    },
    [AccountsTableFields.LAST_STATEMENT_BALANCE]: {
      notion: [ 'number' ],
      airtable: [ 'currency', 'number']
    },
    [AccountsTableFields.MINIMUM_PAYMENT_AMOUNT]: {
      notion: [ 'number' ],
      airtable: [ 'currency', 'number']
    },
    [AccountsTableFields.NEXT_MONTHLY_PAYMENT]: {
      notion: [ 'number' ],
      airtable: [ 'currency', 'number']
    },
    [AccountsTableFields.ORIGINATION_DATE]: {
      notion: [ 'date' ],
      airtable: [ 'date', 'dateTime' ]
    },
    [AccountsTableFields.ORIGINATION_PRINCIPAL_AMOUNT]: {
      notion: [ 'number' ],
      airtable: [ 'currency', 'number']
    },
  },
  [DestinationTableTypes.CATEGORIES]: {
    [CategoryTableFields.ID]: {
      notion: [ 'rich_text' ],
      airtable: [ 'singleLineText', 'richText', 'multilineText' ]
    },
    [CategoryTableFields.CATEGORY_GROUP]: {
      notion: ['select'],
      airtable: [ 'multipleSelects', 'singleSelect' ]
    },
    [CategoryTableFields.NAME]: {
      notion: ['title'],
      airtable: [ 'primary' ]
    }
  },
  [DestinationTableTypes.HOLDINGS]: {
    [HoldingsTableFields.ACCOUNT]: {
      notion: ['relation'],
      airtable: ['multipleRecordLinks']
    },
    [HoldingsTableFields.COST_BASIS]: {
      notion: ['number'],
      airtable: [ 'currency', 'number']
    },
    [HoldingsTableFields.CURRENCY]: {
      notion: ['select'],
      airtable: [ 'multipleSelects', 'singleSelect', 'singleLineText', 'richText', 'multilineText' ]
    },
    [HoldingsTableFields.QUANTITY]: {
      notion: ['number'],
      airtable: [ 'currency', 'number']
    },
    [HoldingsTableFields.SECURITY_ID]: {
      notion: ['relation'],
      airtable: ['multipleRecordLinks']
    },
    [HoldingsTableFields.SUMMARY]: {
      notion: ['title'],
      airtable: [ 'primary' ]
    }
  },
  [DestinationTableTypes.INVESTMENT_TRANSACTIONS]: {
    [InvestmentTransactionsTableFields.ACCOUNT]: {
      notion: ['relation'],
      airtable: ['multipleRecordLinks']
    },
    [InvestmentTransactionsTableFields.AMOUNT]: {
      notion: ['number'],
      airtable: [ 'currency', 'number']
    },
    [InvestmentTransactionsTableFields.DATE]: {
      notion: ['date'],
      airtable: [ 'date', 'dateTime' ]
    },
    [InvestmentTransactionsTableFields.FEES]: {
      notion: ['number'],
      airtable: [ 'currency', 'number']
    },
    [InvestmentTransactionsTableFields.ID]: {
      notion: ['rich_text'],
      airtable: [ 'singleLineText', 'richText', 'multilineText' ]
    },
    [InvestmentTransactionsTableFields.CURRENCY]: {
      notion: ['select'],
      airtable: [ 'multipleSelects', 'singleSelect', 'singleLineText', 'richText', 'multilineText' ]
    },
    [InvestmentTransactionsTableFields.SUMMARY]: {
      notion: ['title'],
      airtable: [ 'primary' ]
    },
    [InvestmentTransactionsTableFields.PRICE]: {
      notion: ['number'],
      airtable: [ 'currency', 'number']
    },
    [InvestmentTransactionsTableFields.QUANTITY]: {
      notion: ['number'],
      airtable: [ 'currency', 'number']
    },
    [InvestmentTransactionsTableFields.SECURITY_ID]: {
      notion: ['relation'],
      airtable: ['multipleRecordLinks']
    },
    [InvestmentTransactionsTableFields.SUBTYPE]: {
      notion: ['select'],
      airtable: [ 'multipleSelects', 'singleSelect' ]
    },
    [InvestmentTransactionsTableFields.TYPE]: {
      notion: ['select'],
      airtable: [ 'multipleSelects', 'singleSelect' ]
    }
  },
  [DestinationTableTypes.SECURITIES]: {
    [SecurityTableFields.ID]: {
      notion: ['rich_text'],
      airtable: [ 'singleLineText', 'richText', 'multilineText' ]
    },
    [SecurityTableFields.NAME]: {
      notion: ['rich_text'],
      airtable: [ 'singleLineText', 'richText', 'multilineText' ]
    },
    [SecurityTableFields.SYMBOL]: {
      notion: ['title'],
      airtable: [ 'primary' ]
    },
    [SecurityTableFields.CLOSE_PRICE]: {
      notion: ['number'],
      airtable: [ 'currency', 'number']
    },
    [SecurityTableFields.CLOSE_PRICE_AS_OF]: {
      notion: ['date'],
      airtable: [ 'date', 'dateTime' ]
    },
    [SecurityTableFields.TYPE]: {
      notion: ['select'],
      airtable: [ 'multipleSelects', 'singleSelect' ]
    },
  },
  [DestinationTableTypes.TRANSACTIONS]: {
    [TransactionsTableFields.SUMMARY]: {
      notion: ['title'],
      airtable: [ 'primary' ]
    },
    [TransactionsTableFields.DATE]: {
      notion: ['date'],
      airtable: [ 'date', 'dateTime' ]
    },
    [TransactionsTableFields.ACCOUNT]: {
      notion: ['relation'],
      airtable: ['multipleRecordLinks']
    },
    [TransactionsTableFields.CATEGORY]: {
      notion: ['relation'],
      airtable: ['multipleRecordLinks']
    },
    [TransactionsTableFields.AMOUNT]: {
      notion: ['number'],
      airtable: [ 'currency', 'number']
    },
    [TransactionsTableFields.CURRENCY]: {
      notion: ['select'],
      airtable: [ 'multipleSelects', 'singleSelect', 'singleLineText', 'richText', 'multilineText' ]
    },
    [TransactionsTableFields.PENDING]: {
      notion: ['checkbox'],
      airtable: [ 'checkbox' ]
    },
    [TransactionsTableFields.ID]: {
      notion: ['rich_text'],
      airtable: [ 'singleLineText', 'richText', 'multilineText' ]
    },
    [TransactionsTableFields.SUB_ACCOUNT]: {
      notion: ['rich_text'],
      airtable: [ 'singleLineText', 'richText', 'multilineText' ]
    }
  }
} as Record<DestinationTableTypes, Record<TableConfigFields, { notion: NotionPropertyType[], airtable: AirtableFieldType[] }>>


