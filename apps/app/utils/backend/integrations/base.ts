import { FieldSet, Record as AirtableRecord } from "airtable";
import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { GoogleSpreadsheetRow, GoogleSpreadsheetWorksheet } from "google-spreadsheet";
import { Integrations_Enum } from "~/graphql/backend/sdk";
import { GetDestinationTablesResponse, ValidateDestinationCredentialsResponse, ValidateDestinationTableConfigsResponse } from "~/types/shared/functions";
import { AccountsTableFields, CategoryTableFields, DestinationAuthentication, DestinationError, DestinationErrorCode, DestinationTableTypes, fieldToTypeMapping, HoldingsTableFields, InstitutionsTableFields, InvestmentTransactionsTableFields, SecurityTableFields, TableConfig, TableConfigFields, TableConfigs, TransactionsTableFields } from "~/types/shared/models"
import { Logger } from "../logger";
import { PlaidItemModel } from "~/types/backend/models";
import { AccountBase, Holding, InvestmentTransaction, Security, Transaction } from "plaid";
import * as _ from "lodash";

export type IntegrationBaseProps = {
  authentication: DestinationAuthentication;
  userId: string;
  logger: Logger
}

export type ValidateTableConfigProps = {
  tableId: string;
  fields: TableConfig['fields'];
  tableType: DestinationTableTypes
}

type IntegrationConfig = Record<DestinationTableTypes, {
  tableId: string;
  fields: { field: TableConfigFields, field_id: string }[],
  records: IntegrationRecord[];
  isEnabled: boolean;
}>

const recordWithoutObject = (record?: IntegrationRecord) => {
  if ( record ) { return { id: record.id, properties: record.properties }}
}

export type ValidateTableConfigResponse = { isValid: boolean; error?: DestinationError}

export type ValidateFuncProps = { tableTypes?: DestinationTableTypes[]; tableConfigs: TableConfigs };
export type ValidateFuncResponse = { isValid: boolean; error: DestinationError | null};

export type SyncDataFuncProps = { 
  item: PlaidItemModel, 
  accounts?: AccountBase[], 
  transactions?: Transaction[], 
  removedTransactions?: string[], 
  holdings?: Holding[], 
  investmentTransactions?: InvestmentTransaction[], 
  securities?: Security[],
  categories?: { id: string; name: string; category_group: string }[]
  timezone?: string;
  shouldOverrideTransactionName?: boolean;
};
export type SyncDataFuncResponse = { 
  accounts: { added: string[], updated: string[]},
  holdings: { added: number; updated: number},
  transactions: { added: number; updated: number, removed: number},
  investmentTransactions: { added: number }
};

// Universal record type for all integrations
export type IntegrationRecord = {
  id: string | number; // The sheet / page / record id used by the integration
  properties: Record<TableConfigFields, any>;
  object: GoogleSpreadsheetRow | PageObjectResponse | AirtableRecord<FieldSet>
}

export type Category = { id: string; name: string; category_group: string }

export class IntegrationBase {
  authentication: DestinationAuthentication;
  userId: string;
  logger: Logger;
  integration: Integrations_Enum;
  isLegacy: boolean;
  config: IntegrationConfig
  isGoogle: boolean;

  constructor({ authentication, userId, logger }: IntegrationBaseProps) {
    this.authentication = authentication;
    this.userId = userId;
    this.logger = logger;
    this.isLegacy = false;
    this.isGoogle = false;
  }

