import {
  Box,Table, Thead, Tr, Th, Tbody, Td, HStack, Avatar, useColorModeValue as mode, Text, Tooltip, VStack, SimpleGrid
} from "@chakra-ui/react";
import { SyncLogModel } from "src/types";
import { AiOutlineBank } from "react-icons/ai";
import { destinationLogos } from "src/images/logos";
import { AiOutlineSync } from "react-icons/ai";

import { nhost } from "src/lib/nhost";

const ColumnTooltip = ({ accounts, numbers }: {
  accounts?: { added: (string | undefined)[]; updated: (string | undefined)[] };
  numbers?: { added: number; updated: number; removed?: number}
}) => (
  <VStack spacing = "2" alignItems = "flex-start">
    { accounts && (
      <>
        <Box display = { accounts.added.length > 0 ? "block" : 'none'}>
          <Text fontWeight = "bold">Added</Text>
          { (accounts.added).filter(account => !!account).map((account, idx) => <Text key = { idx }>{ account }</Text> )}
        </Box>

        <Box display = { accounts.updated.length > 0 ? "block" : 'none'}>
          <Text fontWeight = "bold">Updated</Text>
          { (accounts.updated).filter(account => !!account).map((account, idx) => <Text key = { idx }>{ account }</Text> )}
        </Box>
      </>
    )}

    { numbers && (
      <>
        <SimpleGrid columns={2} spacing = {1} justifyContent = 'space-between' width = 'full'>
          <Text>Added</Text>
          <Text textAlign = 'center'>{numbers.added}</Text>

          <Text>Updated</Text>
          <Text textAlign = 'center'>{numbers.updated}</Text>

          { numbers.removed !== undefined && (
            <>
              <Text>Removed</Text>
              <Text textAlign = 'center'>{numbers.removed}</Text>
            </>
          )}
        </SimpleGrid>
      </>
    )}
  </VStack>
)

// AM I USING CAMEL CASE OR SNAKE CASE!!!????
const parseSyncLogError = (error: { error_code: string, table?: string, tableType?: string; field?: string, errorCode?: string } ) => {
  const { error_code, table, field, errorCode, tableType } = error;
  if ( error_code === 'ITEM_LOGIN_REQUIRED' || errorCode === 'ITEM_LOGIN_REQUIRED' ) { return "Item login required" } 
  if ( error_code === 'missing_table' || errorCode === 'missing_table' ) { return `Missing the "${table || tableType}" table` }
  if ( error_code === 'missing_field' || errorCode === 'missing_field' ) { return `Missing the "${field || tableType}" field in the "${table}" table`}
  console.log(error)
}

export const LogTable = ({ showAccounts, showTransactions, showHoldings, showInvestments, showError, plaidItemSyncLogs, destinationSyncLogs }: {
  showAccounts?: boolean;
  showTransactions?: boolean;
  showHoldings?: boolean;
  showInvestments?: boolean;
  showError?: boolean;
  plaidItemSyncLogs?: SyncLogModel['plaid_item_sync_logs'];
  destinationSyncLogs?: SyncLogModel['destination_sync_logs'];
}) => {
  const formattedPlaidItemSyncLogs = plaidItemSyncLogs ? plaidItemSyncLogs.map(syncLog => {
    const plaidItem = syncLog.plaid_item;
    const logoFileId = plaidItem.institution.logo_file?.id;
    const logoSrc = logoFileId ? nhost.storage.getPublicUrl({ fileId: logoFileId }): undefined;
    
    return {
      id: plaidItem.id,
      headerIcon: logoSrc,
      headerBackup: <AiOutlineBank />,
      headerText: plaidItem.institution.name,
      accounts: syncLog.accounts,
      transactions: syncLog.transactions,
      holdings: syncLog.holdings,
      investmentTransactions: syncLog.investment_transactions,
      error: syncLog.error
    }
  }) : [];
  // const allAccounts = plaidItemSyncLogs?.map(syncLog => syncLog.plaid_item.accounts).reduce((total, accountsList) => total.concat(accountsList), []);

  const formattedDestinationSyncLogs = destinationSyncLogs ? destinationSyncLogs.map(syncLog => {
    const destination = syncLog.destination;
    return {
      id: destination.id,
      headerIcon: destinationLogos[destination.integration.id as keyof typeof destinationLogos],
      headerBackup: <AiOutlineSync />,
      headerText: destination.name,
      accounts: syncLog.accounts,
      transactions: syncLog.transactions,
      holdings: syncLog.holdings,
      investmentTransactions: syncLog.investment_transactions,
      error: syncLog.error
    }
  }) : [];

  const formattedSyncLogs = formattedPlaidItemSyncLogs.concat(formattedDestinationSyncLogs);

  return (
    <Box mt = "2" overflowX = "scroll">
      <Table size = "sm">
        <Thead>
          <Tr>
            <Th textTransform = "capitalize">{ plaidItemSyncLogs ? "Institutions" : "Destinations" }</Th>
            { showError && <Th>Error</Th> }
            { showAccounts && <Th textAlign = "center">Accounts</Th> }
            { showTransactions && <Th textAlign = "center">Transactions</Th> }
            { showHoldings && <Th textAlign = "center">Holdings</Th> }
            { showInvestments && <Th textAlign = "center">Investments</Th> }
          </Tr>
        </Thead>
        <Tbody>
          { formattedSyncLogs.map(syncLog => {
            const { accounts, holdings, transactions, investmentTransactions, error,  } = syncLog;

            const totalAccounts = accounts.added.length + accounts.updated.length;
            const totalHoldings = (holdings.added || 0) + (holdings.updated || 0);
            const totalTransactions = transactions.added + transactions.updated + transactions.removed;
            const totalInvestmentTransactions = investmentTransactions.added;

            return (
              <Tr key = { syncLog.id }>
                <Td>
                  <HStack width = "full">
                    <Avatar
                      size = "sm"
                      mr = "1"
                      src = { syncLog.headerIcon }
                      icon = { syncLog.headerBackup }
                      fontSize = "1.25rem"
                      shadow = { mode('xs', 'dark.xs') }
                    />
                    <Text>{ syncLog.headerText }</Text>
                  </HStack>
                </Td>

                { showError && (
                  <Td>
                    { error && <Text>{ parseSyncLogError(error) }</Text> }
                  </Td>
                )}

                { showAccounts && (
                  <Td>
                    <Tooltip
                      label = { <ColumnTooltip numbers = {{ added: accounts.added.length, updated: accounts.updated.length }} /> }
                    ><Text cursor = "pointer" textAlign = "center">{totalAccounts}</Text></Tooltip>
                  </Td>
                )}

                { showTransactions && (
                  <Td>
                    <Tooltip label = { <ColumnTooltip numbers = { transactions } /> }>
                      <Text textAlign = "center">{totalTransactions}</Text>
                    </Tooltip>
                  </Td>
                )}

                { showHoldings && (
                  <Td>
                    <Tooltip label = { <ColumnTooltip numbers = { holdings } /> }>
                      <Text textAlign = "center">{totalHoldings}</Text>
                    </Tooltip>
                  </Td>
                )}

                { showInvestments && (
                  <Td>
                    <Text textAlign = "center">{totalInvestmentTransactions}</Text>
                  </Td>
                )}
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Box>
  )
}