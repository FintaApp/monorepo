import { AirtableCredential, Field, GoogleSheetsCredential, Integration, NotionCredential, SyncError, Table } from "@prisma/client";
import { ALL_DESTINATION_TABLES } from "~/components/Destinations/Destination/TableConfigs/constants";
import { DestinationFieldType, TableConfig } from "~/types";

import * as types from "./types";
import { tableConfigsMeta } from "../../tableConfigsMeta";
import { AccountBase, CreditCardLiability, Holding, InvestmentTransaction, MortgageLiability, Security, StudentLoan, Transaction } from "plaid";

export class IntegrationBase {
  credentials: AirtableCredential | GoogleSheetsCredential | NotionCredential;
  userId: string;
  integration?: Integration
  isLegacy: boolean;
  config: types.IntegrationConfig;
  formatter!: {
    institution: types.InstitutionFormatter,
    account: types.AccountFormatter,
    category: types.CategoryFormatter,
    holding: types.HoldingFormatter,
    security: types.SecurityFormatter,
    investmentTransaction: types.InvestmentTransactionFormatter;
    transaction: types.TransactionFormatter;
  }
  isGoogle: boolean;

  constructor({ userId, credentials }: types.IntegrationBaseProps) {
    this.credentials = credentials;
    this.userId = userId;
    this.isLegacy = false;
    this.isGoogle = false;
    this.config = Object.values(Table).map(table => ({ isEnabled: false, tableId: '', fieldConfigs: [], table, records: [] }))
  }

  async getDefaulTableConfigs(): Promise<types.GetDefaultTableConfigsResponse> {
    const { tables } = await this.getTables();
    return {
      tableConfigs: tableConfigsMeta.map(tableConfig => {
        const table = tables.find(t => t.name === tableConfig.templateName);
        return {
          isEnabled: tableConfig.isRequired || !!table,
          table: tableConfig.table,
          tableId: table?.tableId || '',
          fieldConfigs: tableConfig.fields
            .filter(field => (field.isRequired && !field.hideFor?.includes(this.integration!)) || field.field === Field.Category) 
            .map(fieldConfig => {
              const field = table?.fields.find(f => this.integration === Integration.Google && fieldConfig.templateName.withId ? fieldConfig.templateName.withId === f.name : fieldConfig.templateName.withoutId === f.name)
              return {
                field: fieldConfig.field,
                fieldId: field?.fieldId || ''
              }
            })
        }
      })
    }
  }

  async validateTableConfigs({ tableTypes, tableConfigs }: types.ValidateTableConfigsFuncProps): Promise<types.ValidateTableConfigsFuncResponse> {
    const { tables } = await this.getTables();
    const tableTypesToCheck = tableTypes === 'all' ? ALL_DESTINATION_TABLES as Table[] : (tableTypes || tableConfigs.map(config => config.table));
    return Promise.all(tableTypesToCheck.map(tableType => {
      const tableConfig = tableConfigs.find(config => config.table === tableType)!; // Need to guarantee that every destination will always have all types of table configs
      const { tableId, isEnabled, fieldConfigs } = tableConfig;
      if ( !isEnabled ) { return { isValid: true }};
      if ( this.isLegacy ) { return this._validateTableConfig({ tableId, table: tableType, fields: fieldConfigs })}

      const table = tables.find(t => t.tableId === tableId);
      if ( !table ) {
        return {
          isValid: false,
          error: {
            code: SyncError.MissingTable,
            table: tableType,
            tableId
          }
        }
      }

      const tableFieldIds = table.fields.map(field => field.fieldId);
      if ( this.integration === Integration.Google && tableFieldIds.length === 0 ) {
        return {
          isValid: false,
          error: {
            code: SyncError.NoHeaderRow,
            table: tableType,
            tableId,
            tableName: table.name
          }
        }
      };
      
      const missingField = fieldConfigs.find(field => !tableFieldIds.includes(field.fieldId ));
      if ( missingField ) {
        return {
          isValid: false,
          error: {
            code: SyncError.MissingField,
            table: tableType,
            tableId,
            tableName: table.name,
            field: missingField.field,
            fieldId: missingField.fieldId
          }
        }
      }

      if ( (this.integration === Integration.Airtable || this.integration === Integration.Notion) && !this.isLegacy ) {
        const fieldWithIncorrectType = fieldConfigs.find(field => {
          const tableField = table.fields.find(f => f.fieldId === field.fieldId)!;
          const allowedTypes = tableConfigsMeta.find(config => config.table === tableType)!.fields.find(f => f.field === field.field)!.allowedTypes[this.integration!]! as DestinationFieldType[]
          return tableField.type && !allowedTypes.includes(tableField.type!)
        });

        if ( fieldWithIncorrectType ) {
          return {
            isValid: false,
            error: {
              code: SyncError.IncorrectFieldType,
              table: tableType,
              tableId,
              tableName: table.name,
              field: fieldWithIncorrectType.field,
              fieldId: fieldWithIncorrectType.fieldId,
              fieldName: table.fields.find(f => f.fieldId === fieldWithIncorrectType.fieldId)!.name
            }
          }
        }
      }

      return { isValid: true, error: null }
    }))
    .then(responses => {
      const invalidResponses = responses.filter(response => !response.isValid );
      return { isValid: invalidResponses.length === 0, errors: invalidResponses.map(resp => resp.error!) }
    })
  }

