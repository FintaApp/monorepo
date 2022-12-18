import { Analytics } from "@segment/analytics-node";

const analytics = new Analytics({ writeKey: "SEGMENT_KEY", flushInterval: 3000 });

export const trackUserSignedIn = ({ userId, provider }: { userId: string; provider?: string }) => 
  analytics.track({
    userId,
    event: Event.USER_SIGNED_IN,
    properties: { provider }
  })

export const trackUserSignedUp = ({ userId, provider }: { userId: string; provider?: string }) =>
  analytics.track({
    userId,
    event: Event.USER_SIGNED_UP,
    properties: { provider }
  })

export const trackUserSignedOut = ({ userId }: { userId: string }) =>
  analytics.track({ 
    userId,
    event: Event.USER_SIGNED_OUT
  })

// Types
enum Event {
  USER_SIGNED_IN = "User Signed In",
  USER_SIGNED_OUT = "User Signed Out",
  USER_SIGNED_UP = "User Signed Up"
}

export enum AnalyticsPage {
  LOG_IN = 'Log In',
  SIGN_UP = 'Sign Up'
}
