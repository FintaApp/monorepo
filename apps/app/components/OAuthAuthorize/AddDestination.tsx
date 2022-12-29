import { useState } from "react";
import { 
  Button,
  Card,
  CardBody,
  HStack,
  Text,
  VStack
} from "@chakra-ui/react";
import moment from "moment-timezone";

import { Header as IntegrationHeader } from "~/components/Destinations/AddDestination/SetupDestination/Header";
import {
  DestinationName,
  SyncStartDate,
  DestinationAccounts
} from "~/components/Destinations/Destination";
import { DividerWithText } from "~/components/DividerWithText";
import { createOauthCode } from "~/utils/frontend/functions";
import { Integrations_Enum, useInsertDestinationMutation } from "~/graphql/frontend";
import { TableConfigs as TableConfigsType, DestinationAuthentication } from "~/types/shared/models";
import { TableConfigs } from "~/components/Destinations/Destination/TableConfigs";

import { IntegrationModel, OauthClientModel } from "~/types/frontend/models";

export interface AddDestinationProps {
  oauthClient: OauthClientModel;
  state?: any;
  [key: string]: any;
}

export const AddDestination = ({ oauthClient, state }: AddDestinationProps) => {
  const codaRedirectUrl = "https://coda.io/packsAuth/oauth2";
  const [ createDestinationMutation ] = useInsertDestinationMutation({ refetchQueries: 'all' });

  const [ isLoading, toggleIsLoading ] = useState(false);
  const [ destinationName, setDestinationName ] = useState(`My Budget`);
  const [ syncStartDate, setSyncStartDate ] = useState(new Date());
  const [ connectedAccounts, setConnectedAccounts ] = useState(null as string[] | null);
  const [ tableConfigs, setTableConfigs ] = useState<TableConfigsType>(defaultTableConfigs);

  const onSubmit = async () => {
    toggleIsLoading(true);

    createOauthCode({ clientId: oauthClient.id })
    .then(({ accessTokenHash, code }) => {
      createDestinationMutation({
        variables: {
          destination: {
            integration_id: oauthClient.integration.id as Integrations_Enum,
            name: destinationName,
            sync_start_date: moment(syncStartDate).format("YYYY-MM-DD"),
            authentication: { access_token_hash: accessTokenHash },
            coda_config: {
              data: {
                access_token_hash: accessTokenHash
              }
            },
            account_connections: { data: connectedAccounts?.map(accountId => ({ account_id: accountId })) || [] },
            table_configs: tableConfigs
          }
        }
      })
      .then(() => {
        window.location.assign(codaRedirectUrl + `?code=${code}&state=${state}`)
      })
      .catch(err => console.log(err))
    })
  }

  const isValid = destinationName.length > 0;
  return (
    <Card>
      <CardBody>
        <VStack>
          <VStack maxW = {{ base: "full", md: "3xl" }} spacing = "6">
            <IntegrationHeader integration = { oauthClient.integration as IntegrationModel } />
            <DestinationName value = { destinationName } onChange = { setDestinationName } />
            <SyncStartDate value = { syncStartDate } onChange = { setSyncStartDate } />
            <DestinationAccounts selectedAccountIds = { connectedAccounts || [] } onChange = { setConnectedAccounts } />

            <DividerWithText text = "Table Configurations" />
            <TableConfigs 
              onChange = {setTableConfigs}
              tableConfigs = { tableConfigs }
              integrationId = { oauthClient.integration.id as Integrations_Enum }
            /> 
            <Text maxW = "4xl" fontSize = "sm" textAlign = "center">By clicking "Grant Access", you are allowing { oauthClient.name } to have access to the financial data of the accounts selected above. These settings can be changed at any time by visiting the Finta dashboard.</Text>
            <HStack justifyContent = "center" width = "full" mt = "4">
              <Button 
                onClick = { onSubmit }
                variant = "primary"
                isDisabled = { !isValid }
                isLoading = { isLoading }
                width = {{ base: "full", sm: "unset" }}
              >Grant Access</Button>
            </HStack>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  )
}

// Helpers
const defaultTableConfigs = {
  institutions: { is_enabled: true, table_id: "", fields: [] },
  accounts: { is_enabled: true, table_id: "", fields: [] },
  transactions: { is_enabled: true, table_id: '', fields: [] },
  holdings: { is_enabled: true, table_id: '', fields: [] },
  investment_transactions: { is_enabled: true, table_id: '', fields: [] },
  securities: { is_enabled: false, table_id: '', fields: [] },
} as TableConfigsType;