import { Text } from "@chakra-ui/react";
import { SyncError as SyncErrorType } from "@prisma/client";
import { SyncErrorMetadata } from "~/types";

type SyncErrorProps = { error: SyncErrorType; errorMetadata?: SyncErrorMetadata | null; level?: 'destination' | 'item' }

export const SyncError = (props: SyncErrorProps) => {
  return <Text textAlign = 'center'>{ getErrorText(props) }</Text>
}

const getErrorText = ({ error, errorMetadata, level = 'destination'  }: SyncErrorProps) => {
  if ( error === SyncErrorType.NoSubscription ) { return "Unable to sync due to inactive Finta subscription." }
  if ( error === SyncErrorType.ItemError ) { return level === 'destination' 
    ? "Unable to fully sync because at least one bank institution is in an error state."
    : "This bank account needs to be reconnected."
  }
  if ( error === SyncErrorType.InvalidCredentials ) { return "The credentials for this destination are invalid." }
  if ( error === SyncErrorType.UnknownError ) { return "There was an issue with Finta during this sync." }
  if ( error === SyncErrorType.HoldingsDisabled || error === SyncErrorType.InvestmentTransactionsDisabled ) { return "Unable to sync because investments are disabled for this destination."}
  if ( error === SyncErrorType.TransactionsDisabled ) { return "Unable to sync because investments are disabled for this destination."}
  if ( error === SyncErrorType.TableDisabled ) { return "Unable to sync because data type is disabled for this destination."}
  
  if ( error === SyncErrorType.MissingTable ) { return `This destination is missing the ${ errorMetadata?.table } table.`}
  if ( error === SyncErrorType.MissingField ) { return `This destination is missing the "${ errorMetadata?.field }" column in the ${ errorMetadata?.tableName || errorMetadata?.table } table.` }
  if ( error === SyncErrorType.IncorrectFieldType ) { return `The "${ errorMetadata?.fieldName || errorMetadata?.field }" column in the "${ errorMetadata?.tableName || errorMetadata?.table }" table has the incorrect field type.`}

  // Google Sheets Specific
  if ( error === SyncErrorType.InvalidRole || error === SyncErrorType.NotAllowed ) { return "Finta didn't have editor access to this destination" }
  if ( error === SyncErrorType.DestinationNotFound ) { return "This destination couldn't be found."}
  if ( error === SyncErrorType.NoHeaderRow ) { return `The ${ errorMetadata?.tableName || errorMetadata?.table } sheet is missing a header row.`}
}