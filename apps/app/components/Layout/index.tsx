import { ReactNode } from "react";
import {
  Flex,
  Stack
} from "@chakra-ui/react";

import { Main } from "./Main";
import { Navigation } from "./Navigation";

export { CenteredContent } from "./CenteredContent";
export { LogoHeader } from "./LogoHeader";

interface LayoutProps {
  children: ReactNode;
  showNavigation?: boolean
}

export const Layout = ({ children , showNavigation = false }: LayoutProps) => (
  <Flex
    height = '100vh'
    overflow = 'hidden'
    className = 'page'
  >
    <Stack
      width = 'full'
      direction = {{ base: 'column', md: 'row' }}
      flex = '1'
      py = '8'
      px = {{ base: 6, sm: 10, md: 'unset' }}
    >
      { showNavigation && <Navigation /> }
      <Main>
        <>{ children }</>
      </Main>
    </Stack>
  </Flex>
)