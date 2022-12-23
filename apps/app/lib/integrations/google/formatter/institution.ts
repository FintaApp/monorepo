import { Field } from "@prisma/client";
import moment from "moment-timezone";
import { InstitutionFormatter } from "../../base/types";

export const institution = {
  new: ({ item }) => {
    return {
      [Field.Id]: item.id,
      [Field.Name]: item.institution.name,
      [Field.Error]: item.error || ""
    };
  },
  updated: ({ item }) => {
    return {
      [Field.LastUpdate]: moment().toISOString(),
      [Field.Error]: item.error || ""
    };
  }
} as InstitutionFormatter