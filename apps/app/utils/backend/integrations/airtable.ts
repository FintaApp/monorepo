import airtable from "airtable";
import { AirtableBase } from "airtable/lib/airtable_base";
import AirtableError from "airtable/lib/airtable_error";
import { AccountBase, Holding, InvestmentTransaction, Security, Transaction } from "plaid";
import _ from "lodash";
import { AccountsTableFields, InstitutionsTableFields, TableConfigs, TransactionsTableFields, HoldingsTableFields, InvestmentTransactionsTableFields, DestinationErrorCode, SecurityTableFields, CategoryTableFields } from "~/types/shared/models"

import { IntegrationBase } from "./base";
import { parseAirtableError } from "./parseAirtableError";
import { DestinationModel, PlaidItemModel } from "~/types/backend/models"
import { CheckAuthenticationFuncResponse, CheckTableFuncResponse, GetTablesFuncResponse, SyncDataFuncProps, CheckTableFuncProps } from "~/types/backend/integrations";
import * as formatter from "../formatter";

export class Airtable extends IntegrationBase {
  base: AirtableBase;

  constructor({ destination, credentials }: { destination?: DestinationModel; credentials?: { api_key: string; base_id: string } }) {
    super({ destination, credentials });

    const { api_key, base_id } = destination?.authentication as { api_key: string; base_id: string; } || credentials;

    this.base = new airtable({ apiKey: api_key }).base(base_id);
  }

  // External Helper Methods
  async syncData({ item, accounts, transactions, holdings, securities, investmentTransactions, removedTransactions, categories }: SyncDataFuncProps) {
    const institutionRecord = await this.upsertInstitution({ item });
    const [ { records: accountsRecords, results: accountsResult }, securitiesRecords, categoriesRecords ] = await Promise.all([
      this.upsertAccounts({ accounts, institutionRecordId: institutionRecord.id }),
      this.upsertSecurities({ securities }),
      this.upsertCategories({ categories })
    ])

    const [ transactionsResult, holdingsResult, investmentTransactionsResult ] = await Promise.all([
      this.upsertTransactions({ transactions, removedTransactions, accountsRecords, categoriesRecords }),
      this.upsertHoldings({ holdings, securitiesRecords, accountsRecords }),
      this.insertInvestmentTransactions({ investmentTransactions, securitiesRecords, accountsRecords })
    ])

    // Update Last Update Date
    await this.updateRecords({ table: this.config.institutions.tableId, records: [{
      id: institutionRecord.id,
      fields: formatter.airtable.institution.updated({ lastUpdate: new Date(), tableConfigFields: this.config.institutions.fields })
    }]})

    return {
      accounts: accountsResult,
      holdings: holdingsResult,
      transactions: transactionsResult,
      investmentTransactions: investmentTransactionsResult
    }
  }

  async checkAuthentication(): Promise<CheckAuthenticationFuncResponse> {
    return this.base('Institutions').select({ maxRecords: 1}).all()
    .then(() => ({ isValid: true }))
    .catch((err: AirtableError) => {
      const { error, message } = err;
      if ( error === 'AUTHENTICATION_REQUIRED' ) {
        return { isValid: false, errorCredential: 'api_key', errorCode: DestinationErrorCode.INVALID_CREDENTIALS }
      } else if ( error === 'NOT_AUTHORIZED' || message === 'Could not find what you are looking for' ) {
        return { isValid: false, errorCredential: 'base_id', errorCode: DestinationErrorCode.INVALID_CREDENTIALS }
      }
      return { isValid: true }
    })
  }

  async checkTable({ tableId, fields, tableType }: CheckTableFuncProps): Promise<CheckTableFuncResponse> {
    return this.base(tableId).select({ fields: fields.map(field => field.field_id), maxRecords: 1}).all()
    .then(() => ({ isValid: true, error: null }))
    .catch(async (err: AirtableError) => {
      const error = await parseAirtableError(err, tableId, tableType);
      return { isValid: false, error }
    })
  }

