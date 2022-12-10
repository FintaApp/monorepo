import { Request, Response } from "express";

import { graphql } from "../_lib";
import { Frequencies_Enum } from "../_lib/graphql/sdk";

// Helper action to make sure user has all necessary properties

export default async (req: Request, res: Response) => {
  const { userId } = req.body.input;

  let { userProfile } = await graphql.GetUserProfile({ userId });
  if ( !userProfile ) {
    const timezone = await graphql.GetBaseUser({ user_id: userId }).then(response => response.user!.metadata?.timezone)
    userProfile = await graphql.InsertUserProfile({
      userProfile: {
        user_id: userId,
        timezone,
        is_subscribed_general: true,
        is_subscribed_sync_updates: true,
        sync_updates_frequency: Frequencies_Enum.Weekly
      }
    }).then(response => response.userProfile)
  }

  res.status(200).send({ ok: true })
}