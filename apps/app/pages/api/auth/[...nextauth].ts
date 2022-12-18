import NextAuth from "next-auth/next";

import { nextAuthOptions } from "~/lib/auth";

export default NextAuth(nextAuthOptions)