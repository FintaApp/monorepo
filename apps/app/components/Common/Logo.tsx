import { 
  Image, 
  ImageProps,
  useColorModeValue as mode 
} from "@chakra-ui/react";

const whiteLogo = "/logos/white-logo.png";
const blackLogo = "/logos/black-logo.png";
const symbolLogo = "/logos/symbol-logo.png";

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