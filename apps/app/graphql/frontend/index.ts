import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  Date: any;
  bigint: any;
  bytea: any;
  citext: any;
  jsonb: any;
  timestamptz: any;
  uuid: any;
};

export type BillingPortalSession = {
  __typename?: 'BillingPortalSession';
  id: Scalars['String'];
  url: Scalars['String'];
};

/** Boolean expression to compare columns of type "Boolean". All fields are combined with logical 'AND'. */
export type Boolean_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Boolean']>;
  _gt?: InputMaybe<Scalars['Boolean']>;
  _gte?: InputMaybe<Scalars['Boolean']>;
  _in?: InputMaybe<Array<Scalars['Boolean']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Boolean']>;
  _lte?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Scalars['Boolean']>;
  _nin?: InputMaybe<Array<Scalars['Boolean']>>;
};

export type CheckoutPortalSession = {
  __typename?: 'CheckoutPortalSession';
  id: Scalars['String'];
  url: Scalars['String'];
};

/** Boolean expression to compare columns of type "Int". All fields are combined with logical 'AND'. */
export type Int_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['Int']>;
  _gt?: InputMaybe<Scalars['Int']>;
  _gte?: InputMaybe<Scalars['Int']>;
  _in?: InputMaybe<Array<Scalars['Int']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['Int']>;
  _lte?: InputMaybe<Scalars['Int']>;
  _neq?: InputMaybe<Scalars['Int']>;
  _nin?: InputMaybe<Array<Scalars['Int']>>;
};

export enum PriceInterval {
  Day = 'day',
  Month = 'month',
  Week = 'week',
  Year = 'year'
}

export type RemoteSchemaUserProfile = {
  __typename?: 'RemoteSchemaUserProfile';
  isSubscribedGeneral: Scalars['Boolean'];
  isSubscribedSyncUpdates: Scalars['Boolean'];
  stripeCustomerId: Scalars['String'];
  stripeData: StripeData;
  syncUpdatesFrequency: SyncUpdatesFrequency;
  syncUpdatesJobId?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
};

/** Boolean expression to compare columns of type "String". All fields are combined with logical 'AND'. */
export type String_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['String']>;
  _gt?: InputMaybe<Scalars['String']>;
  _gte?: InputMaybe<Scalars['String']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['String']>;
  _in?: InputMaybe<Array<Scalars['String']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['String']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['String']>;
  _lt?: InputMaybe<Scalars['String']>;
  _lte?: InputMaybe<Scalars['String']>;
  _neq?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['String']>;
  _nin?: InputMaybe<Array<Scalars['String']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['String']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['String']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['String']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['String']>;
};

export type StripeCustomer = {
  __typename?: 'StripeCustomer';
  createdAt: Scalars['Date'];
  id: Scalars['String'];
};

export type StripeData = {
  __typename?: 'StripeData';
  customer: StripeCustomer;
  hasAppAccess: Scalars['Boolean'];
  subscription?: Maybe<StripeSubscription>;
  trialEndsAt: Scalars['Date'];
};

export type StripePrice = {
  __typename?: 'StripePrice';
  id: Scalars['String'];
  interval: PriceInterval;
  productId: Scalars['String'];
  unitAmount: Scalars['Float'];
};

export type StripeSubscription = {
  __typename?: 'StripeSubscription';
  cancelAtPeriodEnd: Scalars['Boolean'];
  canceledAt?: Maybe<Scalars['Date']>;
  currentPeriodEnd: Scalars['Date'];
  currentPeriodStart: Scalars['Date'];
  endedAt?: Maybe<Scalars['Date']>;
  id: Scalars['String'];
  interval: PriceInterval;
  startedAt: Scalars['Date'];
  status: SubscriptionStatus;
  trialEndedAt?: Maybe<Scalars['Date']>;
  trialStartedAt?: Maybe<Scalars['Date']>;
};

export enum SubscriptionStatus {
  Active = 'active',
  Canceled = 'canceled',
  Incomplete = 'incomplete',
  IncompleteExpired = 'incomplete_expired',
  PastDue = 'past_due',
  Trialing = 'trialing',
  Unpaid = 'unpaid'
}

export enum SyncUpdatesFrequency {
  Daily = 'daily',
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Weekly = 'weekly',
  Yearly = 'yearly'
}

/** columns and relationships of "airtable_configs" */
export type Airtable_Configs = {
  __typename?: 'airtable_configs';
  api_key: Scalars['String'];
  base_id: Scalars['String'];
  created_at: Scalars['timestamptz'];
  /** An object relationship */
  destination: Destinations;
  destination_id: Scalars['uuid'];
  id: Scalars['uuid'];
  updated_at: Scalars['timestamptz'];
};

/** aggregated selection of "airtable_configs" */
export type Airtable_Configs_Aggregate = {
  __typename?: 'airtable_configs_aggregate';
  aggregate?: Maybe<Airtable_Configs_Aggregate_Fields>;
  nodes: Array<Airtable_Configs>;
};

/** aggregate fields of "airtable_configs" */
export type Airtable_Configs_Aggregate_Fields = {
  __typename?: 'airtable_configs_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Airtable_Configs_Max_Fields>;
  min?: Maybe<Airtable_Configs_Min_Fields>;
};


/** aggregate fields of "airtable_configs" */
export type Airtable_Configs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Airtable_Configs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "airtable_configs". All fields are combined with a logical 'AND'. */
export type Airtable_Configs_Bool_Exp = {
  _and?: InputMaybe<Array<Airtable_Configs_Bool_Exp>>;
  _not?: InputMaybe<Airtable_Configs_Bool_Exp>;
  _or?: InputMaybe<Array<Airtable_Configs_Bool_Exp>>;
  api_key?: InputMaybe<String_Comparison_Exp>;
  base_id?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  destination?: InputMaybe<Destinations_Bool_Exp>;
  destination_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "airtable_configs" */
export enum Airtable_Configs_Constraint {
  /** unique or primary key constraint on columns "id" */
  AirtableConfigsPkey = 'airtable_configs_pkey'
}

/** input type for inserting data into table "airtable_configs" */
export type Airtable_Configs_Insert_Input = {
  api_key?: InputMaybe<Scalars['String']>;
  base_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  destination?: InputMaybe<Destinations_Obj_Rel_Insert_Input>;
  destination_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Airtable_Configs_Max_Fields = {
  __typename?: 'airtable_configs_max_fields';
  api_key?: Maybe<Scalars['String']>;
  base_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  destination_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Airtable_Configs_Min_Fields = {
  __typename?: 'airtable_configs_min_fields';
  api_key?: Maybe<Scalars['String']>;
  base_id?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  destination_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "airtable_configs" */
export type Airtable_Configs_Mutation_Response = {
  __typename?: 'airtable_configs_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Airtable_Configs>;
};

/** input type for inserting object relation for remote table "airtable_configs" */
export type Airtable_Configs_Obj_Rel_Insert_Input = {
  data: Airtable_Configs_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Airtable_Configs_On_Conflict>;
};

/** on_conflict condition type for table "airtable_configs" */
export type Airtable_Configs_On_Conflict = {
  constraint: Airtable_Configs_Constraint;
  update_columns?: Array<Airtable_Configs_Update_Column>;
  where?: InputMaybe<Airtable_Configs_Bool_Exp>;
};

/** Ordering options when selecting data from "airtable_configs". */
export type Airtable_Configs_Order_By = {
  api_key?: InputMaybe<Order_By>;
  base_id?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  destination?: InputMaybe<Destinations_Order_By>;
  destination_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
};

/** primary key columns input for table: airtable_configs */
export type Airtable_Configs_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "airtable_configs" */
export enum Airtable_Configs_Select_Column {
  /** column name */
  ApiKey = 'api_key',
  /** column name */
  BaseId = 'base_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DestinationId = 'destination_id',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at'
}

/** input type for updating data in table "airtable_configs" */
export type Airtable_Configs_Set_Input = {
  api_key?: InputMaybe<Scalars['String']>;
  base_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  destination_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "airtable_configs" */
export type Airtable_Configs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Airtable_Configs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Airtable_Configs_Stream_Cursor_Value_Input = {
  api_key?: InputMaybe<Scalars['String']>;
  base_id?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  destination_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "airtable_configs" */
export enum Airtable_Configs_Update_Column {
  /** column name */
  ApiKey = 'api_key',
  /** column name */
  BaseId = 'base_id',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DestinationId = 'destination_id',
  /** column name */
  Id = 'id',
  /** column name */
  UpdatedAt = 'updated_at'
}

export type Airtable_Configs_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Airtable_Configs_Set_Input>;
  where: Airtable_Configs_Bool_Exp;
};

/** Oauth requests, inserted before redirecting to the provider's site. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthProviderRequests = {
  __typename?: 'authProviderRequests';
  id: Scalars['uuid'];
  options?: Maybe<Scalars['jsonb']>;
};


/** Oauth requests, inserted before redirecting to the provider's site. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthProviderRequestsOptionsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "auth.provider_requests" */
export type AuthProviderRequests_Aggregate = {
  __typename?: 'authProviderRequests_aggregate';
  aggregate?: Maybe<AuthProviderRequests_Aggregate_Fields>;
  nodes: Array<AuthProviderRequests>;
};

/** aggregate fields of "auth.provider_requests" */
export type AuthProviderRequests_Aggregate_Fields = {
  __typename?: 'authProviderRequests_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<AuthProviderRequests_Max_Fields>;
  min?: Maybe<AuthProviderRequests_Min_Fields>;
};


/** aggregate fields of "auth.provider_requests" */
export type AuthProviderRequests_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthProviderRequests_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type AuthProviderRequests_Append_Input = {
  options?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "auth.provider_requests". All fields are combined with a logical 'AND'. */
export type AuthProviderRequests_Bool_Exp = {
  _and?: InputMaybe<Array<AuthProviderRequests_Bool_Exp>>;
  _not?: InputMaybe<AuthProviderRequests_Bool_Exp>;
  _or?: InputMaybe<Array<AuthProviderRequests_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  options?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.provider_requests" */
export enum AuthProviderRequests_Constraint {
  /** unique or primary key constraint on columns "id" */
  ProviderRequestsPkey = 'provider_requests_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type AuthProviderRequests_Delete_At_Path_Input = {
  options?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type AuthProviderRequests_Delete_Elem_Input = {
  options?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type AuthProviderRequests_Delete_Key_Input = {
  options?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "auth.provider_requests" */
export type AuthProviderRequests_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  options?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate max on columns */
export type AuthProviderRequests_Max_Fields = {
  __typename?: 'authProviderRequests_max_fields';
  id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type AuthProviderRequests_Min_Fields = {
  __typename?: 'authProviderRequests_min_fields';
  id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "auth.provider_requests" */
export type AuthProviderRequests_Mutation_Response = {
  __typename?: 'authProviderRequests_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthProviderRequests>;
};

/** on_conflict condition type for table "auth.provider_requests" */
export type AuthProviderRequests_On_Conflict = {
  constraint: AuthProviderRequests_Constraint;
  update_columns?: Array<AuthProviderRequests_Update_Column>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.provider_requests". */
export type AuthProviderRequests_Order_By = {
  id?: InputMaybe<Order_By>;
  options?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth.provider_requests */
export type AuthProviderRequests_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type AuthProviderRequests_Prepend_Input = {
  options?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "auth.provider_requests" */
export enum AuthProviderRequests_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Options = 'options'
}

/** input type for updating data in table "auth.provider_requests" */
export type AuthProviderRequests_Set_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  options?: InputMaybe<Scalars['jsonb']>;
};

/** Streaming cursor of the table "authProviderRequests" */
export type AuthProviderRequests_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AuthProviderRequests_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthProviderRequests_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  options?: InputMaybe<Scalars['jsonb']>;
};

/** update columns of table "auth.provider_requests" */
export enum AuthProviderRequests_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Options = 'options'
}

export type AuthProviderRequests_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<AuthProviderRequests_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<AuthProviderRequests_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<AuthProviderRequests_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<AuthProviderRequests_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<AuthProviderRequests_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthProviderRequests_Set_Input>;
  where: AuthProviderRequests_Bool_Exp;
};

/** List of available Oauth providers. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthProviders = {
  __typename?: 'authProviders';
  id: Scalars['String'];
  /** An array relationship */
  userProviders: Array<AuthUserProviders>;
  /** An aggregate relationship */
  userProviders_aggregate: AuthUserProviders_Aggregate;
};


/** List of available Oauth providers. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthProvidersUserProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


/** List of available Oauth providers. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthProvidersUserProviders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};

/** aggregated selection of "auth.providers" */
export type AuthProviders_Aggregate = {
  __typename?: 'authProviders_aggregate';
  aggregate?: Maybe<AuthProviders_Aggregate_Fields>;
  nodes: Array<AuthProviders>;
};

/** aggregate fields of "auth.providers" */
export type AuthProviders_Aggregate_Fields = {
  __typename?: 'authProviders_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<AuthProviders_Max_Fields>;
  min?: Maybe<AuthProviders_Min_Fields>;
};


/** aggregate fields of "auth.providers" */
export type AuthProviders_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthProviders_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "auth.providers". All fields are combined with a logical 'AND'. */
export type AuthProviders_Bool_Exp = {
  _and?: InputMaybe<Array<AuthProviders_Bool_Exp>>;
  _not?: InputMaybe<AuthProviders_Bool_Exp>;
  _or?: InputMaybe<Array<AuthProviders_Bool_Exp>>;
  id?: InputMaybe<String_Comparison_Exp>;
  userProviders?: InputMaybe<AuthUserProviders_Bool_Exp>;
  userProviders_aggregate?: InputMaybe<AuthUserProviders_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "auth.providers" */
export enum AuthProviders_Constraint {
  /** unique or primary key constraint on columns "id" */
  ProvidersPkey = 'providers_pkey'
}

/** input type for inserting data into table "auth.providers" */
export type AuthProviders_Insert_Input = {
  id?: InputMaybe<Scalars['String']>;
  userProviders?: InputMaybe<AuthUserProviders_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type AuthProviders_Max_Fields = {
  __typename?: 'authProviders_max_fields';
  id?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type AuthProviders_Min_Fields = {
  __typename?: 'authProviders_min_fields';
  id?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "auth.providers" */
export type AuthProviders_Mutation_Response = {
  __typename?: 'authProviders_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthProviders>;
};

/** input type for inserting object relation for remote table "auth.providers" */
export type AuthProviders_Obj_Rel_Insert_Input = {
  data: AuthProviders_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthProviders_On_Conflict>;
};

/** on_conflict condition type for table "auth.providers" */
export type AuthProviders_On_Conflict = {
  constraint: AuthProviders_Constraint;
  update_columns?: Array<AuthProviders_Update_Column>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.providers". */
export type AuthProviders_Order_By = {
  id?: InputMaybe<Order_By>;
  userProviders_aggregate?: InputMaybe<AuthUserProviders_Aggregate_Order_By>;
};

/** primary key columns input for table: auth.providers */
export type AuthProviders_Pk_Columns_Input = {
  id: Scalars['String'];
};

/** select columns of table "auth.providers" */
export enum AuthProviders_Select_Column {
  /** column name */
  Id = 'id'
}

/** input type for updating data in table "auth.providers" */
export type AuthProviders_Set_Input = {
  id?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "authProviders" */
export type AuthProviders_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AuthProviders_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthProviders_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['String']>;
};

/** update columns of table "auth.providers" */
export enum AuthProviders_Update_Column {
  /** column name */
  Id = 'id'
}

export type AuthProviders_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthProviders_Set_Input>;
  where: AuthProviders_Bool_Exp;
};

/** User refresh tokens. Hasura auth uses them to rotate new access tokens as long as the refresh token is not expired. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthRefreshTokens = {
  __typename?: 'authRefreshTokens';
  createdAt: Scalars['timestamptz'];
  expiresAt: Scalars['timestamptz'];
  refreshToken: Scalars['uuid'];
  /** An object relationship */
  user: Users;
  userId: Scalars['uuid'];
};

/** aggregated selection of "auth.refresh_tokens" */
export type AuthRefreshTokens_Aggregate = {
  __typename?: 'authRefreshTokens_aggregate';
  aggregate?: Maybe<AuthRefreshTokens_Aggregate_Fields>;
  nodes: Array<AuthRefreshTokens>;
};

export type AuthRefreshTokens_Aggregate_Bool_Exp = {
  count?: InputMaybe<AuthRefreshTokens_Aggregate_Bool_Exp_Count>;
};

export type AuthRefreshTokens_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "auth.refresh_tokens" */
export type AuthRefreshTokens_Aggregate_Fields = {
  __typename?: 'authRefreshTokens_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<AuthRefreshTokens_Max_Fields>;
  min?: Maybe<AuthRefreshTokens_Min_Fields>;
};


/** aggregate fields of "auth.refresh_tokens" */
export type AuthRefreshTokens_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "auth.refresh_tokens" */
export type AuthRefreshTokens_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<AuthRefreshTokens_Max_Order_By>;
  min?: InputMaybe<AuthRefreshTokens_Min_Order_By>;
};

/** input type for inserting array relation for remote table "auth.refresh_tokens" */
export type AuthRefreshTokens_Arr_Rel_Insert_Input = {
  data: Array<AuthRefreshTokens_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthRefreshTokens_On_Conflict>;
};

/** Boolean expression to filter rows from the table "auth.refresh_tokens". All fields are combined with a logical 'AND'. */
export type AuthRefreshTokens_Bool_Exp = {
  _and?: InputMaybe<Array<AuthRefreshTokens_Bool_Exp>>;
  _not?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
  _or?: InputMaybe<Array<AuthRefreshTokens_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  expiresAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  refreshToken?: InputMaybe<Uuid_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.refresh_tokens" */
export enum AuthRefreshTokens_Constraint {
  /** unique or primary key constraint on columns "refresh_token" */
  RefreshTokensPkey = 'refresh_tokens_pkey'
}

/** input type for inserting data into table "auth.refresh_tokens" */
export type AuthRefreshTokens_Insert_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']>;
  refreshToken?: InputMaybe<Scalars['uuid']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type AuthRefreshTokens_Max_Fields = {
  __typename?: 'authRefreshTokens_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  expiresAt?: Maybe<Scalars['timestamptz']>;
  refreshToken?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "auth.refresh_tokens" */
export type AuthRefreshTokens_Max_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  expiresAt?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type AuthRefreshTokens_Min_Fields = {
  __typename?: 'authRefreshTokens_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  expiresAt?: Maybe<Scalars['timestamptz']>;
  refreshToken?: Maybe<Scalars['uuid']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "auth.refresh_tokens" */
export type AuthRefreshTokens_Min_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  expiresAt?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.refresh_tokens" */
export type AuthRefreshTokens_Mutation_Response = {
  __typename?: 'authRefreshTokens_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthRefreshTokens>;
};

/** on_conflict condition type for table "auth.refresh_tokens" */
export type AuthRefreshTokens_On_Conflict = {
  constraint: AuthRefreshTokens_Constraint;
  update_columns?: Array<AuthRefreshTokens_Update_Column>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.refresh_tokens". */
export type AuthRefreshTokens_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  expiresAt?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth.refresh_tokens */
export type AuthRefreshTokens_Pk_Columns_Input = {
  refreshToken: Scalars['uuid'];
};

/** select columns of table "auth.refresh_tokens" */
export enum AuthRefreshTokens_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  ExpiresAt = 'expiresAt',
  /** column name */
  RefreshToken = 'refreshToken',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "auth.refresh_tokens" */
export type AuthRefreshTokens_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']>;
  refreshToken?: InputMaybe<Scalars['uuid']>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "authRefreshTokens" */
export type AuthRefreshTokens_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AuthRefreshTokens_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthRefreshTokens_Stream_Cursor_Value_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  expiresAt?: InputMaybe<Scalars['timestamptz']>;
  refreshToken?: InputMaybe<Scalars['uuid']>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "auth.refresh_tokens" */
export enum AuthRefreshTokens_Update_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  ExpiresAt = 'expiresAt',
  /** column name */
  RefreshToken = 'refreshToken',
  /** column name */
  UserId = 'userId'
}

export type AuthRefreshTokens_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthRefreshTokens_Set_Input>;
  where: AuthRefreshTokens_Bool_Exp;
};

/** Persistent Hasura roles for users. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthRoles = {
  __typename?: 'authRoles';
  role: Scalars['String'];
  /** An array relationship */
  userRoles: Array<AuthUserRoles>;
  /** An aggregate relationship */
  userRoles_aggregate: AuthUserRoles_Aggregate;
  /** An array relationship */
  usersByDefaultRole: Array<Users>;
  /** An aggregate relationship */
  usersByDefaultRole_aggregate: Users_Aggregate;
};


/** Persistent Hasura roles for users. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthRolesUserRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


/** Persistent Hasura roles for users. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthRolesUserRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


/** Persistent Hasura roles for users. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthRolesUsersByDefaultRoleArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


/** Persistent Hasura roles for users. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthRolesUsersByDefaultRole_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** aggregated selection of "auth.roles" */
export type AuthRoles_Aggregate = {
  __typename?: 'authRoles_aggregate';
  aggregate?: Maybe<AuthRoles_Aggregate_Fields>;
  nodes: Array<AuthRoles>;
};

/** aggregate fields of "auth.roles" */
export type AuthRoles_Aggregate_Fields = {
  __typename?: 'authRoles_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<AuthRoles_Max_Fields>;
  min?: Maybe<AuthRoles_Min_Fields>;
};


/** aggregate fields of "auth.roles" */
export type AuthRoles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthRoles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "auth.roles". All fields are combined with a logical 'AND'. */
export type AuthRoles_Bool_Exp = {
  _and?: InputMaybe<Array<AuthRoles_Bool_Exp>>;
  _not?: InputMaybe<AuthRoles_Bool_Exp>;
  _or?: InputMaybe<Array<AuthRoles_Bool_Exp>>;
  role?: InputMaybe<String_Comparison_Exp>;
  userRoles?: InputMaybe<AuthUserRoles_Bool_Exp>;
  userRoles_aggregate?: InputMaybe<AuthUserRoles_Aggregate_Bool_Exp>;
  usersByDefaultRole?: InputMaybe<Users_Bool_Exp>;
  usersByDefaultRole_aggregate?: InputMaybe<Users_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "auth.roles" */
export enum AuthRoles_Constraint {
  /** unique or primary key constraint on columns "role" */
  RolesPkey = 'roles_pkey'
}

/** input type for inserting data into table "auth.roles" */
export type AuthRoles_Insert_Input = {
  role?: InputMaybe<Scalars['String']>;
  userRoles?: InputMaybe<AuthUserRoles_Arr_Rel_Insert_Input>;
  usersByDefaultRole?: InputMaybe<Users_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type AuthRoles_Max_Fields = {
  __typename?: 'authRoles_max_fields';
  role?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type AuthRoles_Min_Fields = {
  __typename?: 'authRoles_min_fields';
  role?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "auth.roles" */
export type AuthRoles_Mutation_Response = {
  __typename?: 'authRoles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthRoles>;
};

/** input type for inserting object relation for remote table "auth.roles" */
export type AuthRoles_Obj_Rel_Insert_Input = {
  data: AuthRoles_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthRoles_On_Conflict>;
};

/** on_conflict condition type for table "auth.roles" */
export type AuthRoles_On_Conflict = {
  constraint: AuthRoles_Constraint;
  update_columns?: Array<AuthRoles_Update_Column>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.roles". */
export type AuthRoles_Order_By = {
  role?: InputMaybe<Order_By>;
  userRoles_aggregate?: InputMaybe<AuthUserRoles_Aggregate_Order_By>;
  usersByDefaultRole_aggregate?: InputMaybe<Users_Aggregate_Order_By>;
};

/** primary key columns input for table: auth.roles */
export type AuthRoles_Pk_Columns_Input = {
  role: Scalars['String'];
};

/** select columns of table "auth.roles" */
export enum AuthRoles_Select_Column {
  /** column name */
  Role = 'role'
}

/** input type for updating data in table "auth.roles" */
export type AuthRoles_Set_Input = {
  role?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "authRoles" */
export type AuthRoles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AuthRoles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthRoles_Stream_Cursor_Value_Input = {
  role?: InputMaybe<Scalars['String']>;
};

/** update columns of table "auth.roles" */
export enum AuthRoles_Update_Column {
  /** column name */
  Role = 'role'
}

export type AuthRoles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthRoles_Set_Input>;
  where: AuthRoles_Bool_Exp;
};

/** Active providers for a given user. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthUserProviders = {
  __typename?: 'authUserProviders';
  accessToken: Scalars['String'];
  createdAt: Scalars['timestamptz'];
  id: Scalars['uuid'];
  /** An object relationship */
  provider: AuthProviders;
  providerId: Scalars['String'];
  providerUserId: Scalars['String'];
  refreshToken?: Maybe<Scalars['String']>;
  updatedAt: Scalars['timestamptz'];
  /** An object relationship */
  user: Users;
  userId: Scalars['uuid'];
};

/** aggregated selection of "auth.user_providers" */
export type AuthUserProviders_Aggregate = {
  __typename?: 'authUserProviders_aggregate';
  aggregate?: Maybe<AuthUserProviders_Aggregate_Fields>;
  nodes: Array<AuthUserProviders>;
};

export type AuthUserProviders_Aggregate_Bool_Exp = {
  count?: InputMaybe<AuthUserProviders_Aggregate_Bool_Exp_Count>;
};

export type AuthUserProviders_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<AuthUserProviders_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "auth.user_providers" */
export type AuthUserProviders_Aggregate_Fields = {
  __typename?: 'authUserProviders_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<AuthUserProviders_Max_Fields>;
  min?: Maybe<AuthUserProviders_Min_Fields>;
};


/** aggregate fields of "auth.user_providers" */
export type AuthUserProviders_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "auth.user_providers" */
export type AuthUserProviders_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<AuthUserProviders_Max_Order_By>;
  min?: InputMaybe<AuthUserProviders_Min_Order_By>;
};

/** input type for inserting array relation for remote table "auth.user_providers" */
export type AuthUserProviders_Arr_Rel_Insert_Input = {
  data: Array<AuthUserProviders_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthUserProviders_On_Conflict>;
};

/** Boolean expression to filter rows from the table "auth.user_providers". All fields are combined with a logical 'AND'. */
export type AuthUserProviders_Bool_Exp = {
  _and?: InputMaybe<Array<AuthUserProviders_Bool_Exp>>;
  _not?: InputMaybe<AuthUserProviders_Bool_Exp>;
  _or?: InputMaybe<Array<AuthUserProviders_Bool_Exp>>;
  accessToken?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  provider?: InputMaybe<AuthProviders_Bool_Exp>;
  providerId?: InputMaybe<String_Comparison_Exp>;
  providerUserId?: InputMaybe<String_Comparison_Exp>;
  refreshToken?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.user_providers" */
export enum AuthUserProviders_Constraint {
  /** unique or primary key constraint on columns "id" */
  UserProvidersPkey = 'user_providers_pkey',
  /** unique or primary key constraint on columns "provider_id", "provider_user_id" */
  UserProvidersProviderIdProviderUserIdKey = 'user_providers_provider_id_provider_user_id_key',
  /** unique or primary key constraint on columns "provider_id", "user_id" */
  UserProvidersUserIdProviderIdKey = 'user_providers_user_id_provider_id_key'
}

/** input type for inserting data into table "auth.user_providers" */
export type AuthUserProviders_Insert_Input = {
  accessToken?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  provider?: InputMaybe<AuthProviders_Obj_Rel_Insert_Input>;
  providerId?: InputMaybe<Scalars['String']>;
  providerUserId?: InputMaybe<Scalars['String']>;
  refreshToken?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type AuthUserProviders_Max_Fields = {
  __typename?: 'authUserProviders_max_fields';
  accessToken?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  providerId?: Maybe<Scalars['String']>;
  providerUserId?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "auth.user_providers" */
export type AuthUserProviders_Max_Order_By = {
  accessToken?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  providerId?: InputMaybe<Order_By>;
  providerUserId?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type AuthUserProviders_Min_Fields = {
  __typename?: 'authUserProviders_min_fields';
  accessToken?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  providerId?: Maybe<Scalars['String']>;
  providerUserId?: Maybe<Scalars['String']>;
  refreshToken?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "auth.user_providers" */
export type AuthUserProviders_Min_Order_By = {
  accessToken?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  providerId?: InputMaybe<Order_By>;
  providerUserId?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.user_providers" */
export type AuthUserProviders_Mutation_Response = {
  __typename?: 'authUserProviders_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthUserProviders>;
};

/** on_conflict condition type for table "auth.user_providers" */
export type AuthUserProviders_On_Conflict = {
  constraint: AuthUserProviders_Constraint;
  update_columns?: Array<AuthUserProviders_Update_Column>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.user_providers". */
export type AuthUserProviders_Order_By = {
  accessToken?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  provider?: InputMaybe<AuthProviders_Order_By>;
  providerId?: InputMaybe<Order_By>;
  providerUserId?: InputMaybe<Order_By>;
  refreshToken?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth.user_providers */
export type AuthUserProviders_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "auth.user_providers" */
export enum AuthUserProviders_Select_Column {
  /** column name */
  AccessToken = 'accessToken',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  ProviderId = 'providerId',
  /** column name */
  ProviderUserId = 'providerUserId',
  /** column name */
  RefreshToken = 'refreshToken',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "auth.user_providers" */
export type AuthUserProviders_Set_Input = {
  accessToken?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  providerId?: InputMaybe<Scalars['String']>;
  providerUserId?: InputMaybe<Scalars['String']>;
  refreshToken?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "authUserProviders" */
export type AuthUserProviders_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AuthUserProviders_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthUserProviders_Stream_Cursor_Value_Input = {
  accessToken?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  providerId?: InputMaybe<Scalars['String']>;
  providerUserId?: InputMaybe<Scalars['String']>;
  refreshToken?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "auth.user_providers" */
export enum AuthUserProviders_Update_Column {
  /** column name */
  AccessToken = 'accessToken',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  ProviderId = 'providerId',
  /** column name */
  ProviderUserId = 'providerUserId',
  /** column name */
  RefreshToken = 'refreshToken',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UserId = 'userId'
}

export type AuthUserProviders_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthUserProviders_Set_Input>;
  where: AuthUserProviders_Bool_Exp;
};

/** Roles of users. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthUserRoles = {
  __typename?: 'authUserRoles';
  createdAt: Scalars['timestamptz'];
  id: Scalars['uuid'];
  role: Scalars['String'];
  /** An object relationship */
  roleByRole: AuthRoles;
  /** An object relationship */
  user: Users;
  userId: Scalars['uuid'];
};

/** aggregated selection of "auth.user_roles" */
export type AuthUserRoles_Aggregate = {
  __typename?: 'authUserRoles_aggregate';
  aggregate?: Maybe<AuthUserRoles_Aggregate_Fields>;
  nodes: Array<AuthUserRoles>;
};

export type AuthUserRoles_Aggregate_Bool_Exp = {
  count?: InputMaybe<AuthUserRoles_Aggregate_Bool_Exp_Count>;
};

export type AuthUserRoles_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<AuthUserRoles_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "auth.user_roles" */
export type AuthUserRoles_Aggregate_Fields = {
  __typename?: 'authUserRoles_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<AuthUserRoles_Max_Fields>;
  min?: Maybe<AuthUserRoles_Min_Fields>;
};


/** aggregate fields of "auth.user_roles" */
export type AuthUserRoles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "auth.user_roles" */
export type AuthUserRoles_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<AuthUserRoles_Max_Order_By>;
  min?: InputMaybe<AuthUserRoles_Min_Order_By>;
};

/** input type for inserting array relation for remote table "auth.user_roles" */
export type AuthUserRoles_Arr_Rel_Insert_Input = {
  data: Array<AuthUserRoles_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthUserRoles_On_Conflict>;
};

/** Boolean expression to filter rows from the table "auth.user_roles". All fields are combined with a logical 'AND'. */
export type AuthUserRoles_Bool_Exp = {
  _and?: InputMaybe<Array<AuthUserRoles_Bool_Exp>>;
  _not?: InputMaybe<AuthUserRoles_Bool_Exp>;
  _or?: InputMaybe<Array<AuthUserRoles_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  role?: InputMaybe<String_Comparison_Exp>;
  roleByRole?: InputMaybe<AuthRoles_Bool_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.user_roles" */
export enum AuthUserRoles_Constraint {
  /** unique or primary key constraint on columns "id" */
  UserRolesPkey = 'user_roles_pkey',
  /** unique or primary key constraint on columns "user_id", "role" */
  UserRolesUserIdRoleKey = 'user_roles_user_id_role_key'
}

/** input type for inserting data into table "auth.user_roles" */
export type AuthUserRoles_Insert_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  role?: InputMaybe<Scalars['String']>;
  roleByRole?: InputMaybe<AuthRoles_Obj_Rel_Insert_Input>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type AuthUserRoles_Max_Fields = {
  __typename?: 'authUserRoles_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  role?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "auth.user_roles" */
export type AuthUserRoles_Max_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type AuthUserRoles_Min_Fields = {
  __typename?: 'authUserRoles_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  role?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "auth.user_roles" */
export type AuthUserRoles_Min_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.user_roles" */
export type AuthUserRoles_Mutation_Response = {
  __typename?: 'authUserRoles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthUserRoles>;
};

/** on_conflict condition type for table "auth.user_roles" */
export type AuthUserRoles_On_Conflict = {
  constraint: AuthUserRoles_Constraint;
  update_columns?: Array<AuthUserRoles_Update_Column>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.user_roles". */
export type AuthUserRoles_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  role?: InputMaybe<Order_By>;
  roleByRole?: InputMaybe<AuthRoles_Order_By>;
  user?: InputMaybe<Users_Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth.user_roles */
export type AuthUserRoles_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "auth.user_roles" */
export enum AuthUserRoles_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "auth.user_roles" */
export type AuthUserRoles_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  role?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "authUserRoles" */
export type AuthUserRoles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AuthUserRoles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthUserRoles_Stream_Cursor_Value_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  role?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "auth.user_roles" */
export enum AuthUserRoles_Update_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Id = 'id',
  /** column name */
  Role = 'role',
  /** column name */
  UserId = 'userId'
}

export type AuthUserRoles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthUserRoles_Set_Input>;
  where: AuthUserRoles_Bool_Exp;
};

/** User webauthn security keys. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type AuthUserSecurityKeys = {
  __typename?: 'authUserSecurityKeys';
  counter: Scalars['bigint'];
  credentialId: Scalars['String'];
  credentialPublicKey?: Maybe<Scalars['bytea']>;
  id: Scalars['uuid'];
  nickname?: Maybe<Scalars['String']>;
  transports: Scalars['String'];
  /** An object relationship */
  user: Users;
  userId: Scalars['uuid'];
};

/** aggregated selection of "auth.user_security_keys" */
export type AuthUserSecurityKeys_Aggregate = {
  __typename?: 'authUserSecurityKeys_aggregate';
  aggregate?: Maybe<AuthUserSecurityKeys_Aggregate_Fields>;
  nodes: Array<AuthUserSecurityKeys>;
};

export type AuthUserSecurityKeys_Aggregate_Bool_Exp = {
  count?: InputMaybe<AuthUserSecurityKeys_Aggregate_Bool_Exp_Count>;
};

export type AuthUserSecurityKeys_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<AuthUserSecurityKeys_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "auth.user_security_keys" */
export type AuthUserSecurityKeys_Aggregate_Fields = {
  __typename?: 'authUserSecurityKeys_aggregate_fields';
  avg?: Maybe<AuthUserSecurityKeys_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<AuthUserSecurityKeys_Max_Fields>;
  min?: Maybe<AuthUserSecurityKeys_Min_Fields>;
  stddev?: Maybe<AuthUserSecurityKeys_Stddev_Fields>;
  stddev_pop?: Maybe<AuthUserSecurityKeys_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<AuthUserSecurityKeys_Stddev_Samp_Fields>;
  sum?: Maybe<AuthUserSecurityKeys_Sum_Fields>;
  var_pop?: Maybe<AuthUserSecurityKeys_Var_Pop_Fields>;
  var_samp?: Maybe<AuthUserSecurityKeys_Var_Samp_Fields>;
  variance?: Maybe<AuthUserSecurityKeys_Variance_Fields>;
};


/** aggregate fields of "auth.user_security_keys" */
export type AuthUserSecurityKeys_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<AuthUserSecurityKeys_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Aggregate_Order_By = {
  avg?: InputMaybe<AuthUserSecurityKeys_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<AuthUserSecurityKeys_Max_Order_By>;
  min?: InputMaybe<AuthUserSecurityKeys_Min_Order_By>;
  stddev?: InputMaybe<AuthUserSecurityKeys_Stddev_Order_By>;
  stddev_pop?: InputMaybe<AuthUserSecurityKeys_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<AuthUserSecurityKeys_Stddev_Samp_Order_By>;
  sum?: InputMaybe<AuthUserSecurityKeys_Sum_Order_By>;
  var_pop?: InputMaybe<AuthUserSecurityKeys_Var_Pop_Order_By>;
  var_samp?: InputMaybe<AuthUserSecurityKeys_Var_Samp_Order_By>;
  variance?: InputMaybe<AuthUserSecurityKeys_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Arr_Rel_Insert_Input = {
  data: Array<AuthUserSecurityKeys_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<AuthUserSecurityKeys_On_Conflict>;
};

/** aggregate avg on columns */
export type AuthUserSecurityKeys_Avg_Fields = {
  __typename?: 'authUserSecurityKeys_avg_fields';
  counter?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Avg_Order_By = {
  counter?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "auth.user_security_keys". All fields are combined with a logical 'AND'. */
export type AuthUserSecurityKeys_Bool_Exp = {
  _and?: InputMaybe<Array<AuthUserSecurityKeys_Bool_Exp>>;
  _not?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
  _or?: InputMaybe<Array<AuthUserSecurityKeys_Bool_Exp>>;
  counter?: InputMaybe<Bigint_Comparison_Exp>;
  credentialId?: InputMaybe<String_Comparison_Exp>;
  credentialPublicKey?: InputMaybe<Bytea_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  nickname?: InputMaybe<String_Comparison_Exp>;
  transports?: InputMaybe<String_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "auth.user_security_keys" */
export enum AuthUserSecurityKeys_Constraint {
  /** unique or primary key constraint on columns "credential_id" */
  UserSecurityKeyCredentialIdKey = 'user_security_key_credential_id_key',
  /** unique or primary key constraint on columns "id" */
  UserSecurityKeysPkey = 'user_security_keys_pkey'
}

/** input type for incrementing numeric columns in table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Inc_Input = {
  counter?: InputMaybe<Scalars['bigint']>;
};

/** input type for inserting data into table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Insert_Input = {
  counter?: InputMaybe<Scalars['bigint']>;
  credentialId?: InputMaybe<Scalars['String']>;
  credentialPublicKey?: InputMaybe<Scalars['bytea']>;
  id?: InputMaybe<Scalars['uuid']>;
  nickname?: InputMaybe<Scalars['String']>;
  transports?: InputMaybe<Scalars['String']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type AuthUserSecurityKeys_Max_Fields = {
  __typename?: 'authUserSecurityKeys_max_fields';
  counter?: Maybe<Scalars['bigint']>;
  credentialId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  nickname?: Maybe<Scalars['String']>;
  transports?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Max_Order_By = {
  counter?: InputMaybe<Order_By>;
  credentialId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  nickname?: InputMaybe<Order_By>;
  transports?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type AuthUserSecurityKeys_Min_Fields = {
  __typename?: 'authUserSecurityKeys_min_fields';
  counter?: Maybe<Scalars['bigint']>;
  credentialId?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  nickname?: Maybe<Scalars['String']>;
  transports?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Min_Order_By = {
  counter?: InputMaybe<Order_By>;
  credentialId?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  nickname?: InputMaybe<Order_By>;
  transports?: InputMaybe<Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Mutation_Response = {
  __typename?: 'authUserSecurityKeys_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<AuthUserSecurityKeys>;
};

/** on_conflict condition type for table "auth.user_security_keys" */
export type AuthUserSecurityKeys_On_Conflict = {
  constraint: AuthUserSecurityKeys_Constraint;
  update_columns?: Array<AuthUserSecurityKeys_Update_Column>;
  where?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.user_security_keys". */
export type AuthUserSecurityKeys_Order_By = {
  counter?: InputMaybe<Order_By>;
  credentialId?: InputMaybe<Order_By>;
  credentialPublicKey?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  nickname?: InputMaybe<Order_By>;
  transports?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: auth.user_security_keys */
export type AuthUserSecurityKeys_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "auth.user_security_keys" */
export enum AuthUserSecurityKeys_Select_Column {
  /** column name */
  Counter = 'counter',
  /** column name */
  CredentialId = 'credentialId',
  /** column name */
  CredentialPublicKey = 'credentialPublicKey',
  /** column name */
  Id = 'id',
  /** column name */
  Nickname = 'nickname',
  /** column name */
  Transports = 'transports',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Set_Input = {
  counter?: InputMaybe<Scalars['bigint']>;
  credentialId?: InputMaybe<Scalars['String']>;
  credentialPublicKey?: InputMaybe<Scalars['bytea']>;
  id?: InputMaybe<Scalars['uuid']>;
  nickname?: InputMaybe<Scalars['String']>;
  transports?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate stddev on columns */
export type AuthUserSecurityKeys_Stddev_Fields = {
  __typename?: 'authUserSecurityKeys_stddev_fields';
  counter?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Stddev_Order_By = {
  counter?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type AuthUserSecurityKeys_Stddev_Pop_Fields = {
  __typename?: 'authUserSecurityKeys_stddev_pop_fields';
  counter?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Stddev_Pop_Order_By = {
  counter?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type AuthUserSecurityKeys_Stddev_Samp_Fields = {
  __typename?: 'authUserSecurityKeys_stddev_samp_fields';
  counter?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Stddev_Samp_Order_By = {
  counter?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "authUserSecurityKeys" */
export type AuthUserSecurityKeys_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: AuthUserSecurityKeys_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type AuthUserSecurityKeys_Stream_Cursor_Value_Input = {
  counter?: InputMaybe<Scalars['bigint']>;
  credentialId?: InputMaybe<Scalars['String']>;
  credentialPublicKey?: InputMaybe<Scalars['bytea']>;
  id?: InputMaybe<Scalars['uuid']>;
  nickname?: InputMaybe<Scalars['String']>;
  transports?: InputMaybe<Scalars['String']>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate sum on columns */
export type AuthUserSecurityKeys_Sum_Fields = {
  __typename?: 'authUserSecurityKeys_sum_fields';
  counter?: Maybe<Scalars['bigint']>;
};

/** order by sum() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Sum_Order_By = {
  counter?: InputMaybe<Order_By>;
};

/** update columns of table "auth.user_security_keys" */
export enum AuthUserSecurityKeys_Update_Column {
  /** column name */
  Counter = 'counter',
  /** column name */
  CredentialId = 'credentialId',
  /** column name */
  CredentialPublicKey = 'credentialPublicKey',
  /** column name */
  Id = 'id',
  /** column name */
  Nickname = 'nickname',
  /** column name */
  Transports = 'transports',
  /** column name */
  UserId = 'userId'
}

export type AuthUserSecurityKeys_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<AuthUserSecurityKeys_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<AuthUserSecurityKeys_Set_Input>;
  where: AuthUserSecurityKeys_Bool_Exp;
};

/** aggregate var_pop on columns */
export type AuthUserSecurityKeys_Var_Pop_Fields = {
  __typename?: 'authUserSecurityKeys_var_pop_fields';
  counter?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Var_Pop_Order_By = {
  counter?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type AuthUserSecurityKeys_Var_Samp_Fields = {
  __typename?: 'authUserSecurityKeys_var_samp_fields';
  counter?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Var_Samp_Order_By = {
  counter?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type AuthUserSecurityKeys_Variance_Fields = {
  __typename?: 'authUserSecurityKeys_variance_fields';
  counter?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "auth.user_security_keys" */
export type AuthUserSecurityKeys_Variance_Order_By = {
  counter?: InputMaybe<Order_By>;
};

/** Boolean expression to compare columns of type "bigint". All fields are combined with logical 'AND'. */
export type Bigint_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bigint']>;
  _gt?: InputMaybe<Scalars['bigint']>;
  _gte?: InputMaybe<Scalars['bigint']>;
  _in?: InputMaybe<Array<Scalars['bigint']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['bigint']>;
  _lte?: InputMaybe<Scalars['bigint']>;
  _neq?: InputMaybe<Scalars['bigint']>;
  _nin?: InputMaybe<Array<Scalars['bigint']>>;
};

/** columns and relationships of "storage.buckets" */
export type Buckets = {
  __typename?: 'buckets';
  cacheControl?: Maybe<Scalars['String']>;
  createdAt: Scalars['timestamptz'];
  downloadExpiration: Scalars['Int'];
  /** An array relationship */
  files: Array<Files>;
  /** An aggregate relationship */
  files_aggregate: Files_Aggregate;
  id: Scalars['String'];
  maxUploadFileSize: Scalars['Int'];
  minUploadFileSize: Scalars['Int'];
  presignedUrlsEnabled: Scalars['Boolean'];
  updatedAt: Scalars['timestamptz'];
};


/** columns and relationships of "storage.buckets" */
export type BucketsFilesArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};


/** columns and relationships of "storage.buckets" */
export type BucketsFiles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};

/** aggregated selection of "storage.buckets" */
export type Buckets_Aggregate = {
  __typename?: 'buckets_aggregate';
  aggregate?: Maybe<Buckets_Aggregate_Fields>;
  nodes: Array<Buckets>;
};

/** aggregate fields of "storage.buckets" */
export type Buckets_Aggregate_Fields = {
  __typename?: 'buckets_aggregate_fields';
  avg?: Maybe<Buckets_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Buckets_Max_Fields>;
  min?: Maybe<Buckets_Min_Fields>;
  stddev?: Maybe<Buckets_Stddev_Fields>;
  stddev_pop?: Maybe<Buckets_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Buckets_Stddev_Samp_Fields>;
  sum?: Maybe<Buckets_Sum_Fields>;
  var_pop?: Maybe<Buckets_Var_Pop_Fields>;
  var_samp?: Maybe<Buckets_Var_Samp_Fields>;
  variance?: Maybe<Buckets_Variance_Fields>;
};


/** aggregate fields of "storage.buckets" */
export type Buckets_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Buckets_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate avg on columns */
export type Buckets_Avg_Fields = {
  __typename?: 'buckets_avg_fields';
  downloadExpiration?: Maybe<Scalars['Float']>;
  maxUploadFileSize?: Maybe<Scalars['Float']>;
  minUploadFileSize?: Maybe<Scalars['Float']>;
};

/** Boolean expression to filter rows from the table "storage.buckets". All fields are combined with a logical 'AND'. */
export type Buckets_Bool_Exp = {
  _and?: InputMaybe<Array<Buckets_Bool_Exp>>;
  _not?: InputMaybe<Buckets_Bool_Exp>;
  _or?: InputMaybe<Array<Buckets_Bool_Exp>>;
  cacheControl?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  downloadExpiration?: InputMaybe<Int_Comparison_Exp>;
  files?: InputMaybe<Files_Bool_Exp>;
  files_aggregate?: InputMaybe<Files_Aggregate_Bool_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  maxUploadFileSize?: InputMaybe<Int_Comparison_Exp>;
  minUploadFileSize?: InputMaybe<Int_Comparison_Exp>;
  presignedUrlsEnabled?: InputMaybe<Boolean_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
};

/** unique or primary key constraints on table "storage.buckets" */
export enum Buckets_Constraint {
  /** unique or primary key constraint on columns "id" */
  BucketsPkey = 'buckets_pkey'
}

/** input type for incrementing numeric columns in table "storage.buckets" */
export type Buckets_Inc_Input = {
  downloadExpiration?: InputMaybe<Scalars['Int']>;
  maxUploadFileSize?: InputMaybe<Scalars['Int']>;
  minUploadFileSize?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "storage.buckets" */
export type Buckets_Insert_Input = {
  cacheControl?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  downloadExpiration?: InputMaybe<Scalars['Int']>;
  files?: InputMaybe<Files_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['String']>;
  maxUploadFileSize?: InputMaybe<Scalars['Int']>;
  minUploadFileSize?: InputMaybe<Scalars['Int']>;
  presignedUrlsEnabled?: InputMaybe<Scalars['Boolean']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate max on columns */
export type Buckets_Max_Fields = {
  __typename?: 'buckets_max_fields';
  cacheControl?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  downloadExpiration?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  maxUploadFileSize?: Maybe<Scalars['Int']>;
  minUploadFileSize?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** aggregate min on columns */
export type Buckets_Min_Fields = {
  __typename?: 'buckets_min_fields';
  cacheControl?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  downloadExpiration?: Maybe<Scalars['Int']>;
  id?: Maybe<Scalars['String']>;
  maxUploadFileSize?: Maybe<Scalars['Int']>;
  minUploadFileSize?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** response of any mutation on the table "storage.buckets" */
export type Buckets_Mutation_Response = {
  __typename?: 'buckets_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Buckets>;
};

/** input type for inserting object relation for remote table "storage.buckets" */
export type Buckets_Obj_Rel_Insert_Input = {
  data: Buckets_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Buckets_On_Conflict>;
};

/** on_conflict condition type for table "storage.buckets" */
export type Buckets_On_Conflict = {
  constraint: Buckets_Constraint;
  update_columns?: Array<Buckets_Update_Column>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};

/** Ordering options when selecting data from "storage.buckets". */
export type Buckets_Order_By = {
  cacheControl?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  downloadExpiration?: InputMaybe<Order_By>;
  files_aggregate?: InputMaybe<Files_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  maxUploadFileSize?: InputMaybe<Order_By>;
  minUploadFileSize?: InputMaybe<Order_By>;
  presignedUrlsEnabled?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** primary key columns input for table: storage.buckets */
export type Buckets_Pk_Columns_Input = {
  id: Scalars['String'];
};

/** select columns of table "storage.buckets" */
export enum Buckets_Select_Column {
  /** column name */
  CacheControl = 'cacheControl',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DownloadExpiration = 'downloadExpiration',
  /** column name */
  Id = 'id',
  /** column name */
  MaxUploadFileSize = 'maxUploadFileSize',
  /** column name */
  MinUploadFileSize = 'minUploadFileSize',
  /** column name */
  PresignedUrlsEnabled = 'presignedUrlsEnabled',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** input type for updating data in table "storage.buckets" */
export type Buckets_Set_Input = {
  cacheControl?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  downloadExpiration?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['String']>;
  maxUploadFileSize?: InputMaybe<Scalars['Int']>;
  minUploadFileSize?: InputMaybe<Scalars['Int']>;
  presignedUrlsEnabled?: InputMaybe<Scalars['Boolean']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate stddev on columns */
export type Buckets_Stddev_Fields = {
  __typename?: 'buckets_stddev_fields';
  downloadExpiration?: Maybe<Scalars['Float']>;
  maxUploadFileSize?: Maybe<Scalars['Float']>;
  minUploadFileSize?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_pop on columns */
export type Buckets_Stddev_Pop_Fields = {
  __typename?: 'buckets_stddev_pop_fields';
  downloadExpiration?: Maybe<Scalars['Float']>;
  maxUploadFileSize?: Maybe<Scalars['Float']>;
  minUploadFileSize?: Maybe<Scalars['Float']>;
};

/** aggregate stddev_samp on columns */
export type Buckets_Stddev_Samp_Fields = {
  __typename?: 'buckets_stddev_samp_fields';
  downloadExpiration?: Maybe<Scalars['Float']>;
  maxUploadFileSize?: Maybe<Scalars['Float']>;
  minUploadFileSize?: Maybe<Scalars['Float']>;
};

/** Streaming cursor of the table "buckets" */
export type Buckets_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Buckets_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Buckets_Stream_Cursor_Value_Input = {
  cacheControl?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  downloadExpiration?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['String']>;
  maxUploadFileSize?: InputMaybe<Scalars['Int']>;
  minUploadFileSize?: InputMaybe<Scalars['Int']>;
  presignedUrlsEnabled?: InputMaybe<Scalars['Boolean']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** aggregate sum on columns */
export type Buckets_Sum_Fields = {
  __typename?: 'buckets_sum_fields';
  downloadExpiration?: Maybe<Scalars['Int']>;
  maxUploadFileSize?: Maybe<Scalars['Int']>;
  minUploadFileSize?: Maybe<Scalars['Int']>;
};

/** update columns of table "storage.buckets" */
export enum Buckets_Update_Column {
  /** column name */
  CacheControl = 'cacheControl',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  DownloadExpiration = 'downloadExpiration',
  /** column name */
  Id = 'id',
  /** column name */
  MaxUploadFileSize = 'maxUploadFileSize',
  /** column name */
  MinUploadFileSize = 'minUploadFileSize',
  /** column name */
  PresignedUrlsEnabled = 'presignedUrlsEnabled',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type Buckets_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Buckets_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Buckets_Set_Input>;
  where: Buckets_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Buckets_Var_Pop_Fields = {
  __typename?: 'buckets_var_pop_fields';
  downloadExpiration?: Maybe<Scalars['Float']>;
  maxUploadFileSize?: Maybe<Scalars['Float']>;
  minUploadFileSize?: Maybe<Scalars['Float']>;
};

/** aggregate var_samp on columns */
export type Buckets_Var_Samp_Fields = {
  __typename?: 'buckets_var_samp_fields';
  downloadExpiration?: Maybe<Scalars['Float']>;
  maxUploadFileSize?: Maybe<Scalars['Float']>;
  minUploadFileSize?: Maybe<Scalars['Float']>;
};

/** aggregate variance on columns */
export type Buckets_Variance_Fields = {
  __typename?: 'buckets_variance_fields';
  downloadExpiration?: Maybe<Scalars['Float']>;
  maxUploadFileSize?: Maybe<Scalars['Float']>;
  minUploadFileSize?: Maybe<Scalars['Float']>;
};

/** Boolean expression to compare columns of type "bytea". All fields are combined with logical 'AND'. */
export type Bytea_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['bytea']>;
  _gt?: InputMaybe<Scalars['bytea']>;
  _gte?: InputMaybe<Scalars['bytea']>;
  _in?: InputMaybe<Array<Scalars['bytea']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['bytea']>;
  _lte?: InputMaybe<Scalars['bytea']>;
  _neq?: InputMaybe<Scalars['bytea']>;
  _nin?: InputMaybe<Array<Scalars['bytea']>>;
};

/** Boolean expression to compare columns of type "citext". All fields are combined with logical 'AND'. */
export type Citext_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['citext']>;
  _gt?: InputMaybe<Scalars['citext']>;
  _gte?: InputMaybe<Scalars['citext']>;
  /** does the column match the given case-insensitive pattern */
  _ilike?: InputMaybe<Scalars['citext']>;
  _in?: InputMaybe<Array<Scalars['citext']>>;
  /** does the column match the given POSIX regular expression, case insensitive */
  _iregex?: InputMaybe<Scalars['citext']>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  /** does the column match the given pattern */
  _like?: InputMaybe<Scalars['citext']>;
  _lt?: InputMaybe<Scalars['citext']>;
  _lte?: InputMaybe<Scalars['citext']>;
  _neq?: InputMaybe<Scalars['citext']>;
  /** does the column NOT match the given case-insensitive pattern */
  _nilike?: InputMaybe<Scalars['citext']>;
  _nin?: InputMaybe<Array<Scalars['citext']>>;
  /** does the column NOT match the given POSIX regular expression, case insensitive */
  _niregex?: InputMaybe<Scalars['citext']>;
  /** does the column NOT match the given pattern */
  _nlike?: InputMaybe<Scalars['citext']>;
  /** does the column NOT match the given POSIX regular expression, case sensitive */
  _nregex?: InputMaybe<Scalars['citext']>;
  /** does the column NOT match the given SQL regular expression */
  _nsimilar?: InputMaybe<Scalars['citext']>;
  /** does the column match the given POSIX regular expression, case sensitive */
  _regex?: InputMaybe<Scalars['citext']>;
  /** does the column match the given SQL regular expression */
  _similar?: InputMaybe<Scalars['citext']>;
};

/** columns and relationships of "coda_configs" */
export type Coda_Configs = {
  __typename?: 'coda_configs';
  access_token_hash: Scalars['String'];
  created_at: Scalars['timestamptz'];
  /** An object relationship */
  destination: Destinations;
  destination_id: Scalars['uuid'];
  id: Scalars['uuid'];
  is_ready: Scalars['Boolean'];
};

/** aggregated selection of "coda_configs" */
export type Coda_Configs_Aggregate = {
  __typename?: 'coda_configs_aggregate';
  aggregate?: Maybe<Coda_Configs_Aggregate_Fields>;
  nodes: Array<Coda_Configs>;
};

/** aggregate fields of "coda_configs" */
export type Coda_Configs_Aggregate_Fields = {
  __typename?: 'coda_configs_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Coda_Configs_Max_Fields>;
  min?: Maybe<Coda_Configs_Min_Fields>;
};


/** aggregate fields of "coda_configs" */
export type Coda_Configs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Coda_Configs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "coda_configs". All fields are combined with a logical 'AND'. */
export type Coda_Configs_Bool_Exp = {
  _and?: InputMaybe<Array<Coda_Configs_Bool_Exp>>;
  _not?: InputMaybe<Coda_Configs_Bool_Exp>;
  _or?: InputMaybe<Array<Coda_Configs_Bool_Exp>>;
  access_token_hash?: InputMaybe<String_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  destination?: InputMaybe<Destinations_Bool_Exp>;
  destination_id?: InputMaybe<Uuid_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_ready?: InputMaybe<Boolean_Comparison_Exp>;
};

/** unique or primary key constraints on table "coda_configs" */
export enum Coda_Configs_Constraint {
  /** unique or primary key constraint on columns "access_token_hash" */
  CodaConfigsAccessTokenHashKey = 'coda_configs_access_token_hash_key',
  /** unique or primary key constraint on columns "id" */
  CodaConfigsPkey = 'coda_configs_pkey'
}

/** input type for inserting data into table "coda_configs" */
export type Coda_Configs_Insert_Input = {
  access_token_hash?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  destination?: InputMaybe<Destinations_Obj_Rel_Insert_Input>;
  destination_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  is_ready?: InputMaybe<Scalars['Boolean']>;
};

/** aggregate max on columns */
export type Coda_Configs_Max_Fields = {
  __typename?: 'coda_configs_max_fields';
  access_token_hash?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  destination_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type Coda_Configs_Min_Fields = {
  __typename?: 'coda_configs_min_fields';
  access_token_hash?: Maybe<Scalars['String']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  destination_id?: Maybe<Scalars['uuid']>;
  id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "coda_configs" */
export type Coda_Configs_Mutation_Response = {
  __typename?: 'coda_configs_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Coda_Configs>;
};

/** input type for inserting object relation for remote table "coda_configs" */
export type Coda_Configs_Obj_Rel_Insert_Input = {
  data: Coda_Configs_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Coda_Configs_On_Conflict>;
};

/** on_conflict condition type for table "coda_configs" */
export type Coda_Configs_On_Conflict = {
  constraint: Coda_Configs_Constraint;
  update_columns?: Array<Coda_Configs_Update_Column>;
  where?: InputMaybe<Coda_Configs_Bool_Exp>;
};

/** Ordering options when selecting data from "coda_configs". */
export type Coda_Configs_Order_By = {
  access_token_hash?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  destination?: InputMaybe<Destinations_Order_By>;
  destination_id?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_ready?: InputMaybe<Order_By>;
};

/** primary key columns input for table: coda_configs */
export type Coda_Configs_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "coda_configs" */
export enum Coda_Configs_Select_Column {
  /** column name */
  AccessTokenHash = 'access_token_hash',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DestinationId = 'destination_id',
  /** column name */
  Id = 'id',
  /** column name */
  IsReady = 'is_ready'
}

/** input type for updating data in table "coda_configs" */
export type Coda_Configs_Set_Input = {
  access_token_hash?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  destination_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  is_ready?: InputMaybe<Scalars['Boolean']>;
};

/** Streaming cursor of the table "coda_configs" */
export type Coda_Configs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Coda_Configs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Coda_Configs_Stream_Cursor_Value_Input = {
  access_token_hash?: InputMaybe<Scalars['String']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  destination_id?: InputMaybe<Scalars['uuid']>;
  id?: InputMaybe<Scalars['uuid']>;
  is_ready?: InputMaybe<Scalars['Boolean']>;
};

/** update columns of table "coda_configs" */
export enum Coda_Configs_Update_Column {
  /** column name */
  AccessTokenHash = 'access_token_hash',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DestinationId = 'destination_id',
  /** column name */
  Id = 'id',
  /** column name */
  IsReady = 'is_ready'
}

export type Coda_Configs_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Coda_Configs_Set_Input>;
  where: Coda_Configs_Bool_Exp;
};

/** ordering argument of a cursor */
export enum Cursor_Ordering {
  /** ascending ordering of the cursor */
  Asc = 'ASC',
  /** descending ordering of the cursor */
  Desc = 'DESC'
}

/** columns and relationships of "destination_accounts" */
export type Destination_Accounts = {
  __typename?: 'destination_accounts';
  /** An object relationship */
  account: PlaidAccounts;
  account_id: Scalars['String'];
  /** An object relationship */
  destination: Destinations;
  destination_id: Scalars['uuid'];
};

/** aggregated selection of "destination_accounts" */
export type Destination_Accounts_Aggregate = {
  __typename?: 'destination_accounts_aggregate';
  aggregate?: Maybe<Destination_Accounts_Aggregate_Fields>;
  nodes: Array<Destination_Accounts>;
};

export type Destination_Accounts_Aggregate_Bool_Exp = {
  count?: InputMaybe<Destination_Accounts_Aggregate_Bool_Exp_Count>;
};

export type Destination_Accounts_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Destination_Accounts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Destination_Accounts_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "destination_accounts" */
export type Destination_Accounts_Aggregate_Fields = {
  __typename?: 'destination_accounts_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Destination_Accounts_Max_Fields>;
  min?: Maybe<Destination_Accounts_Min_Fields>;
};


/** aggregate fields of "destination_accounts" */
export type Destination_Accounts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Destination_Accounts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "destination_accounts" */
export type Destination_Accounts_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Destination_Accounts_Max_Order_By>;
  min?: InputMaybe<Destination_Accounts_Min_Order_By>;
};

/** input type for inserting array relation for remote table "destination_accounts" */
export type Destination_Accounts_Arr_Rel_Insert_Input = {
  data: Array<Destination_Accounts_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Destination_Accounts_On_Conflict>;
};

/** Boolean expression to filter rows from the table "destination_accounts". All fields are combined with a logical 'AND'. */
export type Destination_Accounts_Bool_Exp = {
  _and?: InputMaybe<Array<Destination_Accounts_Bool_Exp>>;
  _not?: InputMaybe<Destination_Accounts_Bool_Exp>;
  _or?: InputMaybe<Array<Destination_Accounts_Bool_Exp>>;
  account?: InputMaybe<PlaidAccounts_Bool_Exp>;
  account_id?: InputMaybe<String_Comparison_Exp>;
  destination?: InputMaybe<Destinations_Bool_Exp>;
  destination_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "destination_accounts" */
export enum Destination_Accounts_Constraint {
  /** unique or primary key constraint on columns "destination_id", "account_id" */
  DestinationAccountsPkey = 'destination_accounts_pkey'
}

/** input type for inserting data into table "destination_accounts" */
export type Destination_Accounts_Insert_Input = {
  account?: InputMaybe<PlaidAccounts_Obj_Rel_Insert_Input>;
  account_id?: InputMaybe<Scalars['String']>;
  destination?: InputMaybe<Destinations_Obj_Rel_Insert_Input>;
  destination_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Destination_Accounts_Max_Fields = {
  __typename?: 'destination_accounts_max_fields';
  account_id?: Maybe<Scalars['String']>;
  destination_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "destination_accounts" */
export type Destination_Accounts_Max_Order_By = {
  account_id?: InputMaybe<Order_By>;
  destination_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Destination_Accounts_Min_Fields = {
  __typename?: 'destination_accounts_min_fields';
  account_id?: Maybe<Scalars['String']>;
  destination_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "destination_accounts" */
export type Destination_Accounts_Min_Order_By = {
  account_id?: InputMaybe<Order_By>;
  destination_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "destination_accounts" */
export type Destination_Accounts_Mutation_Response = {
  __typename?: 'destination_accounts_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Destination_Accounts>;
};

/** on_conflict condition type for table "destination_accounts" */
export type Destination_Accounts_On_Conflict = {
  constraint: Destination_Accounts_Constraint;
  update_columns?: Array<Destination_Accounts_Update_Column>;
  where?: InputMaybe<Destination_Accounts_Bool_Exp>;
};

/** Ordering options when selecting data from "destination_accounts". */
export type Destination_Accounts_Order_By = {
  account?: InputMaybe<PlaidAccounts_Order_By>;
  account_id?: InputMaybe<Order_By>;
  destination?: InputMaybe<Destinations_Order_By>;
  destination_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: destination_accounts */
export type Destination_Accounts_Pk_Columns_Input = {
  account_id: Scalars['String'];
  destination_id: Scalars['uuid'];
};

/** select columns of table "destination_accounts" */
export enum Destination_Accounts_Select_Column {
  /** column name */
  AccountId = 'account_id',
  /** column name */
  DestinationId = 'destination_id'
}

/** input type for updating data in table "destination_accounts" */
export type Destination_Accounts_Set_Input = {
  account_id?: InputMaybe<Scalars['String']>;
  destination_id?: InputMaybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "destination_accounts" */
export type Destination_Accounts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Destination_Accounts_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Destination_Accounts_Stream_Cursor_Value_Input = {
  account_id?: InputMaybe<Scalars['String']>;
  destination_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "destination_accounts" */
export enum Destination_Accounts_Update_Column {
  /** column name */
  AccountId = 'account_id',
  /** column name */
  DestinationId = 'destination_id'
}

export type Destination_Accounts_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Destination_Accounts_Set_Input>;
  where: Destination_Accounts_Bool_Exp;
};

/** columns and relationships of "destination_sync_logs" */
export type Destination_Sync_Logs = {
  __typename?: 'destination_sync_logs';
  accounts: Scalars['jsonb'];
  /** An object relationship */
  destination: Destinations;
  destination_id: Scalars['uuid'];
  error?: Maybe<Scalars['jsonb']>;
  holdings: Scalars['jsonb'];
  investment_transactions: Scalars['jsonb'];
  /** An object relationship */
  sync_log: Sync_Logs;
  sync_log_id: Scalars['uuid'];
  transactions: Scalars['jsonb'];
};


/** columns and relationships of "destination_sync_logs" */
export type Destination_Sync_LogsAccountsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "destination_sync_logs" */
export type Destination_Sync_LogsErrorArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "destination_sync_logs" */
export type Destination_Sync_LogsHoldingsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "destination_sync_logs" */
export type Destination_Sync_LogsInvestment_TransactionsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "destination_sync_logs" */
export type Destination_Sync_LogsTransactionsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "destination_sync_logs" */
export type Destination_Sync_Logs_Aggregate = {
  __typename?: 'destination_sync_logs_aggregate';
  aggregate?: Maybe<Destination_Sync_Logs_Aggregate_Fields>;
  nodes: Array<Destination_Sync_Logs>;
};

export type Destination_Sync_Logs_Aggregate_Bool_Exp = {
  count?: InputMaybe<Destination_Sync_Logs_Aggregate_Bool_Exp_Count>;
};

export type Destination_Sync_Logs_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Destination_Sync_Logs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Destination_Sync_Logs_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "destination_sync_logs" */
export type Destination_Sync_Logs_Aggregate_Fields = {
  __typename?: 'destination_sync_logs_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Destination_Sync_Logs_Max_Fields>;
  min?: Maybe<Destination_Sync_Logs_Min_Fields>;
};


/** aggregate fields of "destination_sync_logs" */
export type Destination_Sync_Logs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Destination_Sync_Logs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "destination_sync_logs" */
export type Destination_Sync_Logs_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Destination_Sync_Logs_Max_Order_By>;
  min?: InputMaybe<Destination_Sync_Logs_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Destination_Sync_Logs_Append_Input = {
  accounts?: InputMaybe<Scalars['jsonb']>;
  error?: InputMaybe<Scalars['jsonb']>;
  holdings?: InputMaybe<Scalars['jsonb']>;
  investment_transactions?: InputMaybe<Scalars['jsonb']>;
  transactions?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "destination_sync_logs" */
export type Destination_Sync_Logs_Arr_Rel_Insert_Input = {
  data: Array<Destination_Sync_Logs_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Destination_Sync_Logs_On_Conflict>;
};

/** Boolean expression to filter rows from the table "destination_sync_logs". All fields are combined with a logical 'AND'. */
export type Destination_Sync_Logs_Bool_Exp = {
  _and?: InputMaybe<Array<Destination_Sync_Logs_Bool_Exp>>;
  _not?: InputMaybe<Destination_Sync_Logs_Bool_Exp>;
  _or?: InputMaybe<Array<Destination_Sync_Logs_Bool_Exp>>;
  accounts?: InputMaybe<Jsonb_Comparison_Exp>;
  destination?: InputMaybe<Destinations_Bool_Exp>;
  destination_id?: InputMaybe<Uuid_Comparison_Exp>;
  error?: InputMaybe<Jsonb_Comparison_Exp>;
  holdings?: InputMaybe<Jsonb_Comparison_Exp>;
  investment_transactions?: InputMaybe<Jsonb_Comparison_Exp>;
  sync_log?: InputMaybe<Sync_Logs_Bool_Exp>;
  sync_log_id?: InputMaybe<Uuid_Comparison_Exp>;
  transactions?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "destination_sync_logs" */
export enum Destination_Sync_Logs_Constraint {
  /** unique or primary key constraint on columns "sync_log_id", "destination_id" */
  DestinationSyncLogsPkey = 'destination_sync_logs_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Destination_Sync_Logs_Delete_At_Path_Input = {
  accounts?: InputMaybe<Array<Scalars['String']>>;
  error?: InputMaybe<Array<Scalars['String']>>;
  holdings?: InputMaybe<Array<Scalars['String']>>;
  investment_transactions?: InputMaybe<Array<Scalars['String']>>;
  transactions?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Destination_Sync_Logs_Delete_Elem_Input = {
  accounts?: InputMaybe<Scalars['Int']>;
  error?: InputMaybe<Scalars['Int']>;
  holdings?: InputMaybe<Scalars['Int']>;
  investment_transactions?: InputMaybe<Scalars['Int']>;
  transactions?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Destination_Sync_Logs_Delete_Key_Input = {
  accounts?: InputMaybe<Scalars['String']>;
  error?: InputMaybe<Scalars['String']>;
  holdings?: InputMaybe<Scalars['String']>;
  investment_transactions?: InputMaybe<Scalars['String']>;
  transactions?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "destination_sync_logs" */
export type Destination_Sync_Logs_Insert_Input = {
  accounts?: InputMaybe<Scalars['jsonb']>;
  destination?: InputMaybe<Destinations_Obj_Rel_Insert_Input>;
  destination_id?: InputMaybe<Scalars['uuid']>;
  error?: InputMaybe<Scalars['jsonb']>;
  holdings?: InputMaybe<Scalars['jsonb']>;
  investment_transactions?: InputMaybe<Scalars['jsonb']>;
  sync_log?: InputMaybe<Sync_Logs_Obj_Rel_Insert_Input>;
  sync_log_id?: InputMaybe<Scalars['uuid']>;
  transactions?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate max on columns */
export type Destination_Sync_Logs_Max_Fields = {
  __typename?: 'destination_sync_logs_max_fields';
  destination_id?: Maybe<Scalars['uuid']>;
  sync_log_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "destination_sync_logs" */
export type Destination_Sync_Logs_Max_Order_By = {
  destination_id?: InputMaybe<Order_By>;
  sync_log_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Destination_Sync_Logs_Min_Fields = {
  __typename?: 'destination_sync_logs_min_fields';
  destination_id?: Maybe<Scalars['uuid']>;
  sync_log_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "destination_sync_logs" */
export type Destination_Sync_Logs_Min_Order_By = {
  destination_id?: InputMaybe<Order_By>;
  sync_log_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "destination_sync_logs" */
export type Destination_Sync_Logs_Mutation_Response = {
  __typename?: 'destination_sync_logs_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Destination_Sync_Logs>;
};

/** on_conflict condition type for table "destination_sync_logs" */
export type Destination_Sync_Logs_On_Conflict = {
  constraint: Destination_Sync_Logs_Constraint;
  update_columns?: Array<Destination_Sync_Logs_Update_Column>;
  where?: InputMaybe<Destination_Sync_Logs_Bool_Exp>;
};

/** Ordering options when selecting data from "destination_sync_logs". */
export type Destination_Sync_Logs_Order_By = {
  accounts?: InputMaybe<Order_By>;
  destination?: InputMaybe<Destinations_Order_By>;
  destination_id?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  holdings?: InputMaybe<Order_By>;
  investment_transactions?: InputMaybe<Order_By>;
  sync_log?: InputMaybe<Sync_Logs_Order_By>;
  sync_log_id?: InputMaybe<Order_By>;
  transactions?: InputMaybe<Order_By>;
};

/** primary key columns input for table: destination_sync_logs */
export type Destination_Sync_Logs_Pk_Columns_Input = {
  destination_id: Scalars['uuid'];
  sync_log_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Destination_Sync_Logs_Prepend_Input = {
  accounts?: InputMaybe<Scalars['jsonb']>;
  error?: InputMaybe<Scalars['jsonb']>;
  holdings?: InputMaybe<Scalars['jsonb']>;
  investment_transactions?: InputMaybe<Scalars['jsonb']>;
  transactions?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "destination_sync_logs" */
export enum Destination_Sync_Logs_Select_Column {
  /** column name */
  Accounts = 'accounts',
  /** column name */
  DestinationId = 'destination_id',
  /** column name */
  Error = 'error',
  /** column name */
  Holdings = 'holdings',
  /** column name */
  InvestmentTransactions = 'investment_transactions',
  /** column name */
  SyncLogId = 'sync_log_id',
  /** column name */
  Transactions = 'transactions'
}

/** input type for updating data in table "destination_sync_logs" */
export type Destination_Sync_Logs_Set_Input = {
  accounts?: InputMaybe<Scalars['jsonb']>;
  destination_id?: InputMaybe<Scalars['uuid']>;
  error?: InputMaybe<Scalars['jsonb']>;
  holdings?: InputMaybe<Scalars['jsonb']>;
  investment_transactions?: InputMaybe<Scalars['jsonb']>;
  sync_log_id?: InputMaybe<Scalars['uuid']>;
  transactions?: InputMaybe<Scalars['jsonb']>;
};

/** Streaming cursor of the table "destination_sync_logs" */
export type Destination_Sync_Logs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Destination_Sync_Logs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Destination_Sync_Logs_Stream_Cursor_Value_Input = {
  accounts?: InputMaybe<Scalars['jsonb']>;
  destination_id?: InputMaybe<Scalars['uuid']>;
  error?: InputMaybe<Scalars['jsonb']>;
  holdings?: InputMaybe<Scalars['jsonb']>;
  investment_transactions?: InputMaybe<Scalars['jsonb']>;
  sync_log_id?: InputMaybe<Scalars['uuid']>;
  transactions?: InputMaybe<Scalars['jsonb']>;
};

/** update columns of table "destination_sync_logs" */
export enum Destination_Sync_Logs_Update_Column {
  /** column name */
  Accounts = 'accounts',
  /** column name */
  DestinationId = 'destination_id',
  /** column name */
  Error = 'error',
  /** column name */
  Holdings = 'holdings',
  /** column name */
  InvestmentTransactions = 'investment_transactions',
  /** column name */
  SyncLogId = 'sync_log_id',
  /** column name */
  Transactions = 'transactions'
}

export type Destination_Sync_Logs_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Destination_Sync_Logs_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Destination_Sync_Logs_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Destination_Sync_Logs_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Destination_Sync_Logs_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Destination_Sync_Logs_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Destination_Sync_Logs_Set_Input>;
  where: Destination_Sync_Logs_Bool_Exp;
};

/** columns and relationships of "destinations" */
export type Destinations = {
  __typename?: 'destinations';
  /** An array relationship */
  account_connections: Array<Destination_Accounts>;
  /** An aggregate relationship */
  account_connections_aggregate: Destination_Accounts_Aggregate;
  /** An object relationship */
  airtable_config?: Maybe<Airtable_Configs>;
  authentication?: Maybe<Scalars['jsonb']>;
  /** An object relationship */
  coda_config?: Maybe<Coda_Configs>;
  created_at: Scalars['timestamptz'];
  /** An array relationship */
  destination_sync_logs: Array<Destination_Sync_Logs>;
  /** An aggregate relationship */
  destination_sync_logs_aggregate: Destination_Sync_Logs_Aggregate;
  disabled_at?: Maybe<Scalars['timestamptz']>;
  id: Scalars['uuid'];
  /** An object relationship */
  integration: Integrations;
  integration_id: Integrations_Enum;
  is_ready: Scalars['Boolean'];
  name: Scalars['String'];
  /** An object relationship */
  notion_connection?: Maybe<Notion_Connections>;
  notion_connection_id?: Maybe<Scalars['String']>;
  should_override_transaction_name: Scalars['Boolean'];
  should_sync_investments: Scalars['Boolean'];
  should_sync_transactions: Scalars['Boolean'];
  sync_start_date: Scalars['String'];
  table_configs: Scalars['jsonb'];
  updated_at: Scalars['timestamptz'];
  /** An object relationship */
  user: Users;
  user_id: Scalars['uuid'];
};


/** columns and relationships of "destinations" */
export type DestinationsAccount_ConnectionsArgs = {
  distinct_on?: InputMaybe<Array<Destination_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destination_Accounts_Order_By>>;
  where?: InputMaybe<Destination_Accounts_Bool_Exp>;
};


/** columns and relationships of "destinations" */
export type DestinationsAccount_Connections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Destination_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destination_Accounts_Order_By>>;
  where?: InputMaybe<Destination_Accounts_Bool_Exp>;
};


/** columns and relationships of "destinations" */
export type DestinationsAuthenticationArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "destinations" */
export type DestinationsDestination_Sync_LogsArgs = {
  distinct_on?: InputMaybe<Array<Destination_Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destination_Sync_Logs_Order_By>>;
  where?: InputMaybe<Destination_Sync_Logs_Bool_Exp>;
};


/** columns and relationships of "destinations" */
export type DestinationsDestination_Sync_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Destination_Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destination_Sync_Logs_Order_By>>;
  where?: InputMaybe<Destination_Sync_Logs_Bool_Exp>;
};


/** columns and relationships of "destinations" */
export type DestinationsTable_ConfigsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "destinations" */
export type Destinations_Aggregate = {
  __typename?: 'destinations_aggregate';
  aggregate?: Maybe<Destinations_Aggregate_Fields>;
  nodes: Array<Destinations>;
};

export type Destinations_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Destinations_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Destinations_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Destinations_Aggregate_Bool_Exp_Count>;
};

export type Destinations_Aggregate_Bool_Exp_Bool_And = {
  arguments: Destinations_Select_Column_Destinations_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Destinations_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Destinations_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Destinations_Select_Column_Destinations_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Destinations_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Destinations_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Destinations_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Destinations_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "destinations" */
export type Destinations_Aggregate_Fields = {
  __typename?: 'destinations_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Destinations_Max_Fields>;
  min?: Maybe<Destinations_Min_Fields>;
};


/** aggregate fields of "destinations" */
export type Destinations_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Destinations_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "destinations" */
export type Destinations_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Destinations_Max_Order_By>;
  min?: InputMaybe<Destinations_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Destinations_Append_Input = {
  authentication?: InputMaybe<Scalars['jsonb']>;
  table_configs?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "destinations" */
export type Destinations_Arr_Rel_Insert_Input = {
  data: Array<Destinations_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Destinations_On_Conflict>;
};

/** Boolean expression to filter rows from the table "destinations". All fields are combined with a logical 'AND'. */
export type Destinations_Bool_Exp = {
  _and?: InputMaybe<Array<Destinations_Bool_Exp>>;
  _not?: InputMaybe<Destinations_Bool_Exp>;
  _or?: InputMaybe<Array<Destinations_Bool_Exp>>;
  account_connections?: InputMaybe<Destination_Accounts_Bool_Exp>;
  account_connections_aggregate?: InputMaybe<Destination_Accounts_Aggregate_Bool_Exp>;
  airtable_config?: InputMaybe<Airtable_Configs_Bool_Exp>;
  authentication?: InputMaybe<Jsonb_Comparison_Exp>;
  coda_config?: InputMaybe<Coda_Configs_Bool_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  destination_sync_logs?: InputMaybe<Destination_Sync_Logs_Bool_Exp>;
  destination_sync_logs_aggregate?: InputMaybe<Destination_Sync_Logs_Aggregate_Bool_Exp>;
  disabled_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  integration?: InputMaybe<Integrations_Bool_Exp>;
  integration_id?: InputMaybe<Integrations_Enum_Comparison_Exp>;
  is_ready?: InputMaybe<Boolean_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  notion_connection?: InputMaybe<Notion_Connections_Bool_Exp>;
  notion_connection_id?: InputMaybe<String_Comparison_Exp>;
  should_override_transaction_name?: InputMaybe<Boolean_Comparison_Exp>;
  should_sync_investments?: InputMaybe<Boolean_Comparison_Exp>;
  should_sync_transactions?: InputMaybe<Boolean_Comparison_Exp>;
  sync_start_date?: InputMaybe<String_Comparison_Exp>;
  table_configs?: InputMaybe<Jsonb_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "destinations" */
export enum Destinations_Constraint {
  /** unique or primary key constraint on columns "id" */
  DestinationsPkey = 'destinations_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Destinations_Delete_At_Path_Input = {
  authentication?: InputMaybe<Array<Scalars['String']>>;
  table_configs?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Destinations_Delete_Elem_Input = {
  authentication?: InputMaybe<Scalars['Int']>;
  table_configs?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Destinations_Delete_Key_Input = {
  authentication?: InputMaybe<Scalars['String']>;
  table_configs?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "destinations" */
export type Destinations_Insert_Input = {
  account_connections?: InputMaybe<Destination_Accounts_Arr_Rel_Insert_Input>;
  airtable_config?: InputMaybe<Airtable_Configs_Obj_Rel_Insert_Input>;
  authentication?: InputMaybe<Scalars['jsonb']>;
  coda_config?: InputMaybe<Coda_Configs_Obj_Rel_Insert_Input>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  destination_sync_logs?: InputMaybe<Destination_Sync_Logs_Arr_Rel_Insert_Input>;
  disabled_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  integration?: InputMaybe<Integrations_Obj_Rel_Insert_Input>;
  integration_id?: InputMaybe<Integrations_Enum>;
  is_ready?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  notion_connection?: InputMaybe<Notion_Connections_Obj_Rel_Insert_Input>;
  notion_connection_id?: InputMaybe<Scalars['String']>;
  should_override_transaction_name?: InputMaybe<Scalars['Boolean']>;
  should_sync_investments?: InputMaybe<Scalars['Boolean']>;
  should_sync_transactions?: InputMaybe<Scalars['Boolean']>;
  sync_start_date?: InputMaybe<Scalars['String']>;
  table_configs?: InputMaybe<Scalars['jsonb']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Destinations_Max_Fields = {
  __typename?: 'destinations_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  disabled_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  notion_connection_id?: Maybe<Scalars['String']>;
  sync_start_date?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "destinations" */
export type Destinations_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  disabled_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  notion_connection_id?: InputMaybe<Order_By>;
  sync_start_date?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Destinations_Min_Fields = {
  __typename?: 'destinations_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  disabled_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
  notion_connection_id?: Maybe<Scalars['String']>;
  sync_start_date?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "destinations" */
export type Destinations_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  disabled_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  notion_connection_id?: InputMaybe<Order_By>;
  sync_start_date?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "destinations" */
export type Destinations_Mutation_Response = {
  __typename?: 'destinations_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Destinations>;
};

/** input type for inserting object relation for remote table "destinations" */
export type Destinations_Obj_Rel_Insert_Input = {
  data: Destinations_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Destinations_On_Conflict>;
};

/** on_conflict condition type for table "destinations" */
export type Destinations_On_Conflict = {
  constraint: Destinations_Constraint;
  update_columns?: Array<Destinations_Update_Column>;
  where?: InputMaybe<Destinations_Bool_Exp>;
};

/** Ordering options when selecting data from "destinations". */
export type Destinations_Order_By = {
  account_connections_aggregate?: InputMaybe<Destination_Accounts_Aggregate_Order_By>;
  airtable_config?: InputMaybe<Airtable_Configs_Order_By>;
  authentication?: InputMaybe<Order_By>;
  coda_config?: InputMaybe<Coda_Configs_Order_By>;
  created_at?: InputMaybe<Order_By>;
  destination_sync_logs_aggregate?: InputMaybe<Destination_Sync_Logs_Aggregate_Order_By>;
  disabled_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  integration?: InputMaybe<Integrations_Order_By>;
  integration_id?: InputMaybe<Order_By>;
  is_ready?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  notion_connection?: InputMaybe<Notion_Connections_Order_By>;
  notion_connection_id?: InputMaybe<Order_By>;
  should_override_transaction_name?: InputMaybe<Order_By>;
  should_sync_investments?: InputMaybe<Order_By>;
  should_sync_transactions?: InputMaybe<Order_By>;
  sync_start_date?: InputMaybe<Order_By>;
  table_configs?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: destinations */
export type Destinations_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Destinations_Prepend_Input = {
  authentication?: InputMaybe<Scalars['jsonb']>;
  table_configs?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "destinations" */
export enum Destinations_Select_Column {
  /** column name */
  Authentication = 'authentication',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DisabledAt = 'disabled_at',
  /** column name */
  Id = 'id',
  /** column name */
  IntegrationId = 'integration_id',
  /** column name */
  IsReady = 'is_ready',
  /** column name */
  Name = 'name',
  /** column name */
  NotionConnectionId = 'notion_connection_id',
  /** column name */
  ShouldOverrideTransactionName = 'should_override_transaction_name',
  /** column name */
  ShouldSyncInvestments = 'should_sync_investments',
  /** column name */
  ShouldSyncTransactions = 'should_sync_transactions',
  /** column name */
  SyncStartDate = 'sync_start_date',
  /** column name */
  TableConfigs = 'table_configs',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

/** select "destinations_aggregate_bool_exp_bool_and_arguments_columns" columns of table "destinations" */
export enum Destinations_Select_Column_Destinations_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsReady = 'is_ready',
  /** column name */
  ShouldOverrideTransactionName = 'should_override_transaction_name',
  /** column name */
  ShouldSyncInvestments = 'should_sync_investments',
  /** column name */
  ShouldSyncTransactions = 'should_sync_transactions'
}

/** select "destinations_aggregate_bool_exp_bool_or_arguments_columns" columns of table "destinations" */
export enum Destinations_Select_Column_Destinations_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsReady = 'is_ready',
  /** column name */
  ShouldOverrideTransactionName = 'should_override_transaction_name',
  /** column name */
  ShouldSyncInvestments = 'should_sync_investments',
  /** column name */
  ShouldSyncTransactions = 'should_sync_transactions'
}

/** input type for updating data in table "destinations" */
export type Destinations_Set_Input = {
  authentication?: InputMaybe<Scalars['jsonb']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  disabled_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  integration_id?: InputMaybe<Integrations_Enum>;
  is_ready?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  notion_connection_id?: InputMaybe<Scalars['String']>;
  should_override_transaction_name?: InputMaybe<Scalars['Boolean']>;
  should_sync_investments?: InputMaybe<Scalars['Boolean']>;
  should_sync_transactions?: InputMaybe<Scalars['Boolean']>;
  sync_start_date?: InputMaybe<Scalars['String']>;
  table_configs?: InputMaybe<Scalars['jsonb']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_id?: InputMaybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "destinations" */
export type Destinations_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Destinations_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Destinations_Stream_Cursor_Value_Input = {
  authentication?: InputMaybe<Scalars['jsonb']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  disabled_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['uuid']>;
  integration_id?: InputMaybe<Integrations_Enum>;
  is_ready?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  notion_connection_id?: InputMaybe<Scalars['String']>;
  should_override_transaction_name?: InputMaybe<Scalars['Boolean']>;
  should_sync_investments?: InputMaybe<Scalars['Boolean']>;
  should_sync_transactions?: InputMaybe<Scalars['Boolean']>;
  sync_start_date?: InputMaybe<Scalars['String']>;
  table_configs?: InputMaybe<Scalars['jsonb']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "destinations" */
export enum Destinations_Update_Column {
  /** column name */
  Authentication = 'authentication',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DisabledAt = 'disabled_at',
  /** column name */
  Id = 'id',
  /** column name */
  IntegrationId = 'integration_id',
  /** column name */
  IsReady = 'is_ready',
  /** column name */
  Name = 'name',
  /** column name */
  NotionConnectionId = 'notion_connection_id',
  /** column name */
  ShouldOverrideTransactionName = 'should_override_transaction_name',
  /** column name */
  ShouldSyncInvestments = 'should_sync_investments',
  /** column name */
  ShouldSyncTransactions = 'should_sync_transactions',
  /** column name */
  SyncStartDate = 'sync_start_date',
  /** column name */
  TableConfigs = 'table_configs',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'user_id'
}

export type Destinations_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Destinations_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Destinations_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Destinations_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Destinations_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Destinations_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Destinations_Set_Input>;
  where: Destinations_Bool_Exp;
};

/** columns and relationships of "storage.files" */
export type Files = {
  __typename?: 'files';
  /** An object relationship */
  bucket: Buckets;
  bucketId: Scalars['String'];
  createdAt: Scalars['timestamptz'];
  etag?: Maybe<Scalars['String']>;
  id: Scalars['uuid'];
  isUploaded?: Maybe<Scalars['Boolean']>;
  mimeType?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Int']>;
  updatedAt: Scalars['timestamptz'];
  uploadedByUserId?: Maybe<Scalars['uuid']>;
};

/** aggregated selection of "storage.files" */
export type Files_Aggregate = {
  __typename?: 'files_aggregate';
  aggregate?: Maybe<Files_Aggregate_Fields>;
  nodes: Array<Files>;
};

export type Files_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Files_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Files_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Files_Aggregate_Bool_Exp_Count>;
};

export type Files_Aggregate_Bool_Exp_Bool_And = {
  arguments: Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Files_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Files_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Files_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Files_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Files_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Files_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "storage.files" */
export type Files_Aggregate_Fields = {
  __typename?: 'files_aggregate_fields';
  avg?: Maybe<Files_Avg_Fields>;
  count: Scalars['Int'];
  max?: Maybe<Files_Max_Fields>;
  min?: Maybe<Files_Min_Fields>;
  stddev?: Maybe<Files_Stddev_Fields>;
  stddev_pop?: Maybe<Files_Stddev_Pop_Fields>;
  stddev_samp?: Maybe<Files_Stddev_Samp_Fields>;
  sum?: Maybe<Files_Sum_Fields>;
  var_pop?: Maybe<Files_Var_Pop_Fields>;
  var_samp?: Maybe<Files_Var_Samp_Fields>;
  variance?: Maybe<Files_Variance_Fields>;
};


/** aggregate fields of "storage.files" */
export type Files_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Files_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "storage.files" */
export type Files_Aggregate_Order_By = {
  avg?: InputMaybe<Files_Avg_Order_By>;
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Files_Max_Order_By>;
  min?: InputMaybe<Files_Min_Order_By>;
  stddev?: InputMaybe<Files_Stddev_Order_By>;
  stddev_pop?: InputMaybe<Files_Stddev_Pop_Order_By>;
  stddev_samp?: InputMaybe<Files_Stddev_Samp_Order_By>;
  sum?: InputMaybe<Files_Sum_Order_By>;
  var_pop?: InputMaybe<Files_Var_Pop_Order_By>;
  var_samp?: InputMaybe<Files_Var_Samp_Order_By>;
  variance?: InputMaybe<Files_Variance_Order_By>;
};

/** input type for inserting array relation for remote table "storage.files" */
export type Files_Arr_Rel_Insert_Input = {
  data: Array<Files_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Files_On_Conflict>;
};

/** aggregate avg on columns */
export type Files_Avg_Fields = {
  __typename?: 'files_avg_fields';
  size?: Maybe<Scalars['Float']>;
};

/** order by avg() on columns of table "storage.files" */
export type Files_Avg_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** Boolean expression to filter rows from the table "storage.files". All fields are combined with a logical 'AND'. */
export type Files_Bool_Exp = {
  _and?: InputMaybe<Array<Files_Bool_Exp>>;
  _not?: InputMaybe<Files_Bool_Exp>;
  _or?: InputMaybe<Array<Files_Bool_Exp>>;
  bucket?: InputMaybe<Buckets_Bool_Exp>;
  bucketId?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  etag?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isUploaded?: InputMaybe<Boolean_Comparison_Exp>;
  mimeType?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  size?: InputMaybe<Int_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  uploadedByUserId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "storage.files" */
export enum Files_Constraint {
  /** unique or primary key constraint on columns "id" */
  FilesPkey = 'files_pkey'
}

/** input type for incrementing numeric columns in table "storage.files" */
export type Files_Inc_Input = {
  size?: InputMaybe<Scalars['Int']>;
};

/** input type for inserting data into table "storage.files" */
export type Files_Insert_Input = {
  bucket?: InputMaybe<Buckets_Obj_Rel_Insert_Input>;
  bucketId?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  etag?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  isUploaded?: InputMaybe<Scalars['Boolean']>;
  mimeType?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  uploadedByUserId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Files_Max_Fields = {
  __typename?: 'files_max_fields';
  bucketId?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  etag?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  mimeType?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  uploadedByUserId?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "storage.files" */
export type Files_Max_Order_By = {
  bucketId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  etag?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mimeType?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  uploadedByUserId?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Files_Min_Fields = {
  __typename?: 'files_min_fields';
  bucketId?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  etag?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['uuid']>;
  mimeType?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
  uploadedByUserId?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "storage.files" */
export type Files_Min_Order_By = {
  bucketId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  etag?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mimeType?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  uploadedByUserId?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "storage.files" */
export type Files_Mutation_Response = {
  __typename?: 'files_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Files>;
};

/** input type for inserting object relation for remote table "storage.files" */
export type Files_Obj_Rel_Insert_Input = {
  data: Files_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Files_On_Conflict>;
};

/** on_conflict condition type for table "storage.files" */
export type Files_On_Conflict = {
  constraint: Files_Constraint;
  update_columns?: Array<Files_Update_Column>;
  where?: InputMaybe<Files_Bool_Exp>;
};

/** Ordering options when selecting data from "storage.files". */
export type Files_Order_By = {
  bucket?: InputMaybe<Buckets_Order_By>;
  bucketId?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  etag?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isUploaded?: InputMaybe<Order_By>;
  mimeType?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  size?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  uploadedByUserId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: storage.files */
export type Files_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "storage.files" */
export enum Files_Select_Column {
  /** column name */
  BucketId = 'bucketId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Etag = 'etag',
  /** column name */
  Id = 'id',
  /** column name */
  IsUploaded = 'isUploaded',
  /** column name */
  MimeType = 'mimeType',
  /** column name */
  Name = 'name',
  /** column name */
  Size = 'size',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UploadedByUserId = 'uploadedByUserId'
}

/** select "files_aggregate_bool_exp_bool_and_arguments_columns" columns of table "storage.files" */
export enum Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsUploaded = 'isUploaded'
}

/** select "files_aggregate_bool_exp_bool_or_arguments_columns" columns of table "storage.files" */
export enum Files_Select_Column_Files_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsUploaded = 'isUploaded'
}

/** input type for updating data in table "storage.files" */
export type Files_Set_Input = {
  bucketId?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  etag?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  isUploaded?: InputMaybe<Scalars['Boolean']>;
  mimeType?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  uploadedByUserId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate stddev on columns */
export type Files_Stddev_Fields = {
  __typename?: 'files_stddev_fields';
  size?: Maybe<Scalars['Float']>;
};

/** order by stddev() on columns of table "storage.files" */
export type Files_Stddev_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** aggregate stddev_pop on columns */
export type Files_Stddev_Pop_Fields = {
  __typename?: 'files_stddev_pop_fields';
  size?: Maybe<Scalars['Float']>;
};

/** order by stddev_pop() on columns of table "storage.files" */
export type Files_Stddev_Pop_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** aggregate stddev_samp on columns */
export type Files_Stddev_Samp_Fields = {
  __typename?: 'files_stddev_samp_fields';
  size?: Maybe<Scalars['Float']>;
};

/** order by stddev_samp() on columns of table "storage.files" */
export type Files_Stddev_Samp_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** Streaming cursor of the table "files" */
export type Files_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Files_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Files_Stream_Cursor_Value_Input = {
  bucketId?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  etag?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['uuid']>;
  isUploaded?: InputMaybe<Scalars['Boolean']>;
  mimeType?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['Int']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  uploadedByUserId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate sum on columns */
export type Files_Sum_Fields = {
  __typename?: 'files_sum_fields';
  size?: Maybe<Scalars['Int']>;
};

/** order by sum() on columns of table "storage.files" */
export type Files_Sum_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** update columns of table "storage.files" */
export enum Files_Update_Column {
  /** column name */
  BucketId = 'bucketId',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Etag = 'etag',
  /** column name */
  Id = 'id',
  /** column name */
  IsUploaded = 'isUploaded',
  /** column name */
  MimeType = 'mimeType',
  /** column name */
  Name = 'name',
  /** column name */
  Size = 'size',
  /** column name */
  UpdatedAt = 'updatedAt',
  /** column name */
  UploadedByUserId = 'uploadedByUserId'
}

export type Files_Updates = {
  /** increments the numeric columns with given value of the filtered values */
  _inc?: InputMaybe<Files_Inc_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Files_Set_Input>;
  where: Files_Bool_Exp;
};

/** aggregate var_pop on columns */
export type Files_Var_Pop_Fields = {
  __typename?: 'files_var_pop_fields';
  size?: Maybe<Scalars['Float']>;
};

/** order by var_pop() on columns of table "storage.files" */
export type Files_Var_Pop_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** aggregate var_samp on columns */
export type Files_Var_Samp_Fields = {
  __typename?: 'files_var_samp_fields';
  size?: Maybe<Scalars['Float']>;
};

/** order by var_samp() on columns of table "storage.files" */
export type Files_Var_Samp_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** aggregate variance on columns */
export type Files_Variance_Fields = {
  __typename?: 'files_variance_fields';
  size?: Maybe<Scalars['Float']>;
};

/** order by variance() on columns of table "storage.files" */
export type Files_Variance_Order_By = {
  size?: InputMaybe<Order_By>;
};

/** columns and relationships of "frequencies" */
export type Frequencies = {
  __typename?: 'frequencies';
  id: Scalars['String'];
};

/** aggregated selection of "frequencies" */
export type Frequencies_Aggregate = {
  __typename?: 'frequencies_aggregate';
  aggregate?: Maybe<Frequencies_Aggregate_Fields>;
  nodes: Array<Frequencies>;
};

/** aggregate fields of "frequencies" */
export type Frequencies_Aggregate_Fields = {
  __typename?: 'frequencies_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Frequencies_Max_Fields>;
  min?: Maybe<Frequencies_Min_Fields>;
};


/** aggregate fields of "frequencies" */
export type Frequencies_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Frequencies_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "frequencies". All fields are combined with a logical 'AND'. */
export type Frequencies_Bool_Exp = {
  _and?: InputMaybe<Array<Frequencies_Bool_Exp>>;
  _not?: InputMaybe<Frequencies_Bool_Exp>;
  _or?: InputMaybe<Array<Frequencies_Bool_Exp>>;
  id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "frequencies" */
export enum Frequencies_Constraint {
  /** unique or primary key constraint on columns "id" */
  FrequenciesPkey = 'frequencies_pkey'
}

export enum Frequencies_Enum {
  Daily = 'daily',
  Monthly = 'monthly',
  Quarterly = 'quarterly',
  Weekly = 'weekly',
  Yearly = 'yearly'
}

/** Boolean expression to compare columns of type "frequencies_enum". All fields are combined with logical 'AND'. */
export type Frequencies_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Frequencies_Enum>;
  _in?: InputMaybe<Array<Frequencies_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Frequencies_Enum>;
  _nin?: InputMaybe<Array<Frequencies_Enum>>;
};

/** input type for inserting data into table "frequencies" */
export type Frequencies_Insert_Input = {
  id?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Frequencies_Max_Fields = {
  __typename?: 'frequencies_max_fields';
  id?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Frequencies_Min_Fields = {
  __typename?: 'frequencies_min_fields';
  id?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "frequencies" */
export type Frequencies_Mutation_Response = {
  __typename?: 'frequencies_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Frequencies>;
};

/** on_conflict condition type for table "frequencies" */
export type Frequencies_On_Conflict = {
  constraint: Frequencies_Constraint;
  update_columns?: Array<Frequencies_Update_Column>;
  where?: InputMaybe<Frequencies_Bool_Exp>;
};

/** Ordering options when selecting data from "frequencies". */
export type Frequencies_Order_By = {
  id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: frequencies */
export type Frequencies_Pk_Columns_Input = {
  id: Scalars['String'];
};

/** select columns of table "frequencies" */
export enum Frequencies_Select_Column {
  /** column name */
  Id = 'id'
}

/** input type for updating data in table "frequencies" */
export type Frequencies_Set_Input = {
  id?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "frequencies" */
export type Frequencies_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Frequencies_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Frequencies_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['String']>;
};

/** update columns of table "frequencies" */
export enum Frequencies_Update_Column {
  /** column name */
  Id = 'id'
}

export type Frequencies_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Frequencies_Set_Input>;
  where: Frequencies_Bool_Exp;
};

/** columns and relationships of "integrations" */
export type Integrations = {
  __typename?: 'integrations';
  /** An array relationship */
  destinations: Array<Destinations>;
  /** An aggregate relationship */
  destinations_aggregate: Destinations_Aggregate;
  id: Scalars['String'];
  name: Scalars['String'];
};


/** columns and relationships of "integrations" */
export type IntegrationsDestinationsArgs = {
  distinct_on?: InputMaybe<Array<Destinations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destinations_Order_By>>;
  where?: InputMaybe<Destinations_Bool_Exp>;
};


/** columns and relationships of "integrations" */
export type IntegrationsDestinations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Destinations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destinations_Order_By>>;
  where?: InputMaybe<Destinations_Bool_Exp>;
};

/** aggregated selection of "integrations" */
export type Integrations_Aggregate = {
  __typename?: 'integrations_aggregate';
  aggregate?: Maybe<Integrations_Aggregate_Fields>;
  nodes: Array<Integrations>;
};

/** aggregate fields of "integrations" */
export type Integrations_Aggregate_Fields = {
  __typename?: 'integrations_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Integrations_Max_Fields>;
  min?: Maybe<Integrations_Min_Fields>;
};


/** aggregate fields of "integrations" */
export type Integrations_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Integrations_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "integrations". All fields are combined with a logical 'AND'. */
export type Integrations_Bool_Exp = {
  _and?: InputMaybe<Array<Integrations_Bool_Exp>>;
  _not?: InputMaybe<Integrations_Bool_Exp>;
  _or?: InputMaybe<Array<Integrations_Bool_Exp>>;
  destinations?: InputMaybe<Destinations_Bool_Exp>;
  destinations_aggregate?: InputMaybe<Destinations_Aggregate_Bool_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "integrations" */
export enum Integrations_Constraint {
  /** unique or primary key constraint on columns "id" */
  IntegrationsPkey = 'integrations_pkey'
}

export enum Integrations_Enum {
  /** Airtable */
  Airtable = 'airtable',
  /** Coda */
  Coda = 'coda',
  /** Google Sheets */
  Google = 'google',
  /** Notion */
  Notion = 'notion'
}

/** Boolean expression to compare columns of type "integrations_enum". All fields are combined with logical 'AND'. */
export type Integrations_Enum_Comparison_Exp = {
  _eq?: InputMaybe<Integrations_Enum>;
  _in?: InputMaybe<Array<Integrations_Enum>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _neq?: InputMaybe<Integrations_Enum>;
  _nin?: InputMaybe<Array<Integrations_Enum>>;
};

/** input type for inserting data into table "integrations" */
export type Integrations_Insert_Input = {
  destinations?: InputMaybe<Destinations_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Integrations_Max_Fields = {
  __typename?: 'integrations_max_fields';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Integrations_Min_Fields = {
  __typename?: 'integrations_min_fields';
  id?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "integrations" */
export type Integrations_Mutation_Response = {
  __typename?: 'integrations_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Integrations>;
};

/** input type for inserting object relation for remote table "integrations" */
export type Integrations_Obj_Rel_Insert_Input = {
  data: Integrations_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Integrations_On_Conflict>;
};

/** on_conflict condition type for table "integrations" */
export type Integrations_On_Conflict = {
  constraint: Integrations_Constraint;
  update_columns?: Array<Integrations_Update_Column>;
  where?: InputMaybe<Integrations_Bool_Exp>;
};

/** Ordering options when selecting data from "integrations". */
export type Integrations_Order_By = {
  destinations_aggregate?: InputMaybe<Destinations_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: integrations */
export type Integrations_Pk_Columns_Input = {
  id: Scalars['String'];
};

/** select columns of table "integrations" */
export enum Integrations_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "integrations" */
export type Integrations_Set_Input = {
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "integrations" */
export type Integrations_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Integrations_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Integrations_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "integrations" */
export enum Integrations_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  Name = 'name'
}

export type Integrations_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Integrations_Set_Input>;
  where: Integrations_Bool_Exp;
};

export type Jsonb_Cast_Exp = {
  String?: InputMaybe<String_Comparison_Exp>;
};

/** Boolean expression to compare columns of type "jsonb". All fields are combined with logical 'AND'. */
export type Jsonb_Comparison_Exp = {
  _cast?: InputMaybe<Jsonb_Cast_Exp>;
  /** is the column contained in the given json value */
  _contained_in?: InputMaybe<Scalars['jsonb']>;
  /** does the column contain the given json value at the top level */
  _contains?: InputMaybe<Scalars['jsonb']>;
  _eq?: InputMaybe<Scalars['jsonb']>;
  _gt?: InputMaybe<Scalars['jsonb']>;
  _gte?: InputMaybe<Scalars['jsonb']>;
  /** does the string exist as a top-level key in the column */
  _has_key?: InputMaybe<Scalars['String']>;
  /** do all of these strings exist as top-level keys in the column */
  _has_keys_all?: InputMaybe<Array<Scalars['String']>>;
  /** do any of these strings exist as top-level keys in the column */
  _has_keys_any?: InputMaybe<Array<Scalars['String']>>;
  _in?: InputMaybe<Array<Scalars['jsonb']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['jsonb']>;
  _lte?: InputMaybe<Scalars['jsonb']>;
  _neq?: InputMaybe<Scalars['jsonb']>;
  _nin?: InputMaybe<Array<Scalars['jsonb']>>;
};

/** mutation root */
export type Mutation_Root = {
  __typename?: 'mutation_root';
  /** delete single row from the table: "auth.providers" */
  deleteAuthProvider?: Maybe<AuthProviders>;
  /** delete single row from the table: "auth.provider_requests" */
  deleteAuthProviderRequest?: Maybe<AuthProviderRequests>;
  /** delete data from the table: "auth.provider_requests" */
  deleteAuthProviderRequests?: Maybe<AuthProviderRequests_Mutation_Response>;
  /** delete data from the table: "auth.providers" */
  deleteAuthProviders?: Maybe<AuthProviders_Mutation_Response>;
  /** delete single row from the table: "auth.refresh_tokens" */
  deleteAuthRefreshToken?: Maybe<AuthRefreshTokens>;
  /** delete data from the table: "auth.refresh_tokens" */
  deleteAuthRefreshTokens?: Maybe<AuthRefreshTokens_Mutation_Response>;
  /** delete single row from the table: "auth.roles" */
  deleteAuthRole?: Maybe<AuthRoles>;
  /** delete data from the table: "auth.roles" */
  deleteAuthRoles?: Maybe<AuthRoles_Mutation_Response>;
  /** delete single row from the table: "auth.user_providers" */
  deleteAuthUserProvider?: Maybe<AuthUserProviders>;
  /** delete data from the table: "auth.user_providers" */
  deleteAuthUserProviders?: Maybe<AuthUserProviders_Mutation_Response>;
  /** delete single row from the table: "auth.user_roles" */
  deleteAuthUserRole?: Maybe<AuthUserRoles>;
  /** delete data from the table: "auth.user_roles" */
  deleteAuthUserRoles?: Maybe<AuthUserRoles_Mutation_Response>;
  /** delete single row from the table: "auth.user_security_keys" */
  deleteAuthUserSecurityKey?: Maybe<AuthUserSecurityKeys>;
  /** delete data from the table: "auth.user_security_keys" */
  deleteAuthUserSecurityKeys?: Maybe<AuthUserSecurityKeys_Mutation_Response>;
  /** delete single row from the table: "storage.buckets" */
  deleteBucket?: Maybe<Buckets>;
  /** delete data from the table: "storage.buckets" */
  deleteBuckets?: Maybe<Buckets_Mutation_Response>;
  /** delete single row from the table: "storage.files" */
  deleteFile?: Maybe<Files>;
  /** delete data from the table: "storage.files" */
  deleteFiles?: Maybe<Files_Mutation_Response>;
  /** delete single row from the table: "plaid_accounts" */
  deletePlaidAccount?: Maybe<PlaidAccounts>;
  /** delete data from the table: "plaid_accounts" */
  deletePlaidAccounts?: Maybe<PlaidAccounts_Mutation_Response>;
  /** delete single row from the table: "stripe_webhook_events" */
  deleteStripeWebhookEvent?: Maybe<StripeWebhookEvents>;
  /** delete data from the table: "stripe_webhook_events" */
  deleteStripeWebhookEvents?: Maybe<StripeWebhookEvents_Mutation_Response>;
  /** delete single row from the table: "auth.users" */
  deleteUser?: Maybe<Users>;
  /** delete single row from the table: "user_profiles" */
  deleteUserProfile?: Maybe<UserProfiles>;
  /** delete data from the table: "user_profiles" */
  deleteUserProfiles?: Maybe<UserProfiles_Mutation_Response>;
  /** delete data from the table: "auth.users" */
  deleteUsers?: Maybe<Users_Mutation_Response>;
  /** delete data from the table: "airtable_configs" */
  delete_airtable_configs?: Maybe<Airtable_Configs_Mutation_Response>;
  /** delete single row from the table: "airtable_configs" */
  delete_airtable_configs_by_pk?: Maybe<Airtable_Configs>;
  /** delete data from the table: "coda_configs" */
  delete_coda_configs?: Maybe<Coda_Configs_Mutation_Response>;
  /** delete single row from the table: "coda_configs" */
  delete_coda_configs_by_pk?: Maybe<Coda_Configs>;
  /** delete data from the table: "destination_accounts" */
  delete_destination_accounts?: Maybe<Destination_Accounts_Mutation_Response>;
  /** delete single row from the table: "destination_accounts" */
  delete_destination_accounts_by_pk?: Maybe<Destination_Accounts>;
  /** delete data from the table: "destination_sync_logs" */
  delete_destination_sync_logs?: Maybe<Destination_Sync_Logs_Mutation_Response>;
  /** delete single row from the table: "destination_sync_logs" */
  delete_destination_sync_logs_by_pk?: Maybe<Destination_Sync_Logs>;
  /** delete data from the table: "destinations" */
  delete_destinations?: Maybe<Destinations_Mutation_Response>;
  /** delete single row from the table: "destinations" */
  delete_destinations_by_pk?: Maybe<Destinations>;
  /** delete data from the table: "frequencies" */
  delete_frequencies?: Maybe<Frequencies_Mutation_Response>;
  /** delete single row from the table: "frequencies" */
  delete_frequencies_by_pk?: Maybe<Frequencies>;
  /** delete data from the table: "integrations" */
  delete_integrations?: Maybe<Integrations_Mutation_Response>;
  /** delete single row from the table: "integrations" */
  delete_integrations_by_pk?: Maybe<Integrations>;
  /** delete data from the table: "notion_connections" */
  delete_notion_connections?: Maybe<Notion_Connections_Mutation_Response>;
  /** delete single row from the table: "notion_connections" */
  delete_notion_connections_by_pk?: Maybe<Notion_Connections>;
  /** delete data from the table: "oauth_clients" */
  delete_oauth_clients?: Maybe<Oauth_Clients_Mutation_Response>;
  /** delete single row from the table: "oauth_clients" */
  delete_oauth_clients_by_pk?: Maybe<Oauth_Clients>;
  /** delete data from the table: "oauth_codes" */
  delete_oauth_codes?: Maybe<Oauth_Codes_Mutation_Response>;
  /** delete single row from the table: "oauth_codes" */
  delete_oauth_codes_by_pk?: Maybe<Oauth_Codes>;
  /** delete data from the table: "plaid_institutions" */
  delete_plaid_institutions?: Maybe<Plaid_Institutions_Mutation_Response>;
  /** delete single row from the table: "plaid_institutions" */
  delete_plaid_institutions_by_pk?: Maybe<Plaid_Institutions>;
  /** delete data from the table: "plaid_item_sync_logs" */
  delete_plaid_item_sync_logs?: Maybe<Plaid_Item_Sync_Logs_Mutation_Response>;
  /** delete single row from the table: "plaid_item_sync_logs" */
  delete_plaid_item_sync_logs_by_pk?: Maybe<Plaid_Item_Sync_Logs>;
  /** delete data from the table: "plaid_items" */
  delete_plaid_items?: Maybe<Plaid_Items_Mutation_Response>;
  /** delete single row from the table: "plaid_items" */
  delete_plaid_items_by_pk?: Maybe<Plaid_Items>;
  /** delete data from the table: "removed_plaid_transactions" */
  delete_removed_plaid_transactions?: Maybe<Removed_Plaid_Transactions_Mutation_Response>;
  /** delete single row from the table: "removed_plaid_transactions" */
  delete_removed_plaid_transactions_by_pk?: Maybe<Removed_Plaid_Transactions>;
  /** delete data from the table: "sync_logs" */
  delete_sync_logs?: Maybe<Sync_Logs_Mutation_Response>;
  /** delete single row from the table: "sync_logs" */
  delete_sync_logs_by_pk?: Maybe<Sync_Logs>;
  /** insert a single row into the table: "auth.providers" */
  insertAuthProvider?: Maybe<AuthProviders>;
  /** insert a single row into the table: "auth.provider_requests" */
  insertAuthProviderRequest?: Maybe<AuthProviderRequests>;
  /** insert data into the table: "auth.provider_requests" */
  insertAuthProviderRequests?: Maybe<AuthProviderRequests_Mutation_Response>;
  /** insert data into the table: "auth.providers" */
  insertAuthProviders?: Maybe<AuthProviders_Mutation_Response>;
  /** insert a single row into the table: "auth.refresh_tokens" */
  insertAuthRefreshToken?: Maybe<AuthRefreshTokens>;
  /** insert data into the table: "auth.refresh_tokens" */
  insertAuthRefreshTokens?: Maybe<AuthRefreshTokens_Mutation_Response>;
  /** insert a single row into the table: "auth.roles" */
  insertAuthRole?: Maybe<AuthRoles>;
  /** insert data into the table: "auth.roles" */
  insertAuthRoles?: Maybe<AuthRoles_Mutation_Response>;
  /** insert a single row into the table: "auth.user_providers" */
  insertAuthUserProvider?: Maybe<AuthUserProviders>;
  /** insert data into the table: "auth.user_providers" */
  insertAuthUserProviders?: Maybe<AuthUserProviders_Mutation_Response>;
  /** insert a single row into the table: "auth.user_roles" */
  insertAuthUserRole?: Maybe<AuthUserRoles>;
  /** insert data into the table: "auth.user_roles" */
  insertAuthUserRoles?: Maybe<AuthUserRoles_Mutation_Response>;
  /** insert a single row into the table: "auth.user_security_keys" */
  insertAuthUserSecurityKey?: Maybe<AuthUserSecurityKeys>;
  /** insert data into the table: "auth.user_security_keys" */
  insertAuthUserSecurityKeys?: Maybe<AuthUserSecurityKeys_Mutation_Response>;
  /** insert a single row into the table: "storage.buckets" */
  insertBucket?: Maybe<Buckets>;
  /** insert data into the table: "storage.buckets" */
  insertBuckets?: Maybe<Buckets_Mutation_Response>;
  /** insert a single row into the table: "storage.files" */
  insertFile?: Maybe<Files>;
  /** insert data into the table: "storage.files" */
  insertFiles?: Maybe<Files_Mutation_Response>;
  /** insert a single row into the table: "plaid_accounts" */
  insertPlaidAccount?: Maybe<PlaidAccounts>;
  /** insert data into the table: "plaid_accounts" */
  insertPlaidAccounts?: Maybe<PlaidAccounts_Mutation_Response>;
  /** insert a single row into the table: "plaid_items" */
  insertPlaidItem?: Maybe<Plaid_Items>;
  /** insert a single row into the table: "stripe_webhook_events" */
  insertStripeWebhookEvent?: Maybe<StripeWebhookEvents>;
  /** insert data into the table: "stripe_webhook_events" */
  insertStripeWebhookEvents?: Maybe<StripeWebhookEvents_Mutation_Response>;
  /** insert a single row into the table: "auth.users" */
  insertUser?: Maybe<Users>;
  /** insert a single row into the table: "user_profiles" */
  insertUserProfile?: Maybe<UserProfiles>;
  /** insert data into the table: "user_profiles" */
  insertUserProfiles?: Maybe<UserProfiles_Mutation_Response>;
  /** insert data into the table: "auth.users" */
  insertUsers?: Maybe<Users_Mutation_Response>;
  /** insert data into the table: "airtable_configs" */
  insert_airtable_configs?: Maybe<Airtable_Configs_Mutation_Response>;
  /** insert a single row into the table: "airtable_configs" */
  insert_airtable_configs_one?: Maybe<Airtable_Configs>;
  /** insert data into the table: "coda_configs" */
  insert_coda_configs?: Maybe<Coda_Configs_Mutation_Response>;
  /** insert a single row into the table: "coda_configs" */
  insert_coda_configs_one?: Maybe<Coda_Configs>;
  /** insert data into the table: "destination_accounts" */
  insert_destination_accounts?: Maybe<Destination_Accounts_Mutation_Response>;
  /** insert a single row into the table: "destination_accounts" */
  insert_destination_accounts_one?: Maybe<Destination_Accounts>;
  /** insert data into the table: "destination_sync_logs" */
  insert_destination_sync_logs?: Maybe<Destination_Sync_Logs_Mutation_Response>;
  /** insert a single row into the table: "destination_sync_logs" */
  insert_destination_sync_logs_one?: Maybe<Destination_Sync_Logs>;
  /** insert data into the table: "destinations" */
  insert_destinations?: Maybe<Destinations_Mutation_Response>;
  /** insert a single row into the table: "destinations" */
  insert_destinations_one?: Maybe<Destinations>;
  /** insert data into the table: "frequencies" */
  insert_frequencies?: Maybe<Frequencies_Mutation_Response>;
  /** insert a single row into the table: "frequencies" */
  insert_frequencies_one?: Maybe<Frequencies>;
  /** insert data into the table: "integrations" */
  insert_integrations?: Maybe<Integrations_Mutation_Response>;
  /** insert a single row into the table: "integrations" */
  insert_integrations_one?: Maybe<Integrations>;
  /** insert data into the table: "notion_connections" */
  insert_notion_connections?: Maybe<Notion_Connections_Mutation_Response>;
  /** insert a single row into the table: "notion_connections" */
  insert_notion_connections_one?: Maybe<Notion_Connections>;
  /** insert data into the table: "oauth_clients" */
  insert_oauth_clients?: Maybe<Oauth_Clients_Mutation_Response>;
  /** insert a single row into the table: "oauth_clients" */
  insert_oauth_clients_one?: Maybe<Oauth_Clients>;
  /** insert data into the table: "oauth_codes" */
  insert_oauth_codes?: Maybe<Oauth_Codes_Mutation_Response>;
  /** insert a single row into the table: "oauth_codes" */
  insert_oauth_codes_one?: Maybe<Oauth_Codes>;
  /** insert data into the table: "plaid_institutions" */
  insert_plaid_institutions?: Maybe<Plaid_Institutions_Mutation_Response>;
  /** insert a single row into the table: "plaid_institutions" */
  insert_plaid_institutions_one?: Maybe<Plaid_Institutions>;
  /** insert data into the table: "plaid_item_sync_logs" */
  insert_plaid_item_sync_logs?: Maybe<Plaid_Item_Sync_Logs_Mutation_Response>;
  /** insert a single row into the table: "plaid_item_sync_logs" */
  insert_plaid_item_sync_logs_one?: Maybe<Plaid_Item_Sync_Logs>;
  /** insert data into the table: "plaid_items" */
  insert_plaid_items?: Maybe<Plaid_Items_Mutation_Response>;
  /** insert data into the table: "removed_plaid_transactions" */
  insert_removed_plaid_transactions?: Maybe<Removed_Plaid_Transactions_Mutation_Response>;
  /** insert a single row into the table: "removed_plaid_transactions" */
  insert_removed_plaid_transactions_one?: Maybe<Removed_Plaid_Transactions>;
  /** insert data into the table: "sync_logs" */
  insert_sync_logs?: Maybe<Sync_Logs_Mutation_Response>;
  /** insert a single row into the table: "sync_logs" */
  insert_sync_logs_one?: Maybe<Sync_Logs>;
  /** update single row of the table: "auth.providers" */
  updateAuthProvider?: Maybe<AuthProviders>;
  /** update single row of the table: "auth.provider_requests" */
  updateAuthProviderRequest?: Maybe<AuthProviderRequests>;
  /** update data of the table: "auth.provider_requests" */
  updateAuthProviderRequests?: Maybe<AuthProviderRequests_Mutation_Response>;
  /** update data of the table: "auth.providers" */
  updateAuthProviders?: Maybe<AuthProviders_Mutation_Response>;
  /** update single row of the table: "auth.refresh_tokens" */
  updateAuthRefreshToken?: Maybe<AuthRefreshTokens>;
  /** update data of the table: "auth.refresh_tokens" */
  updateAuthRefreshTokens?: Maybe<AuthRefreshTokens_Mutation_Response>;
  /** update single row of the table: "auth.roles" */
  updateAuthRole?: Maybe<AuthRoles>;
  /** update data of the table: "auth.roles" */
  updateAuthRoles?: Maybe<AuthRoles_Mutation_Response>;
  /** update single row of the table: "auth.user_providers" */
  updateAuthUserProvider?: Maybe<AuthUserProviders>;
  /** update data of the table: "auth.user_providers" */
  updateAuthUserProviders?: Maybe<AuthUserProviders_Mutation_Response>;
  /** update single row of the table: "auth.user_roles" */
  updateAuthUserRole?: Maybe<AuthUserRoles>;
  /** update data of the table: "auth.user_roles" */
  updateAuthUserRoles?: Maybe<AuthUserRoles_Mutation_Response>;
  /** update single row of the table: "auth.user_security_keys" */
  updateAuthUserSecurityKey?: Maybe<AuthUserSecurityKeys>;
  /** update data of the table: "auth.user_security_keys" */
  updateAuthUserSecurityKeys?: Maybe<AuthUserSecurityKeys_Mutation_Response>;
  /** update single row of the table: "storage.buckets" */
  updateBucket?: Maybe<Buckets>;
  /** update data of the table: "storage.buckets" */
  updateBuckets?: Maybe<Buckets_Mutation_Response>;
  /** update single row of the table: "storage.files" */
  updateFile?: Maybe<Files>;
  /** update data of the table: "storage.files" */
  updateFiles?: Maybe<Files_Mutation_Response>;
  /** update single row of the table: "plaid_accounts" */
  updatePlaidAccount?: Maybe<PlaidAccounts>;
  /** update data of the table: "plaid_accounts" */
  updatePlaidAccounts?: Maybe<PlaidAccounts_Mutation_Response>;
  /** update single row of the table: "stripe_webhook_events" */
  updateStripeWebhookEvent?: Maybe<StripeWebhookEvents>;
  /** update data of the table: "stripe_webhook_events" */
  updateStripeWebhookEvents?: Maybe<StripeWebhookEvents_Mutation_Response>;
  /** update single row of the table: "auth.users" */
  updateUser?: Maybe<Users>;
  /** update single row of the table: "user_profiles" */
  updateUserProfile?: Maybe<UserProfiles>;
  /** update data of the table: "user_profiles" */
  updateUserProfiles?: Maybe<UserProfiles_Mutation_Response>;
  /** update data of the table: "auth.users" */
  updateUsers?: Maybe<Users_Mutation_Response>;
  /** update data of the table: "airtable_configs" */
  update_airtable_configs?: Maybe<Airtable_Configs_Mutation_Response>;
  /** update single row of the table: "airtable_configs" */
  update_airtable_configs_by_pk?: Maybe<Airtable_Configs>;
  /** update multiples rows of table: "airtable_configs" */
  update_airtable_configs_many?: Maybe<Array<Maybe<Airtable_Configs_Mutation_Response>>>;
  /** update multiples rows of table: "auth.provider_requests" */
  update_authProviderRequests_many?: Maybe<Array<Maybe<AuthProviderRequests_Mutation_Response>>>;
  /** update multiples rows of table: "auth.providers" */
  update_authProviders_many?: Maybe<Array<Maybe<AuthProviders_Mutation_Response>>>;
  /** update multiples rows of table: "auth.refresh_tokens" */
  update_authRefreshTokens_many?: Maybe<Array<Maybe<AuthRefreshTokens_Mutation_Response>>>;
  /** update multiples rows of table: "auth.roles" */
  update_authRoles_many?: Maybe<Array<Maybe<AuthRoles_Mutation_Response>>>;
  /** update multiples rows of table: "auth.user_providers" */
  update_authUserProviders_many?: Maybe<Array<Maybe<AuthUserProviders_Mutation_Response>>>;
  /** update multiples rows of table: "auth.user_roles" */
  update_authUserRoles_many?: Maybe<Array<Maybe<AuthUserRoles_Mutation_Response>>>;
  /** update multiples rows of table: "auth.user_security_keys" */
  update_authUserSecurityKeys_many?: Maybe<Array<Maybe<AuthUserSecurityKeys_Mutation_Response>>>;
  /** update multiples rows of table: "storage.buckets" */
  update_buckets_many?: Maybe<Array<Maybe<Buckets_Mutation_Response>>>;
  /** update data of the table: "coda_configs" */
  update_coda_configs?: Maybe<Coda_Configs_Mutation_Response>;
  /** update single row of the table: "coda_configs" */
  update_coda_configs_by_pk?: Maybe<Coda_Configs>;
  /** update multiples rows of table: "coda_configs" */
  update_coda_configs_many?: Maybe<Array<Maybe<Coda_Configs_Mutation_Response>>>;
  /** update data of the table: "destination_accounts" */
  update_destination_accounts?: Maybe<Destination_Accounts_Mutation_Response>;
  /** update single row of the table: "destination_accounts" */
  update_destination_accounts_by_pk?: Maybe<Destination_Accounts>;
  /** update multiples rows of table: "destination_accounts" */
  update_destination_accounts_many?: Maybe<Array<Maybe<Destination_Accounts_Mutation_Response>>>;
  /** update data of the table: "destination_sync_logs" */
  update_destination_sync_logs?: Maybe<Destination_Sync_Logs_Mutation_Response>;
  /** update single row of the table: "destination_sync_logs" */
  update_destination_sync_logs_by_pk?: Maybe<Destination_Sync_Logs>;
  /** update multiples rows of table: "destination_sync_logs" */
  update_destination_sync_logs_many?: Maybe<Array<Maybe<Destination_Sync_Logs_Mutation_Response>>>;
  /** update data of the table: "destinations" */
  update_destinations?: Maybe<Destinations_Mutation_Response>;
  /** update single row of the table: "destinations" */
  update_destinations_by_pk?: Maybe<Destinations>;
  /** update multiples rows of table: "destinations" */
  update_destinations_many?: Maybe<Array<Maybe<Destinations_Mutation_Response>>>;
  /** update multiples rows of table: "storage.files" */
  update_files_many?: Maybe<Array<Maybe<Files_Mutation_Response>>>;
  /** update data of the table: "frequencies" */
  update_frequencies?: Maybe<Frequencies_Mutation_Response>;
  /** update single row of the table: "frequencies" */
  update_frequencies_by_pk?: Maybe<Frequencies>;
  /** update multiples rows of table: "frequencies" */
  update_frequencies_many?: Maybe<Array<Maybe<Frequencies_Mutation_Response>>>;
  /** update data of the table: "integrations" */
  update_integrations?: Maybe<Integrations_Mutation_Response>;
  /** update single row of the table: "integrations" */
  update_integrations_by_pk?: Maybe<Integrations>;
  /** update multiples rows of table: "integrations" */
  update_integrations_many?: Maybe<Array<Maybe<Integrations_Mutation_Response>>>;
  /** update data of the table: "notion_connections" */
  update_notion_connections?: Maybe<Notion_Connections_Mutation_Response>;
  /** update single row of the table: "notion_connections" */
  update_notion_connections_by_pk?: Maybe<Notion_Connections>;
  /** update multiples rows of table: "notion_connections" */
  update_notion_connections_many?: Maybe<Array<Maybe<Notion_Connections_Mutation_Response>>>;
  /** update data of the table: "oauth_clients" */
  update_oauth_clients?: Maybe<Oauth_Clients_Mutation_Response>;
  /** update single row of the table: "oauth_clients" */
  update_oauth_clients_by_pk?: Maybe<Oauth_Clients>;
  /** update multiples rows of table: "oauth_clients" */
  update_oauth_clients_many?: Maybe<Array<Maybe<Oauth_Clients_Mutation_Response>>>;
  /** update data of the table: "oauth_codes" */
  update_oauth_codes?: Maybe<Oauth_Codes_Mutation_Response>;
  /** update single row of the table: "oauth_codes" */
  update_oauth_codes_by_pk?: Maybe<Oauth_Codes>;
  /** update multiples rows of table: "oauth_codes" */
  update_oauth_codes_many?: Maybe<Array<Maybe<Oauth_Codes_Mutation_Response>>>;
  /** update multiples rows of table: "plaid_accounts" */
  update_plaidAccounts_many?: Maybe<Array<Maybe<PlaidAccounts_Mutation_Response>>>;
  /** update data of the table: "plaid_institutions" */
  update_plaid_institutions?: Maybe<Plaid_Institutions_Mutation_Response>;
  /** update single row of the table: "plaid_institutions" */
  update_plaid_institutions_by_pk?: Maybe<Plaid_Institutions>;
  /** update multiples rows of table: "plaid_institutions" */
  update_plaid_institutions_many?: Maybe<Array<Maybe<Plaid_Institutions_Mutation_Response>>>;
  /** update data of the table: "plaid_item_sync_logs" */
  update_plaid_item_sync_logs?: Maybe<Plaid_Item_Sync_Logs_Mutation_Response>;
  /** update single row of the table: "plaid_item_sync_logs" */
  update_plaid_item_sync_logs_by_pk?: Maybe<Plaid_Item_Sync_Logs>;
  /** update multiples rows of table: "plaid_item_sync_logs" */
  update_plaid_item_sync_logs_many?: Maybe<Array<Maybe<Plaid_Item_Sync_Logs_Mutation_Response>>>;
  /** update data of the table: "plaid_items" */
  update_plaid_items?: Maybe<Plaid_Items_Mutation_Response>;
  /** update single row of the table: "plaid_items" */
  update_plaid_items_by_pk?: Maybe<Plaid_Items>;
  /** update multiples rows of table: "plaid_items" */
  update_plaid_items_many?: Maybe<Array<Maybe<Plaid_Items_Mutation_Response>>>;
  /** update data of the table: "removed_plaid_transactions" */
  update_removed_plaid_transactions?: Maybe<Removed_Plaid_Transactions_Mutation_Response>;
  /** update single row of the table: "removed_plaid_transactions" */
  update_removed_plaid_transactions_by_pk?: Maybe<Removed_Plaid_Transactions>;
  /** update multiples rows of table: "removed_plaid_transactions" */
  update_removed_plaid_transactions_many?: Maybe<Array<Maybe<Removed_Plaid_Transactions_Mutation_Response>>>;
  /** update multiples rows of table: "stripe_webhook_events" */
  update_stripeWebhookEvents_many?: Maybe<Array<Maybe<StripeWebhookEvents_Mutation_Response>>>;
  /** update data of the table: "sync_logs" */
  update_sync_logs?: Maybe<Sync_Logs_Mutation_Response>;
  /** update single row of the table: "sync_logs" */
  update_sync_logs_by_pk?: Maybe<Sync_Logs>;
  /** update multiples rows of table: "sync_logs" */
  update_sync_logs_many?: Maybe<Array<Maybe<Sync_Logs_Mutation_Response>>>;
  /** update multiples rows of table: "user_profiles" */
  update_userProfiles_many?: Maybe<Array<Maybe<UserProfiles_Mutation_Response>>>;
  /** update multiples rows of table: "auth.users" */
  update_users_many?: Maybe<Array<Maybe<Users_Mutation_Response>>>;
};


/** mutation root */
export type Mutation_RootDeleteAuthProviderArgs = {
  id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDeleteAuthProviderRequestArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteAuthProviderRequestsArgs = {
  where: AuthProviderRequests_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthProvidersArgs = {
  where: AuthProviders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthRefreshTokenArgs = {
  refreshToken: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteAuthRefreshTokensArgs = {
  where: AuthRefreshTokens_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthRoleArgs = {
  role: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDeleteAuthRolesArgs = {
  where: AuthRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthUserProviderArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteAuthUserProvidersArgs = {
  where: AuthUserProviders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthUserRoleArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteAuthUserRolesArgs = {
  where: AuthUserRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteAuthUserSecurityKeyArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteAuthUserSecurityKeysArgs = {
  where: AuthUserSecurityKeys_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteBucketArgs = {
  id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDeleteBucketsArgs = {
  where: Buckets_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteFileArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteFilesArgs = {
  where: Files_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeletePlaidAccountArgs = {
  id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDeletePlaidAccountsArgs = {
  where: PlaidAccounts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteStripeWebhookEventArgs = {
  id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDeleteStripeWebhookEventsArgs = {
  where: StripeWebhookEvents_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteUserArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteUserProfileArgs = {
  userId: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDeleteUserProfilesArgs = {
  where: UserProfiles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDeleteUsersArgs = {
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Airtable_ConfigsArgs = {
  where: Airtable_Configs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Airtable_Configs_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Coda_ConfigsArgs = {
  where: Coda_Configs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Coda_Configs_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Destination_AccountsArgs = {
  where: Destination_Accounts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Destination_Accounts_By_PkArgs = {
  account_id: Scalars['String'];
  destination_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Destination_Sync_LogsArgs = {
  where: Destination_Sync_Logs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Destination_Sync_Logs_By_PkArgs = {
  destination_id: Scalars['uuid'];
  sync_log_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_DestinationsArgs = {
  where: Destinations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Destinations_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_FrequenciesArgs = {
  where: Frequencies_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Frequencies_By_PkArgs = {
  id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_IntegrationsArgs = {
  where: Integrations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Integrations_By_PkArgs = {
  id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Notion_ConnectionsArgs = {
  where: Notion_Connections_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Notion_Connections_By_PkArgs = {
  bot_id: Scalars['String'];
  user_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Oauth_ClientsArgs = {
  where: Oauth_Clients_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Oauth_Clients_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Oauth_CodesArgs = {
  where: Oauth_Codes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Oauth_Codes_By_PkArgs = {
  code: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Plaid_InstitutionsArgs = {
  where: Plaid_Institutions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Plaid_Institutions_By_PkArgs = {
  id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Plaid_Item_Sync_LogsArgs = {
  where: Plaid_Item_Sync_Logs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Plaid_Item_Sync_Logs_By_PkArgs = {
  plaid_item_id: Scalars['String'];
  sync_log_id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootDelete_Plaid_ItemsArgs = {
  where: Plaid_Items_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Plaid_Items_By_PkArgs = {
  id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Removed_Plaid_TransactionsArgs = {
  where: Removed_Plaid_Transactions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Removed_Plaid_Transactions_By_PkArgs = {
  transaction_id: Scalars['String'];
};


/** mutation root */
export type Mutation_RootDelete_Sync_LogsArgs = {
  where: Sync_Logs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootDelete_Sync_Logs_By_PkArgs = {
  id: Scalars['uuid'];
};


/** mutation root */
export type Mutation_RootInsertAuthProviderArgs = {
  object: AuthProviders_Insert_Input;
  on_conflict?: InputMaybe<AuthProviders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthProviderRequestArgs = {
  object: AuthProviderRequests_Insert_Input;
  on_conflict?: InputMaybe<AuthProviderRequests_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthProviderRequestsArgs = {
  objects: Array<AuthProviderRequests_Insert_Input>;
  on_conflict?: InputMaybe<AuthProviderRequests_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthProvidersArgs = {
  objects: Array<AuthProviders_Insert_Input>;
  on_conflict?: InputMaybe<AuthProviders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthRefreshTokenArgs = {
  object: AuthRefreshTokens_Insert_Input;
  on_conflict?: InputMaybe<AuthRefreshTokens_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthRefreshTokensArgs = {
  objects: Array<AuthRefreshTokens_Insert_Input>;
  on_conflict?: InputMaybe<AuthRefreshTokens_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthRoleArgs = {
  object: AuthRoles_Insert_Input;
  on_conflict?: InputMaybe<AuthRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthRolesArgs = {
  objects: Array<AuthRoles_Insert_Input>;
  on_conflict?: InputMaybe<AuthRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthUserProviderArgs = {
  object: AuthUserProviders_Insert_Input;
  on_conflict?: InputMaybe<AuthUserProviders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthUserProvidersArgs = {
  objects: Array<AuthUserProviders_Insert_Input>;
  on_conflict?: InputMaybe<AuthUserProviders_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthUserRoleArgs = {
  object: AuthUserRoles_Insert_Input;
  on_conflict?: InputMaybe<AuthUserRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthUserRolesArgs = {
  objects: Array<AuthUserRoles_Insert_Input>;
  on_conflict?: InputMaybe<AuthUserRoles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthUserSecurityKeyArgs = {
  object: AuthUserSecurityKeys_Insert_Input;
  on_conflict?: InputMaybe<AuthUserSecurityKeys_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertAuthUserSecurityKeysArgs = {
  objects: Array<AuthUserSecurityKeys_Insert_Input>;
  on_conflict?: InputMaybe<AuthUserSecurityKeys_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertBucketArgs = {
  object: Buckets_Insert_Input;
  on_conflict?: InputMaybe<Buckets_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertBucketsArgs = {
  objects: Array<Buckets_Insert_Input>;
  on_conflict?: InputMaybe<Buckets_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertFileArgs = {
  object: Files_Insert_Input;
  on_conflict?: InputMaybe<Files_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertFilesArgs = {
  objects: Array<Files_Insert_Input>;
  on_conflict?: InputMaybe<Files_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertPlaidAccountArgs = {
  object: PlaidAccounts_Insert_Input;
  on_conflict?: InputMaybe<PlaidAccounts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertPlaidAccountsArgs = {
  objects: Array<PlaidAccounts_Insert_Input>;
  on_conflict?: InputMaybe<PlaidAccounts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertPlaidItemArgs = {
  object: Plaid_Items_Insert_Input;
  on_conflict?: InputMaybe<Plaid_Items_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertStripeWebhookEventArgs = {
  object: StripeWebhookEvents_Insert_Input;
  on_conflict?: InputMaybe<StripeWebhookEvents_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertStripeWebhookEventsArgs = {
  objects: Array<StripeWebhookEvents_Insert_Input>;
  on_conflict?: InputMaybe<StripeWebhookEvents_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertUserArgs = {
  object: Users_Insert_Input;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertUserProfileArgs = {
  object: UserProfiles_Insert_Input;
  on_conflict?: InputMaybe<UserProfiles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertUserProfilesArgs = {
  objects: Array<UserProfiles_Insert_Input>;
  on_conflict?: InputMaybe<UserProfiles_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsertUsersArgs = {
  objects: Array<Users_Insert_Input>;
  on_conflict?: InputMaybe<Users_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Airtable_ConfigsArgs = {
  objects: Array<Airtable_Configs_Insert_Input>;
  on_conflict?: InputMaybe<Airtable_Configs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Airtable_Configs_OneArgs = {
  object: Airtable_Configs_Insert_Input;
  on_conflict?: InputMaybe<Airtable_Configs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Coda_ConfigsArgs = {
  objects: Array<Coda_Configs_Insert_Input>;
  on_conflict?: InputMaybe<Coda_Configs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Coda_Configs_OneArgs = {
  object: Coda_Configs_Insert_Input;
  on_conflict?: InputMaybe<Coda_Configs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Destination_AccountsArgs = {
  objects: Array<Destination_Accounts_Insert_Input>;
  on_conflict?: InputMaybe<Destination_Accounts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Destination_Accounts_OneArgs = {
  object: Destination_Accounts_Insert_Input;
  on_conflict?: InputMaybe<Destination_Accounts_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Destination_Sync_LogsArgs = {
  objects: Array<Destination_Sync_Logs_Insert_Input>;
  on_conflict?: InputMaybe<Destination_Sync_Logs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Destination_Sync_Logs_OneArgs = {
  object: Destination_Sync_Logs_Insert_Input;
  on_conflict?: InputMaybe<Destination_Sync_Logs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_DestinationsArgs = {
  objects: Array<Destinations_Insert_Input>;
  on_conflict?: InputMaybe<Destinations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Destinations_OneArgs = {
  object: Destinations_Insert_Input;
  on_conflict?: InputMaybe<Destinations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_FrequenciesArgs = {
  objects: Array<Frequencies_Insert_Input>;
  on_conflict?: InputMaybe<Frequencies_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Frequencies_OneArgs = {
  object: Frequencies_Insert_Input;
  on_conflict?: InputMaybe<Frequencies_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_IntegrationsArgs = {
  objects: Array<Integrations_Insert_Input>;
  on_conflict?: InputMaybe<Integrations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Integrations_OneArgs = {
  object: Integrations_Insert_Input;
  on_conflict?: InputMaybe<Integrations_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Notion_ConnectionsArgs = {
  objects: Array<Notion_Connections_Insert_Input>;
  on_conflict?: InputMaybe<Notion_Connections_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Notion_Connections_OneArgs = {
  object: Notion_Connections_Insert_Input;
  on_conflict?: InputMaybe<Notion_Connections_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Oauth_ClientsArgs = {
  objects: Array<Oauth_Clients_Insert_Input>;
  on_conflict?: InputMaybe<Oauth_Clients_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Oauth_Clients_OneArgs = {
  object: Oauth_Clients_Insert_Input;
  on_conflict?: InputMaybe<Oauth_Clients_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Oauth_CodesArgs = {
  objects: Array<Oauth_Codes_Insert_Input>;
  on_conflict?: InputMaybe<Oauth_Codes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Oauth_Codes_OneArgs = {
  object: Oauth_Codes_Insert_Input;
  on_conflict?: InputMaybe<Oauth_Codes_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Plaid_InstitutionsArgs = {
  objects: Array<Plaid_Institutions_Insert_Input>;
  on_conflict?: InputMaybe<Plaid_Institutions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Plaid_Institutions_OneArgs = {
  object: Plaid_Institutions_Insert_Input;
  on_conflict?: InputMaybe<Plaid_Institutions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Plaid_Item_Sync_LogsArgs = {
  objects: Array<Plaid_Item_Sync_Logs_Insert_Input>;
  on_conflict?: InputMaybe<Plaid_Item_Sync_Logs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Plaid_Item_Sync_Logs_OneArgs = {
  object: Plaid_Item_Sync_Logs_Insert_Input;
  on_conflict?: InputMaybe<Plaid_Item_Sync_Logs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Plaid_ItemsArgs = {
  objects: Array<Plaid_Items_Insert_Input>;
  on_conflict?: InputMaybe<Plaid_Items_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Removed_Plaid_TransactionsArgs = {
  objects: Array<Removed_Plaid_Transactions_Insert_Input>;
  on_conflict?: InputMaybe<Removed_Plaid_Transactions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Removed_Plaid_Transactions_OneArgs = {
  object: Removed_Plaid_Transactions_Insert_Input;
  on_conflict?: InputMaybe<Removed_Plaid_Transactions_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sync_LogsArgs = {
  objects: Array<Sync_Logs_Insert_Input>;
  on_conflict?: InputMaybe<Sync_Logs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootInsert_Sync_Logs_OneArgs = {
  object: Sync_Logs_Insert_Input;
  on_conflict?: InputMaybe<Sync_Logs_On_Conflict>;
};


/** mutation root */
export type Mutation_RootUpdateAuthProviderArgs = {
  _set?: InputMaybe<AuthProviders_Set_Input>;
  pk_columns: AuthProviders_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthProviderRequestArgs = {
  _append?: InputMaybe<AuthProviderRequests_Append_Input>;
  _delete_at_path?: InputMaybe<AuthProviderRequests_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<AuthProviderRequests_Delete_Elem_Input>;
  _delete_key?: InputMaybe<AuthProviderRequests_Delete_Key_Input>;
  _prepend?: InputMaybe<AuthProviderRequests_Prepend_Input>;
  _set?: InputMaybe<AuthProviderRequests_Set_Input>;
  pk_columns: AuthProviderRequests_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthProviderRequestsArgs = {
  _append?: InputMaybe<AuthProviderRequests_Append_Input>;
  _delete_at_path?: InputMaybe<AuthProviderRequests_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<AuthProviderRequests_Delete_Elem_Input>;
  _delete_key?: InputMaybe<AuthProviderRequests_Delete_Key_Input>;
  _prepend?: InputMaybe<AuthProviderRequests_Prepend_Input>;
  _set?: InputMaybe<AuthProviderRequests_Set_Input>;
  where: AuthProviderRequests_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthProvidersArgs = {
  _set?: InputMaybe<AuthProviders_Set_Input>;
  where: AuthProviders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthRefreshTokenArgs = {
  _set?: InputMaybe<AuthRefreshTokens_Set_Input>;
  pk_columns: AuthRefreshTokens_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthRefreshTokensArgs = {
  _set?: InputMaybe<AuthRefreshTokens_Set_Input>;
  where: AuthRefreshTokens_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthRoleArgs = {
  _set?: InputMaybe<AuthRoles_Set_Input>;
  pk_columns: AuthRoles_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthRolesArgs = {
  _set?: InputMaybe<AuthRoles_Set_Input>;
  where: AuthRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthUserProviderArgs = {
  _set?: InputMaybe<AuthUserProviders_Set_Input>;
  pk_columns: AuthUserProviders_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthUserProvidersArgs = {
  _set?: InputMaybe<AuthUserProviders_Set_Input>;
  where: AuthUserProviders_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthUserRoleArgs = {
  _set?: InputMaybe<AuthUserRoles_Set_Input>;
  pk_columns: AuthUserRoles_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthUserRolesArgs = {
  _set?: InputMaybe<AuthUserRoles_Set_Input>;
  where: AuthUserRoles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateAuthUserSecurityKeyArgs = {
  _inc?: InputMaybe<AuthUserSecurityKeys_Inc_Input>;
  _set?: InputMaybe<AuthUserSecurityKeys_Set_Input>;
  pk_columns: AuthUserSecurityKeys_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateAuthUserSecurityKeysArgs = {
  _inc?: InputMaybe<AuthUserSecurityKeys_Inc_Input>;
  _set?: InputMaybe<AuthUserSecurityKeys_Set_Input>;
  where: AuthUserSecurityKeys_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateBucketArgs = {
  _inc?: InputMaybe<Buckets_Inc_Input>;
  _set?: InputMaybe<Buckets_Set_Input>;
  pk_columns: Buckets_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateBucketsArgs = {
  _inc?: InputMaybe<Buckets_Inc_Input>;
  _set?: InputMaybe<Buckets_Set_Input>;
  where: Buckets_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateFileArgs = {
  _inc?: InputMaybe<Files_Inc_Input>;
  _set?: InputMaybe<Files_Set_Input>;
  pk_columns: Files_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateFilesArgs = {
  _inc?: InputMaybe<Files_Inc_Input>;
  _set?: InputMaybe<Files_Set_Input>;
  where: Files_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdatePlaidAccountArgs = {
  _set?: InputMaybe<PlaidAccounts_Set_Input>;
  pk_columns: PlaidAccounts_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdatePlaidAccountsArgs = {
  _set?: InputMaybe<PlaidAccounts_Set_Input>;
  where: PlaidAccounts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateStripeWebhookEventArgs = {
  _set?: InputMaybe<StripeWebhookEvents_Set_Input>;
  pk_columns: StripeWebhookEvents_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateStripeWebhookEventsArgs = {
  _set?: InputMaybe<StripeWebhookEvents_Set_Input>;
  where: StripeWebhookEvents_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateUserArgs = {
  _append?: InputMaybe<Users_Append_Input>;
  _delete_at_path?: InputMaybe<Users_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Users_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Users_Delete_Key_Input>;
  _prepend?: InputMaybe<Users_Prepend_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  pk_columns: Users_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateUserProfileArgs = {
  _set?: InputMaybe<UserProfiles_Set_Input>;
  pk_columns: UserProfiles_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdateUserProfilesArgs = {
  _set?: InputMaybe<UserProfiles_Set_Input>;
  where: UserProfiles_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdateUsersArgs = {
  _append?: InputMaybe<Users_Append_Input>;
  _delete_at_path?: InputMaybe<Users_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Users_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Users_Delete_Key_Input>;
  _prepend?: InputMaybe<Users_Prepend_Input>;
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Airtable_ConfigsArgs = {
  _set?: InputMaybe<Airtable_Configs_Set_Input>;
  where: Airtable_Configs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Airtable_Configs_By_PkArgs = {
  _set?: InputMaybe<Airtable_Configs_Set_Input>;
  pk_columns: Airtable_Configs_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Airtable_Configs_ManyArgs = {
  updates: Array<Airtable_Configs_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_AuthProviderRequests_ManyArgs = {
  updates: Array<AuthProviderRequests_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_AuthProviders_ManyArgs = {
  updates: Array<AuthProviders_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_AuthRefreshTokens_ManyArgs = {
  updates: Array<AuthRefreshTokens_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_AuthRoles_ManyArgs = {
  updates: Array<AuthRoles_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_AuthUserProviders_ManyArgs = {
  updates: Array<AuthUserProviders_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_AuthUserRoles_ManyArgs = {
  updates: Array<AuthUserRoles_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_AuthUserSecurityKeys_ManyArgs = {
  updates: Array<AuthUserSecurityKeys_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Buckets_ManyArgs = {
  updates: Array<Buckets_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Coda_ConfigsArgs = {
  _set?: InputMaybe<Coda_Configs_Set_Input>;
  where: Coda_Configs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Coda_Configs_By_PkArgs = {
  _set?: InputMaybe<Coda_Configs_Set_Input>;
  pk_columns: Coda_Configs_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Coda_Configs_ManyArgs = {
  updates: Array<Coda_Configs_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Destination_AccountsArgs = {
  _set?: InputMaybe<Destination_Accounts_Set_Input>;
  where: Destination_Accounts_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Destination_Accounts_By_PkArgs = {
  _set?: InputMaybe<Destination_Accounts_Set_Input>;
  pk_columns: Destination_Accounts_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Destination_Accounts_ManyArgs = {
  updates: Array<Destination_Accounts_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Destination_Sync_LogsArgs = {
  _append?: InputMaybe<Destination_Sync_Logs_Append_Input>;
  _delete_at_path?: InputMaybe<Destination_Sync_Logs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Destination_Sync_Logs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Destination_Sync_Logs_Delete_Key_Input>;
  _prepend?: InputMaybe<Destination_Sync_Logs_Prepend_Input>;
  _set?: InputMaybe<Destination_Sync_Logs_Set_Input>;
  where: Destination_Sync_Logs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Destination_Sync_Logs_By_PkArgs = {
  _append?: InputMaybe<Destination_Sync_Logs_Append_Input>;
  _delete_at_path?: InputMaybe<Destination_Sync_Logs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Destination_Sync_Logs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Destination_Sync_Logs_Delete_Key_Input>;
  _prepend?: InputMaybe<Destination_Sync_Logs_Prepend_Input>;
  _set?: InputMaybe<Destination_Sync_Logs_Set_Input>;
  pk_columns: Destination_Sync_Logs_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Destination_Sync_Logs_ManyArgs = {
  updates: Array<Destination_Sync_Logs_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_DestinationsArgs = {
  _append?: InputMaybe<Destinations_Append_Input>;
  _delete_at_path?: InputMaybe<Destinations_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Destinations_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Destinations_Delete_Key_Input>;
  _prepend?: InputMaybe<Destinations_Prepend_Input>;
  _set?: InputMaybe<Destinations_Set_Input>;
  where: Destinations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Destinations_By_PkArgs = {
  _append?: InputMaybe<Destinations_Append_Input>;
  _delete_at_path?: InputMaybe<Destinations_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Destinations_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Destinations_Delete_Key_Input>;
  _prepend?: InputMaybe<Destinations_Prepend_Input>;
  _set?: InputMaybe<Destinations_Set_Input>;
  pk_columns: Destinations_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Destinations_ManyArgs = {
  updates: Array<Destinations_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Files_ManyArgs = {
  updates: Array<Files_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_FrequenciesArgs = {
  _set?: InputMaybe<Frequencies_Set_Input>;
  where: Frequencies_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Frequencies_By_PkArgs = {
  _set?: InputMaybe<Frequencies_Set_Input>;
  pk_columns: Frequencies_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Frequencies_ManyArgs = {
  updates: Array<Frequencies_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_IntegrationsArgs = {
  _set?: InputMaybe<Integrations_Set_Input>;
  where: Integrations_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Integrations_By_PkArgs = {
  _set?: InputMaybe<Integrations_Set_Input>;
  pk_columns: Integrations_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Integrations_ManyArgs = {
  updates: Array<Integrations_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Notion_ConnectionsArgs = {
  _append?: InputMaybe<Notion_Connections_Append_Input>;
  _delete_at_path?: InputMaybe<Notion_Connections_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Notion_Connections_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Notion_Connections_Delete_Key_Input>;
  _prepend?: InputMaybe<Notion_Connections_Prepend_Input>;
  _set?: InputMaybe<Notion_Connections_Set_Input>;
  where: Notion_Connections_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Notion_Connections_By_PkArgs = {
  _append?: InputMaybe<Notion_Connections_Append_Input>;
  _delete_at_path?: InputMaybe<Notion_Connections_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Notion_Connections_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Notion_Connections_Delete_Key_Input>;
  _prepend?: InputMaybe<Notion_Connections_Prepend_Input>;
  _set?: InputMaybe<Notion_Connections_Set_Input>;
  pk_columns: Notion_Connections_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Notion_Connections_ManyArgs = {
  updates: Array<Notion_Connections_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Oauth_ClientsArgs = {
  _set?: InputMaybe<Oauth_Clients_Set_Input>;
  where: Oauth_Clients_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Oauth_Clients_By_PkArgs = {
  _set?: InputMaybe<Oauth_Clients_Set_Input>;
  pk_columns: Oauth_Clients_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Oauth_Clients_ManyArgs = {
  updates: Array<Oauth_Clients_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Oauth_CodesArgs = {
  _set?: InputMaybe<Oauth_Codes_Set_Input>;
  where: Oauth_Codes_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Oauth_Codes_By_PkArgs = {
  _set?: InputMaybe<Oauth_Codes_Set_Input>;
  pk_columns: Oauth_Codes_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Oauth_Codes_ManyArgs = {
  updates: Array<Oauth_Codes_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_PlaidAccounts_ManyArgs = {
  updates: Array<PlaidAccounts_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Plaid_InstitutionsArgs = {
  _set?: InputMaybe<Plaid_Institutions_Set_Input>;
  where: Plaid_Institutions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Plaid_Institutions_By_PkArgs = {
  _set?: InputMaybe<Plaid_Institutions_Set_Input>;
  pk_columns: Plaid_Institutions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Plaid_Institutions_ManyArgs = {
  updates: Array<Plaid_Institutions_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Plaid_Item_Sync_LogsArgs = {
  _append?: InputMaybe<Plaid_Item_Sync_Logs_Append_Input>;
  _delete_at_path?: InputMaybe<Plaid_Item_Sync_Logs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Plaid_Item_Sync_Logs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Plaid_Item_Sync_Logs_Delete_Key_Input>;
  _prepend?: InputMaybe<Plaid_Item_Sync_Logs_Prepend_Input>;
  _set?: InputMaybe<Plaid_Item_Sync_Logs_Set_Input>;
  where: Plaid_Item_Sync_Logs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Plaid_Item_Sync_Logs_By_PkArgs = {
  _append?: InputMaybe<Plaid_Item_Sync_Logs_Append_Input>;
  _delete_at_path?: InputMaybe<Plaid_Item_Sync_Logs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Plaid_Item_Sync_Logs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Plaid_Item_Sync_Logs_Delete_Key_Input>;
  _prepend?: InputMaybe<Plaid_Item_Sync_Logs_Prepend_Input>;
  _set?: InputMaybe<Plaid_Item_Sync_Logs_Set_Input>;
  pk_columns: Plaid_Item_Sync_Logs_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Plaid_Item_Sync_Logs_ManyArgs = {
  updates: Array<Plaid_Item_Sync_Logs_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Plaid_ItemsArgs = {
  _append?: InputMaybe<Plaid_Items_Append_Input>;
  _delete_at_path?: InputMaybe<Plaid_Items_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Plaid_Items_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Plaid_Items_Delete_Key_Input>;
  _prepend?: InputMaybe<Plaid_Items_Prepend_Input>;
  _set?: InputMaybe<Plaid_Items_Set_Input>;
  where: Plaid_Items_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Plaid_Items_By_PkArgs = {
  _append?: InputMaybe<Plaid_Items_Append_Input>;
  _delete_at_path?: InputMaybe<Plaid_Items_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Plaid_Items_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Plaid_Items_Delete_Key_Input>;
  _prepend?: InputMaybe<Plaid_Items_Prepend_Input>;
  _set?: InputMaybe<Plaid_Items_Set_Input>;
  pk_columns: Plaid_Items_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Plaid_Items_ManyArgs = {
  updates: Array<Plaid_Items_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Removed_Plaid_TransactionsArgs = {
  _set?: InputMaybe<Removed_Plaid_Transactions_Set_Input>;
  where: Removed_Plaid_Transactions_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Removed_Plaid_Transactions_By_PkArgs = {
  _set?: InputMaybe<Removed_Plaid_Transactions_Set_Input>;
  pk_columns: Removed_Plaid_Transactions_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Removed_Plaid_Transactions_ManyArgs = {
  updates: Array<Removed_Plaid_Transactions_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_StripeWebhookEvents_ManyArgs = {
  updates: Array<StripeWebhookEvents_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Sync_LogsArgs = {
  _append?: InputMaybe<Sync_Logs_Append_Input>;
  _delete_at_path?: InputMaybe<Sync_Logs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Sync_Logs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Sync_Logs_Delete_Key_Input>;
  _prepend?: InputMaybe<Sync_Logs_Prepend_Input>;
  _set?: InputMaybe<Sync_Logs_Set_Input>;
  where: Sync_Logs_Bool_Exp;
};


/** mutation root */
export type Mutation_RootUpdate_Sync_Logs_By_PkArgs = {
  _append?: InputMaybe<Sync_Logs_Append_Input>;
  _delete_at_path?: InputMaybe<Sync_Logs_Delete_At_Path_Input>;
  _delete_elem?: InputMaybe<Sync_Logs_Delete_Elem_Input>;
  _delete_key?: InputMaybe<Sync_Logs_Delete_Key_Input>;
  _prepend?: InputMaybe<Sync_Logs_Prepend_Input>;
  _set?: InputMaybe<Sync_Logs_Set_Input>;
  pk_columns: Sync_Logs_Pk_Columns_Input;
};


/** mutation root */
export type Mutation_RootUpdate_Sync_Logs_ManyArgs = {
  updates: Array<Sync_Logs_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_UserProfiles_ManyArgs = {
  updates: Array<UserProfiles_Updates>;
};


/** mutation root */
export type Mutation_RootUpdate_Users_ManyArgs = {
  updates: Array<Users_Updates>;
};

/** columns and relationships of "notion_connections" */
export type Notion_Connections = {
  __typename?: 'notion_connections';
  access_token: Scalars['String'];
  bot_id: Scalars['String'];
  /** An array relationship */
  destinations: Array<Destinations>;
  /** An aggregate relationship */
  destinations_aggregate: Destinations_Aggregate;
  owner: Scalars['jsonb'];
  /** An object relationship */
  user: Users;
  user_id: Scalars['uuid'];
  workspace_icon?: Maybe<Scalars['String']>;
  workspace_id: Scalars['String'];
  workspace_name?: Maybe<Scalars['String']>;
};


/** columns and relationships of "notion_connections" */
export type Notion_ConnectionsDestinationsArgs = {
  distinct_on?: InputMaybe<Array<Destinations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destinations_Order_By>>;
  where?: InputMaybe<Destinations_Bool_Exp>;
};


/** columns and relationships of "notion_connections" */
export type Notion_ConnectionsDestinations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Destinations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destinations_Order_By>>;
  where?: InputMaybe<Destinations_Bool_Exp>;
};


/** columns and relationships of "notion_connections" */
export type Notion_ConnectionsOwnerArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "notion_connections" */
export type Notion_Connections_Aggregate = {
  __typename?: 'notion_connections_aggregate';
  aggregate?: Maybe<Notion_Connections_Aggregate_Fields>;
  nodes: Array<Notion_Connections>;
};

export type Notion_Connections_Aggregate_Bool_Exp = {
  count?: InputMaybe<Notion_Connections_Aggregate_Bool_Exp_Count>;
};

export type Notion_Connections_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Notion_Connections_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Notion_Connections_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "notion_connections" */
export type Notion_Connections_Aggregate_Fields = {
  __typename?: 'notion_connections_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Notion_Connections_Max_Fields>;
  min?: Maybe<Notion_Connections_Min_Fields>;
};


/** aggregate fields of "notion_connections" */
export type Notion_Connections_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Notion_Connections_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "notion_connections" */
export type Notion_Connections_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Notion_Connections_Max_Order_By>;
  min?: InputMaybe<Notion_Connections_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Notion_Connections_Append_Input = {
  owner?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "notion_connections" */
export type Notion_Connections_Arr_Rel_Insert_Input = {
  data: Array<Notion_Connections_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Notion_Connections_On_Conflict>;
};

/** Boolean expression to filter rows from the table "notion_connections". All fields are combined with a logical 'AND'. */
export type Notion_Connections_Bool_Exp = {
  _and?: InputMaybe<Array<Notion_Connections_Bool_Exp>>;
  _not?: InputMaybe<Notion_Connections_Bool_Exp>;
  _or?: InputMaybe<Array<Notion_Connections_Bool_Exp>>;
  access_token?: InputMaybe<String_Comparison_Exp>;
  bot_id?: InputMaybe<String_Comparison_Exp>;
  destinations?: InputMaybe<Destinations_Bool_Exp>;
  destinations_aggregate?: InputMaybe<Destinations_Aggregate_Bool_Exp>;
  owner?: InputMaybe<Jsonb_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
  workspace_icon?: InputMaybe<String_Comparison_Exp>;
  workspace_id?: InputMaybe<String_Comparison_Exp>;
  workspace_name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "notion_connections" */
export enum Notion_Connections_Constraint {
  /** unique or primary key constraint on columns "bot_id", "user_id" */
  NotionConnectionsPkey = 'notion_connections_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Notion_Connections_Delete_At_Path_Input = {
  owner?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Notion_Connections_Delete_Elem_Input = {
  owner?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Notion_Connections_Delete_Key_Input = {
  owner?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "notion_connections" */
export type Notion_Connections_Insert_Input = {
  access_token?: InputMaybe<Scalars['String']>;
  bot_id?: InputMaybe<Scalars['String']>;
  destinations?: InputMaybe<Destinations_Arr_Rel_Insert_Input>;
  owner?: InputMaybe<Scalars['jsonb']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars['uuid']>;
  workspace_icon?: InputMaybe<Scalars['String']>;
  workspace_id?: InputMaybe<Scalars['String']>;
  workspace_name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Notion_Connections_Max_Fields = {
  __typename?: 'notion_connections_max_fields';
  access_token?: Maybe<Scalars['String']>;
  bot_id?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
  workspace_icon?: Maybe<Scalars['String']>;
  workspace_id?: Maybe<Scalars['String']>;
  workspace_name?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "notion_connections" */
export type Notion_Connections_Max_Order_By = {
  access_token?: InputMaybe<Order_By>;
  bot_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  workspace_icon?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
  workspace_name?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Notion_Connections_Min_Fields = {
  __typename?: 'notion_connections_min_fields';
  access_token?: Maybe<Scalars['String']>;
  bot_id?: Maybe<Scalars['String']>;
  user_id?: Maybe<Scalars['uuid']>;
  workspace_icon?: Maybe<Scalars['String']>;
  workspace_id?: Maybe<Scalars['String']>;
  workspace_name?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "notion_connections" */
export type Notion_Connections_Min_Order_By = {
  access_token?: InputMaybe<Order_By>;
  bot_id?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
  workspace_icon?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
  workspace_name?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "notion_connections" */
export type Notion_Connections_Mutation_Response = {
  __typename?: 'notion_connections_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Notion_Connections>;
};

/** input type for inserting object relation for remote table "notion_connections" */
export type Notion_Connections_Obj_Rel_Insert_Input = {
  data: Notion_Connections_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Notion_Connections_On_Conflict>;
};

/** on_conflict condition type for table "notion_connections" */
export type Notion_Connections_On_Conflict = {
  constraint: Notion_Connections_Constraint;
  update_columns?: Array<Notion_Connections_Update_Column>;
  where?: InputMaybe<Notion_Connections_Bool_Exp>;
};

/** Ordering options when selecting data from "notion_connections". */
export type Notion_Connections_Order_By = {
  access_token?: InputMaybe<Order_By>;
  bot_id?: InputMaybe<Order_By>;
  destinations_aggregate?: InputMaybe<Destinations_Aggregate_Order_By>;
  owner?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
  workspace_icon?: InputMaybe<Order_By>;
  workspace_id?: InputMaybe<Order_By>;
  workspace_name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: notion_connections */
export type Notion_Connections_Pk_Columns_Input = {
  bot_id: Scalars['String'];
  user_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Notion_Connections_Prepend_Input = {
  owner?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "notion_connections" */
export enum Notion_Connections_Select_Column {
  /** column name */
  AccessToken = 'access_token',
  /** column name */
  BotId = 'bot_id',
  /** column name */
  Owner = 'owner',
  /** column name */
  UserId = 'user_id',
  /** column name */
  WorkspaceIcon = 'workspace_icon',
  /** column name */
  WorkspaceId = 'workspace_id',
  /** column name */
  WorkspaceName = 'workspace_name'
}

/** input type for updating data in table "notion_connections" */
export type Notion_Connections_Set_Input = {
  access_token?: InputMaybe<Scalars['String']>;
  bot_id?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['jsonb']>;
  user_id?: InputMaybe<Scalars['uuid']>;
  workspace_icon?: InputMaybe<Scalars['String']>;
  workspace_id?: InputMaybe<Scalars['String']>;
  workspace_name?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "notion_connections" */
export type Notion_Connections_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Notion_Connections_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Notion_Connections_Stream_Cursor_Value_Input = {
  access_token?: InputMaybe<Scalars['String']>;
  bot_id?: InputMaybe<Scalars['String']>;
  owner?: InputMaybe<Scalars['jsonb']>;
  user_id?: InputMaybe<Scalars['uuid']>;
  workspace_icon?: InputMaybe<Scalars['String']>;
  workspace_id?: InputMaybe<Scalars['String']>;
  workspace_name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "notion_connections" */
export enum Notion_Connections_Update_Column {
  /** column name */
  AccessToken = 'access_token',
  /** column name */
  BotId = 'bot_id',
  /** column name */
  Owner = 'owner',
  /** column name */
  UserId = 'user_id',
  /** column name */
  WorkspaceIcon = 'workspace_icon',
  /** column name */
  WorkspaceId = 'workspace_id',
  /** column name */
  WorkspaceName = 'workspace_name'
}

export type Notion_Connections_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Notion_Connections_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Notion_Connections_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Notion_Connections_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Notion_Connections_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Notion_Connections_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Notion_Connections_Set_Input>;
  where: Notion_Connections_Bool_Exp;
};

/** columns and relationships of "oauth_clients" */
export type Oauth_Clients = {
  __typename?: 'oauth_clients';
  id: Scalars['uuid'];
  /** An object relationship */
  integration: Integrations;
  integration_id: Integrations_Enum;
  logo?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  secret_hash: Scalars['String'];
};

/** aggregated selection of "oauth_clients" */
export type Oauth_Clients_Aggregate = {
  __typename?: 'oauth_clients_aggregate';
  aggregate?: Maybe<Oauth_Clients_Aggregate_Fields>;
  nodes: Array<Oauth_Clients>;
};

/** aggregate fields of "oauth_clients" */
export type Oauth_Clients_Aggregate_Fields = {
  __typename?: 'oauth_clients_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Oauth_Clients_Max_Fields>;
  min?: Maybe<Oauth_Clients_Min_Fields>;
};


/** aggregate fields of "oauth_clients" */
export type Oauth_Clients_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Oauth_Clients_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "oauth_clients". All fields are combined with a logical 'AND'. */
export type Oauth_Clients_Bool_Exp = {
  _and?: InputMaybe<Array<Oauth_Clients_Bool_Exp>>;
  _not?: InputMaybe<Oauth_Clients_Bool_Exp>;
  _or?: InputMaybe<Array<Oauth_Clients_Bool_Exp>>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  integration?: InputMaybe<Integrations_Bool_Exp>;
  integration_id?: InputMaybe<Integrations_Enum_Comparison_Exp>;
  logo?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  secret_hash?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "oauth_clients" */
export enum Oauth_Clients_Constraint {
  /** unique or primary key constraint on columns "id" */
  OauthClientsPkey = 'oauth_clients_pkey'
}

/** input type for inserting data into table "oauth_clients" */
export type Oauth_Clients_Insert_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  integration?: InputMaybe<Integrations_Obj_Rel_Insert_Input>;
  integration_id?: InputMaybe<Integrations_Enum>;
  logo?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  secret_hash?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Oauth_Clients_Max_Fields = {
  __typename?: 'oauth_clients_max_fields';
  id?: Maybe<Scalars['uuid']>;
  logo?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  secret_hash?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Oauth_Clients_Min_Fields = {
  __typename?: 'oauth_clients_min_fields';
  id?: Maybe<Scalars['uuid']>;
  logo?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  secret_hash?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "oauth_clients" */
export type Oauth_Clients_Mutation_Response = {
  __typename?: 'oauth_clients_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Oauth_Clients>;
};

/** on_conflict condition type for table "oauth_clients" */
export type Oauth_Clients_On_Conflict = {
  constraint: Oauth_Clients_Constraint;
  update_columns?: Array<Oauth_Clients_Update_Column>;
  where?: InputMaybe<Oauth_Clients_Bool_Exp>;
};

/** Ordering options when selecting data from "oauth_clients". */
export type Oauth_Clients_Order_By = {
  id?: InputMaybe<Order_By>;
  integration?: InputMaybe<Integrations_Order_By>;
  integration_id?: InputMaybe<Order_By>;
  logo?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  secret_hash?: InputMaybe<Order_By>;
};

/** primary key columns input for table: oauth_clients */
export type Oauth_Clients_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** select columns of table "oauth_clients" */
export enum Oauth_Clients_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  IntegrationId = 'integration_id',
  /** column name */
  Logo = 'logo',
  /** column name */
  Name = 'name',
  /** column name */
  SecretHash = 'secret_hash'
}

/** input type for updating data in table "oauth_clients" */
export type Oauth_Clients_Set_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  integration_id?: InputMaybe<Integrations_Enum>;
  logo?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  secret_hash?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "oauth_clients" */
export type Oauth_Clients_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Oauth_Clients_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Oauth_Clients_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['uuid']>;
  integration_id?: InputMaybe<Integrations_Enum>;
  logo?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  secret_hash?: InputMaybe<Scalars['String']>;
};

/** update columns of table "oauth_clients" */
export enum Oauth_Clients_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  IntegrationId = 'integration_id',
  /** column name */
  Logo = 'logo',
  /** column name */
  Name = 'name',
  /** column name */
  SecretHash = 'secret_hash'
}

export type Oauth_Clients_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Oauth_Clients_Set_Input>;
  where: Oauth_Clients_Bool_Exp;
};

/** columns and relationships of "oauth_codes" */
export type Oauth_Codes = {
  __typename?: 'oauth_codes';
  access_token: Scalars['String'];
  code: Scalars['uuid'];
  created_at: Scalars['timestamptz'];
  oauth_client_id: Scalars['uuid'];
};

/** aggregated selection of "oauth_codes" */
export type Oauth_Codes_Aggregate = {
  __typename?: 'oauth_codes_aggregate';
  aggregate?: Maybe<Oauth_Codes_Aggregate_Fields>;
  nodes: Array<Oauth_Codes>;
};

/** aggregate fields of "oauth_codes" */
export type Oauth_Codes_Aggregate_Fields = {
  __typename?: 'oauth_codes_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Oauth_Codes_Max_Fields>;
  min?: Maybe<Oauth_Codes_Min_Fields>;
};


/** aggregate fields of "oauth_codes" */
export type Oauth_Codes_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Oauth_Codes_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "oauth_codes". All fields are combined with a logical 'AND'. */
export type Oauth_Codes_Bool_Exp = {
  _and?: InputMaybe<Array<Oauth_Codes_Bool_Exp>>;
  _not?: InputMaybe<Oauth_Codes_Bool_Exp>;
  _or?: InputMaybe<Array<Oauth_Codes_Bool_Exp>>;
  access_token?: InputMaybe<String_Comparison_Exp>;
  code?: InputMaybe<Uuid_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  oauth_client_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "oauth_codes" */
export enum Oauth_Codes_Constraint {
  /** unique or primary key constraint on columns "code" */
  OauthCodesPkey = 'oauth_codes_pkey'
}

/** input type for inserting data into table "oauth_codes" */
export type Oauth_Codes_Insert_Input = {
  access_token?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  oauth_client_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Oauth_Codes_Max_Fields = {
  __typename?: 'oauth_codes_max_fields';
  access_token?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  oauth_client_id?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type Oauth_Codes_Min_Fields = {
  __typename?: 'oauth_codes_min_fields';
  access_token?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['uuid']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  oauth_client_id?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "oauth_codes" */
export type Oauth_Codes_Mutation_Response = {
  __typename?: 'oauth_codes_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Oauth_Codes>;
};

/** on_conflict condition type for table "oauth_codes" */
export type Oauth_Codes_On_Conflict = {
  constraint: Oauth_Codes_Constraint;
  update_columns?: Array<Oauth_Codes_Update_Column>;
  where?: InputMaybe<Oauth_Codes_Bool_Exp>;
};

/** Ordering options when selecting data from "oauth_codes". */
export type Oauth_Codes_Order_By = {
  access_token?: InputMaybe<Order_By>;
  code?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  oauth_client_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: oauth_codes */
export type Oauth_Codes_Pk_Columns_Input = {
  code: Scalars['uuid'];
};

/** select columns of table "oauth_codes" */
export enum Oauth_Codes_Select_Column {
  /** column name */
  AccessToken = 'access_token',
  /** column name */
  Code = 'code',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  OauthClientId = 'oauth_client_id'
}

/** input type for updating data in table "oauth_codes" */
export type Oauth_Codes_Set_Input = {
  access_token?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  oauth_client_id?: InputMaybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "oauth_codes" */
export type Oauth_Codes_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Oauth_Codes_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Oauth_Codes_Stream_Cursor_Value_Input = {
  access_token?: InputMaybe<Scalars['String']>;
  code?: InputMaybe<Scalars['uuid']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  oauth_client_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "oauth_codes" */
export enum Oauth_Codes_Update_Column {
  /** column name */
  AccessToken = 'access_token',
  /** column name */
  Code = 'code',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  OauthClientId = 'oauth_client_id'
}

export type Oauth_Codes_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Oauth_Codes_Set_Input>;
  where: Oauth_Codes_Bool_Exp;
};

/** column ordering options */
export enum Order_By {
  /** in ascending order, nulls last */
  Asc = 'asc',
  /** in ascending order, nulls first */
  AscNullsFirst = 'asc_nulls_first',
  /** in ascending order, nulls last */
  AscNullsLast = 'asc_nulls_last',
  /** in descending order, nulls first */
  Desc = 'desc',
  /** in descending order, nulls first */
  DescNullsFirst = 'desc_nulls_first',
  /** in descending order, nulls last */
  DescNullsLast = 'desc_nulls_last'
}

/** columns and relationships of "plaid_accounts" */
export type PlaidAccounts = {
  __typename?: 'plaidAccounts';
  created_at: Scalars['timestamptz'];
  /** An array relationship */
  destination_connections: Array<Destination_Accounts>;
  /** An aggregate relationship */
  destination_connections_aggregate: Destination_Accounts_Aggregate;
  id: Scalars['String'];
  is_closed: Scalars['Boolean'];
  /** An object relationship */
  item: Plaid_Items;
  mask?: Maybe<Scalars['String']>;
  name: Scalars['String'];
  plaid_item_id: Scalars['String'];
};


/** columns and relationships of "plaid_accounts" */
export type PlaidAccountsDestination_ConnectionsArgs = {
  distinct_on?: InputMaybe<Array<Destination_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destination_Accounts_Order_By>>;
  where?: InputMaybe<Destination_Accounts_Bool_Exp>;
};


/** columns and relationships of "plaid_accounts" */
export type PlaidAccountsDestination_Connections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Destination_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destination_Accounts_Order_By>>;
  where?: InputMaybe<Destination_Accounts_Bool_Exp>;
};

/** aggregated selection of "plaid_accounts" */
export type PlaidAccounts_Aggregate = {
  __typename?: 'plaidAccounts_aggregate';
  aggregate?: Maybe<PlaidAccounts_Aggregate_Fields>;
  nodes: Array<PlaidAccounts>;
};

export type PlaidAccounts_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<PlaidAccounts_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<PlaidAccounts_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<PlaidAccounts_Aggregate_Bool_Exp_Count>;
};

export type PlaidAccounts_Aggregate_Bool_Exp_Bool_And = {
  arguments: PlaidAccounts_Select_Column_PlaidAccounts_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<PlaidAccounts_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type PlaidAccounts_Aggregate_Bool_Exp_Bool_Or = {
  arguments: PlaidAccounts_Select_Column_PlaidAccounts_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<PlaidAccounts_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type PlaidAccounts_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<PlaidAccounts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<PlaidAccounts_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "plaid_accounts" */
export type PlaidAccounts_Aggregate_Fields = {
  __typename?: 'plaidAccounts_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<PlaidAccounts_Max_Fields>;
  min?: Maybe<PlaidAccounts_Min_Fields>;
};


/** aggregate fields of "plaid_accounts" */
export type PlaidAccounts_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<PlaidAccounts_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "plaid_accounts" */
export type PlaidAccounts_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<PlaidAccounts_Max_Order_By>;
  min?: InputMaybe<PlaidAccounts_Min_Order_By>;
};

/** input type for inserting array relation for remote table "plaid_accounts" */
export type PlaidAccounts_Arr_Rel_Insert_Input = {
  data: Array<PlaidAccounts_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<PlaidAccounts_On_Conflict>;
};

/** Boolean expression to filter rows from the table "plaid_accounts". All fields are combined with a logical 'AND'. */
export type PlaidAccounts_Bool_Exp = {
  _and?: InputMaybe<Array<PlaidAccounts_Bool_Exp>>;
  _not?: InputMaybe<PlaidAccounts_Bool_Exp>;
  _or?: InputMaybe<Array<PlaidAccounts_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  destination_connections?: InputMaybe<Destination_Accounts_Bool_Exp>;
  destination_connections_aggregate?: InputMaybe<Destination_Accounts_Aggregate_Bool_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  is_closed?: InputMaybe<Boolean_Comparison_Exp>;
  item?: InputMaybe<Plaid_Items_Bool_Exp>;
  mask?: InputMaybe<String_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
  plaid_item_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "plaid_accounts" */
export enum PlaidAccounts_Constraint {
  /** unique or primary key constraint on columns "id" */
  PlaidAccountsPkey = 'plaid_accounts_pkey'
}

/** input type for inserting data into table "plaid_accounts" */
export type PlaidAccounts_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  destination_connections?: InputMaybe<Destination_Accounts_Arr_Rel_Insert_Input>;
  id?: InputMaybe<Scalars['String']>;
  is_closed?: InputMaybe<Scalars['Boolean']>;
  item?: InputMaybe<Plaid_Items_Obj_Rel_Insert_Input>;
  mask?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  plaid_item_id?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type PlaidAccounts_Max_Fields = {
  __typename?: 'plaidAccounts_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['String']>;
  mask?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  plaid_item_id?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "plaid_accounts" */
export type PlaidAccounts_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mask?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  plaid_item_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type PlaidAccounts_Min_Fields = {
  __typename?: 'plaidAccounts_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['String']>;
  mask?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  plaid_item_id?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "plaid_accounts" */
export type PlaidAccounts_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  mask?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  plaid_item_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "plaid_accounts" */
export type PlaidAccounts_Mutation_Response = {
  __typename?: 'plaidAccounts_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<PlaidAccounts>;
};

/** input type for inserting object relation for remote table "plaid_accounts" */
export type PlaidAccounts_Obj_Rel_Insert_Input = {
  data: PlaidAccounts_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<PlaidAccounts_On_Conflict>;
};

/** on_conflict condition type for table "plaid_accounts" */
export type PlaidAccounts_On_Conflict = {
  constraint: PlaidAccounts_Constraint;
  update_columns?: Array<PlaidAccounts_Update_Column>;
  where?: InputMaybe<PlaidAccounts_Bool_Exp>;
};

/** Ordering options when selecting data from "plaid_accounts". */
export type PlaidAccounts_Order_By = {
  created_at?: InputMaybe<Order_By>;
  destination_connections_aggregate?: InputMaybe<Destination_Accounts_Aggregate_Order_By>;
  id?: InputMaybe<Order_By>;
  is_closed?: InputMaybe<Order_By>;
  item?: InputMaybe<Plaid_Items_Order_By>;
  mask?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
  plaid_item_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: plaid_accounts */
export type PlaidAccounts_Pk_Columns_Input = {
  id: Scalars['String'];
};

/** select columns of table "plaid_accounts" */
export enum PlaidAccounts_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsClosed = 'is_closed',
  /** column name */
  Mask = 'mask',
  /** column name */
  Name = 'name',
  /** column name */
  PlaidItemId = 'plaid_item_id'
}

/** select "plaidAccounts_aggregate_bool_exp_bool_and_arguments_columns" columns of table "plaid_accounts" */
export enum PlaidAccounts_Select_Column_PlaidAccounts_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsClosed = 'is_closed'
}

/** select "plaidAccounts_aggregate_bool_exp_bool_or_arguments_columns" columns of table "plaid_accounts" */
export enum PlaidAccounts_Select_Column_PlaidAccounts_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsClosed = 'is_closed'
}

/** input type for updating data in table "plaid_accounts" */
export type PlaidAccounts_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['String']>;
  is_closed?: InputMaybe<Scalars['Boolean']>;
  mask?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  plaid_item_id?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "plaidAccounts" */
export type PlaidAccounts_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: PlaidAccounts_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type PlaidAccounts_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  id?: InputMaybe<Scalars['String']>;
  is_closed?: InputMaybe<Scalars['Boolean']>;
  mask?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  plaid_item_id?: InputMaybe<Scalars['String']>;
};

/** update columns of table "plaid_accounts" */
export enum PlaidAccounts_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  Id = 'id',
  /** column name */
  IsClosed = 'is_closed',
  /** column name */
  Mask = 'mask',
  /** column name */
  Name = 'name',
  /** column name */
  PlaidItemId = 'plaid_item_id'
}

export type PlaidAccounts_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<PlaidAccounts_Set_Input>;
  where: PlaidAccounts_Bool_Exp;
};

/** columns and relationships of "plaid_institutions" */
export type Plaid_Institutions = {
  __typename?: 'plaid_institutions';
  id: Scalars['String'];
  /** An object relationship */
  logo_file?: Maybe<Files>;
  logo_file_id?: Maybe<Scalars['uuid']>;
  name: Scalars['String'];
};

/** aggregated selection of "plaid_institutions" */
export type Plaid_Institutions_Aggregate = {
  __typename?: 'plaid_institutions_aggregate';
  aggregate?: Maybe<Plaid_Institutions_Aggregate_Fields>;
  nodes: Array<Plaid_Institutions>;
};

/** aggregate fields of "plaid_institutions" */
export type Plaid_Institutions_Aggregate_Fields = {
  __typename?: 'plaid_institutions_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Plaid_Institutions_Max_Fields>;
  min?: Maybe<Plaid_Institutions_Min_Fields>;
};


/** aggregate fields of "plaid_institutions" */
export type Plaid_Institutions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Plaid_Institutions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "plaid_institutions". All fields are combined with a logical 'AND'. */
export type Plaid_Institutions_Bool_Exp = {
  _and?: InputMaybe<Array<Plaid_Institutions_Bool_Exp>>;
  _not?: InputMaybe<Plaid_Institutions_Bool_Exp>;
  _or?: InputMaybe<Array<Plaid_Institutions_Bool_Exp>>;
  id?: InputMaybe<String_Comparison_Exp>;
  logo_file?: InputMaybe<Files_Bool_Exp>;
  logo_file_id?: InputMaybe<Uuid_Comparison_Exp>;
  name?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "plaid_institutions" */
export enum Plaid_Institutions_Constraint {
  /** unique or primary key constraint on columns "id" */
  PlaidInstitutionsPkey = 'plaid_institutions_pkey'
}

/** input type for inserting data into table "plaid_institutions" */
export type Plaid_Institutions_Insert_Input = {
  id?: InputMaybe<Scalars['String']>;
  logo_file?: InputMaybe<Files_Obj_Rel_Insert_Input>;
  logo_file_id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Plaid_Institutions_Max_Fields = {
  __typename?: 'plaid_institutions_max_fields';
  id?: Maybe<Scalars['String']>;
  logo_file_id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Plaid_Institutions_Min_Fields = {
  __typename?: 'plaid_institutions_min_fields';
  id?: Maybe<Scalars['String']>;
  logo_file_id?: Maybe<Scalars['uuid']>;
  name?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "plaid_institutions" */
export type Plaid_Institutions_Mutation_Response = {
  __typename?: 'plaid_institutions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Plaid_Institutions>;
};

/** input type for inserting object relation for remote table "plaid_institutions" */
export type Plaid_Institutions_Obj_Rel_Insert_Input = {
  data: Plaid_Institutions_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Plaid_Institutions_On_Conflict>;
};

/** on_conflict condition type for table "plaid_institutions" */
export type Plaid_Institutions_On_Conflict = {
  constraint: Plaid_Institutions_Constraint;
  update_columns?: Array<Plaid_Institutions_Update_Column>;
  where?: InputMaybe<Plaid_Institutions_Bool_Exp>;
};

/** Ordering options when selecting data from "plaid_institutions". */
export type Plaid_Institutions_Order_By = {
  id?: InputMaybe<Order_By>;
  logo_file?: InputMaybe<Files_Order_By>;
  logo_file_id?: InputMaybe<Order_By>;
  name?: InputMaybe<Order_By>;
};

/** primary key columns input for table: plaid_institutions */
export type Plaid_Institutions_Pk_Columns_Input = {
  id: Scalars['String'];
};

/** select columns of table "plaid_institutions" */
export enum Plaid_Institutions_Select_Column {
  /** column name */
  Id = 'id',
  /** column name */
  LogoFileId = 'logo_file_id',
  /** column name */
  Name = 'name'
}

/** input type for updating data in table "plaid_institutions" */
export type Plaid_Institutions_Set_Input = {
  id?: InputMaybe<Scalars['String']>;
  logo_file_id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "plaid_institutions" */
export type Plaid_Institutions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Plaid_Institutions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Plaid_Institutions_Stream_Cursor_Value_Input = {
  id?: InputMaybe<Scalars['String']>;
  logo_file_id?: InputMaybe<Scalars['uuid']>;
  name?: InputMaybe<Scalars['String']>;
};

/** update columns of table "plaid_institutions" */
export enum Plaid_Institutions_Update_Column {
  /** column name */
  Id = 'id',
  /** column name */
  LogoFileId = 'logo_file_id',
  /** column name */
  Name = 'name'
}

export type Plaid_Institutions_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Plaid_Institutions_Set_Input>;
  where: Plaid_Institutions_Bool_Exp;
};

/** columns and relationships of "plaid_item_sync_logs" */
export type Plaid_Item_Sync_Logs = {
  __typename?: 'plaid_item_sync_logs';
  accounts: Scalars['jsonb'];
  error?: Maybe<Scalars['jsonb']>;
  holdings: Scalars['jsonb'];
  investment_transactions: Scalars['jsonb'];
  /** An object relationship */
  plaid_item: Plaid_Items;
  plaid_item_id: Scalars['String'];
  /** An object relationship */
  sync_log: Sync_Logs;
  sync_log_id: Scalars['uuid'];
  transactions: Scalars['jsonb'];
};


/** columns and relationships of "plaid_item_sync_logs" */
export type Plaid_Item_Sync_LogsAccountsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "plaid_item_sync_logs" */
export type Plaid_Item_Sync_LogsErrorArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "plaid_item_sync_logs" */
export type Plaid_Item_Sync_LogsHoldingsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "plaid_item_sync_logs" */
export type Plaid_Item_Sync_LogsInvestment_TransactionsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "plaid_item_sync_logs" */
export type Plaid_Item_Sync_LogsTransactionsArgs = {
  path?: InputMaybe<Scalars['String']>;
};

/** aggregated selection of "plaid_item_sync_logs" */
export type Plaid_Item_Sync_Logs_Aggregate = {
  __typename?: 'plaid_item_sync_logs_aggregate';
  aggregate?: Maybe<Plaid_Item_Sync_Logs_Aggregate_Fields>;
  nodes: Array<Plaid_Item_Sync_Logs>;
};

export type Plaid_Item_Sync_Logs_Aggregate_Bool_Exp = {
  count?: InputMaybe<Plaid_Item_Sync_Logs_Aggregate_Bool_Exp_Count>;
};

export type Plaid_Item_Sync_Logs_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Plaid_Item_Sync_Logs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Plaid_Item_Sync_Logs_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "plaid_item_sync_logs" */
export type Plaid_Item_Sync_Logs_Aggregate_Fields = {
  __typename?: 'plaid_item_sync_logs_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Plaid_Item_Sync_Logs_Max_Fields>;
  min?: Maybe<Plaid_Item_Sync_Logs_Min_Fields>;
};


/** aggregate fields of "plaid_item_sync_logs" */
export type Plaid_Item_Sync_Logs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Plaid_Item_Sync_Logs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "plaid_item_sync_logs" */
export type Plaid_Item_Sync_Logs_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Plaid_Item_Sync_Logs_Max_Order_By>;
  min?: InputMaybe<Plaid_Item_Sync_Logs_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Plaid_Item_Sync_Logs_Append_Input = {
  accounts?: InputMaybe<Scalars['jsonb']>;
  error?: InputMaybe<Scalars['jsonb']>;
  holdings?: InputMaybe<Scalars['jsonb']>;
  investment_transactions?: InputMaybe<Scalars['jsonb']>;
  transactions?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "plaid_item_sync_logs" */
export type Plaid_Item_Sync_Logs_Arr_Rel_Insert_Input = {
  data: Array<Plaid_Item_Sync_Logs_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Plaid_Item_Sync_Logs_On_Conflict>;
};

/** Boolean expression to filter rows from the table "plaid_item_sync_logs". All fields are combined with a logical 'AND'. */
export type Plaid_Item_Sync_Logs_Bool_Exp = {
  _and?: InputMaybe<Array<Plaid_Item_Sync_Logs_Bool_Exp>>;
  _not?: InputMaybe<Plaid_Item_Sync_Logs_Bool_Exp>;
  _or?: InputMaybe<Array<Plaid_Item_Sync_Logs_Bool_Exp>>;
  accounts?: InputMaybe<Jsonb_Comparison_Exp>;
  error?: InputMaybe<Jsonb_Comparison_Exp>;
  holdings?: InputMaybe<Jsonb_Comparison_Exp>;
  investment_transactions?: InputMaybe<Jsonb_Comparison_Exp>;
  plaid_item?: InputMaybe<Plaid_Items_Bool_Exp>;
  plaid_item_id?: InputMaybe<String_Comparison_Exp>;
  sync_log?: InputMaybe<Sync_Logs_Bool_Exp>;
  sync_log_id?: InputMaybe<Uuid_Comparison_Exp>;
  transactions?: InputMaybe<Jsonb_Comparison_Exp>;
};

/** unique or primary key constraints on table "plaid_item_sync_logs" */
export enum Plaid_Item_Sync_Logs_Constraint {
  /** unique or primary key constraint on columns "sync_log_id", "plaid_item_id" */
  PlaidItemSyncLogsPkey = 'plaid_item_sync_logs_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Plaid_Item_Sync_Logs_Delete_At_Path_Input = {
  accounts?: InputMaybe<Array<Scalars['String']>>;
  error?: InputMaybe<Array<Scalars['String']>>;
  holdings?: InputMaybe<Array<Scalars['String']>>;
  investment_transactions?: InputMaybe<Array<Scalars['String']>>;
  transactions?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Plaid_Item_Sync_Logs_Delete_Elem_Input = {
  accounts?: InputMaybe<Scalars['Int']>;
  error?: InputMaybe<Scalars['Int']>;
  holdings?: InputMaybe<Scalars['Int']>;
  investment_transactions?: InputMaybe<Scalars['Int']>;
  transactions?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Plaid_Item_Sync_Logs_Delete_Key_Input = {
  accounts?: InputMaybe<Scalars['String']>;
  error?: InputMaybe<Scalars['String']>;
  holdings?: InputMaybe<Scalars['String']>;
  investment_transactions?: InputMaybe<Scalars['String']>;
  transactions?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "plaid_item_sync_logs" */
export type Plaid_Item_Sync_Logs_Insert_Input = {
  accounts?: InputMaybe<Scalars['jsonb']>;
  error?: InputMaybe<Scalars['jsonb']>;
  holdings?: InputMaybe<Scalars['jsonb']>;
  investment_transactions?: InputMaybe<Scalars['jsonb']>;
  plaid_item?: InputMaybe<Plaid_Items_Obj_Rel_Insert_Input>;
  plaid_item_id?: InputMaybe<Scalars['String']>;
  sync_log?: InputMaybe<Sync_Logs_Obj_Rel_Insert_Input>;
  sync_log_id?: InputMaybe<Scalars['uuid']>;
  transactions?: InputMaybe<Scalars['jsonb']>;
};

/** aggregate max on columns */
export type Plaid_Item_Sync_Logs_Max_Fields = {
  __typename?: 'plaid_item_sync_logs_max_fields';
  plaid_item_id?: Maybe<Scalars['String']>;
  sync_log_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "plaid_item_sync_logs" */
export type Plaid_Item_Sync_Logs_Max_Order_By = {
  plaid_item_id?: InputMaybe<Order_By>;
  sync_log_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Plaid_Item_Sync_Logs_Min_Fields = {
  __typename?: 'plaid_item_sync_logs_min_fields';
  plaid_item_id?: Maybe<Scalars['String']>;
  sync_log_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "plaid_item_sync_logs" */
export type Plaid_Item_Sync_Logs_Min_Order_By = {
  plaid_item_id?: InputMaybe<Order_By>;
  sync_log_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "plaid_item_sync_logs" */
export type Plaid_Item_Sync_Logs_Mutation_Response = {
  __typename?: 'plaid_item_sync_logs_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Plaid_Item_Sync_Logs>;
};

/** on_conflict condition type for table "plaid_item_sync_logs" */
export type Plaid_Item_Sync_Logs_On_Conflict = {
  constraint: Plaid_Item_Sync_Logs_Constraint;
  update_columns?: Array<Plaid_Item_Sync_Logs_Update_Column>;
  where?: InputMaybe<Plaid_Item_Sync_Logs_Bool_Exp>;
};

/** Ordering options when selecting data from "plaid_item_sync_logs". */
export type Plaid_Item_Sync_Logs_Order_By = {
  accounts?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  holdings?: InputMaybe<Order_By>;
  investment_transactions?: InputMaybe<Order_By>;
  plaid_item?: InputMaybe<Plaid_Items_Order_By>;
  plaid_item_id?: InputMaybe<Order_By>;
  sync_log?: InputMaybe<Sync_Logs_Order_By>;
  sync_log_id?: InputMaybe<Order_By>;
  transactions?: InputMaybe<Order_By>;
};

/** primary key columns input for table: plaid_item_sync_logs */
export type Plaid_Item_Sync_Logs_Pk_Columns_Input = {
  plaid_item_id: Scalars['String'];
  sync_log_id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Plaid_Item_Sync_Logs_Prepend_Input = {
  accounts?: InputMaybe<Scalars['jsonb']>;
  error?: InputMaybe<Scalars['jsonb']>;
  holdings?: InputMaybe<Scalars['jsonb']>;
  investment_transactions?: InputMaybe<Scalars['jsonb']>;
  transactions?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "plaid_item_sync_logs" */
export enum Plaid_Item_Sync_Logs_Select_Column {
  /** column name */
  Accounts = 'accounts',
  /** column name */
  Error = 'error',
  /** column name */
  Holdings = 'holdings',
  /** column name */
  InvestmentTransactions = 'investment_transactions',
  /** column name */
  PlaidItemId = 'plaid_item_id',
  /** column name */
  SyncLogId = 'sync_log_id',
  /** column name */
  Transactions = 'transactions'
}

/** input type for updating data in table "plaid_item_sync_logs" */
export type Plaid_Item_Sync_Logs_Set_Input = {
  accounts?: InputMaybe<Scalars['jsonb']>;
  error?: InputMaybe<Scalars['jsonb']>;
  holdings?: InputMaybe<Scalars['jsonb']>;
  investment_transactions?: InputMaybe<Scalars['jsonb']>;
  plaid_item_id?: InputMaybe<Scalars['String']>;
  sync_log_id?: InputMaybe<Scalars['uuid']>;
  transactions?: InputMaybe<Scalars['jsonb']>;
};

/** Streaming cursor of the table "plaid_item_sync_logs" */
export type Plaid_Item_Sync_Logs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Plaid_Item_Sync_Logs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Plaid_Item_Sync_Logs_Stream_Cursor_Value_Input = {
  accounts?: InputMaybe<Scalars['jsonb']>;
  error?: InputMaybe<Scalars['jsonb']>;
  holdings?: InputMaybe<Scalars['jsonb']>;
  investment_transactions?: InputMaybe<Scalars['jsonb']>;
  plaid_item_id?: InputMaybe<Scalars['String']>;
  sync_log_id?: InputMaybe<Scalars['uuid']>;
  transactions?: InputMaybe<Scalars['jsonb']>;
};

/** update columns of table "plaid_item_sync_logs" */
export enum Plaid_Item_Sync_Logs_Update_Column {
  /** column name */
  Accounts = 'accounts',
  /** column name */
  Error = 'error',
  /** column name */
  Holdings = 'holdings',
  /** column name */
  InvestmentTransactions = 'investment_transactions',
  /** column name */
  PlaidItemId = 'plaid_item_id',
  /** column name */
  SyncLogId = 'sync_log_id',
  /** column name */
  Transactions = 'transactions'
}

export type Plaid_Item_Sync_Logs_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Plaid_Item_Sync_Logs_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Plaid_Item_Sync_Logs_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Plaid_Item_Sync_Logs_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Plaid_Item_Sync_Logs_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Plaid_Item_Sync_Logs_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Plaid_Item_Sync_Logs_Set_Input>;
  where: Plaid_Item_Sync_Logs_Bool_Exp;
};

/** columns and relationships of "plaid_items" */
export type Plaid_Items = {
  __typename?: 'plaid_items';
  accessToken: Scalars['String'];
  /** An array relationship */
  accounts: Array<PlaidAccounts>;
  /** An aggregate relationship */
  accounts_aggregate: PlaidAccounts_Aggregate;
  available_products?: Maybe<Scalars['jsonb']>;
  billed_products?: Maybe<Scalars['jsonb']>;
  consentExpiresAt?: Maybe<Scalars['timestamptz']>;
  created_at: Scalars['timestamptz'];
  disabled_at?: Maybe<Scalars['timestamptz']>;
  error?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  /** An object relationship */
  institution: Plaid_Institutions;
  institution_id: Scalars['String'];
  is_historical_update_complete: Scalars['Boolean'];
  is_initial_update_complete: Scalars['Boolean'];
  /** An array relationship */
  plaid_item_sync_logs: Array<Plaid_Item_Sync_Logs>;
  /** An aggregate relationship */
  plaid_item_sync_logs_aggregate: Plaid_Item_Sync_Logs_Aggregate;
  plaid_sync_cursor?: Maybe<Scalars['String']>;
  plaid_sync_cursor_added_at?: Maybe<Scalars['timestamptz']>;
  /** An array relationship */
  removed_transactions: Array<Removed_Plaid_Transactions>;
  /** An aggregate relationship */
  removed_transactions_aggregate: Removed_Plaid_Transactions_Aggregate;
  synced_at?: Maybe<Scalars['timestamptz']>;
  /** An object relationship */
  user: Users;
  user_id: Scalars['uuid'];
};


/** columns and relationships of "plaid_items" */
export type Plaid_ItemsAccountsArgs = {
  distinct_on?: InputMaybe<Array<PlaidAccounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<PlaidAccounts_Order_By>>;
  where?: InputMaybe<PlaidAccounts_Bool_Exp>;
};


/** columns and relationships of "plaid_items" */
export type Plaid_ItemsAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<PlaidAccounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<PlaidAccounts_Order_By>>;
  where?: InputMaybe<PlaidAccounts_Bool_Exp>;
};


/** columns and relationships of "plaid_items" */
export type Plaid_ItemsAvailable_ProductsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "plaid_items" */
export type Plaid_ItemsBilled_ProductsArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** columns and relationships of "plaid_items" */
export type Plaid_ItemsPlaid_Item_Sync_LogsArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Item_Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Item_Sync_Logs_Order_By>>;
  where?: InputMaybe<Plaid_Item_Sync_Logs_Bool_Exp>;
};


/** columns and relationships of "plaid_items" */
export type Plaid_ItemsPlaid_Item_Sync_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Item_Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Item_Sync_Logs_Order_By>>;
  where?: InputMaybe<Plaid_Item_Sync_Logs_Bool_Exp>;
};


/** columns and relationships of "plaid_items" */
export type Plaid_ItemsRemoved_TransactionsArgs = {
  distinct_on?: InputMaybe<Array<Removed_Plaid_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Removed_Plaid_Transactions_Order_By>>;
  where?: InputMaybe<Removed_Plaid_Transactions_Bool_Exp>;
};


/** columns and relationships of "plaid_items" */
export type Plaid_ItemsRemoved_Transactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Removed_Plaid_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Removed_Plaid_Transactions_Order_By>>;
  where?: InputMaybe<Removed_Plaid_Transactions_Bool_Exp>;
};

/** aggregated selection of "plaid_items" */
export type Plaid_Items_Aggregate = {
  __typename?: 'plaid_items_aggregate';
  aggregate?: Maybe<Plaid_Items_Aggregate_Fields>;
  nodes: Array<Plaid_Items>;
};

export type Plaid_Items_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Plaid_Items_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Plaid_Items_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Plaid_Items_Aggregate_Bool_Exp_Count>;
};

export type Plaid_Items_Aggregate_Bool_Exp_Bool_And = {
  arguments: Plaid_Items_Select_Column_Plaid_Items_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Plaid_Items_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Plaid_Items_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Plaid_Items_Select_Column_Plaid_Items_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Plaid_Items_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Plaid_Items_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Plaid_Items_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Plaid_Items_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "plaid_items" */
export type Plaid_Items_Aggregate_Fields = {
  __typename?: 'plaid_items_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Plaid_Items_Max_Fields>;
  min?: Maybe<Plaid_Items_Min_Fields>;
};


/** aggregate fields of "plaid_items" */
export type Plaid_Items_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Plaid_Items_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "plaid_items" */
export type Plaid_Items_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Plaid_Items_Max_Order_By>;
  min?: InputMaybe<Plaid_Items_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Plaid_Items_Append_Input = {
  available_products?: InputMaybe<Scalars['jsonb']>;
  billed_products?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "plaid_items" */
export type Plaid_Items_Arr_Rel_Insert_Input = {
  data: Array<Plaid_Items_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Plaid_Items_On_Conflict>;
};

/** Boolean expression to filter rows from the table "plaid_items". All fields are combined with a logical 'AND'. */
export type Plaid_Items_Bool_Exp = {
  _and?: InputMaybe<Array<Plaid_Items_Bool_Exp>>;
  _not?: InputMaybe<Plaid_Items_Bool_Exp>;
  _or?: InputMaybe<Array<Plaid_Items_Bool_Exp>>;
  accessToken?: InputMaybe<String_Comparison_Exp>;
  accounts?: InputMaybe<PlaidAccounts_Bool_Exp>;
  accounts_aggregate?: InputMaybe<PlaidAccounts_Aggregate_Bool_Exp>;
  available_products?: InputMaybe<Jsonb_Comparison_Exp>;
  billed_products?: InputMaybe<Jsonb_Comparison_Exp>;
  consentExpiresAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  disabled_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  error?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  institution?: InputMaybe<Plaid_Institutions_Bool_Exp>;
  institution_id?: InputMaybe<String_Comparison_Exp>;
  is_historical_update_complete?: InputMaybe<Boolean_Comparison_Exp>;
  is_initial_update_complete?: InputMaybe<Boolean_Comparison_Exp>;
  plaid_item_sync_logs?: InputMaybe<Plaid_Item_Sync_Logs_Bool_Exp>;
  plaid_item_sync_logs_aggregate?: InputMaybe<Plaid_Item_Sync_Logs_Aggregate_Bool_Exp>;
  plaid_sync_cursor?: InputMaybe<String_Comparison_Exp>;
  plaid_sync_cursor_added_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  removed_transactions?: InputMaybe<Removed_Plaid_Transactions_Bool_Exp>;
  removed_transactions_aggregate?: InputMaybe<Removed_Plaid_Transactions_Aggregate_Bool_Exp>;
  synced_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  user_id?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "plaid_items" */
export enum Plaid_Items_Constraint {
  /** unique or primary key constraint on columns "id" */
  PlaidItemsPkey = 'plaid_items_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Plaid_Items_Delete_At_Path_Input = {
  available_products?: InputMaybe<Array<Scalars['String']>>;
  billed_products?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Plaid_Items_Delete_Elem_Input = {
  available_products?: InputMaybe<Scalars['Int']>;
  billed_products?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Plaid_Items_Delete_Key_Input = {
  available_products?: InputMaybe<Scalars['String']>;
  billed_products?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "plaid_items" */
export type Plaid_Items_Insert_Input = {
  accessToken?: InputMaybe<Scalars['String']>;
  accounts?: InputMaybe<PlaidAccounts_Arr_Rel_Insert_Input>;
  available_products?: InputMaybe<Scalars['jsonb']>;
  billed_products?: InputMaybe<Scalars['jsonb']>;
  consentExpiresAt?: InputMaybe<Scalars['timestamptz']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  disabled_at?: InputMaybe<Scalars['timestamptz']>;
  error?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  institution?: InputMaybe<Plaid_Institutions_Obj_Rel_Insert_Input>;
  institution_id?: InputMaybe<Scalars['String']>;
  is_historical_update_complete?: InputMaybe<Scalars['Boolean']>;
  is_initial_update_complete?: InputMaybe<Scalars['Boolean']>;
  plaid_item_sync_logs?: InputMaybe<Plaid_Item_Sync_Logs_Arr_Rel_Insert_Input>;
  plaid_sync_cursor?: InputMaybe<Scalars['String']>;
  plaid_sync_cursor_added_at?: InputMaybe<Scalars['timestamptz']>;
  removed_transactions?: InputMaybe<Removed_Plaid_Transactions_Arr_Rel_Insert_Input>;
  synced_at?: InputMaybe<Scalars['timestamptz']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  user_id?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type Plaid_Items_Max_Fields = {
  __typename?: 'plaid_items_max_fields';
  accessToken?: Maybe<Scalars['String']>;
  consentExpiresAt?: Maybe<Scalars['timestamptz']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  disabled_at?: Maybe<Scalars['timestamptz']>;
  error?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  institution_id?: Maybe<Scalars['String']>;
  plaid_sync_cursor?: Maybe<Scalars['String']>;
  plaid_sync_cursor_added_at?: Maybe<Scalars['timestamptz']>;
  synced_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by max() on columns of table "plaid_items" */
export type Plaid_Items_Max_Order_By = {
  accessToken?: InputMaybe<Order_By>;
  consentExpiresAt?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  disabled_at?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  institution_id?: InputMaybe<Order_By>;
  plaid_sync_cursor?: InputMaybe<Order_By>;
  plaid_sync_cursor_added_at?: InputMaybe<Order_By>;
  synced_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Plaid_Items_Min_Fields = {
  __typename?: 'plaid_items_min_fields';
  accessToken?: Maybe<Scalars['String']>;
  consentExpiresAt?: Maybe<Scalars['timestamptz']>;
  created_at?: Maybe<Scalars['timestamptz']>;
  disabled_at?: Maybe<Scalars['timestamptz']>;
  error?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  institution_id?: Maybe<Scalars['String']>;
  plaid_sync_cursor?: Maybe<Scalars['String']>;
  plaid_sync_cursor_added_at?: Maybe<Scalars['timestamptz']>;
  synced_at?: Maybe<Scalars['timestamptz']>;
  user_id?: Maybe<Scalars['uuid']>;
};

/** order by min() on columns of table "plaid_items" */
export type Plaid_Items_Min_Order_By = {
  accessToken?: InputMaybe<Order_By>;
  consentExpiresAt?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  disabled_at?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  institution_id?: InputMaybe<Order_By>;
  plaid_sync_cursor?: InputMaybe<Order_By>;
  plaid_sync_cursor_added_at?: InputMaybe<Order_By>;
  synced_at?: InputMaybe<Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "plaid_items" */
export type Plaid_Items_Mutation_Response = {
  __typename?: 'plaid_items_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Plaid_Items>;
};

/** input type for inserting object relation for remote table "plaid_items" */
export type Plaid_Items_Obj_Rel_Insert_Input = {
  data: Plaid_Items_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Plaid_Items_On_Conflict>;
};

/** on_conflict condition type for table "plaid_items" */
export type Plaid_Items_On_Conflict = {
  constraint: Plaid_Items_Constraint;
  update_columns?: Array<Plaid_Items_Update_Column>;
  where?: InputMaybe<Plaid_Items_Bool_Exp>;
};

/** Ordering options when selecting data from "plaid_items". */
export type Plaid_Items_Order_By = {
  accessToken?: InputMaybe<Order_By>;
  accounts_aggregate?: InputMaybe<PlaidAccounts_Aggregate_Order_By>;
  available_products?: InputMaybe<Order_By>;
  billed_products?: InputMaybe<Order_By>;
  consentExpiresAt?: InputMaybe<Order_By>;
  created_at?: InputMaybe<Order_By>;
  disabled_at?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  institution?: InputMaybe<Plaid_Institutions_Order_By>;
  institution_id?: InputMaybe<Order_By>;
  is_historical_update_complete?: InputMaybe<Order_By>;
  is_initial_update_complete?: InputMaybe<Order_By>;
  plaid_item_sync_logs_aggregate?: InputMaybe<Plaid_Item_Sync_Logs_Aggregate_Order_By>;
  plaid_sync_cursor?: InputMaybe<Order_By>;
  plaid_sync_cursor_added_at?: InputMaybe<Order_By>;
  removed_transactions_aggregate?: InputMaybe<Removed_Plaid_Transactions_Aggregate_Order_By>;
  synced_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  user_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: plaid_items */
export type Plaid_Items_Pk_Columns_Input = {
  id: Scalars['String'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Plaid_Items_Prepend_Input = {
  available_products?: InputMaybe<Scalars['jsonb']>;
  billed_products?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "plaid_items" */
export enum Plaid_Items_Select_Column {
  /** column name */
  AccessToken = 'accessToken',
  /** column name */
  AvailableProducts = 'available_products',
  /** column name */
  BilledProducts = 'billed_products',
  /** column name */
  ConsentExpiresAt = 'consentExpiresAt',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DisabledAt = 'disabled_at',
  /** column name */
  Error = 'error',
  /** column name */
  Id = 'id',
  /** column name */
  InstitutionId = 'institution_id',
  /** column name */
  IsHistoricalUpdateComplete = 'is_historical_update_complete',
  /** column name */
  IsInitialUpdateComplete = 'is_initial_update_complete',
  /** column name */
  PlaidSyncCursor = 'plaid_sync_cursor',
  /** column name */
  PlaidSyncCursorAddedAt = 'plaid_sync_cursor_added_at',
  /** column name */
  SyncedAt = 'synced_at',
  /** column name */
  UserId = 'user_id'
}

/** select "plaid_items_aggregate_bool_exp_bool_and_arguments_columns" columns of table "plaid_items" */
export enum Plaid_Items_Select_Column_Plaid_Items_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  IsHistoricalUpdateComplete = 'is_historical_update_complete',
  /** column name */
  IsInitialUpdateComplete = 'is_initial_update_complete'
}

/** select "plaid_items_aggregate_bool_exp_bool_or_arguments_columns" columns of table "plaid_items" */
export enum Plaid_Items_Select_Column_Plaid_Items_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  IsHistoricalUpdateComplete = 'is_historical_update_complete',
  /** column name */
  IsInitialUpdateComplete = 'is_initial_update_complete'
}

/** input type for updating data in table "plaid_items" */
export type Plaid_Items_Set_Input = {
  accessToken?: InputMaybe<Scalars['String']>;
  available_products?: InputMaybe<Scalars['jsonb']>;
  billed_products?: InputMaybe<Scalars['jsonb']>;
  consentExpiresAt?: InputMaybe<Scalars['timestamptz']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  disabled_at?: InputMaybe<Scalars['timestamptz']>;
  error?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  institution_id?: InputMaybe<Scalars['String']>;
  is_historical_update_complete?: InputMaybe<Scalars['Boolean']>;
  is_initial_update_complete?: InputMaybe<Scalars['Boolean']>;
  plaid_sync_cursor?: InputMaybe<Scalars['String']>;
  plaid_sync_cursor_added_at?: InputMaybe<Scalars['timestamptz']>;
  synced_at?: InputMaybe<Scalars['timestamptz']>;
  user_id?: InputMaybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "plaid_items" */
export type Plaid_Items_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Plaid_Items_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Plaid_Items_Stream_Cursor_Value_Input = {
  accessToken?: InputMaybe<Scalars['String']>;
  available_products?: InputMaybe<Scalars['jsonb']>;
  billed_products?: InputMaybe<Scalars['jsonb']>;
  consentExpiresAt?: InputMaybe<Scalars['timestamptz']>;
  created_at?: InputMaybe<Scalars['timestamptz']>;
  disabled_at?: InputMaybe<Scalars['timestamptz']>;
  error?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  institution_id?: InputMaybe<Scalars['String']>;
  is_historical_update_complete?: InputMaybe<Scalars['Boolean']>;
  is_initial_update_complete?: InputMaybe<Scalars['Boolean']>;
  plaid_sync_cursor?: InputMaybe<Scalars['String']>;
  plaid_sync_cursor_added_at?: InputMaybe<Scalars['timestamptz']>;
  synced_at?: InputMaybe<Scalars['timestamptz']>;
  user_id?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "plaid_items" */
export enum Plaid_Items_Update_Column {
  /** column name */
  AccessToken = 'accessToken',
  /** column name */
  AvailableProducts = 'available_products',
  /** column name */
  BilledProducts = 'billed_products',
  /** column name */
  ConsentExpiresAt = 'consentExpiresAt',
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  DisabledAt = 'disabled_at',
  /** column name */
  Error = 'error',
  /** column name */
  Id = 'id',
  /** column name */
  InstitutionId = 'institution_id',
  /** column name */
  IsHistoricalUpdateComplete = 'is_historical_update_complete',
  /** column name */
  IsInitialUpdateComplete = 'is_initial_update_complete',
  /** column name */
  PlaidSyncCursor = 'plaid_sync_cursor',
  /** column name */
  PlaidSyncCursorAddedAt = 'plaid_sync_cursor_added_at',
  /** column name */
  SyncedAt = 'synced_at',
  /** column name */
  UserId = 'user_id'
}

export type Plaid_Items_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Plaid_Items_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Plaid_Items_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Plaid_Items_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Plaid_Items_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Plaid_Items_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Plaid_Items_Set_Input>;
  where: Plaid_Items_Bool_Exp;
};

export type Query_Root = {
  __typename?: 'query_root';
  /** fetch data from the table: "airtable_configs" */
  airtable_configs: Array<Airtable_Configs>;
  /** fetch aggregated fields from the table: "airtable_configs" */
  airtable_configs_aggregate: Airtable_Configs_Aggregate;
  /** fetch data from the table: "airtable_configs" using primary key columns */
  airtable_configs_by_pk?: Maybe<Airtable_Configs>;
  /** fetch data from the table: "auth.providers" using primary key columns */
  authProvider?: Maybe<AuthProviders>;
  /** fetch data from the table: "auth.provider_requests" using primary key columns */
  authProviderRequest?: Maybe<AuthProviderRequests>;
  /** fetch data from the table: "auth.provider_requests" */
  authProviderRequests: Array<AuthProviderRequests>;
  /** fetch aggregated fields from the table: "auth.provider_requests" */
  authProviderRequestsAggregate: AuthProviderRequests_Aggregate;
  /** fetch data from the table: "auth.providers" */
  authProviders: Array<AuthProviders>;
  /** fetch aggregated fields from the table: "auth.providers" */
  authProvidersAggregate: AuthProviders_Aggregate;
  /** fetch data from the table: "auth.refresh_tokens" using primary key columns */
  authRefreshToken?: Maybe<AuthRefreshTokens>;
  /** fetch data from the table: "auth.refresh_tokens" */
  authRefreshTokens: Array<AuthRefreshTokens>;
  /** fetch aggregated fields from the table: "auth.refresh_tokens" */
  authRefreshTokensAggregate: AuthRefreshTokens_Aggregate;
  /** fetch data from the table: "auth.roles" using primary key columns */
  authRole?: Maybe<AuthRoles>;
  /** fetch data from the table: "auth.roles" */
  authRoles: Array<AuthRoles>;
  /** fetch aggregated fields from the table: "auth.roles" */
  authRolesAggregate: AuthRoles_Aggregate;
  /** fetch data from the table: "auth.user_providers" using primary key columns */
  authUserProvider?: Maybe<AuthUserProviders>;
  /** fetch data from the table: "auth.user_providers" */
  authUserProviders: Array<AuthUserProviders>;
  /** fetch aggregated fields from the table: "auth.user_providers" */
  authUserProvidersAggregate: AuthUserProviders_Aggregate;
  /** fetch data from the table: "auth.user_roles" using primary key columns */
  authUserRole?: Maybe<AuthUserRoles>;
  /** fetch data from the table: "auth.user_roles" */
  authUserRoles: Array<AuthUserRoles>;
  /** fetch aggregated fields from the table: "auth.user_roles" */
  authUserRolesAggregate: AuthUserRoles_Aggregate;
  /** fetch data from the table: "auth.user_security_keys" using primary key columns */
  authUserSecurityKey?: Maybe<AuthUserSecurityKeys>;
  /** fetch data from the table: "auth.user_security_keys" */
  authUserSecurityKeys: Array<AuthUserSecurityKeys>;
  /** fetch aggregated fields from the table: "auth.user_security_keys" */
  authUserSecurityKeysAggregate: AuthUserSecurityKeys_Aggregate;
  billingPortalSession: BillingPortalSession;
  /** fetch data from the table: "storage.buckets" using primary key columns */
  bucket?: Maybe<Buckets>;
  /** fetch data from the table: "storage.buckets" */
  buckets: Array<Buckets>;
  /** fetch aggregated fields from the table: "storage.buckets" */
  bucketsAggregate: Buckets_Aggregate;
  checkoutPortalSession: CheckoutPortalSession;
  /** fetch data from the table: "coda_configs" */
  coda_configs: Array<Coda_Configs>;
  /** fetch aggregated fields from the table: "coda_configs" */
  coda_configs_aggregate: Coda_Configs_Aggregate;
  /** fetch data from the table: "coda_configs" using primary key columns */
  coda_configs_by_pk?: Maybe<Coda_Configs>;
  /** fetch data from the table: "destination_accounts" */
  destination_accounts: Array<Destination_Accounts>;
  /** fetch aggregated fields from the table: "destination_accounts" */
  destination_accounts_aggregate: Destination_Accounts_Aggregate;
  /** fetch data from the table: "destination_accounts" using primary key columns */
  destination_accounts_by_pk?: Maybe<Destination_Accounts>;
  /** An array relationship */
  destination_sync_logs: Array<Destination_Sync_Logs>;
  /** An aggregate relationship */
  destination_sync_logs_aggregate: Destination_Sync_Logs_Aggregate;
  /** fetch data from the table: "destination_sync_logs" using primary key columns */
  destination_sync_logs_by_pk?: Maybe<Destination_Sync_Logs>;
  /** An array relationship */
  destinations: Array<Destinations>;
  /** An aggregate relationship */
  destinations_aggregate: Destinations_Aggregate;
  /** fetch data from the table: "destinations" using primary key columns */
  destinations_by_pk?: Maybe<Destinations>;
  /** fetch data from the table: "storage.files" using primary key columns */
  file?: Maybe<Files>;
  /** An array relationship */
  files: Array<Files>;
  /** fetch aggregated fields from the table: "storage.files" */
  filesAggregate: Files_Aggregate;
  /** fetch data from the table: "frequencies" */
  frequencies: Array<Frequencies>;
  /** fetch aggregated fields from the table: "frequencies" */
  frequencies_aggregate: Frequencies_Aggregate;
  /** fetch data from the table: "frequencies" using primary key columns */
  frequencies_by_pk?: Maybe<Frequencies>;
  /** fetch data from the table: "integrations" */
  integrations: Array<Integrations>;
  /** fetch aggregated fields from the table: "integrations" */
  integrations_aggregate: Integrations_Aggregate;
  /** fetch data from the table: "integrations" using primary key columns */
  integrations_by_pk?: Maybe<Integrations>;
  /** An array relationship */
  notion_connections: Array<Notion_Connections>;
  /** An aggregate relationship */
  notion_connections_aggregate: Notion_Connections_Aggregate;
  /** fetch data from the table: "notion_connections" using primary key columns */
  notion_connections_by_pk?: Maybe<Notion_Connections>;
  /** fetch data from the table: "oauth_clients" */
  oauth_clients: Array<Oauth_Clients>;
  /** fetch aggregated fields from the table: "oauth_clients" */
  oauth_clients_aggregate: Oauth_Clients_Aggregate;
  /** fetch data from the table: "oauth_clients" using primary key columns */
  oauth_clients_by_pk?: Maybe<Oauth_Clients>;
  /** fetch data from the table: "oauth_codes" */
  oauth_codes: Array<Oauth_Codes>;
  /** fetch aggregated fields from the table: "oauth_codes" */
  oauth_codes_aggregate: Oauth_Codes_Aggregate;
  /** fetch data from the table: "oauth_codes" using primary key columns */
  oauth_codes_by_pk?: Maybe<Oauth_Codes>;
  /** fetch data from the table: "plaid_accounts" using primary key columns */
  plaidAccount?: Maybe<PlaidAccounts>;
  /** fetch data from the table: "plaid_accounts" */
  plaidAccounts: Array<PlaidAccounts>;
  /** fetch aggregated fields from the table: "plaid_accounts" */
  plaidAccounts_aggregate: PlaidAccounts_Aggregate;
  /** fetch data from the table: "plaid_items" using primary key columns */
  plaidItem?: Maybe<Plaid_Items>;
  /** fetch data from the table: "plaid_items" */
  plaidItems: Array<Plaid_Items>;
  /** fetch data from the table: "plaid_institutions" */
  plaid_institutions: Array<Plaid_Institutions>;
  /** fetch aggregated fields from the table: "plaid_institutions" */
  plaid_institutions_aggregate: Plaid_Institutions_Aggregate;
  /** fetch data from the table: "plaid_institutions" using primary key columns */
  plaid_institutions_by_pk?: Maybe<Plaid_Institutions>;
  /** An array relationship */
  plaid_item_sync_logs: Array<Plaid_Item_Sync_Logs>;
  /** An aggregate relationship */
  plaid_item_sync_logs_aggregate: Plaid_Item_Sync_Logs_Aggregate;
  /** fetch data from the table: "plaid_item_sync_logs" using primary key columns */
  plaid_item_sync_logs_by_pk?: Maybe<Plaid_Item_Sync_Logs>;
  /** An aggregate relationship */
  plaid_items_aggregate: Plaid_Items_Aggregate;
  remoteSchemaUserProfile: RemoteSchemaUserProfile;
  /** fetch data from the table: "removed_plaid_transactions" */
  removed_plaid_transactions: Array<Removed_Plaid_Transactions>;
  /** fetch aggregated fields from the table: "removed_plaid_transactions" */
  removed_plaid_transactions_aggregate: Removed_Plaid_Transactions_Aggregate;
  /** fetch data from the table: "removed_plaid_transactions" using primary key columns */
  removed_plaid_transactions_by_pk?: Maybe<Removed_Plaid_Transactions>;
  stripePrices: Array<StripePrice>;
  /** fetch data from the table: "stripe_webhook_events" using primary key columns */
  stripeWebhookEvent?: Maybe<StripeWebhookEvents>;
  /** fetch data from the table: "stripe_webhook_events" */
  stripeWebhookEvents: Array<StripeWebhookEvents>;
  /** fetch aggregated fields from the table: "stripe_webhook_events" */
  stripeWebhookEvents_aggregate: StripeWebhookEvents_Aggregate;
  /** fetch data from the table: "sync_logs" */
  sync_logs: Array<Sync_Logs>;
  /** fetch aggregated fields from the table: "sync_logs" */
  sync_logs_aggregate: Sync_Logs_Aggregate;
  /** fetch data from the table: "sync_logs" using primary key columns */
  sync_logs_by_pk?: Maybe<Sync_Logs>;
  /** fetch data from the table: "auth.users" using primary key columns */
  user?: Maybe<Users>;
  /** fetch data from the table: "user_profiles" using primary key columns */
  userProfile?: Maybe<UserProfiles>;
  /** fetch data from the table: "user_profiles" */
  userProfiles: Array<UserProfiles>;
  /** fetch aggregated fields from the table: "user_profiles" */
  userProfiles_aggregate: UserProfiles_Aggregate;
  /** fetch data from the table: "auth.users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "auth.users" */
  usersAggregate: Users_Aggregate;
};


export type Query_RootAirtable_ConfigsArgs = {
  distinct_on?: InputMaybe<Array<Airtable_Configs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Airtable_Configs_Order_By>>;
  where?: InputMaybe<Airtable_Configs_Bool_Exp>;
};


export type Query_RootAirtable_Configs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Airtable_Configs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Airtable_Configs_Order_By>>;
  where?: InputMaybe<Airtable_Configs_Bool_Exp>;
};


export type Query_RootAirtable_Configs_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootAuthProviderArgs = {
  id: Scalars['String'];
};


export type Query_RootAuthProviderRequestArgs = {
  id: Scalars['uuid'];
};


export type Query_RootAuthProviderRequestsArgs = {
  distinct_on?: InputMaybe<Array<AuthProviderRequests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthProviderRequests_Order_By>>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};


export type Query_RootAuthProviderRequestsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthProviderRequests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthProviderRequests_Order_By>>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};


export type Query_RootAuthProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthProviders_Order_By>>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};


export type Query_RootAuthProvidersAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthProviders_Order_By>>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};


export type Query_RootAuthRefreshTokenArgs = {
  refreshToken: Scalars['uuid'];
};


export type Query_RootAuthRefreshTokensArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


export type Query_RootAuthRefreshTokensAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


export type Query_RootAuthRoleArgs = {
  role: Scalars['String'];
};


export type Query_RootAuthRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRoles_Order_By>>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};


export type Query_RootAuthRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRoles_Order_By>>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};


export type Query_RootAuthUserProviderArgs = {
  id: Scalars['uuid'];
};


export type Query_RootAuthUserProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


export type Query_RootAuthUserProvidersAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


export type Query_RootAuthUserRoleArgs = {
  id: Scalars['uuid'];
};


export type Query_RootAuthUserRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


export type Query_RootAuthUserRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


export type Query_RootAuthUserSecurityKeyArgs = {
  id: Scalars['uuid'];
};


export type Query_RootAuthUserSecurityKeysArgs = {
  distinct_on?: InputMaybe<Array<AuthUserSecurityKeys_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserSecurityKeys_Order_By>>;
  where?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
};


export type Query_RootAuthUserSecurityKeysAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserSecurityKeys_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserSecurityKeys_Order_By>>;
  where?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
};


export type Query_RootBillingPortalSessionArgs = {
  customerId: Scalars['String'];
  returnUrl: Scalars['String'];
};


export type Query_RootBucketArgs = {
  id: Scalars['String'];
};


export type Query_RootBucketsArgs = {
  distinct_on?: InputMaybe<Array<Buckets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Buckets_Order_By>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};


export type Query_RootBucketsAggregateArgs = {
  distinct_on?: InputMaybe<Array<Buckets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Buckets_Order_By>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};


export type Query_RootCheckoutPortalSessionArgs = {
  cancelUrl: Scalars['String'];
  customerId: Scalars['String'];
  priceId: Scalars['String'];
  successUrl: Scalars['String'];
  trialEnd?: InputMaybe<Scalars['Int']>;
  trialPeriodDays?: InputMaybe<Scalars['Int']>;
};


export type Query_RootCoda_ConfigsArgs = {
  distinct_on?: InputMaybe<Array<Coda_Configs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Coda_Configs_Order_By>>;
  where?: InputMaybe<Coda_Configs_Bool_Exp>;
};


export type Query_RootCoda_Configs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Coda_Configs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Coda_Configs_Order_By>>;
  where?: InputMaybe<Coda_Configs_Bool_Exp>;
};


export type Query_RootCoda_Configs_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootDestination_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Destination_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destination_Accounts_Order_By>>;
  where?: InputMaybe<Destination_Accounts_Bool_Exp>;
};


export type Query_RootDestination_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Destination_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destination_Accounts_Order_By>>;
  where?: InputMaybe<Destination_Accounts_Bool_Exp>;
};


export type Query_RootDestination_Accounts_By_PkArgs = {
  account_id: Scalars['String'];
  destination_id: Scalars['uuid'];
};


export type Query_RootDestination_Sync_LogsArgs = {
  distinct_on?: InputMaybe<Array<Destination_Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destination_Sync_Logs_Order_By>>;
  where?: InputMaybe<Destination_Sync_Logs_Bool_Exp>;
};


export type Query_RootDestination_Sync_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Destination_Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destination_Sync_Logs_Order_By>>;
  where?: InputMaybe<Destination_Sync_Logs_Bool_Exp>;
};


export type Query_RootDestination_Sync_Logs_By_PkArgs = {
  destination_id: Scalars['uuid'];
  sync_log_id: Scalars['uuid'];
};


export type Query_RootDestinationsArgs = {
  distinct_on?: InputMaybe<Array<Destinations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destinations_Order_By>>;
  where?: InputMaybe<Destinations_Bool_Exp>;
};


export type Query_RootDestinations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Destinations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destinations_Order_By>>;
  where?: InputMaybe<Destinations_Bool_Exp>;
};


export type Query_RootDestinations_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootFileArgs = {
  id: Scalars['uuid'];
};


export type Query_RootFilesArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};


export type Query_RootFilesAggregateArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};


export type Query_RootFrequenciesArgs = {
  distinct_on?: InputMaybe<Array<Frequencies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Frequencies_Order_By>>;
  where?: InputMaybe<Frequencies_Bool_Exp>;
};


export type Query_RootFrequencies_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Frequencies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Frequencies_Order_By>>;
  where?: InputMaybe<Frequencies_Bool_Exp>;
};


export type Query_RootFrequencies_By_PkArgs = {
  id: Scalars['String'];
};


export type Query_RootIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<Integrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Integrations_Order_By>>;
  where?: InputMaybe<Integrations_Bool_Exp>;
};


export type Query_RootIntegrations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Integrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Integrations_Order_By>>;
  where?: InputMaybe<Integrations_Bool_Exp>;
};


export type Query_RootIntegrations_By_PkArgs = {
  id: Scalars['String'];
};


export type Query_RootNotion_ConnectionsArgs = {
  distinct_on?: InputMaybe<Array<Notion_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Notion_Connections_Order_By>>;
  where?: InputMaybe<Notion_Connections_Bool_Exp>;
};


export type Query_RootNotion_Connections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notion_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Notion_Connections_Order_By>>;
  where?: InputMaybe<Notion_Connections_Bool_Exp>;
};


export type Query_RootNotion_Connections_By_PkArgs = {
  bot_id: Scalars['String'];
  user_id: Scalars['uuid'];
};


export type Query_RootOauth_ClientsArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Clients_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Oauth_Clients_Order_By>>;
  where?: InputMaybe<Oauth_Clients_Bool_Exp>;
};


export type Query_RootOauth_Clients_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Clients_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Oauth_Clients_Order_By>>;
  where?: InputMaybe<Oauth_Clients_Bool_Exp>;
};


export type Query_RootOauth_Clients_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootOauth_CodesArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Codes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Oauth_Codes_Order_By>>;
  where?: InputMaybe<Oauth_Codes_Bool_Exp>;
};


export type Query_RootOauth_Codes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Codes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Oauth_Codes_Order_By>>;
  where?: InputMaybe<Oauth_Codes_Bool_Exp>;
};


export type Query_RootOauth_Codes_By_PkArgs = {
  code: Scalars['uuid'];
};


export type Query_RootPlaidAccountArgs = {
  id: Scalars['String'];
};


export type Query_RootPlaidAccountsArgs = {
  distinct_on?: InputMaybe<Array<PlaidAccounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<PlaidAccounts_Order_By>>;
  where?: InputMaybe<PlaidAccounts_Bool_Exp>;
};


export type Query_RootPlaidAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<PlaidAccounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<PlaidAccounts_Order_By>>;
  where?: InputMaybe<PlaidAccounts_Bool_Exp>;
};


export type Query_RootPlaidItemArgs = {
  id: Scalars['String'];
};


export type Query_RootPlaidItemsArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Items_Order_By>>;
  where?: InputMaybe<Plaid_Items_Bool_Exp>;
};


export type Query_RootPlaid_InstitutionsArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Institutions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Institutions_Order_By>>;
  where?: InputMaybe<Plaid_Institutions_Bool_Exp>;
};


export type Query_RootPlaid_Institutions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Institutions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Institutions_Order_By>>;
  where?: InputMaybe<Plaid_Institutions_Bool_Exp>;
};


export type Query_RootPlaid_Institutions_By_PkArgs = {
  id: Scalars['String'];
};


export type Query_RootPlaid_Item_Sync_LogsArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Item_Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Item_Sync_Logs_Order_By>>;
  where?: InputMaybe<Plaid_Item_Sync_Logs_Bool_Exp>;
};


export type Query_RootPlaid_Item_Sync_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Item_Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Item_Sync_Logs_Order_By>>;
  where?: InputMaybe<Plaid_Item_Sync_Logs_Bool_Exp>;
};


export type Query_RootPlaid_Item_Sync_Logs_By_PkArgs = {
  plaid_item_id: Scalars['String'];
  sync_log_id: Scalars['uuid'];
};


export type Query_RootPlaid_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Items_Order_By>>;
  where?: InputMaybe<Plaid_Items_Bool_Exp>;
};


export type Query_RootRemoteSchemaUserProfileArgs = {
  userId: Scalars['uuid'];
};


export type Query_RootRemoved_Plaid_TransactionsArgs = {
  distinct_on?: InputMaybe<Array<Removed_Plaid_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Removed_Plaid_Transactions_Order_By>>;
  where?: InputMaybe<Removed_Plaid_Transactions_Bool_Exp>;
};


export type Query_RootRemoved_Plaid_Transactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Removed_Plaid_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Removed_Plaid_Transactions_Order_By>>;
  where?: InputMaybe<Removed_Plaid_Transactions_Bool_Exp>;
};


export type Query_RootRemoved_Plaid_Transactions_By_PkArgs = {
  transaction_id: Scalars['String'];
};


export type Query_RootStripeWebhookEventArgs = {
  id: Scalars['String'];
};


export type Query_RootStripeWebhookEventsArgs = {
  distinct_on?: InputMaybe<Array<StripeWebhookEvents_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<StripeWebhookEvents_Order_By>>;
  where?: InputMaybe<StripeWebhookEvents_Bool_Exp>;
};


export type Query_RootStripeWebhookEvents_AggregateArgs = {
  distinct_on?: InputMaybe<Array<StripeWebhookEvents_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<StripeWebhookEvents_Order_By>>;
  where?: InputMaybe<StripeWebhookEvents_Bool_Exp>;
};


export type Query_RootSync_LogsArgs = {
  distinct_on?: InputMaybe<Array<Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Logs_Order_By>>;
  where?: InputMaybe<Sync_Logs_Bool_Exp>;
};


export type Query_RootSync_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Logs_Order_By>>;
  where?: InputMaybe<Sync_Logs_Bool_Exp>;
};


export type Query_RootSync_Logs_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUserArgs = {
  id: Scalars['uuid'];
};


export type Query_RootUserProfileArgs = {
  userId: Scalars['uuid'];
};


export type Query_RootUserProfilesArgs = {
  distinct_on?: InputMaybe<Array<UserProfiles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<UserProfiles_Order_By>>;
  where?: InputMaybe<UserProfiles_Bool_Exp>;
};


export type Query_RootUserProfiles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<UserProfiles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<UserProfiles_Order_By>>;
  where?: InputMaybe<UserProfiles_Bool_Exp>;
};


export type Query_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Query_RootUsersAggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** columns and relationships of "removed_plaid_transactions" */
export type Removed_Plaid_Transactions = {
  __typename?: 'removed_plaid_transactions';
  created_at: Scalars['timestamptz'];
  /** An object relationship */
  item: Plaid_Items;
  plaid_item_id: Scalars['String'];
  transaction_id: Scalars['String'];
};

/** aggregated selection of "removed_plaid_transactions" */
export type Removed_Plaid_Transactions_Aggregate = {
  __typename?: 'removed_plaid_transactions_aggregate';
  aggregate?: Maybe<Removed_Plaid_Transactions_Aggregate_Fields>;
  nodes: Array<Removed_Plaid_Transactions>;
};

export type Removed_Plaid_Transactions_Aggregate_Bool_Exp = {
  count?: InputMaybe<Removed_Plaid_Transactions_Aggregate_Bool_Exp_Count>;
};

export type Removed_Plaid_Transactions_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Removed_Plaid_Transactions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Removed_Plaid_Transactions_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "removed_plaid_transactions" */
export type Removed_Plaid_Transactions_Aggregate_Fields = {
  __typename?: 'removed_plaid_transactions_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Removed_Plaid_Transactions_Max_Fields>;
  min?: Maybe<Removed_Plaid_Transactions_Min_Fields>;
};


/** aggregate fields of "removed_plaid_transactions" */
export type Removed_Plaid_Transactions_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Removed_Plaid_Transactions_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "removed_plaid_transactions" */
export type Removed_Plaid_Transactions_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Removed_Plaid_Transactions_Max_Order_By>;
  min?: InputMaybe<Removed_Plaid_Transactions_Min_Order_By>;
};

/** input type for inserting array relation for remote table "removed_plaid_transactions" */
export type Removed_Plaid_Transactions_Arr_Rel_Insert_Input = {
  data: Array<Removed_Plaid_Transactions_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Removed_Plaid_Transactions_On_Conflict>;
};

/** Boolean expression to filter rows from the table "removed_plaid_transactions". All fields are combined with a logical 'AND'. */
export type Removed_Plaid_Transactions_Bool_Exp = {
  _and?: InputMaybe<Array<Removed_Plaid_Transactions_Bool_Exp>>;
  _not?: InputMaybe<Removed_Plaid_Transactions_Bool_Exp>;
  _or?: InputMaybe<Array<Removed_Plaid_Transactions_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  item?: InputMaybe<Plaid_Items_Bool_Exp>;
  plaid_item_id?: InputMaybe<String_Comparison_Exp>;
  transaction_id?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "removed_plaid_transactions" */
export enum Removed_Plaid_Transactions_Constraint {
  /** unique or primary key constraint on columns "transaction_id" */
  RemovedPlaidTransactionsPkey = 'removed_plaid_transactions_pkey'
}

/** input type for inserting data into table "removed_plaid_transactions" */
export type Removed_Plaid_Transactions_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  item?: InputMaybe<Plaid_Items_Obj_Rel_Insert_Input>;
  plaid_item_id?: InputMaybe<Scalars['String']>;
  transaction_id?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Removed_Plaid_Transactions_Max_Fields = {
  __typename?: 'removed_plaid_transactions_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  plaid_item_id?: Maybe<Scalars['String']>;
  transaction_id?: Maybe<Scalars['String']>;
};

/** order by max() on columns of table "removed_plaid_transactions" */
export type Removed_Plaid_Transactions_Max_Order_By = {
  created_at?: InputMaybe<Order_By>;
  plaid_item_id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Removed_Plaid_Transactions_Min_Fields = {
  __typename?: 'removed_plaid_transactions_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  plaid_item_id?: Maybe<Scalars['String']>;
  transaction_id?: Maybe<Scalars['String']>;
};

/** order by min() on columns of table "removed_plaid_transactions" */
export type Removed_Plaid_Transactions_Min_Order_By = {
  created_at?: InputMaybe<Order_By>;
  plaid_item_id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "removed_plaid_transactions" */
export type Removed_Plaid_Transactions_Mutation_Response = {
  __typename?: 'removed_plaid_transactions_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Removed_Plaid_Transactions>;
};

/** on_conflict condition type for table "removed_plaid_transactions" */
export type Removed_Plaid_Transactions_On_Conflict = {
  constraint: Removed_Plaid_Transactions_Constraint;
  update_columns?: Array<Removed_Plaid_Transactions_Update_Column>;
  where?: InputMaybe<Removed_Plaid_Transactions_Bool_Exp>;
};

/** Ordering options when selecting data from "removed_plaid_transactions". */
export type Removed_Plaid_Transactions_Order_By = {
  created_at?: InputMaybe<Order_By>;
  item?: InputMaybe<Plaid_Items_Order_By>;
  plaid_item_id?: InputMaybe<Order_By>;
  transaction_id?: InputMaybe<Order_By>;
};

/** primary key columns input for table: removed_plaid_transactions */
export type Removed_Plaid_Transactions_Pk_Columns_Input = {
  transaction_id: Scalars['String'];
};

/** select columns of table "removed_plaid_transactions" */
export enum Removed_Plaid_Transactions_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  PlaidItemId = 'plaid_item_id',
  /** column name */
  TransactionId = 'transaction_id'
}

/** input type for updating data in table "removed_plaid_transactions" */
export type Removed_Plaid_Transactions_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  plaid_item_id?: InputMaybe<Scalars['String']>;
  transaction_id?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "removed_plaid_transactions" */
export type Removed_Plaid_Transactions_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Removed_Plaid_Transactions_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Removed_Plaid_Transactions_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  plaid_item_id?: InputMaybe<Scalars['String']>;
  transaction_id?: InputMaybe<Scalars['String']>;
};

/** update columns of table "removed_plaid_transactions" */
export enum Removed_Plaid_Transactions_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  PlaidItemId = 'plaid_item_id',
  /** column name */
  TransactionId = 'transaction_id'
}

export type Removed_Plaid_Transactions_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Removed_Plaid_Transactions_Set_Input>;
  where: Removed_Plaid_Transactions_Bool_Exp;
};

/** columns and relationships of "stripe_webhook_events" */
export type StripeWebhookEvents = {
  __typename?: 'stripeWebhookEvents';
  createdAt: Scalars['timestamptz'];
  event: Scalars['String'];
  id: Scalars['String'];
  /** Either 'processed' or 'failed' */
  state: Scalars['String'];
};

/** aggregated selection of "stripe_webhook_events" */
export type StripeWebhookEvents_Aggregate = {
  __typename?: 'stripeWebhookEvents_aggregate';
  aggregate?: Maybe<StripeWebhookEvents_Aggregate_Fields>;
  nodes: Array<StripeWebhookEvents>;
};

/** aggregate fields of "stripe_webhook_events" */
export type StripeWebhookEvents_Aggregate_Fields = {
  __typename?: 'stripeWebhookEvents_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<StripeWebhookEvents_Max_Fields>;
  min?: Maybe<StripeWebhookEvents_Min_Fields>;
};


/** aggregate fields of "stripe_webhook_events" */
export type StripeWebhookEvents_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<StripeWebhookEvents_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "stripe_webhook_events". All fields are combined with a logical 'AND'. */
export type StripeWebhookEvents_Bool_Exp = {
  _and?: InputMaybe<Array<StripeWebhookEvents_Bool_Exp>>;
  _not?: InputMaybe<StripeWebhookEvents_Bool_Exp>;
  _or?: InputMaybe<Array<StripeWebhookEvents_Bool_Exp>>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  event?: InputMaybe<String_Comparison_Exp>;
  id?: InputMaybe<String_Comparison_Exp>;
  state?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "stripe_webhook_events" */
export enum StripeWebhookEvents_Constraint {
  /** unique or primary key constraint on columns "id" */
  StripeWebhookEventsPkey = 'stripe_webhook_events_pkey'
}

/** input type for inserting data into table "stripe_webhook_events" */
export type StripeWebhookEvents_Insert_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  event?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  /** Either 'processed' or 'failed' */
  state?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type StripeWebhookEvents_Max_Fields = {
  __typename?: 'stripeWebhookEvents_max_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  event?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  /** Either 'processed' or 'failed' */
  state?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type StripeWebhookEvents_Min_Fields = {
  __typename?: 'stripeWebhookEvents_min_fields';
  createdAt?: Maybe<Scalars['timestamptz']>;
  event?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  /** Either 'processed' or 'failed' */
  state?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "stripe_webhook_events" */
export type StripeWebhookEvents_Mutation_Response = {
  __typename?: 'stripeWebhookEvents_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<StripeWebhookEvents>;
};

/** on_conflict condition type for table "stripe_webhook_events" */
export type StripeWebhookEvents_On_Conflict = {
  constraint: StripeWebhookEvents_Constraint;
  update_columns?: Array<StripeWebhookEvents_Update_Column>;
  where?: InputMaybe<StripeWebhookEvents_Bool_Exp>;
};

/** Ordering options when selecting data from "stripe_webhook_events". */
export type StripeWebhookEvents_Order_By = {
  createdAt?: InputMaybe<Order_By>;
  event?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  state?: InputMaybe<Order_By>;
};

/** primary key columns input for table: stripe_webhook_events */
export type StripeWebhookEvents_Pk_Columns_Input = {
  id: Scalars['String'];
};

/** select columns of table "stripe_webhook_events" */
export enum StripeWebhookEvents_Select_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Event = 'event',
  /** column name */
  Id = 'id',
  /** column name */
  State = 'state'
}

/** input type for updating data in table "stripe_webhook_events" */
export type StripeWebhookEvents_Set_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  event?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  /** Either 'processed' or 'failed' */
  state?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "stripeWebhookEvents" */
export type StripeWebhookEvents_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: StripeWebhookEvents_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type StripeWebhookEvents_Stream_Cursor_Value_Input = {
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  event?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  /** Either 'processed' or 'failed' */
  state?: InputMaybe<Scalars['String']>;
};

/** update columns of table "stripe_webhook_events" */
export enum StripeWebhookEvents_Update_Column {
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  Event = 'event',
  /** column name */
  Id = 'id',
  /** column name */
  State = 'state'
}

export type StripeWebhookEvents_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<StripeWebhookEvents_Set_Input>;
  where: StripeWebhookEvents_Bool_Exp;
};

export type Subscription_Root = {
  __typename?: 'subscription_root';
  /** fetch data from the table: "airtable_configs" */
  airtable_configs: Array<Airtable_Configs>;
  /** fetch aggregated fields from the table: "airtable_configs" */
  airtable_configs_aggregate: Airtable_Configs_Aggregate;
  /** fetch data from the table: "airtable_configs" using primary key columns */
  airtable_configs_by_pk?: Maybe<Airtable_Configs>;
  /** fetch data from the table in a streaming manner: "airtable_configs" */
  airtable_configs_stream: Array<Airtable_Configs>;
  /** fetch data from the table: "auth.providers" using primary key columns */
  authProvider?: Maybe<AuthProviders>;
  /** fetch data from the table: "auth.provider_requests" using primary key columns */
  authProviderRequest?: Maybe<AuthProviderRequests>;
  /** fetch data from the table: "auth.provider_requests" */
  authProviderRequests: Array<AuthProviderRequests>;
  /** fetch aggregated fields from the table: "auth.provider_requests" */
  authProviderRequestsAggregate: AuthProviderRequests_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.provider_requests" */
  authProviderRequests_stream: Array<AuthProviderRequests>;
  /** fetch data from the table: "auth.providers" */
  authProviders: Array<AuthProviders>;
  /** fetch aggregated fields from the table: "auth.providers" */
  authProvidersAggregate: AuthProviders_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.providers" */
  authProviders_stream: Array<AuthProviders>;
  /** fetch data from the table: "auth.refresh_tokens" using primary key columns */
  authRefreshToken?: Maybe<AuthRefreshTokens>;
  /** fetch data from the table: "auth.refresh_tokens" */
  authRefreshTokens: Array<AuthRefreshTokens>;
  /** fetch aggregated fields from the table: "auth.refresh_tokens" */
  authRefreshTokensAggregate: AuthRefreshTokens_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.refresh_tokens" */
  authRefreshTokens_stream: Array<AuthRefreshTokens>;
  /** fetch data from the table: "auth.roles" using primary key columns */
  authRole?: Maybe<AuthRoles>;
  /** fetch data from the table: "auth.roles" */
  authRoles: Array<AuthRoles>;
  /** fetch aggregated fields from the table: "auth.roles" */
  authRolesAggregate: AuthRoles_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.roles" */
  authRoles_stream: Array<AuthRoles>;
  /** fetch data from the table: "auth.user_providers" using primary key columns */
  authUserProvider?: Maybe<AuthUserProviders>;
  /** fetch data from the table: "auth.user_providers" */
  authUserProviders: Array<AuthUserProviders>;
  /** fetch aggregated fields from the table: "auth.user_providers" */
  authUserProvidersAggregate: AuthUserProviders_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.user_providers" */
  authUserProviders_stream: Array<AuthUserProviders>;
  /** fetch data from the table: "auth.user_roles" using primary key columns */
  authUserRole?: Maybe<AuthUserRoles>;
  /** fetch data from the table: "auth.user_roles" */
  authUserRoles: Array<AuthUserRoles>;
  /** fetch aggregated fields from the table: "auth.user_roles" */
  authUserRolesAggregate: AuthUserRoles_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.user_roles" */
  authUserRoles_stream: Array<AuthUserRoles>;
  /** fetch data from the table: "auth.user_security_keys" using primary key columns */
  authUserSecurityKey?: Maybe<AuthUserSecurityKeys>;
  /** fetch data from the table: "auth.user_security_keys" */
  authUserSecurityKeys: Array<AuthUserSecurityKeys>;
  /** fetch aggregated fields from the table: "auth.user_security_keys" */
  authUserSecurityKeysAggregate: AuthUserSecurityKeys_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.user_security_keys" */
  authUserSecurityKeys_stream: Array<AuthUserSecurityKeys>;
  /** fetch data from the table: "storage.buckets" using primary key columns */
  bucket?: Maybe<Buckets>;
  /** fetch data from the table: "storage.buckets" */
  buckets: Array<Buckets>;
  /** fetch aggregated fields from the table: "storage.buckets" */
  bucketsAggregate: Buckets_Aggregate;
  /** fetch data from the table in a streaming manner: "storage.buckets" */
  buckets_stream: Array<Buckets>;
  /** fetch data from the table: "coda_configs" */
  coda_configs: Array<Coda_Configs>;
  /** fetch aggregated fields from the table: "coda_configs" */
  coda_configs_aggregate: Coda_Configs_Aggregate;
  /** fetch data from the table: "coda_configs" using primary key columns */
  coda_configs_by_pk?: Maybe<Coda_Configs>;
  /** fetch data from the table in a streaming manner: "coda_configs" */
  coda_configs_stream: Array<Coda_Configs>;
  /** fetch data from the table: "destination_accounts" */
  destination_accounts: Array<Destination_Accounts>;
  /** fetch aggregated fields from the table: "destination_accounts" */
  destination_accounts_aggregate: Destination_Accounts_Aggregate;
  /** fetch data from the table: "destination_accounts" using primary key columns */
  destination_accounts_by_pk?: Maybe<Destination_Accounts>;
  /** fetch data from the table in a streaming manner: "destination_accounts" */
  destination_accounts_stream: Array<Destination_Accounts>;
  /** An array relationship */
  destination_sync_logs: Array<Destination_Sync_Logs>;
  /** An aggregate relationship */
  destination_sync_logs_aggregate: Destination_Sync_Logs_Aggregate;
  /** fetch data from the table: "destination_sync_logs" using primary key columns */
  destination_sync_logs_by_pk?: Maybe<Destination_Sync_Logs>;
  /** fetch data from the table in a streaming manner: "destination_sync_logs" */
  destination_sync_logs_stream: Array<Destination_Sync_Logs>;
  /** An array relationship */
  destinations: Array<Destinations>;
  /** An aggregate relationship */
  destinations_aggregate: Destinations_Aggregate;
  /** fetch data from the table: "destinations" using primary key columns */
  destinations_by_pk?: Maybe<Destinations>;
  /** fetch data from the table in a streaming manner: "destinations" */
  destinations_stream: Array<Destinations>;
  /** fetch data from the table: "storage.files" using primary key columns */
  file?: Maybe<Files>;
  /** An array relationship */
  files: Array<Files>;
  /** fetch aggregated fields from the table: "storage.files" */
  filesAggregate: Files_Aggregate;
  /** fetch data from the table in a streaming manner: "storage.files" */
  files_stream: Array<Files>;
  /** fetch data from the table: "frequencies" */
  frequencies: Array<Frequencies>;
  /** fetch aggregated fields from the table: "frequencies" */
  frequencies_aggregate: Frequencies_Aggregate;
  /** fetch data from the table: "frequencies" using primary key columns */
  frequencies_by_pk?: Maybe<Frequencies>;
  /** fetch data from the table in a streaming manner: "frequencies" */
  frequencies_stream: Array<Frequencies>;
  /** fetch data from the table: "integrations" */
  integrations: Array<Integrations>;
  /** fetch aggregated fields from the table: "integrations" */
  integrations_aggregate: Integrations_Aggregate;
  /** fetch data from the table: "integrations" using primary key columns */
  integrations_by_pk?: Maybe<Integrations>;
  /** fetch data from the table in a streaming manner: "integrations" */
  integrations_stream: Array<Integrations>;
  /** An array relationship */
  notion_connections: Array<Notion_Connections>;
  /** An aggregate relationship */
  notion_connections_aggregate: Notion_Connections_Aggregate;
  /** fetch data from the table: "notion_connections" using primary key columns */
  notion_connections_by_pk?: Maybe<Notion_Connections>;
  /** fetch data from the table in a streaming manner: "notion_connections" */
  notion_connections_stream: Array<Notion_Connections>;
  /** fetch data from the table: "oauth_clients" */
  oauth_clients: Array<Oauth_Clients>;
  /** fetch aggregated fields from the table: "oauth_clients" */
  oauth_clients_aggregate: Oauth_Clients_Aggregate;
  /** fetch data from the table: "oauth_clients" using primary key columns */
  oauth_clients_by_pk?: Maybe<Oauth_Clients>;
  /** fetch data from the table in a streaming manner: "oauth_clients" */
  oauth_clients_stream: Array<Oauth_Clients>;
  /** fetch data from the table: "oauth_codes" */
  oauth_codes: Array<Oauth_Codes>;
  /** fetch aggregated fields from the table: "oauth_codes" */
  oauth_codes_aggregate: Oauth_Codes_Aggregate;
  /** fetch data from the table: "oauth_codes" using primary key columns */
  oauth_codes_by_pk?: Maybe<Oauth_Codes>;
  /** fetch data from the table in a streaming manner: "oauth_codes" */
  oauth_codes_stream: Array<Oauth_Codes>;
  /** fetch data from the table: "plaid_accounts" using primary key columns */
  plaidAccount?: Maybe<PlaidAccounts>;
  /** fetch data from the table: "plaid_accounts" */
  plaidAccounts: Array<PlaidAccounts>;
  /** fetch aggregated fields from the table: "plaid_accounts" */
  plaidAccounts_aggregate: PlaidAccounts_Aggregate;
  /** fetch data from the table in a streaming manner: "plaid_accounts" */
  plaidAccounts_stream: Array<PlaidAccounts>;
  /** fetch data from the table: "plaid_items" using primary key columns */
  plaidItem?: Maybe<Plaid_Items>;
  /** fetch data from the table: "plaid_items" */
  plaidItems: Array<Plaid_Items>;
  /** fetch data from the table: "plaid_institutions" */
  plaid_institutions: Array<Plaid_Institutions>;
  /** fetch aggregated fields from the table: "plaid_institutions" */
  plaid_institutions_aggregate: Plaid_Institutions_Aggregate;
  /** fetch data from the table: "plaid_institutions" using primary key columns */
  plaid_institutions_by_pk?: Maybe<Plaid_Institutions>;
  /** fetch data from the table in a streaming manner: "plaid_institutions" */
  plaid_institutions_stream: Array<Plaid_Institutions>;
  /** An array relationship */
  plaid_item_sync_logs: Array<Plaid_Item_Sync_Logs>;
  /** An aggregate relationship */
  plaid_item_sync_logs_aggregate: Plaid_Item_Sync_Logs_Aggregate;
  /** fetch data from the table: "plaid_item_sync_logs" using primary key columns */
  plaid_item_sync_logs_by_pk?: Maybe<Plaid_Item_Sync_Logs>;
  /** fetch data from the table in a streaming manner: "plaid_item_sync_logs" */
  plaid_item_sync_logs_stream: Array<Plaid_Item_Sync_Logs>;
  /** An aggregate relationship */
  plaid_items_aggregate: Plaid_Items_Aggregate;
  /** fetch data from the table in a streaming manner: "plaid_items" */
  plaid_items_stream: Array<Plaid_Items>;
  /** fetch data from the table: "removed_plaid_transactions" */
  removed_plaid_transactions: Array<Removed_Plaid_Transactions>;
  /** fetch aggregated fields from the table: "removed_plaid_transactions" */
  removed_plaid_transactions_aggregate: Removed_Plaid_Transactions_Aggregate;
  /** fetch data from the table: "removed_plaid_transactions" using primary key columns */
  removed_plaid_transactions_by_pk?: Maybe<Removed_Plaid_Transactions>;
  /** fetch data from the table in a streaming manner: "removed_plaid_transactions" */
  removed_plaid_transactions_stream: Array<Removed_Plaid_Transactions>;
  /** fetch data from the table: "stripe_webhook_events" using primary key columns */
  stripeWebhookEvent?: Maybe<StripeWebhookEvents>;
  /** fetch data from the table: "stripe_webhook_events" */
  stripeWebhookEvents: Array<StripeWebhookEvents>;
  /** fetch aggregated fields from the table: "stripe_webhook_events" */
  stripeWebhookEvents_aggregate: StripeWebhookEvents_Aggregate;
  /** fetch data from the table in a streaming manner: "stripe_webhook_events" */
  stripeWebhookEvents_stream: Array<StripeWebhookEvents>;
  /** fetch data from the table: "sync_logs" */
  sync_logs: Array<Sync_Logs>;
  /** fetch aggregated fields from the table: "sync_logs" */
  sync_logs_aggregate: Sync_Logs_Aggregate;
  /** fetch data from the table: "sync_logs" using primary key columns */
  sync_logs_by_pk?: Maybe<Sync_Logs>;
  /** fetch data from the table in a streaming manner: "sync_logs" */
  sync_logs_stream: Array<Sync_Logs>;
  /** fetch data from the table: "auth.users" using primary key columns */
  user?: Maybe<Users>;
  /** fetch data from the table: "user_profiles" using primary key columns */
  userProfile?: Maybe<UserProfiles>;
  /** fetch data from the table: "user_profiles" */
  userProfiles: Array<UserProfiles>;
  /** fetch aggregated fields from the table: "user_profiles" */
  userProfiles_aggregate: UserProfiles_Aggregate;
  /** fetch data from the table in a streaming manner: "user_profiles" */
  userProfiles_stream: Array<UserProfiles>;
  /** fetch data from the table: "auth.users" */
  users: Array<Users>;
  /** fetch aggregated fields from the table: "auth.users" */
  usersAggregate: Users_Aggregate;
  /** fetch data from the table in a streaming manner: "auth.users" */
  users_stream: Array<Users>;
};


export type Subscription_RootAirtable_ConfigsArgs = {
  distinct_on?: InputMaybe<Array<Airtable_Configs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Airtable_Configs_Order_By>>;
  where?: InputMaybe<Airtable_Configs_Bool_Exp>;
};


export type Subscription_RootAirtable_Configs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Airtable_Configs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Airtable_Configs_Order_By>>;
  where?: InputMaybe<Airtable_Configs_Bool_Exp>;
};


export type Subscription_RootAirtable_Configs_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootAirtable_Configs_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Airtable_Configs_Stream_Cursor_Input>>;
  where?: InputMaybe<Airtable_Configs_Bool_Exp>;
};


export type Subscription_RootAuthProviderArgs = {
  id: Scalars['String'];
};


export type Subscription_RootAuthProviderRequestArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootAuthProviderRequestsArgs = {
  distinct_on?: InputMaybe<Array<AuthProviderRequests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthProviderRequests_Order_By>>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};


export type Subscription_RootAuthProviderRequestsAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthProviderRequests_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthProviderRequests_Order_By>>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};


export type Subscription_RootAuthProviderRequests_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<AuthProviderRequests_Stream_Cursor_Input>>;
  where?: InputMaybe<AuthProviderRequests_Bool_Exp>;
};


export type Subscription_RootAuthProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthProviders_Order_By>>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};


export type Subscription_RootAuthProvidersAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthProviders_Order_By>>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};


export type Subscription_RootAuthProviders_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<AuthProviders_Stream_Cursor_Input>>;
  where?: InputMaybe<AuthProviders_Bool_Exp>;
};


export type Subscription_RootAuthRefreshTokenArgs = {
  refreshToken: Scalars['uuid'];
};


export type Subscription_RootAuthRefreshTokensArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


export type Subscription_RootAuthRefreshTokensAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


export type Subscription_RootAuthRefreshTokens_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<AuthRefreshTokens_Stream_Cursor_Input>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


export type Subscription_RootAuthRoleArgs = {
  role: Scalars['String'];
};


export type Subscription_RootAuthRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRoles_Order_By>>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};


export type Subscription_RootAuthRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRoles_Order_By>>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};


export type Subscription_RootAuthRoles_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<AuthRoles_Stream_Cursor_Input>>;
  where?: InputMaybe<AuthRoles_Bool_Exp>;
};


export type Subscription_RootAuthUserProviderArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootAuthUserProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


export type Subscription_RootAuthUserProvidersAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


export type Subscription_RootAuthUserProviders_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<AuthUserProviders_Stream_Cursor_Input>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


export type Subscription_RootAuthUserRoleArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootAuthUserRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


export type Subscription_RootAuthUserRolesAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


export type Subscription_RootAuthUserRoles_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<AuthUserRoles_Stream_Cursor_Input>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


export type Subscription_RootAuthUserSecurityKeyArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootAuthUserSecurityKeysArgs = {
  distinct_on?: InputMaybe<Array<AuthUserSecurityKeys_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserSecurityKeys_Order_By>>;
  where?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
};


export type Subscription_RootAuthUserSecurityKeysAggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserSecurityKeys_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserSecurityKeys_Order_By>>;
  where?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
};


export type Subscription_RootAuthUserSecurityKeys_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<AuthUserSecurityKeys_Stream_Cursor_Input>>;
  where?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
};


export type Subscription_RootBucketArgs = {
  id: Scalars['String'];
};


export type Subscription_RootBucketsArgs = {
  distinct_on?: InputMaybe<Array<Buckets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Buckets_Order_By>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};


export type Subscription_RootBucketsAggregateArgs = {
  distinct_on?: InputMaybe<Array<Buckets_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Buckets_Order_By>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};


export type Subscription_RootBuckets_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Buckets_Stream_Cursor_Input>>;
  where?: InputMaybe<Buckets_Bool_Exp>;
};


export type Subscription_RootCoda_ConfigsArgs = {
  distinct_on?: InputMaybe<Array<Coda_Configs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Coda_Configs_Order_By>>;
  where?: InputMaybe<Coda_Configs_Bool_Exp>;
};


export type Subscription_RootCoda_Configs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Coda_Configs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Coda_Configs_Order_By>>;
  where?: InputMaybe<Coda_Configs_Bool_Exp>;
};


export type Subscription_RootCoda_Configs_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootCoda_Configs_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Coda_Configs_Stream_Cursor_Input>>;
  where?: InputMaybe<Coda_Configs_Bool_Exp>;
};


export type Subscription_RootDestination_AccountsArgs = {
  distinct_on?: InputMaybe<Array<Destination_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destination_Accounts_Order_By>>;
  where?: InputMaybe<Destination_Accounts_Bool_Exp>;
};


export type Subscription_RootDestination_Accounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Destination_Accounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destination_Accounts_Order_By>>;
  where?: InputMaybe<Destination_Accounts_Bool_Exp>;
};


export type Subscription_RootDestination_Accounts_By_PkArgs = {
  account_id: Scalars['String'];
  destination_id: Scalars['uuid'];
};


export type Subscription_RootDestination_Accounts_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Destination_Accounts_Stream_Cursor_Input>>;
  where?: InputMaybe<Destination_Accounts_Bool_Exp>;
};


export type Subscription_RootDestination_Sync_LogsArgs = {
  distinct_on?: InputMaybe<Array<Destination_Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destination_Sync_Logs_Order_By>>;
  where?: InputMaybe<Destination_Sync_Logs_Bool_Exp>;
};


export type Subscription_RootDestination_Sync_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Destination_Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destination_Sync_Logs_Order_By>>;
  where?: InputMaybe<Destination_Sync_Logs_Bool_Exp>;
};


export type Subscription_RootDestination_Sync_Logs_By_PkArgs = {
  destination_id: Scalars['uuid'];
  sync_log_id: Scalars['uuid'];
};


export type Subscription_RootDestination_Sync_Logs_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Destination_Sync_Logs_Stream_Cursor_Input>>;
  where?: InputMaybe<Destination_Sync_Logs_Bool_Exp>;
};


export type Subscription_RootDestinationsArgs = {
  distinct_on?: InputMaybe<Array<Destinations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destinations_Order_By>>;
  where?: InputMaybe<Destinations_Bool_Exp>;
};


export type Subscription_RootDestinations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Destinations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destinations_Order_By>>;
  where?: InputMaybe<Destinations_Bool_Exp>;
};


export type Subscription_RootDestinations_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootDestinations_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Destinations_Stream_Cursor_Input>>;
  where?: InputMaybe<Destinations_Bool_Exp>;
};


export type Subscription_RootFileArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootFilesArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};


export type Subscription_RootFilesAggregateArgs = {
  distinct_on?: InputMaybe<Array<Files_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Files_Order_By>>;
  where?: InputMaybe<Files_Bool_Exp>;
};


export type Subscription_RootFiles_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Files_Stream_Cursor_Input>>;
  where?: InputMaybe<Files_Bool_Exp>;
};


export type Subscription_RootFrequenciesArgs = {
  distinct_on?: InputMaybe<Array<Frequencies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Frequencies_Order_By>>;
  where?: InputMaybe<Frequencies_Bool_Exp>;
};


export type Subscription_RootFrequencies_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Frequencies_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Frequencies_Order_By>>;
  where?: InputMaybe<Frequencies_Bool_Exp>;
};


export type Subscription_RootFrequencies_By_PkArgs = {
  id: Scalars['String'];
};


export type Subscription_RootFrequencies_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Frequencies_Stream_Cursor_Input>>;
  where?: InputMaybe<Frequencies_Bool_Exp>;
};


export type Subscription_RootIntegrationsArgs = {
  distinct_on?: InputMaybe<Array<Integrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Integrations_Order_By>>;
  where?: InputMaybe<Integrations_Bool_Exp>;
};


export type Subscription_RootIntegrations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Integrations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Integrations_Order_By>>;
  where?: InputMaybe<Integrations_Bool_Exp>;
};


export type Subscription_RootIntegrations_By_PkArgs = {
  id: Scalars['String'];
};


export type Subscription_RootIntegrations_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Integrations_Stream_Cursor_Input>>;
  where?: InputMaybe<Integrations_Bool_Exp>;
};


export type Subscription_RootNotion_ConnectionsArgs = {
  distinct_on?: InputMaybe<Array<Notion_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Notion_Connections_Order_By>>;
  where?: InputMaybe<Notion_Connections_Bool_Exp>;
};


export type Subscription_RootNotion_Connections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notion_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Notion_Connections_Order_By>>;
  where?: InputMaybe<Notion_Connections_Bool_Exp>;
};


export type Subscription_RootNotion_Connections_By_PkArgs = {
  bot_id: Scalars['String'];
  user_id: Scalars['uuid'];
};


export type Subscription_RootNotion_Connections_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Notion_Connections_Stream_Cursor_Input>>;
  where?: InputMaybe<Notion_Connections_Bool_Exp>;
};


export type Subscription_RootOauth_ClientsArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Clients_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Oauth_Clients_Order_By>>;
  where?: InputMaybe<Oauth_Clients_Bool_Exp>;
};


export type Subscription_RootOauth_Clients_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Clients_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Oauth_Clients_Order_By>>;
  where?: InputMaybe<Oauth_Clients_Bool_Exp>;
};


export type Subscription_RootOauth_Clients_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootOauth_Clients_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Oauth_Clients_Stream_Cursor_Input>>;
  where?: InputMaybe<Oauth_Clients_Bool_Exp>;
};


export type Subscription_RootOauth_CodesArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Codes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Oauth_Codes_Order_By>>;
  where?: InputMaybe<Oauth_Codes_Bool_Exp>;
};


export type Subscription_RootOauth_Codes_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Oauth_Codes_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Oauth_Codes_Order_By>>;
  where?: InputMaybe<Oauth_Codes_Bool_Exp>;
};


export type Subscription_RootOauth_Codes_By_PkArgs = {
  code: Scalars['uuid'];
};


export type Subscription_RootOauth_Codes_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Oauth_Codes_Stream_Cursor_Input>>;
  where?: InputMaybe<Oauth_Codes_Bool_Exp>;
};


export type Subscription_RootPlaidAccountArgs = {
  id: Scalars['String'];
};


export type Subscription_RootPlaidAccountsArgs = {
  distinct_on?: InputMaybe<Array<PlaidAccounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<PlaidAccounts_Order_By>>;
  where?: InputMaybe<PlaidAccounts_Bool_Exp>;
};


export type Subscription_RootPlaidAccounts_AggregateArgs = {
  distinct_on?: InputMaybe<Array<PlaidAccounts_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<PlaidAccounts_Order_By>>;
  where?: InputMaybe<PlaidAccounts_Bool_Exp>;
};


export type Subscription_RootPlaidAccounts_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<PlaidAccounts_Stream_Cursor_Input>>;
  where?: InputMaybe<PlaidAccounts_Bool_Exp>;
};


export type Subscription_RootPlaidItemArgs = {
  id: Scalars['String'];
};


export type Subscription_RootPlaidItemsArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Items_Order_By>>;
  where?: InputMaybe<Plaid_Items_Bool_Exp>;
};


export type Subscription_RootPlaid_InstitutionsArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Institutions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Institutions_Order_By>>;
  where?: InputMaybe<Plaid_Institutions_Bool_Exp>;
};


export type Subscription_RootPlaid_Institutions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Institutions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Institutions_Order_By>>;
  where?: InputMaybe<Plaid_Institutions_Bool_Exp>;
};


export type Subscription_RootPlaid_Institutions_By_PkArgs = {
  id: Scalars['String'];
};


export type Subscription_RootPlaid_Institutions_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Plaid_Institutions_Stream_Cursor_Input>>;
  where?: InputMaybe<Plaid_Institutions_Bool_Exp>;
};


export type Subscription_RootPlaid_Item_Sync_LogsArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Item_Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Item_Sync_Logs_Order_By>>;
  where?: InputMaybe<Plaid_Item_Sync_Logs_Bool_Exp>;
};


export type Subscription_RootPlaid_Item_Sync_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Item_Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Item_Sync_Logs_Order_By>>;
  where?: InputMaybe<Plaid_Item_Sync_Logs_Bool_Exp>;
};


export type Subscription_RootPlaid_Item_Sync_Logs_By_PkArgs = {
  plaid_item_id: Scalars['String'];
  sync_log_id: Scalars['uuid'];
};


export type Subscription_RootPlaid_Item_Sync_Logs_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Plaid_Item_Sync_Logs_Stream_Cursor_Input>>;
  where?: InputMaybe<Plaid_Item_Sync_Logs_Bool_Exp>;
};


export type Subscription_RootPlaid_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Items_Order_By>>;
  where?: InputMaybe<Plaid_Items_Bool_Exp>;
};


export type Subscription_RootPlaid_Items_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Plaid_Items_Stream_Cursor_Input>>;
  where?: InputMaybe<Plaid_Items_Bool_Exp>;
};


export type Subscription_RootRemoved_Plaid_TransactionsArgs = {
  distinct_on?: InputMaybe<Array<Removed_Plaid_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Removed_Plaid_Transactions_Order_By>>;
  where?: InputMaybe<Removed_Plaid_Transactions_Bool_Exp>;
};


export type Subscription_RootRemoved_Plaid_Transactions_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Removed_Plaid_Transactions_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Removed_Plaid_Transactions_Order_By>>;
  where?: InputMaybe<Removed_Plaid_Transactions_Bool_Exp>;
};


export type Subscription_RootRemoved_Plaid_Transactions_By_PkArgs = {
  transaction_id: Scalars['String'];
};


export type Subscription_RootRemoved_Plaid_Transactions_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Removed_Plaid_Transactions_Stream_Cursor_Input>>;
  where?: InputMaybe<Removed_Plaid_Transactions_Bool_Exp>;
};


export type Subscription_RootStripeWebhookEventArgs = {
  id: Scalars['String'];
};


export type Subscription_RootStripeWebhookEventsArgs = {
  distinct_on?: InputMaybe<Array<StripeWebhookEvents_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<StripeWebhookEvents_Order_By>>;
  where?: InputMaybe<StripeWebhookEvents_Bool_Exp>;
};


export type Subscription_RootStripeWebhookEvents_AggregateArgs = {
  distinct_on?: InputMaybe<Array<StripeWebhookEvents_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<StripeWebhookEvents_Order_By>>;
  where?: InputMaybe<StripeWebhookEvents_Bool_Exp>;
};


export type Subscription_RootStripeWebhookEvents_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<StripeWebhookEvents_Stream_Cursor_Input>>;
  where?: InputMaybe<StripeWebhookEvents_Bool_Exp>;
};


export type Subscription_RootSync_LogsArgs = {
  distinct_on?: InputMaybe<Array<Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Logs_Order_By>>;
  where?: InputMaybe<Sync_Logs_Bool_Exp>;
};


export type Subscription_RootSync_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Sync_Logs_Order_By>>;
  where?: InputMaybe<Sync_Logs_Bool_Exp>;
};


export type Subscription_RootSync_Logs_By_PkArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootSync_Logs_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Sync_Logs_Stream_Cursor_Input>>;
  where?: InputMaybe<Sync_Logs_Bool_Exp>;
};


export type Subscription_RootUserArgs = {
  id: Scalars['uuid'];
};


export type Subscription_RootUserProfileArgs = {
  userId: Scalars['uuid'];
};


export type Subscription_RootUserProfilesArgs = {
  distinct_on?: InputMaybe<Array<UserProfiles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<UserProfiles_Order_By>>;
  where?: InputMaybe<UserProfiles_Bool_Exp>;
};


export type Subscription_RootUserProfiles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<UserProfiles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<UserProfiles_Order_By>>;
  where?: InputMaybe<UserProfiles_Bool_Exp>;
};


export type Subscription_RootUserProfiles_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<UserProfiles_Stream_Cursor_Input>>;
  where?: InputMaybe<UserProfiles_Bool_Exp>;
};


export type Subscription_RootUsersArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsersAggregateArgs = {
  distinct_on?: InputMaybe<Array<Users_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Users_Order_By>>;
  where?: InputMaybe<Users_Bool_Exp>;
};


export type Subscription_RootUsers_StreamArgs = {
  batch_size: Scalars['Int'];
  cursor: Array<InputMaybe<Users_Stream_Cursor_Input>>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** logs for all automatic and manual data syncs */
export type Sync_Logs = {
  __typename?: 'sync_logs';
  created_at: Scalars['timestamptz'];
  /** An array relationship */
  destination_sync_logs: Array<Destination_Sync_Logs>;
  /** An aggregate relationship */
  destination_sync_logs_aggregate: Destination_Sync_Logs_Aggregate;
  ended_at?: Maybe<Scalars['timestamptz']>;
  error?: Maybe<Scalars['jsonb']>;
  id: Scalars['uuid'];
  is_success: Scalars['Boolean'];
  metadata?: Maybe<Scalars['jsonb']>;
  /** An array relationship */
  plaid_item_sync_logs: Array<Plaid_Item_Sync_Logs>;
  /** An aggregate relationship */
  plaid_item_sync_logs_aggregate: Plaid_Item_Sync_Logs_Aggregate;
  trigger: Scalars['String'];
};


/** logs for all automatic and manual data syncs */
export type Sync_LogsDestination_Sync_LogsArgs = {
  distinct_on?: InputMaybe<Array<Destination_Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destination_Sync_Logs_Order_By>>;
  where?: InputMaybe<Destination_Sync_Logs_Bool_Exp>;
};


/** logs for all automatic and manual data syncs */
export type Sync_LogsDestination_Sync_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Destination_Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destination_Sync_Logs_Order_By>>;
  where?: InputMaybe<Destination_Sync_Logs_Bool_Exp>;
};


/** logs for all automatic and manual data syncs */
export type Sync_LogsErrorArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** logs for all automatic and manual data syncs */
export type Sync_LogsMetadataArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** logs for all automatic and manual data syncs */
export type Sync_LogsPlaid_Item_Sync_LogsArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Item_Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Item_Sync_Logs_Order_By>>;
  where?: InputMaybe<Plaid_Item_Sync_Logs_Bool_Exp>;
};


/** logs for all automatic and manual data syncs */
export type Sync_LogsPlaid_Item_Sync_Logs_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Item_Sync_Logs_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Item_Sync_Logs_Order_By>>;
  where?: InputMaybe<Plaid_Item_Sync_Logs_Bool_Exp>;
};

/** aggregated selection of "sync_logs" */
export type Sync_Logs_Aggregate = {
  __typename?: 'sync_logs_aggregate';
  aggregate?: Maybe<Sync_Logs_Aggregate_Fields>;
  nodes: Array<Sync_Logs>;
};

/** aggregate fields of "sync_logs" */
export type Sync_Logs_Aggregate_Fields = {
  __typename?: 'sync_logs_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Sync_Logs_Max_Fields>;
  min?: Maybe<Sync_Logs_Min_Fields>;
};


/** aggregate fields of "sync_logs" */
export type Sync_Logs_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Sync_Logs_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Sync_Logs_Append_Input = {
  error?: InputMaybe<Scalars['jsonb']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
};

/** Boolean expression to filter rows from the table "sync_logs". All fields are combined with a logical 'AND'. */
export type Sync_Logs_Bool_Exp = {
  _and?: InputMaybe<Array<Sync_Logs_Bool_Exp>>;
  _not?: InputMaybe<Sync_Logs_Bool_Exp>;
  _or?: InputMaybe<Array<Sync_Logs_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  destination_sync_logs?: InputMaybe<Destination_Sync_Logs_Bool_Exp>;
  destination_sync_logs_aggregate?: InputMaybe<Destination_Sync_Logs_Aggregate_Bool_Exp>;
  ended_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  error?: InputMaybe<Jsonb_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  is_success?: InputMaybe<Boolean_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  plaid_item_sync_logs?: InputMaybe<Plaid_Item_Sync_Logs_Bool_Exp>;
  plaid_item_sync_logs_aggregate?: InputMaybe<Plaid_Item_Sync_Logs_Aggregate_Bool_Exp>;
  trigger?: InputMaybe<String_Comparison_Exp>;
};

/** unique or primary key constraints on table "sync_logs" */
export enum Sync_Logs_Constraint {
  /** unique or primary key constraint on columns "id" */
  SyncLogsPkey = 'sync_logs_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Sync_Logs_Delete_At_Path_Input = {
  error?: InputMaybe<Array<Scalars['String']>>;
  metadata?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Sync_Logs_Delete_Elem_Input = {
  error?: InputMaybe<Scalars['Int']>;
  metadata?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Sync_Logs_Delete_Key_Input = {
  error?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "sync_logs" */
export type Sync_Logs_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  destination_sync_logs?: InputMaybe<Destination_Sync_Logs_Arr_Rel_Insert_Input>;
  ended_at?: InputMaybe<Scalars['timestamptz']>;
  error?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['uuid']>;
  is_success?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  plaid_item_sync_logs?: InputMaybe<Plaid_Item_Sync_Logs_Arr_Rel_Insert_Input>;
  trigger?: InputMaybe<Scalars['String']>;
};

/** aggregate max on columns */
export type Sync_Logs_Max_Fields = {
  __typename?: 'sync_logs_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  ended_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  trigger?: Maybe<Scalars['String']>;
};

/** aggregate min on columns */
export type Sync_Logs_Min_Fields = {
  __typename?: 'sync_logs_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  ended_at?: Maybe<Scalars['timestamptz']>;
  id?: Maybe<Scalars['uuid']>;
  trigger?: Maybe<Scalars['String']>;
};

/** response of any mutation on the table "sync_logs" */
export type Sync_Logs_Mutation_Response = {
  __typename?: 'sync_logs_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Sync_Logs>;
};

/** input type for inserting object relation for remote table "sync_logs" */
export type Sync_Logs_Obj_Rel_Insert_Input = {
  data: Sync_Logs_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Sync_Logs_On_Conflict>;
};

/** on_conflict condition type for table "sync_logs" */
export type Sync_Logs_On_Conflict = {
  constraint: Sync_Logs_Constraint;
  update_columns?: Array<Sync_Logs_Update_Column>;
  where?: InputMaybe<Sync_Logs_Bool_Exp>;
};

/** Ordering options when selecting data from "sync_logs". */
export type Sync_Logs_Order_By = {
  created_at?: InputMaybe<Order_By>;
  destination_sync_logs_aggregate?: InputMaybe<Destination_Sync_Logs_Aggregate_Order_By>;
  ended_at?: InputMaybe<Order_By>;
  error?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  is_success?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  plaid_item_sync_logs_aggregate?: InputMaybe<Plaid_Item_Sync_Logs_Aggregate_Order_By>;
  trigger?: InputMaybe<Order_By>;
};

/** primary key columns input for table: sync_logs */
export type Sync_Logs_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Sync_Logs_Prepend_Input = {
  error?: InputMaybe<Scalars['jsonb']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "sync_logs" */
export enum Sync_Logs_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EndedAt = 'ended_at',
  /** column name */
  Error = 'error',
  /** column name */
  Id = 'id',
  /** column name */
  IsSuccess = 'is_success',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  Trigger = 'trigger'
}

/** input type for updating data in table "sync_logs" */
export type Sync_Logs_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  ended_at?: InputMaybe<Scalars['timestamptz']>;
  error?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['uuid']>;
  is_success?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  trigger?: InputMaybe<Scalars['String']>;
};

/** Streaming cursor of the table "sync_logs" */
export type Sync_Logs_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Sync_Logs_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Sync_Logs_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  ended_at?: InputMaybe<Scalars['timestamptz']>;
  error?: InputMaybe<Scalars['jsonb']>;
  id?: InputMaybe<Scalars['uuid']>;
  is_success?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  trigger?: InputMaybe<Scalars['String']>;
};

/** update columns of table "sync_logs" */
export enum Sync_Logs_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  EndedAt = 'ended_at',
  /** column name */
  Error = 'error',
  /** column name */
  Id = 'id',
  /** column name */
  IsSuccess = 'is_success',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  Trigger = 'trigger'
}

export type Sync_Logs_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Sync_Logs_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Sync_Logs_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Sync_Logs_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Sync_Logs_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Sync_Logs_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Sync_Logs_Set_Input>;
  where: Sync_Logs_Bool_Exp;
};

/** Boolean expression to compare columns of type "timestamptz". All fields are combined with logical 'AND'. */
export type Timestamptz_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['timestamptz']>;
  _gt?: InputMaybe<Scalars['timestamptz']>;
  _gte?: InputMaybe<Scalars['timestamptz']>;
  _in?: InputMaybe<Array<Scalars['timestamptz']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['timestamptz']>;
  _lte?: InputMaybe<Scalars['timestamptz']>;
  _neq?: InputMaybe<Scalars['timestamptz']>;
  _nin?: InputMaybe<Array<Scalars['timestamptz']>>;
};

/** columns and relationships of "user_profiles" */
export type UserProfiles = {
  __typename?: 'userProfiles';
  created_at: Scalars['timestamptz'];
  isSubscribedGeneral: Scalars['Boolean'];
  isSubscribedSyncUpdates: Scalars['Boolean'];
  stripeCustomerId?: Maybe<Scalars['String']>;
  syncUpdatesFrequency?: Maybe<Frequencies_Enum>;
  syncUpdatesJobId?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  updated_at: Scalars['timestamptz'];
  /** An object relationship */
  user: Users;
  userId: Scalars['uuid'];
};

/** aggregated selection of "user_profiles" */
export type UserProfiles_Aggregate = {
  __typename?: 'userProfiles_aggregate';
  aggregate?: Maybe<UserProfiles_Aggregate_Fields>;
  nodes: Array<UserProfiles>;
};

/** aggregate fields of "user_profiles" */
export type UserProfiles_Aggregate_Fields = {
  __typename?: 'userProfiles_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<UserProfiles_Max_Fields>;
  min?: Maybe<UserProfiles_Min_Fields>;
};


/** aggregate fields of "user_profiles" */
export type UserProfiles_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<UserProfiles_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** Boolean expression to filter rows from the table "user_profiles". All fields are combined with a logical 'AND'. */
export type UserProfiles_Bool_Exp = {
  _and?: InputMaybe<Array<UserProfiles_Bool_Exp>>;
  _not?: InputMaybe<UserProfiles_Bool_Exp>;
  _or?: InputMaybe<Array<UserProfiles_Bool_Exp>>;
  created_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  isSubscribedGeneral?: InputMaybe<Boolean_Comparison_Exp>;
  isSubscribedSyncUpdates?: InputMaybe<Boolean_Comparison_Exp>;
  stripeCustomerId?: InputMaybe<String_Comparison_Exp>;
  syncUpdatesFrequency?: InputMaybe<Frequencies_Enum_Comparison_Exp>;
  syncUpdatesJobId?: InputMaybe<String_Comparison_Exp>;
  timezone?: InputMaybe<String_Comparison_Exp>;
  updated_at?: InputMaybe<Timestamptz_Comparison_Exp>;
  user?: InputMaybe<Users_Bool_Exp>;
  userId?: InputMaybe<Uuid_Comparison_Exp>;
};

/** unique or primary key constraints on table "user_profiles" */
export enum UserProfiles_Constraint {
  /** unique or primary key constraint on columns "user_id" */
  UserProfilesPkey = 'user_profiles_pkey',
  /** unique or primary key constraint on columns "sync_updates_job_id" */
  UserProfilesSyncUpdatesJobIdKey = 'user_profiles_sync_updates_job_id_key',
  /** unique or primary key constraint on columns "user_id" */
  UserProfilesUserIdKey = 'user_profiles_user_id_key'
}

/** input type for inserting data into table "user_profiles" */
export type UserProfiles_Insert_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  isSubscribedGeneral?: InputMaybe<Scalars['Boolean']>;
  isSubscribedSyncUpdates?: InputMaybe<Scalars['Boolean']>;
  stripeCustomerId?: InputMaybe<Scalars['String']>;
  syncUpdatesFrequency?: InputMaybe<Frequencies_Enum>;
  syncUpdatesJobId?: InputMaybe<Scalars['String']>;
  timezone?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  user?: InputMaybe<Users_Obj_Rel_Insert_Input>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** aggregate max on columns */
export type UserProfiles_Max_Fields = {
  __typename?: 'userProfiles_max_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  stripeCustomerId?: Maybe<Scalars['String']>;
  syncUpdatesJobId?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** aggregate min on columns */
export type UserProfiles_Min_Fields = {
  __typename?: 'userProfiles_min_fields';
  created_at?: Maybe<Scalars['timestamptz']>;
  stripeCustomerId?: Maybe<Scalars['String']>;
  syncUpdatesJobId?: Maybe<Scalars['String']>;
  timezone?: Maybe<Scalars['String']>;
  updated_at?: Maybe<Scalars['timestamptz']>;
  userId?: Maybe<Scalars['uuid']>;
};

/** response of any mutation on the table "user_profiles" */
export type UserProfiles_Mutation_Response = {
  __typename?: 'userProfiles_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<UserProfiles>;
};

/** on_conflict condition type for table "user_profiles" */
export type UserProfiles_On_Conflict = {
  constraint: UserProfiles_Constraint;
  update_columns?: Array<UserProfiles_Update_Column>;
  where?: InputMaybe<UserProfiles_Bool_Exp>;
};

/** Ordering options when selecting data from "user_profiles". */
export type UserProfiles_Order_By = {
  created_at?: InputMaybe<Order_By>;
  isSubscribedGeneral?: InputMaybe<Order_By>;
  isSubscribedSyncUpdates?: InputMaybe<Order_By>;
  stripeCustomerId?: InputMaybe<Order_By>;
  syncUpdatesFrequency?: InputMaybe<Order_By>;
  syncUpdatesJobId?: InputMaybe<Order_By>;
  timezone?: InputMaybe<Order_By>;
  updated_at?: InputMaybe<Order_By>;
  user?: InputMaybe<Users_Order_By>;
  userId?: InputMaybe<Order_By>;
};

/** primary key columns input for table: user_profiles */
export type UserProfiles_Pk_Columns_Input = {
  userId: Scalars['uuid'];
};

/** select columns of table "user_profiles" */
export enum UserProfiles_Select_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IsSubscribedGeneral = 'isSubscribedGeneral',
  /** column name */
  IsSubscribedSyncUpdates = 'isSubscribedSyncUpdates',
  /** column name */
  StripeCustomerId = 'stripeCustomerId',
  /** column name */
  SyncUpdatesFrequency = 'syncUpdatesFrequency',
  /** column name */
  SyncUpdatesJobId = 'syncUpdatesJobId',
  /** column name */
  Timezone = 'timezone',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'userId'
}

/** input type for updating data in table "user_profiles" */
export type UserProfiles_Set_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  isSubscribedGeneral?: InputMaybe<Scalars['Boolean']>;
  isSubscribedSyncUpdates?: InputMaybe<Scalars['Boolean']>;
  stripeCustomerId?: InputMaybe<Scalars['String']>;
  syncUpdatesFrequency?: InputMaybe<Frequencies_Enum>;
  syncUpdatesJobId?: InputMaybe<Scalars['String']>;
  timezone?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** Streaming cursor of the table "userProfiles" */
export type UserProfiles_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: UserProfiles_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type UserProfiles_Stream_Cursor_Value_Input = {
  created_at?: InputMaybe<Scalars['timestamptz']>;
  isSubscribedGeneral?: InputMaybe<Scalars['Boolean']>;
  isSubscribedSyncUpdates?: InputMaybe<Scalars['Boolean']>;
  stripeCustomerId?: InputMaybe<Scalars['String']>;
  syncUpdatesFrequency?: InputMaybe<Frequencies_Enum>;
  syncUpdatesJobId?: InputMaybe<Scalars['String']>;
  timezone?: InputMaybe<Scalars['String']>;
  updated_at?: InputMaybe<Scalars['timestamptz']>;
  userId?: InputMaybe<Scalars['uuid']>;
};

/** update columns of table "user_profiles" */
export enum UserProfiles_Update_Column {
  /** column name */
  CreatedAt = 'created_at',
  /** column name */
  IsSubscribedGeneral = 'isSubscribedGeneral',
  /** column name */
  IsSubscribedSyncUpdates = 'isSubscribedSyncUpdates',
  /** column name */
  StripeCustomerId = 'stripeCustomerId',
  /** column name */
  SyncUpdatesFrequency = 'syncUpdatesFrequency',
  /** column name */
  SyncUpdatesJobId = 'syncUpdatesJobId',
  /** column name */
  Timezone = 'timezone',
  /** column name */
  UpdatedAt = 'updated_at',
  /** column name */
  UserId = 'userId'
}

export type UserProfiles_Updates = {
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<UserProfiles_Set_Input>;
  where: UserProfiles_Bool_Exp;
};

/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type Users = {
  __typename?: 'users';
  activeMfaType?: Maybe<Scalars['String']>;
  avatarUrl: Scalars['String'];
  createdAt: Scalars['timestamptz'];
  currentChallenge?: Maybe<Scalars['String']>;
  defaultRole: Scalars['String'];
  /** An object relationship */
  defaultRoleByRole: AuthRoles;
  /** An array relationship */
  destinations: Array<Destinations>;
  /** An aggregate relationship */
  destinations_aggregate: Destinations_Aggregate;
  disabled: Scalars['Boolean'];
  displayName: Scalars['String'];
  email?: Maybe<Scalars['citext']>;
  emailVerified: Scalars['Boolean'];
  id: Scalars['uuid'];
  isAnonymous: Scalars['Boolean'];
  lastSeen?: Maybe<Scalars['timestamptz']>;
  locale: Scalars['String'];
  metadata?: Maybe<Scalars['jsonb']>;
  newEmail?: Maybe<Scalars['citext']>;
  /** An array relationship */
  notion_connections: Array<Notion_Connections>;
  /** An aggregate relationship */
  notion_connections_aggregate: Notion_Connections_Aggregate;
  otpHash?: Maybe<Scalars['String']>;
  otpHashExpiresAt: Scalars['timestamptz'];
  otpMethodLastUsed?: Maybe<Scalars['String']>;
  passwordHash?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  phoneNumberVerified: Scalars['Boolean'];
  /** An array relationship */
  plaid_items: Array<Plaid_Items>;
  /** An aggregate relationship */
  plaid_items_aggregate: Plaid_Items_Aggregate;
  profile: RemoteSchemaUserProfile;
  /** An array relationship */
  refreshTokens: Array<AuthRefreshTokens>;
  /** An aggregate relationship */
  refreshTokens_aggregate: AuthRefreshTokens_Aggregate;
  /** An array relationship */
  roles: Array<AuthUserRoles>;
  /** An aggregate relationship */
  roles_aggregate: AuthUserRoles_Aggregate;
  /** An array relationship */
  securityKeys: Array<AuthUserSecurityKeys>;
  /** An aggregate relationship */
  securityKeys_aggregate: AuthUserSecurityKeys_Aggregate;
  ticket?: Maybe<Scalars['String']>;
  ticketExpiresAt: Scalars['timestamptz'];
  totpSecret?: Maybe<Scalars['String']>;
  updatedAt: Scalars['timestamptz'];
  /** An array relationship */
  userProviders: Array<AuthUserProviders>;
  /** An aggregate relationship */
  userProviders_aggregate: AuthUserProviders_Aggregate;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersDestinationsArgs = {
  distinct_on?: InputMaybe<Array<Destinations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destinations_Order_By>>;
  where?: InputMaybe<Destinations_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersDestinations_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Destinations_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Destinations_Order_By>>;
  where?: InputMaybe<Destinations_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersMetadataArgs = {
  path?: InputMaybe<Scalars['String']>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersNotion_ConnectionsArgs = {
  distinct_on?: InputMaybe<Array<Notion_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Notion_Connections_Order_By>>;
  where?: InputMaybe<Notion_Connections_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersNotion_Connections_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Notion_Connections_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Notion_Connections_Order_By>>;
  where?: InputMaybe<Notion_Connections_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersPlaid_ItemsArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Items_Order_By>>;
  where?: InputMaybe<Plaid_Items_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersPlaid_Items_AggregateArgs = {
  distinct_on?: InputMaybe<Array<Plaid_Items_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<Plaid_Items_Order_By>>;
  where?: InputMaybe<Plaid_Items_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersRefreshTokensArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersRefreshTokens_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthRefreshTokens_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthRefreshTokens_Order_By>>;
  where?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersRolesArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersRoles_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserRoles_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserRoles_Order_By>>;
  where?: InputMaybe<AuthUserRoles_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersSecurityKeysArgs = {
  distinct_on?: InputMaybe<Array<AuthUserSecurityKeys_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserSecurityKeys_Order_By>>;
  where?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersSecurityKeys_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserSecurityKeys_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserSecurityKeys_Order_By>>;
  where?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersUserProvidersArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};


/** User account information. Don't modify its structure as Hasura Auth relies on it to function properly. */
export type UsersUserProviders_AggregateArgs = {
  distinct_on?: InputMaybe<Array<AuthUserProviders_Select_Column>>;
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  order_by?: InputMaybe<Array<AuthUserProviders_Order_By>>;
  where?: InputMaybe<AuthUserProviders_Bool_Exp>;
};

/** aggregated selection of "auth.users" */
export type Users_Aggregate = {
  __typename?: 'users_aggregate';
  aggregate?: Maybe<Users_Aggregate_Fields>;
  nodes: Array<Users>;
};

export type Users_Aggregate_Bool_Exp = {
  bool_and?: InputMaybe<Users_Aggregate_Bool_Exp_Bool_And>;
  bool_or?: InputMaybe<Users_Aggregate_Bool_Exp_Bool_Or>;
  count?: InputMaybe<Users_Aggregate_Bool_Exp_Count>;
};

export type Users_Aggregate_Bool_Exp_Bool_And = {
  arguments: Users_Select_Column_Users_Aggregate_Bool_Exp_Bool_And_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Users_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Users_Aggregate_Bool_Exp_Bool_Or = {
  arguments: Users_Select_Column_Users_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Users_Bool_Exp>;
  predicate: Boolean_Comparison_Exp;
};

export type Users_Aggregate_Bool_Exp_Count = {
  arguments?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
  filter?: InputMaybe<Users_Bool_Exp>;
  predicate: Int_Comparison_Exp;
};

/** aggregate fields of "auth.users" */
export type Users_Aggregate_Fields = {
  __typename?: 'users_aggregate_fields';
  count: Scalars['Int'];
  max?: Maybe<Users_Max_Fields>;
  min?: Maybe<Users_Min_Fields>;
};


/** aggregate fields of "auth.users" */
export type Users_Aggregate_FieldsCountArgs = {
  columns?: InputMaybe<Array<Users_Select_Column>>;
  distinct?: InputMaybe<Scalars['Boolean']>;
};

/** order by aggregate values of table "auth.users" */
export type Users_Aggregate_Order_By = {
  count?: InputMaybe<Order_By>;
  max?: InputMaybe<Users_Max_Order_By>;
  min?: InputMaybe<Users_Min_Order_By>;
};

/** append existing jsonb value of filtered columns with new jsonb value */
export type Users_Append_Input = {
  metadata?: InputMaybe<Scalars['jsonb']>;
};

/** input type for inserting array relation for remote table "auth.users" */
export type Users_Arr_Rel_Insert_Input = {
  data: Array<Users_Insert_Input>;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** Boolean expression to filter rows from the table "auth.users". All fields are combined with a logical 'AND'. */
export type Users_Bool_Exp = {
  _and?: InputMaybe<Array<Users_Bool_Exp>>;
  _not?: InputMaybe<Users_Bool_Exp>;
  _or?: InputMaybe<Array<Users_Bool_Exp>>;
  activeMfaType?: InputMaybe<String_Comparison_Exp>;
  avatarUrl?: InputMaybe<String_Comparison_Exp>;
  createdAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  currentChallenge?: InputMaybe<String_Comparison_Exp>;
  defaultRole?: InputMaybe<String_Comparison_Exp>;
  defaultRoleByRole?: InputMaybe<AuthRoles_Bool_Exp>;
  destinations?: InputMaybe<Destinations_Bool_Exp>;
  destinations_aggregate?: InputMaybe<Destinations_Aggregate_Bool_Exp>;
  disabled?: InputMaybe<Boolean_Comparison_Exp>;
  displayName?: InputMaybe<String_Comparison_Exp>;
  email?: InputMaybe<Citext_Comparison_Exp>;
  emailVerified?: InputMaybe<Boolean_Comparison_Exp>;
  id?: InputMaybe<Uuid_Comparison_Exp>;
  isAnonymous?: InputMaybe<Boolean_Comparison_Exp>;
  lastSeen?: InputMaybe<Timestamptz_Comparison_Exp>;
  locale?: InputMaybe<String_Comparison_Exp>;
  metadata?: InputMaybe<Jsonb_Comparison_Exp>;
  newEmail?: InputMaybe<Citext_Comparison_Exp>;
  notion_connections?: InputMaybe<Notion_Connections_Bool_Exp>;
  notion_connections_aggregate?: InputMaybe<Notion_Connections_Aggregate_Bool_Exp>;
  otpHash?: InputMaybe<String_Comparison_Exp>;
  otpHashExpiresAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  otpMethodLastUsed?: InputMaybe<String_Comparison_Exp>;
  passwordHash?: InputMaybe<String_Comparison_Exp>;
  phoneNumber?: InputMaybe<String_Comparison_Exp>;
  phoneNumberVerified?: InputMaybe<Boolean_Comparison_Exp>;
  plaid_items?: InputMaybe<Plaid_Items_Bool_Exp>;
  plaid_items_aggregate?: InputMaybe<Plaid_Items_Aggregate_Bool_Exp>;
  refreshTokens?: InputMaybe<AuthRefreshTokens_Bool_Exp>;
  refreshTokens_aggregate?: InputMaybe<AuthRefreshTokens_Aggregate_Bool_Exp>;
  roles?: InputMaybe<AuthUserRoles_Bool_Exp>;
  roles_aggregate?: InputMaybe<AuthUserRoles_Aggregate_Bool_Exp>;
  securityKeys?: InputMaybe<AuthUserSecurityKeys_Bool_Exp>;
  securityKeys_aggregate?: InputMaybe<AuthUserSecurityKeys_Aggregate_Bool_Exp>;
  ticket?: InputMaybe<String_Comparison_Exp>;
  ticketExpiresAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  totpSecret?: InputMaybe<String_Comparison_Exp>;
  updatedAt?: InputMaybe<Timestamptz_Comparison_Exp>;
  userProviders?: InputMaybe<AuthUserProviders_Bool_Exp>;
  userProviders_aggregate?: InputMaybe<AuthUserProviders_Aggregate_Bool_Exp>;
};

/** unique or primary key constraints on table "auth.users" */
export enum Users_Constraint {
  /** unique or primary key constraint on columns "email" */
  UsersEmailKey = 'users_email_key',
  /** unique or primary key constraint on columns "phone_number" */
  UsersPhoneNumberKey = 'users_phone_number_key',
  /** unique or primary key constraint on columns "id" */
  UsersPkey = 'users_pkey'
}

/** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
export type Users_Delete_At_Path_Input = {
  metadata?: InputMaybe<Array<Scalars['String']>>;
};

/** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
export type Users_Delete_Elem_Input = {
  metadata?: InputMaybe<Scalars['Int']>;
};

/** delete key/value pair or string element. key/value pairs are matched based on their key value */
export type Users_Delete_Key_Input = {
  metadata?: InputMaybe<Scalars['String']>;
};

/** input type for inserting data into table "auth.users" */
export type Users_Insert_Input = {
  activeMfaType?: InputMaybe<Scalars['String']>;
  avatarUrl?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  currentChallenge?: InputMaybe<Scalars['String']>;
  defaultRole?: InputMaybe<Scalars['String']>;
  defaultRoleByRole?: InputMaybe<AuthRoles_Obj_Rel_Insert_Input>;
  destinations?: InputMaybe<Destinations_Arr_Rel_Insert_Input>;
  disabled?: InputMaybe<Scalars['Boolean']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['citext']>;
  emailVerified?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['uuid']>;
  isAnonymous?: InputMaybe<Scalars['Boolean']>;
  lastSeen?: InputMaybe<Scalars['timestamptz']>;
  locale?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  newEmail?: InputMaybe<Scalars['citext']>;
  notion_connections?: InputMaybe<Notion_Connections_Arr_Rel_Insert_Input>;
  otpHash?: InputMaybe<Scalars['String']>;
  otpHashExpiresAt?: InputMaybe<Scalars['timestamptz']>;
  otpMethodLastUsed?: InputMaybe<Scalars['String']>;
  passwordHash?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  phoneNumberVerified?: InputMaybe<Scalars['Boolean']>;
  plaid_items?: InputMaybe<Plaid_Items_Arr_Rel_Insert_Input>;
  refreshTokens?: InputMaybe<AuthRefreshTokens_Arr_Rel_Insert_Input>;
  roles?: InputMaybe<AuthUserRoles_Arr_Rel_Insert_Input>;
  securityKeys?: InputMaybe<AuthUserSecurityKeys_Arr_Rel_Insert_Input>;
  ticket?: InputMaybe<Scalars['String']>;
  ticketExpiresAt?: InputMaybe<Scalars['timestamptz']>;
  totpSecret?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
  userProviders?: InputMaybe<AuthUserProviders_Arr_Rel_Insert_Input>;
};

/** aggregate max on columns */
export type Users_Max_Fields = {
  __typename?: 'users_max_fields';
  activeMfaType?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  currentChallenge?: Maybe<Scalars['String']>;
  defaultRole?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['citext']>;
  id?: Maybe<Scalars['uuid']>;
  lastSeen?: Maybe<Scalars['timestamptz']>;
  locale?: Maybe<Scalars['String']>;
  newEmail?: Maybe<Scalars['citext']>;
  otpHash?: Maybe<Scalars['String']>;
  otpHashExpiresAt?: Maybe<Scalars['timestamptz']>;
  otpMethodLastUsed?: Maybe<Scalars['String']>;
  passwordHash?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  ticket?: Maybe<Scalars['String']>;
  ticketExpiresAt?: Maybe<Scalars['timestamptz']>;
  totpSecret?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by max() on columns of table "auth.users" */
export type Users_Max_Order_By = {
  activeMfaType?: InputMaybe<Order_By>;
  avatarUrl?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  currentChallenge?: InputMaybe<Order_By>;
  defaultRole?: InputMaybe<Order_By>;
  displayName?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastSeen?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  newEmail?: InputMaybe<Order_By>;
  otpHash?: InputMaybe<Order_By>;
  otpHashExpiresAt?: InputMaybe<Order_By>;
  otpMethodLastUsed?: InputMaybe<Order_By>;
  passwordHash?: InputMaybe<Order_By>;
  phoneNumber?: InputMaybe<Order_By>;
  ticket?: InputMaybe<Order_By>;
  ticketExpiresAt?: InputMaybe<Order_By>;
  totpSecret?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** aggregate min on columns */
export type Users_Min_Fields = {
  __typename?: 'users_min_fields';
  activeMfaType?: Maybe<Scalars['String']>;
  avatarUrl?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['timestamptz']>;
  currentChallenge?: Maybe<Scalars['String']>;
  defaultRole?: Maybe<Scalars['String']>;
  displayName?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['citext']>;
  id?: Maybe<Scalars['uuid']>;
  lastSeen?: Maybe<Scalars['timestamptz']>;
  locale?: Maybe<Scalars['String']>;
  newEmail?: Maybe<Scalars['citext']>;
  otpHash?: Maybe<Scalars['String']>;
  otpHashExpiresAt?: Maybe<Scalars['timestamptz']>;
  otpMethodLastUsed?: Maybe<Scalars['String']>;
  passwordHash?: Maybe<Scalars['String']>;
  phoneNumber?: Maybe<Scalars['String']>;
  ticket?: Maybe<Scalars['String']>;
  ticketExpiresAt?: Maybe<Scalars['timestamptz']>;
  totpSecret?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['timestamptz']>;
};

/** order by min() on columns of table "auth.users" */
export type Users_Min_Order_By = {
  activeMfaType?: InputMaybe<Order_By>;
  avatarUrl?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  currentChallenge?: InputMaybe<Order_By>;
  defaultRole?: InputMaybe<Order_By>;
  displayName?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  lastSeen?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  newEmail?: InputMaybe<Order_By>;
  otpHash?: InputMaybe<Order_By>;
  otpHashExpiresAt?: InputMaybe<Order_By>;
  otpMethodLastUsed?: InputMaybe<Order_By>;
  passwordHash?: InputMaybe<Order_By>;
  phoneNumber?: InputMaybe<Order_By>;
  ticket?: InputMaybe<Order_By>;
  ticketExpiresAt?: InputMaybe<Order_By>;
  totpSecret?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
};

/** response of any mutation on the table "auth.users" */
export type Users_Mutation_Response = {
  __typename?: 'users_mutation_response';
  /** number of rows affected by the mutation */
  affected_rows: Scalars['Int'];
  /** data from the rows affected by the mutation */
  returning: Array<Users>;
};

/** input type for inserting object relation for remote table "auth.users" */
export type Users_Obj_Rel_Insert_Input = {
  data: Users_Insert_Input;
  /** upsert condition */
  on_conflict?: InputMaybe<Users_On_Conflict>;
};

/** on_conflict condition type for table "auth.users" */
export type Users_On_Conflict = {
  constraint: Users_Constraint;
  update_columns?: Array<Users_Update_Column>;
  where?: InputMaybe<Users_Bool_Exp>;
};

/** Ordering options when selecting data from "auth.users". */
export type Users_Order_By = {
  activeMfaType?: InputMaybe<Order_By>;
  avatarUrl?: InputMaybe<Order_By>;
  createdAt?: InputMaybe<Order_By>;
  currentChallenge?: InputMaybe<Order_By>;
  defaultRole?: InputMaybe<Order_By>;
  defaultRoleByRole?: InputMaybe<AuthRoles_Order_By>;
  destinations_aggregate?: InputMaybe<Destinations_Aggregate_Order_By>;
  disabled?: InputMaybe<Order_By>;
  displayName?: InputMaybe<Order_By>;
  email?: InputMaybe<Order_By>;
  emailVerified?: InputMaybe<Order_By>;
  id?: InputMaybe<Order_By>;
  isAnonymous?: InputMaybe<Order_By>;
  lastSeen?: InputMaybe<Order_By>;
  locale?: InputMaybe<Order_By>;
  metadata?: InputMaybe<Order_By>;
  newEmail?: InputMaybe<Order_By>;
  notion_connections_aggregate?: InputMaybe<Notion_Connections_Aggregate_Order_By>;
  otpHash?: InputMaybe<Order_By>;
  otpHashExpiresAt?: InputMaybe<Order_By>;
  otpMethodLastUsed?: InputMaybe<Order_By>;
  passwordHash?: InputMaybe<Order_By>;
  phoneNumber?: InputMaybe<Order_By>;
  phoneNumberVerified?: InputMaybe<Order_By>;
  plaid_items_aggregate?: InputMaybe<Plaid_Items_Aggregate_Order_By>;
  refreshTokens_aggregate?: InputMaybe<AuthRefreshTokens_Aggregate_Order_By>;
  roles_aggregate?: InputMaybe<AuthUserRoles_Aggregate_Order_By>;
  securityKeys_aggregate?: InputMaybe<AuthUserSecurityKeys_Aggregate_Order_By>;
  ticket?: InputMaybe<Order_By>;
  ticketExpiresAt?: InputMaybe<Order_By>;
  totpSecret?: InputMaybe<Order_By>;
  updatedAt?: InputMaybe<Order_By>;
  userProviders_aggregate?: InputMaybe<AuthUserProviders_Aggregate_Order_By>;
};

/** primary key columns input for table: auth.users */
export type Users_Pk_Columns_Input = {
  id: Scalars['uuid'];
};

/** prepend existing jsonb value of filtered columns with new jsonb value */
export type Users_Prepend_Input = {
  metadata?: InputMaybe<Scalars['jsonb']>;
};

/** select columns of table "auth.users" */
export enum Users_Select_Column {
  /** column name */
  ActiveMfaType = 'activeMfaType',
  /** column name */
  AvatarUrl = 'avatarUrl',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  CurrentChallenge = 'currentChallenge',
  /** column name */
  DefaultRole = 'defaultRole',
  /** column name */
  Disabled = 'disabled',
  /** column name */
  DisplayName = 'displayName',
  /** column name */
  Email = 'email',
  /** column name */
  EmailVerified = 'emailVerified',
  /** column name */
  Id = 'id',
  /** column name */
  IsAnonymous = 'isAnonymous',
  /** column name */
  LastSeen = 'lastSeen',
  /** column name */
  Locale = 'locale',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  NewEmail = 'newEmail',
  /** column name */
  OtpHash = 'otpHash',
  /** column name */
  OtpHashExpiresAt = 'otpHashExpiresAt',
  /** column name */
  OtpMethodLastUsed = 'otpMethodLastUsed',
  /** column name */
  PasswordHash = 'passwordHash',
  /** column name */
  PhoneNumber = 'phoneNumber',
  /** column name */
  PhoneNumberVerified = 'phoneNumberVerified',
  /** column name */
  Ticket = 'ticket',
  /** column name */
  TicketExpiresAt = 'ticketExpiresAt',
  /** column name */
  TotpSecret = 'totpSecret',
  /** column name */
  UpdatedAt = 'updatedAt'
}

/** select "users_aggregate_bool_exp_bool_and_arguments_columns" columns of table "auth.users" */
export enum Users_Select_Column_Users_Aggregate_Bool_Exp_Bool_And_Arguments_Columns {
  /** column name */
  Disabled = 'disabled',
  /** column name */
  EmailVerified = 'emailVerified',
  /** column name */
  IsAnonymous = 'isAnonymous',
  /** column name */
  PhoneNumberVerified = 'phoneNumberVerified'
}

/** select "users_aggregate_bool_exp_bool_or_arguments_columns" columns of table "auth.users" */
export enum Users_Select_Column_Users_Aggregate_Bool_Exp_Bool_Or_Arguments_Columns {
  /** column name */
  Disabled = 'disabled',
  /** column name */
  EmailVerified = 'emailVerified',
  /** column name */
  IsAnonymous = 'isAnonymous',
  /** column name */
  PhoneNumberVerified = 'phoneNumberVerified'
}

/** input type for updating data in table "auth.users" */
export type Users_Set_Input = {
  activeMfaType?: InputMaybe<Scalars['String']>;
  avatarUrl?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  currentChallenge?: InputMaybe<Scalars['String']>;
  defaultRole?: InputMaybe<Scalars['String']>;
  disabled?: InputMaybe<Scalars['Boolean']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['citext']>;
  emailVerified?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['uuid']>;
  isAnonymous?: InputMaybe<Scalars['Boolean']>;
  lastSeen?: InputMaybe<Scalars['timestamptz']>;
  locale?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  newEmail?: InputMaybe<Scalars['citext']>;
  otpHash?: InputMaybe<Scalars['String']>;
  otpHashExpiresAt?: InputMaybe<Scalars['timestamptz']>;
  otpMethodLastUsed?: InputMaybe<Scalars['String']>;
  passwordHash?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  phoneNumberVerified?: InputMaybe<Scalars['Boolean']>;
  ticket?: InputMaybe<Scalars['String']>;
  ticketExpiresAt?: InputMaybe<Scalars['timestamptz']>;
  totpSecret?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** Streaming cursor of the table "users" */
export type Users_Stream_Cursor_Input = {
  /** Stream column input with initial value */
  initial_value: Users_Stream_Cursor_Value_Input;
  /** cursor ordering */
  ordering?: InputMaybe<Cursor_Ordering>;
};

/** Initial value of the column from where the streaming should start */
export type Users_Stream_Cursor_Value_Input = {
  activeMfaType?: InputMaybe<Scalars['String']>;
  avatarUrl?: InputMaybe<Scalars['String']>;
  createdAt?: InputMaybe<Scalars['timestamptz']>;
  currentChallenge?: InputMaybe<Scalars['String']>;
  defaultRole?: InputMaybe<Scalars['String']>;
  disabled?: InputMaybe<Scalars['Boolean']>;
  displayName?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['citext']>;
  emailVerified?: InputMaybe<Scalars['Boolean']>;
  id?: InputMaybe<Scalars['uuid']>;
  isAnonymous?: InputMaybe<Scalars['Boolean']>;
  lastSeen?: InputMaybe<Scalars['timestamptz']>;
  locale?: InputMaybe<Scalars['String']>;
  metadata?: InputMaybe<Scalars['jsonb']>;
  newEmail?: InputMaybe<Scalars['citext']>;
  otpHash?: InputMaybe<Scalars['String']>;
  otpHashExpiresAt?: InputMaybe<Scalars['timestamptz']>;
  otpMethodLastUsed?: InputMaybe<Scalars['String']>;
  passwordHash?: InputMaybe<Scalars['String']>;
  phoneNumber?: InputMaybe<Scalars['String']>;
  phoneNumberVerified?: InputMaybe<Scalars['Boolean']>;
  ticket?: InputMaybe<Scalars['String']>;
  ticketExpiresAt?: InputMaybe<Scalars['timestamptz']>;
  totpSecret?: InputMaybe<Scalars['String']>;
  updatedAt?: InputMaybe<Scalars['timestamptz']>;
};

/** update columns of table "auth.users" */
export enum Users_Update_Column {
  /** column name */
  ActiveMfaType = 'activeMfaType',
  /** column name */
  AvatarUrl = 'avatarUrl',
  /** column name */
  CreatedAt = 'createdAt',
  /** column name */
  CurrentChallenge = 'currentChallenge',
  /** column name */
  DefaultRole = 'defaultRole',
  /** column name */
  Disabled = 'disabled',
  /** column name */
  DisplayName = 'displayName',
  /** column name */
  Email = 'email',
  /** column name */
  EmailVerified = 'emailVerified',
  /** column name */
  Id = 'id',
  /** column name */
  IsAnonymous = 'isAnonymous',
  /** column name */
  LastSeen = 'lastSeen',
  /** column name */
  Locale = 'locale',
  /** column name */
  Metadata = 'metadata',
  /** column name */
  NewEmail = 'newEmail',
  /** column name */
  OtpHash = 'otpHash',
  /** column name */
  OtpHashExpiresAt = 'otpHashExpiresAt',
  /** column name */
  OtpMethodLastUsed = 'otpMethodLastUsed',
  /** column name */
  PasswordHash = 'passwordHash',
  /** column name */
  PhoneNumber = 'phoneNumber',
  /** column name */
  PhoneNumberVerified = 'phoneNumberVerified',
  /** column name */
  Ticket = 'ticket',
  /** column name */
  TicketExpiresAt = 'ticketExpiresAt',
  /** column name */
  TotpSecret = 'totpSecret',
  /** column name */
  UpdatedAt = 'updatedAt'
}

export type Users_Updates = {
  /** append existing jsonb value of filtered columns with new jsonb value */
  _append?: InputMaybe<Users_Append_Input>;
  /** delete the field or element with specified path (for JSON arrays, negative integers count from the end) */
  _delete_at_path?: InputMaybe<Users_Delete_At_Path_Input>;
  /** delete the array element with specified index (negative integers count from the end). throws an error if top level container is not an array */
  _delete_elem?: InputMaybe<Users_Delete_Elem_Input>;
  /** delete key/value pair or string element. key/value pairs are matched based on their key value */
  _delete_key?: InputMaybe<Users_Delete_Key_Input>;
  /** prepend existing jsonb value of filtered columns with new jsonb value */
  _prepend?: InputMaybe<Users_Prepend_Input>;
  /** sets the columns of the filtered rows to the given values */
  _set?: InputMaybe<Users_Set_Input>;
  where: Users_Bool_Exp;
};

/** Boolean expression to compare columns of type "uuid". All fields are combined with logical 'AND'. */
export type Uuid_Comparison_Exp = {
  _eq?: InputMaybe<Scalars['uuid']>;
  _gt?: InputMaybe<Scalars['uuid']>;
  _gte?: InputMaybe<Scalars['uuid']>;
  _in?: InputMaybe<Array<Scalars['uuid']>>;
  _is_null?: InputMaybe<Scalars['Boolean']>;
  _lt?: InputMaybe<Scalars['uuid']>;
  _lte?: InputMaybe<Scalars['uuid']>;
  _neq?: InputMaybe<Scalars['uuid']>;
  _nin?: InputMaybe<Array<Scalars['uuid']>>;
};

export type AllDestinationAccountFieldsFragment = { __typename: 'destination_accounts', account_id: string, destination_id: any };

export type InsertDestinationAccountsMutationVariables = Exact<{
  destination_accounts: Array<Destination_Accounts_Insert_Input> | Destination_Accounts_Insert_Input;
}>;


export type InsertDestinationAccountsMutation = { __typename?: 'mutation_root', destination_accounts?: { __typename?: 'destination_accounts_mutation_response', returning: Array<{ __typename: 'destination_accounts', account_id: string, destination_id: any }> } | null };

export type DeleteDestinationAccountsMutationVariables = Exact<{
  where: Destination_Accounts_Bool_Exp;
}>;


export type DeleteDestinationAccountsMutation = { __typename?: 'mutation_root', destination_accounts?: { __typename?: 'destination_accounts_mutation_response', returning: Array<{ __typename: 'destination_accounts', account_id: string, destination_id: any }> } | null };

export type GetDestinationAccountsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetDestinationAccountsQuery = { __typename?: 'query_root', destination_accounts: Array<{ __typename: 'destination_accounts', account_id: string, destination_id: any }> };

export type AllFrontendDestinationFieldsFragment = { __typename: 'destinations', id: any, created_at: any, integration_id: Integrations_Enum, name: string, sync_start_date: string, should_sync_transactions: boolean, should_sync_investments: boolean, authentication?: any | null, disabled_at?: any | null, table_configs: any, integration: { __typename?: 'integrations', id: string, name: string }, account_connections: Array<{ __typename?: 'destination_accounts', account: { __typename?: 'plaidAccounts', id: string } }>, notion_connection?: { __typename?: 'notion_connections', access_token: string, bot_id: string } | null };

export type InsertDestinationMutationVariables = Exact<{
  destination: Destinations_Insert_Input;
}>;


export type InsertDestinationMutation = { __typename?: 'mutation_root', destination?: { __typename: 'destinations', id: any, created_at: any, integration_id: Integrations_Enum, name: string, sync_start_date: string, should_sync_transactions: boolean, should_sync_investments: boolean, authentication?: any | null, disabled_at?: any | null, table_configs: any, integration: { __typename?: 'integrations', id: string, name: string }, account_connections: Array<{ __typename?: 'destination_accounts', account: { __typename?: 'plaidAccounts', id: string } }>, notion_connection?: { __typename?: 'notion_connections', access_token: string, bot_id: string } | null } | null };

export type GetDestinationsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GetDestinationsSubscription = { __typename?: 'subscription_root', destinations: Array<{ __typename: 'destinations', id: any, created_at: any, integration_id: Integrations_Enum, name: string, sync_start_date: string, should_sync_transactions: boolean, should_sync_investments: boolean, authentication?: any | null, disabled_at?: any | null, table_configs: any, integration: { __typename?: 'integrations', id: string, name: string }, account_connections: Array<{ __typename?: 'destination_accounts', account: { __typename?: 'plaidAccounts', id: string } }>, notion_connection?: { __typename?: 'notion_connections', access_token: string, bot_id: string } | null }> };

export type UpdateDestinationMutationVariables = Exact<{
  destination_id: Scalars['uuid'];
  _set?: InputMaybe<Destinations_Set_Input>;
  _append?: InputMaybe<Destinations_Append_Input>;
}>;


export type UpdateDestinationMutation = { __typename?: 'mutation_root', destination?: { __typename: 'destinations', id: any, created_at: any, integration_id: Integrations_Enum, name: string, sync_start_date: string, should_sync_transactions: boolean, should_sync_investments: boolean, authentication?: any | null, disabled_at?: any | null, table_configs: any, integration: { __typename?: 'integrations', id: string, name: string }, account_connections: Array<{ __typename?: 'destination_accounts', account: { __typename?: 'plaidAccounts', id: string } }>, notion_connection?: { __typename?: 'notion_connections', access_token: string, bot_id: string } | null } | null };

export type AllFrontendIntegrationFieldsFragment = { __typename: 'integrations', id: string, name: string };

export type GetIntegrationsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetIntegrationsQuery = { __typename?: 'query_root', integrations: Array<{ __typename: 'integrations', id: string, name: string }> };

export type AllFrontendPlaidAccountFieldsFragment = { __typename: 'plaidAccounts', id: string, plaid_item_id: string, created_at: any, mask?: string | null, name: string, destination_connections: Array<{ __typename?: 'destination_accounts', destination: { __typename?: 'destinations', id: any, integration: { __typename?: 'integrations', id: string, name: string } } }> };

export type DeletePlaidAccountsMutationVariables = Exact<{
  where: PlaidAccounts_Bool_Exp;
}>;


export type DeletePlaidAccountsMutation = { __typename?: 'mutation_root', deletePlaidAccounts?: { __typename?: 'plaidAccounts_mutation_response', returning: Array<{ __typename: 'plaidAccounts', id: string, plaid_item_id: string, created_at: any, mask?: string | null, name: string, destination_connections: Array<{ __typename?: 'destination_accounts', destination: { __typename?: 'destinations', id: any, integration: { __typename?: 'integrations', id: string, name: string } } }> }> } | null };

export type UpdatePlaidAccountMutationVariables = Exact<{
  plaidAccountId: Scalars['String'];
  _set: PlaidAccounts_Set_Input;
}>;


export type UpdatePlaidAccountMutation = { __typename?: 'mutation_root', plaidAccount?: { __typename: 'plaidAccounts', id: string, plaid_item_id: string, created_at: any, mask?: string | null, name: string, destination_connections: Array<{ __typename?: 'destination_accounts', destination: { __typename?: 'destinations', id: any, integration: { __typename?: 'integrations', id: string, name: string } } }> } | null };

export type GetPlaidAccountsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetPlaidAccountsQuery = { __typename?: 'query_root', plaidAccounts: Array<{ __typename?: 'plaidAccounts', id: string, name: string, mask?: string | null, item: { __typename?: 'plaid_items', institution: { __typename?: 'plaid_institutions', name: string } } }> };

export type AllFrontendPlaidItemFieldsFragment = { __typename: 'plaid_items', id: string, created_at: any, synced_at?: any | null, is_initial_update_complete: boolean, is_historical_update_complete: boolean, error?: string | null, accessToken: string, consentExpiresAt?: any | null, disabled_at?: any | null, institution: { __typename?: 'plaid_institutions', id: string, name: string, logo_file?: { __typename?: 'files', id: any } | null }, accounts: Array<{ __typename: 'plaidAccounts', id: string, plaid_item_id: string, created_at: any, mask?: string | null, name: string, destination_connections: Array<{ __typename?: 'destination_accounts', destination: { __typename?: 'destinations', id: any, integration: { __typename?: 'integrations', id: string, name: string } } }> }> };

export type GetPlaidItemsSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GetPlaidItemsSubscription = { __typename?: 'subscription_root', plaidItems: Array<{ __typename: 'plaid_items', id: string, created_at: any, synced_at?: any | null, is_initial_update_complete: boolean, is_historical_update_complete: boolean, error?: string | null, accessToken: string, consentExpiresAt?: any | null, disabled_at?: any | null, institution: { __typename?: 'plaid_institutions', id: string, name: string, logo_file?: { __typename?: 'files', id: any } | null }, accounts: Array<{ __typename: 'plaidAccounts', id: string, plaid_item_id: string, created_at: any, mask?: string | null, name: string, destination_connections: Array<{ __typename?: 'destination_accounts', destination: { __typename?: 'destinations', id: any, integration: { __typename?: 'integrations', id: string, name: string } } }> }> }> };

export type UpsertPlaidItemMutationVariables = Exact<{
  plaidItem: Plaid_Items_Insert_Input;
}>;


export type UpsertPlaidItemMutation = { __typename?: 'mutation_root', plaidItem?: { __typename: 'plaid_items', id: string, created_at: any, synced_at?: any | null, is_initial_update_complete: boolean, is_historical_update_complete: boolean, error?: string | null, accessToken: string, consentExpiresAt?: any | null, disabled_at?: any | null, institution: { __typename?: 'plaid_institutions', id: string, name: string, logo_file?: { __typename?: 'files', id: any } | null }, accounts: Array<{ __typename: 'plaidAccounts', id: string, plaid_item_id: string, created_at: any, mask?: string | null, name: string, destination_connections: Array<{ __typename?: 'destination_accounts', destination: { __typename?: 'destinations', id: any, integration: { __typename?: 'integrations', id: string, name: string } } }> }> } | null };

export type GetStripePricesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetStripePricesQuery = { __typename?: 'query_root', stripePrices: Array<{ __typename?: 'StripePrice', id: string, interval: PriceInterval, unitAmount: number, productId: string }> };

export type AllFrontendUserFieldsFragment = { __typename: 'users', id: any, displayName: string, email?: any | null, createdAt: any, metadata?: any | null, profile: { __typename?: 'RemoteSchemaUserProfile', stripeData: { __typename?: 'StripeData', trialEndsAt: any, hasAppAccess: boolean, customer: { __typename?: 'StripeCustomer', id: string, createdAt: any }, subscription?: { __typename?: 'StripeSubscription', id: string, status: SubscriptionStatus, cancelAtPeriodEnd: boolean, trialStartedAt?: any | null, trialEndedAt?: any | null, startedAt: any, endedAt?: any | null, currentPeriodStart: any, currentPeriodEnd: any, interval: PriceInterval, canceledAt?: any | null } | null } } };

export type UpdateUserMutationVariables = Exact<{
  id: Scalars['uuid'];
  _set?: InputMaybe<Users_Set_Input>;
  _delete_key?: InputMaybe<Users_Delete_Key_Input>;
}>;


export type UpdateUserMutation = { __typename?: 'mutation_root', user?: { __typename: 'users', id: any, displayName: string, email?: any | null, createdAt: any, metadata?: any | null, profile: { __typename?: 'RemoteSchemaUserProfile', stripeData: { __typename?: 'StripeData', trialEndsAt: any, hasAppAccess: boolean, customer: { __typename?: 'StripeCustomer', id: string, createdAt: any }, subscription?: { __typename?: 'StripeSubscription', id: string, status: SubscriptionStatus, cancelAtPeriodEnd: boolean, trialStartedAt?: any | null, trialEndedAt?: any | null, startedAt: any, endedAt?: any | null, currentPeriodStart: any, currentPeriodEnd: any, interval: PriceInterval, canceledAt?: any | null } | null } } } | null };

export type AllFrontendUserProfileFieldsFragment = { __typename: 'userProfiles', userId: any, timezone?: string | null, isSubscribedGeneral: boolean, isSubscribedSyncUpdates: boolean, syncUpdatesFrequency?: Frequencies_Enum | null };

export type GetUserProfileQueryVariables = Exact<{
  userId: Scalars['uuid'];
}>;


export type GetUserProfileQuery = { __typename?: 'query_root', userProfile?: { __typename: 'userProfiles', userId: any, timezone?: string | null, isSubscribedGeneral: boolean, isSubscribedSyncUpdates: boolean, syncUpdatesFrequency?: Frequencies_Enum | null } | null };

export type GetUserQueryVariables = Exact<{
  userId: Scalars['uuid'];
}>;


export type GetUserQuery = { __typename?: 'query_root', user?: { __typename: 'users', id: any, displayName: string, email?: any | null, createdAt: any, metadata?: any | null, profile: { __typename?: 'RemoteSchemaUserProfile', stripeData: { __typename?: 'StripeData', trialEndsAt: any, hasAppAccess: boolean, customer: { __typename?: 'StripeCustomer', id: string, createdAt: any }, subscription?: { __typename?: 'StripeSubscription', id: string, status: SubscriptionStatus, cancelAtPeriodEnd: boolean, trialStartedAt?: any | null, trialEndedAt?: any | null, startedAt: any, endedAt?: any | null, currentPeriodStart: any, currentPeriodEnd: any, interval: PriceInterval, canceledAt?: any | null } | null } } } | null };

export type UpdateUserProfileMutationVariables = Exact<{
  userId: Scalars['uuid'];
  _set: UserProfiles_Set_Input;
}>;


export type UpdateUserProfileMutation = { __typename?: 'mutation_root', updateUserProfile?: { __typename: 'userProfiles', userId: any, timezone?: string | null, isSubscribedGeneral: boolean, isSubscribedSyncUpdates: boolean, syncUpdatesFrequency?: Frequencies_Enum | null } | null };

export const AllDestinationAccountFieldsFragmentDoc = gql`
    fragment AllDestinationAccountFields on destination_accounts {
  __typename
  account_id
  destination_id
}
    `;
export const AllFrontendDestinationFieldsFragmentDoc = gql`
    fragment AllFrontendDestinationFields on destinations {
  __typename
  id
  created_at
  integration_id
  integration {
    id
    name
  }
  name
  sync_start_date
  should_sync_transactions
  should_sync_investments
  authentication
  disabled_at
  table_configs
  account_connections {
    account {
      id
    }
  }
  notion_connection {
    access_token
    bot_id
  }
}
    `;
export const AllFrontendIntegrationFieldsFragmentDoc = gql`
    fragment AllFrontendIntegrationFields on integrations {
  __typename
  id
  name
}
    `;
export const AllFrontendPlaidAccountFieldsFragmentDoc = gql`
    fragment AllFrontendPlaidAccountFields on plaidAccounts {
  __typename
  id
  plaid_item_id
  created_at
  mask
  name
  destination_connections {
    destination {
      id
      integration {
        id
        name
      }
    }
  }
}
    `;
export const AllFrontendPlaidItemFieldsFragmentDoc = gql`
    fragment AllFrontendPlaidItemFields on plaid_items {
  __typename
  id
  created_at
  synced_at
  is_initial_update_complete
  is_historical_update_complete
  error
  accessToken
  consentExpiresAt
  institution {
    id
    name
    logo_file {
      id
    }
  }
  accounts {
    ...AllFrontendPlaidAccountFields
  }
  disabled_at
}
    ${AllFrontendPlaidAccountFieldsFragmentDoc}`;
export const AllFrontendUserFieldsFragmentDoc = gql`
    fragment AllFrontendUserFields on users {
  __typename
  id
  displayName
  email
  createdAt
  profile {
    stripeData {
      customer {
        id
        createdAt
      }
      trialEndsAt
      hasAppAccess
      subscription {
        id
        status
        cancelAtPeriodEnd
        trialStartedAt
        trialEndedAt
        startedAt
        endedAt
        currentPeriodStart
        currentPeriodEnd
        interval
        canceledAt
      }
    }
  }
  metadata
}
    `;
export const AllFrontendUserProfileFieldsFragmentDoc = gql`
    fragment AllFrontendUserProfileFields on userProfiles {
  __typename
  userId
  timezone
  isSubscribedGeneral
  isSubscribedSyncUpdates
  syncUpdatesFrequency
}
    `;
export const InsertDestinationAccountsDocument = gql`
    mutation InsertDestinationAccounts($destination_accounts: [destination_accounts_insert_input!]!) {
  destination_accounts: insert_destination_accounts(
    objects: $destination_accounts
    on_conflict: {constraint: destination_accounts_pkey, update_columns: [destination_id]}
  ) {
    returning {
      ...AllDestinationAccountFields
    }
  }
}
    ${AllDestinationAccountFieldsFragmentDoc}`;
export type InsertDestinationAccountsMutationFn = Apollo.MutationFunction<InsertDestinationAccountsMutation, InsertDestinationAccountsMutationVariables>;

/**
 * __useInsertDestinationAccountsMutation__
 *
 * To run a mutation, you first call `useInsertDestinationAccountsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertDestinationAccountsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertDestinationAccountsMutation, { data, loading, error }] = useInsertDestinationAccountsMutation({
 *   variables: {
 *      destination_accounts: // value for 'destination_accounts'
 *   },
 * });
 */
export function useInsertDestinationAccountsMutation(baseOptions?: Apollo.MutationHookOptions<InsertDestinationAccountsMutation, InsertDestinationAccountsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertDestinationAccountsMutation, InsertDestinationAccountsMutationVariables>(InsertDestinationAccountsDocument, options);
      }
export type InsertDestinationAccountsMutationHookResult = ReturnType<typeof useInsertDestinationAccountsMutation>;
export type InsertDestinationAccountsMutationResult = Apollo.MutationResult<InsertDestinationAccountsMutation>;
export type InsertDestinationAccountsMutationOptions = Apollo.BaseMutationOptions<InsertDestinationAccountsMutation, InsertDestinationAccountsMutationVariables>;
export const DeleteDestinationAccountsDocument = gql`
    mutation DeleteDestinationAccounts($where: destination_accounts_bool_exp!) {
  destination_accounts: delete_destination_accounts(where: $where) {
    returning {
      ...AllDestinationAccountFields
    }
  }
}
    ${AllDestinationAccountFieldsFragmentDoc}`;
export type DeleteDestinationAccountsMutationFn = Apollo.MutationFunction<DeleteDestinationAccountsMutation, DeleteDestinationAccountsMutationVariables>;

/**
 * __useDeleteDestinationAccountsMutation__
 *
 * To run a mutation, you first call `useDeleteDestinationAccountsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteDestinationAccountsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteDestinationAccountsMutation, { data, loading, error }] = useDeleteDestinationAccountsMutation({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useDeleteDestinationAccountsMutation(baseOptions?: Apollo.MutationHookOptions<DeleteDestinationAccountsMutation, DeleteDestinationAccountsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteDestinationAccountsMutation, DeleteDestinationAccountsMutationVariables>(DeleteDestinationAccountsDocument, options);
      }
export type DeleteDestinationAccountsMutationHookResult = ReturnType<typeof useDeleteDestinationAccountsMutation>;
export type DeleteDestinationAccountsMutationResult = Apollo.MutationResult<DeleteDestinationAccountsMutation>;
export type DeleteDestinationAccountsMutationOptions = Apollo.BaseMutationOptions<DeleteDestinationAccountsMutation, DeleteDestinationAccountsMutationVariables>;
export const GetDestinationAccountsDocument = gql`
    query GetDestinationAccounts {
  destination_accounts {
    ...AllDestinationAccountFields
  }
}
    ${AllDestinationAccountFieldsFragmentDoc}`;

/**
 * __useGetDestinationAccountsQuery__
 *
 * To run a query within a React component, call `useGetDestinationAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetDestinationAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDestinationAccountsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetDestinationAccountsQuery(baseOptions?: Apollo.QueryHookOptions<GetDestinationAccountsQuery, GetDestinationAccountsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetDestinationAccountsQuery, GetDestinationAccountsQueryVariables>(GetDestinationAccountsDocument, options);
      }
export function useGetDestinationAccountsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetDestinationAccountsQuery, GetDestinationAccountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetDestinationAccountsQuery, GetDestinationAccountsQueryVariables>(GetDestinationAccountsDocument, options);
        }
export type GetDestinationAccountsQueryHookResult = ReturnType<typeof useGetDestinationAccountsQuery>;
export type GetDestinationAccountsLazyQueryHookResult = ReturnType<typeof useGetDestinationAccountsLazyQuery>;
export type GetDestinationAccountsQueryResult = Apollo.QueryResult<GetDestinationAccountsQuery, GetDestinationAccountsQueryVariables>;
export const InsertDestinationDocument = gql`
    mutation InsertDestination($destination: destinations_insert_input!) {
  destination: insert_destinations_one(object: $destination) {
    ...AllFrontendDestinationFields
  }
}
    ${AllFrontendDestinationFieldsFragmentDoc}`;
export type InsertDestinationMutationFn = Apollo.MutationFunction<InsertDestinationMutation, InsertDestinationMutationVariables>;

/**
 * __useInsertDestinationMutation__
 *
 * To run a mutation, you first call `useInsertDestinationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useInsertDestinationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [insertDestinationMutation, { data, loading, error }] = useInsertDestinationMutation({
 *   variables: {
 *      destination: // value for 'destination'
 *   },
 * });
 */
export function useInsertDestinationMutation(baseOptions?: Apollo.MutationHookOptions<InsertDestinationMutation, InsertDestinationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<InsertDestinationMutation, InsertDestinationMutationVariables>(InsertDestinationDocument, options);
      }
export type InsertDestinationMutationHookResult = ReturnType<typeof useInsertDestinationMutation>;
export type InsertDestinationMutationResult = Apollo.MutationResult<InsertDestinationMutation>;
export type InsertDestinationMutationOptions = Apollo.BaseMutationOptions<InsertDestinationMutation, InsertDestinationMutationVariables>;
export const GetDestinationsDocument = gql`
    subscription GetDestinations {
  destinations(
    where: {disabled_at: {_is_null: true}}
    order_by: {created_at: asc}
  ) {
    ...AllFrontendDestinationFields
  }
}
    ${AllFrontendDestinationFieldsFragmentDoc}`;

/**
 * __useGetDestinationsSubscription__
 *
 * To run a query within a React component, call `useGetDestinationsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGetDestinationsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetDestinationsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useGetDestinationsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<GetDestinationsSubscription, GetDestinationsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GetDestinationsSubscription, GetDestinationsSubscriptionVariables>(GetDestinationsDocument, options);
      }
export type GetDestinationsSubscriptionHookResult = ReturnType<typeof useGetDestinationsSubscription>;
export type GetDestinationsSubscriptionResult = Apollo.SubscriptionResult<GetDestinationsSubscription>;
export const UpdateDestinationDocument = gql`
    mutation UpdateDestination($destination_id: uuid!, $_set: destinations_set_input = {}, $_append: destinations_append_input = {}) {
  destination: update_destinations_by_pk(
    pk_columns: {id: $destination_id}
    _set: $_set
    _append: $_append
  ) {
    ...AllFrontendDestinationFields
  }
}
    ${AllFrontendDestinationFieldsFragmentDoc}`;
export type UpdateDestinationMutationFn = Apollo.MutationFunction<UpdateDestinationMutation, UpdateDestinationMutationVariables>;

/**
 * __useUpdateDestinationMutation__
 *
 * To run a mutation, you first call `useUpdateDestinationMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateDestinationMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateDestinationMutation, { data, loading, error }] = useUpdateDestinationMutation({
 *   variables: {
 *      destination_id: // value for 'destination_id'
 *      _set: // value for '_set'
 *      _append: // value for '_append'
 *   },
 * });
 */
export function useUpdateDestinationMutation(baseOptions?: Apollo.MutationHookOptions<UpdateDestinationMutation, UpdateDestinationMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateDestinationMutation, UpdateDestinationMutationVariables>(UpdateDestinationDocument, options);
      }
export type UpdateDestinationMutationHookResult = ReturnType<typeof useUpdateDestinationMutation>;
export type UpdateDestinationMutationResult = Apollo.MutationResult<UpdateDestinationMutation>;
export type UpdateDestinationMutationOptions = Apollo.BaseMutationOptions<UpdateDestinationMutation, UpdateDestinationMutationVariables>;
export const GetIntegrationsDocument = gql`
    query GetIntegrations {
  integrations(order_by: {name: asc}) {
    ...AllFrontendIntegrationFields
  }
}
    ${AllFrontendIntegrationFieldsFragmentDoc}`;

/**
 * __useGetIntegrationsQuery__
 *
 * To run a query within a React component, call `useGetIntegrationsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetIntegrationsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetIntegrationsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetIntegrationsQuery(baseOptions?: Apollo.QueryHookOptions<GetIntegrationsQuery, GetIntegrationsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetIntegrationsQuery, GetIntegrationsQueryVariables>(GetIntegrationsDocument, options);
      }
export function useGetIntegrationsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetIntegrationsQuery, GetIntegrationsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetIntegrationsQuery, GetIntegrationsQueryVariables>(GetIntegrationsDocument, options);
        }
export type GetIntegrationsQueryHookResult = ReturnType<typeof useGetIntegrationsQuery>;
export type GetIntegrationsLazyQueryHookResult = ReturnType<typeof useGetIntegrationsLazyQuery>;
export type GetIntegrationsQueryResult = Apollo.QueryResult<GetIntegrationsQuery, GetIntegrationsQueryVariables>;
export const DeletePlaidAccountsDocument = gql`
    mutation DeletePlaidAccounts($where: plaidAccounts_bool_exp!) {
  deletePlaidAccounts(where: $where) {
    returning {
      ...AllFrontendPlaidAccountFields
    }
  }
}
    ${AllFrontendPlaidAccountFieldsFragmentDoc}`;
export type DeletePlaidAccountsMutationFn = Apollo.MutationFunction<DeletePlaidAccountsMutation, DeletePlaidAccountsMutationVariables>;

/**
 * __useDeletePlaidAccountsMutation__
 *
 * To run a mutation, you first call `useDeletePlaidAccountsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeletePlaidAccountsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deletePlaidAccountsMutation, { data, loading, error }] = useDeletePlaidAccountsMutation({
 *   variables: {
 *      where: // value for 'where'
 *   },
 * });
 */
export function useDeletePlaidAccountsMutation(baseOptions?: Apollo.MutationHookOptions<DeletePlaidAccountsMutation, DeletePlaidAccountsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeletePlaidAccountsMutation, DeletePlaidAccountsMutationVariables>(DeletePlaidAccountsDocument, options);
      }
export type DeletePlaidAccountsMutationHookResult = ReturnType<typeof useDeletePlaidAccountsMutation>;
export type DeletePlaidAccountsMutationResult = Apollo.MutationResult<DeletePlaidAccountsMutation>;
export type DeletePlaidAccountsMutationOptions = Apollo.BaseMutationOptions<DeletePlaidAccountsMutation, DeletePlaidAccountsMutationVariables>;
export const UpdatePlaidAccountDocument = gql`
    mutation UpdatePlaidAccount($plaidAccountId: String!, $_set: plaidAccounts_set_input!) {
  plaidAccount: updatePlaidAccount(pk_columns: {id: $plaidAccountId}, _set: $_set) {
    ...AllFrontendPlaidAccountFields
  }
}
    ${AllFrontendPlaidAccountFieldsFragmentDoc}`;
export type UpdatePlaidAccountMutationFn = Apollo.MutationFunction<UpdatePlaidAccountMutation, UpdatePlaidAccountMutationVariables>;

/**
 * __useUpdatePlaidAccountMutation__
 *
 * To run a mutation, you first call `useUpdatePlaidAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdatePlaidAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updatePlaidAccountMutation, { data, loading, error }] = useUpdatePlaidAccountMutation({
 *   variables: {
 *      plaidAccountId: // value for 'plaidAccountId'
 *      _set: // value for '_set'
 *   },
 * });
 */
export function useUpdatePlaidAccountMutation(baseOptions?: Apollo.MutationHookOptions<UpdatePlaidAccountMutation, UpdatePlaidAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdatePlaidAccountMutation, UpdatePlaidAccountMutationVariables>(UpdatePlaidAccountDocument, options);
      }
export type UpdatePlaidAccountMutationHookResult = ReturnType<typeof useUpdatePlaidAccountMutation>;
export type UpdatePlaidAccountMutationResult = Apollo.MutationResult<UpdatePlaidAccountMutation>;
export type UpdatePlaidAccountMutationOptions = Apollo.BaseMutationOptions<UpdatePlaidAccountMutation, UpdatePlaidAccountMutationVariables>;
export const GetPlaidAccountsDocument = gql`
    query GetPlaidAccounts {
  plaidAccounts(where: {item: {disabled_at: {_is_null: true}}}) {
    id
    name
    mask
    item {
      institution {
        name
      }
    }
  }
}
    `;

/**
 * __useGetPlaidAccountsQuery__
 *
 * To run a query within a React component, call `useGetPlaidAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetPlaidAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlaidAccountsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetPlaidAccountsQuery(baseOptions?: Apollo.QueryHookOptions<GetPlaidAccountsQuery, GetPlaidAccountsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetPlaidAccountsQuery, GetPlaidAccountsQueryVariables>(GetPlaidAccountsDocument, options);
      }
export function useGetPlaidAccountsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetPlaidAccountsQuery, GetPlaidAccountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetPlaidAccountsQuery, GetPlaidAccountsQueryVariables>(GetPlaidAccountsDocument, options);
        }
export type GetPlaidAccountsQueryHookResult = ReturnType<typeof useGetPlaidAccountsQuery>;
export type GetPlaidAccountsLazyQueryHookResult = ReturnType<typeof useGetPlaidAccountsLazyQuery>;
export type GetPlaidAccountsQueryResult = Apollo.QueryResult<GetPlaidAccountsQuery, GetPlaidAccountsQueryVariables>;
export const GetPlaidItemsDocument = gql`
    subscription GetPlaidItems {
  plaidItems(order_by: {created_at: asc}) {
    ...AllFrontendPlaidItemFields
  }
}
    ${AllFrontendPlaidItemFieldsFragmentDoc}`;

/**
 * __useGetPlaidItemsSubscription__
 *
 * To run a query within a React component, call `useGetPlaidItemsSubscription` and pass it any options that fit your needs.
 * When your component renders, `useGetPlaidItemsSubscription` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the subscription, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetPlaidItemsSubscription({
 *   variables: {
 *   },
 * });
 */
export function useGetPlaidItemsSubscription(baseOptions?: Apollo.SubscriptionHookOptions<GetPlaidItemsSubscription, GetPlaidItemsSubscriptionVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useSubscription<GetPlaidItemsSubscription, GetPlaidItemsSubscriptionVariables>(GetPlaidItemsDocument, options);
      }
export type GetPlaidItemsSubscriptionHookResult = ReturnType<typeof useGetPlaidItemsSubscription>;
export type GetPlaidItemsSubscriptionResult = Apollo.SubscriptionResult<GetPlaidItemsSubscription>;
export const UpsertPlaidItemDocument = gql`
    mutation UpsertPlaidItem($plaidItem: plaid_items_insert_input!) {
  plaidItem: insertPlaidItem(
    object: $plaidItem
    on_conflict: {constraint: plaid_items_pkey, update_columns: [error, consentExpiresAt]}
  ) {
    ...AllFrontendPlaidItemFields
  }
}
    ${AllFrontendPlaidItemFieldsFragmentDoc}`;
export type UpsertPlaidItemMutationFn = Apollo.MutationFunction<UpsertPlaidItemMutation, UpsertPlaidItemMutationVariables>;

/**
 * __useUpsertPlaidItemMutation__
 *
 * To run a mutation, you first call `useUpsertPlaidItemMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpsertPlaidItemMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [upsertPlaidItemMutation, { data, loading, error }] = useUpsertPlaidItemMutation({
 *   variables: {
 *      plaidItem: // value for 'plaidItem'
 *   },
 * });
 */
export function useUpsertPlaidItemMutation(baseOptions?: Apollo.MutationHookOptions<UpsertPlaidItemMutation, UpsertPlaidItemMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpsertPlaidItemMutation, UpsertPlaidItemMutationVariables>(UpsertPlaidItemDocument, options);
      }
export type UpsertPlaidItemMutationHookResult = ReturnType<typeof useUpsertPlaidItemMutation>;
export type UpsertPlaidItemMutationResult = Apollo.MutationResult<UpsertPlaidItemMutation>;
export type UpsertPlaidItemMutationOptions = Apollo.BaseMutationOptions<UpsertPlaidItemMutation, UpsertPlaidItemMutationVariables>;
export const GetStripePricesDocument = gql`
    query GetStripePrices {
  stripePrices {
    id
    interval
    unitAmount
    productId
  }
}
    `;

/**
 * __useGetStripePricesQuery__
 *
 * To run a query within a React component, call `useGetStripePricesQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetStripePricesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetStripePricesQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetStripePricesQuery(baseOptions?: Apollo.QueryHookOptions<GetStripePricesQuery, GetStripePricesQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetStripePricesQuery, GetStripePricesQueryVariables>(GetStripePricesDocument, options);
      }
export function useGetStripePricesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetStripePricesQuery, GetStripePricesQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetStripePricesQuery, GetStripePricesQueryVariables>(GetStripePricesDocument, options);
        }
export type GetStripePricesQueryHookResult = ReturnType<typeof useGetStripePricesQuery>;
export type GetStripePricesLazyQueryHookResult = ReturnType<typeof useGetStripePricesLazyQuery>;
export type GetStripePricesQueryResult = Apollo.QueryResult<GetStripePricesQuery, GetStripePricesQueryVariables>;
export const UpdateUserDocument = gql`
    mutation UpdateUser($id: uuid!, $_set: users_set_input = {}, $_delete_key: users_delete_key_input = {}) {
  user: updateUser(pk_columns: {id: $id}, _set: $_set, _delete_key: $_delete_key) {
    ...AllFrontendUserFields
  }
}
    ${AllFrontendUserFieldsFragmentDoc}`;
export type UpdateUserMutationFn = Apollo.MutationFunction<UpdateUserMutation, UpdateUserMutationVariables>;

/**
 * __useUpdateUserMutation__
 *
 * To run a mutation, you first call `useUpdateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserMutation, { data, loading, error }] = useUpdateUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *      _set: // value for '_set'
 *      _delete_key: // value for '_delete_key'
 *   },
 * });
 */
export function useUpdateUserMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserMutation, UpdateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserMutation, UpdateUserMutationVariables>(UpdateUserDocument, options);
      }
export type UpdateUserMutationHookResult = ReturnType<typeof useUpdateUserMutation>;
export type UpdateUserMutationResult = Apollo.MutationResult<UpdateUserMutation>;
export type UpdateUserMutationOptions = Apollo.BaseMutationOptions<UpdateUserMutation, UpdateUserMutationVariables>;
export const GetUserProfileDocument = gql`
    query GetUserProfile($userId: uuid!) {
  userProfile(userId: $userId) {
    ...AllFrontendUserProfileFields
  }
}
    ${AllFrontendUserProfileFieldsFragmentDoc}`;

/**
 * __useGetUserProfileQuery__
 *
 * To run a query within a React component, call `useGetUserProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserProfileQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserProfileQuery(baseOptions: Apollo.QueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(GetUserProfileDocument, options);
      }
export function useGetUserProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserProfileQuery, GetUserProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserProfileQuery, GetUserProfileQueryVariables>(GetUserProfileDocument, options);
        }
export type GetUserProfileQueryHookResult = ReturnType<typeof useGetUserProfileQuery>;
export type GetUserProfileLazyQueryHookResult = ReturnType<typeof useGetUserProfileLazyQuery>;
export type GetUserProfileQueryResult = Apollo.QueryResult<GetUserProfileQuery, GetUserProfileQueryVariables>;
export const GetUserDocument = gql`
    query GetUser($userId: uuid!) {
  user(id: $userId) {
    ...AllFrontendUserFields
  }
}
    ${AllFrontendUserFieldsFragmentDoc}`;

/**
 * __useGetUserQuery__
 *
 * To run a query within a React component, call `useGetUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserQuery(baseOptions: Apollo.QueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
      }
export function useGetUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserQuery, GetUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserQuery, GetUserQueryVariables>(GetUserDocument, options);
        }
export type GetUserQueryHookResult = ReturnType<typeof useGetUserQuery>;
export type GetUserLazyQueryHookResult = ReturnType<typeof useGetUserLazyQuery>;
export type GetUserQueryResult = Apollo.QueryResult<GetUserQuery, GetUserQueryVariables>;
export const UpdateUserProfileDocument = gql`
    mutation UpdateUserProfile($userId: uuid!, $_set: userProfiles_set_input!) {
  updateUserProfile(pk_columns: {userId: $userId}, _set: $_set) {
    ...AllFrontendUserProfileFields
  }
}
    ${AllFrontendUserProfileFieldsFragmentDoc}`;
export type UpdateUserProfileMutationFn = Apollo.MutationFunction<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;

/**
 * __useUpdateUserProfileMutation__
 *
 * To run a mutation, you first call `useUpdateUserProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateUserProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateUserProfileMutation, { data, loading, error }] = useUpdateUserProfileMutation({
 *   variables: {
 *      userId: // value for 'userId'
 *      _set: // value for '_set'
 *   },
 * });
 */
export function useUpdateUserProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>(UpdateUserProfileDocument, options);
      }
export type UpdateUserProfileMutationHookResult = ReturnType<typeof useUpdateUserProfileMutation>;
export type UpdateUserProfileMutationResult = Apollo.MutationResult<UpdateUserProfileMutation>;
export type UpdateUserProfileMutationOptions = Apollo.BaseMutationOptions<UpdateUserProfileMutation, UpdateUserProfileMutationVariables>;