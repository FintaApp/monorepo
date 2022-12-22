import { AirtableCredential, Field, GoogleSheetsCredential, Integration, NotionCredential, Table } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import moment from "moment-timezone";
import { z } from "zod";
import { trackDestinationCreated, trackNotionConnectionAdded } from "~/lib/analytics";
import { getDestinationObject } from "~/lib/integrations/getDestinationObject";
import { logDestinationCreated, logNotionConnectionAdded } from "~/lib/logsnag";
import { router, protectedProcedure } from "../trpc";
import { Context } from "../context";
import axios from "axios";

export const destinationRouter = router({
  validateCredentials: protectedProcedure
    .input(
      z.object({
        integration: z.nativeEnum(Integration),
        googleSpreadsheetId: z.optional(z.string()),
        notionBotId: z.optional(z.string()),
        airtableBaseId: z.optional(z.string()),
        airtableApiKey: z.optional(z.string()),
      })
    )
    .mutation(async ({ ctx: { session, logger, db }, input: { integration, googleSpreadsheetId, notionBotId, airtableApiKey, airtableBaseId }}) => {
      const userId = session!.user.id;
      const credentials = await getCredentials({ db, integration, googleSpreadsheetId, airtableApiKey, airtableBaseId, notionBotId })
      if ( !credentials ) { throw new TRPCError({ code: 'BAD_REQUEST', message: "Incorrect integration"})}

      const Destination = getDestinationObject({ integration, credentials, userId })!;
      await Destination.init();
      logger.info("Initialized destination")
      
      return Destination.validateCredentials()
    }),

  validateTableConfigs: protectedProcedure
    .input(
      z.object({
        integration: z.nativeEnum(Integration),
        googleSpreadsheetId: z.optional(z.string()),
        notionBotId: z.optional(z.string()),
        airtableBaseId: z.optional(z.string()),
        airtableApiKey: z.optional(z.string()),
        tableConfigs: z.array(
          z.object({ 
            table: z.nativeEnum(Table), 
            tableId: z.string(), 
            isEnabled: z.boolean(),
            fieldConfigs: z.array(
              z.object({
                field: z.nativeEnum(Field),
                fieldId: z.string()
              })
            )
          })
        )
      })
    )
    .mutation(async ({ ctx: { session, logger, db }, input: { integration, googleSpreadsheetId, notionBotId, airtableApiKey, airtableBaseId, tableConfigs }}) => {
      const userId = session!.user.id;
      const credentials = await getCredentials({ db, integration, googleSpreadsheetId, airtableApiKey, airtableBaseId, notionBotId })
      if ( !credentials ) { throw new TRPCError({ code: 'BAD_REQUEST', message: "Incorrect integration"})}
      
      const Destination = getDestinationObject({ integration, credentials, userId })!;
      await Destination.init();
      logger.info("Initialized destination");

      return Destination.validateTableConfigs({ tableConfigs, tableTypes: 'all' })
    }),

  createDestination: protectedProcedure
    .input(
      z.object({
        integration: z.nativeEnum(Integration),
        googleSpreadsheetId: z.optional(z.string()),
        notionBotId: z.optional(z.string()),
        airtableBaseId: z.optional(z.string()),
        airtableApiKey: z.optional(z.string()),
        tableConfigs: z.array(
          z.object({ 
            table: z.nativeEnum(Table), 
            tableId: z.string(), 
            isEnabled: z.boolean(),
            fieldConfigs: z.array(
              z.object({
                field: z.nativeEnum(Field),
                fieldId: z.string()
              })
            )
          })
        ),
        name: z.string(),
        syncStartDate: z.string(),
        connectedAccountIds: z.array(z.string())
      })
    )
    .mutation(async ({ ctx: { session, db, logger }, input: { integration, googleSpreadsheetId, notionBotId, airtableBaseId, tableConfigs, name, syncStartDate, connectedAccountIds }}) => {
      const userId = session!.user.id;

      const destination = await db.destination.create({
        data: {
          userId,
          airtableCredential: integration === Integration.Airtable ? { create: { baseId: airtableBaseId! }} : undefined,
          notionCredential: integration === Integration.Notion ? { connect: { botId: notionBotId! }} : undefined,
          googleSheetsCredential: integration === Integration.Google ? { create: { spreadsheetId: googleSpreadsheetId! }} : undefined,
          codaCredential: undefined, // TODO
          integration,
          name,
          syncStartDate: moment(syncStartDate).utc(true).toDate(),
          accounts: { connect: connectedAccountIds.map(id => ({ id }))},
          tableConfigs: { createMany: { data: tableConfigs.map(({ isEnabled, table, tableId }) => ({ isEnabled, table, tableId }))}}
        },
        include: { tableConfigs: true }
      });
      logger.info("Created destination", { destination });

      const destinationTableConfigs = destination.tableConfigs;
      await Promise.all(destinationTableConfigs.map(async config => {
        const fieldConfigs = tableConfigs.find(c => c.table === config.table)!.fieldConfigs;
        return db.destinationFieldConfig.createMany({ data: fieldConfigs.map(({ field, fieldId }) => ({ tableConfigId: config.id, field, fieldId }))})
      }))
      logger.info("Created field configs");

      await Promise.all([
        trackDestinationCreated({ userId, integration, destinationId: destination.id }),
        logDestinationCreated({ userId, integration, destinationId: destination.id })
      ]);

      return destination;
    }),

  getTables: protectedProcedure
    .input(
      z.object({
        integration: z.nativeEnum(Integration),
        googleSpreadsheetId: z.optional(z.string()),
        notionBotId: z.optional(z.string()),
        airtableBaseId: z.optional(z.string()),
        airtableApiKey: z.optional(z.string())
      })
    )
    .query(async ({ ctx: { session, db }, input: { integration, googleSpreadsheetId, notionBotId, airtableBaseId, airtableApiKey }}) => {
      const userId = session!.user.id;
      const credentials = await getCredentials({ db, integration, googleSpreadsheetId, airtableApiKey, airtableBaseId, notionBotId })

      if ( integration === Integration.Coda || !credentials ) { return [] }
      const Destination = getDestinationObject({ integration, credentials, userId })!;
      await Destination.init();

      return Destination.getTables().then(response => response.tables)
    }),

  getDefaultTableConfig: protectedProcedure
    .input(
      z.object({
        integration: z.nativeEnum(Integration),
        googleSpreadsheetId: z.optional(z.string()),
        notionBotId: z.optional(z.string()),
        airtableBaseId: z.optional(z.string()),
        airtableApiKey: z.optional(z.string())
      })
    )
    .mutation(async ({ ctx: { session, db }, input: { integration, googleSpreadsheetId, notionBotId, airtableApiKey, airtableBaseId }}) => {
      const userId = session!.user.id;
      const credentials = await getCredentials({ db, integration, googleSpreadsheetId, airtableApiKey, airtableBaseId, notionBotId })

      if ( integration === Integration.Coda || !credentials ) { return { tableConfigs: [
        { table: Table.Institutions, isEnabled: true, tableId: '', fieldConfigs: [] },
        { table: Table.Accounts, isEnabled: true, tableId: '', fieldConfigs: [] },
        { table: Table.Transactions, isEnabled: true, tableId: '', fieldConfigs: []},
        { table: Table.Holdings, isEnabled: true, tableId: '', fieldConfigs: []},
        { table: Table.InvestmentTransactions, isEnabled: true, tableId: '', fieldConfigs: []}
      ]} }
      const Destination = getDestinationObject({ integration, credentials, userId })!;
      await Destination.init();

      return Destination.getDefaulTableConfigs()
    }),

  getNotionCredentials: protectedProcedure
    .query(async ({ ctx: { session, db }}) => {
      const userId = session!.user.id;

      const notionCredentials = await db.notionCredential.findMany({ where: { userId }, select: { botId: true, workspaceName: true }});
      return notionCredentials
    }),

  exchangeNotionToken: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        originUrl: z.string()
      })
    )
    .mutation(async ({ ctx: { session, db, logger }, input: { code, originUrl }}) => {
      const userId = session!.user.id;
      const redirectUri = `${originUrl}/auth/notion`;

      const response = await axios.post('https://api.notion.com/v1/oauth/token', {
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri
      }, { auth: {
        username: process.env.NEXT_PUBLIC_NOTION_OAUTH_CLIENT_ID!,
        password: process.env.NOTION_OAUTH_SECRET!
      }});

      logger.info("Exchange Notion token response", { data: response.data });
      const { access_token, bot_id, workspace_name, workspace_icon, workspace_id, owner } = response.data;
      const connection = await db.notionCredential.create({ data: {
        userId,
        botId: bot_id,
        accessToken: access_token,
        workspaceName: workspace_name,
        workspaceId: workspace_id,
        workspaceIcon: workspace_icon,
        owner
      }});

      logger.info("Notion connection inserted", { response: connection })

      await Promise.all([
        trackNotionConnectionAdded({ userId }),
        logNotionConnectionAdded({ userId })
      ])
    })
})

// Helper
type GetCredentialsProps = {
  db: Context['db'];
  integration: Integration;
  googleSpreadsheetId?: string;
  airtableBaseId?: string;
  airtableApiKey?: string;
  notionBotId?: string;
}
const getCredentials = async ({ db, integration, googleSpreadsheetId, airtableBaseId, airtableApiKey, notionBotId }: GetCredentialsProps): Promise<AirtableCredential | NotionCredential | GoogleSheetsCredential | undefined> => {
  if ( integration === Integration.Google ) { return { id: "", spreadsheetId: googleSpreadsheetId! }};
  if ( integration === Integration.Airtable ) { return { id: "", baseId: airtableBaseId!, apiKey: airtableApiKey || null }};
  if ( integration === Integration.Notion ) {
    return db.notionCredential.findFirstOrThrow({ where: { botId: notionBotId }})
  }
}