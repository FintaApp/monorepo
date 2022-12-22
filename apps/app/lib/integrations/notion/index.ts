import { Client } from "@notionhq/client";
import { DatabaseObjectResponse } from "@notionhq/client/build/src/api-endpoints";
import { Integration, NotionCredential, SyncError } from "@prisma/client";

import { GetDestinationTablesRepsonse, IntegrationBase, IntegrationBaseProps, ValidateDestinationCredentialsResponse } from "../base";

interface NotionProps extends IntegrationBaseProps {
  credentials: NotionCredential
}

export class Notion extends IntegrationBase {
  client: Client;
  constructor({ userId, credentials }: NotionProps) {
    super({ userId, credentials });
    this.integration = Integration.Notion;
    this.client = new Client({ auth: credentials.accessToken })
  }

  async validateCredentials(): Promise<ValidateDestinationCredentialsResponse> {
    return this.client.users.me({})
      .then(() => ({ isValid: true }))
      .catch(({ code }) => {
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

  async getTables(): Promise<GetDestinationTablesRepsonse> {
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
}