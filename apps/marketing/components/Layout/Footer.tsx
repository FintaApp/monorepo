import { Container, HStack, Link, Icon, Text, VStack, useColorModeValue as mode } from "@chakra-ui/react";
import NextLink from "next/link";
import { TwitterLogoIcon, DiscordLogoIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";

const Section = ({ title, links }: { title: string; links: { label: string; href: string; isExternal?: boolean}[] }) => (
  <VStack alignItems = "flex-start">
    <Text fontSize = "sm" fontWeight = "medium" color = { mode('gray.light.12', 'gray.dark.12') }  textTransform = "uppercase">{ title }</Text>
    { links.map(({ label, href, isExternal = false }) => (
      <Link 
        color = { mode('gray.light.11', 'gray.dark.11') }
        _hover = {{ color: mode('gray.light.12', 'gray.dark.12') }}
        fontSize = "sm"
        key = { label } 
        as = { isExternal ? undefined : NextLink } 
        href = { href }
        target = { isExternal ? "_blank" : undefined}
      >{ label }</Link>
    ))}
  </VStack>
)

const legalLinks = [
  { label: "Privacy", href: "https://www.iubenda.com/privacy-policy/49633829", isExternal: true },
  { label: "Terms", href: "https://www.iubenda.com/terms-and-conditions/49633829", isExternal: true }
]

export const Footer = () => (
  <Container maxW = "container.lg" as = "footer" bottom = "0" pb = "6" borderTop = "1px" borderColor = { mode('gray.light.7', 'gray.dark.7') }>
    <HStack mt = "6">
      <Section title = "legal" links = { legalLinks }/>
    </HStack>
    <HStack mt = "8" justifyContent = "space-between">
      <Text variant = "helper">© 2023 Finta App, LLC. All rights reserved.</Text>
      <HStack spacing = "6">
        <a href = "https://twitter.com/FintaApp" target="_blank"><Icon width = "4" height = "4" color = { mode("gray.light.12", "gray.dark.12") } as = {TwitterLogoIcon} /></a>
        <a href = "mailto:hello@finta.io"><Icon width = "4" height = "4" color = { mode("gray.light.12", "gray.dark.12") } as = {EnvelopeClosedIcon} /></a>
        <a href = "https://community.finta.io" target="_blank"><Icon width = "4" height = "4" color = { mode("gray.light.12", "gray.dark.12") } as = {DiscordLogoIcon} /></a>
      </HStack>
    </HStack>
  </Container>
)