import { getNhostSession } from "@nhost/nextjs";
import { GetServerSideProps } from "next";
import { PageHeader } from "~/components/Layout/PageHeader";

import { AddDestination } from "~/components/Destinations/AddDestination";
import { AnalyticsPage } from "~/utils/frontend/analytics";
import { DestinationsList } from "~/components/Destinations/DestinationsList";

const Destinations = () => {
  return (
    <>
      <PageHeader title = "Destinations"><AddDestination /></PageHeader>
      <DestinationsList />
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const nhostSession = await getNhostSession(process.env.NHOST_BACKEND_URL || "", context);

  if ( !nhostSession ) {
    return {
      props: {

      },
      redirect: {
        destination: `/login?next=${context.resolvedUrl}`,
        permanent: false
      }
    }
  }
  
  return {
    props: {
      showNavigation: true
    }
  }
}

Destinations.analyticsPageName = AnalyticsPage.DESTINATIONS
export default Destinations;