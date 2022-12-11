import { GetServerSideProps } from "next";
import { getNhostSession } from "@nhost/nextjs";
import {
  Link,
  Text,
  VStack
} from "@chakra-ui/react";
import NextLink from 'next/link';

import { CenteredContent, LogoHeader } from "~/components/Layout";
import { LoginForm } from "~/components/Forms/LoginForm";
import { AnalyticsPage } from "~/utils/frontend/analytics";

const Login = () => {
  return (
    <CenteredContent>
      <VStack width = 'full'>
        <LogoHeader title = 'Log In' variant = 'full' />
        <LoginForm />
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

export const getServerSideProps: GetServerSideProps = async context => {
  const nhostSession = await getNhostSession(process.env.NHOST_BACKEND_URL || "", context)

  if ( nhostSession ) {
    return {
      props: {

      },
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  return {
    props: {
      showNavigation: false
    }
  };
}

Login.analyticsPageName = AnalyticsPage.LOG_IN
export default Login;