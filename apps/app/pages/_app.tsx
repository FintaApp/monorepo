export { reportWebVitals } from 'next-axiom';
import { NextPage } from 'next';
import { AppProps, AppType } from "next/app";
import { useEffect } from "react";
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';

import { theme } from "@finta/shared";
import { page as trackPageView, AnalyticsPage } from "~/lib/analytics";
import { Layout } from '~/components/Layout';

import "./index.css";
import "./DatePicker.css";

import { UserProvider } from '~/lib/context/useUser';
import { trpc } from '~/lib/trpc';

type NextPageWithPageName<P = {}, IP = P> = NextPage<P, IP> & {
  analyticsPageName?: AnalyticsPage
};

type AppPropsWithPageName = AppProps & {
  Component: NextPageWithPageName;
};


const App: AppType = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithPageName) => {
  const analyticsPageName = Component.analyticsPageName;

  useEffect(() => {
    analyticsPageName && trackPageView({ name: analyticsPageName })
   }, [ analyticsPageName ])

  return (
    <SessionProvider session = { session }>
      <UserProvider isProtectedRoute = { pageProps.isProtected }>
        <ChakraProvider theme = { theme }>
          <ColorModeScript />
          <Layout showNavigation = { pageProps.showNavigation }>
            <Component {...pageProps} />
          </Layout>
        </ChakraProvider>
      </UserProvider>
    </SessionProvider>
  )
}

export default trpc.withTRPC(App);