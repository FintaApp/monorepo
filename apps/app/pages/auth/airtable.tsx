import { 
  Card,
  CardBody,
  Center
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState } from "react";

import { AccessDenied, Success } from "~/components/Oauth";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { AnalyticsPage } from "~/utils/frontend/analytics";
import { authGate } from '~/lib/authGate';
import { useUser } from '~/lib/context/useUser';
import { trpc } from '~/lib/trpc';

const AirtableAuthorize = () => {
  const router = useRouter();
  const { user } = useUser();
  const [ screen, setScreen ] = useState('');
  const { code, error, state } = router.query;

  const { isLoading } = trpc.destinations.exchangeAirtableToken.useQuery(
    { code: code as string, state: state as string, originUrl: (typeof window !== 'undefined' && window.location.origin ) || ""}, 
    { onSuccess: () => setScreen('success'), enabled: !error && typeof window !== 'undefined' && !!user }
  );

  return (
    <Center w = "full" maxW = "xl" mx = "auto" flexDir = "column" mt = {{ base: 10, sm: 20, md: 32 }} px = {{ base: 8, md: 'unset' }}>
      <Card shadow = "sm" width = "full" px = { 8 } py = { 8 }>
        <CardBody>
          { error === 'access_denied' && <AccessDenied integrationName = "Airtable" /> }
          { screen === 'success' && <Success integrationName = "Airtable" /> }
          { isLoading &&  <LoadingSpinner /> }
        </CardBody>
      </Card>
    </Center>
  )
}

export const getServerSideProps = authGate(async context => {
  return { props: { showNavigation: false, isProtectedRoute: true }}
}, true)

AirtableAuthorize.analyticsPageName = AnalyticsPage.AIRTABLE_AUTHORIZE
export default AirtableAuthorize;