  async load({ tableTypes, tableConfigs }: { tableTypes: Table[], tableConfigs: TableConfig[] }): Promise<void> {
    this.config = await Promise.all(tableTypes.map(async table => {
      const { isEnabled, tableId, fieldConfigs } = (tableConfigs.find(config => config.table === table) || { table, tableId: '', isEnabled: false, fieldConfigs: [] });
      if ( !isEnabled || !tableId ) { return { table, tableId, fieldConfigs, isEnabled, records: [] }};
      const records = await this.queryTable({ tableId, fieldConfigs });
      return { table, tableId, fieldConfigs, isEnabled, records }
    }))
  }

  async loadRecords({ table, tableConfigs }: { table: Table, tableConfigs: TableConfig[] }): Promise<types.IntegrationRecord[]> {
    const { isEnabled, tableId, fieldConfigs } = tableConfigs.find(config => config.table === table) || { table, tableId: '', isEnabled: false, fieldConfigs: [] };
    if ( !isEnabled || !tableId ) { return [] };
    const records = await this.queryTable({ tableId, fieldConfigs });
    this.config = tableConfigs.map(config => config.table === table ? ({ ...config, records }) : ({ ...config, records: [] }))
    return records
  }

  async upsertItems({ items, records: manualRecords }: { items: types.PlaidItem[]; records?: types.IntegrationRecord[] }): Promise<{ records: types.IntegrationRecord[], results: { added: string[]; updated: string[] } }> {
    const config = this.config.find(config => config.table === Table.Institutions) || defaultConfig;
    const { tableId, fieldConfigs } = config;
    const records = manualRecords || config.records;
    const mappedItems = items.map(item => {
      const record = records.find(record => record.properties[Field.Id] === item.id);
      return { item, record }
    });

    const itemsToCreate = mappedItems
      .filter(mi => !mi.record)

    const newRecordsData = itemsToCreate
      .map(({ item }) => {
        const data = this.formatter.institution.new({ item });
        return this.getIntegrationFieldsFromData({ data, fieldConfigs })
      })

    return this.createRecords({ tableId, data: newRecordsData, fieldConfigs })
      .then(newRecords => ({
        records: newRecords.concat(records),
        results: {
          added: itemsToCreate.map(({ item }) => item.id),
          updated: items.filter(item => !itemsToCreate.map(({ item }) => item.id).includes(item.id)).map(item => item.id)
        }
      }))
  }

  async updateItemsOnFinish({ items, institutionRecords, timezone, config }: { items: types.PlaidItem[]; institutionRecords: types.IntegrationRecord[]; timezone?: string, config?: TableConfig }) {
    const { tableId, fieldConfigs } = config || this.config!.find(config => config.table === Table.Institutions) || defaultConfig;
    const data = items.map(item => ({
      record: institutionRecords.find(record => record.properties[Field.Id] === item.id)!,
      fields: this.getIntegrationFieldsFromData({ data: this.formatter.institution.updated({ item, timezone }), fieldConfigs }),
      iconUrl: item.institution.logoUrl || undefined
    }))
    return this.updateRecords({
      tableId,
      data,
      fieldConfigs
    })
  }

