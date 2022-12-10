import {
  Card,
  CardBody,
  Stack
} from "@chakra-ui/react";


import { EmailSubscriptions } from "./EmailSubscriptions";
import { Timezone } from "./Timezone";
import { HeadingGroup } from "src/components/HeadingGroup";
import { useAuth } from "src/lib/useAuth";
import { useGetUserProfileQuery } from "src/graphql";

export const Notifications = () => {
  const { user } = useAuth();
  const { data } = useGetUserProfileQuery({ variables: { userId: user!.id }, skip: !user });
  const userProfile = data?.userProfile

  return (
    <Stack as = "section" spacing = "2">
      <HeadingGroup
        title = "Notifications"
        description = "Set your notification preferences"
      />
      { userProfile && <Card>
        <CardBody>
          <Stack spacing = "6">
            <Timezone userId = { userProfile.user_id } timezone = { userProfile.timezone }/>
            <EmailSubscriptions 
              userId = { userProfile.user_id }
              isSubscribedGeneral = { userProfile.is_subscribed_general }
              isSubscribedSyncUpdates = { userProfile.is_subscribed_sync_updates }
              syncUpdatesFrequency = { userProfile.sync_updates_frequency }
            />
          </Stack>
        </CardBody>
      </Card> }
    </Stack>
  )
}