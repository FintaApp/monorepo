import { PlaidItemModel } from "~/types/backend/models"
import { TableConfigFields, InstitutionsTableFields } from "~/types/shared/models";

export const institution = ({ item, lastUpdate, headerValues, tableConfigFields }: { 
  item: PlaidItemModel;
  lastUpdate: string;
  headerValues: string[];
  tableConfigFields: Record<TableConfigFields, string> | {}
}) => {
  const formattedItem = {
    [InstitutionsTableFields.ID]: item.id,
    [InstitutionsTableFields.NAME]: item.institution.name,
    [InstitutionsTableFields.ERROR]: item.error || "",
    [InstitutionsTableFields.LAST_UPDATE]: lastUpdate
  };

  const userFieldMapping = Object.entries(tableConfigFields).reduce((allFields, [ tableConfigField, userDefinedField ]) => ({
    ...allFields,
    [userDefinedField]: formattedItem[tableConfigField as keyof typeof formattedItem]
  }), {} as Record<string, any>);

  return headerValues.map(headerValue => userFieldMapping[headerValue] || undefined)
}