import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Field } from "@prisma/client";
import { TableConfig } from "~/types/shared/models";

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

export const parsePageProperties = ({ page, fieldConfigs }: { page: PageObjectResponse, fieldConfigs: TableConfig['fieldConfigs'] }) => {
  const fieldsUsed = fieldConfigs.map(fieldConfig => fieldConfig.fieldId);
  const pageProperties = Object.values(page.properties).filter(property => fieldsUsed.includes(property.id));
  return Object.fromEntries(pageProperties.map(property => {
    const fieldConfig = fieldConfigs.find(f => f.fieldId === property.id)!;
    return [ fieldConfig.field, getValueFromProperty(property)]
  })) as Record<Field, any>;
}