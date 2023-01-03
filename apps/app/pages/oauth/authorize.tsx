import { useRouter } from "next/router";

import { AnalyticsPage } from "~/lib/analytics";
import { AddDestination, HasInactiveSubscription } from "~/components/OAuthAuthorize";
import { authGate } from "~/lib/authGate";
import { DestinationProvider } from "~/components/Destinations/context";
import { Integration } from "@prisma/client";
import { useUser } from "~/lib/context/useUser";

const OauthAuthorize = () => {
  const router = useRouter();
  const { user, hasAppAccess } = useUser();

  const { state } = router.query;

  if ( !user ) { return <></> }

  return hasAppAccess
    ? <DestinationProvider isSetupMode = { true } integration = { Integration.Coda }><AddDestination state = { state } /></DestinationProvider>
    : < HasInactiveSubscription isOpen = { !hasAppAccess } />
}

export const getServerSideProps = authGate(async context => {
  return { props: { showNavigation: true, isProtectedRoute: true }}
}, true)

OauthAuthorize.analyticsPageName = AnalyticsPage.OAUTH_AUTHORIZE
export default OauthAuthorize;