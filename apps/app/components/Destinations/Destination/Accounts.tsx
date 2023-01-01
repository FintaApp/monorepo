import {
  Button,
  ButtonGroup,
  Switch,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@chakra-ui/react";
import * as _ from "lodash";
import { ReactNode } from "react";

import { FieldGroup } from "~/components/Common/FieldGroup";
import { useDestination } from "../context"
import { EmptyState } from "~/components/Common/EmptyState";
import { AccordionItem } from "~/components/Common/AccordionItem";

const Wrapper = ({ isSetupMode, accountsCount, children }: { isSetupMode: boolean; accountsCount: number, children: ReactNode }) => {
  if ( isSetupMode ) { return <>{ children }</>};
  return (
    <AccordionItem
      buttonLabel = { `${accountsCount} account${accountsCount === 1 ? "" : "s"} syncing` }
      buttonChildren = { <></> }
    >{ children }</AccordionItem>
  )
}

export const DestinationAccounts = () => {
  const { onToggleAccountIds, allPlaidAccounts, selectedAccountIds, isSetupMode } = useDestination();

  return (
    <Wrapper isSetupMode = { isSetupMode } accountsCount = { selectedAccountIds.length }>
      <FieldGroup title = "Accounts" description = "Select which accounts you want to sync to this destination.">
        { allPlaidAccounts && allPlaidAccounts.length > 0 ? (
          <>
            <ButtonGroup mt = "2" size='sm' isAttached variant='outline'>
              <Button onClick = { () => onToggleAccountIds(allPlaidAccounts.map(account => account.id), 'add') }>Select All</Button>
              <Button onClick = { () => onToggleAccountIds(allPlaidAccounts.map(account => account.id), 'remove') }>Deselect All</Button>
            </ButtonGroup>
            <Table
              size = "sm"
              mt = "2"
              variant = "bordered"
            >
              <Thead>
                <Tr>
                  <Th>Linked</Th>
                  <Th>Institution</Th>
                  <Th>Name</Th>
                  <Th>Account Mask</Th>
                </Tr>
              </Thead>

              <Tbody>
                { _.sortBy(allPlaidAccounts, ['institution', 'created_at', 'id'])
                .map(account => {
                  const isLinked = selectedAccountIds?.includes(account.id);
                  
                  return (
                    <Tr key = { account.id } opacity = { isLinked ? 1 : 0.6 }>
                      <Td><Switch onChange = { () => onToggleAccountIds([account.id], isLinked ? "remove" : "add") } isChecked = { isLinked } /></Td>
                      <Td>{ account.item.institution.name }</Td>
                      <Td>{ account.name }</Td>
                      <Td>{ account.mask }</Td>
                    </Tr>
                  )
                })}
              </Tbody>
            </Table>
          </>
        ) : (
          <EmptyState 
            title = "No accounts"
            icon = { "/icons/bank.svg" }
            callToAction = "You can connect your bank accounts on the dashboard."
          />
        )}
      </FieldGroup>
      </Wrapper>
    )
  }