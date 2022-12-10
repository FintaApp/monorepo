import { useCallback, useEffect, useMemo } from "react";
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

import { EmptyState } from "src/components/EmptyState";
import { FieldGroup } from "src/components/FieldGroup";
import bankIcon from "src/images/icons/bank.svg";
import * as analytics from "src/lib/analytics";
import { useDeleteDestinationAccountsMutation, useInsertDestinationAccountsMutation, useGetPlaidItemsQuery } from "src/graphql";
import { useToast } from "src/lib/useToast";
import { DestinationModel } from "src/types";

export interface AccountsTableProps {
  destination?: DestinationModel;
  selectedAccountIds?: string[] | null;
  initiallySelectAll?: boolean;
  onChange?: (newAccountIds: string[]) => void;
}

export const DestinationAccounts = ({ destination, selectedAccountIds: selectedAccountIdsProp, initiallySelectAll = false, onChange }: AccountsTableProps) => {
  const { data } = useGetPlaidItemsQuery();
  const allAccounts = useMemo(() =>  data?.plaidItems
    .filter(item => !item.disabled_at)
    .map(item => item.accounts.map(account => ({ ...account, institutionName: item.institution.name })))
    .reduce((all, curr) => all.concat(curr), [])
  , [ data ]);
  const renderToast = useToast();
  const [ createDestinationAccountsMutation ] = useInsertDestinationAccountsMutation({ refetchQueries: 'all' });
  const [ deleteDestinationAccountsMutation ] = useDeleteDestinationAccountsMutation({ refetchQueries: 'all' });

  const selectedAccountIds = destination?.account_connections.map(da => da.account.id) || selectedAccountIdsProp;

  const onToggle = useCallback(async (accountIds: string[], action: 'add' | 'remove') => {
    const newAccountIds = action === 'add' ? _.uniq((selectedAccountIds || []).concat(accountIds)) : _.difference((selectedAccountIds || []), accountIds);
    onChange && onChange(newAccountIds);

    if ( destination ) {
      if ( action === 'add' ) {
        const destination_accounts = accountIds.map(accountId => ({ destination_id: destination.id, account_id: accountId }));
        await createDestinationAccountsMutation({ variables: { destination_accounts }})
      }

      if ( action === 'remove') {
        await deleteDestinationAccountsMutation({ variables: { where: { destination_id: { _eq: destination.id }, account_id: { _in: accountIds }}}})
      }

      renderToast({ title: `Account${accountIds.length === 1 ? '' : 's'} ${action === 'add' ? 'Added' : "Removed"}`, status: "success" });
      analytics.track({ event: analytics.EventNames.ACCOUNT_VISIBILITY_TOGGLED, properties: { is_linked: action === "add" }})
    }
  }, [ renderToast, selectedAccountIds, createDestinationAccountsMutation, deleteDestinationAccountsMutation, destination, onChange ])

  useEffect(() => {
    if ( allAccounts && initiallySelectAll && selectedAccountIdsProp === null ) {
      onToggle(allAccounts.map(account => account.id), 'add');
    }
  }, [ onToggle, allAccounts, initiallySelectAll, selectedAccountIdsProp ]);

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
              { _.sortBy(allAccounts, ['plaid_item_id', 'created_at', 'id'])
              .map(account => {
                const isLinked = selectedAccountIds?.includes(account.id);
                
                return (
                  <Tr key = { account.id } opacity = { isLinked ? 1 : 0.6 }>
                    <Td><Switch onChange = { () => onToggle([account.id], isLinked ? "remove" : "add") } isChecked = { isLinked } /></Td>
                    <Td>{ account.institutionName }</Td>
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
          icon = { bankIcon }
          callToAction = "You can connect your bank accounts on the dashboard."
        />
      )
    }
    </FieldGroup>
  )
}