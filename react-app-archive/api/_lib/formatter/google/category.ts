import { CategoryTableFields, TableConfigFields } from "@finta/types";

export const category = {
  new: ({ category, headerValues, tableConfigFields }: { 
    category: { id: string, name: string, category_group: string }, 
    headerValues: string[];
    tableConfigFields: Record<TableConfigFields, string> | {} 
  }) => {
    const formattedCategory = {
      [CategoryTableFields.ID]: category.id,
      [CategoryTableFields.NAME]: category.name,
      [CategoryTableFields.CATEGORY_GROUP]: category.category_group
    };

    const userFieldMapping = Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
      ...allFields,
      // eslint-disable-next-line
      [userDefinedField]: formattedCategory[tableConfigField as keyof typeof formattedCategory]
    }), {} as Record<string, any>);

    return headerValues.map(headerValue => userFieldMapping[headerValue] || undefined)
  }
}