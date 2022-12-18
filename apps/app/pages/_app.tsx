export { reportWebVitals } from 'next-axiom';
import { NextPage } from 'next';
import { AppProps, AppType } from "next/app";
import { useEffect } from "react";
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { QueryClient, QueryClientProvider } from 'react-query'
import { SessionProvider } from 'next-auth/react';

import { theme } from "@finta/shared";
import { page as trackPageView, AnalyticsPage } from "~/utils/frontend/analytics";
import { nhost } from "~/utils/nhost";
import { LoggerProvider } from '~/utils/frontend/useLogger';
import { AuthProvider } from '~/utils/frontend/useAuth';
import { Layout } from '~/components/Layout';

import { trpc } from '~/lib/trpc';

import "./index.css";
import "./DatePicker.css";

type NextPageWithPageName<P = {}, IP = P> = NextPage<P, IP> & {
  analyticsPageName?: AnalyticsPage
};

type AppPropsWithPageName = AppProps & {
  Component: NextPageWithPageName;
};

const queryClient = new QueryClient()

// const App: AppType = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithPageName) => {
//   const analyticsPageName = Component.analyticsPageName;

//   useEffect(() => {
//     analyticsPageName && trackPageView({ name: analyticsPageName })
//    }, [ analyticsPageName ])

//   return (
//     <SessionProvider session = { session }>
//       <QueryClientProvider client={queryClient}>
//         <ChakraProvider theme = { theme }>
//           <LoggerProvider>
//             <AuthProvider isProtected = { pageProps.isProtected }>
//               <ColorModeScript />
//               <Layout showNavigation = { pageProps.showNavigation }>
//                 <Component {...pageProps} />
//               </Layout>
//             </AuthProvider>
//           </LoggerProvider>
//         </ChakraProvider>
//       </QueryClientProvider>
//     </SessionProvider>
//   )
// };

const App: AppType = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithPageName) => {

  return (
    <SessionProvider session = { session }>
      <ChakraProvider theme = { theme }>
        <Component {...pageProps} />
      </ChakraProvider>
    </SessionProvider>
  )
};

export default trpc.withTRPC(App);