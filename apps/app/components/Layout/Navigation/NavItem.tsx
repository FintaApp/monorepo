import NextLink from 'next/link';
import {
  Button,
  Icon,
  useColorModeValue as mode,
  Text,
  Tooltip,
  useBreakpointValue
} from "@chakra-ui/react";

interface NavItemProps {
  label: string;
  icon: any;
  href: string;
  isActive: boolean;
}

export const NavItem = ({ label, icon, href, isActive }: NavItemProps ) => {
  const isTooltipDisabled = useBreakpointValue({ base: false, sm: true });
  
  return (
    <Tooltip hasArrow isDisabled = { isTooltipDisabled } label = { label }>
    <Button 
      key = { label }
      as = { NextLink } 
      href = { href } 
      leftIcon = {(
        <Icon 
          as = { icon } 
          width = {{ base: 5, sm: 4 }} 
          height = {{ base: 5, sm: 4 }} 
        />
      )} 
      variant = 'ghost'
      width = 'full'
      minW = "unset"
      iconSpacing = {{ base: 0, sm: 1, md: 2 }}
      rounded = 'lg'
      justifyContent = {{ base: 'center', md: 'flex-start' }}
      fontWeight = "medium"
      color = { mode('gray.light.11', 'gray.dark.11') }
      _activeLink = {{
        bg: mode('white', 'whiteAlpha.200'),
        color: mode('primary.light.12', 'primary.dark.12')
      }}
      _hover = {{
        bg: mode('white', 'whiteAlpha.200'),
        color: mode('primary.light.12', 'primary.dark.12')
      }}
      aria-current={ isActive ? 'page' : undefined}
      aria-label = { label }
    >
      <Text display = {{ base: 'none', sm: 'inline-flex' }}>{ label }</Text>
    </Button>
    </Tooltip>
  )
}