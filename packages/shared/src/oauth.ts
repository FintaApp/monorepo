export type OauthAccount = {
  id: string;
  plaid_item_id: string;
  name: string;
  mask?: string;
  type: string;
  subtype: string;
  available_balance?: number;
  current_balance?: number;
  limit?: number;
  currency?: string;
  interest_rate?: number;
  last_payment_amount?: number;
  last_payment_date?: string;
  next_payment_due_date?: string;
  last_statement_balance?: number;
  minimum_payment_amount?: number;
  next_monthly_payment?: number;
  origination_date?: string;
  origination_principal_amount?: number;
}

export type OauthHolding = {
  account_id: string;
  cost_basis?: number;
  currency?: string;
  quantity: number;
  close_price?: number;
  symbol?: string;
  security_name?: string;
  security_type: string;
}

export type OauthInvestmentTransaction = {
  id: string;
  name: string;
  account_id: string;
  sub_account?: string;
  amount: number;
  date: string;
  fees: number;
  currency?: string;
  price: number;
  quantity: number;
  type: string;
  subtype: string;
  symbol?: string;
  security_name?: string;
  security_type?: string;
}

export type OauthInstitution = {
  id: string;
  name: string;
  created_at: string;
  synced_at?: string;
  error?: string | null;
}

export type OauthDestination = {
  id: string;
  name: string;
}

export type OauthTransaction = {
  id: string;
  name: string;
  account_id: string;
  sub_account?: string;
  amount: number;
  currency: string | null;
  authorized_date?: string;
  date?: string;
  pending: boolean;
  merchant_name?: string;
  check_number?: string;
  payment_channel?: string;
  tags?: string;
}

export type GetTransactionsNextContinuation = {
  data: {
    syncLogId: string;
    paginationByItem: {
      itemId: string;
      hasMore: boolean;
      totalTransactions: number;
    }[]
  }
};

export type OauthGetAccountsResponse = {
  accounts: OauthAccount[]
}

export type OauthGetHoldingsResponse = {
  holdings: OauthHolding[];
}

export type OauthGetInstitutionsResponse = {
  institutions: OauthInstitution[];
}

export type OauthGetTransactionsResponse = {
  transactions: OauthTransaction[];
  nextContinuation?: GetTransactionsNextContinuation;
}

export type OauthGetInvestmentTransactionsResponse = {
  investmentTransactions: OauthInvestmentTransaction[];
  nextContinuation?: GetTransactionsNextContinuation;
}

export type OauthGetDestinationResponse = OauthDestination;