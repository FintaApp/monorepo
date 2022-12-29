import { modalAnatomy } from '@chakra-ui/anatomy';
import { createMultiStyleConfigHelpers } from '@chakra-ui/react';
import { mode } from '../mode';

const { defineMultiStyleConfig } = createMultiStyleConfigHelpers(modalAnatomy.keys)

export const Modal: any = defineMultiStyleConfig({
  baseStyle: (props) => ({
    closeButton: {
      borderRadius: "full",
      _focus: {
        boxShadow: "none"
      }
    },
    dialog: {
      rounded: "md",
      shadow: "modal",
      bg: mode("white", "linear-gradient(136.61deg, rgb(39, 40, 43) 13.72%, rgb(45, 46, 49) 74.3%)")(props),
      mb: 2,
      mx: 2
    },
    footer: {
      py: "2.5",
      borderTop: "1px",
      borderColor: mode("gray.light.6", "transparent", )(props),
      roundedBottom: "md"
    },
    header: {
      fontWeight: "normal",
      fontSize: "lg",
      borderBottom: '1px',
      borderColor: mode("gray.light.6", "transparent")(props)
    },
    overlay: {
      bg: mode("rgba(144, 149, 157, 0.4)", "rgba(28, 29, 31, 0.5)")(props)
    }
  }),
  variants: {
    fullscreen: (props) => ({
      dialog: {
        height: "full",
        m: "0",
        maxW: "100%",
        width: "full",
        bg: {
          base: mode("white", "gray.dark.2")(props),
          md: mode("white", "linear-gradient(136.61deg, rgb(39, 40, 43) 13.72%, rgb(45, 46, 49) 74.3%)")(props),
        },
        overflow: "scroll",
        rounded: "none"
      }
    })
  }
});