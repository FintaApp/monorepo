import { Box, HStack, Td, Tr, useColorModeValue as mode } from "@chakra-ui/react";
import _ from "lodash";

import { EditableInputWithButtons } from "~/components/Forms/EditableInputWithButtons";

import { IntegrationLogo } from "~/components/IntegrationLogo";
import { RouterOutput, trpc } from "~/lib/trpc";
import { useToast } from "~/lib/context/useToast";

export const Account = ({ account }: { account: RouterOutput['plaid']['getPlaidItem']['accounts'][0] }) => {
  const { mutateAsync: updateAccount } = trpc.plaid.updatePlaidAccount.useMutation();
  const renderToast = useToast();

  const onChangeName = (newValue: string) => {
    if ( newValue !== account.name ) {
      updateAccount({ id: account.id, name: newValue })
      .then(() => renderToast({ status: 'success', title: "Account Updated"}))
    }
  } 
  
  const uniqueIntegrations = [] as string[] //_.uniqBy(account.destination_connections.map(connection => connection.destination.integration as IntegrationModel), 'name')
    //.sort((i1, i2) => i1.name > i2.name ? 1 : -1);

  return (
    <Tr>
      <Td width = {{ base: "80%", md: "75%" }}>
        <EditableInputWithButtons
          defaultValue = { account.name }
          visibleOnHover = { true }
          onSubmit = { onChangeName }
        />
      </Td>

      <Td display = {{ base: "none", md: "table-cell" }}>{ account.mask }</Td>

      <Td py = "0" display = {{ base: "none", md: "table-cell" }}>
        <HStack>
          <></>
          {/* { uniqueIntegrations.map(integration => (
            <Box key = { integration.id } p = "1" rounded = "full" shadow = { mode('sm', 'dark.sm') }>
              <IntegrationLogo integration = { integration } boxSize = "20px" />
            </Box>
          ))} */}
        </HStack>
      </Td>
    </Tr>
  )
}