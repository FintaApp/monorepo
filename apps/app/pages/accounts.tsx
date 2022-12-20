import { Fade, VStack } from "@chakra-ui/react";

import { EmptyState } from "~/components/EmptyState";

import { PageHeader } from "~/components/Layout/PageHeader";
import { AddBankAccount, Institution } from "~/components/Accounts";

import { AnalyticsPage } from "~/lib/analytics";
import { authGate } from "~/lib/authGate";
import { trpc } from "~/lib/trpc";
import { useUser } from "~/lib/context/useUser";
import { useMemo } from "react";

const Accounts = () => {
  const { isAuthenticated } = useUser();
  const { data, isLoading, refetch } = trpc.plaid.getAllPlaidItems.useQuery(undefined, { enabled: isAuthenticated });
  const plaidItemIds = useMemo(() => data?.map(d => d.id), [ data ]);
  
  return (
    <>
      <PageHeader title = "Accounts"><AddBankAccount refetchPlaidItems = { refetch } /></PageHeader>
      <Fade in = { !isLoading }>
        {
          plaidItemIds?.length === 0
            ? <EmptyState
                title = "No Accounts"
                icon = "/icons/bank.svg"
                callToAction = "Click the button above to connect your first account."
              />
            : <VStack spacing = "6" mb = "10">
                { plaidItemIds?.map(id => <Institution key = { id } id = { id } onRemove = { refetch } /> )}
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