// src/lib/schema.ts
import {
    boolean,
    timestamp,
    pgTable,
    text,
    primaryKey,
    integer,
} from "drizzle-orm/pg-core";
import type { AdapterAccountType } from "@auth/core/adapters";

// ✅ This is the users table — every sign-in creates a row here
export const users = pgTable("user", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    name: text("name"),
    email: text("email").unique(),
    emailVerified: timestamp("emailVerified", { mode: "date" }),
    image: text("image"),
});

export const accounts = pgTable(
    "account",
    {
        userId: text("userId")
            .notNull()
            .references(() => users.id, { onDelete: "cascade" }),
        type: text("type").$type<AdapterAccountType>().notNull(),
        provider: text("provider").notNull(),
        providerAccountId: text("providerAccountId").notNull(),
        refresh_token: text("refresh_token"),
        access_token: text("access_token"),
        expires_at: integer("expires_at"),
        token_type: text("token_type"),
        scope: text("scope"),
        id_token: text("id_token"),
        session_state: text("session_state"),
    },
    (account) => [
        primaryKey({ columns: [account.provider, account.providerAccountId] }),
    ]
);

export const sessions = pgTable("session", {
    sessionToken: text("sessionToken").primaryKey(),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
    "verificationToken",
    {
        identifier: text("identifier").notNull(),
        token: text("token").notNull(),
        expires: timestamp("expires", { mode: "date" }).notNull(),
    },
    (vt) => [primaryKey({ columns: [vt.identifier, vt.token] })]
);

// ✅ Transfers table — tracks user transfers for monthly limit enforcement
export const transfers = pgTable("transfer", {
    id: text("id")
        .primaryKey()
        .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    amount: text("amount").notNull(),
    fromCurrency: text("fromCurrency").notNull(),
    toCurrency: text("toCurrency").notNull(),
    recipientPhone: text("recipientPhone"),
    txHash: text("txHash"),
    status: text("status").notNull().default("pending"),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

// Optional/simple tables for user-visible data (kept minimal and string-based)
export const wallets = pgTable("wallet", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    address: text("address").notNull(),
    chain: text("chain"),
    label: text("label"),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const paymentMethods = pgTable("payment_method", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(), // card | bank | wallet | other
    provider: text("provider"),
    details: text("details"), // JSON string with provider-specific fields (masked)
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const deposits = pgTable("deposit", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    amount: text("amount").notNull(),
    currency: text("currency").notNull(),
    method: text("method"), // e.g., card, bank, onramp
    status: text("status").notNull().default("pending"),
    txHash: text("txHash"),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});

export const yieldPositions = pgTable("yield_position", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    amount: text("amount").notNull(),
    currency: text("currency").notNull().default("USDC"),
    status: text("status").notNull().default("active"),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
    exitedAt: timestamp("exitedAt", { mode: "date" }),
});

export const activityEvents = pgTable("activity_event", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").references(() => users.id, { onDelete: "cascade" }),
    type: text("type").notNull(),
    amount: text("amount"),
    metadata: text("metadata"), // JSON string for extra event data
    timestamp: timestamp("timestamp", { mode: "date" }).notNull().defaultNow(),
});

export const exchangeRateAlerts = pgTable("exchange_rate_alert", {
    id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
    currency: text("currency").notNull(),
    targetRate: text("targetRate").notNull(), // stored as string for simplicity
    direction: text("direction").notNull().default("below"),
    active: boolean("active").notNull().default(false),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull().defaultNow(),
});