  async upsertAccounts(
    { accounts, items, institutionRecords, creditLiabilities, mortgageLiabilities, studentLiabilities, records: manualRecords }: 
    { accounts?: AccountBase[], creditLiabilities?: CreditCardLiability[]; mortgageLiabilities?: MortgageLiability[]; studentLiabilities?: StudentLoan[]; items: types.PlaidItem[], institutionRecords: types.IntegrationRecord[], records?: types.IntegrationRecord[] }): Promise<{ records: types.IntegrationRecord[], results: { added: string[]; updated: string[] }}> {
      const config = this.config.find(config => config.table === Table.Accounts) || defaultConfig;
    const { tableId, isEnabled, fieldConfigs } = config;
    if ( !accounts || !tableId || !isEnabled ) { return { records: [], results: { added: [], updated: [] }}};
    const records = manualRecords || config.records;

    const mappedAccounts = accounts.map(account => {
      const item = items.find(item => item.accounts.map(account => account.id).includes(account.account_id))!
      const institutionRecord = institutionRecords.find(record => record.properties[Field.Id] === item.id)!
      const accountRecord = records.find(record => record.properties[Field.Id] === account.account_id);
      const credit = creditLiabilities?.find(cl => cl.account_id === account.account_id);
      const mortage = mortgageLiabilities?.find(ml => ml.account_id === account.account_id);
      const student = studentLiabilities?.find(sl => sl.account_id === account.account_id);
      const accountName = item!.accounts.find(acc => acc.id === account.account_id)?.name || account.name;
      const shouldUpdate = accountRecord && (
        (accountRecord?.properties[Field.Available] !== account.balances.available && !!fieldConfigs.find(config => config.field === Field.Available))
        || (accountRecord?.properties[Field.Current] !== account.balances.current && !!fieldConfigs.find(config => config.field === Field.Current))
        || (accountRecord?.properties[Field.Limit] !== account.balances.limit && !!fieldConfigs.find(config => config.field === Field.Limit))
        || !!fieldConfigs.find(config => liabilityFields.includes(config.field)) // Update if user syncs any liability fields. Too many to put here one by one
      )
      return { record: accountRecord, shouldUpdate, account, credit, mortage, student, accountName, item, institutionRecord }
    });

    const accountsToCreate = mappedAccounts
    .filter(ma => !ma.record )
    const newRecordsData = accountsToCreate
      .map(({ account, credit, mortage, student, accountName, item, institutionRecord }) => {
        const data = this.formatter.account.new({ 
          account, 
          itemRecordId: this.isGoogle ? item.id : institutionRecord.id as string,
          credit,
          mortage,
          student,
          accountName
        });
        return this.getIntegrationFieldsFromData({ data, fieldConfigs })
      });

      const accountsToUpdate = mappedAccounts
        .filter(ma => !!ma.record && ma.shouldUpdate)
      const updatedRecordsData = accountsToUpdate
        .map(({ account, record, student, credit, mortage }) => {
          const data = this.formatter.account.updated({ account, student, credit, mortage });
          return ({ record: record!, fields: this.getIntegrationFieldsFromData({ data, fieldConfigs })})
        })

      return Promise.all([
        this.createRecords({ tableId, data: newRecordsData, fieldConfigs }),
        this.updateRecords({ tableId, data: updatedRecordsData, fieldConfigs })
      ])
      .then(([ newRecords, updatedRecords ]) => ({
        records: newRecords.concat(records),
        results: {
          added: accountsToCreate.map(({ account }) => account.account_id ),
          updated: accountsToUpdate.map(({ account }) => account.account_id )
        }
      }))
  }

  async upsertCategories({ categories, records: manualRecords }: { categories?: types.Category[]; records?: types.IntegrationRecord[] }): Promise<{ records: types.IntegrationRecord[], results: { added: string[]; }}> {
    const config = this.config.find(config => config.table === Table.Categories) || defaultConfig;
    const { tableId, isEnabled, fieldConfigs } = config
    if ( !categories || !tableId || !isEnabled ) { return { records: [], results: { added: [] }} }
    const records = manualRecords || config.records;

    const recordCategoryIds = records.map(record => record.properties[Field.Id]);
    const categoriesToCreate = categories
      .filter(category => !recordCategoryIds.includes(category.id))

    const newRecordsData = categoriesToCreate
      .map(category => {
        const data = this.formatter.category.new({ category });
        return this.getIntegrationFieldsFromData({ data, fieldConfigs })
      });
    
    return this.createRecords({ tableId, data: newRecordsData, fieldConfigs })
      .then(newRecords => ({
        records: newRecords.concat(records),
        results: { added: categoriesToCreate.map(category => category.id) }
      }))
  }

