import {
  Container,
  Divider,
  Heading,
  Image,
  Link,
  Text,
  VStack,
  useColorModeValue as mode
} from "@chakra-ui/react";

const About = () => (
  <Container maxW = "container.lg">
    <VStack width = "full" spacing = "4" mt = "12">
      <Heading variant = "h1" textAlign = "center">Hi! 👋🏽 I'm Taylor.</Heading>
      <Image
        src = "/headshot.jpeg"
        maxW = {{ base: "50%", md: '40%'}}
        rounded = "xl"
        mx = "auto"
      />
      <Heading textAlign = "center" variant = "h3">Founder and Chief Maker of Finta</Heading>
    </VStack>

    <Divider my = "12" borderColor = { mode('gray.light.7', 'gray.dark.7') }/>

    <VStack spacing = "8" textAlign = 'center'>
      <Text>I originally built Finta to scratch a personal itch. I wasn't happy with how budgeting apps forced me to fit my habits, routines, and ways to managing my finances into their box. I wanted an easy way to send my balances, transactions, and investments to the tools I already use on a daily basis so that I can build out my own systems to make budgeting a breeze.</Text>

      <Text>As a solo-entrepreneur that heavily uses Finta, my priorities and goals are probably pretty close to yours. Finta is focused on giving you access to your financial data in a safe, secure, and accessible way. This is a bootstrapped company that's in it for the long haul.</Text>

      <Text>What started off as a small side project has grown into something I honestly can't live without. You're a part of the Finta family now, and I'm excited to take you along this journey.</Text>

      <Text>Want to chat? Here's my personal <Link target = "_blank" href = "https://linkedin.com/in/taylorfacen">LinkedIn</Link> and <Link href = "mailto:taylor@finta.io">Email</Link>.</Text>
    </VStack>
  </Container>
)

export default About;