import { Box, Fade, Link, Progress, Stack, StackProps, Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import moment from "moment-timezone";
import { useAuth } from '~/utils/frontend/useAuth';

export const TrialProgressBar = ({ ...props }: StackProps) => {
  const { user } = useAuth();

  if ( !user ) { return <></> }
  const { subscription, trialEndsAt, customer } = user.profile.stripeData

  if ( subscription && ['active', 'canceled', 'incomplete_expired'].includes(subscription.status)) { return <></> }
  if ( subscription && !subscription.trialStartedAt && !subscription.trialEndedAt ) { return <></> }

  const startDate = subscription
    ? moment(subscription.trialStartedAt)
    : moment(customer?.createdAt)
  const endDate = moment(trialEndsAt);

  const totalDays = endDate.diff(startDate, 'days');
  const passedDays = moment().diff(startDate, 'days');
  
  const remainingDays = totalDays - passedDays;

  return (
    <Fade in = { !!customer }>
      <Stack { ...props } alignItems = "center">
        { remainingDays > 0 ? (
          <Box>
            <Progress value = { (passedDays / totalDays) * 100 } rounded = "base" width = "full" minW = "150px" />
            <Link href = "/settings" as = { NextLink }>
              <Text whiteSpace = "nowrap" textAlign = "center">{ remainingDays } day{ remainingDays > 1 ? "s" : ""} left in trial</Text>
            </Link>
          </Box>
        ) : (
          <Text>Your trial is now over. <Link href = "/settings" as = { NextLink }>Start Subscription</Link></Text>
        )}
      </Stack>
    </Fade>
  )
}