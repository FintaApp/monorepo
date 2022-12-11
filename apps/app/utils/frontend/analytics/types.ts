export enum AnalyticsEvent {
  ADD_INSTITUTION_PORTAL_OPENED = "Add Institution Portal Opened",
  ADD_INSTITUTION_PORTAL_CLOSED = "Add Institution Portal Closed",
  PASSWORD_CHANGED = "Password Changed"
};

export enum AnalyticsPage {
  ACCOUNTS = 'Accounts',
  DESTINATIONS = 'Destinations',
  LOG_IN = 'Log In',
  LOGS = 'Logs',
  NOTION_AUTHORIZE = 'Notion Authorize',
  OAUTH_AUTHORIZE = 'Oauth Authorize',
  PLAID_OAUTH = "Plaid OAuth",
  SETTINGS = 'Settings',
  SIGN_UP = 'Sign Up'
}

export interface AliasParams {
  userId: string;
}

export interface IdentifyParams {
  userId: string;
  traits?: UserTraits;
}

export interface PageParams {
  name: AnalyticsPage;
  properties?: PageProperties
}

export interface TrackParams {
  event: string;
  properties?: EventProperties;
}

export interface UserTraits {

}

export interface EventProperties {
  
}

export interface PageProperties {

}