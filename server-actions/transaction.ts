"use server";

import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import {
  createTransaction,
  updateTransactionStatus,
  getTransactionsByUser,
  getTransactionById,
  getTransactionByTxHash,
} from "@/lib/services/transaction.service";

export async function createTransactionAction(data: {
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
}) {
  const session = await auth();

  try {
    const tx = await createTransaction({
      userId: session?.user?.id,
      ...data,
    });
    revalidateTag("transactions");
    return { success: true, transaction: tx };
  } catch (err) {
    return { error: "Failed to create transaction" };
  }
}

export async function updateTransactionStatusAction(id: string, status: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const tx = await updateTransactionStatus(id, status);
    revalidateTag("transactions");
    return { success: true, transaction: tx };
  } catch (err) {
    return { error: "Failed to update transaction status" };
  }
}

export async function getTransactionsAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated", transactions: [] };

  try {
    const txs = await getTransactionsByUser(session.user.id);
    return { transactions: txs };
  } catch (err) {
    return { error: "Failed to fetch transactions", transactions: [] };
  }
}

export async function getTransactionAction(id: string) {
  try {
    const tx = await getTransactionById(id);
    return { transaction: tx };
  } catch (err) {
    return { error: "Failed to fetch transaction", transaction: null };
  }
}

export async function getTransactionByHashAction(txHash: string) {
  try {
    const tx = await getTransactionByTxHash(txHash);
    return { transaction: tx };
  } catch (err) {
    return { error: "Failed to fetch transaction", transaction: null };
  }
}
