import { Image, ImageProps } from "@chakra-ui/react";
import { Integration } from "@prisma/client";

import { integrationsMeta } from "~/lib/integrations/meta";

export interface IntegrationLogoProps extends ImageProps {
  integration: Integration
}

export const IntegrationLogo = ({ integration, ...imageProps }: IntegrationLogoProps) => (
  <Image
    src = { integrationsMeta[integration].logo }
    alt = { `${integrationsMeta[integration].name} logo`}
    { ...imageProps }
  />
)