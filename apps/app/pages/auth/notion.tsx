import { getNhostSession } from "@nhost/nextjs";
import { GetServerSideProps } from "next";

import { AnalyticsPage } from "~/utils/frontend/analytics";

const NotionAuthorize = () => {
  return <></>
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

NotionAuthorize.analyticsPageName = AnalyticsPage.NOTION_AUTHORIZE
export default NotionAuthorize;