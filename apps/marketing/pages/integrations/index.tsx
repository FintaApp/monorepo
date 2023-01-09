import { Container, Heading, SimpleGrid, Text, Link } from '@chakra-ui/react';
import { InferGetStaticPropsType } from 'next';
import { allIntegrations } from 'contentlayer/generated';

import { select } from '~/lib/utils';
import { IntegrationCard } from '~/components/IntegrationCard';

const Integrations = ({ integrations }: InferGetStaticPropsType<typeof getStaticProps>) => (
  <Container maxW = "container.lg">
    <Heading my = "6" variant = "h1">Integrations</Heading>
    <Text>Don't see an integration you'd like to use? Should us an email at <Link href = "mailto:hello@finta.io">hello@finta.io</Link> </Text>

    <SimpleGrid mt = "12" spacing = "6" columns = {{ base: 1, sm: 2, xl: 4 }}>
      { integrations.map((integration, index) => <IntegrationCard integration = { integration } key = { index } /> )}
    </SimpleGrid>
  </Container>
)

export function getStaticProps() {
  const integrations = allIntegrations
    .map(integration =>
      select(integration, [
        'slug',
        'name',
        'logo',
        'id',
        'description'
      ])
    )
    .sort((a, b) => a.name > b.name ? 1 : -1)

  return { props: { integrations }}
}

export default Integrations;