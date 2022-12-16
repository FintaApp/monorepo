import { CategoryTableFields, TableConfig } from "~/types/shared/models";
import { Category } from "../../base";

export const category = {
  new: ({ category, tableConfigFields }: { category: Category, tableConfigFields: TableConfig['fields'] }) => {
    const formattedCategory = {
      [CategoryTableFields.ID]: category.id,
      [CategoryTableFields.NAME]: category.name,
      [CategoryTableFields.CATEGORY_GROUP]: category.category_group
    };

    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedCategory[field.field];
      return [ field.field_id, value ]
    }))
  }
}