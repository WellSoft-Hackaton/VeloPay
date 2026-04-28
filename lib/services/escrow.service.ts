import { db } from "@/lib/db";
import { escrows } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// ── Types ─────────────────────────────────────────────────
export type CreateEscrowInput = {
  userId: string;
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  recipientPhone?: string;
  escrowCondition: string;
  txHash?: string;
};

// ── Queries (cached) ──────────────────────────────────────
export const getEscrowsByUser = unstable_cache(
  async (userId: string) => {
    return db.select().from(escrows).where(eq(escrows.userId, userId));
  },
  ["escrows-by-user"],
  { tags: ["escrows"], revalidate: 30 }
);

export const getEscrowById = unstable_cache(
  async (id: string) => {
    const rows = await db.select().from(escrows).where(eq(escrows.id, id));
    return rows[0] ?? null;
  },
  ["escrow-by-id"],
  { tags: ["escrows"], revalidate: 30 }
);

// ── Mutations ─────────────────────────────────────────────
export async function createEscrow(input: CreateEscrowInput) {
  const [row] = await db.insert(escrows).values({
    userId: input.userId,
    amount: input.amount,
    fromCurrency: input.fromCurrency,
    toCurrency: input.toCurrency,
    recipientPhone: input.recipientPhone ?? null,
    escrowCondition: input.escrowCondition,
    txHash: input.txHash ?? null,
    status: "locked",
  }).returning();
  return row;
}

export async function releaseEscrow(id: string) {
  const [row] = await db.update(escrows)
    .set({ status: "released", releasedAt: new Date() })
    .where(eq(escrows.id, id))
    .returning();
  return row;
}

export async function cancelEscrow(id: string) {
  const [row] = await db.update(escrows)
    .set({ status: "cancelled" })
    .where(eq(escrows.id, id))
    .returning();
  return row;
}
