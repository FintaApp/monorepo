import { ReactNode } from "react";
import {
  Box,
  Flex,
  VStack
} from "@chakra-ui/react";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";

export const Layout = ({ children }: { children: ReactNode }) => (
  <Flex
      height = '100vh'
      overflow = 'hidden'
      className = 'page'
    >
      <VStack
        width = 'full'
        flex = '1'
        px = {{ base: 6, sm: 10, md: 'unset' }}
      >
        <Navigation />
        <Box overflow = "scroll" as = "main" px = {{ base: 0, md: 8 }} width = "full">
          <>{ children }</>
        </Box>
        <Footer />
      </VStack>
    </Flex>
)