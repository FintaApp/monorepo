import { Text } from "@chakra-ui/react"
import { useDestination } from "../../context"

export const Coda = () => {
  const { destination } = useDestination();
  return destination ? <></> : (
    <Text textAlign = "center">Follow the steps in the budget template to connect your Finta account to Coda.</Text>
  )
}