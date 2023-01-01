import { 
  Button,
  Card,
  CardBody,
  HStack,
  Text,
  VStack
} from "@chakra-ui/react";

import { Header as IntegrationHeader } from "~/components/Destinations/AddDestination/SetupDestination/Header";
import {
  DestinationName,
  SyncStartDate,
  DestinationAccounts
} from "~/components/Destinations/Destination";
import { DividerWithText } from "~/components/Common/DividerWithText";
import { TableConfigs } from "~/components/Destinations/Destination/TableConfigs";

import { Integration } from "@prisma/client";
import { useDestination } from "../Destinations/context";

export interface AddDestinationProps {
  state?: any;
  [key: string]: any;
}

export const AddDestination = ({ state }: AddDestinationProps) => {
  const { isCreatingDestination, createDestination, name, isCreatingOauthToken, createOauthToken } = useDestination();
  const codaRedirectUrl = "https://coda.io/packsAuth/oauth2";

  const onCreate = async () => {
    const code = await createOauthToken();
    createDestination(code, false)
      .then(() => window.location.assign(codaRedirectUrl + `?code=${code}&state=${state}`))
  }

  return (
    <Card>
      <CardBody>
        <VStack>
          <VStack maxW = {{ base: "full", md: "3xl" }} spacing = "6">
            <IntegrationHeader integration = { Integration.Coda } />
            <DestinationName />
            <SyncStartDate  />
            <DestinationAccounts  />

            <DividerWithText text = "Table Configurations" />
            <TableConfigs /> 
            <Text maxW = "4xl" fontSize = "sm" textAlign = "center">By clicking "Grant Access", you are allowing Coda to have access to the financial data of the accounts selected above. These settings can be changed at any time by visiting the Finta dashboard.</Text>
            <HStack justifyContent = "center" width = "full" mt = "4">
              <Button 
                onClick = { onCreate }
                variant = "primary"
                isDisabled = { name.length === 0 }
                isLoading = { isCreatingDestination || isCreatingOauthToken }
                width = {{ base: "full", sm: "unset" }}
              >Grant Access</Button>
            </HStack>
          </VStack>
        </VStack>
      </CardBody>
    </Card>
  )
}