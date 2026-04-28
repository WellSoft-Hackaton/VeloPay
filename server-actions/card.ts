"use server";

import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import {
  createCard,
  deleteCard,
  getCardsByUser,
} from "@/lib/services/card.service";

export async function addCardAction(data: {
  cardType: string;
  last4: string;
  label?: string;
  cardholderName?: string;
  expiryDate?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const card = await createCard({
      userId: session.user.id,
      ...data,
    });
    revalidateTag("cards");
    return { success: true, card };
  } catch (err) {
    return { error: "Failed to add card" };
  }
}

export async function deleteCardAction(cardId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const card = await deleteCard(cardId);
    revalidateTag("cards");
    return { success: true, card };
  } catch (err) {
    return { error: "Failed to delete card" };
  }
}

export async function getCardsAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated", cards: [] };

  try {
    const cards = await getCardsByUser(session.user.id);
    return { cards };
  } catch (err) {
    return { error: "Failed to fetch cards", cards: [] };
  }
}