  async validateTableConfigs({ tableTypes, tableConfigs }: ValidateFuncProps): Promise<ValidateDestinationTableConfigsResponse> {
    const { tables } = await this.getTables();

    return Promise.all((tableTypes || Object.keys(tableConfigs) as DestinationTableTypes[]).map(tableType => {
      const tableConfig = tableConfigs[tableType]!;
      const { table_id: tableId, fields, is_enabled } = tableConfig;
      if ( !is_enabled ) { return { isValid: true }};
      if ( this.isLegacy ) {
        return this._validateTableConfig({ tableId, tableType, fields })
      }
      
      const table = tables.find(t => t.tableId === tableId);
      if ( !table ) {
        return {
          isValid: false,
          error: {
            errorCode: DestinationErrorCode.MISSING_TABLE,
            tableType,
            tableId
          }
        }
      }

      const tableFieldIds = table.fields.map(field => field.fieldId);
      const missingField = fields.find(field => !tableFieldIds.includes(field.field_id));
      if ( missingField ) {
        return {
          isValid: false,
          error: {
            errorCode: DestinationErrorCode.MISSING_FIELD,
            table: table.name,
            tableId,
            tableType,
            fieldId: missingField.field_id,
            fieldType: missingField.field
          }
        }
      }

      if ( [ Integrations_Enum.Airtable, Integrations_Enum.Notion ].includes(this.integration) ) {
        const fieldWithIncorrectType = fields.find(field => {
          const tableField = table.fields.find(f => f.fieldId === field.field_id)!;
          return !fieldToTypeMapping[tableType][field.field][this.integration].includes(tableField.type)
        });

        if ( fieldWithIncorrectType ) {
          return {
            isValid: false,
            error: {
              errorCode: DestinationErrorCode.INCORRECT_FIELD_TYPE,
              table: table.name,
              tableId,
              tableType,
              fieldId: fieldWithIncorrectType.field_id,
              fieldType: fieldWithIncorrectType.field,
              field: table.fields.find(f => f.fieldId === fieldWithIncorrectType.field_id)!.name
            }
          }
        }
      }
    
      return { isValid: true }
    }))
    .then(responses => {
      const invalidResponses = responses.filter(response => !response.isValid)
      return { isValid: invalidResponses.length === 0, errors: invalidResponses.map(response => response.error)}
    })
  }

  async validate({ tableTypes, tableConfigs }: ValidateFuncProps): Promise<ValidateFuncResponse> {
    const authCheck = await this.validateAuthentication();
    if ( !authCheck.isValid ) { return { isValid: false, error: { errorCode: authCheck.errorCode! }}}

    const tableCheck = await this.validateTableConfigs({ tableTypes, tableConfigs });
    if ( !tableCheck.isValid ) { return { isValid: false, error: tableCheck.errors[0] }};

    return { isValid: true, error: null }
  }

  async getDefaultConfig(): Promise<TableConfigs> {
    const { tables } = await this.getTables();
    return this.formatter.defaultConfig({ tables })
  }

  async load({ tableTypes, tableConfigs }: { tableTypes: DestinationTableTypes[]; tableConfigs: TableConfigs }): Promise<void> {
    this.logger.info("Loading data", { tableTypes })
    this.config = Object.fromEntries(await Promise.all(Object.entries(tableConfigs).map(async ([ tableType, { is_enabled: isEnabled, table_id: tableId, fields }]) => {
      if ( !isEnabled || !tableId || !tableTypes.includes(tableType as DestinationTableTypes) ) { return [ tableType, { tableId, fields, isEnabled, records: [] }]};
      const records = await this.queryTable({ tableId, tableConfigFields: fields });
      await this.logger.info("Initial load complete", { totalRecords: records.length, exampleRecord: recordWithoutObject(records[0]), tableType })
      return [ tableType, { tableId, fields, records, isEnabled }]
    })))
  }

  async syncData({ item, accounts, transactions, holdings, securities, investmentTransactions, removedTransactions, categories, shouldOverrideTransactionName, timezone }: SyncDataFuncProps): Promise<SyncDataFuncResponse> {
    // Upsert Institution
    const institutionRecord = await this.upsertItem({ item });
    this.logger.info("Institution record upserted", { record: recordWithoutObject(institutionRecord) })

    // Upsert Accounts, Securities, and Categories
    const [{ records: accountRecords, results: accountResults }, categoryRecords, securityRecords ] = await Promise.all([
      this.upsertAccounts({ accounts, institutionRecord })
        .then(response => {
          this.logger.info("Account records upserted", { records: response.records.map(recordWithoutObject), results: response.results });
          return response;
        }),
      this.upsertCategories({ categories })
        .then(response => {
          this.logger.info("Categories records upserted", { records: response.map(recordWithoutObject) });
          return response;
        }),
      this.upsertSecurities({ securities })
        .then(response => {
          this.logger.info("Securities records upserted", { records: response.map(recordWithoutObject) });
          return response;
        })
    ])

    // Upsert Transactions, Holdings, and Investment Transactions
    const [ transactionResults, holdingsResults, investmentTransactionResults ] = await Promise.all([
      this.upsertTransaction({ transactions, removedTransactions, accountRecords, categoryRecords, shouldOverrideTransactionName })
        .then(response => {
          this.logger.info("Transaction records upserted", { results: response });
          return response;
        }),
      this.upsertHoldings({ holdings, securityRecords, accountRecords })
        .then(response => {
          this.logger.info("Holdings records upserted", { results: response });
          return response;
        }),
      this.upsertInvestmentTransactions({ investmentTransactions, accountRecords, securityRecords })
        .then(response => {
          this.logger.info("Investment transactions upserted", { results: response });
          return response;
        })
    ])

    // Update Last Update timestamp for Institution
    await this.updateRecords({ 
      tableId: this.config.institutions.tableId,
      data: [{ 
        record: institutionRecord, 
        fields: this.formatter.institution.updated({ item, tableConfigFields: this.config.institutions.fields, timezone})
      }],
      tableConfigFields: this.config.institutions.fields
    })

    this.logger.info("Institution record updated");

    return {
      accounts: accountResults,
      transactions: transactionResults,
      holdings: holdingsResults,
      investmentTransactions: investmentTransactionResults
    }
  }

