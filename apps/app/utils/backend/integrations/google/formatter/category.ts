import { CategoryTableFields, TableConfig } from "~/types/shared/models";

export const category = {
  new: ({ category, tableConfigFields }: { 
    category: { id: string, name: string, category_group: string }, 
    tableConfigFields: TableConfig['fields']
  }) => {
    const formattedCategory = {
      [CategoryTableFields.ID]: category.id,
      [CategoryTableFields.NAME]: category.name,
      [CategoryTableFields.CATEGORY_GROUP]: category.category_group
    };

    return Object.fromEntries(tableConfigFields.map(field => {
      const value = formattedCategory[field.field as keyof typeof formattedCategory];
      return [ field.field_id, value ]
    }))
  }
}