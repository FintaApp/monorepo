import {
  Box,
  HStack,
  Td,
  Tr,
  useColorModeValue as mode
} from "@chakra-ui/react";
import _ from "lodash";

import { IntegrationLogo } from "src/components/IntegrationLogo";
import { EditableInputWithButtons } from "src/components/EditableInputWithButtons";
import { useUpdatePlaidAccountMutation } from "src/graphql";
import * as analytics from "src/lib/analytics";
import { useToast } from "src/lib/useToast";
import { IntegrationModel, PlaidItemModel } from "src/types";

export const Account = ({ account }: { account: PlaidItemModel['accounts'][0] }) => {
  const renderToast = useToast();
  const [ updateAccountMutation ] = useUpdatePlaidAccountMutation();

  const destinationConnections = account.destination_connections;

  const uniqueIntegrations = _.unionBy(destinationConnections
    .map(connection => connection.destination.integration as IntegrationModel), 'name')
    .sort((i1, i2) => i1.name > i2.name ? 1 : -1)

  const onChangeName = (newValue: string) => {
    if ( newValue !== account.name ) {
      updateAccountMutation({
        variables: {
          plaid_account_id: account.id,
          _set: {
            name: newValue
          }
        }
      })
      .then(() => {
        renderToast({
          status: "success",
          title: "Account Updated"
        })

        analytics.track({ event: analytics.EventNames.ACCOUNT_UPDATED, properties: {
          field: 'name'
        }});
      })
    }
  }

  return (
    <Tr>
      <Td width = {{ base: "80%", md: "75%" }}>
        <EditableInputWithButtons 
          defaultValue = { account.name } 
          isLoading = { false }
          onSubmit = { onChangeName }
          visibleOnHover = { true }
        />
      </Td>
      <Td display = {{ base: "none", md: "table-cell" }}>{ account.mask }</Td>
      <Td py = "0" display = {{ base: "none", md: "table-cell" }}>
        <HStack>
          { uniqueIntegrations.map((integration, idx) => {
            return (
            <Box key = { idx } p = "1" rounded = "full" shadow = { mode('sm', 'dark.sm') }>
              <IntegrationLogo integration = { integration } boxSize = '20px' />
            </Box>
            )
          }) }
        </HStack>
      </Td>
    </Tr>
  )
}