  async upsertItem({ item }: { item: PlaidItemModel }): Promise<IntegrationRecord> {
    const { tableId, fields, records } = this.config.institutions;
    const record = records.find(record => record.properties[InstitutionsTableFields.ID] === item.id);
    if ( record ) { return record };

    const formattedItem = this.formatter.institution.new({ item, tableConfigFields: fields });
    return this.createRecords({ tableId, data: [ formattedItem ], tableConfigFields: fields }).then(response => response[0])
  }

  async upsertAccounts({ accounts, institutionRecord }: { accounts?: AccountBase[]; institutionRecord: IntegrationRecord }): Promise<{ records: IntegrationRecord[], results: { added: string[]; updated: string[] }}> {
    if ( !accounts ) { return { records: [], results: { added: [], updated: [] }} };
    const { tableId, fields, isEnabled, records } = this.config.accounts;
    if ( !tableId || !isEnabled ) { return { records: [], results: { added: [], updated: [] }} }

    const recordAccountIds = records.map(record => record.properties[AccountsTableFields.ID]);
    const accountsToCreate = accounts
      .filter(account => !recordAccountIds.includes(account.account_id))
      .map(account => this.formatter.account.new({ 
        account, 
        itemRecordId: this.isGoogle ? institutionRecord.properties[InstitutionsTableFields.ID] : institutionRecord.id,
        tableConfigFields: fields
      }));

    const accountsToUpdate = accounts
      .filter(account => recordAccountIds.includes(account.account_id))
      .map(account => {
        const record = records.find(rec => rec.properties[AccountsTableFields.ID] === account.account_id)!;
        const shouldUpdate = record.properties[AccountsTableFields.AVAILABLE] !== account.balances.available
          || record.properties[AccountsTableFields.CURRENT] !== account.balances.current
          || record.properties[AccountsTableFields.LIMIT] !== account.balances.limit;
        return { 
          shouldUpdate, 
          fields: this.formatter.account.updated({ account, tableConfigFields: fields }), 
          record 
        }
      })
      .filter(({ shouldUpdate }) => !!shouldUpdate )
    
    return Promise.all([
      this.createRecords({ tableId, data: accountsToCreate, tableConfigFields: fields }),
      this.updateRecords({ tableId, data: accountsToUpdate, tableConfigFields: fields })
    ])
    .then(([ newRecords, updatedRecords ]) => ({
      records: newRecords.concat(records),
      results: {
        added: newRecords.map(record => record.properties[AccountsTableFields.ID]),
        updated: updatedRecords.map(record => record.properties[AccountsTableFields.ID])
      }
    }))
  }

  async upsertCategories({ categories }: { categories?: Category[]} ) {
    if ( !categories ) { return [] };
    const { tableId, fields, records, isEnabled } = (this.config.categories || { tableId: undefined, fields: [], records: [], isEnabled: false })
    if ( !tableId || !isEnabled ) { return [] }

    const recordCategoryIds = records.map(record => record.properties[CategoryTableFields.ID]);
    const categoriesToCreate = categories
      .filter(category => !recordCategoryIds.includes(category.id))
      .map(category => this.formatter.category.new({
        category,
        tableConfigFields: fields
      }))
    return this.createRecords({ tableId, data: categoriesToCreate, tableConfigFields: fields })
    .then(newRecords => newRecords.concat(records))
  }

