import {
  Link,
  Text,
  VStack
} from "@chakra-ui/react";
import NextLink from 'next/link';

import { CenteredContent, LogoHeader } from "~/components/Layout";
import { UserAuthForm } from "~/components/UserAuthForm";
import { AnalyticsPage } from "~/lib/analytics";
import { authGate } from "~/lib/authGate";

const Login = () => {
  return (
    <CenteredContent maxW = "sm">
      <VStack width = 'full'>
        <LogoHeader title = 'Welcome Back!' variant = 'full' />
        <UserAuthForm />
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
  return { props: { showNavigation: false, isProtected: false }}
}, false)

Login.analyticsPageName = AnalyticsPage.LOG_IN
export default Login;