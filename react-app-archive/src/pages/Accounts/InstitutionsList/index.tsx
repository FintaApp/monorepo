import { useEffect, useMemo } from "react";
import {
  VStack
} from "@chakra-ui/react";

import { Institution } from "./Institution";
import { Card } from "src/components/Card";
import { EmptyState } from "src/components/EmptyState";
import bankIcon from "src/images/icons/bank.svg";
import { useGetPlaidItemsQuery } from "src/graphql";

export const InstitutionsList = () => {
  const { data, startPolling, stopPolling, previousData } = useGetPlaidItemsQuery();
  const plaidItems = useMemo(() => data?.plaidItems || [], [ data ]);
  const activeItems = plaidItems.filter(item => !item.disabled_at);

  useEffect(() => {
    const previousPlaidItems = previousData?.plaidItems || [];

    const currentLoadingItemsCount = plaidItems.filter(item => !item.synced_at).length;
    const previousLoadingItemsCount = previousPlaidItems.filter(item => !item.synced_at).length;

    if (previousLoadingItemsCount > 0 && currentLoadingItemsCount === 0 ) {
      stopPolling();
    } else if ( previousLoadingItemsCount === 0 && currentLoadingItemsCount > 0 ) {
      startPolling(5000)
    }
  }, [ plaidItems, previousData, startPolling, stopPolling ]);

  return activeItems.length > 0 ? (
    <VStack spacing = "6">
      { [ ...activeItems]
        .filter(item => !item.disabled_at)
        .sort((pi1, pi2) => pi1.created_at > pi2.created_at ? 1 : -1)
        .map(plaidItem => <Institution key = { plaidItem.id } plaidItem = { plaidItem } /> )
      }
    </VStack>
  ) : (
    <Card width = "full">
      <EmptyState 
        title = "No accounts"
        icon = { bankIcon }
        callToAction = "Click the button above to connect your first account."
      />
    </Card>
  )
}