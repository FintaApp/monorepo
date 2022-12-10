import { CategoryTableFields, TableConfigFields } from "@finta/types";

export const category = {
  new: ({ category, tableConfigFields }: { category: { id: string, name: string, category_group: string }, tableConfigFields: Record<TableConfigFields, string> | {} }) => {
    const formattedCategory = {
      [CategoryTableFields.ID]: { rich_text: [{ text: { content: category.id }}]},
      [CategoryTableFields.NAME]: { title: [{ text: { content: category.name|| "" }}]},
      [CategoryTableFields.CATEGORY_GROUP]: { select: { name: category.category_group }}
    };

    return Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      [userDefinedField]: formattedCategory[tableConfigField as keyof typeof formattedCategory]
    }), {} as Record<string, any>);
  }
}