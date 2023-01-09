import { Container, Heading, HStack, Image, Link, Text } from "@chakra-ui/react"
import { Integration as IIntegration } from "contentlayer/generated"
import { ArrowLeftIcon } from "@radix-ui/react-icons";
import NextLink from "next/link";

export const Integration = ({ integration, children }: { integration: IIntegration, children: any }) => {

  return (
    <Container maxW = "container.lg" display = "flex" flexDirection = "column" alignItems = "center">
      <Link display = "flex" alignItems = "center" as = { NextLink } href = "/integrations"><ArrowLeftIcon /> View all integrations</Link>
      <HStack>
        <Image
          src = { integration.logo }
          alt = { integration.name }
          width = "auto"
          height = "100px"
        />
        <Heading variant = "h1">{ integration.name }</Heading>
      </HStack>
      <Text>{ integration.description }</Text>

      <Link href = { integration.companyUrl } isExternal>Visit Website</Link>

      <article>
        { children }
      </article>
    </Container>
  )
}