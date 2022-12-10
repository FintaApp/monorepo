import { Center, CenterProps } from "@chakra-ui/react"

export const CenteredContent = (props: CenterProps ) => (
  <Center 
    w = "full" 
    maxW = "lg" 
    mx = "auto" 
    flexDir = "column" 
    mt = {{ base: 10, sm: 20, md: 32 }} 
    px = {{ base: 2, sm: 4, md: 'unset'}}
    { ...props }
  />
)