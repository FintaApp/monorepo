import { Field, SyncError, SyncEvent, Table } from "@prisma/client";
import { createStepFunction } from "inngest";
import _ from "lodash";

import { db } from "../db";
import * as plaid from "../plaid";
import { getDestinationObject } from "../integrations/getDestinationObject";
import moment from "moment-timezone";
import { logDestinationErrorTriggered } from "../logsnag";
import { trackDestinationErrorTriggered } from "../analytics";
import accounts from "~/pages/api/oauth/accounts";

export const syncDestination = createStepFunction("Sync Destination", "destination/sync", async ({ event, tools }) => {
  const { destinationId, startDate, syncId, itemIds, tablesToSync, trigger } = event.data;

  const { destination, plaidItems, Destination, canSync, error } = await tools.run("Initialization", async () => {
    let canSync = true;
    let error: { code: SyncError, table?: Table, tableId?: string; tableName?: string; field?: Field; fieldId?: string; fieldName?: string; } | undefined;

    const destination = await db.destination.findFirstOrThrow({
      where: { id: destinationId },
      include: { 
        accounts: true, 
        tableConfigs: { 
          include: { fieldConfigs: true }
        },
        airtableCredential: true,
        notionCredential: true,
        googleSheetsCredential: true
      }
    });

    const plaidItems = await db.plaidItem.findMany({ 
      where: { id: { in: itemIds }},
      include: { accounts: true, institution: true }
    })

    const Destination = getDestinationObject({ 
      integration: destination.integration, 
      credentials: (destination.airtableCredential || destination.googleSheetsCredential || destination.notionCredential)!,
      userId: destination.userId
    })!;

    await Destination.init();

    // Validate Credentials
    await db.syncLog.upsert({
      where: { syncId_event: { syncId, event: SyncEvent.ValidateCredentials }},
      create: { syncId, event: SyncEvent.ValidateCredentials },
      update: { startedAt: new Date() }
    });

    const validateCredentialsResponse = await Destination.validateCredentials();
    await db.syncLog.update({
      where: { syncId_event: { syncId, event: SyncEvent.ValidateCredentials }},
      data: {
        finishedAt: new Date(),
        isSuccess: validateCredentialsResponse.isValid
      }
    });

    if ( validateCredentialsResponse.isValid ) {
      // Validate Configuration
      await db.syncLog.upsert({
        where: { syncId_event: { syncId, event: SyncEvent.ValidateConfiguration }},
        create: {
          syncId,
          event: SyncEvent.ValidateConfiguration,
        },
        update: {
          startedAt: new Date()
        }
      });

      const validateTableConfigsResponse = await Destination.validateTableConfigs({
        tableTypes: tablesToSync,
        tableConfigs: destination.tableConfigs
      });

      await db.syncLog.update({
        where: { syncId_event: { syncId, event: SyncEvent.ValidateConfiguration }},
        data: {
          finishedAt: new Date(),
          isSuccess: validateTableConfigsResponse.isValid
        }
      });

      if ( validateTableConfigsResponse.isValid ) {
        await Destination.load({ tableTypes: tablesToSync, tableConfigs: destination.tableConfigs });
      } else {
        canSync = false;
        error = validateTableConfigsResponse.errors[0]
        await db.sync.update({ 
          where: { id: syncId },
          data: {
            isSuccess: false,
            error: validateTableConfigsResponse.errors[0]?.code,
            errorMetadata: validateTableConfigsResponse.errors[0],
            endedAt: new Date()
          }
        })
      }

    } else {
      canSync = false
      error = { code: validateCredentialsResponse.error!.code }
      await db.sync.update({ 
        where: { id: syncId },
        data: {
          isSuccess: false,
          error: validateCredentialsResponse.error?.code,
          endedAt: new Date()
        }
      })
    }

    return { destination, plaidItems, Destination, canSync, error }
  });

  if ( !canSync ) {
    await Promise.all([
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
      })
    ])
    return;
  }

  const shouldSyncInstitution = tablesToSync.includes(Table.Institutions);
  const shouldSyncAccounts = tablesToSync.includes(Table.Accounts);
  const shouldSyncTransactions = tablesToSync.includes(Table.Transactions) && destination.tableConfigs.find(config => config.table === Table.Transactions)?.isEnabled;
  const shouldSyncCategories = tablesToSync.includes(Table.Categories) && destination.tableConfigs.find(config => config.table === Table.Categories)?.isEnabled;
  const shouldSyncHoldings = tablesToSync.includes(Table.Holdings) && destination.tableConfigs.find(config => config.table === Table.Holdings)?.isEnabled;
  const shouldSyncInvestmentTransactions = tablesToSync.includes(Table.InvestmentTransactions) && destination.tableConfigs.find(config => config.table === Table.InvestmentTransactions)?.isEnabled;
  const shouldSyncSecurities = tablesToSync.includes(Table.Securities) && destination.tableConfigs.find(config => config.table === Table.Securities)?.isEnabled;

  for ( const item of plaidItems ) {
    const endDate = moment().format("YYYY-MM-DD")
    const whereKey = { syncId, destinationId, plaidItemId: item.id};
    const accountIds = destination.accounts.filter(account => account.plaidItemId === item.id).map(account => account.id);
    const products = ((item.availableProducts || []) as string[]).concat(((item.billedProducts || []) as string[]))

    tools.run(`Initialize sync metadata - ${item.id}`, () => {
      return db.syncMetadata.upsert({
        where: { syncId_plaidItemId_destinationId: whereKey },
        update: {},
        create: { 
          ...whereKey,
          shouldSyncInstitution,
          shouldSyncAccounts,
          shouldSyncTransactions,
          shouldSyncCategories,
          shouldSyncHoldings,
          shouldSyncInvestmentTransactions,
          shouldSyncSecurities,
        }
      })
    })
    // const [ accounts, transactions, { holdings, securities: holdingsSecurities }, { investmentTransactions, securities: investmentTransactionsSecurities }] = await tools.run("Load Plaid Data", () => {
    //   const { accessToken } = item;
    //   const endDate = moment().format("YYYY-MM-DD")
    //   const accountIds = destination.accounts.filter(account => account.plaidItemId === item.id).map(account => account.id);
    //   return Promise.all([
    //     plaid.getAccounts({ accessToken, options: { account_ids: accountIds }}).then(response => response.data.accounts),

    //     tablesToSync.includes(Table.Transactions) 
    //       ? plaid.getAllTransactions({ accessToken, startDate, endDate, options: { account_ids: accountIds }}).then(response => response.transactions)
    //       : undefined,
        
    //     tablesToSync.includes(Table.Holdings)
    //       ? plaid.getHoldings({ accessToken, options: { account_ids: accountIds }}).then(response => response.data )
    //       : { holdings: undefined, securities: undefined},

    //     tablesToSync.includes(Table.InvestmentTransactions)
    //       ? plaid.getAllInvestmentTransactions({ accessToken, startDate, endDate, options: { account_ids: accountIds }}).then(response => response.data )
    //       : { investmentTransactions: undefined, securities: undefined }
    //   ])
    // });

    const institutionRecord = await tools.run(`Sync Institution - ${item.id}`, async () => {
      return Destination.upsertItem({ item })
      .then(async ({ record, isNew }) => {
        await db.syncMetadata.update({ 
          where: { syncId_plaidItemId_destinationId: whereKey }, 
          data: { institutionsAdded: isNew ? 1 : 0, institutionsUpdated: isNew ? 0 : 1 }})
        return record;
      })
    });

    const accountRecords = await tools.run(`Sync Accounts = ${item.id}`, async () => {
      if ( !tablesToSync.includes(Table.Accounts) ) { return [] }
      const { data: { accounts }} = await plaid.getAccounts({ accessToken: item.accessToken, options: { account_ids: accountIds }})
      const { data: { liabilities: { student, credit, mortgage }}} = await plaid.getLiabilities({ accessToken: item.accessToken, options: { account_ids: accountIds }});

      return Destination.upsertAccounts({ accounts, item, institutionRecord, studentLiabilities: student || undefined, creditLiabilities: credit || undefined, mortgageLiabilities: mortgage || undefined })
      .then(async ({ records, results }) => {
        await db.syncMetadata.update({
          where: { syncId_plaidItemId_destinationId: whereKey },
          data: { accountsAdded: { increment: results.added }, accountsUpdated: { increment: results.updated }}
        })
        return records;
      })
    })

    tools.run(`Sync Transactios - ${item.id}`, async () => {
      if ( !tablesToSync.includes(Table.Transactions) ) { return; }
      const transactions = await plaid.getAllTransactions({ accessToken: item.accessToken, startDate, endDate, options: { account_ids: accountIds }});
      const categories = 
    })


  }

  let { transactionRecords, categoryRecords, isTransactionsEnabled, isCategoriesEnabled } = tools.run("Fetch Transactions and Categories", async () => {
    const isTransactionsEnabled = enabledTables.includes(Table.Transactions);
    const isCategoriesEnabled = enabledTables.includes(Table.Categories);

    const transactionRecords = enabledTables.includes(Table.Transactions) 
      ? (await Destination.loadRecords({ table: Table.Transactions }))
      : []
    const categoryRecords = enabledTables.includes(Table.Categories) 
      ? (await Destination.loadRecords({ table: Table.Categories }))
      : []

    await Promise.all(plaidItems.map(async item => {
      const isTransactionsProductAvailable = (item.availableProducts as string[]).includes('transactions');
      const whereKey = { syncId, destinationId, plaidItemId: item.id};
      const data = { 
        categoriesAdded: 0, transactionsAdded: 0, transactionsUpdated: 0, transactionsRemoved: 0,
        shouldSyncTransactions: isTransactionsEnabled && isTransactionsProductAvailable,
        shouldSyncCategories: isCategoriesEnabled && isTransactionsProductAvailable
      }
      await db.syncMetadata.upsert({
        where: { syncId_plaidItemId_destinationId: whereKey },
        create: { ...whereKey, ...data },
        update: { ...data }
      });
    }))

    return { transactionRecords, categoryRecords, isTransactionsEnabled, isCategoriesEnabled }
  });

  if ( isTransactionsEnabled ) {
    for (const item of plaidItems ) {
      const isTransactionsProductAvailable = (item.availableProducts as string[]).includes('transactions');
      const accountIds = destination.accounts.filter(account => account.plaidItemId === item.id).map(account => account.id);
      const params = { accessToken: item.accessToken, startDate, endDate: moment().format("YYYY-MM-DD"), options: { account_ids: accountIds }};
      const response = await plaid.getTransactions({ ...params });
      const totalTransactions = response.data.total_transactions;
      let transactions = response.data.transactions;
      let transactionsProcessed = 0;

      while ( transactionsProcessed <= totalTransactions && isTransactionsProductAvailable ) {
        const categories = _.uniqBy(transactions?.filter(transaction => !!transaction.category_id && !!transaction.category)
        .filter(transaction => !!transaction.category_id && !!transaction.category)
        .map(transaction => ({ id: transaction.category_id!, name: transaction.category![transaction.category!.length - 1], category_group: transaction.category![0] })) || [], 'id');

        let {} = tools.run("Sync Paginated Transactions and Categories", async () => {
          const newCategoryRecords = await Destination
          return Destination.u({ 
            accounts, 
            accountRecords,
            item, 
            institutionRecord,
            studentLiabilities: student || undefined,
            creditLiabilities: credit || undefined,
            mortgageLiabilities: mortgage || undefined
          })
          .then(async ({ records, results: { added, updated} }) => {
            const data = { accountsAdded: added, accountsUpdated: updated, shouldSyncAccounts: true };
            await db.syncMetadata.upsert({
              where: { syncId_plaidItemId_destinationId: whereKey},
              update: data,
              create: { ...whereKey, ...data }
            });
            return records;
          })
        })

        transactionsProcessed += transactions.length;
        transactions = await plaid.getTransactions({ ...params, options: { ...params.options, offset: transactions.length}})
          .then(response => response.data.transactions)
      }
    }
  }

  tools.run("Sync Transactions and Categories", async () => {

  })
})