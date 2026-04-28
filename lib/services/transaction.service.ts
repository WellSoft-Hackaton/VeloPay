import { db } from "@/lib/db";
import { transactions } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// ── Types ─────────────────────────────────────────────────
export type CreateTransactionInput = {
  userId?: string;
  txHash?: string;
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  convertedAmount?: string;
  recipientPhone?: string;
  countryCode?: string;
  receiveMethod?: string;
  paymentMethod?: string;
  isEscrow?: boolean;
  escrowId?: string;
};

// ── Queries (cached) ──────────────────────────────────────
export const getTransactionsByUser = unstable_cache(
  async (userId: string) => {
    return db.select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.createdAt));
  },
  ["transactions-by-user"],
  { tags: ["transactions"], revalidate: 15 }
);

export const getTransactionById = unstable_cache(
  async (id: string) => {
    const rows = await db.select().from(transactions).where(eq(transactions.id, id));
    return rows[0] ?? null;
  },
  ["transaction-by-id"],
  { tags: ["transactions"], revalidate: 15 }
);

export const getTransactionByTxHash = unstable_cache(
  async (txHash: string) => {
    const rows = await db.select().from(transactions).where(eq(transactions.txHash, txHash));
    return rows[0] ?? null;
  },
  ["transaction-by-hash"],
  { tags: ["transactions"], revalidate: 15 }
);

// ── Mutations ─────────────────────────────────────────────
export async function createTransaction(input: CreateTransactionInput) {
  const [row] = await db.insert(transactions).values({
    userId: input.userId ?? null,
    txHash: input.txHash ?? null,
    amount: input.amount,
    fromCurrency: input.fromCurrency,
    toCurrency: input.toCurrency,
    convertedAmount: input.convertedAmount ?? null,
    recipientPhone: input.recipientPhone ?? null,
    countryCode: input.countryCode ?? null,
    receiveMethod: input.receiveMethod ?? null,
    paymentMethod: input.paymentMethod ?? null,
    isEscrow: input.isEscrow ?? false,
    escrowId: input.escrowId ?? null,
    status: "pending",
  }).returning();
  return row;
}

export async function updateTransactionStatus(id: string, status: string) {
  const [row] = await db.update(transactions)
    .set({ status })
    .where(eq(transactions.id, id))
    .returning();
  return row;
}