  async upsertSecurities({ securities, records: manualRecords }: { securities?: Security[]; records?: types.IntegrationRecord[] }): Promise<{ records: types.IntegrationRecord[], results: { added: string[]; updated: string[]; }}> {
    const config = this.config.find(config => config.table === Table.Securities) || defaultConfig;
    const { tableId, isEnabled, fieldConfigs } = config;
    if ( !securities || !tableId || !isEnabled ) { return { records: [], results: { added: [], updated: [] }} }
    const records = manualRecords || config.records;
    const mappedSecurities = securities.map(security => {
      const record = records.find(record => record.properties[Field.Id] === security.security_id);
      const shouldUpdate = record && (
        (record.properties[Field.ClosePrice] !== security.close_price && !!fieldConfigs.find(config => config.field === Field.ClosePrice))
        || (record.properties[Field.ClosePriceAsOf] !== security.close_price_as_of && !!fieldConfigs.find(config => config.field === Field.ClosePriceAsOf))
      )
      return { record, shouldUpdate, security }
    })

    const securitiesToCreate = mappedSecurities
      .filter(mh => !mh.record)
    const newRecordsData = securitiesToCreate
      .map(({ security }) => {
        const data = this.formatter.security.new({ security });
        return this.getIntegrationFieldsFromData({ data, fieldConfigs })
      })
    const securitiesToUpdate = mappedSecurities
      .filter(mh => !!mh.record && mh.shouldUpdate)
    const updatedRecordsData = securitiesToUpdate
      .map(({ security, record }) => {
        const data = this.formatter.security.updated({ security });
        return ({ record: record!, fields: this.getIntegrationFieldsFromData({ data, fieldConfigs })})
      })
    
    return Promise.all([
      this.createRecords({ tableId, data: newRecordsData, fieldConfigs }),
      this.updateRecords({ tableId, data: updatedRecordsData, fieldConfigs })
    ])
    .then(([ newRecords, updatedRecords ]) => ({
      records: newRecords.concat(records),
      results: {
        added: securitiesToCreate.map(({ security }) => security.security_id ),
        updated: securitiesToUpdate.map(({ security }) => security.security_id )
      }
    }))
  }

  async upsertTransactions(
    { transactions, categoryRecords, accountRecords, records: manualRecords }: 
    { transactions?: Transaction[]; categoryRecords: types.IntegrationRecord[]; accountRecords: types.IntegrationRecord[]; records?: types.IntegrationRecord[] }
  ): Promise<{ added: string[]; updated: string[]; }> {
    const config = this.config.find(config => config.table === Table.Transactions) || defaultConfig;
    const { tableId, isEnabled, fieldConfigs } = config;
    if ( !isEnabled || !tableId || !transactions || transactions.length === 0 ) { return { added: [], updated: [] }};
    const records = manualRecords || config.records;
    const mappedTransactions = transactions.map(transaction => {
      const accountRecord = accountRecords.find(record => record.properties[Field.Id] === transaction.account_id);
      const categoryRecord = categoryRecords.find(record => record.properties[Field.Id] === transaction.category_id);
      const pendingTransactionRecord = records.find(record => record.properties[Field.Id] === transaction.pending_transaction_id);
      const transactionRecord = records.find(record => record.properties[Field.Id] === transaction.transaction_id);
      return {record: transactionRecord, accountRecord, categoryRecord, pendingRecord: pendingTransactionRecord, transaction }
    });

    const transactionsToCreate = mappedTransactions
      .filter(mh => !mh.record && !mh.pendingRecord)
    const newRecordsData = transactionsToCreate
      .map(({ transaction, accountRecord, categoryRecord }) => {
        const data = this.formatter.transaction.new({
          transaction,
          accountRecordId: this.isGoogle ? transaction.account_id : accountRecord?.id as string,
          categoryRecordId: this.isGoogle ? transaction.category_id || undefined : categoryRecord?.id as string,
        });
        return this.getIntegrationFieldsFromData({ data, fieldConfigs })
      })

    const transactionsToUpdate = mappedTransactions
      .filter(mh => !!mh.pendingRecord)
    const updatedRecordsData = transactionsToUpdate
      .map(({ transaction, pendingRecord }) => {
        const data = this.formatter.transaction.updated({ transaction });
        return ({ record: pendingRecord!, fields: this.getIntegrationFieldsFromData({ data, fieldConfigs })})
      })

    return Promise.all([
      this.createRecords({ tableId, data: newRecordsData, fieldConfigs }),
      this.updateRecords({ tableId, data: updatedRecordsData, fieldConfigs })
    ])
    .then(() => ({
      added: transactionsToCreate.map(({ transaction }) => transaction.transaction_id ),
      updated: transactionsToUpdate.map(({ transaction }) => transaction.transaction_id )
    }))
  }

