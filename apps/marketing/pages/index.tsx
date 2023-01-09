import { Box, useColorModeValue as mode, Button, Container, Heading, VStack, Text, Image, Divider} from "@chakra-ui/react";
import Script from 'next/script'
import { FAQ } from "~/components/FAQ";

const Home = () => (
  <>
    <Script defer type="text/javascript" src="https://widget.senja.io/embed/frame.js" />
    <Container maxW = "container.lg">
      <VStack mt = '4'>
        <Heading variant = "h1">Sync your financial data to your favorite apps</Heading>
        <Text maxW = 'md' textAlign = 'center'>Finta syncs your account balances, transactions, and investments to other tools so that you can set up your own automations and routines.</Text>

        <Button 
          mt = '4'
          size = "lg"
          variant = 'primary'
          onClick = { () => window.location.assign('https://app.finta.io/signup') }>Start Syncing</Button>
        <Text variant = 'helper'>14 day free trial. No credit card required</Text>
      
        <Image
          src = '/images/coda-transactions-table.png'
          rounded = 'sm'
          shadow = { mode('light.lg', 'dark.lg') }
        />
      </VStack>

      <Divider my = '10' />

      <Box>
        <Box maxW = 'lg'>
        <Heading mb = '4' variant = 'h2'>Finta makes it easier for you to budget the way you want</Heading>
        <Text mb = '2'>Budget apps force you to follow their rules without giving you access to your own data. Finta allows you to use the powerful features from tools like Airtable and Coda to manage your finances just as you want. No more forcing your processes and routines into a box someone else designed.</Text>
        </Box>
        <Box mt = '4' maxH = '400px' overflow = 'hidden' shadow = { mode('light.lg', 'dark.lg') }>
          <Image
            src = '/images/finta-home-page.png'
            rounded = 'sm'
          />
        </Box>

        <VStack mt = '10' spacing = '4'>
          <VStack spacing = '2'>
            <Text fontWeight = 'semibold' fontSize = 'lg'>1,000s banks supported</Text>
            <Text>We easily integrate with thousands of US and Canadian banks to sync your balances and transactions.</Text>
          </VStack>

          <VStack spacing = '2'>
            <Text fontWeight = 'semibold' fontSize = 'lg'>∞ connections</Text>
            <Text>Limits aren't fun. Finta allows you to sync unlimited banking accounts to unlimited destinations.</Text>
          </VStack>

          <VStack spacing = '2'>
            <Text fontWeight = 'semibold' fontSize = 'lg'>0 Ads</Text>
            <Text>We promise not to sell your data or to use it for advertising.</Text>
          </VStack>
        </VStack>
      </Box>

      <Divider my = '10' />

      <div className="senja-frame-embed" data-id="4ef332b4-f7a0-4117-a096-bef5771a9549"></div>

      <Divider my = '10' />

      <FAQ />

      <Divider my = '10' />

      <VStack mb = "6">
        <Heading variant = "h2">Accessing your financial data shouldn't be hard</Heading>
        <Button 
          size = "md"
          variant = 'primary'
          onClick = { () => window.location.assign('https://app.finta.io/signup') }>Get Started with Finta</Button>
      </VStack>
    </Container>
  </>
)

export default Home;