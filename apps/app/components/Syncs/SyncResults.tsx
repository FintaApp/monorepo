import { Avatar, Box, HStack, SimpleGrid, Table, Tbody, Td, Text, Th, Thead, Tooltip, Tr, useColorModeValue as mode, VStack } from "@chakra-ui/react";
import { Integration, Table as TableType } from "@prisma/client";
import { AiOutlineBank, AiOutlineSync } from "react-icons/ai";
import { integrationsMeta } from "~/lib/integrations/meta";
import { RouterOutput } from "~/lib/trpc";
import { SyncErrorMetadata } from "~/types";
import { SyncError } from "./SyncError";

type SyncResultsProps = {
  isErrorResults: boolean;
  columnsToDisplay?: Record<TableType, boolean>;
  resultObject: 'destination' | 'item';
  results: RouterOutput['syncs']['getSyncs']['syncs'][0]['results'];
}

const ColumnTooltip = ({ numbers }: {
  numbers: { added: number; updated: number; removed: number};
}) => (
  <VStack spacing = "2" alignItems = "flex-start">
    <>
      <SimpleGrid columns={2} spacing = {1} justifyContent = 'space-between' width = 'full'>
        <Text>Added</Text>
        <Text textAlign = 'center'>{numbers.added}</Text>
        
        { numbers.updated !== 0 && (
          <>
            <Text>Updated</Text>
            <Text textAlign = 'center'>{numbers.updated}</Text>
          </>
        )}

        { numbers.removed !== 0 && (
          <>
            <Text>Removed</Text>
            <Text textAlign = 'center'>{numbers.removed}</Text>
          </>
        )}
      </SimpleGrid>
    </>
  </VStack>
)

export const SyncResults = ({ isErrorResults, columnsToDisplay, resultObject, results }: SyncResultsProps ) => {
  return (
    <Box mt = "2" overflowX = "scroll">
      <Table size = "sm">
        <Thead>
          <Tr>
            <Th textTransform = "capitalize">{ resultObject === 'destination' ? "Destination" : "Institution" }</Th>
            { isErrorResults
              ? <Th>Error</Th>
              : (
                <>
                  { columnsToDisplay?.Accounts && <Th textAlign = "center">Accounts</Th> }
                  { columnsToDisplay?.Transactions && <Th textAlign = "center">Transactions</Th> }
                  { columnsToDisplay?.Holdings && <Th textAlign = "center">Holdings</Th> }
                  { columnsToDisplay?.InvestmentTransactions && <Th textAlign = "center">Investments</Th> }
                </>
              )
            }
          </Tr>
        </Thead>

        <Tbody>
          { results.map(result => {
            const totalAccounts = result.accountsAdded + result.accountsUpdated;
            const totalTransactions = result.transactionsAdded + result.transactionsUpdated + result.transactionsRemoved;
            const totalHoldings = result.holdingsAdded + result.holdingsUpdated;
            const totalInvestmentTransactions = result.investmentTransactionsAdded;

            return (
              <Tr key = { result.syncId + result.destinationId + result.plaidItemId }>
                <Td>
                  <HStack width = "full">
                    <Avatar
                      size = "sm"
                      mr = "1"
                      src = { (resultObject === 'item' ? result.plaidItem?.institution.logoUrl : integrationsMeta[result.destination?.integration!].logo) || undefined }
                      icon = { resultObject === 'item' ? <AiOutlineBank /> : <AiOutlineSync /> }
                      fontSize = "1.25rem"
                      shadow = { mode('xs', 'dark.xs') }
                    />
                    <Text>{ result.plaidItem?.institution.name || result.destination?.name }</Text>
                  </HStack>
                </Td>

                { isErrorResults && !!result.error && (
                  <Td>
                    <SyncError level = 'item' error = { result.error } errorMetadata = { result.errorMetadata as SyncErrorMetadata | null }/>
                  </Td>
                )}

                { columnsToDisplay?.Accounts && (
                  <Td>
                    <Tooltip label = { <ColumnTooltip numbers = {{ added: result.accountsAdded, updated: result.accountsUpdated, removed: 0 }} /> }>
                      <Text textAlign = "center">{ totalAccounts }</Text>
                    </Tooltip>
                  </Td>
                )}

                { columnsToDisplay?.Transactions && (
                  <Td>
                    <Tooltip label = { <ColumnTooltip numbers = {{ added: result.transactionsAdded, updated: result.transactionsUpdated, removed: result.transactionsRemoved }} /> }>
                      <Text textAlign = "center">{ totalTransactions }</Text>
                    </Tooltip>
                  </Td>
                )}

                { columnsToDisplay?.Holdings && (
                  <Td>
                    <Tooltip label = { <ColumnTooltip numbers = {{ added: result.holdingsAdded, updated: result.holdingsUpdated, removed: 0 }} /> }>
                      <Text textAlign = "center">{ totalHoldings }</Text>
                    </Tooltip>
                  </Td>
                )}

                { columnsToDisplay?.InvestmentTransactions && (
                  <Td>
                    <Tooltip label = { <ColumnTooltip numbers = {{ added: result.investmentTransactionsAdded, updated: 0, removed: 0 }} /> }>
                      <Text textAlign = "center">{ totalInvestmentTransactions }</Text>
                    </Tooltip>
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