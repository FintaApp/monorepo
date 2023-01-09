import { Card, CardBody, HStack, Heading, Image, Link, Text, VStack, useColorModeValue as mode } from "@chakra-ui/react";
import NextLink from "next/link";

type IntegrationPreview = {
  name: string;
  description: string;
  logo: string;
  slug: string;
}

export const IntegrationCard = ({ integration }: { integration: IntegrationPreview}) => (
  <Card>
    <CardBody role = "group" border = "1px" borderColor = { mode('gray.light.2', 'gray.dark.2') } _hover = {{ borderColor: mode('gray.light.6', 'gray.dark.6') }}>
      <Link variant = "unstyled" as = { NextLink } href = { 'integrations/' + integration.slug }>
        <VStack spacing = "4">
          <Image
            src = { integration.logo }
            alt = { integration.name }
            width = "auto"
            height = "75px"          
          />
          <Heading _groupHover = {{ color: mode('primary.light.12', 'primary.dark.12') }} fontWeight = "medium" variant = "h2">{ integration.name }</Heading>

          <Text textAlign = "center">{ integration.description }</Text>
        </VStack>
      </Link>
    </CardBody>
  </Card>
)