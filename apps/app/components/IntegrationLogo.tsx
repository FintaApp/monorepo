import { Image, ImageProps } from "@chakra-ui/react";

import { Integrations_Enum } from "~/graphql/frontend";
import { IntegrationModel } from "~/types/frontend/models";

export interface IntegrationLogoProps extends ImageProps {
  integration: IntegrationModel
}

export const integrationLogos = {
  [Integrations_Enum.Airtable]: "/logos/airtable-logo.png",
  [Integrations_Enum.Notion]: "/logos/notion-logo.png",
  [Integrations_Enum.Google]: "/logos/google-logo.png",
  [Integrations_Enum.Coda]: "/logos/coda-logo.png"
}

export const IntegrationLogo = ({ integration, ...imageProps }: IntegrationLogoProps) => (
  <Image
    src = { integrationLogos[integration.id] }
    alt = { `${integration.name} logo`}
    { ...imageProps }
  />
)