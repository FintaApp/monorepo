import { CategoryTableFields, TableConfigFields } from "@finta/types";

export const category = {
  new: ({ category, tableConfigFields }: { category: { id: string, name: string, category_group: string }, tableConfigFields: Record<TableConfigFields, string> | {} }) => {
    const formattedCategory = {
      [CategoryTableFields.ID]: category.id,
      [CategoryTableFields.NAME]: category.name,
      [CategoryTableFields.CATEGORY_GROUP]: category.category_group
    };

    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      // eslint-disable-next-line
      [userDefinedField]: formattedCategory[tableConfigField as keyof typeof formattedCategory]
    }), {} as Record<string, any>);
  }
}