  async getDefaultConfig(): Promise<TableConfigs> { return formatter.airtable.defaultConfig()}

  async getTables(): Promise<GetTablesFuncResponse> { return [] }

  // Internal Helper Methods
  async upsertInstitution({ item }: { item: PlaidItemModel }) {
    const { tableId, fields } = this.config.institutions;
    const institutionIdHeader = fields[InstitutionsTableFields.ID as keyof typeof fields];

    const institutionRecord = await this.getRecords({ table: tableId, filterByFormula: `{${institutionIdHeader}} = '${item.id}'`})
    .then(response => response[0]);
    if ( institutionRecord ) { return institutionRecord }
    return this.createRecords({ table: tableId, records: [{
      fields: formatter.airtable.institution.new({ item, tableConfigFields: fields })
    }]}).then(response => response[0])
  }

  async upsertAccounts({ accounts, institutionRecordId }: { accounts: AccountBase[]; institutionRecordId: string; }) {
    const { tableId, fields } = this.config.accounts;
    const accountIdHeader = fields[AccountsTableFields.ID as keyof typeof fields];

    return Promise.all(_.chunk(accounts, 10).map(async accountsChunk => {
      const accountsRecords = await this.getRecords({ table: tableId, filterByFormula: `OR(${accountsChunk.map(account => `{${accountIdHeader}} = '${account.account_id}'`).join(', ')})`});
      const accountsRecordsPlaidIds = accountsRecords.map(record => record.fields[accountIdHeader]);
      const accountsToCreate = accountsChunk.filter(account => !accountsRecordsPlaidIds.includes(account.account_id));
      const accountsToUpdate = accountsChunk.filter(account => accountsRecordsPlaidIds.includes(account.account_id));

      return Promise.all([
        this.createRecords({ table: tableId, records: accountsToCreate.map(account => ({
          fields: formatter.airtable.account.new({ account, institutionRecordId, tableConfigFields: fields })
        }))}),
        
        this.updateRecords({ table: tableId, records: accountsToUpdate.map(account => ({
          id: accountsRecords.find(record => record.fields[accountIdHeader] === account.account_id)!.id,
          fields: formatter.airtable.account.updated({ account, tableConfigFields: fields })
        }))})
      ]).then(responses => {
        return {
          added: accountsToCreate.map(account => account.account_id),
          updated: accountsToUpdate.map(account => account.account_id),
          records: responses[0].concat(responses[1])
        }
      })
    }))
    .then(responses => ({
      records: responses.reduce((all, response) => all.concat(response.records), [] as any[]).map(record => ({ recordId: record.id as string, accountId: record.fields[accountIdHeader] as string })),
      results: {
        added: responses.reduce((all, response) => all.concat(response.added), [] as string[]),
        updated: responses.reduce((all, response) => all.concat(response.updated), [] as string[])
      }
    }))
  }

  async upsertCategories({ categories }: { categories?: { id: string, name: string, category_group: string }[] }) {
    if ( !categories ) { return [] };

    const { tableId, fields, isEnabled } = this.config.categories || { tableId: null, fields: [], isEnabled: false };
    if ( !tableId || !isEnabled ) { return [] }
    const categoryIdHeader = fields[CategoryTableFields.ID as keyof typeof fields];

    return Promise.all(_.chunk(categories, 10).map(async categoriesChunk => {
      const allCategoryIds = categoriesChunk.map(category => category.id);

      const categoryRecords = await this.getRecords({ 
        table: tableId, 
        filterByFormula: `OR(${allCategoryIds.map(categoryId => `{${categoryIdHeader}} = '${categoryId}'`).join(', ')})`
      });
      
      const categoryRecordsPlaidIds = categoryRecords.map(record => record.fields[categoryIdHeader]);
      const categoriesToCreate = categoriesChunk.filter(category => !categoryRecordsPlaidIds.includes(category.id));

      return this.createRecords({ table: tableId, records: categoriesToCreate.map(category => ({
        fields: formatter.airtable.category.new({ 
          category, 
          tableConfigFields: fields
        })
      }))})
      .then(records => records.map(record => ({ recordId: record.id, categoryId: record.fields[categoryIdHeader]})) as { recordId: string, categoryId: string }[])
    }))
    .then(responses => responses.reduce((total, response) => total.concat(response), [] as { recordId: string, categoryId: string }[]))
  }

