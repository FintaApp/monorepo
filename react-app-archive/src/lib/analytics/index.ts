import { AliasParams, IdentifyParams, PageParams, TrackParams, EventNames, PageNames } from "./types";

export { EventNames, PageNames }

declare global {
  // tslint:disable-next-line:interface-name
  interface Window {
    analytics: any;
  }
}

export const alias = (params: AliasParams) => {
  const { userId } = params;
  if ( typeof window === 'undefined' ) { return; };
  window.analytics?.alias(userId);
}

export const identify = (params: IdentifyParams) => {
  const { userId, traits } = params;
  if ( typeof window === 'undefined' ) { return; };
  window.analytics?.identify(userId, traits);
}

export const page = (params: PageParams) => {
  const { name, properties } = params;
  if ( typeof window === 'undefined' ) { return; };
  window.analytics?.page(name, properties);
}

export const track = (params: TrackParams) => {
  const { event, properties } = params;
  if ( typeof window === 'undefined' ) { return; };
  window.analytics?.track(event, properties);
}

export const reset = () =>{
  if ( typeof window === 'undefined' ) { return;}
  window.analytics.reset();
}