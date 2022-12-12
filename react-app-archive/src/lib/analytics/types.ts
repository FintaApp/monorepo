import { Integrations_Enum } from "src/graphql";

export interface EventProperties {
  field?: string;
  error?: string;
  integration?: Integrations_Enum;
  is_linked?: boolean;
  provider?: string;
  has_error?: boolean;
  link_method?: string;
  count?: number;
}

export interface PageProperties {

}

export interface AliasParams {
  userId: string;
}

export interface IdentifyParams {
  userId: string;
  traits?: UserTraits;
}

export interface PageParams {
  name: string;
  properties?: PageProperties
}

export interface TrackParams {
  event: string;
  properties?: EventProperties;
}

export interface UserTraits {

}

export enum EventNames {
  USER_UPDATED = 'User Updated',
  USER_LOGGED_IN = 'User Logged In',
  USER_LOGGED_OUT = 'User Logged Out',
  USER_SIGNED_UP = 'User Signed Up',
  PASSWORD_CHANGED = 'Password Changed',
  ERROR_TRIGGERED = 'Error Triggered',
  DESTINATION_UPDATED = 'Destination Updated',
  ACCOUNT_UPDATED = 'Account Updated',
  ACCOUNT_VISIBILITY_TOGGLED = 'Account Visibility Toggled',
  NEW_ACCOUNTS_CONNECTED = 'New Accounts Connected'
}

export enum PageNames {
  ACCOUNTS = 'Accounts',
  DESTINATIONS = 'Destinations',
  LOG_IN = 'Login',
  SIGN_UP = 'Sign Up',
  SETTINGS = 'Settings',
  INTEGRATION_OAUTH_CONNECTION = 'Integration OAuth Connection',
  SYNC_LOGS = 'Sync Logs'
}