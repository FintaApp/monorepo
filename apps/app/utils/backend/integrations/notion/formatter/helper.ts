import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { TableConfigFields } from "~/types/shared/models";

const getValueFromProperty = (property: PageObjectResponse['properties'][0]) => {
  if ( property.type === 'checkbox' ) { return property.checkbox }
  if ( property.type === 'date' ) { return property.date?.start }
  if ( property.type === 'number' ) { return property.number }
  if ( property.type === 'rich_text' ) { return property.rich_text[0]?.plain_text }
  if ( property.type === 'relation' ) { return property.relation[0]?.id }
  if ( property.type === 'select' ) { return property.select?.name }
  if ( property.type === 'title' ) { return property.title[0]?.plain_text }

  return null;
}

export const parsePageProperties = ({ page, tableConfigFields }: { page: PageObjectResponse, tableConfigFields: { field: TableConfigFields, field_id: string }[] }) => {
  const properties = Object.fromEntries(Object.values(page.properties)
    .map(property => {
      const field = tableConfigFields.find(f => f.field_id === property.id);
      if ( !field ) { return; }
      return [ field.field, getValueFromProperty(property) ]
    })
    .filter(x => !!x)
  ) as Record<TableConfigFields, any>;

  if ( Object.keys(properties).length === 0 ) {
    console.log("Empty properties");
    console.log("Page", page);
    console.log("config fields", tableConfigFields);
  }
  return properties;
}