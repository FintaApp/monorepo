import { Field } from "@prisma/client";
import { CategoryFormatter } from "../../base/types";

export const category = {
  new: ({ category }) => {
    return {
      [Field.Id]: category.id,
      [Field.Name]: category.name,
      [Field.Group]: category.category_group
    };
  }
} as CategoryFormatter