  async upsertTransactions({ transactions, removedTransactions = [], accountsRecords, categoriesRecords }: {
    transactions?: Transaction[];
    accountsRecords: { accountId: string; recordId: string }[];
    removedTransactions?: string[];
    categoriesRecords: { recordId: string, categoryId: string }[]
  }) {
    const { tableId, fields, isEnabled } = this.config.transactions;
    if ( !transactions || !isEnabled ) { return { added: 0, updated: 0, removed: 0 }};
    const transactionIdHeader = fields[TransactionsTableFields.ID as keyof typeof fields];

    const pendingTransactionIds = transactions.filter(transaction => !!transaction.pending_transaction_id).map(transaction => transaction.pending_transaction_id);
    const nonPendingRemovedTransactions = _.difference((removedTransactions || []), pendingTransactionIds)

    const upsertTransactionsPromise = Promise.all(_.chunk(transactions, 10).map(async transactionsChunk => {
      const pendingTransactionIds = transactionsChunk.filter(transaction => !!transaction.pending_transaction_id).map(transaction => transaction.pending_transaction_id!);
      const allTransactionIds = transactionsChunk.map(transaction => transaction.transaction_id).concat(pendingTransactionIds);

      const transactionRecords = await this.getRecords({ 
        table: tableId, 
        filterByFormula: `OR(${allTransactionIds.map(transactionId => `{${transactionIdHeader}} = '${transactionId}'`).join(', ')})`
      });
      const transactionRecordsPlaidIds = transactionRecords.map(record => record.fields[transactionIdHeader] as string | null);
      const transactionsToCreate = transactionsChunk.filter(transaction => !transactionRecordsPlaidIds.includes(transaction.transaction_id) && !transactionRecordsPlaidIds.includes(transaction.pending_transaction_id));
      const transactionsToUpdate = transactionsChunk.filter(transaction => transactionRecordsPlaidIds.includes(transaction.pending_transaction_id));

      return Promise.all([
        this.createRecords({ table: tableId, records: transactionsToCreate.map(transaction => ({
          fields: formatter.airtable.transaction.new({ 
            transaction, 
            accountRecordId: accountsRecords.find(record => record.accountId === transaction.account_id)!.recordId,
            categoryRecordId: categoriesRecords.find(record => record.categoryId === transaction.category_id)?.recordId,
            tableConfigFields: fields
          })
        }))}),

        this.updateRecords({ table: tableId, records: transactionsToUpdate.map(transaction => {
          const oldTransactionRecord = transactionRecords.find(record => record.fields[transactionIdHeader] === transaction.pending_transaction_id)!;
          return {
            id: oldTransactionRecord.id,
            fields: formatter.airtable.transaction.updated({ transaction, shouldOverrideTransactionName: this.destination!.should_override_transaction_name, oldTransactionRecord, tableConfigFields: fields })
          }
        })})
      ])
      .then(() => {
        return {
          added: transactionsToCreate.length,
          updated: transactionsToUpdate.length
        }
      })
    }))

    const removeTransactionsPromise = Promise.all(_.chunk(nonPendingRemovedTransactions, 10).map(async transactionIdsChunk => {
      const transactionRecords = await this.getRecords({
        table: tableId,
        filterByFormula: `OR(${transactionIdsChunk.map(transactionId => `{${transactionIdHeader}} = '${transactionId}'`).join(', ')})`
      });

      return this.deleteRecords({ table: tableId, recordIds: transactionRecords.map(record => record.id )})
      .then(() => transactionRecords.length as number)
    }));

    return Promise.all([ upsertTransactionsPromise, removeTransactionsPromise ])
    .then(([ upsertResponses, removeResponses ]) => ({
      added: upsertResponses.reduce((total, response) => total + response.added, 0),
      updated: upsertResponses.reduce((total, response) => total + response.updated, 0),
      removed: removeResponses.reduce((total, response) => total + response, 0)
    }))
  }

