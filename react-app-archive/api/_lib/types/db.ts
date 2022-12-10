import { Users, Plaid_Institutions, Destinations, Sync_Logs, UserProfiles } from "../graphql/sdk";
export type { 
  DbPlaidItemFieldsFragment as DBPlaidItem,
  DbPlaidInstitutionFieldsFragment as DBPlaidInstitution,
  DbDestinationFieldsFragment as DBDestination,
  DbUserFieldsFragment as DBUser,
  DbSyncLogFieldsFragment as DBSyncLog,
  DbUserProfileFieldsFragment as DBUserProfile
} from "../graphql/sdk"

type AdminSessionVariables = {
  "x-hasura-role": "admin"
}

type UserSessionVariables = {
  "x-hasura-role": 'user';
  "x-hasura-user-is-anonymous": boolean;
  "x-hasura-user-id": string;
}

type SessionVariables = AdminSessionVariables | UserSessionVariables;

export interface DBEventPayload<O extends 'INSERT' | 'UPDATE' | 'DELETE' = any, T = any> {
  event: {
    session_variables: SessionVariables;
    op: O,
    data: {
      old: O extends 'UPDATE' | 'DELETE' ? T : null
      new: O extends 'INSERT' | 'UPDATE' ? T : null
    }
  };
  created_at: string;
  id: string;
  delivery_info: {
    max_retries: number;
    current_retry: number;
  };
  trigger: {
    name: string
  }
  table: {
    schema: string;
    name: string;
  }
}