export type {
  AllFrontendPlaidItemFieldsFragment as PlaidItemModel,
  AllFrontendSyncLogFieldsFragment as SyncLogModel,
  AllOauthClientFieldsFragment as OauthClientModel
} from "~/graphql/frontend";

import { AllFrontendIntegrationFieldsFragment, Integrations_Enum, AllFrontendDestinationFieldsFragment } from "~/graphql/frontend";

export interface IntegrationModel extends AllFrontendIntegrationFieldsFragment {
  id: Integrations_Enum
}

export interface DestinationModel extends AllFrontendDestinationFieldsFragment {
  integration: IntegrationModel
}