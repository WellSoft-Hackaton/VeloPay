import { db } from "@/lib/db";
import { chatMessages } from "@/lib/schema";
import { eq, asc } from "drizzle-orm";
import { unstable_cache } from "next/cache";

// ── Types ─────────────────────────────────────────────────
export type CreateChatMessageInput = {
  userId: string;
  role: "user" | "assistant";
  content: string;
};

// ── Queries (cached) ──────────────────────────────────────
export const getChatHistory = unstable_cache(
  async (userId: string) => {
    return db.select()
      .from(chatMessages)
      .where(eq(chatMessages.userId, userId))
      .orderBy(asc(chatMessages.createdAt));
  },
  ["chat-history"],
  { tags: ["chat"], revalidate: 10 }
);

// ── Mutations ─────────────────────────────────────────────
export async function addChatMessage(input: CreateChatMessageInput) {
  const [row] = await db.insert(chatMessages).values({
    userId: input.userId,
    role: input.role,
    content: input.content,
  }).returning();
  return row;
}

export async function addChatMessagePair(
  userId: string,
  userMessage: string,
  assistantMessage: string
) {
  const rows = await db.insert(chatMessages).values([
    { userId, role: "user", content: userMessage },
    { userId, role: "assistant", content: assistantMessage },
  ]).returning();
  return rows;
}

export async function clearChatHistory(userId: string) {
  await db.delete(chatMessages).where(eq(chatMessages.userId, userId));
}
