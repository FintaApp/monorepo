import { Client } from "@notionhq/client";
import { DatabaseObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Integrations_Enum } from "~/graphql/backend/sdk";
import { GetDestinationTablesResponse, ValidateDestinationCredentialsResponse } from "~/types/shared/functions";
import { DestinationErrorCode, DestinationTableTypes, NotionAuthentication, TableConfig, TableConfigFields, TableConfigs } from "~/types/shared/models";
import { logUnhandledEvent } from "../../logger";
import { IntegrationBase, IntegrationBaseProps, IntegrationRecord } from "../base";

import * as formatter from "./formatter";
import { parsePageProperties } from "./formatter/helper";

export class Notion extends IntegrationBase {
  client: Client;
  constructor({ authentication, logger, userId }: IntegrationBaseProps) { 
    super({ authentication, userId, logger }); 
    this.integration = Integrations_Enum.Notion 
  } 

  async init(): Promise<void> {
    this.client = new Client({ auth: (this.authentication as NotionAuthentication).access_token })
  }

  formatter = formatter;

  async validateAuthentication(): Promise<ValidateDestinationCredentialsResponse> {
    return this.client.users.me({})
      .then(response => {
        this.logger.info("Get 'me' response", { response });
        return { isValid: true }
      })
      .catch(({ code }) => {
        if ( code === 'unauthorized' ) {
          return {
            isValid: false,
            errorCode: DestinationErrorCode.NOT_ALLOWED,
            message: "Finta doesn't have access to your Notion workspace"
          }
        }

        throw new Error("Unhandled destination authentication validation error - " + code)
      })
  }

  async getTables(): Promise<GetDestinationTablesResponse> {
    let databases = [] as DatabaseObjectResponse[];
    let hasMore = true;
    let startCursor = null as string | null;

    while ( hasMore ) {
      const { results, next_cursor, has_more } = await this.client.search({
        filter: { property: 'object', value: 'database' },
        start_cursor: startCursor || undefined
      });

      databases = databases.concat((results as DatabaseObjectResponse[]).filter(result => !result.archived));
      hasMore = has_more;
      startCursor = next_cursor
    }

    return {
      tables: databases.map(database => {
        const { id, title, properties } = database;
        return {
          tableId: id,
          name: title[0].plain_text,
          fields: Object.entries(properties).map(([ name, data ]) => ({ fieldId: data.id, name, type: data.type }))
        }
      })
    }
  }

  async queryTable({ tableId, tableConfigFields }: { tableId: string; tableConfigFields: { field: TableConfigFields, field_id: string }[] }): Promise<IntegrationRecord[]> {
    let hasMore = true;
    let nextCursor = undefined as undefined | string;
    let pages = [] as PageObjectResponse[];

    while ( hasMore ) {
      const response = await retryWrapper(() => this.client.databases.query({ database_id: tableId, start_cursor: nextCursor }));
      hasMore = response.has_more;
      nextCursor = response.next_cursor || undefined;
      pages = pages.concat(response.results as PageObjectResponse[])
    }

    return pages.map(page => ({ 
      id: page.id, 
      properties: parsePageProperties({ page, tableConfigFields }),
      object: page
    }))
  }

  async createRecords({ tableId, data, tableConfigFields }: { tableId: string; data: Record<string, any>[]; tableConfigFields: TableConfig['fields']}): Promise<IntegrationRecord[]> {
    return Promise.all(
      data.map(async properties => retryWrapper(() => this.client.pages.create({
        parent: { type: 'database_id', database_id: tableId },
        properties
      })).then(response => ({ 
        id: response.id, 
        object: response as PageObjectResponse, 
        properties: parsePageProperties({ page: response as PageObjectResponse, tableConfigFields }) 
      })))
    )
  }

  async updateRecords({ tableId, data, tableConfigFields }: { tableId: string, data: { fields: Record<string, any>, record: IntegrationRecord }[]; tableConfigFields: TableConfig['fields']}): Promise<IntegrationRecord[]> {
    return Promise.all(data.map(async ({ record, fields }) => {
      return retryWrapper(() => this.client.pages.update({ page_id: record.id as string, properties: fields }))
        .then(response => ({ id: response.id, object: response as PageObjectResponse, properties: parsePageProperties({ page: response as PageObjectResponse, tableConfigFields })  }))
    }))
  }

  async deleteRecords({ tableId, records }: { tableId: string; records: IntegrationRecord[]}): Promise<void> {
    await Promise.all(records.map(async record => {
      return retryWrapper(() => this.client.pages.update({ page_id: record.id as string, archived: true }))
    }))
  }
}

async function retryWrapper<T extends Array<any>, U>(func: () => Promise<U>): Promise<U> {
  let funcTry = 1;
  let didProcess = false;
  let response: any

  while ( !didProcess ) {
    ({ didProcess, response } = await func()
      .then(response => ({ didProcess: true, response }))
      .catch(async err => {
        if ( ['rate_limited' ].includes(err.code)) {
          console.log("HIT RATE LIMIT!", err)
          return { didProcess: false, response: null }
        } else {
          await logUnhandledEvent(`Unhandled Notion API error: ${JSON.stringify(err)}`);
          return { didProcess: true, response: null }
        }
      }));

    if ( !didProcess ) {
      await timeout(funcTry * 500)
      funcTry = funcTry + 1;
    }
  }

  return response
}

async function timeout(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
