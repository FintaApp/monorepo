import { Client } from "@notionhq/client";
import { DatabaseObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import * as _ from "lodash";
import { AccountBase, Holding, InvestmentTransaction, Security, Transaction } from "plaid";

import { IntegrationBase } from "./base";
import { NotionCredentials, DestinationErrorCode, TableConfigs, fieldToTypeMapping } from "~/types/shared/models";
import { CheckAuthenticationFuncResponse, CheckTableFuncResponse, GetTablesFuncResponse, SyncDataFuncProps, CheckTableFuncProps, SyncDataFuncResponse, IntegrationConfig } from "~/types/backend/integrations";
import * as formatter from "../formatter";
import { DestinationModel, PlaidItemModel } from "~/types/backend/models"
import { parsePageProperties } from "../formatter/notion/helper";
import { nhost } from "~/utils/nhost";
import { logUnhandledEvent } from "~/utils/backend/logger"

export class Notion extends IntegrationBase {
  client: Client;

  constructor({ destination, credentials }: { destination?: DestinationModel, credentials?: NotionCredentials }) {
    super({ destination, credentials });
    const accessToken = destination?.authentication?.access_token || destination?.notion_connection?.access_token || credentials?.access_token;
    this.client = new Client({ auth: accessToken })
  }

  // External Helper Methods
  async syncData({ item, accounts, transactions, holdings, securities, investmentTransactions, removedTransactions, categories }: SyncDataFuncProps): Promise<SyncDataFuncResponse> {
    const institutionPage = await this.upsertInstitution({ item });
    const [{ accountsPages, results: accountsResult }, securitiesPages, categoriesPages ] = await Promise.all([
      this.upsertAccounts({ accounts, institutionPageId: institutionPage.id }),
      this.upsertSecurities({ securities }),
      this.upsertCategories({ categories })
    ])

    const [ transactionsResult, holdingsResult, investmentTransactionsResult ] = await Promise.all([
      this.upsertTransactions({ transactions, removedTransactions, accountsPages, categoriesPages }),
      this.upsertHoldings({ holdings, securitiesPages, accountsPages }),
      this.upsertInvestmentTransactions({ investmentTransactions, securitiesPages, accountsPages })
    ]);

    // Update Last Update Date and page icon
    const icon = item.institution.logo_file_id 
      ? { external: { url: nhost.storage.getPublicUrl({ fileId: item.institution.logo_file_id })  }}
      : undefined;

    await retryWrapper(() => this.client.pages.update({ 
      page_id: institutionPage.id, 
      properties: formatter.notion.institution.updated({ item, tableConfigFields: this.config.institutions.fields, timezone: this.destination?.user.metadata?.timezone }),
      icon
    }));

    return {
      accounts: accountsResult,
      holdings: holdingsResult,
      transactions: transactionsResult,
      investmentTransactions: investmentTransactionsResult
    }
  }

  async load(): Promise<void> {
    if ( this.destination ) {
      this.config = Object.fromEntries(await Promise.all(Object.entries(this.config).map(async ([ tableType, { isEnabled, tableId, fields }]) => {
        if ( !isEnabled || !tableId ) return [ tableType, { tableId, fields, isEnabled } ]
        const pages = await this.queryDatabase({ databaseId: tableId });
        const records = pages
          .filter(page => !page.archived)
          .map(page => ({ id: page.id, properties: parsePageProperties({ page, tableConfigFields: fields })}));
        return [ tableType, { tableId, fields, records, isEnabled } ]
      }))) as IntegrationConfig;
    }
  }

  async checkAuthentication(): Promise<CheckAuthenticationFuncResponse> {
    return this.client.users.me({})
    .then(() => ({ isValid: true }))
    .catch(({ code }) => {
      if ( code === 'unauthorized' ) { return { isValid: false, errorCode: DestinationErrorCode.NOT_ALLOWED, errorCredential: 'access_token' } }
      console.log(code);
      return { isValid: false }
    })
  }

  async checkTable({ tableId, fields, tableType }: CheckTableFuncProps): Promise<CheckTableFuncResponse> {
    const db = await this.client.databases.retrieve({ database_id: tableId })
    .catch(() => null) as DatabaseObjectResponse | null;

    if ( !db ) { return { isValid: false, error: { errorCode: DestinationErrorCode.MISSING_TABLE, tableType, tableId }}}

    const dbFields = Object.values(db.properties).map(property => property.id);
    const missingField = fields.find(field => !dbFields.includes(field.field_id));
    
    if ( missingField ) {
      return { isValid: false, error: {
        errorCode: DestinationErrorCode.MISSING_FIELD,
        table: db.title[0].plain_text,
        tableType,
        tableId,
        fieldId: missingField.field_id,
        fieldType: missingField.field
      }}
    }

    const fieldWithIncorrectType = fields.find(field => {
      const dbField = Object.values(db.properties).find(prop => prop.id === field.field_id);
      return !fieldToTypeMapping[tableType][field.field].notion.includes(dbField!.type) 
    })

    if ( fieldWithIncorrectType ) {
      return { isValid: false, error: {
        errorCode: DestinationErrorCode.INCORRECT_FIELD_TYPE,
        table: db.title[0].plain_text,
        tableType,
        tableId,
        fieldId: fieldWithIncorrectType.field_id,
        fieldType: fieldWithIncorrectType.field,
        field: Object.values(db.properties).find(prop => prop.id === fieldWithIncorrectType.field_id)?.name
      }}
    }

    return { isValid: true, error: null }
  }

  async getDefaultConfig(): Promise<TableConfigs> {
    const tables = await this.getTables();
    return formatter.notion.defaultConfig({ tables });
  }

  async getTables(): Promise<GetTablesFuncResponse> {
    let databases = [] as DatabaseObjectResponse[];
    let hasMore = true;
    let startCursor = null as string | null;
  
    while ( hasMore ) {
      const { results, next_cursor, has_more } = await this.client.search({
        filter: { property: 'object', value: 'database' },
        start_cursor: startCursor || undefined
      });
  
      databases = databases.concat((results as DatabaseObjectResponse[]).filter(result => !result.archived));
      hasMore = has_more;
      startCursor = next_cursor
    }
  
    return databases
      .filter(database => !database.archived)
      .map(database => {
      const { id, title, properties } = database;
      return {
        tableId: id,
        name: title[0].plain_text,
        fields: Object.entries(properties).map(([ name, data ]) => ({ fieldId: data.id, name, type: data.type }))
      }
    })
  }

  // Internal Helper Methods
  async upsertInstitution({ item }: { item: PlaidItemModel }) {
    const { tableId, fields, records } = this.config.institutions;

    const institutionPage = records?.find(record => record.properties.id === item.id);
    if ( institutionPage ) { return institutionPage };

    
    return retryWrapper(() => this.client.pages.create({ 
      parent: { type: 'database_id', database_id: tableId }, 
      properties: formatter.notion.institution.new({ item, tableConfigFields: fields })
    }))
  }

  async upsertAccounts({ accounts, institutionPageId }: { accounts: AccountBase[], institutionPageId: string }) {
    const { tableId, fields, records } = this.config.accounts;

    const mappedAccounts = accounts.map(account => {
      const page = records?.find(rec => rec.properties.id === account.account_id);
      return { account, page }
    });

    return Promise.all(mappedAccounts.map(async ({ account, page }) => {
      if ( page ) {
        await retryWrapper(() => this.client.pages.update({ page_id: page.id, properties: formatter.notion.account.updated({ account, tableConfigFields: fields })}));
        return { isNew: false, accountPage: { accountId: account.account_id, pageId: page.id }, accountId: account.account_id}
      }
      const newPage = await retryWrapper(() => this.client.pages.create({ parent: { type: 'database_id', database_id: tableId }, properties: formatter.notion.account.new({ account, institutionPageId, tableConfigFields: fields })}));
      return { isNew: true, accountPage: { accountId: account.account_id, pageId: newPage.id }, accountId: account.account_id}
    }))
    .then(responses => ({
      accountsPages: responses.reduce((all, response) => all.concat(response.accountPage), [] as { accountId: string, pageId: string; }[] ),
      results: {
        added: responses.filter(response => response.isNew).reduce((all, response) => all.concat(response.accountId), [] as string[]),
        updated: responses.filter(response => !response.isNew).reduce((all, response) => all.concat(response.accountId), [] as string[])
      }
    }))
  };

  async upsertCategories({ categories }: { categories?: { id: string; name: string; category_group: string }[] }) {
    const { tableId, fields, records, isEnabled } = (this.config.categories || { tableId: undefined, fields: [], records: [] })
    if ( !tableId || !categories || !isEnabled ) { return [] };

    const newCategories = categories.filter(category => !records?.map(record => record.properties.id).includes(category.id)) 
    return Promise.all(newCategories.map(async category => {
      const newPage = await retryWrapper( () => this.client.pages.create({ parent: { type: 'database_id', database_id: tableId }, properties: formatter.notion.category.new({ category, tableConfigFields: fields })}))
      return { categoryId: category.id, pageId: newPage.id }
    }))
  }

  async upsertTransactions({ transactions, removedTransactions = [], accountsPages, categoriesPages }: { transactions?: Transaction[], removedTransactions?: string[], accountsPages: { accountId: string; pageId: string }[], categoriesPages: { categoryId: string; pageId: string }[] }) {
    if ( !transactions ) { return { added: 0, updated: 0, removed: 0 }};
    const { tableId, fields, records } = this.config.transactions;

    const pendingTransactionIds = transactions.filter(transaction => !!transaction.pending_transaction_id).map(transaction => transaction.pending_transaction_id);
    const nonPendingRemovedTransactions = _.difference((removedTransactions || []), pendingTransactionIds)

    const mappedTransactions = transactions.map(transaction => {
      const accountPage = accountsPages.find(accountPage => accountPage.accountId === transaction.account_id);
      const categoryPage = categoriesPages.find(categoryPage => categoryPage.categoryId === transaction.category_id && !!transaction.category_id)
      const pendingPage = records?.find(record => record.properties.id === transaction.pending_transaction_id);
      const postedPage = records?.find(record => record.properties.id === transaction.transaction_id);
      return { transaction, page: pendingPage, isNew: !pendingPage && !postedPage, accountPage, categoryPage }
    });

    const upsertTransactionsPromise = Promise.all(mappedTransactions.map(async ({ transaction, page, isNew, accountPage, categoryPage }) => {
      if ( page ) {
        await retryWrapper(() => this.client.pages.update({ page_id: page.id, properties: formatter.notion.transaction.updated({ transaction, tableConfigFields: fields })}));
        return { isUpdated: true, isNew: false }
      }
      if ( isNew ) {
        await retryWrapper(() => this.client.pages.create({ parent: { type: 'database_id', database_id: tableId }, properties: formatter.notion.transaction.new({ transaction, accountPageId: accountPage!.pageId, categoryPageId: categoryPage?.pageId, tableConfigFields: fields })}));
        return { isNew: true, isUpdated: false }
      } 
      return { isNew: false, isUpdated: false }
    }))
    .then(responses => ({
      added: responses.filter(response => response.isNew).length,
      updated: responses.filter(response => response.isUpdated).length
    }));

    const pagesToRemove = records?.filter(page => nonPendingRemovedTransactions.includes(page.properties.id)) || [];
    const removeTransactionsPromise = Promise.all(pagesToRemove.map(page => {
      return retryWrapper(() => this.client.pages.update({ page_id: page.id, archived: true }).then(() => ({ removed: 1 })))
    }))

    return Promise.all([ upsertTransactionsPromise, removeTransactionsPromise ])
    .then(responses => ({
      ...responses[0],
      removed: pagesToRemove.length
    }))
  }

  async upsertSecurities({ securities }: { securities?: Security[] }) {
    const { tableId, fields, records, isEnabled } = this.config.securities;
    if ( !securities || securities.length === 0 || !isEnabled ) { return [] };

    const mappedSecurities = securities.map(security => {
      const page = records?.find(rec => rec.properties.id === security.security_id);
      return { security, page }
    });

    return Promise.all(mappedSecurities.map(async ({ security, page }) => {
      if ( page ) {
        await retryWrapper(() => this.client.pages.update({ page_id: page.id, properties: formatter.notion.security.updated({ security, tableConfigFields: fields })}));
        return { securityId: security.security_id, pageId: page.id, symbol: security.symbol || security.name || "" }
      }

      const newSecurityPage = await retryWrapper(() => this.client.pages.create({ parent: { type: 'database_id', database_id: tableId }, properties: formatter.notion.security.new({ security, tableConfigFields: fields })}));
      return { securityId: security.security_id, pageId: newSecurityPage.id, symbol: security.symbol || security.name || "" }
    }));
  };

  async upsertHoldings({ holdings, securitiesPages, accountsPages }: { holdings?: Holding[], securitiesPages: { securityId: string; pageId: string, symbol: string }[], accountsPages: { accountId: string; pageId: string }[] }) {
    if ( !holdings || holdings.length === 0 ) { return { added: 0, updated: 0 }}
    const { tableId, fields, records } = this.config.holdings;

    const mappedHoldings = holdings.map(holding => {
      const accountPage = accountsPages.find(accountPage => accountPage.accountId === holding.account_id);
      const securityPage = securitiesPages.find(securityPage => securityPage.securityId === holding.security_id)
      const page = records?.find(rec => rec.properties.account === accountPage!.pageId && rec.properties.security_id === securityPage!.pageId);
      return { holding, page, accountPage, securityPage }
    });

    return Promise.all(mappedHoldings.map(async ({ holding, page, accountPage, securityPage }) => {
      if ( page ) {
        await retryWrapper(() => this.client.pages.update({ page_id: page.id, properties: formatter.notion.holding.updated({ holding, tableConfigFields: fields })}));
        return { isNew: false }
      }

      await retryWrapper(() => this.client.pages.create({ parent: { type: 'database_id', database_id: tableId }, properties: formatter.notion.holding.new({ holding, securityPageId: securityPage!.pageId, symbol: securityPage?.symbol || "", accountPageId: accountPage!.pageId, tableConfigFields: fields })}))
      return { isNew: true }
    }))
    .then(responses => ({
      added: responses.filter(response => response.isNew).length,
      updated: responses.filter(response => !response.isNew).length
    }))
  }
  async upsertInvestmentTransactions({ investmentTransactions, securitiesPages, accountsPages }: { investmentTransactions?: InvestmentTransaction[], securitiesPages: { securityId: string; pageId: string }[], accountsPages: { accountId: string; pageId: string }[] }) {
    if ( !investmentTransactions || investmentTransactions.length === 0 ) { return { added: 0, updated: 0 }}
    const { tableId, fields, records } = this.config.investment_transactions;

    const newInvestmentTransactions = investmentTransactions.filter(investmentTransaction => !records?.map(record => record.properties.id).includes(investmentTransaction.investment_transaction_id)) 
    return Promise.all(newInvestmentTransactions.map(investmentTransaction => {
      const accountPage = accountsPages.find(page => page.accountId === investmentTransaction.account_id);
      const securityPage = securitiesPages.find(page => page.securityId === investmentTransaction.security_id);
      return retryWrapper( () => this.client.pages.create({ parent: { type: 'database_id', database_id: tableId }, properties: formatter.notion.investmentTransaction.new({ investmentTransaction, accountPageId: accountPage!.pageId, securityPageId: securityPage?.pageId, tableConfigFields: fields })}))
    }))
    .then(() => ({
      added: newInvestmentTransactions.length
    }))
  }

  async queryDatabase({ databaseId }: { databaseId: string } ) {
    let hasMore = true;
    let nextCursor = undefined as undefined | string;
    let results = [] as PageObjectResponse[];

    while ( hasMore ) {
      const response = await retryWrapper(() => this.client.databases.query({ database_id: databaseId, start_cursor: nextCursor }));
      hasMore = response.has_more;
      nextCursor = response.next_cursor || undefined;
      results = results.concat(response.results as PageObjectResponse[])
    };

    return results
  }
}

async function retryWrapper<T extends Array<any>, U>(func: () => Promise<U>): Promise<U> {
  let funcTry = 1;
  let didProcess = false;
  let response: any

  while ( !didProcess ) {
    ({ didProcess, response } = await func().then(response => ({ didProcess: true, response })).catch(async err => {
      if ( ['rate_limited', 'conflict_error', 'notionhq_client_response_error' ].includes(err.code)) {
        return { didProcess: false, response: null }
      } else {
        await logUnhandledEvent(`Unhandled Notion API error: ${JSON.stringify(err)}`);
        return { didProcess: true, response: null }
      }
    }));

    if ( !didProcess ) {
      await timeout(funcTry * 500)
      funcTry = funcTry + 1;
    }
  }

  return response
}

async function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
