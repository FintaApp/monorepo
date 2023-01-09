import {
  Container,
  Heading,
  Link,
  Text,
  VStack,
  Box
} from "@chakra-ui/react";

const Security = () => (
  <Container maxW = "container.md">
    <Heading mb = "8" variant = "h1" textAlign = "center">Security at Finta</Heading>
    <VStack spacing = "10" textAlign = "center">
      <Box>
        <Heading mb = "2" fontWeight = "semibold" variant = "h3">😕 Ads Suck</Heading>
        <Text>The only personal identifying information that we ask for is your name and email. This, along with any financial data that you sync, never gets shared with ad or marketing platforms.</Text>
      </Box>

      <Box>
        <Heading mb = "2" fontWeight = "semibold" variant = "h3">🙈 No unecessary peaks at your financial data</Heading>
        <Text>We use Plaid to connect to your banks. This third party handles the account connection process and doesn't allow the app to see or store your log in credentials. Also, your financial data will flow directly to your destination. No transactions, holdings, balances, or investments will be stored in any of our databases.</Text>
      </Box>

      <Box>
        <Heading mb = "2" fontWeight = "semibold" variant = "h3">🎤 Open and honest communication</Heading>
        <Text>You can see all of the third party apps that were used to build Finta in our <Link target = "_blank" href = "https://www.iubenda.com/privacy-policy/49633829">Privacy Policy</Link>. If you have any questions about any of these products, feel free to send us an email!</Text>
      </Box>
    </VStack>
  </Container>
)

export default Security;