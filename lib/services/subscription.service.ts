import { db } from "@/lib/db";
import { subscriptions } from "@/lib/schema";
import { eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// ── Types ─────────────────────────────────────────────────
export type CreateSubscriptionInput = {
  userId: string;
  plan: "monthly" | "yearly";
};

// ── Queries (cached) ──────────────────────────────────────
export const getSubscriptionByUser = unstable_cache(
  async (userId: string) => {
    const rows = await db.select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
    return rows[0] ?? null;
  },
  ["subscription-by-user"],
  { tags: ["subscriptions"], revalidate: 60 }
);

export const checkIsPremium = unstable_cache(
  async (userId: string) => {
    const rows = await db.select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId));
    const sub = rows[0];
    if (!sub) return false;
    if (sub.status !== "active") return false;
    if (sub.plan === "free") return false;
    if (sub.expiresAt && sub.expiresAt < new Date()) return false;
    return true;
  },
  ["is-premium"],
  { tags: ["subscriptions"], revalidate: 60 }
);

// ── Mutations ─────────────────────────────────────────────
export async function createSubscription(input: CreateSubscriptionInput) {
  // Calculate expiry
  const now = new Date();
  const expiresAt = new Date(now);
  if (input.plan === "monthly") {
    expiresAt.setMonth(expiresAt.getMonth() + 1);
  } else {
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  }

  const [row] = await db.insert(subscriptions).values({
    userId: input.userId,
    plan: input.plan,
    status: "active",
    startedAt: now,
    expiresAt,
  }).returning();
  return row;
}

export async function cancelSubscription(id: string) {
  const [row] = await db.update(subscriptions)
    .set({ status: "cancelled" })
    .where(eq(subscriptions.id, id))
    .returning();
  return row;
}
