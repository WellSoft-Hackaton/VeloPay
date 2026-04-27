import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { transfers } from "@/lib/schema";
import { eq, and, gte } from "drizzle-orm";

const FREE_TIER_LIMIT = 3;

// GET — check user's monthly transfer count
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      // Not logged in via NextAuth — client will use localStorage
      return NextResponse.json({
        count: 0,
        limit: FREE_TIER_LIMIT,
        canTransfer: true,
        remaining: FREE_TIER_LIMIT,
        tracked: false,
      });
    }

    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const monthlyTransfers = await db
      .select()
      .from(transfers)
      .where(
        and(
          eq(transfers.userId, session.user.id),
          gte(transfers.createdAt, startOfMonth)
        )
      );

    const count = monthlyTransfers.length;
    const remaining = Math.max(0, FREE_TIER_LIMIT - count);

    return NextResponse.json({
      count,
      limit: FREE_TIER_LIMIT,
      canTransfer: count < FREE_TIER_LIMIT,
      remaining,
      tracked: true,
    });
  } catch (err) {
    console.error("[Transfers GET]", err);
    // If DB fails, allow transfer (graceful degradation)
    return NextResponse.json({
      count: 0,
      limit: FREE_TIER_LIMIT,
      canTransfer: true,
      remaining: FREE_TIER_LIMIT,
      tracked: false,
      error: "db_unavailable",
    });
  }
}

// POST — record a new transfer attempt
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, fromCurrency, toCurrency, recipientPhone, txHash } = body;

    const session = await auth();

    if (!session?.user?.id) {
      // Not authenticated via NextAuth — client uses localStorage tracking
      return NextResponse.json({ success: true, tracked: false });
    }

    // Check monthly limit
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const existing = await db
      .select()
      .from(transfers)
      .where(
        and(
          eq(transfers.userId, session.user.id),
          gte(transfers.createdAt, startOfMonth)
        )
      );

    if (existing.length >= FREE_TIER_LIMIT) {
      return NextResponse.json(
        {
          error: "monthly_limit_reached",
          limit: FREE_TIER_LIMIT,
          message: "لقد وصلت للحد الشهري المجاني (3 تحويلات). يرجى الترقية إلى Premium.",
        },
        { status: 403 }
      );
    }

    // Record the transfer
    const [newTransfer] = await db
      .insert(transfers)
      .values({
        id: crypto.randomUUID(),
        userId: session.user.id,
        amount: String(amount),
        fromCurrency,
        toCurrency,
        recipientPhone: recipientPhone || null,
        txHash: txHash || null,
        status: "pending",
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json({
      success: true,
      tracked: true,
      transfer: newTransfer,
      remaining: FREE_TIER_LIMIT - existing.length - 1,
    });
  } catch (err) {
    console.error("[Transfers POST]", err);
    return NextResponse.json({ success: true, tracked: false, error: "db_unavailable" });
  }
}
