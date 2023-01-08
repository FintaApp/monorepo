import { Client } from "@notionhq/client";
import { DatabaseObjectResponse, PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Field, Integration, NotionCredential, SyncError } from "@prisma/client";
import { logUnhandledEvent } from "~/lib/logsnag";

import { IntegrationBase } from "../base";
import { parsePageProperties } from "./formatter/helpers";
import * as types from "../base/types";
import * as formatter from "./formatter";

interface NotionProps extends types.IntegrationBaseProps {
  credentials: NotionCredential
}

export class Notion extends IntegrationBase {
  client: Client;
  constructor({ userId, credentials }: NotionProps) {
    super({ userId, credentials });
    this.integration = Integration.Notion;
    this.client = new Client({ auth: credentials.accessToken })
    this.formatter = formatter;
  }

  async validateCredentials(): Promise<types.ValidateDestinationCredentialsResponse> {
    return this.client.users.me({})
      .then(() => ({ isValid: true }))
      .catch(({ code, ...rest }) => {
        if ( code === 'unauthorized' ) {
          return {
            isValid: false,
            error: {
              code: SyncError.NotAllowed,
              message: "Finta doesn't have access to your Notion workspace"
            }
          }
        }

        throw new Error("Unhandled destination authentication validation error - " + code)
      })
  }

  async getTables(): Promise<types.GetDestinationTablesRepsonse> {
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

  async queryTable({ tableId, fieldConfigs }: { tableId: string; fieldConfigs: { id?: string | undefined; field: Field; fieldId: string; tableConfigId?: string | undefined; }[]; }): Promise<types.IntegrationRecord[]> {
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
      properties: parsePageProperties({ page, fieldConfigs }),
      object: page
    }))
  }

  async createRecords({ tableId, data, fieldConfigs }: { tableId: string; data: Record<string, any>[]; fieldConfigs: { id?: string | undefined; field: Field; fieldId: string; tableConfigId?: string | undefined; }[]; }): Promise<types.IntegrationRecord[]> {
    return Promise.all(
      data.map(async properties => retryWrapper(() => this.client.pages.create({
        parent: { type: 'database_id', database_id: tableId },
        properties
      })).then(response => ({ 
        id: response.id, 
        object: response as PageObjectResponse, 
        properties: parsePageProperties({ page: response as PageObjectResponse, fieldConfigs }) 
      })))
    )
  }

  async updateRecords({ tableId, data, fieldConfigs }: { tableId: string; data: { fields: Record<string, any>; record: types.IntegrationRecord; iconUrl?: string;}[]; fieldConfigs: { id?: string | undefined; field: Field; fieldId: string; tableConfigId?: string | undefined; }[]; }): Promise<types.IntegrationRecord[]> {
    return Promise.all(data.map(async ({ record, fields, iconUrl }) => {
      return retryWrapper(() => this.client.pages.update({ 
        page_id: record.id as string, 
        properties: fields, 
        icon: iconUrl 
          ? { external: { url: iconUrl }}
          : undefined 
      }))
        .then(response => ({ id: response.id, object: response as PageObjectResponse, properties: parsePageProperties({ page: response as PageObjectResponse, fieldConfigs })  }))
    }))
  }

  async deleteRecords({ tableId, records }: { tableId: string; records: types.IntegrationRecord[]; }): Promise<void> {
    await Promise.all(records.map(async record => {
      return retryWrapper(() => this.client.pages.update({ page_id: record.id as string, archived: true }))
    }))
  }
}

// Helper
async function retryWrapper<T extends Array<any>, U>(func: () => Promise<U>): Promise<U> {
  let funcTry = 1;
  let didProcess = false;
  let response: any

  while ( !didProcess ) {
    ({ didProcess, response } = await func()
      .then(response => ({ didProcess: true, response }))
      .catch(async err => {
        if ( ['rate_limited' ].includes(err.code)) {
          console.log("HIT RATE LIMIT!", err);
          return { didProcess: false, response: null }
        } else {
          console.log("ERROR", err)
          if ( !err.body.message.includes('ancestor') ) {
            await logUnhandledEvent(`Unhandled Notion API error: ${JSON.stringify(err)}`)
          }
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