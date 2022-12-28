import {
  Avatar,
  Badge,
  Card,
  CardBody,
  Icon,
  Text,
  useColorModeValue as mode
} from "@chakra-ui/react";
import { AiOutlineBank } from "react-icons/ai";
import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import moment from "moment-timezone";

import { LogTable } from "./LogTable";
import { AccordionItem } from "~/components/AccordionItem"
import { SyncLogModel } from "~/types/frontend";
import { nhost } from "~/utils/nhost";

const formatTrigger = (trigger: string) => {
  if ( trigger === 'transactions_update' ) { return 'Transactions Update' }
  if ( trigger === 'holdings_update' ) { return 'Holdings Update' }
  if ( trigger === 'investment_transactions_update' ) { return 'Investment Transactions Update' }
}

export const PlaidItemSyncLog = ({ syncLog }: { syncLog: SyncLogModel }) => {
  const plaidItem = syncLog.plaid_item_sync_logs[0]?.plaid_item;

  const destinationSyncLogs = syncLog.destination_sync_logs;

  const errorDestinationyncLogs = destinationSyncLogs.filter(log => !!log.error);
  const successDestinationyncLogs = destinationSyncLogs.filter(log => !log.error);

  const showColumns = {
    accounts: true,
    transactions: ['transactions_update'].includes(syncLog.trigger),
    holdings: ['holdings_update'].includes(syncLog.trigger),
    investmentTransactions: ['investment_transactions_update'].includes(syncLog.trigger),
  }

  const syncType = ['destination', 'refresh', 'historical_sync'].includes(syncLog.trigger) ? 'destination' : 'plaidItem';
  const syncLogError = syncLog.error;
  const destinationLogError = syncType === 'destination' ? destinationSyncLogs[0]?.error : undefined;

  const logoFileId = plaidItem?.institution.logo_file?.id;
  const logoSrc = logoFileId ? nhost.storage.getPublicUrl({ fileId: logoFileId }): undefined;

  return (
    <Card width = "full" p = "4">
      <CardBody>
        <AccordionItem
          buttonIcon = {(
            <Avatar
              size = "sm"
              mr = "1"
              src = { logoSrc } 
              icon = { <AiOutlineBank /> }
              fontSize = "1.25rem"
              shadow = { mode('xs', 'dark.xs') }
            />
          )}
          buttonLabel = { `${plaidItem?.institution.name} - ${formatTrigger(syncLog.trigger)}` }
          buttonChildren = {(
            <Badge alignItems = "center" display = "flex" variant = { syncLog.ended_at ? syncLog.is_success ? 'success' : 'error' : 'outline' }>
              { syncLog.ended_at && <Icon mr = "1" as = { syncLog.is_success ? CheckCircledIcon : CrossCircledIcon } /> }
              <Text variant = "helper">{ syncLog.ended_at ? moment(syncLog.ended_at).format("MMM DD h:mm a") : 'In progress' }</Text>
            </Badge>
          )}
        >
          { syncLogError?.error_code === 'no_subscription' && <Text>Unable to sync due to inactive Finta subscription.</Text> }
          { syncLogError?.error_code === 'internal_error' && <Text>There was an issue with Finta during this sync.</Text> }
          
          { destinationLogError?.error_code === 'invalid_credentials' && <Text>The credentials for this destination are invalid.</Text> }
          { destinationLogError?.error_code === 'missing_table' && <Text>This destination is missing the { destinationLogError?.table } table.</Text> }
          { destinationLogError?.error_code === 'missing_field' && <Text>This destination is missing the "{destinationLogError?.field}" column in the { destinationLogError?.table } table.</Text>}

          { successDestinationyncLogs.length > 0 && (
            <LogTable 
              showAccounts = { showColumns.accounts }
              showTransactions = { showColumns.transactions }
              showHoldings = { showColumns.holdings }
              showInvestments = { showColumns.investmentTransactions }
              destinationSyncLogs = { successDestinationyncLogs }
            /> 
          )}

          { errorDestinationyncLogs.length > 0 && (
            <LogTable
              showError = { true }
              destinationSyncLogs = { errorDestinationyncLogs }
            />
          )}
        </AccordionItem>
      </CardBody>
    </Card>
  )
}