import {
  Card,
  CardBody,
  Stack,
  Text
} from "@chakra-ui/react";

import { DeleteAccountDialog } from "./DeleteAccountDialog";
import { HeadingGroup } from "src/components/HeadingGroup";

export const DeleteAccount = () => (
  <Stack as = "section" spacing = "2">
    <HeadingGroup
      title = "Delete Account"
      description = "Remove all of your data from Finta and cancel your subscription"
    />
    <Card display = {{ base: "block", md: "flex" }} justifyContent = "space-between">
      <CardBody>
        <Text variant = 'helper' mb = { 2 }>Warning, this action is irreversible.</Text>
        <DeleteAccountDialog />
      </CardBody>
    </Card>
  </Stack>
)