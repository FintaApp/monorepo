import { useMemo } from "react";
import { getNhostSession } from "@nhost/nextjs";
import { GetServerSideProps } from "next";
import { Fade, VStack } from "@chakra-ui/react";

import { EmptyState } from "~/components/EmptyState";
import { AnalyticsPage } from "~/utils/frontend/analytics";
import { useGetPlaidItemsSubscription } from "~/graphql/frontend";
import { useAuth } from "~/utils/frontend/useAuth";
import { PageHeader } from "~/components/Layout/PageHeader";
import { AddBankAccount, Institution } from "~/components/Accounts";

const Accounts = () => {
  const { isAuthenticated } = useAuth();
  const { data } = useGetPlaidItemsSubscription({ skip: !isAuthenticated });
  const plaidItems = useMemo(() => data?.plaidItems.filter(item => !item.disabled_at), [ data ]);

  return (
    <>
      <PageHeader title = "Accounts"><AddBankAccount /></PageHeader>

      <Fade in = { isAuthenticated && !!plaidItems }>
        { 
          plaidItems?.length === 0 
          ? <EmptyState 
              title = "No Accounts"
              icon = "/icons/bank.svg"
              callToAction = "Click the button above to connect your first account."
            />
          : <VStack spacing = "6" mb = "10">
              { plaidItems?.map(plaidItem => <Institution key = { plaidItem.id } plaidItem = { plaidItem } /> )}
            </VStack>
        }
      </Fade>
    </>
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
      showNavigation: true
    }
  }
}

Accounts.analyticsPageName = AnalyticsPage.ACCOUNTS
export default Accounts;