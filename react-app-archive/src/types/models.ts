import { AllOauthClientFieldsFragment, AllSyncLogFieldsFragment, AllPlaidAccountFieldsFragment, AllIntegrationFieldsFragment, AllDestinationFieldsFragment, Integrations_Enum } from "src/graphql";
import { TableConfigs, AirtableCredentials, CodaCredentials, GoogleSheetsCredentials, NotionCredentials } from "@finta/types"

export type { AllDestinationAccountFieldsFragment as DestinationAccountModel } from "src/graphql";
export type { AllPlaidItemFieldsFragment as PlaidItemModel } from "src/graphql";
export type { AllStripeDataFieldsFragment as StripeData } from "src/graphql";
export type { AllSubscriptionPricesFieldsFragment as SubscriptionPriceModel } from "src/graphql";
export type { AllUserFieldsFragment as UserModel } from 'src/graphql';

export type AllDestinationSyncLogFieldsFragment = AllSyncLogFieldsFragment['destination_sync_logs'][0];
export type AllPlaidItemSyncLogFieldsFragment = AllSyncLogFieldsFragment['plaid_item_sync_logs'][0];

interface PlaidItemSyncLogModel extends AllPlaidItemSyncLogFieldsFragment { 
  error?: {
    error_code: string
  },
  accounts: {
    added: string[],
    updated: string[]
  },
  transactions: {
    added: number;
    updated: number;
    removed: number;
  },
  holdings: {
    added: number;
    updated: number;
  },
  investment_transactions: {
    added: number;
  }
}

export interface OauthClientModel extends AllOauthClientFieldsFragment {
  integration: IntegrationModel
}

export interface IntegrationModel extends AllIntegrationFieldsFragment {
  id: Integrations_Enum
}

interface DestinationSyncLogModel extends AllDestinationSyncLogFieldsFragment {
  error?: {
    error_code: string;
    table?: string;
    field?: string;
  },
  accounts: {
    added: string[],
    updated: string[]
  },
  transactions: {
    added: number;
    updated: number;
    removed: number;
  },
  holdings: {
    added: number;
    updated: number;
  },
  investment_transactions: {
    added: number;
  },
  destination: DestinationModel;
}

export interface SyncLogModel extends AllSyncLogFieldsFragment {
  trigger: 'destination';
  error?: {
    error_code: 'no_subscription' | 'has_error_item' | 'investments_disabled' | 'transactions_disabled' | 'internal_error'
  };
  plaid_item_sync_logs: PlaidItemSyncLogModel[];
  destination_sync_logs: DestinationSyncLogModel[];
  metadata?: {
    target_table?: 'institutions' | 'accounts' | 'transactions' | 'holdings' | 'investment_transactions'
  }
}

export interface DestinationModel extends AllDestinationFieldsFragment {
  authentication: AirtableCredentials | CodaCredentials | GoogleSheetsCredentials | NotionCredentials;
  table_configs: TableConfigs;
  integration: IntegrationModel;
};

export interface PlaidAccountsModel extends AllPlaidAccountFieldsFragment {
  institution_name: string;
}

export enum SubscriptionStatus {
  Active = 'active',
  Canceled = 'canceled',
  Incomplete = 'incomplete',
  IncompleteExpired = 'incomplete_expired',
  PastDue = 'past_due',
  Trialing = 'trialing',
  Unpaid = 'unpaid'
}

export enum Interval {
  Day = 'day',
  Month = 'month',
  Week = 'week',
  Year = 'year'
}

export type StripeGraphqlSubscription = {
  cancel_at_period_end: boolean;
  current_period_end: Date;
  current_period_start: Date;
  ended_at?: Date;
  id: string;
  interval: Interval;
  started_at: Date;
  status: SubscriptionStatus;
  trial_ended_at?: Date;
  trial_started_at?: Date;
};