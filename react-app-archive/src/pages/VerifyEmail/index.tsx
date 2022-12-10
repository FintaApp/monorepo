import { Box, Button, Heading, Image, VStack } from '@chakra-ui/react';
import { useSearchParams } from "react-router-dom";
import { Link as RouterLink } from "react-router-dom";

import { Card } from "src/components/Card";
import { Page } from "src/components/Page";
import emailCheck from "src/images/icons/email-check.svg";

import { ExpiredTicket } from "./ExpiredTicket";

export const VerifyEmail = () => {
  const params = useSearchParams();
  const { error } = Object.fromEntries(params[0])
  return (
    <Page hasNavigation = { false }>
      <Card variant = 'fullscreen'>
        { !error ? (
          <Box>
            <VStack spacing = "8">
              <Heading fontSize = "3xl" fontWeight = "normal">Email Verified!</Heading>
              <Image height = "150px" src = { emailCheck } alt = "Email icon" />
              <Button variant = "primary" as = { RouterLink } to = "/">Back to Finta</Button>
            </VStack>
          </Box>
        ) : (
          error === 'invalid-ticket' ? <ExpiredTicket /> : <></>
        ) }
      </Card>
    </Page>
  )
}