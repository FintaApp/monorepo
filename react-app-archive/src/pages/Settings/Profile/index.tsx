import {
  Card,
  CardBody,
  HStack,
  Stack
} from "@chakra-ui/react";

import { ChangePassword } from "./ChangePassword";
import { DisplayName } from "./DisplayName";
import { Email } from "./Email"
// import { VerifyEmail } from "./VerifyEmail";
import { HeadingGroup } from "src/components/HeadingGroup";
// import { useAuth } from "src/lib/useAuth";

export const Profile = () => {
  // const { user } = useAuth();

  return (
    <Stack as = "section" spacing = "2">
      <HeadingGroup
        title = "User Profile"
        description = "Update your profile and login details"
      />
      <Card>
        <CardBody>
          <Stack spacing = "6">
            <DisplayName  />
            <Email  />
            <HStack mt = "5">
              {/* { !user!.email_verified && <VerifyEmail /> } */}
              <ChangePassword />
            </HStack>
          </Stack>
        </CardBody>
      </Card>
    </Stack>
  )
}