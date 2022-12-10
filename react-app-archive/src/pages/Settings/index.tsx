import { useEffect } from "react";
import { Stack } from "@chakra-ui/react";

import { DeleteAccount } from "./DeleteAccount";
import { Notifications } from "./Notifications";
import { Profile } from "./Profile";
import { Subscription } from "./Subscription";
import { Page, PageHeader } from "src/components/Page";
import * as analytics from "src/lib/analytics";

export const Settings = () => {
  useEffect(() => {
    analytics.page({ name: analytics.PageNames.SETTINGS })
  }, []); 

  return (
    <Page>
      <PageHeader title = "Settings" />
      <Stack spacing = { 8 }>
        <Profile />
        <Notifications />
        <Subscription />
        <DeleteAccount />
      </Stack>
    </Page>
  )
}