  async upsertSecurities({ securities }: { securities?: Security[]}) {
    if ( !securities ) { return [] };
    const { tableId, fields, records, isEnabled } = (this.config.securities || { tableId: undefined, fields: [], records: [], isEnabled: false })
    if ( !tableId || !isEnabled ) { return [] }

    const recordSecurityIds = records.map(record => record.properties[SecurityTableFields.ID]);
    const securitiesToCreate = securities.filter(security => !recordSecurityIds.includes(security.security_id))
      .map(security => this.formatter.security.new({ security, tableConfigFields: fields }))
    const securitiesToUpdate = securities.filter(security => recordSecurityIds.includes(security.security_id))
      .map(security => {
        const record = records.find(rec => rec.properties[SecurityTableFields.ID] === security.security_id)!;
        const shouldUpdate = record.properties[SecurityTableFields.CLOSE_PRICE] !== security.close_price 
          || record.properties[SecurityTableFields.CLOSE_PRICE_AS_OF] !== security.close_price_as_of
        return { shouldUpdate, fields: this.formatter.security.updated({ security, tableConfigFields: fields }), record }
      })
      .filter(({ shouldUpdate }) => !!shouldUpdate )
    
    return Promise.all([
      this.createRecords({ tableId, data: securitiesToCreate, tableConfigFields: fields }),
      this.updateRecords({ tableId, data: securitiesToUpdate, tableConfigFields: fields })
    ])
    .then(([ newRecords, updatedRecords ]) => newRecords.concat(records))
  }

  async upsertTransaction({ transactions, removedTransactions = [], accountRecords, categoryRecords, shouldOverrideTransactionName }: { transactions?: Transaction[]; removedTransactions: string[]; accountRecords: IntegrationRecord[]; categoryRecords: IntegrationRecord[]; shouldOverrideTransactionName: boolean }) {
    if ( !transactions ) { return { added: 0, updated: 0, removed: 0 }};
    const { tableId, fields, records, isEnabled } = this.config.transactions;
    if ( !tableId || !isEnabled ) { return { added: 0, updated: 0, removed: 0 }};

    const recordTransactionIds = records.map(record => record.properties[TransactionsTableFields.ID]);
    const pendingTransactionIds = transactions.filter(transaction => !!transaction.pending_transaction_id).map(transaction => transaction.pending_transaction_id)
    const nonPendingRemovedTransactions = _.difference((removedTransactions || []), pendingTransactionIds);

    const transactionsToCreate = transactions.filter(transaction => !recordTransactionIds.includes(transaction.transaction_id) && !recordTransactionIds.includes(transaction.pending_transaction_id))
      .map(transaction => {
        const accountRecord = accountRecords.find(record => record.properties[AccountsTableFields.ID] === transaction.account_id);
        const categoryRecord = categoryRecords.find(record => record.properties[CategoryTableFields.ID] === transaction.category_id);
        return this.formatter.transaction.new({ 
          transaction, 
          accountRecordId: this.isGoogle ? transaction.account_id : accountRecord.id as string,
          categoryRecordId: this.isGoogle ? transaction.category_id : categoryRecord?.id as string,
          tableConfigFields: fields
        })
      })
    const transactionsToUpdate = transactions.filter(transaction => recordTransactionIds.includes(transaction.pending_transaction_id))
      .map(transaction => {
        const record = recordTransactionIds.find(rec => rec.properties[TransactionsTableFields.ID] === transaction.pending_transaction_id)!;
        return { 
          fields: this.formatter.transaction.updated({ 
            transaction, 
            shouldOverrideTransactionName, 
            oldTransactionSummary: record.properties[TransactionsTableFields.SUMMARY], 
            tableConfigFields: fields 
          }), 
          record 
        }
      })
    const recordsToRemove = records.filter(record => nonPendingRemovedTransactions.includes(record.properties[TransactionsTableFields.ID]))

    return Promise.all([
      this.createRecords({ tableId, data: transactionsToCreate, tableConfigFields: fields }),
      this.updateRecords({ tableId, data: transactionsToUpdate, tableConfigFields: fields }),
      this.deleteRecords({ tableId, records: recordsToRemove })
    ])
    .then(() => ({
      added: transactionsToCreate.length,
      updated: transactionsToUpdate.length,
      removed: recordsToRemove.length
    }))
  }

