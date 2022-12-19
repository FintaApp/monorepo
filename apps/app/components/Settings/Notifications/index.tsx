// import {
//   Card,
//   CardBody,
//   Stack
// } from "@chakra-ui/react";


// import { EmailSubscriptions } from "./EmailSubscriptions";
// import { Timezone } from "./Timezone";
// import { HeadingGroup } from "~/components/HeadingGroup";
// import { useAuth } from "~/utils/frontend/useAuth";
// import { useGetUserProfileQuery } from "~/graphql/frontend";

// export const Notifications = () => {
//   const { user } = useAuth();
//   const { data } = useGetUserProfileQuery({ variables: { userId: user!.id }, skip: !user });
//   const userProfile = data?.userProfile

//   return (
//     <Stack as = "section" spacing = "2">
//       <HeadingGroup
//         title = "Notifications"
//         description = "Set your notification preferences"
//       />
//       { userProfile && <Card>
//         <CardBody>
//           <Stack spacing = "6">
//             <Timezone userId = { userProfile.userId } timezone = { userProfile.timezone }/>
//             <EmailSubscriptions 
//               userId = { userProfile.userId }
//               isSubscribedGeneral = { userProfile.isSubscribedGeneral }
//               isSubscribedSyncUpdates = { userProfile.isSubscribedSyncUpdates }
//               syncUpdatesFrequency = { userProfile.syncUpdatesFrequency }
//             />
//           </Stack>
//         </CardBody>
//       </Card> }
//     </Stack>
//   )
// }

export { EmailSubscriptions } from "./EmailSubscriptions";
export { Timezone } from "./Timezone"