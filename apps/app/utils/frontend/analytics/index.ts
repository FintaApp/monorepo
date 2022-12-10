import { AnalyticsBrowser } from '@segment/analytics-next';

import { EventNames, AnalyticsPage, AliasParams, IdentifyParams, PageParams, TrackParams } from "./types";

const analytics = AnalyticsBrowser.load({ writeKey: process.env.NEXT_PUBLIC_SEGMENT_KEY });

export { EventNames, AnalyticsPage }

export const alias = (params: AliasParams) => {
  const { userId } = params;
  if ( typeof global === 'undefined' ) { return; };
  analytics.alias(userId);
}

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