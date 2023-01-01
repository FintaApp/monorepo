import { Field, SyncError, Table } from "@prisma/client";
import { createStepFunction } from "inngest";
import _ from "lodash";

import { db } from "../db";
import * as plaid from "../plaid";
import { getDestinationObject } from "../integrations/getDestinationObject";
import moment from "moment-timezone";
import { logDestinationErrorTriggered, logSyncCompleted } from "../logsnag";
import { trackDestinationErrorTriggered, trackSyncCompleted } from "../analytics";
import { LiabilitiesGetResponse } from "plaid";

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
    const validateCredentialsResponse = await Destination.validateCredentials();

    if ( validateCredentialsResponse.isValid ) {
      // Validate Configuration
      const validateTableConfigsResponse = await Destination.validateTableConfigs({
        tableTypes: tablesToSync,
        tableConfigs: destination.tableConfigs
      });

      if ( validateTableConfigsResponse.isValid ) {
        await Destination.load({ tableTypes: tablesToSync, tableConfigs: destination.tableConfigs })
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

  for ( const item of plaidItems ) {
    const endDate = moment().format("YYYY-MM-DD")
    const whereKey = { syncId, destinationId, plaidItemId: item.id};
    const accountIds = destination.accounts.filter(account => account.plaidItemId === item.id).map(account => account.id);
    const products = ((item.availableProducts || []) as string[]).concat(((item.billedProducts || []) as string[]));

    const shouldSyncInstitution = tablesToSync.includes(Table.Institutions);
  const shouldSyncAccounts = tablesToSync.includes(Table.Accounts);
  const shouldSyncTransactions = tablesToSync.includes(Table.Transactions) 
    && destination.tableConfigs.find(config => config.table === Table.Transactions)?.isEnabled
    && products.includes('transactions');
  const shouldSyncCategories = tablesToSync.includes(Table.Categories) 
    && destination.tableConfigs.find(config => config.table === Table.Categories)?.isEnabled
    && products.includes('transactions');
  const shouldSyncHoldings = tablesToSync.includes(Table.Holdings) 
    && destination.tableConfigs.find(config => config.table === Table.Holdings)?.isEnabled
    && products.includes('investments');
  const shouldSyncInvestmentTransactions = tablesToSync.includes(Table.InvestmentTransactions) 
    && destination.tableConfigs.find(config => config.table === Table.InvestmentTransactions)?.isEnabled
    && products.includes('investments');
  const shouldSyncSecurities = tablesToSync.includes(Table.Securities) 
    && destination.tableConfigs.find(config => config.table === Table.Securities)?.isEnabled
    && products.includes('investments');
  const shouldSyncLiabilities = products.includes('liabilities');

    tools.run(`Syncing item - ${item.id}`, async () => {
      // Initialize results
      await db.syncResult.upsert({
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
      });

      // Fetch Data
      const { data: { accounts }} = await plaid.getAccounts({ accessToken: item.accessToken, options: { account_ids: accountIds }});
      const { student, credit, mortgage } = shouldSyncLiabilities
        ? await plaid.getLiabilities({ accessToken: item.accessToken, options: { account_ids: accountIds }})
            .then(response => response.data.liabilities)
        : { student: [], credit: [], mortgage: []} as LiabilitiesGetResponse['liabilities'];
      const transactions = shouldSyncTransactions
        ? await plaid.getAllTransactions({ accessToken: item.accessToken, startDate, endDate, options: { account_ids: accountIds }})
            .then(response => response.transactions)
        : [];
      const categories = shouldSyncCategories
        ? _.uniqBy(transactions?.filter(transaction => !!transaction.category_id && !!transaction.category)
          .filter(transaction => !!transaction.category_id && !!transaction.category)
          .map(transaction => ({ id: transaction.category_id!, name: transaction.category![transaction.category!.length - 1]!, category_group: transaction.category![0] || "" })) || [], 'id')
        : undefined;
      const { holdings, securities: holdingsSecurities } = shouldSyncHoldings
        ? await plaid.getHoldings({ accessToken: item.accessToken, options: { account_ids: accountIds }}).then(response => response.data)
        : { holdings: undefined, securities: [] };
      const { investmentTransactions, securities: investmentTransactionsSecurities } = shouldSyncInvestmentTransactions
        ? await plaid.getAllInvestmentTransactions({ accessToken: item.accessToken, startDate, endDate, options: { account_ids: accountIds }})
        : { investmentTransactions: undefined, securities: [] };
      const securities = _.uniqBy((holdingsSecurities || []).concat(investmentTransactionsSecurities || []), 'security_id')

      const { record: institutionRecord, isNew: isInstitutionRecordNew } = await Destination.upsertItem({ item });

      const [ 
        { records: accountRecords, results: accountResults }, 
        { records: categoryRecords, results: categoryResults }, 
        { records: securityRecords, results: securityResults } 
      ] = await Promise.all([
        Destination.upsertAccounts({ accounts, item, institutionRecord, creditLiabilities: credit, mortgageLiabilities: mortgage, studentLiabilities: student }),
        Destination.upsertCategories({ categories }),
        Destination.upsertSecurities({ securities })
      ]);

      const [ transactionResults, holdingsResults, investmentTransactionResults ] = await Promise.all([
        Destination.upsertTransactions({ transactions, categoryRecords, accountRecords }),
        Destination.upsertHoldings({ holdings, securityRecords, accountRecords }),
        Destination.upsertInvestmentTransactions({ investmentTransactions, securityRecords, accountRecords })
      ])

      await db.syncResult.update({
        where: { syncId_plaidItemId_destinationId: whereKey },
        data: {
          institutionsAdded: isInstitutionRecordNew ? 1 : 0,
          institutionsUpdated: isInstitutionRecordNew ? 0 : 1,
          accountsAdded: accountResults.added,
          accountsUpdated: accountResults.updated,
          categoriesAdded: categoryResults.added,
          transactionsAdded: transactionResults.added,
          transactionsUpdated: transactionResults.updated,
          securitiesAdded: securityResults.added,
          securitiesUpdated: securityResults.updated,
          holdingsAdded: holdingsResults.added,
          holdingsUpdated: holdingsResults.updated,
          investmentTransactionsAdded: investmentTransactionResults.added
        }
      })
    })
  }

  tools.run("Save results", async () => {
    const { id: destinationId, userId, integration } = destination;
    const institutionsSynced = plaidItems.length;
    const endedAt = new Date();
    
    await Promise.all([
      db.sync.update({ where: { id: syncId }, data: { isSuccess: true, endedAt }}),
      
      logSyncCompleted({ trigger, userId, integration, destinationId, syncId, institutionsSynced }),

      trackSyncCompleted({ userId, trigger, integration, destinationId, institutionsSynced })
    ])
  })
});