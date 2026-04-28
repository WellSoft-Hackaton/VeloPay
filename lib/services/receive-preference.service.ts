import { db } from "@/lib/db";
import { receivePreferences } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// ── Types ─────────────────────────────────────────────────
export type CreateReceivePreferenceInput = {
  userId: string;
  method: string; // bank | zaincash | cliq | wallet
  iban?: string;
  phone?: string;
  accountName?: string;
};

// ── Queries (cached) ──────────────────────────────────────
export const getReceivePreferencesByUser = unstable_cache(
  async (userId: string) => {
    return db.select()
      .from(receivePreferences)
      .where(eq(receivePreferences.userId, userId));
  },
  ["receive-prefs-by-user"],
  { tags: ["receive-preferences"], revalidate: 60 }
);

export const getReceivePreferenceById = unstable_cache(
  async (id: string) => {
    const rows = await db.select()
      .from(receivePreferences)
      .where(eq(receivePreferences.id, id));
    return rows[0] ?? null;
  },
  ["receive-pref-by-id"],
  { tags: ["receive-preferences"], revalidate: 60 }
);

// ── Mutations ─────────────────────────────────────────────
export async function createReceivePreference(input: CreateReceivePreferenceInput) {
  const [row] = await db.insert(receivePreferences).values({
    userId: input.userId,
    method: input.method,
    iban: input.iban ?? null,
    phone: input.phone ?? null,
    accountName: input.accountName ?? null,
  }).returning();
  return row;
}

export async function updateReceivePreference(
  id: string,
  data: Partial<Omit<CreateReceivePreferenceInput, "userId">>
) {
  const [row] = await db.update(receivePreferences)
    .set(data)
    .where(eq(receivePreferences.id, id))
    .returning();
  return row;
}

export async function deleteReceivePreference(id: string) {
  const [row] = await db.delete(receivePreferences)
    .where(eq(receivePreferences.id, id))
    .returning();
  return row;
}
