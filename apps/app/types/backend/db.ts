export type {
  DbAirtableTokenFieldsFragment as DBAirtableToken,
  DbDestinationFieldsFragment as DBDestination,
  DbNotionConnectionFieldsFragment as DBNotionConnection,
  DbPlaidAccountFieldsFragment as DBPlaidAccount,
  DbPlaidInstitutionFieldsFragment as DBPlaidInstitution,
  DbPlaidItemFieldsFragment as DBPlaidItem,
  DbSyncLogFieldsFragment as DBSyncLog,
  DbUserFieldsFragment as DBUser,
  DbUserProfileFieldsFragment as DBUserProfile
} from "~/graphql/backend/sdk";

type AdminSessionVariables = {
  "x-hasura-role": "admin"
}

type UserSessionVariables = {
  "x-hasura-role": 'user';
  "x-hasura-user-is-anonymous": boolean;
  "x-hasura-user-id": string;
}

type SessionVariables = AdminSessionVariables | UserSessionVariables;

export interface DBEventPayload<O extends 'INSERT' | 'UPDATE' | 'DELETE' | 'MANUAL' = any, T = any> {
  event: {
    session_variables: SessionVariables;
    op: O,
    data: {
      old: O extends 'UPDATE' | 'DELETE' | 'MANUAL' ? T : null
      new: O extends 'INSERT' | 'UPDATE' | 'MANUAL' ? T : null
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