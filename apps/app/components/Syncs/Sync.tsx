import { Card, CardBody } from "@chakra-ui/react";
import { Integration, SyncTrigger, Table } from "@prisma/client";

import { RouterOutput } from "~/lib/trpc";
import { SyncErrorMetadata, SyncMetadata } from "~/types";
import { AccordionItem } from "../Common/AccordionItem";

import { CodaPreface } from "./CodaPreface";
import { SyncBadge } from "./SyncBadge";
import { SyncError } from "./SyncError";
import { SyncResults } from "./SyncResults";
import { TriggerButtonIcon } from "./TriggerButtonIcon";

type Sync = RouterOutput['syncs']['getSyncs']['syncs'][0];

export const Sync = ({ sync }: { sync: Sync }) => {
  const successResults = sync.results.filter(result => !result.error);
  const errorResults = sync.results.filter(result => !!result.error);
  const resultObject = sync.triggerDestinationId ? 'item' : 'destination';

  return (
    <Card width = "full" p = "4">
      <CardBody>
        <AccordionItem
          buttonIcon = { <TriggerButtonIcon triggerDestination = { sync.triggerDestination } triggerPlaidItem = { sync.triggerPlaidItem } /> }
          buttonLabel = {`${sync.triggerDestination?.name || sync.triggerPlaidItem?.institution.name } - ${formatTrigger(sync.trigger)}`}
          buttonChildren = { <SyncBadge endedAt = { sync.endedAt } isSuccess = { sync.isSuccess } /> }
        >
          { sync.error && <SyncError error = { sync.error } errorMetadata = { sync.errorMetadata as SyncErrorMetadata | null } /> }

          { sync.triggerDestination?.integration === Integration.Coda && successResults.length > 0 && <CodaPreface targetTable = { (sync.metadata as SyncMetadata | null)?.targetTable }/> }

          { errorResults.length > 0 && (
            <SyncResults 
              results = { errorResults }
              isErrorResults = { true } 
              resultObject = { resultObject } 
            />
          )}

          { successResults.length > 0 && (
            <SyncResults
              results = { successResults }
              isErrorResults = { false }
              resultObject = { resultObject }
              columnsToDisplay = { getColumnsToDisplay(sync) }
            />
          )}
        </AccordionItem>
      </CardBody>
    </Card>
  )
}

// Helper
const formatTrigger = (trigger: SyncTrigger) => {
  if ( trigger === SyncTrigger.HistoricalSync ) { return "Historical Sync" };
  if ( trigger === SyncTrigger.Refresh ) { return "Manual Refresh" };
  if ( trigger === SyncTrigger.Destination ) { return "Destination Trigger" };

  if ( trigger === SyncTrigger.ItemUpdate ) { return "Item Update"};
  if ( trigger === SyncTrigger.LiabilitiesUpdate ) { return "Liabilities Update"};
  if ( trigger === SyncTrigger.HoldingsUpdate ) { return "Holdings Update"};
  if ( trigger === SyncTrigger.InvestmentTransactionsUpdate ) { return "Investment Transactions Update"};
  if ( trigger === SyncTrigger.TransactionsUpdate ) { return "Transactions Update"};
}

const getColumnsToDisplay = (sync: Sync) => ({
  [Table.Accounts]: sync.trigger !== SyncTrigger.Destination || (sync.metadata as SyncMetadata | null)?.targetTable === Table.Accounts,

  [Table.Transactions]: (sync.metadata as SyncMetadata | null)?.targetTable === Table.Transactions
  || sync.trigger === SyncTrigger.TransactionsUpdate
  || (([ SyncTrigger.HistoricalSync, SyncTrigger.Refresh ] as SyncTrigger[]).includes(sync.trigger) && sync.triggerDestination?.tableConfigs?.find(config => config.table === Table.Transactions)?.isEnabled) || false,

  [Table.Holdings]: (sync.metadata as SyncMetadata | null)?.targetTable === Table.Holdings
  || sync.trigger === SyncTrigger.HoldingsUpdate
  || (([ SyncTrigger.HistoricalSync, SyncTrigger.Refresh ] as SyncTrigger[]).includes(sync.trigger) && sync.triggerDestination?.tableConfigs?.find(config => config.table === Table.Holdings)?.isEnabled) || false,

  [Table.InvestmentTransactions]: (sync.metadata as SyncMetadata | null)?.targetTable === Table.InvestmentTransactions
    || sync.trigger === SyncTrigger.InvestmentTransactionsUpdate
    || (([ SyncTrigger.HistoricalSync, SyncTrigger.Refresh ] as SyncTrigger[]).includes(sync.trigger) && sync.triggerDestination?.tableConfigs?.find(config => config.table === Table.InvestmentTransactions)?.isEnabled) || false,

  [Table.Institutions]: false,
  [Table.Securities]: false,
  [Table.Categories]: false
})