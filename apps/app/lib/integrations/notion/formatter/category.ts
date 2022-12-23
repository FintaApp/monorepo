import { Field } from "@prisma/client";
import { CategoryFormatter } from "../../base/types";

export const category = {
  new: ({ category }) => {
    return {
      [Field.Id]: { rich_text: [{ text: { content: category.id }}]},
      [Field.Name]: { title: [{ text: { content: category.name|| "" }}]},
      [Field.Group]: { select: { name: category.category_group }}
    };
  }
} as CategoryFormatter