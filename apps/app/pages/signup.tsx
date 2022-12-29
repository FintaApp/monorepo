import NextLink from 'next/link';
import {
  Link,
  Text,
  VStack
} from "@chakra-ui/react";

import { LogoHeader, CenteredContent } from "~/components/Layout";
import { SignupForm } from "~/components/Forms/SignupForm";
import { AnalyticsPage } from "~/utils/frontend/analytics";
import { authGate } from "~/lib/authGate";

const Signup = () => {
  return (
    <CenteredContent>
      <VStack width = 'full'>
        <LogoHeader title = 'Create your Finta account' variant = 'full' />
        <SignupForm />
      </VStack>

      <Text mt = "8" align = "center" fontWeight = "medium">
        Already have an account?
        <Link 
          ml = "1"
          as = { NextLink }
          href = '/login'
          display = {{ base: 'block', md: 'inline-block' }}
        >Log In</Link>
      </Text>
    </CenteredContent>
  )
}

export const getServerSideProps = authGate(async context => {
  return { props: { showNavigation: false, isProtectedRoute: false }}
}, false)

Signup.analyticsPageName = AnalyticsPage.SIGN_UP
export default Signup;