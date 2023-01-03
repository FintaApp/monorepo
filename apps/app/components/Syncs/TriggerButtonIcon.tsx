import { Avatar, useColorModeValue as mode } from "@chakra-ui/react";
import { AiOutlineBank } from "react-icons/ai";

import { RouterOutput } from "~/lib/trpc";
import { IntegrationLogo } from "../Common/IntegrationLogo";

type Sync = RouterOutput['syncs']['getSyncs']['syncs'][0];

export const TriggerButtonIcon = ({ triggerDestination, triggerPlaidItem }: { triggerDestination?: Sync['triggerDestination']; triggerPlaidItem?: Sync['triggerPlaidItem']}) => {
  if ( triggerDestination ) {
    return (
      <IntegrationLogo
        integration = { triggerDestination.integration }
        h = {{ base: 6, md: 8 }} 
        w = "auto" 
        mr = "1"
      />
    )
  };

  if ( triggerPlaidItem ) {
    return (
      <Avatar
        size = "sm"
        mr = "1"
        src = { triggerPlaidItem.institution.logoUrl || undefined }
        icon = { <AiOutlineBank /> }
        fontSize = "1.25rem"
        shadow = { mode('xs', 'dark.xs') }
      />
    )
  };

  return <></>
}