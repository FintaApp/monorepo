import { Stack } from "@chakra-ui/react";

import { AnalyticsPage } from "~/lib/analytics";
import { SettingsSection, Profile, Subscription, Notifications, DeleteAccount } from "~/components/Settings"

import { PageHeader } from "~/components/Layout/PageHeader";

import { authGate } from "~/lib/authGate";
import { useUser } from "~/lib/context/useUser";

const Settings = () => {
  const { subscription } = useUser();
  
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

        <SettingsSection title = "Notifications" description = "Set your notification preferences">
          <Notifications.Timezone />
          <Notifications.EmailSubscriptions />
        </SettingsSection>

        <SettingsSection title = "Delete Account" description = "Remove all of your data from Finta and cancel your subscription">
          <DeleteAccount />
        </SettingsSection>
      </Stack>
    </>
  )
}

export const getServerSideProps = authGate(async context => {
  return { props: { showNavigation: true, isProtectedRoute: true }}
}, true)

Settings.analyticsPageName = AnalyticsPage.SETTINGS
export default Settings;