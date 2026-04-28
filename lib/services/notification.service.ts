import { db } from "@/lib/db";
import { notifications } from "@/lib/schema";
import { eq, and, desc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// ── Types ─────────────────────────────────────────────────
export type CreateNotificationInput = {
  userId: string;
  type: string; // rate_alert | transfer_complete | escrow_released | bill_due
  title: string;
  message?: string;
};

// ── Queries (cached) ──────────────────────────────────────
export const getNotificationsByUser = unstable_cache(
  async (userId: string) => {
    return db.select()
      .from(notifications)
      .where(eq(notifications.userId, userId))
      .orderBy(desc(notifications.createdAt));
  },
  ["notifications-by-user"],
  { tags: ["notifications"], revalidate: 15 }
);

export const getUnreadCount = unstable_cache(
  async (userId: string) => {
    const rows = await db.select()
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.read, false)
        )
      );
    return rows.length;
  },
  ["unread-count"],
  { tags: ["notifications"], revalidate: 15 }
);

// ── Mutations ─────────────────────────────────────────────
export async function createNotification(input: CreateNotificationInput) {
  const [row] = await db.insert(notifications).values({
    userId: input.userId,
    type: input.type,
    title: input.title,
    message: input.message ?? null,
    read: false,
  }).returning();
  return row;
}

export async function markNotificationRead(id: string) {
  const [row] = await db.update(notifications)
    .set({ read: true })
    .where(eq(notifications.id, id))
    .returning();
  return row;
}

export async function markAllNotificationsRead(userId: string) {
  await db.update(notifications)
    .set({ read: true })
    .where(eq(notifications.userId, userId));
}

export async function deleteNotification(id: string) {
  const [row] = await db.delete(notifications)
    .where(eq(notifications.id, id))
    .returning();
  return row;
}
