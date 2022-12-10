import { DestinationModel } from "../../types";
import { OauthDestination } from "@finta/types";

export const destination = ({ destination }: { destination: DestinationModel }): OauthDestination => ({
  id: destination.id,
  name: destination.name
})