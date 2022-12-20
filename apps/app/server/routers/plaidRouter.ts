import { TRPCError } from "@trpc/server";
import { Products } from "plaid";
import { z } from "zod";
import { trackPlaidLinkInitiated, backendIdentify as identify, trackInstitutionReconnected, trackInstitutionAccountsUpdated, trackInstitutionCreated, trackInstitutionDeleted, trackPlaidAccountUpdated } from "~/lib/analytics";
import { logInstitutionCreated, logInstitutionDeleted, logInstitutionReconnected } from "~/lib/logsnag";
import { createLinkToken, exchangePublicToken, getAccounts, getInstitution, getItem, initiateProducts, removeItem } from "~/lib/plaid";
import { uploadPlaidInstitutionLogo } from "~/lib/uploadToStorageBucket";
import { router, protectedProcedure } from "../trpc";

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
      const plaidItem = await db.plaidItem.findFirstOrThrow({ 
        where: { id: plaidItemId },
        select: { institution: { select: { name: true }}, accessToken: true }
      });

      await Promise.all([
        removeItem({ accessToken: plaidItem.accessToken! })
          .then(response => logger.info("Plaid Item access token disabled", { response: response.data })),
        
        // TODO: Delete destination accounts

        db.plaidItem.update({ where: { id: plaidItemId }, data: { disabledAt: new Date() }})
          .then(response => logger.info("Plaid item updated", { response })),
        
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
        publicToken: z.string()
      })
    )
    .mutation(async ({ ctx: { session, logger, db }, input: { publicToken }}) => {
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
      
      // Fetch Data from Plaid
      const [ { item, institution }, accounts ] = await Promise.all([
        getItem({ accessToken })
          .then(async response => {
            logger.info("Get Plaid Item", { data: response.data });
            const item = response.data.item;
            const institution = await getInstitution({ institutionId: item.institution_id! })
              .then(resp => {
                logger.info("Get Plaid Institution", { data: resp.data });
                return resp.data.institution
              })
            return { item, institution };
          }),
        getAccounts({ accessToken })
          .then(response => {
            logger.info("Get Plaid Accounts", { data: response.data });
            return response.data.accounts
          })
      ])
      
      const institutionId = institution.institution_id;

      // Check to see if item and institution already exists
      const [ institutionExists, dbItem, dbAccounts ] = await Promise.all([
        db.plaidInstitution.findFirst({ where: { id: institutionId }, select: { id: true }})
          .then(Boolean),
        db.plaidItem.findFirst({ where: { id: item.item_id }, select: { id: true, error: true, consentExpiresAt: true }}),
        db.plaidAccount.findMany({ where: { plaidItemId: item.item_id }})
      ])

      if ( !institutionExists ) {
        const logoUrl = institution.logo
          ? await uploadPlaidInstitutionLogo(institutionId, institution.logo)
          : undefined

        await db.plaidInstitution.create({ data: { id: institutionId, name: institution.name, logoUrl: logoUrl}})
          .then(institution => logger.info("Plaid institution created", { institution }))
      }

      const newPlaidItem = await db.plaidItem.upsert({
        where: { id: item.item_id },
        create: {
          id: item.item_id,
          accessToken,
          institutionId,
          userId,
          availableProducts: item.available_products,
          billedProducts: item.billed_products
        },
        update: {
          error: null,
          consentExpiresAt: null,
          availableProducts: item.available_products,
          billedProducts: item.billed_products
        }
      })
      .then(response => {
        logger.info("Plaid item upserted", { item: response });
        return response;
      })

      // Insert / Delete Accounts 
      const [ accountsCreated, accountsDeleted ] = await Promise.all([
        // Cant use createMany, skipDuplicates :(
        db.plaidAccount.createMany({
          data: accounts
            .filter(account => !dbAccounts.map(dba => dba.id).includes(account.account_id))
            .map(account => ({
              id: account.account_id,
              plaidItemId: item.item_id,
              mask: account.mask,
              name: (account.name || account.official_name)!
          }))
        })
        .then(({ count }) => {
          if ( count > 0 ) { logger.info("Accounts created", { count })};
          return count;
        }),

        db.plaidAccount.deleteMany({ where: { id: { notIn: accounts.map(account => account.account_id ) }, plaidItemId: item_id }})
        .then(({ count }) => {
          if ( count > 0 ) { logger.info("Accounts deleted", { count })};
          return count;
        })
      ])

      const initiateProductsPromise = initiateProducts({ accessToken, availableProducts: item.available_products.filter(product => product !== 'transactions').concat('transactions' as Products)}) // Make sure transactions is in there exactly once

      const updateUserInstitutionsCount = dbItem ? Promise.resolve()
      : db.plaidItem.count({ where: { userId, disabledAt: null }})
        .then(async count => {
          logger.info("Fetched user's total items", { count })
          return identify({ userId, traits: { institutions_count: count }})
            .then(() => logger.info("Identified user with institutions_acount"))
        })

      const trackInstitutionReconnectedPromise = dbItem && (dbItem.error || dbItem.consentExpiresAt)
        ? Promise.all([
          trackInstitutionReconnected({ userId, itemId: item_id }),
          logInstitutionReconnected({ institution: institution.name, userId, itemId: item.item_id })
        ])
        : Promise.resolve();

      const trackInstitutionAccountsUpdatedPromise = dbItem && (accountsDeleted > 0 || accountsCreated > 0)
        ? trackInstitutionAccountsUpdated({ userId, itemId: item_id, accountsCreated, accountsDeleted})
        : Promise.resolve();

      const trackInstitutionCreatedPromise = dbItem
        ? Promise.resolve()
        : Promise.all([
          trackInstitutionCreated({ userId, institution: institution.name, itemId: item.item_id }),
          logInstitutionCreated({ userId, institution: institution.name, itemId: item.item_id })
        ])

      const removeLinkTokenPromise = db.linkToken.delete({ where: { userId }})
        .then(response => {
          logger.info("Removed link token from db", { response })
        })

      await Promise.all([
        initiateProductsPromise,
        updateUserInstitutionsCount,
        trackInstitutionReconnectedPromise,
        trackInstitutionAccountsUpdatedPromise,
        trackInstitutionCreatedPromise,
        removeLinkTokenPromise
      ])

      return { plaidItem: newPlaidItem, institutionName: institution.name };
    })
})