  async upsertHoldings({ holdings, securityRecords, accountRecords }: { holdings: Holding[]; securityRecords: IntegrationRecord[]; accountRecords: IntegrationRecord[] }) {
    if ( !holdings ) { return { added: 0, updated: 0 }};
    const { tableId, fields, records, isEnabled } = this.config.holdings;
    if ( !tableId || !isEnabled ) { return { added: 0, updated: 0 }};

    const mappedHoldings = holdings.map(holding => {
      const accountRecord = accountRecords.find(record => record.properties[AccountsTableFields.ID] === holding.account_id);
      const securityRecord = securityRecords.find(record => record.properties[SecurityTableFields.ID] === holding.security_id);
      const holdingRecord = records.find(record => record.properties[HoldingsTableFields.ACCOUNT] === holding.account_id && record.properties[HoldingsTableFields.SECURITY_ID] === holding.security_id);
      const shouldUpdate = holdingRecord && (holdingRecord?.properties[HoldingsTableFields.COST_BASIS] !== holding.cost_basis
        || holdingRecord?.properties[HoldingsTableFields.CURRENCY] !== holding.iso_currency_code
        || holdingRecord?.properties[HoldingsTableFields.QUANTITY] !== holding.quantity);
      return { shouldUpdate, accountRecord, securityRecord, record: holdingRecord, holding }
    });
    const holdingsToCreate = mappedHoldings.filter(mh => !mh.record)
      .map(({ holding, accountRecord, securityRecord }) => this.formatter.holding.new({ 
        holding, 
        accountRecordId: this.isGoogle ? holding.account_id : accountRecord?.id as string, 
        securityRecordId: this.isGoogle ? holding.security_id : securityRecord?.id as string, 
        tableConfigFields: fields,
        symbol: securityRecord ? securityRecord.properties[SecurityTableFields.SYMBOL] : ""
      }))
    const holdingsToUpdate = mappedHoldings.filter(({ shouldUpdate }) => !!shouldUpdate)
      .map(({ holding, record }) => ({ record, fields: this.formatter.holding.updated({ holding, tableConfigFields: fields })}))
    
    return Promise.all([
      this.createRecords({ tableId, data: holdingsToCreate, tableConfigFields: fields }),
      this.updateRecords({ tableId, data: holdingsToUpdate, tableConfigFields: fields })
    ])
    .then(() => ({ 
      added: holdingsToCreate.length,
      updated: holdingsToUpdate.length
    }))
  }

  async upsertInvestmentTransactions({ investmentTransactions, securityRecords, accountRecords }: { investmentTransactions: InvestmentTransaction[]; securityRecords: IntegrationRecord[]; accountRecords: IntegrationRecord[] }) {
    if ( !investmentTransactions ) { return { added: 0 }};
    const { tableId, fields, records, isEnabled } = this.config.investment_transactions;
    if ( !tableId || !isEnabled ) { return { added: 0 }};

    const recordTransactionIds = records.map(record => record.properties[InvestmentTransactionsTableFields.ID]);
    const transactionsToCreate = investmentTransactions.filter(transaction => !recordTransactionIds.includes(transaction.investment_transaction_id))
      .map(transaction => {
        const accountRecord = accountRecords.find(record => record.properties[AccountsTableFields.ID] === transaction.account_id);
        const securityRecord = securityRecords.find(record => record.properties[SecurityTableFields.ID] === transaction.security_id);
        return this.formatter.investmentTransaction.new({ 
          investmentTransaction: transaction, 
          accountRecordId: this.isGoogle ? transaction.account_id : accountRecord?.id as string,
          securityRecordId: this.isGoogle ? transaction.security_id : securityRecord?.id as string, 
          tableConfigFields: fields
        })
      })
    
    return this.createRecords({ tableId, data: transactionsToCreate, tableConfigFields: fields }).then(() => ({ added: transactionsToCreate.length }))
  }

  // Methods handled in sub-classes
  async init(): Promise<void> {} 
  async validateAuthentication(): Promise<ValidateDestinationCredentialsResponse> { return {} as ValidateDestinationCredentialsResponse }
  async getTables(): Promise<GetDestinationTablesResponse> { return {} as GetDestinationTablesResponse }

