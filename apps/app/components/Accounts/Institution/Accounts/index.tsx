import {
  Accordion,
  Table,
  Thead,
  Th,
  Tr,
  Tbody
} from "@chakra-ui/react";
import _ from "lodash";

import { Account } from "./Account";
import { AccordionItem } from "~/components/Common/AccordionItem";
import { usePlaidItem } from "../context"

export const Accounts = () => {
  const { plaidItem } = usePlaidItem();
  const totalAccounts = plaidItem.accounts.length;

  return (
    <Accordion defaultIndex = {[0]} allowToggle>
      <AccordionItem
        buttonLabel = { `${totalAccounts} account${totalAccounts === 1 ? "" : "s"}` }
        buttonChildren = {( <div></div> )}
      >
        <Table size = "sm">
          <Thead>
            <Tr>
              <Th width = {{ base: "80%", md: "75%" }} py = "3" fontSize = "sm">Account</Th>
              <Th display = {{ base: "none", md: "table-cell" }} py = "3" fontSize = "sm">Mask</Th>
              <Th display = {{ base: "none", md: "table-cell" }} width = "20%" py = "3" fontSize = "sm">Destinations</Th>
            </Tr>
          </Thead>

          <Tbody>
            { _.sortBy(plaidItem.accounts, [ 'created_at', 'id'])
              .map(account => <Account account = { account } key = { account.id } /> )}
          </Tbody>
        </Table>
      </AccordionItem>
        
    </Accordion>
  )
}