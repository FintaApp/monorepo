export enum AnalyticsEvent {
  PLAID_PORTAL_OPENED = "Plaid Portal Opened",
  PLAID_PORTAL_CLOSED = "Plaid Portal Closed"
};

export enum AnalyticsPage {
  ACCOUNTS = 'Accounts',
  AIRTABLE_AUTHORIZE = 'Airtable Authorize',
  DESTINATIONS = 'Destinations',
  LOG_IN = 'Log In',
  LOGS = 'Logs',
  NOTION_AUTHORIZE = 'Notion Authorize',
  OAUTH_AUTHORIZE = 'Oauth Authorize',
  PLAID_OAUTH = "Plaid OAuth",
  SETTINGS = 'Settings',
  SIGN_UP = 'Sign Up'
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