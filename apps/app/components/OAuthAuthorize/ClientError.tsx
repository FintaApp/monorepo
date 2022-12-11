import { Card, CardBody } from "@chakra-ui/react"

export const ClientError = () => (
  <Card textAlign = "center">
    <CardBody textAlign = "center">
      There was an error processing your request. Please try again.
    </CardBody>
  </Card>
)