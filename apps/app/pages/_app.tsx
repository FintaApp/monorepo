import { NextPage } from 'next';
import { AppProps } from "next/app";
import { useEffect } from "react";
import { NhostNextProvider } from "@nhost/nextjs";
import { NhostApolloProvider } from "@nhost/react-apollo";
import { InMemoryCache } from '@apollo/client';
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider, useQuery } from 'react-query'

import { theme } from "@finta/shared";
import { page as trackPageView, AnalyticsPage } from "~/utils/frontend/analytics";
import { nhost } from "~/utils/nhost";
import { LoggerProvider } from '~/utils/frontend/useLogger';
import { AuthProvider } from '~/utils/frontend/useAuth';
import { Layout } from '~/components/Layout';

import "./index.css";
import "./DatePicker.css";

type NextPageWithPageName<P = {}, IP = P> = NextPage<P, IP> & {
  analyticsPageName?: AnalyticsPage
};

type AppPropsWithPageName = AppProps & {
  Component: NextPageWithPageName;
};

const queryClient = new QueryClient()

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
        <QueryClientProvider client={queryClient}>
          <ChakraProvider theme = { theme }>
            <LoggerProvider>
              <AuthProvider>
                <ColorModeScript />
                <Layout showNavigation = { pageProps.showNavigation }>
                  <Component {...pageProps} />
                </Layout>
              </AuthProvider>
            </LoggerProvider>
          </ChakraProvider>
        </QueryClientProvider>
      </NhostApolloProvider>
    </NhostNextProvider>
  )
}