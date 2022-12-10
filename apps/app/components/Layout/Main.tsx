import type { ReactElement } from 'react';
import { Box } from '@chakra-ui/react';

export const Main = ({ children }: { children: ReactElement }) => (
  <Box overflow = "scroll" as = "main" px = {{ base: 0, md: 8 }} width = "full">
    { children }
  </Box>
)