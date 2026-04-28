import { db } from "@/lib/db";
import { recurringTransfers } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// ── Types ─────────────────────────────────────────────────
export type CreateRecurringTransferInput = {
  userId: string;
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  recipientPhone?: string;
  dayOfMonth: number;
};

// ── Queries (cached) ──────────────────────────────────────
export const getRecurringTransfersByUser = unstable_cache(
  async (userId: string) => {
    return db.select().from(recurringTransfers).where(eq(recurringTransfers.userId, userId));
  },
  ["recurring-transfers-by-user"],
  { tags: ["recurring-transfers"], revalidate: 60 }
);

export const getRecurringTransferById = unstable_cache(
  async (id: string) => {
    const rows = await db.select().from(recurringTransfers).where(eq(recurringTransfers.id, id));
    return rows[0] ?? null;
  },
  ["recurring-transfer-by-id"],
  { tags: ["recurring-transfers"], revalidate: 60 }
);

// ── Mutations ─────────────────────────────────────────────
export async function createRecurringTransfer(input: CreateRecurringTransferInput) {
  const [row] = await db.insert(recurringTransfers).values({
    userId: input.userId,
    amount: input.amount,
    fromCurrency: input.fromCurrency,
    toCurrency: input.toCurrency,
    recipientPhone: input.recipientPhone ?? null,
    dayOfMonth: input.dayOfMonth,
    active: true,
  }).returning();
  return row;
}

export async function toggleRecurringTransfer(id: string, active: boolean) {
  const [row] = await db.update(recurringTransfers)
    .set({ active })
    .where(eq(recurringTransfers.id, id))
    .returning();
  return row;
}

export async function deleteRecurringTransfer(id: string) {
  const [row] = await db.delete(recurringTransfers)
    .where(eq(recurringTransfers.id, id))
    .returning();
  return row;
}
