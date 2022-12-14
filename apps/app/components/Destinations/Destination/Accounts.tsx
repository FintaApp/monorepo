import { useCallback, useMemo } from "react";
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
import _ from "lodash";

import { EmptyState } from "~/components/EmptyState";
import { FieldGroup } from "~/components/FieldGroup";
import { useDeleteDestinationAccountsMutation, useInsertDestinationAccountsMutation, useGetPlaidAccountsQuery } from "~/graphql/frontend";
import { useToast } from "~/utils/frontend/useToast";

export interface AccountsTableProps {
  destinationId?: string;
  selectedAccountIds: string[];
  onChange?: (newAccountIds: string[]) => void;
}

export const DestinationAccounts = ({ destinationId, selectedAccountIds, onChange }: AccountsTableProps) => {
  const renderToast = useToast();
  const [ createDestinationAccountsMutation ] = useInsertDestinationAccountsMutation();
  const [ deleteDestinationAccountsMutation ] = useDeleteDestinationAccountsMutation();

  const { data } = useGetPlaidAccountsQuery({ pollInterval: 5000 });
  const allAccounts = useMemo(() => data?.plaidAccounts.map(account => ({
    institution: account.item.institution.name,
    name: account.name,
    mask: account.mask,
    id: account.id
  })), [ data ]);

  const onToggle = useCallback(async (accountIds: string[], action: 'add' | 'remove' ) => {
    const newAccountIds = action === 'add' ? _.uniq((selectedAccountIds || []).concat(accountIds)) : _.difference((selectedAccountIds || []), accountIds);
    onChange && onChange(newAccountIds);

    if ( destinationId ) {
      if ( action === 'add' ) {
        const destination_accounts = accountIds.map(accountId => ({ destinationId, account_id: accountId }));
        await createDestinationAccountsMutation({ variables: { destination_accounts }})
      }

      if ( action === 'remove' ) {
        await deleteDestinationAccountsMutation({ variables: { where: { destination_id: { _eq: destinationId }, account_id: { _in: accountIds }}}})
      }

      renderToast({ title: `Account${accountIds.length === 1 ? '' : 's'} ${action === 'add' ? 'Added' : "Removed"}`, status: "success" });
    }
  }, [ selectedAccountIds, onChange, renderToast, destinationId ])

  return (
    <FieldGroup title = "Accounts" description = "Select which accounts you want to sync to this destination.">
      { allAccounts && allAccounts.length > 0 ? (
        <>
          <ButtonGroup mt = "2" size='sm' isAttached variant='outline'>
            <Button onClick = { () => onToggle(allAccounts.map(account => account.id), 'add') }>Select All</Button>
            <Button onClick = { () => onToggle(allAccounts.map(account => account.id), 'remove') }>Deselect All</Button>
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
              { _.sortBy(allAccounts, ['institution', 'created_at', 'id'])
              .map(account => {
                const isLinked = selectedAccountIds?.includes(account.id);
                
                return (
                  <Tr key = { account.id } opacity = { isLinked ? 1 : 0.6 }>
                    <Td><Switch onChange = { () => onToggle([account.id], isLinked ? "remove" : "add") } isChecked = { isLinked } /></Td>
                    <Td>{ account.institution }</Td>
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
      )
    }
    </FieldGroup>
  )
}