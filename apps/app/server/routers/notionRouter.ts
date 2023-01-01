import axios from "axios";
import { z } from "zod";
import { trackNotionConnectionAdded } from "~/lib/analytics";
import { logNotionConnectionAdded } from "~/lib/logsnag";
import { protectedProcedure, router } from "../trpc";

export const notionRouter = router({
  exchangeToken: protectedProcedure
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
      const connectionExists = await db.notionCredential.findFirst({ where: { botId: bot_id }}).then(Boolean);
      const connection = await db.notionCredential.upsert({ 
        where: { botId: bot_id },
        create: {
          userId,
          botId: bot_id,
          accessToken: access_token,
          workspaceName: workspace_name,
          workspaceId: workspace_id,
          workspaceIcon: workspace_icon,
          owner
        },
        update: {
          accessToken: access_token,
          workspaceIcon: workspace_icon,
          workspaceId: workspace_id,
          workspaceName: workspace_name,
          owner
        }
      });

      logger.info("Notion connection upserted", { response: connection })

      if ( !connectionExists ) {
        await Promise.all([
          trackNotionConnectionAdded({ userId }),
          logNotionConnectionAdded({ userId })
        ]);
      }

      return "OK"
    }),

  getCredentials: protectedProcedure
    .query(async ({ ctx: { session, db }}) => {
      const userId = session!.user.id;

      const notionCredentials = await db.notionCredential.findMany({ where: { userId }, select: { botId: true, workspaceName: true }});
      return notionCredentials
    })
})