import { tabsAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(tabsAnatomy.keys)

export const Tabs: any = defineMultiStyleConfig({
  baseStyle: {
    tab: {
      _focus: {
        boxShadow: "none"
      }
    }
  }
})