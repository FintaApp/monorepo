import { useEffect } from 'react';
import {
  Center,
  Heading,
  Link,
  Text,
  VStack 
} from '@chakra-ui/react';
import { Link as RouterLink } from "react-router-dom";

import { SignupForm } from './SignupForm';

import { Logo } from 'src/components/Logo';
import { Page } from "src/components/Page";

import * as analytics from "src/lib/analytics";
import { AppRoutes } from 'src/routes';

export const Signup = () =>{
  useEffect(() => { analytics.page({ name: analytics.PageNames.SIGN_UP })}, []);
  return (
    <Page hasNavigation = { false }>
      <Center w = "full" maxW = "lg" mx = "auto" flexDir = "column" mt = {{ base: 10, sm: 20, md: 32 }} px = {{ base: 2, sm: 4, md: 'unset'}}>
        <VStack width = 'full'>
          <Logo 
            variant = 'full'
            height = '16'
            mb = {{ base: '4', md: '6' }} 
            mx = "auto"
          />

          <Heading variant = "h2" as = "h2">Create your Finta account</Heading>

          <SignupForm />
        </VStack>

        <Text mt = "8" align = "center" fontWeight = "medium">
          Already have an account?{' '}
          <Link 
            as = { RouterLink }
            to = { AppRoutes.LOG_IN }
            display = {{ base: 'block', md: 'inline-block' }}
          >Log In</Link>
        </Text>
      </Center>
    </Page>
  )
}