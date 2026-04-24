import { NextResponse } from "next/server";

// Static rates (fallback if CoinGecko fails)
const STATIC_RATES: Record<string, Record<string, number>> = {
  SAR: { JOD: 0.0995, USD: 0.2667, AED: 0.979, IQD: 349.5, SYP: 3462 },
  AED: { JOD: 0.1015, USD: 0.2723, SAR: 1.021, IQD: 356.8, SYP: 3534 },
  KWD: { JOD: 2.31, USD: 3.26, SAR: 12.19, AED: 11.97 },
  QAR: { JOD: 0.1948, USD: 0.2747, SAR: 1.030, AED: 1.007 },
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const from = searchParams.get("from") || "SAR";
  const to = searchParams.get("to") || "JOD";
  const amount = parseFloat(searchParams.get("amount") || "1");

  const rate = STATIC_RATES[from]?.[to] ?? 0.1;
  const converted = amount * rate;

  return NextResponse.json({
    from,
    to,
    rate,
    amount,
    converted,
    fee: 0.01,
    network: "Solana Devnet",
    timestamp: new Date().toISOString(),
  });
}
