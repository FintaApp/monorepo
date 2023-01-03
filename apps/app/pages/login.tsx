import {
  Link,
  Text,
  VStack
} from "@chakra-ui/react";
import NextLink from 'next/link';

import { CenteredContent, LogoHeader } from "~/components/Layout";
import { AnalyticsPage } from "~/lib/analytics";
import { authGate } from "~/lib/authGate";
import { UserAuthForm } from "~/components/Forms/UserAuthForm";

const Login = () => {
  return (
    <CenteredContent>
      <VStack width = 'full'>
        <LogoHeader title = 'Log In' variant = 'full' />
        <UserAuthForm mode = 'login' />
      </VStack>

      <Text mt = "8" align = "center" fontWeight = "medium">
        Don&apos;t have an account?
        <Link 
          ml = "1"
          as = { NextLink }
          href = '/signup'
          display = {{ base: 'block', md: 'inline-block' }}
        >Sign Up</Link>
      </Text>
    </CenteredContent>
  )
}

export const getServerSideProps = authGate(async context => {
  return { props: { showNavigation: false, isProtectedRoute: false }}
}, false)

Login.analyticsPageName = AnalyticsPage.LOG_IN
export default Login;