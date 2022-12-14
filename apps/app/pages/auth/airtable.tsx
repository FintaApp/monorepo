import {
  useQuery,
} from 'react-query'
import { 
  Card,
  CardBody,
  Center
} from "@chakra-ui/react";
import { getNhostSession } from "@nhost/nextjs";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useState } from "react";

import { exchangeAirtableToken } from "~/utils/frontend/functions";
import { AccessDenied, Success } from "~/components/Oauth";
import { LoadingSpinner } from "~/components/LoadingSpinner";
import { AnalyticsPage } from "~/utils/frontend/analytics";
import { useAuth } from "~/utils/frontend/useAuth";

const AirtableAuthorize = () => {
  const router = useRouter();
  const { user } = useAuth();
  const [ screen, setScreen ] = useState('');
  const { code, error, state } = router.query;

  const { isLoading } = useQuery('exchangeAirtableToken', () => exchangeAirtableToken({
    code: code as string,
    redirectUri: `${window.location.origin}/auth/airtable`,
    state: state as string
  }).then(() => setScreen('success')), { enabled: !error && typeof window !== 'undefined' && !!user})

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

AirtableAuthorize.analyticsPageName = AnalyticsPage.AIRTABLE_AUTHORIZE
export default AirtableAuthorize;