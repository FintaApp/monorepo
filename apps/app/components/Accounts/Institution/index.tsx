import { useMemo } from "react";
import {
  Card,
  CardBody,
  CardHeader,
  HStack,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Skeleton
} from "@chakra-ui/react";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";

import { PlaidItemContextType, PlaidItemContext } from "./context";
import { trpc } from "~/lib/trpc";
import { PlaidItemHeader } from "./PlaidItemHeader";
import { FixConnection } from "./FixConnection";
import { AddNewAccounts } from "./AddNewAccounts";
import { RemovePlaidItem } from "./RemovePlaidItem";
import { LastSync } from "./LastSync";
import { Accounts } from "./Accounts";


export const Institution = ({ id }: { id: string; }) => {
  const { data: plaidItem, refetch, isLoading } = trpc.plaid.getPlaidItem.useQuery({ id });
  
  const memoedValue = useMemo(
    () => ({
      plaidItem,
      refetch
    } as PlaidItemContextType), [ plaidItem, refetch ]
  )

  return (
    <Card size = "md" width = "full">
      {
        isLoading
          ? <Skeleton height = "20" />
          : <PlaidItemContext.Provider value = { memoedValue }>
              <CardHeader>
                <HStack justifyContent = "space-between">
                  <PlaidItemHeader />
                  <HStack>
                    <FixConnection />
                    <Menu>
                      <MenuButton
                        as = { IconButton }
                        aria-label = "Bank account options"
                        icon = { <DotsHorizontalIcon /> }
                        variant = "icon"
                      />
                      <MenuList>
                        <AddNewAccounts />
                        <RemovePlaidItem />
                      </MenuList>
                    </Menu>
                  </HStack>
                </HStack>
              </CardHeader>

              <CardBody>
                <LastSync />
                <Accounts />
              </CardBody>
            </PlaidItemContext.Provider>
      }
    </Card>
  )
}