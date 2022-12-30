import { Configuration, PlaidApi, PlaidEnvironments, InvestmentHoldingsGetRequestOptions, LiabilitiesGetRequestOptions, CountryCode, InvestmentsTransactionsGetRequestOptions, AccountsGetRequestOptions, PlaidError, TransactionsGetRequestOptions, Transaction, InvestmentTransaction, Products, TransactionsSyncRequestOptions } from "plaid";
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