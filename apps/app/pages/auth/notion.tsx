import { 
  Card,
  CardBody,
  Center
} from "@chakra-ui/react";
import { getNhostSession } from "@nhost/nextjs";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";

import { exchangeNotionToken } from "~/utils/frontend/functions";
import { AccessDenied, Success } from "~/components/NotionAuth";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { AnalyticsPage } from "~/utils/frontend/analytics";
import { useAuth } from "~/utils/frontend/useAuth";

const NotionAuthorize = () => {
  const router = useRouter();
  const { user } = useAuth();
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
          { screen === 'access_denied' && <AccessDenied /> }
          { screen === 'success' && <Success /> }
          { isLoading &&  <LoadingSpinner /> }
        </CardBody>
      </Card>
    </Center>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const nhostSession = await getNhostSession(process.env.NHOST_BACKEND_URL || "", context);

  if ( !nhostSession ) {
    return {
      props: {

      },
      redirect: {
        destination: `/login?next=${context.resolvedUrl}`,
        permanent: false
      }
    }
  }
  
  return {
    props: {
      showNavigation: false
    }
  }
}

NotionAuthorize.analyticsPageName = AnalyticsPage.NOTION_AUTHORIZE
export default NotionAuthorize;