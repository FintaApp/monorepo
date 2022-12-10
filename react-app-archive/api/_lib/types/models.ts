import { TableConfigs } from "@finta/types";
import { AllDestinationFieldsFragment } from "../graphql/sdk";
export type { 
  AllPlaidItemFieldsFragment as PlaidItemModel,
  AllUserFieldsFragment as UserModel
} from "../graphql/sdk";

export interface DestinationModel extends AllDestinationFieldsFragment {
  table_configs: TableConfigs;
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