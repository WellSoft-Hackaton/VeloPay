import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/db";
import { transfers, transactions, escrows } from "@/lib/schema";

const RATES: Record<string, Record<string, number>> = {
  SAR: { JOD: 0.0995, USD: 0.2667, AED: 0.979, IQD: 349.5, SYP: 3462 },
  AED: { JOD: 0.1015, USD: 0.2723, SAR: 1.021, IQD: 356.8, SYP: 3534 },
  KWD: { JOD: 2.31, USD: 3.26, SAR: 12.19, AED: 11.97 },
  QAR: { JOD: 0.1948, USD: 0.2747, SAR: 1.030, AED: 1.007 },
};

function generateSolanaTxHash(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
  let result = "";
  for (let i = 0; i < 88; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// In-memory phone registry (In production: use Supabase)
const phoneRegistry = new Map<string, string>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, fromCurrency, toCurrency, recipientPhone, toCountry, isEscrow, escrowCondition } = body;

    if (!amount || !fromCurrency || !toCurrency || !recipientPhone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const rate = RATES[fromCurrency]?.[toCurrency] ?? 0.1;
    const converted = parseFloat(amount) * rate;
    const txHash = generateSolanaTxHash();

    const session = await auth();
    const userId = session?.user?.id;

    if (userId) {
      // Save to transfers table (for limit and history)
      await db.insert(transfers).values({
        id: crypto.randomUUID(),
        userId,
        amount: String(amount),
        fromCurrency,
        toCurrency,
        recipientPhone: recipientPhone || null,
        txHash,
        status: isEscrow ? "locked" : "pending",
        createdAt: new Date(),
      });
    }

    // Register phone → wallet mapping (simulated)
    const walletAddress = `sim_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const normalizedPhone = recipientPhone.replace(/[\s-]/g, "");
    phoneRegistry.set(normalizedPhone, walletAddress);

    // Simulate small processing delay
    await new Promise((r) => setTimeout(r, 500));

    return NextResponse.json({
      success: true,
      txHash,
      amount: parseFloat(amount),
      fromCurrency,
      toCurrency,
      converted,
      recipientPhone,
      toCountry,
      fee: 0.01,
      network: "solana-devnet",
      status: isEscrow ? "locked" : "pending",
      isEscrow,
      escrowCondition,
      explorerUrl: `https://explorer.solana.com/tx/${txHash}?cluster=devnet`,
      createdAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5000).toISOString(),
      // Simulated USDC amount (using CoinGecko rate: 1 USDC ≈ 1 USD)
      usdcAmount: (parseFloat(amount) * (RATES[fromCurrency]?.["USD"] ?? 0.267)).toFixed(6),
    });
  } catch (error) {
    console.error("[Transfer API]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const txHash = searchParams.get("txHash");

  if (!txHash) {
    return NextResponse.json({ error: "txHash required" }, { status: 400 });
  }

  // Simulate status progression based on time
  const statuses = ["pending", "processing", "confirmed", "delivered"];
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];

  return NextResponse.json({
    txHash,
    status: randomStatus,
    network: "solana-devnet",
    explorerUrl: `https://explorer.solana.com/tx/${txHash}?cluster=devnet`,
  });
}
