import { AirtableCredential, Field, GoogleSheetsCredential, Integration, NotionCredential, Table } from "@prisma/client";
import { TRPCError } from "@trpc/server";
import moment from "moment-timezone";
import { z } from "zod";
import { trackDestinationCreated } from "~/lib/analytics";
import { getDestinationObject } from "~/lib/integrations/getDestinationObject";
import { logDestinationCreated } from "~/lib/logsnag";
import { AirtableCredentialSchema, GoogleSheetsCredentialSchema, NotionCredentialSchema } from "~/prisma/generated/zod";
import { router, protectedProcedure } from "../trpc";

export const destinationRouter = router({
  validateCredentials: protectedProcedure
    .input(
      z.object({
        integration: z.nativeEnum(Integration),
        credentials: z.union([ AirtableCredentialSchema, GoogleSheetsCredentialSchema, NotionCredentialSchema ])
      })
    )
    .mutation(async ({ ctx: { session, logger }, input: { integration, credentials }}) => {
      const userId = session!.user.id;
      
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
        credentials: z.union([ AirtableCredentialSchema, GoogleSheetsCredentialSchema, NotionCredentialSchema ]),
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
    .mutation(async ({ ctx: { session, logger }, input: { integration, credentials, tableConfigs }}) => {
      const userId = session!.user.id;
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
        credentials: z.union([ AirtableCredentialSchema, GoogleSheetsCredentialSchema, NotionCredentialSchema ]),
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
    .mutation(async ({ ctx: { session, db, logger }, input: { integration, credentials, tableConfigs, name, syncStartDate, connectedAccountIds }}) => {
      const userId = session!.user.id;
      const destination = await db.destination.create({
        data: {
          userId,
          airtableCredential: integration === Integration.Airtable ? { create: { baseId: (credentials as AirtableCredential).baseId }} : undefined,
          notionCredential: integration === Integration.Notion ? { connect: { botId: (credentials as NotionCredential).botId }} : undefined,
          googleSheetsCredential: integration === Integration.Google ? { create: { spreadsheetId: (credentials as GoogleSheetsCredential).spreadsheetId }} : undefined,
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
        credentials: z.union([ AirtableCredentialSchema, GoogleSheetsCredentialSchema, NotionCredentialSchema ])
      })
    )
    .query(async ({ ctx: { session }, input: { integration, credentials }}) => {
      const userId = session!.user.id;

      if ( integration === Integration.Coda ) { return [] }
      const Destination = getDestinationObject({ integration, credentials, userId })!;
      await Destination.init();

      return Destination.getTables().then(response => response.tables)
    }),

  getDefaultTableConfig: protectedProcedure
    .input(
      z.object({
        integration: z.nativeEnum(Integration),
        credentials: z.union([ AirtableCredentialSchema, GoogleSheetsCredentialSchema, NotionCredentialSchema ])
      })
    )
    .mutation(async ({ ctx: { session }, input: { integration, credentials }}) => {
      const userId = session!.user.id;

      if ( integration === Integration.Coda ) { return { tableConfigs: [
        { table: Table.Institutions, isEnabled: true, tableId: '', fieldConfigs: [] },
        { table: Table.Accounts, isEnabled: true, tableId: '', fieldConfigs: [] },
        { table: Table.Transactions, isEnabled: true, tableId: '', fieldConfigs: []},
        { table: Table.Holdings, isEnabled: true, tableId: '', fieldConfigs: []},
        { table: Table.InvestmentTransactions, isEnabled: true, tableId: '', fieldConfigs: []}
      ]} }
      const Destination = getDestinationObject({ integration, credentials, userId })!;
      await Destination.init();

      return Destination.getDefaulTableConfigs()
    })
    
})