  async removeTransactions({ removedTransactionIds }: { removedTransactionIds?: string[] }): Promise<{ removed: number; }> {
    const { tableId, records, isEnabled } = this.config!.find(config => config.table === Table.Transactions) || defaultConfig;
    if ( !isEnabled || !tableId || !removedTransactionIds || removedTransactionIds.length === 0 ) { return { removed: 0 }};

    const recordsToRemove = records.filter(record => removedTransactionIds.includes(record.properties[Field.Id]));
    return this.deleteRecords({ tableId, records: recordsToRemove }).then(() => ({ removed: 0 }))
  }

  async upsertHoldings(
    { holdings, securityRecords, accountRecords, records: manualRecords }: 
    { holdings?: Holding[]; securityRecords: types.IntegrationRecord[]; accountRecords: types.IntegrationRecord[]; records?: types.IntegrationRecord[] }
  ): Promise<{ added: { accountId: string }[]; updated: { accountId: string }[] }> {
    const config = this.config.find(config => config.table === Table.Holdings) || defaultConfig;
    const { tableId, fieldConfigs, isEnabled } = config;
    if ( !holdings || !isEnabled || !tableId ) { return { added: [], updated: [] }};
    const records = manualRecords || config.records;
    const mappedHoldings = holdings.map(holding => {
      const accountRecord = accountRecords.find(record => record.properties[Field.Id] === holding.account_id);
      const securityRecord = securityRecords.find(record => record.properties[Field.Id] === holding.security_id);
      const holdingRecord = records.find(record => {
        if ( this.integration === Integration.Notion ) {
          return record.properties[Field.Account] === accountRecord?.id && record.properties[Field.Security] === securityRecord?.id;
        }

        if ( this.integration === Integration.Google ) {
          return record.properties[Field.Account] === holding.account_id && record.properties[Field.Security] === holding.security_id;
        }

        if ( this.integration === Integration.Airtable ) {
          return record.properties[Field.Account][0] === accountRecord?.id && record.properties[Field.Security][0] === securityRecord?.id
        }
      });
      const shouldUpdate = holdingRecord && (
        (holdingRecord?.properties[Field.CostBasis] !== holding.cost_basis && !!fieldConfigs.find(config => config.field === Field.CostBasis))
        || (holdingRecord?.properties[Field.Currency] !== holding.iso_currency_code && !!fieldConfigs.find(config => config.field === Field.Currency))
        || holdingRecord?.properties[Field.Quantity] !== holding.quantity
      )
      return { shouldUpdate, accountRecord, securityRecord, record: holdingRecord, holding }
    });

    const holdingsToCreate = mappedHoldings
      .filter(mh => !mh.record)
    const createRecordsData = holdingsToCreate
      .map(({ holding, accountRecord, securityRecord }) => {
        const data = this.formatter.holding.new({
          holding,
          accountRecordId: this.isGoogle ? holding.account_id : accountRecord?.id as string,
          securityRecordId: this.isGoogle ? holding.security_id : securityRecord?.id as string,
          symbol: securityRecord?.properties[Field.Symbol] || securityRecord?.properties[Field.Name] || ""
        });
        return this.getIntegrationFieldsFromData({ data, fieldConfigs })
      })
    const holdingsToUpdate = mappedHoldings
      .filter(mh => !!mh.record && mh.shouldUpdate)
    const updateRecordsData = holdingsToUpdate
      .map(({ holding, record }) => {
        const data = this.formatter.holding.updated({ holding });
        return ({ record: record!, fields: this.getIntegrationFieldsFromData({ data, fieldConfigs })})
      })
    
    return Promise.all([
      this.createRecords({ tableId, data: createRecordsData, fieldConfigs }),
      this.updateRecords({ tableId, data: updateRecordsData, fieldConfigs })
    ])
    .then(() => ({ 
      added: holdingsToCreate.map(({ holding }) => ({ accountId: holding.account_id })),
      updated: holdingsToUpdate.map(({ holding }) => ({ accountId: holding.account_id }))
    }))
  }

