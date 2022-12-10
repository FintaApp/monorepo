import { useEffect } from "react";

import { Page, PageHeader } from "src/components/Page";
import * as analytics from "src/lib/analytics";
import { AddDestination } from "./AddDestination";
import { DestinationsList } from "./DestinationsList";

export const Destinations = () => {
  useEffect(() => {
    analytics.page({ name: analytics.PageNames.DESTINATIONS })
  }, []); 

  return (
    <Page>
      <PageHeader title = "Destinations"><AddDestination /></PageHeader>
      <DestinationsList />
    </Page>
  )
}