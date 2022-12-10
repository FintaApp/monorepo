import { Image, ImageProps } from "@chakra-ui/react";

import { destinationLogos } from "src/images/logos";
import { DestinationModel } from "src/types";

export interface IntegrationLogoProps extends ImageProps {
  integration: DestinationModel['integration']
}

export const IntegrationLogo = ({ integration, ...imageProps }: IntegrationLogoProps) => (
  <Image
    src = { destinationLogos[integration.id as keyof typeof destinationLogos] }
    alt = { `${integration.name} logo`}
    { ...imageProps }
  />
)