  async upsertInvestmentTransactions(
    { investmentTransactions, securityRecords, accountRecords, records: manualRecords }: 
    { investmentTransactions?: InvestmentTransaction[]; securityRecords: types.IntegrationRecord[]; accountRecords: types.IntegrationRecord[]; records?: types.IntegrationRecord[] }
  ): Promise<{ added: string[]; }> {
    const config = this.config.find(config => config.table === Table.InvestmentTransactions) || defaultConfig;
    const { tableId, fieldConfigs, isEnabled } = config;
    if ( !investmentTransactions || !tableId || !isEnabled ) { return { added: [] }};
    const records = manualRecords || config.records;
    const recordTransactionIds = records.map(record => record.properties[Field.Id]);
    const transactionsToCreate = investmentTransactions.filter(transaction => !recordTransactionIds.includes(transaction.investment_transaction_id))
    const newRecordsData = transactionsToCreate
      .map(investmentTransaction => {
        const accountRecord = accountRecords.find(record => record.properties[Field.Id] === investmentTransaction.account_id);
        const securityRecord = securityRecords.find(record => record.properties[Field.Id] === investmentTransaction.security_id);
        const data = this.formatter.investmentTransaction.new({ 
          investmentTransaction, 
          accountRecordId: this.isGoogle ? investmentTransaction.account_id : accountRecord?.id as string,
          securityRecordId: this.isGoogle ? (investmentTransaction.security_id || undefined) : securityRecord?.id as string
        });
        return this.getIntegrationFieldsFromData({ data, fieldConfigs })
      })
    
    return this.createRecords({ tableId, data: newRecordsData, fieldConfigs })
      .then(() => ({ 
        added: transactionsToCreate.map(investmentTransaction => investmentTransaction.investment_transaction_id) 
      }))
  }

  // Externally-used methods handled in sub-classes
  async init(): Promise<void> {}
  async validateCredentials(): Promise<types.ValidateDestinationCredentialsResponse> { return {} as types.ValidateDestinationCredentialsResponse }
  async getTables(): Promise<types.GetDestinationTablesRepsonse> { return {} as types.GetDestinationTablesRepsonse }

  // Internally-used methods handled in sub-classes
  async _validateTableConfig({ tableId, table, fields }: types.ValidateTableConfigProps): Promise<types.AirtableLegacyValidateResponse> { return {} as types.AirtableLegacyValidateResponse};
  async queryTable({ tableId, fieldConfigs }: { tableId: string; fieldConfigs: TableConfig['fieldConfigs'] }): Promise<types.IntegrationRecord[]> { return [] }
  async createRecords({ tableId, data, fieldConfigs }: { tableId: string, data: Record<string, any>[]; fieldConfigs: TableConfig['fieldConfigs']}): Promise<types.IntegrationRecord[]> { return [] }
  async updateRecords({ tableId, data, fieldConfigs }: { tableId: string, data: { fields: Record<string, any>; record: types.IntegrationRecord; iconUrl?: string;}[]; fieldConfigs: TableConfig['fieldConfigs']}): Promise<types.IntegrationRecord[]> { return [] }
  async deleteRecords({ tableId, records }: { tableId: string; records: types.IntegrationRecord[]}): Promise<void> {}

  // Methods used in sub-classes
  getIntegrationFieldsFromData = ({ data, fieldConfigs }: { data: Record<Field, any>, fieldConfigs: TableConfig['fieldConfigs'] }) => {
    return Object.fromEntries(
      fieldConfigs
        .filter(fieldConfig => Object.keys(data).includes(fieldConfig.field))
        .map(({ field, fieldId }) => {
          const value = data[field as keyof typeof data];
          return [ fieldId, value ]
        })
    )
  }
}

const defaultConfig = { tableId: '', isEnabled: false, records: [], fieldConfigs: [], table: Table.Accounts };
const liabilityFields = [ 
  Field.InterestRate, Field.LastPaymentAmount, Field.LastPaymentDate, Field.NextPaymentDueDate, Field.LastStatementBalance, 
  Field.MinimumPaymentAmount, Field.NextMonthlyPayment, Field.OriginationDate, Field.OriginationPrincipalAmount
] as Field[];