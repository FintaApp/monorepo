import { 
  Card,
  CardBody,
  Center
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { AccessDenied, Success } from "~/components/Oauth";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { AnalyticsPage } from "~/utils/frontend/analytics";
import { authGate } from "~/lib/authGate";
import { trpc } from "~/lib/trpc";
import { useUser } from "~/lib/context/useUser";

const NotionAuthorize = () => {
  const router = useRouter();
  const { user } = useUser();
  const [ screen, setScreen ] = useState('');
  const { mutateAsync: exchangeNotionToken, isLoading } = trpc.destinations.exchangeNotionToken.useMutation();

  const { code, error } = router.query;

  useEffect(() => { if ( error ) { setScreen(error as string) }}, [ error ]);


  useEffect(() => {
    console.log(code, user, screen)
    if ( code && user && !screen && typeof window !== 'undefined' ) {
      exchangeNotionToken({ code: code as string, originUrl: window.location.origin})
        .then(() => { setScreen('success')})
    }
  }, [ code, screen, user ]);

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