"use server";

import { auth } from "@/auth";
import { revalidateTag } from "next/cache";
import {
  createBill,
  markBillPaid,
  deleteBill,
  getBillsByUser,
} from "@/lib/services/bill.service";

export async function addBillAction(data: {
  name: string;
  amount: string;
  dueDate: string;
}) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const bill = await createBill({
      userId: session.user.id,
      ...data,
    });
    revalidateTag("bills");
    return { success: true, bill };
  } catch (err) {
    return { error: "Failed to add bill" };
  }
}

export async function markBillPaidAction(billId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const bill = await markBillPaid(billId);
    revalidateTag("bills");
    return { success: true, bill };
  } catch (err) {
    return { error: "Failed to mark bill as paid" };
  }
}

export async function deleteBillAction(billId: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated" };

  try {
    const bill = await deleteBill(billId);
    revalidateTag("bills");
    return { success: true, bill };
  } catch (err) {
    return { error: "Failed to delete bill" };
  }
}

export async function getBillsAction() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Not authenticated", bills: [] };

  try {
    const bills = await getBillsByUser(session.user.id);
    return { bills };
  } catch (err) {
    return { error: "Failed to fetch bills", bills: [] };
  }
}
