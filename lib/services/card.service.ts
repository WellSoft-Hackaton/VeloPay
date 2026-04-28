import { db } from "@/lib/db";
import { userCards } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// ── Types ─────────────────────────────────────────────────
export type CreateCardInput = {
  userId: string;
  cardType: string;
  last4: string;
  label?: string;
  cardholderName?: string;
  expiryDate?: string;
};

// ── Queries (cached) ──────────────────────────────────────
export const getCardsByUser = unstable_cache(
  async (userId: string) => {
    return db.select().from(userCards).where(eq(userCards.userId, userId));
  },
  ["cards-by-user"],
  { tags: ["cards"], revalidate: 60 }
);

export const getCardById = unstable_cache(
  async (id: string) => {
    const rows = await db.select().from(userCards).where(eq(userCards.id, id));
    return rows[0] ?? null;
  },
  ["card-by-id"],
  { tags: ["cards"], revalidate: 60 }
);

// ── Mutations ─────────────────────────────────────────────
export async function createCard(input: CreateCardInput) {
  const [row] = await db.insert(userCards).values({
    userId: input.userId,
    cardType: input.cardType,
    last4: input.last4,
    label: input.label ?? null,
    cardholderName: input.cardholderName ?? null,
    expiryDate: input.expiryDate ?? null,
  }).returning();
  return row;
}

export async function deleteCard(id: string) {
  const [row] = await db.delete(userCards)
    .where(eq(userCards.id, id))
    .returning();
  return row;
}
