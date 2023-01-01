import { 
  Card,
  CardBody,
  Center
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { exchangeNotionToken } from "~/utils/frontend/functions";
import { AccessDenied, Success } from "~/components/Oauth";
import { LoadingSpinner } from "~/components/Common/LoadingSpinner";
import { AnalyticsPage } from "~/utils/frontend/analytics";
import { authGate } from "~/lib/authGate";
import { useUser } from "~/lib/context/useUser";

const NotionAuthorize = () => {
  const router = useRouter();
  const { user } = useUser();
  const [ screen, setScreen ] = useState('');
  const [ isLoading, setIsLoading ] = useState(true);

  const { code, error } = router.query;

  const fetchRefreshToken = useCallback(async (code: string) => {
    if ( typeof window === 'undefined' ) { return; }
    return exchangeNotionToken({ code, redirectUri: `${window.location.origin}/auth/notion` })
    .then(() => { setScreen('success'); setIsLoading(false) })
  }, [ user ]);

  useEffect(() => { if ( error ) { setScreen(error as string) }}, [ error ]);


  useEffect(() => {
    if ( code && user && !screen ) {
      setIsLoading(true)
      fetchRefreshToken(code as string)
    }
  }, [ code, screen, user, fetchRefreshToken ]);

  return (
    <Center w = "full" maxW = "xl" mx = "auto" flexDir = "column" mt = {{ base: 10, sm: 20, md: 32 }} px = {{ base: 8, md: 'unset' }}>
      <Card shadow = "sm" width = "full" px = { 8 } py = { 8 }>
        <CardBody>
          { screen === 'access_denied' && <AccessDenied integrationName = "Notion" /> }
          { screen === 'success' && <Success integrationName = "Notion" /> }
          { isLoading &&  <LoadingSpinner /> }
        </CardBody>
      </Card>
    </Center>
  )
}

export const getServerSideProps = authGate(async context => {
  return { props: { showNavigation: false, isProtectedRoute: true }}
}, true)

NotionAuthorize.analyticsPageName = AnalyticsPage.NOTION_AUTHORIZE
export default NotionAuthorize;