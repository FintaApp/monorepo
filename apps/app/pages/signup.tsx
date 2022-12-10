import { GetServerSideProps } from "next";
import { getNhostSession } from "@nhost/nextjs";

import { AnalyticsPage } from "~/utils/frontend/analytics";

const Signup = () => {
  return <></>
}

export const getServerSideProps: GetServerSideProps = async context => {
  const nhostSession = await getNhostSession(process.env.NHOST_BACKEND_URL || "", context)

  if ( nhostSession ) {
    return {
      props: {

      },
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      showNavigation: false
    }
  };
}

Signup.analyticsPageName = AnalyticsPage.SIGN_UP
export default Signup;