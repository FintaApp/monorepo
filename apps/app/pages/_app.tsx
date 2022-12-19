export { reportWebVitals } from 'next-axiom';
import { NextPage } from 'next';
import { AppProps, AppType } from "next/app";
import { useEffect } from "react";
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';
import { SessionProvider } from 'next-auth/react';

import { theme } from "@finta/shared";
import { page as trackPageView, AnalyticsPage } from "~/utils/frontend/analytics";
import { Layout } from '~/components/Layout';

import { UserProvider } from "~/lib/context/useUser";
import { trpc } from '~/lib/trpc';

import "./index.css";
import "./DatePicker.css";

type NextPageWithPageName<P = {}, IP = P> = NextPage<P, IP> & {
  analyticsPageName?: AnalyticsPage
};

type AppPropsWithPageName = AppProps & {
  Component: NextPageWithPageName;
};

// const App: AppType = ({ Component, pageProps: { session, ...pageProps } }: AppPropsWithPageName) => {
//   const analyticsPageName = Component.analyticsPageName;

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
};

export default trpc.withTRPC(App);