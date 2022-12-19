import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  Box,
  Button,
  Stack,
  Text,
  useColorModeValue as mode
} from "@chakra-ui/react";
import Stripe from "stripe";

import { trpc } from "~/lib/trpc";
import { useSearchParams } from "next/navigation";
import { useUser } from "~/lib/context/useUser";

interface PriceBoxProps {
  isLoading: boolean;
  onClick: () => void;
  price: Stripe.Price;
}
const PriceBox = ({ isLoading, onClick, price }: PriceBoxProps) => (
  <Box borderWidth = "1px" borderColor = { mode('gray.light.6', 'gray.dark.6') } px = "2" py = "4" borderRadius = "sm" width = "full">
    <Box mb = "2" width = "full" display = "flex" alignItems = "center" justifyContent = "center">
      <Text textAlign = "center" fontSize = "3xl" fontWeight = "medium">${price.unit_amount! / 100.0 }</Text>
      <Text fontSize = "lg">/{price.recurring?.interval}</Text>
    </Box>

    <Button
      variant = "primary"
      size = "sm"
      isLoading = { isLoading }
      onClick = { onClick }
      width = "full"
    >
      Start {price.recurring?.interval}ly plan
    </Button>
  </Box>
)

export const StartSubscription = () => {
  const router = useRouter();
  const { refetchSubscription } = useUser();
  const [ loadingPriceId, setLoadingPricingId ] = useState("");
  const { data: prices } = trpc.stripe.getPrices.useQuery();
  const { mutateAsync, isLoading } = trpc.stripe.createCheckoutPortalSession.useMutation();
  const searchParams = useSearchParams();

  const shouldRefetch = searchParams.get('action') === 'refetch';

  useEffect(() => {
    if ( shouldRefetch ) {
      refetchSubscription()
        .then(() => router.replace('/settings', undefined, { shallow: true }))
    }
  }, [ shouldRefetch ])

  if ( !prices ) { return <></> };

  const monthlyPrice = prices.find(price => price.recurring?.interval === 'month');
  const yearlyPrice = prices.find(price => price.recurring?.interval === 'year');

  if ( !monthlyPrice || !yearlyPrice ) { return <></> }

  const loadPortal = ( priceId: string ) => {
    setLoadingPricingId(priceId);
    const cancelUrl = window.location.href
    const successUrl = cancelUrl + '?action=refetch';

    mutateAsync({ cancelUrl, successUrl, priceId })
      .then(({ url }) => { if ( url ) { router.push(url)} })
  }

  return (
    <Box width = 'full'>
      <Text mb = "2" fontSize = "2xl">Start Subscription</Text>
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