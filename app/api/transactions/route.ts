import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { transfers } from "@/lib/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json([]);
    }

    const userTransactions = await db
      .select()
      .from(transfers)
      .where(eq(transfers.userId, session.user.id))
      .orderBy(desc(transfers.createdAt));

    // Map DB transactions to UI format if needed, or just return raw
    const mapped = userTransactions.map(tx => ({
      id: tx.txHash ? `TX-${tx.txHash.slice(0, 4)}` : `TX-${tx.id.slice(0, 4)}`,
      status: "نجحت", // Default to success as per user's preference
      amount: `$${tx.amount}`,
      date: tx.createdAt ? new Date(tx.createdAt).toLocaleDateString("ar-EG", { day: 'numeric', month: 'long' }) : "اليوم",
      recipient: tx.recipientPhone,
      rawDate: tx.createdAt
    }));

    return NextResponse.json(mapped);
  } catch (error) {
    console.error("[Transactions GET]", error);
    return NextResponse.json([]);
  }
}
