import { DestinationModel } from "~/types/backend/models";
import { OauthDestination } from "@finta/shared";

export const destination = ({ destination }: { destination: DestinationModel }): OauthDestination => ({
  id: destination.id,
  name: destination.name
})