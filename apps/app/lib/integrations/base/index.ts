import { AirtableCredential, Field, GoogleSheetsCredential, Integration, NotionCredential, SyncError, Table } from "@prisma/client";
import { ALL_DESTINATION_TABLES } from "~/components/Destinations/Destination/TableConfigs/constants";
import { DestinationFieldType, TableConfig } from "~/types/shared/models";

import * as types from "./types";
import { tableConfigsMeta } from "../../tableConfigsMeta";
import { AccountBase, CreditCardLiability, Holding, InvestmentTransaction, LiabilitiesGetResponse, MortgageLiability, Security, StudentLoan, Transaction } from "plaid";

export class IntegrationBase {
  credentials: AirtableCredential | GoogleSheetsCredential | NotionCredential;
  userId: string;
  integration?: Integration
  isLegacy: boolean;
  config?: types.IntegrationConfig;
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
    this.config = await Promise.all(tableConfigs.map(async ({ table, tableId, fieldConfigs, isEnabled }) => {
      if ( !isEnabled || !tableId || !tableTypes.includes(table) ) { return { table, tableId, fieldConfigs, isEnabled, records: [] }}
      const records = await this.queryTable({ tableId, fieldConfigs });
      return { table, tableId, fieldConfigs, isEnabled, records }
    }))
  }

  async upsertItem({ item }: { item: types.PlaidItem }): Promise<types.IntegrationRecord> {
    const { tableId, records, fieldConfigs } = this.config!.find(config => config.table === Table.Institutions)! // This should never be null realistically
    const record = records.find(record => record.properties[Field.Id] === item.id);
    if ( record ) { return record };

    const data = this.formatter.institution.new({ item });
    return this.createRecords({ tableId, data: [ data ], fieldConfigs }).then(response => response[0])
  }

  async updateItemOnFinish({ item, institutionRecord, timezone }: { item: types.PlaidItem; institutionRecord: types.IntegrationRecord; timezone?: string }) {
    const { tableId, fieldConfigs } = this.config!.find(config => config.table === Table.Institutions)! // This should never be null realistically

    return this.updateRecords({
      tableId,
      data: [{
        record: institutionRecord,
        fields: this.formatter.institution.updated({ item, timezone })
      }],
      fieldConfigs,
      iconUrl: item.institution.logoUrl || undefined
    })
  }

  async updateAccounts(
    { accounts, item, institutionRecord, creditLiabilities, mortgageLiabilities, studentLiabilities }: 
    { accounts?: AccountBase[], creditLiabilities?: CreditCardLiability[]; mortgageLiabilities?: MortgageLiability[]; studentLiabilities?: StudentLoan[]; item: types.PlaidItem, institutionRecord: types.IntegrationRecord }): Promise<{ records: types.IntegrationRecord[], results: { added: number; updated: number }}> {
    const { tableId, records, isEnabled, fieldConfigs } = this.config!.find(config => config.table === Table.Accounts) || defaultConfig;
    if ( !accounts || !tableId || !isEnabled ) { return { records: [], results: { added: 0, updated: 0 }}};

    const mappedAccounts = accounts.map(account => {
      const accountRecord = records.find(record => record.properties[Field.Id] === account.account_id);
      const credit = creditLiabilities?.find(cl => cl.account_id === account.account_id);
      const mortage = mortgageLiabilities?.find(ml => ml.account_id === account.account_id);
      const student = studentLiabilities?.find(sl => sl.account_id === account.account_id);
      const accountName = item.accounts.find(acc => acc.id === account.account_id)?.name || account.name;
      const shouldUpdate = accountRecord && (
        (accountRecord?.properties[Field.Available] !== account.balances.available && !!fieldConfigs.find(config => config.field === Field.Available))
        || (accountRecord?.properties[Field.Current] !== account.balances.current && !!fieldConfigs.find(config => config.field === Field.Current))
        || (accountRecord?.properties[Field.Limit] !== account.balances.limit && !!fieldConfigs.find(config => config.field === Field.Limit))
        || !!fieldConfigs.find(config => liabilityFields.includes(config.field)) // Update if user syncs any liability fields. Too many to put here one by one
      )
      return { record: accountRecord, shouldUpdate, account, credit, mortage, student, accountName }
    });

    const accountsToCreate = mappedAccounts
      .filter(ma => !ma.record )
      .map(({ account, credit, mortage, student, accountName }) => {
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
        .map(({ account, record, student, credit, mortage }) => {
          const data = this.formatter.account.updated({ account, student, credit, mortage });
          return ({ record: record!, fields: this.getIntegrationFieldsFromData({ data, fieldConfigs })})
        })

      return Promise.all([
        this.createRecords({ tableId, data: accountsToCreate, fieldConfigs }),
        this.updateRecords({ tableId, data: accountsToUpdate, fieldConfigs })
      ])
      .then(([ newRecords, updatedRecords ]) => ({
        records: newRecords.concat(records),
        results: {
          added: accountsToCreate.length,
          updated: accountsToUpdate.length
        }
      }))
  }

  async upsertCategories({ categories }: { categories?: types.Category[] }): Promise<types.IntegrationRecord[]> {
    const { tableId, records, isEnabled, fieldConfigs } = this.config!.find(config => config.table === Table.Categories) || defaultConfig;
    if ( !categories || !tableId || !isEnabled ) { return [] }

    const recordCategoryIds = records.map(record => record.properties[Field.Id]);
    const categoriesToCreate = categories
      .filter(category => !recordCategoryIds.includes(category.id))
      .map(category => {
        const data = this.formatter.category.new({ category });
        return this.getIntegrationFieldsFromData({ data, fieldConfigs })
      });
    
    return this.createRecords({ tableId, data: categoriesToCreate, fieldConfigs })
      .then(newRecords => newRecords.concat(records))
  }

  async upsertSecurities({ securities }: { securities?: Security[] }): Promise<types.IntegrationRecord[]> {
    const { tableId, records, isEnabled, fieldConfigs } = this.config!.find(config => config.table === Table.Securities) || defaultConfig;
    if ( !securities || !tableId || !isEnabled ) { return [] }

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
      .map(({ security }) => {
        const data = this.formatter.security.new({ security });
        return this.getIntegrationFieldsFromData({ data, fieldConfigs })
      })
    const securitiesToUpdate = mappedSecurities
      .filter(mh => !!mh.record && mh.shouldUpdate)
      .map(({ security, record }) => {
        const data = this.formatter.security.updated({ security });
        return ({ record: record!, fields: this.getIntegrationFieldsFromData({ data, fieldConfigs })})
      })
    
    return Promise.all([
      this.createRecords({ tableId, data: securitiesToCreate, fieldConfigs }),
      this.updateRecords({ tableId, data: securitiesToUpdate, fieldConfigs })
    ])
    .then(([ newRecords, updatedRecords ]) => newRecords.concat(records))
  }

  async upsertTransactions(
    { transactions, categoryRecords, accountRecords }: 
    { transactions?: Transaction[]; categoryRecords: types.IntegrationRecord[]; accountRecords: types.IntegrationRecord[]}
  ): Promise<{ added: number; updated: number; }> {
    const { tableId, records, isEnabled, fieldConfigs } = this.config!.find(config => config.table === Table.Transactions) || defaultConfig;
    if ( !isEnabled || tableId || !transactions || transactions.length === 0 ) { return { added: 0, updated: 0 }};

    const mappedTransactions = transactions.map(transaction => {
      const accountRecord = accountRecords.find(record => record.properties[Field.Id] === transaction.account_id);
      const categoryRecord = categoryRecords.find(record => record.properties[Field.Id] === transaction.category_id);
      const pendingTransactionRecord = records.find(record => record.properties[Field.Id] === transaction.pending_transaction_id);
      const transactionRecord = records.find(record => record.properties[Field.Id] === transaction.transaction_id);
      return {record: transactionRecord, accountRecord, categoryRecord, pendingRecord: pendingTransactionRecord, transaction }
    });

    const transactionsToCreate = mappedTransactions
      .filter(mh => !mh.record && !mh.pendingRecord)
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
      .map(({ transaction, pendingRecord }) => {
        const data = this.formatter.transaction.updated({ transaction });
        return ({ record: pendingRecord!, fields: this.getIntegrationFieldsFromData({ data, fieldConfigs })})
      })

    return Promise.all([
      this.createRecords({ tableId, data: transactionsToCreate, fieldConfigs }),
      this.updateRecords({ tableId, data: transactionsToUpdate, fieldConfigs })
    ])
    .then(() => ({
      added: transactionsToCreate.length,
      updated: transactionsToUpdate.length
    }))
  }

  async removeTransactions({ removedTransactionIds }: { removedTransactionIds?: string[] }): Promise<{ removed: number; }> {
    const { tableId, records, isEnabled } = this.config!.find(config => config.table === Table.Transactions) || defaultConfig;
    if ( !isEnabled || tableId || !removedTransactionIds || removedTransactionIds.length === 0 ) { return { removed: 0 }};

    const recordsToRemove = records.filter(record => removedTransactionIds.includes(record.properties[Field.Id]));
    return this.deleteRecords({ tableId, records: recordsToRemove }).then(() => ({ removed: 0 }))
  }

  async upsertHoldings(
    { holdings, securityRecords, accountRecords }: 
    { holdings?: Holding[]; securityRecords: types.IntegrationRecord[]; accountRecords: types.IntegrationRecord[] }
  ): Promise<{ added: number; updated: number }> {
    const { tableId, fieldConfigs, records, isEnabled } = this.config!.find(config => config.table === Table.Holdings) || defaultConfig;
    if ( !holdings || !isEnabled || !tableId ) { return { added: 0, updated: 0 }};

    const mappedHoldings = holdings.map(holding => {
      const accountRecord = accountRecords.find(record => record.properties[Field.Id] === holding.account_id);
      const securityRecord = securityRecords.find(record => record.properties[Field.Id] === holding.security_id);
      const holdingRecord = records.find(record => record.properties[Field.Account] === holding.account_id && record.properties[Field.Security] === holding.security_id);
      const shouldUpdate = holdingRecord && (
        (holdingRecord?.properties[Field.CostBasis] !== holding.cost_basis && !!fieldConfigs.find(config => config.field === Field.CostBasis))
        || (holdingRecord?.properties[Field.Currency] !== holding.iso_currency_code && !!fieldConfigs.find(config => config.field === Field.Currency))
        || holdingRecord?.properties[Field.Quantity] !== holding.quantity
      )
      return { shouldUpdate, accountRecord, securityRecord, record: holdingRecord, holding }
    });

    const holdingsToCreate = mappedHoldings
      .filter(mh => !mh.record)
      .map(({ holding, accountRecord, securityRecord }) => {
        const data = this.formatter.holding.new({
          holding,
          accountRecordId: this.isGoogle ? holding.account_id : accountRecord?.id as string,
          securityRecordId: this.isGoogle ? holding.security_id : securityRecord?.id as string,
          symbol: securityRecord?.properties[Field.Symbol] || ""
        });
        return this.getIntegrationFieldsFromData({ data, fieldConfigs })
      })
    const holdingsToUpdate = mappedHoldings
      .filter(mh => !!mh.record && mh.shouldUpdate)
      .map(({ holding, record }) => {
        const data = this.formatter.holding.updated({ holding });
        return ({ record: record!, fields: this.getIntegrationFieldsFromData({ data, fieldConfigs })})
      })
    
    return Promise.all([
      this.createRecords({ tableId, data: holdingsToCreate, fieldConfigs }),
      this.updateRecords({ tableId, data: holdingsToUpdate, fieldConfigs })
    ])
    .then(() => ({ 
      added: holdingsToCreate.length,
      updated: holdingsToUpdate.length
    }))
  }

  async upsertInvestmentTransactions(
    { investmentTransactions, securityRecords, accountRecords }: 
    { investmentTransactions?: InvestmentTransaction[]; securityRecords: types.IntegrationRecord[]; accountRecords: types.IntegrationRecord[] }
  ): Promise<{ added: number; }> {
    const { tableId, fieldConfigs, records, isEnabled } = this.config!.find(config => config.table === Table.InvestmentTransactions) || defaultConfig;
    if ( !investmentTransactions || !tableId || !isEnabled ) { return { added: 0 }};

    const recordTransactionIds = records.map(record => record.properties[Field.Id]);
    const transactionsToCreate = investmentTransactions.filter(transaction => !recordTransactionIds.includes(transaction.investment_transaction_id))
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
    
    return this.createRecords({ tableId, data: transactionsToCreate, fieldConfigs }).then(() => ({ added: transactionsToCreate.length }))
  }

  // Externally-used methods handled in sub-classes
  async init(): Promise<void> {}
  async validateCredentials(): Promise<types.ValidateDestinationCredentialsResponse> { return {} as types.ValidateDestinationCredentialsResponse }
  async getTables(): Promise<types.GetDestinationTablesRepsonse> { return {} as types.GetDestinationTablesRepsonse }

  // Internally-used methods handled in sub-classes
  async _validateTableConfig({ tableId, table, fields }: types.ValidateTableConfigProps): Promise<types.AirtableLegacyValidateResponse> { return {} as types.AirtableLegacyValidateResponse};
  async queryTable({ tableId, fieldConfigs }: { tableId: string; fieldConfigs: TableConfig['fieldConfigs'] }): Promise<types.IntegrationRecord[]> { return [] }
  async createRecords({ tableId, data, fieldConfigs }: { tableId: string, data: Record<string, any>[]; fieldConfigs: TableConfig['fieldConfigs']}): Promise<types.IntegrationRecord[]> { return [] }
  async updateRecords({ tableId, data, fieldConfigs, iconUrl }: { iconUrl?: string; tableId: string, data: { fields: Record<string, any>, record: types.IntegrationRecord }[]; fieldConfigs: TableConfig['fieldConfigs']}): Promise<types.IntegrationRecord[]> { return [] }
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