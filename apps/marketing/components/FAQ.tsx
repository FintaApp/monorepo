import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Link,
  Heading,
  Container
} from '@chakra-ui/react'

const data = [
  {
    question: 'What banks do you support?',
    answer: "Finta currently supports banks in the US and Canada."
  },
  {
    question: 'How are you accessing my financial data?',
    answer: <>We use <Link isExternal href = "https://plaid/com">Plaid</Link> to receive updates about new transactions, updated balances, and investments from your banking institution</>
  },
  {
    question: 'What data do you store?',
    answer: "Finta doesn't store any of your transactions, account balances, investments, or bank log in credentials. Once we sync your data to your chosen destination, we no longer access this information."
  },
  {
    question: 'How much does Finta cost?',
    answer: 'A Finta subscription costs $6.50 a month when on the monthly plan. You can save 24% by switching to the yearly plan which is $60 a year.'
  },
  {
    question: 'Can I try Finta before starting a subscription?',
    answer: <>Sure! You can <Link href = "https://app.finta.io/signup">Get Started</Link> with a 14 day free trial, no credit card required. </>
  }
]

export const FAQ = () => {
  return (
    <Container maxW = "container.md">
      <Heading mb = "4" variant = "h2">Frequently Asked Questions</Heading>
      <Accordion allowToggle>
      { data.map(({ question, answer }, index) => (
        <AccordionItem key = { index }>
          <h2>
            <AccordionButton>
              <Box as = "span" flex = "1" textAlign = "left">{ question }</Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel>{ answer }</AccordionPanel>
        </AccordionItem>
      ))}
    </Accordion>
    </Container>
  )
}