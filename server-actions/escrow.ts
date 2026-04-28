"use server";

import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import {
  createEscrow,
  releaseEscrow,
  cancelEscrow,
  getEscrowsByUser,
  getEscrowById,
} from "@/lib/services/escrow.service";

export async function createEscrowAction(data: {
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  recipientPhone?: string;
  escrowCondition: string;
  txHash?: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const escrow = await createEscrow({
      userId: session.user.id,
      ...data,
    });
    revalidateTag("escrows");
    return { success: true, escrow };
  } catch (err) {
    return { error: "Failed to create escrow" };
  }
}

export async function releaseEscrowAction(escrowId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const escrow = await releaseEscrow(escrowId);
    revalidateTag("escrows");
    return { success: true, escrow };
  } catch (err) {
    return { error: "Failed to release escrow" };
  }
}

export async function cancelEscrowAction(escrowId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const escrow = await cancelEscrow(escrowId);
    revalidateTag("escrows");
    return { success: true, escrow };
  } catch (err) {
    return { error: "Failed to cancel escrow" };
  }
}

export async function getEscrowsAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated", escrows: [] };

  try {
    const escrows = await getEscrowsByUser(session.user.id);
    return { escrows };
  } catch (err) {
    return { error: "Failed to fetch escrows", escrows: [] };
  }
}

export async function getEscrowAction(id: string) {
  try {
    const escrow = await getEscrowById(id);
    return { escrow };
  } catch (err) {
    return { error: "Failed to fetch escrow", escrow: null };
  }
}
