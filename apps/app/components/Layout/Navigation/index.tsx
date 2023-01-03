import { Box, ButtonGroup, HStack, VStack } from "@chakra-ui/react";
import { useRouter } from 'next/router';
import { AiOutlineBank, AiOutlineHistory } from "react-icons/ai";
import { DashboardIcon } from '@radix-ui/react-icons';

import { Logo } from "~/components/Common/Logo";

import { NavItem } from './NavItem';
import { ProfileDropdown } from "./ProfileDropdown";
import { TrialProgressBar } from "./TrialProgressBar";

const navigationPages = [
  { label: 'Destinations', href: '/destinations', icon: DashboardIcon },
  { label: 'Accounts', href: '/accounts', icon: AiOutlineBank },
  // { label: 'Logs', href: '/logs', icon: AiOutlineHistory}
]

export const Navigation = () => {
  const router = useRouter()
  const currentPage = router.pathname;

  return (
    <>
      {/* Desktop Side Navigation */}
      <Box height = "full" display = {{ base: 'none', md: 'flex' }}>
      <VStack
          px = "6"
          spacing = { 6 }
          alignItems = "flex-start"
          left = "0"
          top = "0"
          bottom = "0"
          width = "16rem"
          height = "full"
          flex = "1"
          justifyContent = "space-between"
        >
          <Box>
            <Logo mb = "10" width = '10rem' height = 'auto' onClick = { () => router.push('/') } variant = "full" />
            <VStack mb = { 4 } spacing = "2" as = "nav">
            { navigationPages.map(page => <NavItem key = { page.label } { ...page } isActive = { currentPage === page.href } />)}
            </VStack>
            <TrialProgressBar />
          </Box>
          <Box>
            <ProfileDropdown />
          </Box>
        </VStack>
      </Box>

      {/* Mobile Top Nav */}
      <VStack display = {{base: 'flex', md: 'none' }}>
        <HStack
          justifyContent = 'space-between'
          width = "full"
          py = { 4 }
        >
          <Box display = "flex">
            <Logo onClick = { () => router.push('/') } variant = 'symbol' width = { 8 } height = { 8 } />
            {/* Used to make the logo and profile dropdown the same width */}
            <Box width = { 15 } ml = { 1 } />
          </Box> 
          <ButtonGroup dir = "row" spacing = {{ base: 2, sm: 0 }}>
            { navigationPages.map(page => (
              <NavItem
                key = { page.label }
                { ...page }
                isActive = { currentPage === page.href }
              />
            ))}
          </ButtonGroup>
          <ProfileDropdown />
        </HStack>
        <TrialProgressBar />
      </VStack>
    </>
  )
}