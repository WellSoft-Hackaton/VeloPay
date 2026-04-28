"use server";

import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import {
  addChatMessage,
  addChatMessagePair,
  getChatHistory,
  clearChatHistory,
} from "@/lib/services/chat.service";

export async function saveChatMessageAction(role: "user" | "assistant", content: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const message = await addChatMessage({
      userId: session.user.id,
      role,
      content,
    });
    revalidateTag("chat");
    return { success: true, message };
  } catch (err) {
    return { error: "Failed to save message" };
  }
}

export async function saveChatPairAction(userMessage: string, assistantMessage: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const messages = await addChatMessagePair(session.user.id, userMessage, assistantMessage);
    revalidateTag("chat");
    return { success: true, messages };
  } catch (err) {
    return { error: "Failed to save messages" };
  }
}

export async function getChatHistoryAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated", messages: [] };

  try {
    const messages = await getChatHistory(session.user.id);
    return { messages };
  } catch (err) {
    return { error: "Failed to fetch chat history", messages: [] };
  }
}

export async function clearChatHistoryAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    await clearChatHistory(session.user.id);
    revalidateTag("chat");
    return { success: true };
  } catch (err) {
    return { error: "Failed to clear chat history" };
  }
}
