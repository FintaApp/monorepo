import { getNhostSession } from "@nhost/nextjs";
import { GetServerSideProps } from "next";
import { Stack } from "@chakra-ui/react";

import { AnalyticsPage } from "~/utils/frontend/analytics";
import { SettingsSection, Profile, Subscription } from "~/components/Settings"


import { DeleteAccount } from "~/components/Settings/DeleteAccount";
import { Notifications } from "~/components/Settings/Notifications";
import { PageHeader } from "~/components/Layout/PageHeader";
import { useAuth } from "~/utils/frontend/useAuth";

const Settings = () => {
  const { user } = useAuth();
  const subscription = user?.profile.stripeData.subscription;

  if ( !user ) { return <></> }
  
  return (
    <>
      <PageHeader title = "Settings" />
      <Stack spacing = "8">
        <SettingsSection title = "Profile" description = "Update your profile and login details">
          <Profile.DisplayName />
          <Profile.Email />
          <Profile.ChangePassword />
          <Profile.JoinedOn />
        </SettingsSection>

        { user && (
          <SettingsSection 
            title = "Subscription"
            description = { subscription ? "Update your payment method, change your subscription, and view your past payments." : "Start your subscription"}
          >
            <Subscription.SubscriptionSummary />
            { subscription && ['active', 'trialing', 'past_due', 'incomplete'].includes(subscription.status)
              ? <Subscription.StripeBillingPortal />
              : <Subscription.StartSubscription />
            }
          </SettingsSection>
        )}

        <Notifications />
        <DeleteAccount />
      </Stack>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async context => {
  const nhostSession = await getNhostSession(process.env.NHOST_BACKEND_URL || "", context);

  if ( !nhostSession ) {
    return {
      props: {

      },
      redirect: {
        destination: `/login?next=${context.resolvedUrl}`,
        permanent: false
      }
    }
  }
  
  return {
    props: {
      showNavigation: true
    }
  }
}

Settings.analyticsPageName = AnalyticsPage.SETTINGS
export default Settings;