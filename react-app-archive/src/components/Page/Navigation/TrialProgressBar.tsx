import { Box,Link, Progress, Stack, StackProps, Text } from '@chakra-ui/react';
import moment from "moment-timezone";
import { Link as RouterLink } from "react-router-dom"
import { SubscriptionStatus } from 'src/graphql';
import { useAuth } from 'src/lib/useAuth';

export const TrialProgressBar = ({ ...props }: StackProps) => {
  const { user } = useAuth();
  if ( !user ) { return <></> }

  const { subscription, trialEndsAt, customer } = user.stripeData
  if ( subscription && [SubscriptionStatus.Active, SubscriptionStatus.Canceled, SubscriptionStatus.IncompleteExpired].includes(subscription.status) ) { return <></> }
  if ( subscription && !subscription.trialStartedAt && !subscription.trialEndedAt ) { return <></> }

  const startDate = subscription
    ? moment(subscription.trialStartedAt)
    : moment(customer.createdAt)
  const endDate = subscription
    ? moment(subscription.trialEndedAt)
    : moment(trialEndsAt)
  const totalDays = endDate.diff(startDate, 'days');
  const passedDays = moment().diff(startDate, 'days');

  const remainingDays = totalDays - passedDays;

  return (
    <Stack { ...props } alignItems = "center">
      { remainingDays > 0 ? (
        <Box>
          <Progress value = { (passedDays / totalDays) * 100 } rounded = "base" width = "full" minW = "150px" />
          <Link to = "/settings" as = { RouterLink }>
            <Text whiteSpace = "nowrap" textAlign = "center">{ remainingDays } day{ remainingDays > 1 ? "s" : ""} left in trial</Text>
          </Link>
        </Box>
      ) : (
        <Text>Your trial is now over. <Link to = "/settings" as = { RouterLink }>Start Subscription</Link></Text>
      )}
    </Stack>
  )
};