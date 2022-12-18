import EmailProvider from "next-auth/providers/email";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import { trackUserSignedIn, trackUserSignedOut, trackUserSignedUp } from "./analytics";
import { logUserSignedUp } from "./logsnag";

import { EMAIL_TEMPLATES, sendTransactionalEmail } from "./cio";
import { db } from "./db";

export const nextAuthOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt'
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    EmailProvider({
      from: "noreply@finta.io",
      sendVerificationRequest: async ({ identifier: email, url, provider }) => {
        const user = await db.user.findUnique({ 
          where: { email },
          select: { emailVerified: true, id: true }
        })

        const templateId = user?.emailVerified
          ? EMAIL_TEMPLATES.SIGN_IN
          : EMAIL_TEMPLATES.ACTIVATE_ACCOUNT
        console.log(url)
        await sendTransactionalEmail({
          templateId,
          userId: user?.id,
          email,
          data: { url }
        })
      }
    })
  ],
  callbacks: {
    jwt: async ({ token, user }) => {
      const dbUser = await db.user.findFirst({ where: { email: token.email }});

      if ( !dbUser ) {
        token.id = user?.id || "";
        return token;
      }

      return {
        id: dbUser?.id,
        name: dbUser?.name,
        email: dbUser?.email
      }
    },
    session: async ({ token, session }) => {
      if ( token ) {
       session.user.id = token.id;
       session.user.name = token.name;
       session.user.email = token.email;
      }

      return session;
    }
  },
  secret: process.env.JWT_SECRET,
  events: {
    signIn: ({ user, isNewUser, account }) => {
      const userId = user.id;
      const provider = account?.provider;
      if ( isNewUser ) { 
        trackUserSignedUp({ userId, provider })
        logUserSignedUp({ name: user.name || undefined, email: user.email!, userId })
      } else {
        trackUserSignedIn({ userId, provider })
      }
    },
    signOut: ({ session }) => {
      const userId = session.user.id;
      trackUserSignedOut({ userId })
    }
  }
}