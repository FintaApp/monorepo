import { 
  BoxProps,
  Box,
  Flex,
  Stack,
  useColorModeValue as mode
} from "@chakra-ui/react";

import { Navigation } from "./Navigation";

interface PageProps extends BoxProps {
  hasNavigation?: boolean;
  children: any;
}

export { PageHeader } from "../../../../apps/app/components/Layout/PageHeader";

export const Page = ({ children, hasNavigation = true, ...props }: PageProps) => (
  <Flex
    height = "100vh"
    overflow = "hidden"
    bg = { mode('gray.light.1', 'gray.dark.2') }
    className = 'page'
    { ...props }
  >
    <Stack width = "full" direction = {{ base: 'column', md: 'row' }} flex = "1" py = "8" px = {{ base: 6, sm: 10, md: 'unset'}}>
      { hasNavigation && <Navigation /> }
      <Box overflow = "scroll" as = "main" px = {{ base: 0, md: 8 }} width = "full">
        { children }
      </Box>
    </Stack>
  </Flex>
)
