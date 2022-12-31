import axios from "axios";
import crypto from "crypto";
import moment from "moment-timezone";
import { z } from "zod";
import { trackAirtableTokenAdded } from "~/lib/analytics";
import { getAuthorizationHeader } from "~/lib/integrations/airtable/helpers";
import { logAirtableTokenAdded } from "~/lib/logsnag";
import { protectedProcedure, router } from "../trpc";
// import { Airtable } from "~/lib/integrations/airtable";

export const airtableRouter = router({
  exchangeToken: protectedProcedure
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
      const tokenData = {
        accessToken: data.access_token,
        refreshToken: data.refresh_token,
        tokenType: data.token_type,
        scope: data.scope,
        accessTokenExpiresAt: moment().add(parseInt(data.expires_in), 'seconds').toDate(),
        refreshTokenExpiresAt: moment().add(parseInt(data.refresh_expires_in), 'seconds').toDate()
      }
      await db.airtableToken.upsert({ 
        where: { userId }, 
        create: { userId, ...tokenData },
        update: tokenData
      }).then(token => logger.info("Token upserted", { token }));

      await Promise.all([
        trackAirtableTokenAdded({ userId }),
        logAirtableTokenAdded({ userId }),

        // TODO: Uncomment
        // Remove all Airtable apiKeys 
        // db.airtableCredential.updateMany({ 
        //   where: { destination: { userId }},
        //   data: { apiKey: null }
        // }).then(response => logger.info("Removed apiKey from Airtable credentials", { response }))
      ]);

      return "OK"
    }),

    getAuthorizationUrl: protectedProcedure // Source: https://github.com/Airtable/oauth-example/blob/main/index.js
    .mutation(async ({ ctx: { session, db, logger }}) => {
      const userId = session!.user.id;
      const state = crypto.randomBytes(100).toString('base64url');
      const codeVerifier = crypto.randomBytes(96).toString('base64url');
      const codeChallengeMethod = 'S256'
      const codeChallenge = crypto
            .createHash('sha256')
            .update(codeVerifier)
            .digest('base64') 
            .replace(/=/g, '') 
            .replace(/\+/g, '-') 
            .replace(/\//g, '_'); 

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

    // getBases: protectedProcedure
    // .query(async ({ ctx: { session, logger }}) => {
    //   const userId = session!.user.id;
    //   const airtable = new Airtable({ userId, credentials: { id: "", baseId: "", apiKey: null }});
    //   await airtable.init();
    //   logger.info("Initialized Airtable");

    //   return airtable.getBases();
    // }),

  doesUserHaveToken: protectedProcedure
    .query(async ({ ctx: { session, db }}) => {
      const userId = session!.user.id;

      return db.airtableToken.findFirst({ where: { userId }}).then(Boolean);
    })
})