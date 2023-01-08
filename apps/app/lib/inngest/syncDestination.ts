import { Field, SyncError, SyncTrigger, Table } from "@prisma/client";
import { createStepFunction } from "inngest";
import _ from "lodash";
import { log } from "next-axiom";

import { db } from "../db";
import * as plaid from "../plaid";
import { getDestinationObject } from "../integrations/getDestinationObject";
import moment from "moment-timezone";
import { logDestinationErrorTriggered, logSyncCompleted } from "../logsnag";
import { trackDestinationErrorTriggered, trackSyncCompleted } from "../analytics";
import { AccountBase, AccountsGetRequestOptions, CreditCardLiability, Holding, InvestmentHoldingsGetRequestOptions, InvestmentsTransactionsGetRequestOptions, InvestmentTransaction, LiabilitiesGetResponse, MortgageLiability, Security, StudentLoan, Transaction, TransactionsGetRequestOptions } from "plaid";
import { getItemActiveAccounts } from "../getItemActiveAccounts";
import { IntegrationRecord } from "../integrations/base/types";

export const syncDestination = createStepFunction("Sync Destination", "destination/sync", async ({ event, tools }) => {
  const { destinationId, startDate: startDateProp, syncId, trigger: triggerProp } = event.data;
  const logger = log.with({ syncId, destinationId })
  logger.info("destination/sync started", { data: event.data })
  const endDate = moment().format("YYYY-MM-DD");

  const tablesToSync = [
    Table.Institutions, Table.Accounts, 
    Table.Transactions, Table.Categories, 
    Table.Holdings, Table.InvestmentTransactions, Table.Securities
  ]

  const trigger = triggerProp || SyncTrigger.Destination

  const { destination, plaidItems, error, startDate } = await tools.run("Initialization", async () => {
    let canSync = true;
    let error: { code: SyncError, table?: Table, tableId?: string; tableName?: string; field?: Field; fieldId?: string; fieldName?: string; } | undefined = undefined;

    const destination = await db.destination.findFirstOrThrow({
      where: { id: destinationId },
      include: { 
        user: true,
        accounts: {
          where: {
            item: { disabledAt: null }
          }
        }, 
        tableConfigs: { 
          include: { fieldConfigs: true }
        },
        airtableCredential: true,
        notionCredential: true,
        googleSheetsCredential: true
      }
    });
    logger.info("Fetched destination", { destination });
    const startDate = startDateProp as string || destination.syncStartDate;

    const itemIds = _.uniq(destination.accounts.map(account => account.plaidItemId));
    const plaidItems = await db.plaidItem.findMany({ 
      where: { id: { in: itemIds }},
      include: { accounts: true, institution: true, user: true }
    })

    const Destination = getDestinationObject({ 
      integration: destination.integration, 
      credentials: (destination.airtableCredential || destination.googleSheetsCredential || destination.notionCredential)!,
      userId: destination.userId
    })!;

    await Destination.init();

    // Validate Credentials
    const validateCredentialsResponse = await Destination.validateCredentials();
    logger.info("Validated credentials", { response: validateCredentialsResponse });

    if ( !validateCredentialsResponse.isValid ) {
      return { destination, plaidItems, error: { code: validateCredentialsResponse.error!.code }, startDate }
    }

    const validateTableConfigsResponse = await Destination.validateTableConfigs({ tableTypes: tablesToSync, tableConfigs: destination.tableConfigs});
    logger.info("Validated table configs", { response: validateTableConfigsResponse });

    if ( !validateTableConfigsResponse.isValid ) {
      return { destination, plaidItems, error: validateTableConfigsResponse.errors[0], startDate}
    }

    return { destination, plaidItems, canSync, error, startDate }
  });

  if ( error ) {
    syncId && await Promise.all([
      logDestinationErrorTriggered({
        userId: destination.userId,
        destinationId: destination.id,
        error: error!,
        syncId
      }),

      trackDestinationErrorTriggered({
        userId: destination.userId,
        destinationId: destination.id,
        destinationName: destination.name,
        error: error!,
        trigger,
        integration: destination.integration
      }),

      db.sync.update({
        where: { id: syncId },
        data: {
          isSuccess: false,
          error: error.code,
          endedAt: new Date()
        }
      })
    ])
    return;
  }

  await tools.run("Initialize Sync Results", async () => {
    return syncId && db.syncResult.createMany({
      data: plaidItems.map(item => ({
        plaidItemId: item.id,
        destinationId: destination.id,
        syncId
      })),
      skipDuplicates: true
    })
  })

  const itemsData: { itemId: string; record: IntegrationRecord, accountIds: string[], hasAuthError: boolean, canSync: Record<Table | 'Liabilities', boolean> }[] = await tools.run("Sync Institutions", async () => {
    logger.info("Sync Institutions started")
    const Destination = getDestinationObject({ 
      integration: destination.integration, 
      credentials: (destination.airtableCredential || destination.googleSheetsCredential || destination.notionCredential)!,
      userId: destination.userId
    })!;
    await Destination.init();
    const currentInstitutionRecords = await Destination.loadRecords({ table: Table.Institutions, tableConfigs: destination.tableConfigs });
    logger.info("Loaded institution records", { count: currentInstitutionRecords.length })

    const itemsData = await Promise.all(plaidItems.map(async item => {
      const products = ((item.availableProducts || []) as string[]).concat(((item.billedProducts || []) as string[]));
      const shouldSyncTransactions = tablesToSync.includes(Table.Transactions) 
        && !!destination.tableConfigs.find(config => config.table === Table.Transactions)?.isEnabled
        && products.includes('transactions');
      const shouldSyncCategories = tablesToSync.includes(Table.Categories) 
        && !!destination.tableConfigs.find(config => config.table === Table.Categories)?.isEnabled
        && products.includes('transactions');
      const shouldSyncHoldings = tablesToSync.includes(Table.Holdings) 
        && !!destination.tableConfigs.find(config => config.table === Table.Holdings)?.isEnabled
        && products.includes('investments');
      const shouldSyncInvestmentTransactions = tablesToSync.includes(Table.InvestmentTransactions) 
        && !!destination.tableConfigs.find(config => config.table === Table.InvestmentTransactions)?.isEnabled
        && products.includes('investments');
      const shouldSyncSecurities = tablesToSync.includes(Table.Securities) 
        && !!destination.tableConfigs.find(config => config.table === Table.Securities)?.isEnabled
        && products.includes('investments');
      const shouldSyncLiabilities = products.includes('liabilities');

      const itemLogger = logger.with({ itemId: item.id });
      const getItemActiveAccountsResponse = await getItemActiveAccounts({ item, logger: itemLogger});
      itemLogger.info("Fetched item's active accounts", { response: getItemActiveAccountsResponse })
      const accountIds = _.intersection(
        getItemActiveAccountsResponse.accountIds || [],
        destination.accounts
          .filter(account => account.plaidItemId === item.id)
          .map(account => account.id)
      );

      return { itemId: item.id, accountIds, hasAuthError: getItemActiveAccountsResponse.hasAuthError, canSync: { 
        [Table.Institutions]: true, [Table.Accounts]: true, Liabilities: shouldSyncLiabilities,
        [Table.Transactions]: shouldSyncTransactions, [Table.Categories]: shouldSyncCategories, 
        [Table.Holdings]: shouldSyncHoldings, [Table.InvestmentTransactions]: shouldSyncInvestmentTransactions, [Table.Securities]: shouldSyncSecurities
      }}
    }))

    const institutionRecords = await Destination.upsertItems({ items: plaidItems, records: currentInstitutionRecords })
      .then(async ({ records, results }) => {
        logger.info("Upsert items", { results: { added: results.added.length, updated: results.updated.length }})
        syncId && await Promise.all(plaidItems.map(item => db.syncResult.update({ 
          where: { syncId_plaidItemId_destinationId: { syncId, destinationId: destination.id, plaidItemId: item.id }},
          data: { 
            shouldSyncInstitution: true, 
            institutionsAdded: results.added.filter(id => id === item.id).length, 
            institutionsUpdated: results.updated.filter(id => id === item.id).length,
            error: itemsData.find(data => data.itemId === item.id)?.hasAuthError ? SyncError.ItemError : undefined
          }
        })))
        return records.map(record => ({ ...record, object: {}}));
      })

    logger.info("Sync Institutions finished")
    return itemsData.map(data => ({ ...data, record: institutionRecords.find(record => record.properties[Field.Id] === data.itemId )! })) 
  })

  const accountRecords = await tools.run("Sync Accounts", async () => {
    logger.info("Sync Accounts started");
    const Destination = getDestinationObject({ 
      integration: destination.integration, 
      credentials: (destination.airtableCredential || destination.googleSheetsCredential || destination.notionCredential)!,
      userId: destination.userId
    })!;
    await Destination.init();
    const currentAccountRecords = await Destination.loadRecords({ table: Table.Accounts, tableConfigs: destination.tableConfigs });
    logger.info("Loaded account records", { count: currentAccountRecords.length })

    const { accounts, student, credit, mortgage } = await Promise.all(plaidItems.map(async item => {
      const itemData = itemsData.find(data => data.itemId === item.id)!;
      if ( itemData.hasAuthError ) { return { accounts: [], student: [], credit: [], mortgage: [] }};
      const itemLogger = logger.with({ itemId: item.id });
      const options = { account_ids: itemData.accountIds } as AccountsGetRequestOptions
      
      const accounts = await plaid.getAccounts({ accessToken: item.accessToken, options})
        .then(response => {
          const accounts = response.data.accounts;
          itemLogger.info("Accounts fetched", { count: accounts.length });
          return accounts
        })

      const { student, credit, mortgage } = itemData.canSync.Liabilities
        ? await plaid.getLiabilities({ accessToken: item.accessToken, options})
            .then(response => {
              const liabilities = response.data.liabilities;
              const student = liabilities.student || [];
              const credit = liabilities.credit || [];
              const mortgage = liabilities.mortgage || [];
              itemLogger.info("Liabilities fetched", { student: student.length, credit: credit.length, mortgage: mortgage.length });
              return { student, credit, mortgage }
            })
        : { student: [] as StudentLoan[], credit: [] as CreditCardLiability[], mortgage: [] as MortgageLiability[]};

      return { accounts, student, credit, mortgage }
    }))
    .then(responses => ({
      accounts: responses.reduce((prev, response) => prev.concat(response.accounts), [] as AccountBase[]),
      student: responses.reduce((prev, response) => prev.concat(response.student), [] as StudentLoan[]),
      credit: responses.reduce((prev, response) => prev.concat(response.credit), [] as CreditCardLiability[]),
      mortgage: responses.reduce((prev, response) => prev.concat(response.mortgage), [] as MortgageLiability[])
    }))

    const accountRecords = await Destination.upsertAccounts({ accounts, items: plaidItems, creditLiabilities: credit, mortgageLiabilities: mortgage, studentLiabilities: student, records: currentAccountRecords, institutionRecords: itemsData.map(data => data.record) })
    .then(async ({ records, results }) => {
      logger.info("Upsert accounts", { results: { added: results.added.length, updated: results.updated.length }});
      syncId && await Promise.all(plaidItems.map(item => db.syncResult.update({ 
        where: { syncId_plaidItemId_destinationId: { syncId, destinationId: destination.id, plaidItemId: item.id }},
        data: { 
          shouldSyncAccounts: true, 
          accountsAdded: results.added.filter(id => item.accounts.map(account => account.id).includes(id)).length, 
          accountsUpdated: results.updated.filter(id => item.accounts.map(account => account.id).includes(id)).length
        }
      })))
      return records;
    })

    logger.info("Sync Accounts finished");
    return accountRecords.map(record => ({ ...record, object: {}}));
  })

  tools.run("Sync Transactions", async () => {
    logger.info("Sync Transactions started");
    const Destination = getDestinationObject({ 
      integration: destination.integration, 
      credentials: (destination.airtableCredential || destination.googleSheetsCredential || destination.notionCredential)!,
      userId: destination.userId
    })!;
    await Destination.init();
    const [ currentCategoryRecords, currentTransactionRecords ] = await Promise.all([
      destination.tableConfigs.find(config => config.table === Table.Categories)?.isEnabled
        ? Destination.loadRecords({ table: Table.Categories, tableConfigs: destination.tableConfigs })
          .then(records => {
            logger.info("Loaded category records", { count: records.length });
            return records;
          })
        : Promise.resolve([]),
      destination.tableConfigs.find(config => config.table === Table.Transactions)?.isEnabled
        ? Destination.loadRecords({ table: Table.Transactions, tableConfigs: destination.tableConfigs })
          .then(records => {
            logger.info("Loaded transaction records", { count: records.length });
            return records;
          })
        : Promise.resolve([])
    ])

    const transactions = await Promise.all(plaidItems.map(async item => {
      const itemLogger = logger.with({ itemId: item.id });
      const itemData = itemsData.find(data => data.itemId === item.id)!;
      if ( itemData.hasAuthError || !itemData.canSync.Transactions ) { return [] as Transaction[] };
      const options = { account_ids: itemData.accountIds } as TransactionsGetRequestOptions;
      return plaid.getAllTransactions({ accessToken: item.accessToken, startDate, endDate, options })
      .then(({ transactions }) => {
        itemLogger.info("Transactions fetched", { count: transactions.length });
        return transactions
      })
    })).then(responses => responses.reduce((prev, all) => prev.concat(all), []));

    const categories = _.uniqBy(transactions?.filter(transaction => !!transaction.category_id && !!transaction.category)
      .filter(transaction => !!transaction.category_id && !!transaction.category)
      .map(transaction => ({ id: transaction.category_id!, name: transaction.category![transaction.category!.length - 1]!, category_group: transaction.category![0] || "" })) || [], 'id')

    const { records: categoryRecords, results: categoryResults } = await Destination.upsertCategories({ categories, records: currentCategoryRecords })
      .then(({ records, results }) => {
        logger.info("Categories upserted", { results: { added: results.added.length }});
        return { records, results }
      })
    const transactionResults = await Destination.upsertTransactions({ transactions, categoryRecords, accountRecords, records: currentTransactionRecords })
      .then(results => {
        logger.info("Transactions upserted", { results: { added: results.added.length, updated: results.updated.length }});
        return results;
      })

    await Promise.all(plaidItems.map(async item => {
      const itemData = itemsData.find(data => data.itemId === item.id )!
      const itemTransactions = transactions.filter(transaction => itemData.accountIds.includes(transaction.account_id));
      const itemTransactionIds = itemTransactions.map(it => it.transaction_id);
      const itemCategoryIds = itemTransactions.map(it => it.category_id);

      return syncId && db.syncResult.update({
        where: { syncId_plaidItemId_destinationId: { syncId, plaidItemId: item.id, destinationId: destination.id }},
        data: {
          shouldSyncTransactions: itemData.canSync.Transactions,
          shouldSyncCategories: itemData.canSync.Categories,
          transactionsAdded: transactionResults.added.filter(id => itemTransactionIds.includes(id)).length,
          transactionsUpdated: transactionResults.updated.filter(id => itemTransactionIds.includes(id)).length,
          categoriesAdded: categoryResults.added.filter(id => itemCategoryIds.includes(id)).length
        }
      })
    }))
    logger.info("Sync Transactions finished");
  })

  await tools.run("Sync Holdings", async () => {
    logger.info("Sync Holdings started");
    const Destination = getDestinationObject({ 
      integration: destination.integration, 
      credentials: (destination.airtableCredential || destination.googleSheetsCredential || destination.notionCredential)!,
      userId: destination.userId
    })!;
    await Destination.init();
    const [ currentSecurityRecords, currentHoldingRecords ] = await Promise.all([
      destination.tableConfigs.find(config => config.table === Table.Securities)?.isEnabled
        ? Destination.loadRecords({ table: Table.Securities, tableConfigs: destination.tableConfigs })
          .then(records => {
            logger.info("Loaded security records", { count: records.length });
            return records;
          })
        : Promise.resolve([]),
      destination.tableConfigs.find(config => config.table === Table.Holdings)?.isEnabled
        ? Destination.loadRecords({ table: Table.Holdings, tableConfigs: destination.tableConfigs })
          .then(records => {
            logger.info("Loaded holdings records", { count: records.length });
            return records;
          })
        : Promise.resolve([])
    ])

    const { holdings, securities } = await Promise.all(plaidItems.map(async item => {
      const itemData = itemsData.find(data => data.itemId === item.id)!;
      if ( itemData.hasAuthError || !itemData.canSync.Holdings ) { return { holdings: [] as Holding[], securities: [] as Security[] }};
      const options = { account_ids: itemData.accountIds } as InvestmentHoldingsGetRequestOptions;
      const itemLogger = logger.with({ itemId: item.id });
      return plaid.getHoldings({ accessToken: item.accessToken, options })
      .then(({ data: { holdings, securities }}) => {
        itemLogger.info("Holdings fetched", { holdingsCount: holdings.length, securitiesCount: securities.length });
        return { holdings, securities }
      })
    })).then(responses => ({
      holdings: responses.reduce((prev, all) => prev.concat(all.holdings), [] as Holding[]),
      securities: responses.reduce((prev, all) => prev.concat(all.securities), [] as Security[])
    }))

    const { records: securityRecords, results: securityResults } = await Destination.upsertSecurities({ securities, records: currentSecurityRecords })
      .then(({ records, results }) => {
        logger.info("Securities upserted", { results: { added: results.added.length, updated: results.updated.length }});
        return { records, results }
      })
    const holdingsResults = await Destination.upsertHoldings({ holdings, securityRecords, accountRecords, records: currentHoldingRecords })
      .then(results => {
        logger.info("Holdings upserted", { results: { added: results.added.length, updated: results.updated.length }});
        return results;
      })

    await Promise.all(plaidItems.map(async item => {
      const itemData = itemsData.find(data => data.itemId === item.id )!
      const itemHoldings = holdings.filter(holding => itemData.accountIds.includes(holding.account_id));
      const itemSecurityIds = itemHoldings.map(ih => ih.security_id);

      return syncId && db.syncResult.update({
        where: { syncId_plaidItemId_destinationId: { syncId, plaidItemId: item.id, destinationId: destination.id }},
        data: {
          shouldSyncHoldings: itemData.canSync.Holdings,
          shouldSyncSecurities: itemData.canSync.Securities,
          holdingsAdded: holdingsResults.added.filter(({ accountId }) => itemData.accountIds.includes(accountId)).length,
          holdingsUpdated: holdingsResults.updated.filter(({ accountId }) => itemData.accountIds.includes(accountId)).length,
          securitiesAdded: {
            increment: securityResults.added.filter(id => itemSecurityIds.includes(id)).length
          },
          securitiesUpdated: {
            increment: securityResults.updated.filter(id => itemSecurityIds.includes(id)).length
          }
        }
      })
    }))
    logger.info("Sync Holdings finished");
  })

  await tools.run("Sync Investment Transactions", async () => {
    logger.info("Sync Investment Transactions started");
    const Destination = getDestinationObject({ 
      integration: destination.integration, 
      credentials: (destination.airtableCredential || destination.googleSheetsCredential || destination.notionCredential)!,
      userId: destination.userId
    })!;
    await Destination.init();
    const [ currentSecurityRecords, currentInvestmentTransactionRecords ] = await Promise.all([
      destination.tableConfigs.find(config => config.table === Table.Securities)?.isEnabled
        ? Destination.loadRecords({ table: Table.Securities, tableConfigs: destination.tableConfigs })
          .then(records => {
            logger.info("Loaded security records", { count: records.length });
            return records;
          })
        : Promise.resolve([]),
      destination.tableConfigs.find(config => config.table === Table.InvestmentTransactions)?.isEnabled
        ? Destination.loadRecords({ table: Table.InvestmentTransactions, tableConfigs: destination.tableConfigs })
          .then(records => {
            logger.info("Loaded investment transaction records", { count: records.length });
            return records;
          })
        : Promise.resolve([])
    ])

    const { securities, investmentTransactions } = await Promise.all(plaidItems.map(async item => {
      const itemData = itemsData.find(data => data.itemId === item.id)!;
      if ( itemData.hasAuthError || !itemData.canSync.InvestmentTransactions ) { return { investmentTransactions: [] as InvestmentTransaction[], securities: [] as Security[] }};
      const options = { account_ids: itemData.accountIds } as InvestmentsTransactionsGetRequestOptions;
      const itemLogger = logger.with({ itemId: item.id });
      return plaid.getAllInvestmentTransactions({ accessToken: item.accessToken, options, startDate, endDate })
      .then(({ investmentTransactions, securities }) => {
        itemLogger.info("Investment transactions fetched", { investmentTransactionsCount: investmentTransactions.length, securitiesCount: securities.length });
        return { investmentTransactions, securities }
      })
    })).then(responses => ({
      investmentTransactions: responses.reduce((prev, all) => prev.concat(all.investmentTransactions), [] as InvestmentTransaction[]),
      securities: responses.reduce((prev, all) => prev.concat(all.securities), [] as Security[])
    }))

    const { records: securityRecords, results: securityResults } = await Destination.upsertSecurities({ securities, records: currentSecurityRecords })
      .then(({ records, results }) => {
        logger.info("Securities upserted", { results: { added: results.added.length, updated: results.updated.length }});
        return { records, results }
      })
    const investmentTransactionResults = await Destination.upsertInvestmentTransactions({ investmentTransactions, securityRecords, accountRecords, records: currentInvestmentTransactionRecords })
      .then(results => {
        logger.info("Holdings upserted", { results: { added: results.added.length }});
        return results;
      })

    await Promise.all(plaidItems.map(async item => {
      const itemData = itemsData.find(data => data.itemId === item.id )!
      const itemInvestmentTransactions = investmentTransactions.filter(transaction => itemData.accountIds.includes(transaction.account_id));
      const itemInvestmentTransactionIds = itemInvestmentTransactions.map(it => it.investment_transaction_id);
      const itemSecurityIds = itemInvestmentTransactions.map(it => it.security_id);

      return syncId && db.syncResult.update({
        where: { syncId_plaidItemId_destinationId: { syncId, plaidItemId: item.id, destinationId: destination.id }},
        data: {
          shouldSyncInvestmentTransactions: itemData.canSync.InvestmentTransactions,
          shouldSyncSecurities: itemData.canSync.Securities,
          investmentTransactionsAdded: investmentTransactionResults.added.filter(id => itemInvestmentTransactionIds.includes(id)).length,
          securitiesAdded: {
            increment: securityResults.added.filter(id => itemSecurityIds.includes(id)).length
          },
          securitiesUpdated: {
            increment: securityResults.updated.filter(id => itemSecurityIds.includes(id)).length
          }
        }
      })
    }))
    logger.info("Sync Investment Transactions finished");
  })

  tools.run("Update Item On Finish", async () => {
    const Destination = getDestinationObject({ 
      integration: destination.integration, 
      credentials: (destination.airtableCredential || destination.googleSheetsCredential || destination.notionCredential)!,
      userId: destination.userId
    })!;
    await Destination.init();
    await Destination.updateItemsOnFinish({ 
      items: plaidItems, 
      institutionRecords: itemsData.map(data => data.record), 
      timezone: destination.user.timezone, 
      config: destination.tableConfigs.find(config => config.table === Table.Institutions)!
    });
    logger.info("Updated item records with logo and last synced at")
  })

  tools.run("Save results", async () => {
    logger.info("Savings results")
    const { id: destinationId, userId, integration } = destination;
    const institutionsSynced = plaidItems.length;
    const endedAt = new Date();

    const hadItemError = !!itemsData.find(data => data.hasAuthError);
    
    syncId && await Promise.all([
      db.sync.update({ where: { id: syncId }, data: { isSuccess: !hadItemError, endedAt, error: hadItemError ? SyncError.ItemError : undefined }})
        .then(response => logger.info("Updated sync record", { response })),
      
      logSyncCompleted({ trigger, userId, integration, destinationId, syncId, institutionsSynced }),

      trackSyncCompleted({ userId, trigger, integration, destinationId, institutionsSynced })
        .then(() => logger.info("Tracked sync completed event"))
    ])

    logger.info("destination/sync finished")
  })
});