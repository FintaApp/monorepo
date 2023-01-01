import { useMemo } from "react";
import { Fade, VStack } from "@chakra-ui/react";

import { EmptyState } from "~/components/Common/EmptyState";
import { AnalyticsPage } from "~/utils/frontend/analytics";
import { useGetPlaidItemsSubscription } from "~/graphql/frontend";
import { PageHeader } from "~/components/Layout/PageHeader";
import { AddBankAccount, Institution } from "~/components/Accounts";
import { authGate } from "~/lib/authGate";
import { useUser } from "~/lib/context/useUser";

const Accounts = () => {
  const { isAuthenticated } = useUser();
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

export const getServerSideProps = authGate(async context => {
  return { props: { showNavigation: true, isProtectedRoute: true }}
}, true)

Accounts.analyticsPageName = AnalyticsPage.ACCOUNTS
export default Accounts;