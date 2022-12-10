import { NextPage } from 'next';
import { AppProps } from "next/app";
import { useEffect } from "react";
import { NhostNextProvider } from "@nhost/nextjs";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { InMemoryCache } from '@apollo/client';;

import { page as trackPageView, AnalyticsPage } from "~/utils/frontend/analytics";
import { nhost } from "~/utils/nhost";

type NextPageWithPageName<P = {}, IP = P> = NextPage<P, IP> & {
  analyticsPageName?: AnalyticsPage
};

type AppPropsWithPageName = AppProps & {
  Component: NextPageWithPageName;
};

export default function App({ Component, pageProps }: AppPropsWithPageName) {
  const analyticsPageName = Component.analyticsPageName;

  useEffect(() => {
    analyticsPageName && trackPageView({ name: analyticsPageName })
   }, [ analyticsPageName ])

  return (
    <NhostNextProvider nhost = { nhost } initial = { pageProps.nhostSession }>
      <NhostApolloProvider 
        nhost = { nhost }
        cache = { new InMemoryCache({
          typePolicies: {
            
          }
        })}
      >
        <Component {...pageProps} />
      </NhostApolloProvider>
    </NhostNextProvider>
  )
}