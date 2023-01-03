import { Destination } from "@prisma/client";
import { OauthDestination } from "@finta/shared";

export const destination = ({ destination }: { destination: Destination }): OauthDestination => ({
  id: destination.id,
  name: destination.name
})