import { Container, Button, Box, Collapse, HStack, useBreakpointValue, useColorModeValue as mode, useDisclosure, VStack, Link, Card, CardBody, Stack } from "@chakra-ui/react";
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

import { Logo } from "../Logo";

const routes = [
  { label: 'Integrations', href: '/integrations' },
  { label: 'Blog', href: '/blog' },
  { label: 'Security', href: '/security' },
  { label: 'About', href: '/about' }
]

const NavLinks = ({ currentPage }: { currentPage: string }) => 
  <Stack alignItems = "center" spacing = {{ base: 2, md: 6, lg: 8 }} width = "full" direction = {{ base: 'column', md: 'row' }} as = 'nav' mb = {{ base: 4, md: 0 }}>
    { routes.map(({ label, href }) => (
      <Link variant = { currentPage === href ? 'activeNavigation' : 'navigation'} as = { NextLink } href = { href } key = { href }>{ label }</Link>
    ))}
  </Stack>

const AuthButtons = () => (
  <Stack direction = {{ base: 'column', md: 'row' }}>
    <Button 
      as = { NextLink }
      href = "https://app.finta.io/login"
    >Log In</Button>
    <Button 
      as = { NextLink }
      href = "https://app.finta.io/signup"
      variant = "primary"
    >Sign Up</Button>
  </Stack>
)

export const Navigation = () => {
  const useCompactMenu = useBreakpointValue({ base: true, md: false })
  const logoVariant = useBreakpointValue({ base: 'symbol' as 'symbol', md: 'full' as 'full'})
  const router = useRouter()
  const currentPage = router.pathname;
  const { isOpen: isMenuOpen , onToggle: onToggleMenu } = useDisclosure();

  return (
    <Container maxW = "container.lg" as = "header" top = "0" zIndex = {40}>
      <HStack py = "4" borderBottom = "1px" borderColor = { mode('gray.light.7', 'gray.dark.7') } spacing = {{ base: '4', md: '6' }} justifyContent = "space-between" width = "full" position = "sticky">
        <Logo 
          onClick = { () => router.push('/') } 
          variant = { logoVariant! }
          width = {{ base: 8, md: '10rem'}}
          height = {{ base: 8, md: 'auto' }}
        />

        <Box height = 'full' display = {{ base: 'none', md: 'flex' }}>
          <NavLinks currentPage = { currentPage }/>
        </Box>

        { useCompactMenu
          ? <Button variant = "icon" onClick = { onToggleMenu }><HamburgerMenuIcon /></Button>
          : <AuthButtons />
        }
      </HStack>
      <Collapse in = { isMenuOpen } animateOpacity style = {{ width: '100%'}}>
        <Card width = "full">
          <CardBody width = "full" textAlign = 'center'>
            <NavLinks currentPage = { currentPage } />
            <AuthButtons />
          </CardBody>
        </Card>
      </Collapse>
    </Container>
  )
};