  // Sub-Class helper methods
  async _validateTableConfig({ tableId, tableType, fields }: ValidateTableConfigProps): Promise<ValidateTableConfigResponse> { return {} as ValidateTableConfigResponse};
  async queryTable({ tableId, tableConfigFields }: { tableId: string; tableConfigFields: { field: TableConfigFields, field_id: string }[] }): Promise<IntegrationRecord[]> { return [] }
  async createRecords({ tableId, data, tableConfigFields }: { tableId: string, data: Record<string, any>[]; tableConfigFields: TableConfig['fields']}): Promise<IntegrationRecord[]> { return [] }
  async updateRecords({ tableId, data, tableConfigFields }: { tableId: string, data: { fields: Record<string, any>, record: IntegrationRecord }[]; tableConfigFields: TableConfig['fields']}): Promise<IntegrationRecord[]> { return [] }
  async deleteRecords({ tableId, records }: { tableId: string; records: IntegrationRecord[]}): Promise<void> {}


  formatter = {
    defaultConfig: ({ tables }) => {},
    institution: {
      new: ({ item, tableConfigFields }) => {},
      updated: ({ item, tableConfigFields, timezone }) => {}
    },
    account: {
      new: ({ account, itemRecordId, tableConfigFields }) => {},
      updated: ({ account, tableConfigFields }) => {}
    },
    category: {
      new: ({ category, tableConfigFields }) => {}
    },
    holding: {
      new: ({ holding, accountRecordId, securityRecordId, symbol, tableConfigFields }) => {},
      updated: ({ holding, tableConfigFields }) => {}
    },
    investmentTransaction: {
      new: ({ investmentTransaction, accountRecordId, securityRecordId, tableConfigFields }) => {},
    },
    security: {
      new: ({ security, tableConfigFields }) => {},
      updated: ({ security, tableConfigFields }) => {}
    },
    transaction: {
      new: ({ transaction, accountRecordId, categoryRecordId, tableConfigFields }) => {},
      updated: ({ transaction, shouldOverrideTransactionName, oldTransactionSummary, tableConfigFields }) => {}
    }
  } as {
    defaultConfig: ({ tables }: GetDestinationTablesResponse) => TableConfigs;
    institution: {
      new: ({ item, tableConfigFields }: { item: PlaidItemModel, tableConfigFields: TableConfig['fields'] }) => Record<string, any>
      updated: ({ item, tableConfigFields, timezone }: { item: PlaidItemModel, tableConfigFields: TableConfig['fields'], timezone?: string }) => Record<string, any>
    },
    account: {
      new: ({ account, itemRecordId, tableConfigFields }: { account: AccountBase; itemRecordId: string; tableConfigFields: TableConfig['fields']}) => Record<string, any>,
      updated: ({ account, tableConfigFields }: { account: AccountBase; tableConfigFields: TableConfig['fields']}) => Record<string, any>
    },
    category: {
      new: ({ category, tableConfigFields }: { category: Category, tableConfigFields: TableConfig['fields']}) => Record<string, any>
    },
    holding: {
      new: ({ holding, accountRecordId, securityRecordId, symbol, tableConfigFields }: { holding: Holding; accountRecordId?: string; securityRecordId?: string; symbol?: string; tableConfigFields: TableConfig['fields']}) => Record<string, any>,
      updated: ({ holding, tableConfigFields }: { holding: Holding; tableConfigFields: TableConfig['fields']}) => Record<string, any>
    },
    investmentTransaction: {
      new: ({ investmentTransaction, accountRecordId, securityRecordId, tableConfigFields }: { investmentTransaction: InvestmentTransaction; accountRecordId?: string; securityRecordId?: string; tableConfigFields: TableConfig['fields']}) => Record<string, any>,
    },
    security: {
      new: ({ security, tableConfigFields }: { security: Security; tableConfigFields: TableConfig['fields'] }) => Record<string, any>,
      updated: ({ security, tableConfigFields }: { security: Security; tableConfigFields: TableConfig['fields'] }) => Record<string, any>
    },
    transaction: {
      new: ({ transaction, accountRecordId, categoryRecordId, tableConfigFields }: { transaction: Transaction; accountRecordId: string; categoryRecordId?: string; tableConfigFields: TableConfig['fields']}) => Record<string, any>,
      updated: ({ transaction, shouldOverrideTransactionName, oldTransactionSummary, tableConfigFields }: { transaction: Transaction; shouldOverrideTransactionName: boolean; oldTransactionSummary: string; tableConfigFields: TableConfig['fields']}) => Record<string, any>
    }
  }
}