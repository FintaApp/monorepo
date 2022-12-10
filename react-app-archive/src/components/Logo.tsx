import { 
  Image, 
  ImageProps,
  useColorModeValue as mode 
} from "@chakra-ui/react";

import whiteLogo from "src/images/logos/white-logo.png";
import blackLogo from "src/images/logos/black-logo.png";
import symbolLogo from "src/images/logos/symbol-logo.png";

export interface LogoProps extends ImageProps {
  variant: 'symbol' | 'full'
}

export const Logo = ({ variant, ...props }: LogoProps) => {
  const fullLogo = mode(blackLogo, whiteLogo);
  return (
    <Image 
      alt = "Finta Logo" 
      src = { variant === "symbol" ? symbolLogo : fullLogo }
      cursor = { props.onClick ? "pointer" : 'default' }
      { ...props }
    />
  )
};