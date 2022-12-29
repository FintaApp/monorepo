import { AnalyticsBrowser } from '@segment/analytics-next';

import { AnalyticsEvent, AnalyticsPage, IdentifyParams, PageParams, TrackParams } from "./types";

const analytics = AnalyticsBrowser.load({ writeKey: process.env.NEXT_PUBLIC_SEGMENT_KEY! });

export { AnalyticsEvent as EventNames, AnalyticsPage }

export const identify = (params: IdentifyParams) => {
  const { userId, traits } = params;
  if ( typeof global === 'undefined' ) { return; };
  analytics.identify(userId, traits);
}

export const page = (params: PageParams) => {
  const { name, properties } = params;
  if ( typeof global === 'undefined' ) { return; };
  analytics.page(name, properties);
}

export const track = (params: TrackParams) => {
  const { event, properties } = params;
  if ( typeof global === 'undefined' ) { return; };
  analytics.track(event, properties);
}

export const reset = () =>{
  if ( typeof global === 'undefined' ) { return;}
  analytics.reset();
}

export const trackPasswordChanged = () =>
  track({ event: AnalyticsEvent.PASSWORD_CHANGED })