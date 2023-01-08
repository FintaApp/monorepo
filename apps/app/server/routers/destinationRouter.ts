import { AirtableCredential, Field, GoogleSheetsCredential, Integration, NotionCredential, Table, SyncTrigger } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { trackDestinationAccountsUpdated, trackDestinationCreated, trackDestinationDeleted, trackDestinationUpdated } from "~/lib/analytics";
import { getDestinationObject } from "~/lib/integrations/getDestinationObject";
import { logDestinationCreated, logDestinationDeleted, logsnagInsight } from "~/lib/logsnag";
import { router, protectedProcedure } from "../trpc";
import { Context } from "../context";
import { createToken, hash } from "~/lib/crypto";
import _ from "lodash";
import { inngest } from "~/lib/inngest";

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
    .mutation(async ({ ctx: { user, logger, db }, input: { integration, googleSpreadsheetId, notionBotId, airtableApiKey, airtableBaseId }}) => {
      const userId = user.id;
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
    .mutation(async ({ ctx: { user, logger, db }, input: { integration, googleSpreadsheetId, notionBotId, airtableApiKey, airtableBaseId, tableConfigs }}) => {
      const userId = user.id;

      if ( integration === Integration.Coda ) { return { isValid: true, errors: [] }}
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
        codaCredentialId: z.optional(z.string()),
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
    .mutation(async ({ ctx: { user, db, logger }, input: { integration, googleSpreadsheetId, notionBotId, airtableBaseId, tableConfigs, name, syncStartDate, connectedAccountIds, codaCredentialId }}) => {
      const userId = user.id;

      const destination = await db.destination.create({
        data: {
          airtableCredential: integration === Integration.Airtable ? { create: { baseId: airtableBaseId! }} : undefined,
          notionCredential: integration === Integration.Notion ? { connect: { botId_userId: { botId: notionBotId!, userId } }} : undefined,
          googleSheetsCredential: integration === Integration.Google ? { create: { spreadsheetId: googleSpreadsheetId! }} : undefined,
          codaCredential: integration === Integration.Coda ? { connect: { id: codaCredentialId }} : undefined,
          integration,
          name,
          syncStartDate,
          accounts: { connect: connectedAccountIds.map(id => ({ id }))},
          tableConfigs: { createMany: { data: tableConfigs.map(({ isEnabled, table, tableId }) => ({ isEnabled, table, tableId }))}},
          user: { connect: { id: userId }}
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

      const insightsPromise = Promise.all([
          db.destination.groupBy({ where: { disabledAt: null }, by: ['integration'], _count: { _all: true, integration: true } }),
          db.destination.aggregate({ where: { disabledAt: null }, _count: true })
      ])
        .then(([ groupedResults, totalResults ]) => {
          Promise.all([
            logsnagInsight({ title: 'Airtable Destinations', value: groupedResults.find(r => r.integration === Integration.Airtable)?._count.integration || 0, icon: 'destination' }),
            logsnagInsight({ title: 'Coda Destinations', value: groupedResults.find(r => r.integration === Integration.Coda)?._count.integration || 0, icon: 'destination' }),
            logsnagInsight({ title: 'Google Sheets Destinations', value: groupedResults.find(r => r.integration === Integration.Google)?._count.integration || 0, icon: 'destination' }),
            logsnagInsight({ title: 'Notion Destinations', value: groupedResults.find(r => r.integration === Integration.Notion)?._count.integration || 0, icon: 'destination' }),
            logsnagInsight({ title: 'Total Destinations', value: totalResults._count, icon: 'destination' })
          ])
        }).catch(() => null);

      await Promise.all([
        trackDestinationCreated({ userId, integration, destinationId: destination.id }),
        logDestinationCreated({ userId, integration, destinationId: destination.id }),
        insightsPromise
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
    .query(async ({ ctx: { user, db }, input: { integration, googleSpreadsheetId, notionBotId, airtableBaseId, airtableApiKey }}) => {
      const userId = user.id;
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
    .mutation(async ({ ctx: { user, db }, input: { integration, googleSpreadsheetId, notionBotId, airtableApiKey, airtableBaseId }}) => {
      const userId = user.id;
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

    getAllDestinations: protectedProcedure
    .query(async ({ ctx: { user, db }}) => {
      const userId = user.id;
      return db.destination.findMany({ 
        where: { userId, disabledAt: null }, 
        select: { id: true, name: true, codaCredential: { select: { exchangedAt: true }} },
        orderBy: { createdAt: 'asc' }
      }).then(destinations => destinations.filter(destination => !destination.codaCredential || !!destination.codaCredential.exchangedAt))
    }),
  
    getDestination: protectedProcedure
      .input(
        z.object({
          id: z.string()
        })
      )
      .query(async ({ ctx: { user, db }, input: { id }}) => {
        const userId = user.id;
        return db.destination.findFirstOrThrow({ 
          where: { userId, id },
          select: {
            id: true,
            airtableCredential: true,
            googleSheetsCredential: true,
            notionCredential: {
              select: { botId: true }
            },
            integration: true,
            name: true,
            syncStartDate: true,
            createdAt: true,
            accounts: true,
            tableConfigs: {
              include: { fieldConfigs: true }
            }
          }
        })
      }),
    
    updateConnectedAccounts: protectedProcedure
      .input(
        z.object({
          destinationId: z.string(),
          action: z.enum(["add", "remove"]),
          accountIds: z.array(z.string())
        })
      )
      .mutation(async ({ ctx: { user, db, logger }, input: { destinationId, action, accountIds }}) => {
        const userId = user.id;
        const currentAccountIds = await db.destination.findFirstOrThrow({ where: { id: destinationId }, select: { accounts: true }})
          .then(response => {
            logger.info("Fetched current destination accounts", { response });
            return response.accounts.map(account => account.id);
          });

        const actualAccountIds = action === 'add' 
          ? accountIds.filter(id => !currentAccountIds.includes(id))
          : accountIds.filter(id => currentAccountIds.includes(id));
        
        await db.destination.update({ where: { id: destinationId }, data: { 
          accounts: {
            connect: action === 'add' ? actualAccountIds.map(id => ({ id })) : undefined,
            disconnect: action === 'remove' ? actualAccountIds.map(id => ({ id })) : undefined
        }}})

        await trackDestinationAccountsUpdated({ userId, action, count: actualAccountIds.length, destinationId });
        return "OK"
      }),

    updateCredentials: protectedProcedure
      .input(
        z.object({
          destinationId: z.string(),
          googleSpreadsheetId: z.optional(z.string()),
          notionBotId: z.optional(z.string()),
          airtableBaseId: z.optional(z.string()),
          airtableApiKey: z.optional(z.string())
        })
      )
      .mutation(async ({ ctx: { user, db, logger }, input: { destinationId, googleSpreadsheetId, notionBotId, airtableBaseId }}) => {
        const userId = user.id;
        const destination = await db.destination.findFirstOrThrow({ 
          where: { id: destinationId, userId },
          select: { integration: true, googleSheetsCredentialId: true, notionCredentialId: true, airtableCredentialId: true }
        })
        logger.info("Fetched destination", { destination })

        const { integration } = destination
        if ( integration === Integration.Airtable ) {
          await db.airtableCredential.update({ where: { id: destination.airtableCredentialId! }, data: { baseId: airtableBaseId }})
            .then(response => logger.info("Airtable credential updated", { response }));
        }

        if ( integration === Integration.Google ) {
          await db.googleSheetsCredential.update({ where: { id: destination.googleSheetsCredentialId! }, data: { spreadsheetId: googleSpreadsheetId }})
            .then(response => logger.info("Google sheets credential updated", { response }));
        }

        if ( integration === Integration.Notion ) {
          await db.notionCredential.update({ where: { id: destination.notionCredentialId! }, data: { botId: notionBotId }})
            .then(response => logger.info("Notion credential updated", { response }));
        }

        await trackDestinationUpdated({ userId, integration, destinationId, field: 'credentials' });
        return "OK"
      }),

    updateDestination: protectedProcedure
      .input(
        z.object({
          destinationId: z.string(),
          name: z.optional(z.string()),
          syncStartDate: z.optional(z.string()),
          tableConfigs: z.optional(z.array(
            z.object({ 
              id: z.string(),
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
          )),
        })
      )
      .mutation(async ({ ctx: { user, db, logger }, input: { destinationId, name, syncStartDate, tableConfigs }}) => {
        const userId = user.id;
        const { integration } = await db.destination.findFirstOrThrow({ where: { userId, id: destinationId }, select: { integration: true }});
        logger.info("Fetched integration", { integration });

        if ( name || syncStartDate ) {
          await db.destination.update({ where: { id: destinationId }, data: { name, syncStartDate }})
            .then(response => logger.info("Updated destination", { response }))
        }

        if ( tableConfigs ) {
          const upsertedTableConfigs = await db.$transaction(tableConfigs.map(({ table, tableId, isEnabled }) => db.destinationTableConfig.upsert({ 
            where: { destinationId_table: { destinationId, table} },
            create: { table, tableId, isEnabled, destinationId },
            update: { table, tableId, isEnabled }
          })));

          if ( integration !== Integration.Coda ) {
            await Promise.all(upsertedTableConfigs.map(upsertedTableConfig => {
              const fieldConfigs = tableConfigs.find(config => config.table === upsertedTableConfig.table)!.fieldConfigs;
              return Promise.all([
                  db.$transaction(fieldConfigs.map(({ field, fieldId }) => db.destinationFieldConfig.upsert({
                    where: { tableConfigId_field: { tableConfigId: upsertedTableConfig.id, field }},
                    create: { tableConfigId: upsertedTableConfig.id, field, fieldId },
                    update: { field, fieldId }
                  }))),

                  db.destinationFieldConfig.deleteMany({ where: { tableConfigId: upsertedTableConfig.id, field: { notIn: fieldConfigs.map(c => c.field )}}})
              ])
            }));
          }
        }


        await trackDestinationUpdated({ userId, destinationId, integration, field: name ? 'name' : syncStartDate ? 'sync_start_date' : 'table_configs' });
      }),

    disableDestination: protectedProcedure
      .input(z.string())
      .mutation(async ({ ctx: { user, db, logger }, input: id }) => {
        const userId = user.id;
        const destination = await db.destination.findFirstOrThrow({ where: { id, userId }});
        logger.info("Fetched destination", { destination });

        await Promise.all([
          db.destination.update({ where: { id }, data: { disabledAt: new Date(), accounts: { set: [] } }}).then(() => {
            logger.info("Destination disabled");

            return Promise.all([
                db.destination.groupBy({ where: { disabledAt: null }, by: ['integration'], _count: { _all: true, integration: true } }),
                db.destination.aggregate({ where: { disabledAt: null }, _count: true })
            ])
            .then(([ groupedResults, totalResults ]) => {
              Promise.all([
                logsnagInsight({ title: 'Airtable Destinations', value: groupedResults.find(r => r.integration === Integration.Airtable)?._count.integration || 0, icon: 'destination' }),
                logsnagInsight({ title: 'Coda Destinations', value: groupedResults.find(r => r.integration === Integration.Coda)?._count.integration || 0, icon: 'destination' }),
                logsnagInsight({ title: 'Google Sheets Destinations', value: groupedResults.find(r => r.integration === Integration.Google)?._count.integration || 0, icon: 'destination' }),
                logsnagInsight({ title: 'Notion Destinations', value: groupedResults.find(r => r.integration === Integration.Notion)?._count.integration || 0, icon: 'destination' }),
                logsnagInsight({ title: 'Total Destinations', value: totalResults._count, icon: 'destination' })
              ])
            }).catch(() => null);
          }),

          destination.integration === Integration.Google 
            ? db.googleSheetsCredential.delete({ where: { id: destination.googleSheetsCredentialId! }})
              .then(() => logger.info("Google Sheets credentials deleted"))
            : Promise.resolve(),

          trackDestinationDeleted({ userId, integration: destination.integration, destinationId: id }),

          logDestinationDeleted({ userId, destinationId: id, integration: destination.integration })
        ])
      }),

    createOauthCode: protectedProcedure
      .mutation(async ({ ctx: { db, logger }}) => {
        const accessToken = createToken();
        const accessTokenHash = hash(accessToken);

        const oauthCode = await db.codaCredential.create({ data: { accessToken, accessTokenHash }});
        logger.info("Created Coda credential", { oauthCode })

        return { code: oauthCode.id }
      }),

    triggerManualSync: protectedProcedure
      .input(
        z.object({
          destinationId: z.string(),
          startDate: z.string().optional()
        })
      )
      .mutation(async ({ ctx: { db, logger, user }, input: { destinationId, startDate }}) => {
        const destination = await db.destination.findFirstOrThrow({ where: { id: destinationId }, include: { accounts: { include: { item: true }} }});
        logger.info("Fetched destination", { destination });
        const plaidItems = _.uniqBy(destination.accounts.map(account => account.item).filter(item => item.error !== 'ITEM_LOGIN_REQUIRED'), 'id')
        if ( destination.integration === Integration.Coda ) { return { syncId: null, code: 'coda_integration' }}
        if ( plaidItems.length === 0 ) { return { syncId: null, code: 'no_connected_accounts' }}
        const trigger = startDate ? SyncTrigger.HistoricalSync : SyncTrigger.Refresh;

        // Create sync
        const sync = await db.sync.create({
          data: {
            trigger,
            triggerDestinationId: destinationId,
            userId: user.id
          }
        })
        logger.info("Created sync", { sync });

        // Trigger inngest event
        await inngest.send({
          name: 'destination/sync',
          data: { 
            destinationId, 
            startDate: startDate || destination.syncStartDate, 
            syncId: sync.id,
            trigger 
          },
          user: { id: destination.userId }
        })
        logger.info("Inngest event started")

        // Return
        return { syncId: sync.id, code: null }
      }),
    
    getSync: protectedProcedure
      .input( z.string())
      .query(async ({ ctx: { db }, input: syncId }) => {
        return db.sync.findFirstOrThrow({ 
          where: { id: syncId }, 
          include: { results: true }
        })
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