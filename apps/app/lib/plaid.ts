import { Configuration, PlaidApi, PlaidEnvironments, InvestmentHoldingsGetRequestOptions, LiabilitiesGetRequestOptions, CountryCode, InvestmentsTransactionsGetRequestOptions, AccountsGetRequestOptions, PlaidError, TransactionsGetRequestOptions, Transaction, InvestmentTransaction, Products, TransactionsSyncRequestOptions, LiabilitiesGetResponse } from "plaid";
import * as _ from 'lodash';

const allowedErrorCodes = ['NO_INVESTMENT_ACCOUNTS', 'NO_ACCOUNTS', "PRODUCT_NOT_READY"];
export type PlaidEnv = 'sandbox' | 'production';

export const plaidEnvFromVercelEnv = ['development', 'preview'].includes(process.env.VERCEL_ENV || "") ? 'sandbox' : 'production'
const getEnvFromAccessToken = (accessToken: string): PlaidEnv => {
  if ( accessToken.includes('production') ) { return 'production' }
  return 'sandbox'
}

const credentials = {
  clientId: process.env.PLAID_CLIENT_ID,
  secret: {
    sandbox: process.env.PLAID_SECRET_SANDBOX,
    production: process.env.PLAID_SECRET_PRODUCTION,
  }
}


const getClient = (env: PlaidEnv) => {
  const config = new Configuration({
    basePath: PlaidEnvironments[env],
    baseOptions: {
      headers: {
        'PLAID-CLIENT-ID': credentials.clientId,
        'PLAID-SECRET': credentials.secret[env],
      }
    }
  });

  return new PlaidApi(config)
}

export const createLinkToken = ({ userId, products, accessToken, webhookURL, redirectUri, isAccountSelectionEnabled = false }: {
  userId: string;
  products: string[];
  accessToken?: string;
  webhookURL: string;
  redirectUri: string;
  isAccountSelectionEnabled?: boolean
}) =>
  getClient(accessToken ? getEnvFromAccessToken(accessToken) : plaidEnvFromVercelEnv ).linkTokenCreate({
    user: { client_user_id: userId },
    client_name: "Finta",
    language: 'en',
    country_codes: ['US', 'CA'] as CountryCode[],
    products: products as Products[],
    access_token: accessToken,
    webhook: webhookURL,
    redirect_uri: redirectUri,
    update: accessToken ? { account_selection_enabled: isAccountSelectionEnabled } : undefined
  })

  export const exchangePublicToken = ({ publicToken }: { publicToken: string; }) =>
  getClient(plaidEnvFromVercelEnv).itemPublicTokenExchange({ public_token: publicToken })

export const getInstitution = ({ institutionId }: { institutionId: string }) =>
  getClient('production').institutionsGetById({institution_id: institutionId, country_codes: ["US", "CA"] as CountryCode[], options: { include_optional_metadata: true }});  

export const getItem = ({ accessToken }: { accessToken: string }) => getClient(getEnvFromAccessToken(accessToken)).itemGet({ access_token: accessToken });

export const removeItem = ({ accessToken }: { accessToken: string }) =>
  getClient(getEnvFromAccessToken(accessToken)).itemRemove({ access_token: accessToken })

export const getAccounts = async ({ accessToken, options = {} }: {
  accessToken: string;
  options?: AccountsGetRequestOptions;
}) =>
  getClient(getEnvFromAccessToken(accessToken)).accountsGet({ access_token: accessToken, options })
  .catch(err => {
    const error = err.response?.data as PlaidError;
    if ( error?.error_code && allowedErrorCodes.includes(error.error_code) ) {
      return { data: { accounts: [], item: undefined, request_id: undefined } }
    }

    throw err;
  })

export const getHoldings = async ({ accessToken, options = {} }: {
  accessToken: string;
  options?: InvestmentHoldingsGetRequestOptions
}) =>
  getClient(getEnvFromAccessToken(accessToken)).investmentsHoldingsGet({ access_token: accessToken, options })
  .then(response => {
    const { holdings } = response.data
    // Check to be sure account_id, security_id combinations are unique
    const uniqueHoldings = _.uniqWith(holdings, (h1, h2) => h1.account_id === h2.account_id && h1.security_id == h2.security_id) 
    // Ensure that each holding is unique? Whyyyy
    return { ...response, data: { ...response.data, holdings: uniqueHoldings}}
  })
  .catch(err => {
    const error = err.response?.data as PlaidError;
    if ( error?.error_code && allowedErrorCodes.includes(error.error_code) ) {
      return { data: { holdings: [], accounts: [], securities: [] } }
    }

    throw err;
  });

