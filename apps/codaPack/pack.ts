import * as coda from "@codahq/packs-sdk";

import * as format from "./format";
import * as schemas from "./schemas";
import { OauthGetDestinationResponse, OauthGetInstitutionsResponse, OauthGetAccountsResponse, OauthGetHoldingsResponse, OauthGetInvestmentTransactionsResponse, OauthGetTransactionsResponse } from "@finta/shared";

const baseUrl = "https://app.finta.io";
const apiUrlPart = "/api/oauth"

export const pack = coda.newPack();

pack.setUserAuthentication({
  type: coda.AuthenticationType.OAuth2,
  authorizationUrl: `${baseUrl}/oauth/authorize`,
  tokenUrl: `${baseUrl}/api/oauth/access_token`,
  tokenPrefix: "Bearer",

  getConnectionName: async context => {
    const response = await context.fetcher.fetch({
      method: "GET",
      url: baseUrl + apiUrlPart + "/destination",
    });

    const destination = response.body as OauthGetDestinationResponse;
    return destination.name;
  }
});

pack.addNetworkDomain("finta.io");

// Sync Tables
pack.addSyncTable({
  name: "Institutions",
  schema: schemas.InstitutionSchema,
  identityName: "Institution",
  formula: {
    name: "SyncInstitutions",
    description: "Sync bank institutions",
    parameters: [],
    execute: async ([], context ) => {
      const response = await context.fetcher.fetch({
        method: "GET",
        url: baseUrl + apiUrlPart + "/institutions",
        cacheTtlSecs: 0
      });

      const responseBody = response.body as OauthGetInstitutionsResponse;
      const institutions = responseBody.institutions.map(format.institutions);

      return {
        result: institutions
      }
    }
  }
})

pack.addSyncTable({
  name: "Accounts",
  schema: schemas.AccountSchema,
  identityName: "Account",
  formula: {
    name: "SyncAccounts",
    description: "Sync bank accounts",
    parameters: [],
    execute: async ([], context ) => {
      const response = await context.fetcher.fetch({
        method: "GET",
        url: baseUrl + apiUrlPart + "/accounts",
        cacheTtlSecs: 0
      });

      const responseBody = response.body as OauthGetAccountsResponse;
      const accounts = responseBody.accounts.map(format.accounts);
      return {
        result: accounts
      }
    }
  }
})

pack.addSyncTable({
  name: "InvestmentHoldings",
  schema: schemas.InvestmentHoldingSchema,
  identityName: "InvestmentHolding",
  formula: {
    name: "SyncInvestmentHoldings",
    description: "Sync investment holdings",
    parameters: [],
    execute: async ([], context ) => {
      const response = await context.fetcher.fetch({
        method: "GET",
        url: baseUrl + apiUrlPart + "/holdings",
        cacheTtlSecs: 0
      });

      const responseBody = response.body as OauthGetHoldingsResponse;
      const holdings = responseBody.holdings.map(format.investmentHoldings);
      return {
        result: holdings
      }
    }
  }
})

pack.addSyncTable({
  name: "InvestmentTransactions",
  schema: schemas.InvestmentTransactionsSchema,
  identityName: "InvestmentTransaction",
  formula: {
    name: "SyncInvestmentTransactions",
    description: "Sync investment transactions",
    parameters: [],
    execute: async ([], context ) => {
      const { continuation } = context.sync;
      const response = await context.fetcher.fetch({
        method: "POST",
        url: baseUrl + apiUrlPart + "/investment-transactions",
        body: JSON.stringify(continuation),
        headers: {
          'content-type': 'application/json'
        },
        cacheTtlSecs: 0
      });

      const responseBody = response.body as OauthGetInvestmentTransactionsResponse;
      const investmentTransactions = responseBody.investmentTransactions.map(format.investmentTransactions);
      return {
        result: investmentTransactions,
        continuation: responseBody.nextContinuation as any
      }
    }
  }
})

pack.addSyncTable({
  name: "Transactions",
  schema: schemas.TransactionSchema,
  identityName: "Transaction",
  formula: {
    name: "SyncTransactions",
    description: "Sync transactions",
    parameters: [],
    execute: async ([], context ) => {
      const { continuation } = context.sync;
      const response = await context.fetcher.fetch({
        method: "POST",
        url: baseUrl + apiUrlPart + "/transactions",
        body: JSON.stringify(continuation),
        headers: {
          'content-type': 'application/json'
        },
        cacheTtlSecs: 0
      });

      const responseBody = response.body as OauthGetTransactionsResponse;
      const transactions = responseBody.transactions.map(format.transactions);
      return {
        result: transactions,
        continuation: responseBody.nextContinuation as any
      }
    }
  }
})