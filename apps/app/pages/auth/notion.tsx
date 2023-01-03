import { 
  Card,
  CardBody,
  Center
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import { AccessDenied, Success } from "~/components/Oauth";
import { LoadingSpinner } from "~/components/Common/LoadingSpinner";
import { AnalyticsPage } from "~/lib/analytics";
import { authGate } from "~/lib/authGate";
import { trpc } from "~/lib/trpc";
import { useUser } from "~/lib/context/useUser";

const NotionAuthorize = () => {
  const router = useRouter();
  const { user } = useUser();
  const [ screen, setScreen ] = useState('');
  const { code, error } = router.query;

  const { isLoading } = trpc.notion.exchangeToken.useQuery(
    { code: code as string, originUrl: (typeof window !== 'undefined' && window.location.origin ) || ""},
    { onSuccess: () => setScreen('success'), enabled: !error && typeof window !== 'undefined' && !!user }
  );

  return (
    <Center w = "full" maxW = "xl" mx = "auto" flexDir = "column" mt = {{ base: 10, sm: 20, md: 32 }} px = {{ base: 8, md: 'unset' }}>
      <Card shadow = "sm" width = "full" px = { 8 } py = { 8 }>
        <CardBody>
          { error === 'access_denied' && <AccessDenied integrationName = "Notion" /> }
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