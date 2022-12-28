export { reportWebVitals } from 'next-axiom';
import { AppProps } from "next/app";
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react';

import { theme } from "@finta/shared";
import { Layout } from '~/components/Layout';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme = { theme }>
      <ColorModeScript />
      <Layout><Component { ...pageProps } /></Layout>
    </ChakraProvider>
  )
}