"use server";

import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import {
  createRecurringTransfer,
  toggleRecurringTransfer,
  deleteRecurringTransfer,
  getRecurringTransfersByUser,
} from "@/lib/services/recurring-transfer.service";

export async function createRecurringTransferAction(data: {
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  recipientPhone?: string;
  dayOfMonth: number;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const recurring = await createRecurringTransfer({
      userId: session.user.id,
      ...data,
    });
    revalidateTag("recurring-transfers");
    return { success: true, recurring };
  } catch (err) {
    return { error: "Failed to create recurring transfer" };
  }
}

export async function toggleRecurringTransferAction(id: string, active: boolean) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const recurring = await toggleRecurringTransfer(id, active);
    revalidateTag("recurring-transfers");
    return { success: true, recurring };
  } catch (err) {
    return { error: "Failed to toggle recurring transfer" };
  }
}

export async function deleteRecurringTransferAction(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const recurring = await deleteRecurringTransfer(id);
    revalidateTag("recurring-transfers");
    return { success: true, recurring };
  } catch (err) {
    return { error: "Failed to delete recurring transfer" };
  }
}

export async function getRecurringTransfersAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated", transfers: [] };

  try {
    const transfers = await getRecurringTransfersByUser(session.user.id);
    return { transfers };
  } catch (err) {
    return { error: "Failed to fetch recurring transfers", transfers: [] };
  }
}