export const getInvestmentTransactions = async ({ accessToken, startDate, endDate, options }: {
  accessToken: string;
  startDate: string;
  endDate: string;
  options?: InvestmentsTransactionsGetRequestOptions
}) => 
  getClient(getEnvFromAccessToken(accessToken)).investmentsTransactionsGet({ access_token: accessToken, start_date: startDate, end_date: endDate, options: { ...options, count: 500 }})
  .catch(err => {
    const error = err.response?.data as PlaidError;
    if ( error?.error_code && allowedErrorCodes.includes(error.error_code) ) {
      return { data: { investment_transactions: [], accounts: [], total_investment_transactions: 0, securities: [] }}
    }

    throw err;
  });

export const getLiabilities = async ({ accessToken, options = {} }: {
  accessToken: string;
  options?: LiabilitiesGetRequestOptions;
}) =>
  getClient(getEnvFromAccessToken(accessToken)).liabilitiesGet({ access_token: accessToken, options })
  .catch(err => {
    const error = err.response?.data as PlaidError;
    if ( error?.error_code && allowedErrorCodes.includes(error.error_code) ) {
      return { data: { accounts: [], item: undefined, request_id: undefined, liabilities: { student: [], mortgage: [], credit: [] } } as LiabilitiesGetResponse}
    }

    throw err;
  });

export const transactionsSync = async ({ accessToken, cursor, count = 500 }: {
  accessToken: string;
  cursor?: string;
  count?: number
  env?: 'production' | 'sandbox'
}) =>
  getClient(getEnvFromAccessToken(accessToken)).transactionsSync({ access_token: accessToken, cursor, count })

export const getTransactions = async ({ accessToken, startDate, endDate, options = {} }: { accessToken: string; startDate: string; endDate: string, options?: TransactionsGetRequestOptions }) =>
  getClient(getEnvFromAccessToken(accessToken)).transactionsGet({ access_token: accessToken, start_date: startDate, end_date: endDate, options: { ...options, count: 500 }})
  .catch(err => {
    const error = err.response?.data as PlaidError;
    if ( error?.error_code && allowedErrorCodes.includes(error.error_code) ) {
      return { data: { accounts: [], item: undefined, request_id: undefined, transactions: [], total_transactions: 0 }}
    }

    throw err;
  });

export const initiateProducts = async ({ accessToken, availableProducts }: { accessToken: string; availableProducts: string[] }) => {
  await Promise.all(availableProducts.map(product => {
    if ( product === 'investments' ) { return getHoldings({ accessToken }).catch(() => null )}

    if ( product === 'liabilities') { return getLiabilities({ accessToken }).catch(() => null ) }

    if ( product === 'transactions' ) { return transactionsSync({ accessToken, count: 1 }).catch(() => null )}
  }))
}

export const getAllTransactions = async ({ accessToken, startDate, endDate, options = {} }: {
  accessToken: string;
  startDate: string;
  endDate: string;
  options?: TransactionsGetRequestOptions
}) => {
  const params = {
    accessToken,
    startDate,
    endDate
  }
  const response = await getTransactions({ ...params, options })
  let transactions = response.data.transactions as Transaction[];
  const accounts = response.data.accounts;
  const total_transactions = response.data.total_transactions;

  while ( transactions.length < total_transactions ) {
    const paginatedRequest = await getTransactions({ ...params, options: { ...options, offset: transactions.length }});
    transactions = transactions.concat(paginatedRequest.data.transactions)
  }

  return { transactions, accounts }
}

export const getAllInvestmentTransactions = async ({ accessToken, startDate, endDate, options = {} }: {
  accessToken: string;
  startDate: string;
  endDate: string;
  options?: InvestmentsTransactionsGetRequestOptions
}) => {
  const params = {
    accessToken,
    startDate,
    endDate
  }

  const response = await getInvestmentTransactions({ ...params, options})
  let investmentTransactions = response.data.investment_transactions as InvestmentTransaction[];
  const { accounts, total_investment_transactions, securities } = response.data;

  while ( investmentTransactions.length < total_investment_transactions ) {
    const paginatedRequest = await getInvestmentTransactions({ ...params, options: { ...options, offset: investmentTransactions.length }});
    investmentTransactions = investmentTransactions.concat(paginatedRequest.data.investment_transactions);
  }

  return { investmentTransactions, accounts, securities }
}
