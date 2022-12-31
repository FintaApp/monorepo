export type { 
  AllBackendPlaidItemFieldsFragment as PlaidItemModel,
} from "~/graphql/backend/sdk"

import { AllBackendDestinationFieldsFragment, AllBackendIntegrationFieldsFragment, Integrations_Enum } from "~/graphql/backend/sdk";

interface Integration extends AllBackendIntegrationFieldsFragment {
  id: Integrations_Enum
}

export interface DestinationModel extends AllBackendDestinationFieldsFragment {
  integration: Integration
}