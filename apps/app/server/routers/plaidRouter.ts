import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { trackPlaidLinkInitiated, backendIdentify as identify, trackInstitutionReconnected, trackInstitutionAccountsUpdated, trackInstitutionCreated, trackInstitutionDeleted, trackPlaidAccountUpdated } from "~/lib/analytics";
import { logInstitutionCreated, logInstitutionDeleted, logInstitutionReconnected } from "~/lib/logsnag";
import { createLinkToken, exchangePublicToken, removeItem } from "~/lib/plaid";
import { router, protectedProcedure } from "../trpc";
import { inngest } from "~/lib/inngest";

export const plaidRouter = router({
  createLinkToken: protectedProcedure
    .input(
      z.object({
        product: z.optional(z.enum(['transactions', 'investments'])),
        plaidItemId: z.optional(z.string()),
        isAccountSelectionEnabled: z.optional(z.boolean())
      })
    )
    .mutation(async ({ ctx: { req: { headers: { host }}, session, logger, db }, input: { product, plaidItemId, isAccountSelectionEnabled }}) => {
      const mode = plaidItemId
        ? ( isAccountSelectionEnabled ? 'addAccounts' : 'reconnect')
        : 'create'
      const userId = session!.user.id;
      const originUrl = `https://${host}`;
      const webhookURL = `${originUrl}/api/plaid/webhook`;
      const redirectUri = `${originUrl}/plaid-oauth`;

      logger.info("Host", { host });

      const accessToken = plaidItemId 
        ? await db.plaidItem.findFirstOrThrow({ where: { id: plaidItemId }, select: { accessToken: true }})
            .then(response => {
              logger.info("Get Plaid Item", { response });
              return response.accessToken!
            })
        : undefined;

      const { link_token: token } = await createLinkToken({
        userId,
        products: product ? [ product ] : [],
        webhookURL,
        redirectUri,
        accessToken,
        isAccountSelectionEnabled
      })
      .then(response => {
        logger.info("Link token created", { data: response.data });
        return response.data 
      })
      .catch(error => {
        logger.error(error, { data: error.response.data });
        throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
      })

      await db.linkToken.upsert({ 
        where: { userId },
        update: { token },
        create: { token, userId }
      })
      .then(response => logger.info("Link token added to db", { data: response }))

      await trackPlaidLinkInitiated({ userId, mode })
        .then(() => logger.info("Plaid Link initiated event tracked"));

      return { token };
    }),

  updatePlaidAccount: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string()
      })
    )
    .mutation(async ({ ctx: { session, logger, db }, input: { id, name }}) => {
      return db.plaidAccount.update({ where: { id }, data: { name }})
        .then(async response => {
          logger.info("Account updated", { response });
          await trackPlaidAccountUpdated({ userId: session!.user.id, field: 'name' })
        })
    }),
  
  removePlaidItem: protectedProcedure
    .input(
      z.object({
        plaidItemId: z.string()
      })
    )
    .mutation(async ({ ctx: { session, logger, db }, input: { plaidItemId }}) => {
      const userId = session!.user.id;
      const plaidItem = await db.plaidItem.update({ 
        where: { id: plaidItemId },
        data: { disabledAt: new Date()},
        select: { institution: { select: { name: true }}, accessToken: true, accounts: true }
      });

      await Promise.all([
        removeItem({ accessToken: plaidItem.accessToken! })
          .then(response => logger.info("Plaid Item access token disabled", { response: response.data })),

        db.$transaction(plaidItem.accounts.map(account => db.plaidAccount.update({ where: { id: account.id }, data: { destinations: { set: []} }}))),
        
        trackInstitutionDeleted({ userId, itemId: plaidItemId }),

        logInstitutionDeleted({ institution: plaidItem.institution.name, userId, itemId: plaidItemId })
      ])
    }),

  removePlaidLink: protectedProcedure
    .mutation(async ({ ctx: { session, logger, db }}) => {
      const userId = session!.user.id;
      return db.linkToken.delete({ where: { userId }})
        .then(response => logger.info("Link token deleted", { response }))
    }),

  getAllPlaidAccounts: protectedProcedure
    .query(async ({ ctx: { session, db }}) => {
      const userId = session!.user.id;
      return db.plaidAccount.findMany({
        where: { item: { userId, disabledAt: null }},
        select: { 
          id: true, 
          name: true,
          mask: true,
          item: { select: { institution: { select: { name: true }}}}
        },
        orderBy: { item: { institution: { name: 'asc'}}}
      })
    }),

  getAllPlaidItems: protectedProcedure
    .query(async ({ ctx: { session, db }}) => {
      const userId = session!.user.id;
      return db.plaidItem.findMany({ 
        where: { userId, disabledAt: null }, 
        select: { id: true },
        orderBy: { createdAt: 'asc' }
      }) 
    }),
  
  getPlaidItem: protectedProcedure
    .input(
      z.object({
        id: z.string()
      })
    )
    .query(async ({ ctx: { session, db }, input: { id }}) => {
      const userId = session!.user.id;
      return db.plaidItem.findFirstOrThrow({ 
        where: { userId, id },
        select: {
          id: true,
          institution: true,
          accounts: true,
          createdAt: true,
          lastSyncedAt: true,
          isHistoricalUpdateComplete: true,
          isInitialUpdateComplete: true,
          error: true,
          consentExpiresAt: true
        }
      })
    }),

  exchangePublicToken: protectedProcedure
    .input(
      z.object({
        publicToken: z.string(),
        institution: z.object({
          institution_id: z.string(),
          name: z.string()
        }),
        accounts: z.array(z.object({
          id: z.string(),
          mask: z.optional(z.string().or(z.null())),
          name: z.string(),
          subtype: z.string(),
          type: z.string(),
          verification_status: z.optional(z.string().or(z.null()))
        }))
      })
    )
    .mutation(async ({ ctx: { session, logger, db }, input: { publicToken, institution, accounts }}) => {
      const userId = session!.user.id;
      const { access_token: accessToken, item_id } = await exchangePublicToken({ publicToken })
        .then(response => {
          logger.info("Exchange public token response", { data: response.data });
          return response.data
        })
        .catch(error => {
          logger.error(error, { data: error.response.data });
          throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR' })
        })

      // Check to see if item and institution already exists
      const dbItem = await db.plaidItem.findFirst({ where: { id: item_id }, select: { id: true, error: true, consentExpiresAt: true }})
      logger.info("Fetched DB item", { item: dbItem })

      const newPlaidItem = await db.plaidItem.upsert({
          where: { id: item_id },
          create: {
            id: item_id,
            accessToken,
            institution: {
              connectOrCreate: {
                where: { id: institution.institution_id },
                create: {
                  id: institution.institution_id,
                  name: institution.name
                }
              }
            },
            user: {
              connect: { id: userId }
            },
            availableProducts: [],
            billedProducts: []
          },
          update: {
            error: null,
            consentExpiresAt: null
          },
          include: { accounts: true }
        })
        .then(response => {
          logger.info("Plaid item upserted", { item: response });
          return response;
        })

        // Insert / Delete Accounts 
        const [ accountsCreated, accountsDeleted ] = await Promise.all([
          db.plaidAccount.createMany({
            data: accounts.map(account => ({
              id: account.id,
              plaidItemId: item_id,
              mask: account.mask,
              name: account.name
            })),
            skipDuplicates: true
          }).then(({ count }) => {
            if ( count > 0 ) { logger.info("Accounts created", { count })};
            return count;
          }),

          db.plaidAccount.deleteMany({ where: { id: { notIn: accounts.map(account => account.id ) }, plaidItemId: item_id }})
          .then(({ count }) => {
            if ( count > 0 ) { logger.info("Accounts deleted", { count })};
            return count;
          })
        ])

      const updateUserInstitutionsCountPromise = dbItem ? Promise.resolve()
      : db.plaidItem.count({ where: { userId, disabledAt: null }})
        .then(async count => {
          logger.info("Fetched user's total items", { count })
          return identify({ userId, traits: { institutions_count: count }})
            .then(() => logger.info("Identified user with institutions_acount"))
        })
      
      const innestPromise = dbItem ? Promise.resolve()
        : inngest.send({ name: 'plaid_item/setup', data: { plaidItemId: item_id }, user: { id: userId }});

      const trackInstitutionReconnectedPromise = dbItem && (dbItem.error || dbItem.consentExpiresAt)
        ? Promise.all([
          trackInstitutionReconnected({ userId, itemId: item_id }),
          logInstitutionReconnected({ institution: institution.name, userId, itemId: item_id })
        ])
        : Promise.resolve();

      const trackInstitutionAccountsUpdatedPromise = dbItem && (accountsDeleted > 0 || accountsCreated > 0)
        ? trackInstitutionAccountsUpdated({ userId, itemId: item_id, accountsCreated, accountsDeleted})
        : Promise.resolve();

      const trackInstitutionCreatedPromise = dbItem
        ? Promise.resolve()
        : Promise.all([
          trackInstitutionCreated({ userId, institution: institution.name, itemId: item_id }),
          logInstitutionCreated({ userId, institution: institution.name, itemId: item_id })
        ])

      const removeLinkTokenPromise = db.linkToken.delete({ where: { userId }})
        .then(response => {
          logger.info("Removed link token from db", { response })
        })

      await Promise.all([
        innestPromise,
        updateUserInstitutionsCountPromise,
        trackInstitutionReconnectedPromise,
        trackInstitutionAccountsUpdatedPromise,
        trackInstitutionCreatedPromise,
        removeLinkTokenPromise
      ])

      return db.plaidItem.findFirst({ 
        where: { id: newPlaidItem.id }, 
        select: { 
          id: true, 
          institution: { select: { name: true }},
          accounts: true
        }}); // Doing this since accounts weren't created in newPlaidItem
    }),

    connectDestinationsToPlaidAccounts: protectedProcedure
      .input(
        z.object({
          plaidItemId: z.string(),
          destinationIds: z.array(z.string())
        })
      )
      .mutation(async ({ ctx: { session, db, logger }, input: { destinationIds, plaidItemId }}) => {
        const plaidItem = await db.plaidItem.findFirstOrThrow({ where: { id: plaidItemId }, include: { accounts: true }});
        logger.info("Fetched Plaid item", { plaidItem });
        const accounts = plaidItem.accounts.map(account => ({ id: account.id }))
        await Promise.all(destinationIds.map(destinationId => db.destination.update({ where: { id: destinationId }, data: { accounts: { connect: accounts }}})))
        return "OK"
      }),

    getActiveLinkToken: protectedProcedure
      .query(async ({ ctx: { session, db }}) => {
        const userId = session!.user.id;
        return db.linkToken.findFirst({ where: { userId }});
      })
})