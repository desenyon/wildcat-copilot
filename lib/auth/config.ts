import type { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import { getEnv } from "@/lib/validation/env";
import { upsertUserOnSignIn, getUserByEmail } from "./user";

/**
 * Sessions are JWT-based (no Auth.js DB adapter) because our `users` table
 * schema is defined by AGENTS.md §4.3 and doesn't match the adapter's
 * expected shape (accounts/sessions/verificationTokens tables). Our own
 * `users`/`organizations` rows are the source of truth; the JWT just carries
 * the internal user id, org id, and role so server code never needs to hit
 * the DB to authorize a request.
 */
export const authConfig: NextAuthConfig = {
  // Self-hosted (not deployed on Vercel), so Auth.js can't infer a trusted
  // host from the platform. The app sits behind our own infra/reverse proxy,
  // which is the deployment scenario the Auth.js docs call out for this flag.
  trustHost: true,
  providers: [
    Google({
      clientId: getEnv().GOOGLE_OAUTH_CLIENT_ID,
      clientSecret: getEnv().GOOGLE_OAUTH_CLIENT_SECRET,
    }),
  ],
  session: { strategy: "jwt" },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  callbacks: {
    async signIn({ user }) {
      const email = user.email?.toLowerCase();
      if (!email) return false;

      const allowlist = getEnv().PILOT_ALLOWLIST;
      if (allowlist.length > 0 && !allowlist.includes(email)) {
        return "/sign-in?error=NotInvited";
      }

      await upsertUserOnSignIn({ email, displayName: user.name ?? email });
      return true;
    },
    async jwt({ token, user }) {
      const email = (user?.email ?? token.email)?.toLowerCase();
      if (!email) return token;

      const dbUser = await getUserByEmail(email);
      if (dbUser) {
        token.userId = dbUser.id;
        token.organizationId = dbUser.organizationId;
        token.role = dbUser.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.userId) {
        session.user.id = token.userId as string;
        session.user.organizationId = token.organizationId as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
};
