import NextLink from 'next/link';
import {
  Link,
  Text,
  VStack
} from "@chakra-ui/react";

import { LogoHeader, CenteredContent } from "~/components/Layout";
import { UserAuthForm } from "~/components/UserAuthForm";
import { AnalyticsPage } from "~/lib/analytics";
import { PRIVACY_POLICY_URL, TERMS_AND_CONDITIONS_URL } from "~/utils/frontend/constants";
import { authGate } from "~/lib/authGate";

const Signup = () => {
  return (
    <CenteredContent maxW = "sm">
      <VStack width = 'full'>
        <LogoHeader title = 'Create your Finta account' variant = 'full' />
        <UserAuthForm />
      </VStack>

      <Text variant = "helper" fontSize = "sm" textAlign = "center">By signing up, you agree to our <Link isExternal href = { TERMS_AND_CONDITIONS_URL }>Terms and Conditions</Link> and <Link isExternal href = { PRIVACY_POLICY_URL }>Privacy Policy</Link></Text>
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
  return { props: { showNavigation: false, isProtected: false }}
}, false)

Signup.analyticsPageName = AnalyticsPage.SIGN_UP
export default Signup;