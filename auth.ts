import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import { db } from "./lib/db";
import { users, accounts, sessions, verificationTokens } from "./lib/schema";

export const { handlers, auth, signIn, signOut } = NextAuth({
    providers: [
        Google({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
    ],
    adapter: DrizzleAdapter(db, {
        usersTable: users,
        accountsTable: accounts,
        sessionsTable: sessions,
        verificationTokensTable: verificationTokens,
    }),
    callbacks: {
        session({ session, user }) {
            if (session.user && user) {
                session.user.id = user.id;
            }
            return session;
        },
    },
    secret: process.env.AUTH_SECRET,
});