import {
  Badge,
  Icon,
  Text
} from "@chakra-ui/react";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import moment from "moment-timezone";

import { LogTable } from "./LogTable";
import { AccordionItem } from "src/components/AccordionItem"
import { Card } from "src/components/Card";
import { IntegrationLogo } from "src/components/IntegrationLogo";
import { SyncLogModel } from "src/types";
import { Integrations_Enum } from "src/graphql";

const formatTrigger = (trigger: string) => {
  if ( trigger === 'destination' ) { return 'Destination Trigger' }
  if ( trigger === 'refresh' ) { return 'Manual Refresh' }
  if ( trigger === 'historical_sync' ) { return 'Historical Sync'}
}

export const DestinationSyncLog = ({ syncLog }: { syncLog: SyncLogModel }) => {
  const destinationSyncLog = syncLog.destination_sync_logs[0];
  if ( !destinationSyncLog ) { return <></> }
  const destination = destinationSyncLog.destination;
  const targetTable = syncLog.metadata?.target_table;
  const plaidItemsSyncLogs = syncLog.plaid_item_sync_logs;
  const destinationSyncLogs = syncLog.destination_sync_logs;

  const errorPlaidItemSyncLogs = plaidItemsSyncLogs.filter(log => !!log.error);
  const successPlaidItemSyncLogs = plaidItemsSyncLogs.filter(log => !log.error);

  const showColumns = {
    accounts: (targetTable && ['accounts', 'transactions', 'holdings', 'investment_transactions'].includes(targetTable)) || !targetTable,
    transactions: ['transactions_webhook', 'refresh', 'historical_sync'].includes(syncLog.trigger) || (targetTable && targetTable === 'transactions' ),
    holdings: ['holdings_webhook', 'refresh', 'historical_sync'].includes(syncLog.trigger) || (targetTable && targetTable === 'holdings' ),
    investmentTransactions: ['investment_transactions_webhook', 'refresh', 'historical_sync'].includes(syncLog.trigger) || (targetTable && targetTable === 'investment_transactions' ),

  }

  const syncType = ['destination', 'refresh', 'historical_sync'].includes(syncLog.trigger) ? 'destination' : 'plaidItem';
  const syncLogError = syncLog.error;
  const destinationLogError = syncType === 'destination' ? destinationSyncLogs[0].error : undefined;

  return (
    <Card width = "full" p = "4">
      <AccordionItem
        buttonIcon = {(
          <IntegrationLogo 
            integration = { destination.integration } 
            h = {{ base: 6, md: 8 }} 
            w = "auto" 
          /> 
        )}
        buttonLabel = { `${destination.name} - ${formatTrigger(syncLog.trigger)}` }
        buttonChildren = {(
          <Badge alignItems = "center" display = "flex" variant = { syncLog.ended_at ? syncLog.is_success ? 'success' : 'error' : 'outline' }>
            { syncLog.ended_at && <Icon mr = "1" as = { syncLog.is_success ? CheckCircledIcon : CrossCircledIcon } /> }
            <Text variant = "helper">{ syncLog.ended_at ? moment(syncLog.ended_at).format("MMM DD h:mm a") : 'In progress' }</Text>
          </Badge>
        )}
      >
        { syncLogError?.error_code === 'no_subscription' && <Text>Unable to sync due to inactive Finta subscription.</Text> }
        { syncLogError?.error_code === 'has_error_item' && <Text>Unable to sync because at least one bank institution is in an error state.</Text>}
        { syncLogError?.error_code === 'investments_disabled' && <Text>Unable to sync { targetTable } because investments are disabled for this destination.</Text>}
        { syncLogError?.error_code === 'transactions_disabled' && <Text>Unable to sync { targetTable } because transactions are disabled for this destination.</Text>}
        { syncLogError?.error_code === 'internal_error' && <Text>There was an issue with Finta during this sync.</Text> }
        
        { destinationLogError?.error_code === 'invalid_credentials' && <Text>The credentials for this destination are invalid.</Text> }
        { destinationLogError?.error_code === 'missing_table' && <Text>This destination is missing the { destinationLogError?.table } table.</Text> }
        { destinationLogError?.error_code === 'missing_field' && <Text>This destination is missing the "{destinationLogError?.field}" column in the { destinationLogError?.table } table.</Text>}

        { destination.integration.id === Integrations_Enum.Coda && successPlaidItemSyncLogs.length > 0 && (
          <Text>The following was synced to the { targetTable } sync table.</Text>
        )}

        { successPlaidItemSyncLogs.length > 0 && (
          <LogTable 
            showAccounts = { showColumns.accounts }
            showTransactions = { showColumns.transactions }
            showHoldings = { showColumns.holdings }
            showInvestments = { showColumns.investmentTransactions }
            plaidItemSyncLogs = { successPlaidItemSyncLogs }
          /> 
        )}

        { errorPlaidItemSyncLogs.length > 0 && (
          <LogTable
            showError = { true }
            plaidItemSyncLogs = { errorPlaidItemSyncLogs }
          />
        )}
      </AccordionItem>
    </Card>
  )
}