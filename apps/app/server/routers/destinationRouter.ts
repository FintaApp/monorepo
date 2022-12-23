import { AirtableCredential, Field, GoogleSheetsCredential, Integration, NotionCredential, Table } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import moment from "moment-timezone";
import { z } from "zod";
import { trackAirtableTokenAdded, trackDestinationCreated, trackNotionConnectionAdded } from "~/lib/analytics";
import { getDestinationObject } from "~/lib/integrations/getDestinationObject";
import { logAirtableTokenAdded, logDestinationCreated, logNotionConnectionAdded } from "~/lib/logsnag";
import { router, protectedProcedure } from "../trpc";
import { Context } from "../context";
import axios from "axios";
import crypto from "crypto";
import { getAuthorizationHeader } from "~/lib/integrations/airtable/_helpers";
import { Airtable } from "~/lib/integrations/airtable";

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
    .query(async ({ ctx: { session, db, logger }, input: { code, originUrl }}) => {
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
      ]);

      return "OK"
    }),
  exchangeAirtableToken: protectedProcedure
    .input(
      z.object({
        code: z.string(),
        originUrl: z.string(),
        state: z.string()
      })
    )
    .query(async ({ ctx: { session, db, logger }, input: { code, originUrl, state }}) => {
      const userId = session!.user.id;
      const cache = await db.airtableAuthorizationCache.findFirstOrThrow({ where: { userId, state }})
      logger.info("Fetched airtable cache", { cache });

      await db.airtableAuthorizationCache.delete({ where: { userId }});
      logger.info("Deleted authorization cache");

      const { codeVerifier } = cache;

      const { data } = await axios.post(`https://www.airtable.com/oauth2/v1/token`, {
        code_verifier: codeVerifier,
        redirect_uri: `${originUrl}/auth/airtable`,
        code,
        grant_type: 'authorization_code'
      }, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': getAuthorizationHeader()
        }
      });

      logger.info("Airtable oauth2 token response", { data });
      await db.airtableToken.upsert({ 
        where: { userId }, 
        create: {
          userId,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          tokenType: data.token_type,
          scope: data.scope,
          accessTokenExpiresAt: moment().add(parseInt(data.expires_in), 'seconds').toDate(),
          refreshTokenExpiresAt: moment().add(parseInt(data.refresh_expires_in), 'seconds').toDate()
        },
        update: {
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          tokenType: data.token_type,
          scope: data.scope,
          accessTokenExpiresAt: moment().add(parseInt(data.expires_in), 'seconds').toDate(),
          refreshTokenExpiresAt: moment().add(parseInt(data.refresh_expires_in), 'seconds').toDate()
        }
      })

      await Promise.all([
        trackAirtableTokenAdded({ userId }),
        logAirtableTokenAdded({ userId })
      ]);

      return "OK"
    }),
  
  getAirtableAuthorizationUrl: protectedProcedure // Source: https://github.com/Airtable/oauth-example/blob/main/index.js
    .mutation(async ({ ctx: { session, db, logger }}) => {
      const userId = session!.user.id;
      const state = crypto.randomBytes(100).toString('base64url');
      const codeVerifier = crypto.randomBytes(96).toString('base64url');
      const codeChallengeMethod = 'S256'
      const codeChallenge = crypto
            .createHash('sha256')
            .update(codeVerifier) // hash the code verifier with the sha256 algorithm
            .digest('base64') // base64 encode, needs to be transformed to base64url
            .replace(/=/g, '') // remove =
            .replace(/\+/g, '-') // replace + with -
            .replace(/\//g, '_'); // replace / with _ now base64url encoded

      await db.airtableAuthorizationCache.upsert({
        where: { userId },
        create: { userId, state, codeVerifier },
        update: { state, codeVerifier }
      }).then(cache => logger.info("Airtable cache upserted", { cache }));

      const redirectUriByEnv = {
        production: 'https://app.finta.io/auth/airtable',
        preview: 'https://staging.app.finta.io/auth/airtable',
        development: 'http://localhost:3000/auth/airtable'
      }

      const authorizationUrl = new URL(`https://www.airtable.com/oauth2/v1/authorize`);
      authorizationUrl.searchParams.set('code_challenge', codeChallenge);
      authorizationUrl.searchParams.set('code_challenge_method', codeChallengeMethod);
      authorizationUrl.searchParams.set('state', state);
      authorizationUrl.searchParams.set('client_id', process.env.AIRTABLE_OAUTH_CLIENT_ID! );
      authorizationUrl.searchParams.set('redirect_uri', redirectUriByEnv[(process.env.VERCEL_ENV || 'production') as keyof typeof redirectUriByEnv]);
      authorizationUrl.searchParams.set('response_type', 'code');
      authorizationUrl.searchParams.set('scope', 'data.records:read data.records:write schema.bases:read schema.bases:write');

      return { url: authorizationUrl.toString() }
    }),

  getAirtableBases: protectedProcedure
    .query(async ({ ctx: { session, logger }}) => {
      const userId = session!.user.id;
      const airtable = new Airtable({ userId, credentials: { id: "", baseId: "", apiKey: null }});
      await airtable.init();
      logger.info("Initialized Airtable");

      return airtable.getBases();
    }),

  doesUserHaveAirtableToken: protectedProcedure
    .query(async ({ ctx: { session, db }}) => {
      const userId = session!.user.id;

      return db.airtableToken.findFirst({ where: { userId }}).then(Boolean);
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