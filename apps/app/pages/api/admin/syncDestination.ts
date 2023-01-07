import { publicFunctionWrapper } from "~/lib/functionWrappers";
import { db } from "~/lib/db";
import _ from "lodash";
import { Integration, Table } from "@prisma/client";
import { getDestinationObject } from "~/lib/integrations/getDestinationObject";
import moment from "moment-timezone";
import { LiabilitiesGetResponse, Security } from "plaid";
import * as plaid from "~/lib/plaid";
import { getItemActiveAccounts } from "~/lib/getItemActiveAccounts";

export default publicFunctionWrapper(async ({ req, logger }) => {
  const tablesToSync = [ 
    Table.Institutions, Table.Accounts, Table.Categories, Table.Transactions,
    Table.Holdings, Table.InvestmentTransactions, Table.Securities
  ]
  const destinationId = req.body.destinationId;
  if ( !destinationId ) { return { status: 400, message: "Missing destinationId" }};

  const destination = await db.destination.findFirstOrThrow({
    where: { id: destinationId },
    include: { 
      accounts: {
        where: {
          item: { disabledAt: null }
        },
        include: { item: { include: { institution: true }} }
      }, 
      tableConfigs: { 
        include: { fieldConfigs: true }
      },
      airtableCredential: true,
      notionCredential: true,
      googleSheetsCredential: true,
      user: true
    }
  });
  logger.info("Fetched destination", { destination });

  const plaidItems = _.uniqBy(destination.accounts.map(account => account.item).filter(item => item.error !== 'ITEM_LOGIN_REQUIRED'), 'id')
    .map(item => ({ ...item, accounts: destination.accounts.filter(account => account.plaidItemId === item.id )}))

  if ( destination.integration === Integration.Coda ) { return { status: 200, message: "Coda integration"} }
  if ( plaidItems.length === 0 ) { return { status: 200, message: "No connected plaid items"} };

  const Destination = getDestinationObject({ 
    integration: destination.integration, 
    credentials: (destination.airtableCredential || destination.googleSheetsCredential || destination.notionCredential)!,
    userId: destination.userId
  })!;
  await Destination.init();
  logger.info("Destination initialized");

  const validateCredentialsResponse = await Destination.validateCredentials();
  logger.info("Validated credentials", { response: validateCredentialsResponse });
  if ( !validateCredentialsResponse.isValid ) {
    return { status: 200, message: "Invalid credentials"}
  }

  const validateTableConfigsResponse = await Destination.validateTableConfigs({
    tableTypes: tablesToSync,
    tableConfigs: destination.tableConfigs
  });
  logger.info("Validated table configs", { response: validateTableConfigsResponse });

  if ( !validateTableConfigsResponse.isValid ) {
    return { status: 200, message: "Invalid table configs"}
  };

  const startDate = destination.syncStartDate;
  const endDate = moment().format("YYYY-MM-DD");
  
  await Destination.load({ tableTypes: tablesToSync, tableConfigs: destination.tableConfigs });
  logger.info("Loaded tables");

  try {
    for ( const item of plaidItems ) {
      const getItemActiveAccountsResponse = await getItemActiveAccounts({ item, logger });
      if ( getItemActiveAccountsResponse.hasAuthError ) { logger.info("Item is in error state"); continue; }
      const destinationPlaidAccountIds = _.intersection(
        getItemActiveAccountsResponse.accountIds || [],
        destination.accounts
          .filter(account => account.plaidItemId === item.id)
          .map(account => account.id)
      );
      const itemLogger = logger.with({ itemId: item.id });
      const accountIds = destinationPlaidAccountIds
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

      const { data: { accounts }} = await plaid
        .getAccounts({ accessToken: item.accessToken, options: { account_ids: accountIds }})
        .catch(error => {
          logger.error(error, { function: 'getAccounts', error: error.response.data });
          throw error;
        })
      itemLogger.info("Accounts fetched", { count: accounts.length })
      const { student, credit, mortgage } = shouldSyncLiabilities
        ? await plaid.getLiabilities({ accessToken: item.accessToken, options: { account_ids: accountIds }})
            .then(response => response.data.liabilities)
            .catch(error => {
              logger.error(error, { function: 'getLiabilities', error: error.response.data });
              throw error;
            })
        : { student: [], credit: [], mortgage: []} as LiabilitiesGetResponse['liabilities'];

      itemLogger.info("Liabilities fetched", { student: student?.length, credit: credit?.length, mortgage: mortgage?.length });
      
      const transactions = shouldSyncTransactions
        ? await plaid.getAllTransactions({ accessToken: item.accessToken, startDate, endDate, options: { account_ids: accountIds }})
            .then(response => {
              itemLogger.info("Transactions fetched", { count: response.transactions.length})
              return response.transactions;
            })
            .catch(error => {
              logger.error(error, { function: 'getAllTransactions', error: error.response.data });
              throw error;
            })
        : [];
      const categories = shouldSyncCategories
        ? _.uniqBy(transactions?.filter(transaction => !!transaction.category_id && !!transaction.category)
          .filter(transaction => !!transaction.category_id && !!transaction.category)
          .map(transaction => ({ id: transaction.category_id!, name: transaction.category![transaction.category!.length - 1]!, category_group: transaction.category![0] || "" })) || [], 'id')
        : undefined;
      itemLogger.info("Categories parsed", { count: categories?.length })
      const { holdings, securities: holdingsSecurities } = shouldSyncHoldings
        ? await plaid.getHoldings({ accessToken: item.accessToken, options: { account_ids: accountIds }})
          .then(response => response.data)
          .catch(error => {
            logger.error(error, { function: 'getHoldings', error: error.response.data });
            throw error;
          })
        : { holdings: undefined, securities: [] as Security[] };
      itemLogger.info("Holdings fetched", { holdingsCount: holdings?.length, securitiesCount: holdingsSecurities.length })
      const { investmentTransactions, securities: investmentTransactionsSecurities } = shouldSyncInvestmentTransactions
        ? await plaid.getAllInvestmentTransactions({ accessToken: item.accessToken, startDate, endDate, options: { account_ids: accountIds }})
          .catch(error => {
            logger.error(error, { function: 'getHoldings', error: error.response.data });
            throw error;
          })
        : { investmentTransactions: undefined, securities: [] as Security[] };
      itemLogger.info("Investment transactions fetched", { transactionsCount: investmentTransactions?.length, securitiesCount: investmentTransactionsSecurities.length })
      const securities = _.uniqBy((holdingsSecurities).concat(investmentTransactionsSecurities), 'security_id');

      const { record: institutionRecord, isNew: isInstitutionRecordNew } = await Destination.upsertItem({ item });
      itemLogger.info("Upserted institution", { isNew: isInstitutionRecordNew })

      const [ 
        { records: accountRecords, results: accountResults }, 
        { records: categoryRecords, results: categoryResults }, 
        { records: securityRecords, results: securityResults } 
      ] = await Promise.all([
        Destination.upsertAccounts({ accounts, item, institutionRecord, creditLiabilities: credit || undefined, mortgageLiabilities: mortgage || undefined, studentLiabilities: student || undefined })
          .then(response => { itemLogger.info("Upserted accounts", { results: response.results }); return response }),
        Destination.upsertCategories({ categories })
          .then(response => { itemLogger.info("Upserted categories", { results: response.results }); return response }),
        Destination.upsertSecurities({ securities })
          .then(response => { itemLogger.info("Upserted securities", { results: response.results }); return response })
      ]);

      const [ transactionResults, holdingsResults, investmentTransactionResults ] = await Promise.all([
        Destination.upsertTransactions({ transactions, categoryRecords, accountRecords })
          .then(response => { itemLogger.info("Upserted transactions", { results: response }); return response }),
        Destination.upsertHoldings({ holdings, securityRecords, accountRecords })
          .then(response => { itemLogger.info("Upserted holdings", { results: response }); return response }),
        Destination.upsertInvestmentTransactions({ investmentTransactions, securityRecords, accountRecords })
          .then(response => { itemLogger.info("Upserted investment transactions", { results: response }); return response }),
      ])

      await Destination.updateItemOnFinish({ item, institutionRecord, timezone: destination.user.timezone })
          .then(() => itemLogger.info("Updated item record with last sync at"))

      itemLogger.info("Finished synced", { results: {
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
      }})
    }

    return { status: 200, message: "OK"}
  } catch (error) {
    console.log(error)
    logger.error(error);
    return { status: 500, message: "Internal Error"}
  }
})