  async upsertHoldings({ holdings, securitiesRecords, accountsRecords }: {
    holdings?: Holding[];
    securitiesRecords: { securityId: string; recordId: string; symbol?: string; name?: string }[];
    accountsRecords: { accountId: string; recordId: string }[];
  }) {
    const { tableId, fields, isEnabled } = this.config.holdings;
    if ( !holdings || holdings.length === 0 || !isEnabled ) { return { added: 0, updated: 0 }};

    const accountHeader = fields[HoldingsTableFields.ACCOUNT as keyof typeof fields];
    const securityHeader = fields[HoldingsTableFields.SECURITY_ID as keyof typeof fields];

    const holdingsRecords = await this.getRecords({ table: tableId });
    const mappedHoldings = holdings.map(holding => {
      const accountRecord = accountsRecords.find(record => record.accountId === holding.account_id);
      const securityRecord = securitiesRecords.find(record => record.securityId === holding.security_id);
      if ( !accountRecord ) {
        console.log(accountsRecords[0])
      }
      if ( !securityRecord ) {
        console.log(securitiesRecords[0])
      }
      const record = holdingsRecords.find(holdingRecord => 
        holdingRecord.fields[accountHeader] === accountRecord!.recordId &&
        holdingRecord.fields[securityHeader] === securityRecord!.recordId
      );
      return { holding, accountRecord, holdingRecord: record, securityRecord }
    })

    const newHoldings = mappedHoldings.filter(holding => !holding.holdingRecord);
    const updatedHoldings = mappedHoldings.filter(holding => holding.holdingRecord);

    await Promise.all([
      Promise.all(_.chunk(newHoldings, 10).map(async holdingsChunk => {
        return this.createRecords({ table: tableId, records: holdingsChunk.map(mappedHolding => ({
          fields: formatter.airtable.holding.new({ 
            symbol: mappedHolding.securityRecord?.symbol || mappedHolding.securityRecord?.name || "",
            holding: mappedHolding.holding, 
            accountRecordId: mappedHolding.accountRecord!.recordId, 
            securityRecordId: mappedHolding.securityRecord?.recordId || undefined, 
            tableConfigFields: fields 
          })
        }))})
      })),
      Promise.all(_.chunk(updatedHoldings, 10).map(async holdingsChunk => {
        return this.updateRecords({ table: tableId, records: holdingsChunk.map(mappedHolding => ({
          id: mappedHolding.holdingRecord!.id,
          fields: formatter.airtable.holding.updated({ holding: mappedHolding.holding, tableConfigFields: fields })
        }))})
      }))
    ])

    return {
      added: newHoldings.length,
      updated: updatedHoldings.length
    }
  }

