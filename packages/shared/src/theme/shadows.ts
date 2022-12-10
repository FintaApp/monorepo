import { theme } from "@chakra-ui/react"

export const shadows = {
  ...theme.shadows,
  modal: "rgba(0, 0, 0, 0.5) 0px 16px 70px",
  sm: "0px 4px 12px rgba(0, 0, 0, 0.12)",
  md: "0px 6px 20px rgba(0, 0, 0, 0.12)",
  light: {
    xs: "rgba(48, 49, 51, 0.05) 0px 0px 1px, rgba(48, 49, 51, 0.1) 0px 1px 3px",
    sm: "rgba(48, 49, 51, 0.05) 0px 0px 1px, rgba(48, 49, 51, 0.1) 0px 2px 4px",
    md: "rgba(48, 49, 51, 0.05) 0px 0px 1px, rgba(48, 49, 51, 0.1) 0px 4px 8px",
    lg: "rgba(48, 49, 51, 0.05) 0px 0px 1px, rgba(48, 49, 51, 0.1) 0px 8px 16px",
    xl: "rgba(48, 49, 51, 0.05) 0px 0px 1px, rgba(48, 49, 51, 0.1) 0px 16px 24px"
  },
  dark: {
    xs: "rgba(13, 13, 13, 0.9) 0px 0px 1px, #0D0D0D 0px 1px 3px",
    sm: "rgba(13, 13, 13, 0.9) 0px 0px 1px, #0D0D0D 0px 2px 4px",
    md: "rgba(13, 13, 13, 0.9) 0px 0px 1px, #0D0D0D 0px 4px 8px",
    lg: "rgba(13, 13, 13, 0.9) 0px 0px 1px, #0D0D0D 0px 8px 16px",
    xl: "rgba(13, 13, 13, 0.9) 0px 0px 1px, #0D0D0D 0px 16px 24px",
  },
}