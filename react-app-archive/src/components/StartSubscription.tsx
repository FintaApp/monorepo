import { useState } from "react";
import { 
  Box, 
  Button,
  Stack,
  Text,
  useColorModeValue as mode
} from "@chakra-ui/react";

import { createCheckoutPortalSession } from "src/lib/functions";
import { StripePrice, useGetSubscriptionPricesQuery } from "src/graphql";
import { useToast } from "src/lib/useToast";

export interface PriceBoxProps {
  isLoading?: boolean;
  onClick: () => void;
  price: StripePrice;
}

export interface StartSubscriptionProps {
  stripeCustomerId: string;
}

const PriceBox = ({ isLoading, onClick, price }: PriceBoxProps) => (
  <Box borderWidth = "1px" borderColor = { mode('gray.light.6', 'gray.dark.6') } px = "2" py = "4" borderRadius = "sm" width = "full">
    <Box mb = "2" width = "full" display = "flex" alignItems = "center" justifyContent = "center">
      <Text textAlign = "center" fontSize = "3xl" fontWeight = "medium">${price.unitAmount}</Text>
      <Text fontSize = "lg">/{price.interval}</Text>
    </Box>

    <Button
      variant = "primary"
      size = "sm"
      isLoading = { isLoading }
      onClick = { onClick }
      width = "full"
    >
      Start {price.interval}ly plan
    </Button>
  </Box>
)

export const StartSubscription = () => {
  const [ loadingPriceId, setLoadingPricingId ] = useState("");
  const { data: pricesData } = useGetSubscriptionPricesQuery();
  const prices = pricesData?.stripePrices || [];
  const renderToast = useToast();

  if ( !prices ) { return <></> }

  const monthlyPrice = prices.find(price => price.interval === "month")!;
  const yearlyPrice = prices.find(price => price.interval === "year")!;

  if ( !monthlyPrice || !yearlyPrice ) { return <></> }

  const loadPortal = (priceId: string) => {
    setLoadingPricingId(priceId);
    const returnUrl = window.location.href;

    createCheckoutPortalSession({
      priceId,
      successUrl: returnUrl,
      cancelUrl: returnUrl
    })
    .then(({ url }) => { url && window.location.assign(url) })
    .catch(() => {
      renderToast({
        status: 'error',
        title: "Uh Oh",
        message: "There was an error processing this request."
      })
    })
    .finally(() => setLoadingPricingId(""))
  }

  return (
    <Box width = "full">
      <Text mb = "2" fontSize = "2xl">Start a Subscription</Text>
      <Stack direction = {{ base: "column", sm: "row" }} width = "full" justifyContent = "stretch">
        <PriceBox
          price = { monthlyPrice }
          isLoading = { loadingPriceId === monthlyPrice.id }
          onClick = { () => loadPortal(monthlyPrice.id) }
        />

        <PriceBox
          price = { yearlyPrice }
          isLoading = { loadingPriceId === yearlyPrice.id }
          onClick = { () => loadPortal(yearlyPrice.id) }
        />
      </Stack>
    </Box>
  )
}