  async insertInvestmentTransactions({ investmentTransactions, securitiesRecords, accountsRecords }: {
    investmentTransactions?: InvestmentTransaction[];
    securitiesRecords: { securityId: string; recordId: string; symbol?: string; name?: string }[];
    accountsRecords: { accountId: string; recordId: string }[];
  }) {
    const { tableId, fields, isEnabled } = this.config.investment_transactions;

    if ( !investmentTransactions || investmentTransactions.length === 0 || !isEnabled ) { return { added: 0 }};
    const transactionIdHeader = fields[InvestmentTransactionsTableFields.ID as keyof typeof fields];

    return Promise.all(_.chunk(investmentTransactions, 10).map(async transactionsChunk => {
      const allTransactionIds = transactionsChunk.map(transaction => transaction.investment_transaction_id);

      const transactionRecords = await this.getRecords({ 
        table: tableId, 
        filterByFormula: `OR(${allTransactionIds.map(transactionId => `{${transactionIdHeader}} = '${transactionId}'`).join(', ')})`
      });
      
      const transactionRecordsPlaidIds = transactionRecords.map(record => record.fields[transactionIdHeader]);
      const transactionsToCreate = transactionsChunk.filter(transaction => !transactionRecordsPlaidIds.includes(transaction.investment_transaction_id));

      return Promise.all([
        this.createRecords({ table: tableId, records: transactionsToCreate.map(investmentTransaction => ({
          fields: formatter.airtable.investmentTransaction.new({ 
            investmentTransaction, 
            securityRecordId: securitiesRecords.find(record => record.securityId === investmentTransaction.security_id)!.recordId,
            accountRecordId: accountsRecords.find(record => record.accountId === investmentTransaction.account_id)!.recordId,
            tableConfigFields: fields
          })
        }))}),
      ])
      .then(() => {
        return {
          added: transactionsToCreate.length
        }
      })
    }))
    .then(responses => ({
      added: responses.reduce((total, response) => total + response.added, 0),
    }))
  }

  async upsertSecurities({ securities }: { securities?: Security[] }) {
    const { tableId, fields, isEnabled } = this.config.securities;
    if ( !securities || securities.length === 0 || !isEnabled) { return [] };

    const securityIdHeader = fields[SecurityTableFields.ID as keyof typeof fields];
    const symbolHeader = fields[SecurityTableFields.SYMBOL as keyof typeof fields];
    const nameHeader = fields[SecurityTableFields.NAME as keyof typeof fields]

    return Promise.all(_.chunk(securities, 10).map(async securitiesChunk => {
      const securityRecords = await this.getRecords({ table: tableId, filterByFormula: `OR(${securitiesChunk.map(security => `{${securityIdHeader}} = '${security.security_id}'`).join(', ')})`});
      const securityRecordsPlaidIds = securityRecords.map(record => record.fields[securityIdHeader]);
      const securitiesToCreate = securitiesChunk.filter(security => !securityRecordsPlaidIds.includes(security.security_id));
      const securitiesToUpdate = securitiesChunk.filter(security => securityRecordsPlaidIds.includes(security.security_id));

      return Promise.all([
        this.createRecords({ table: tableId, records: securitiesToCreate.map(security => ({
          fields: formatter.airtable.security.new({ security, tableConfigFields: fields })
        }))}),
        
        this.updateRecords({ table: tableId, records: securitiesToUpdate.map(security => ({
          id: securityRecords.find(record => record.fields[securityIdHeader] === security.security_id)!.id,
          fields: formatter.airtable.security.updated({ security, tableConfigFields: fields })
        }))})
      ]).then(responses => responses[0].concat(responses[1]) as any[])
    }))
    .then(responses => responses.reduce((all, response) => all.concat(response), [] as any[])
    .map(record => ({ 
      recordId: record.id as string, 
      securityId: record.fields[securityIdHeader] as string,
      symbol:  record.fields[symbolHeader] as string,
      name: record.fields[nameHeader] as string
    })))
  }

  // Base Methods

  async getRecords({ table, filterByFormula = ""}: { table: string; filterByFormula?: string }) {
    return this.base(table).select({ filterByFormula }).all();
  }

  async createRecords({ table, records = [] }: 
    { 
      table: string; 
      records: { fields: { [field: string]: any;}}[]
    }) {
      if ( records.length > 0 ) { return this.base(table).create(records, { typecast: true })}
      return []
  }

  async updateRecords({ table, records = []}: {
    table: string;
    records: { id: string; fields: { [field: string]: any;}}[]
  }) {
    if ( records.length > 0 ) { return this.base(table).update(records) }
    return []
  }

  async deleteRecords({ table, recordIds = []}: { table: string; recordIds: string[]}) {
    if ( recordIds.length > 0 ) { return this.base(table).destroy(recordIds) }
    return []
  }
}