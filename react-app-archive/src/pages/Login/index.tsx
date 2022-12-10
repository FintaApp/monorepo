import { useEffect } from "react";
import {
  Center,
  Heading,
  Link,
  Text,
  VStack
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

import { Logo } from "src/components/Logo";
import { Page } from "src/components/Page";
import * as analytics from "src/lib/analytics";

import { LoginForm } from "./LoginForm";
import { AppRoutes } from "src/routes";

export const Login = () => {
  useEffect(() => {
    analytics.page({ name: analytics.PageNames.LOG_IN });
  }, []);

  return (
    <Page hasNavigation = { false }>
      <Center w = "full" maxW = "lg" mx = "auto" flexDir = "column" mt = {{ base: 10, sm: 20, md: 32 }} px = {{ base: 2, sm: 4, md: 'unset'}}>
        <VStack width = 'full'>
          <Logo 
            variant = "full" 
            height = "16" 
            mb = {{ base: '4', md: '6' }} 
            mx = "auto" 
          />
            
          <Heading variant = "h2" as = "h2">Log In</Heading>
          
          <LoginForm />
        </VStack>

        <Text mt = "8" align = "center" fontWeight = "medium">
          Don't have an account?{' '}
          <Link
            as = { RouterLink }
            to = { AppRoutes.SIGN_UP }
            display = {{ base: 'block', md: 'inline-block' }}
          >Sign Up</Link>
        </Text>
      </Center>
    </Page>
  )
}