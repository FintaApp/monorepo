import { CategoryTableFields, TableConfigFields } from "../../types/shared";

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
      [userDefinedField]: formattedCategory[tableConfigField]
    }), {} as Record<string, string>);

    return headerValues.map(headerValue => userFieldMapping[headerValue] || undefined)
  }
}