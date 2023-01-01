import { Field } from "@prisma/client";
import moment from "moment-timezone";
import { InstitutionFormatter } from "../../base/types";

export const institution = {
  new: ({ item }) => {
    return {
      [Field.Id]: { rich_text: [{ text: { content: item.id }}]},
      [Field.Name]: { title: [{ text: { content: item.institution.name }}]},
      [Field.Error]: { rich_text: [{ text: { content: item.error || "" }}]}
    };
  },
  updated: ({ item, timezone }) => {
    return {
      [Field.LastUpdate]: { date: { start: (timezone ? moment.tz(timezone) : moment()).toISOString(true) }},
      [Field.Error]: { rich_text: [{ text: { content: item.error || "" }}]}
    };
  }
} as InstitutionFormatter