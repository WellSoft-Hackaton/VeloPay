"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PremiumModal } from "@/components/PremiumModal";
import HowItWorksFlow from "@/components/HowItWorksFlow";
import { PaymentMethodModal } from "@/components/PaymentMethodModal";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  ArrowLeft, 
  ArrowDown, 
  ArrowRight, 
  Zap, 
  Banknote, 
  CheckCircle2, 
  ChevronUp, 
  ChevronDown 
} from "lucide-react";

const RATES: Record<string, Record<string, number>> = {
  SAR: { JOD: 0.0995, USD: 0.2667, AED: 0.979, IQD: 349.5, SYP: 3462 },
  AED: { JOD: 0.1015, USD: 0.2723, SAR: 1.021, IQD: 356.8, SYP: 3534 },
  KWD: { JOD: 2.31, USD: 3.26, SAR: 12.19, AED: 11.97, IQD: 8134, SYP: 80600 },
  QAR: { JOD: 0.1948, USD: 0.2747, SAR: 1.030, AED: 1.007 },
};

const FROM_CURRENCIES = [
  { code: "SAR", flag: "🇸🇦" },
  { code: "AED", flag: "🇦🇪" },
  { code: "KWD", flag: "🇰🇼" },
  { code: "QAR", flag: "🇶🇦" },
];

const TO_CURRENCIES = [
  { code: "JOD", flag: "🇯🇴" },
  { code: "USD", flag: "🇵🇸" },
  { code: "IQD", flag: "🇮🇶" },
  { code: "SYP", flag: "🇸🇾" },
];

const TICKER_PAIRS = [
  { from: "SAR", to: "JOD", label: "SAR/JOD" },
  { from: "AED", to: "JOD", label: "AED/JOD" },
  { from: "KWD", to: "JOD", label: "KWD/JOD" },
  { from: "SAR", to: "USD", label: "SAR/USD" },
  { from: "QAR", to: "JOD", label: "QAR/JOD" },
];

// ─── Live Rate Ticker (scrolling) ────────────────────────────────────────────
function LiveTicker() {
  const items = [...TICKER_PAIRS, ...TICKER_PAIRS]; // duplicate for seamless loop

  return (
    <div className="overflow-hidden border-b border-border bg-card py-2">
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{
          animation: "ticker 30s linear infinite",
          width: "max-content",
        }}
      >
        {items.map((p, i) => {
          const rate = RATES[p.from]?.[p.to] ?? 0;
          const isUp = i % 2 === 0; // deterministic direction for hydration
          const change = ((i % 5) * 0.0001 + 0.0001).toFixed(4); // deterministic change
          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-muted-foreground">{p.label}</span>
              <span className="font-mono font-black text-primary">{rate.toFixed(4)}</span>
              <span className={`flex items-center gap-0.5 text-[10px] ${isUp ? "text-green-500" : "text-red-500"}`}>
                {isUp ? <ChevronUp size={10} aria-hidden="true" /> : <ChevronDown size={10} aria-hidden="true" />} 
                {change}
              </span>
              <span className="text-border">|</span>
            </div>
          );
        })}
      </div>
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0) }
          100% { transform: translateX(-50%) }
        }
      `}</style>
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function LandingPage() {
  const [amount, setAmount] = useState("500");
  const [fromCurrency, setFromCurrency] = useState("SAR");
  const [toCurrency, setToCurrency] = useState("JOD");
  const [converted, setConverted] = useState(0);
  const [showPremium, setShowPremium] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);

  useEffect(() => {
    const rate = RATES[fromCurrency]?.[toCurrency] ?? 0.1;
    setConverted(parseFloat(amount || "0") * rate);
  }, [amount, fromCurrency, toCurrency]);

  const wuFee = (parseFloat(amount || "0") * 0.035 + 5).toFixed(2);
  const bankFee = (parseFloat(amount || "0") * 0.05 + 15).toFixed(2);

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300" dir="rtl">
      {/* ══ Live ticker ══ */}
      <LiveTicker />

      {/* ══ Navbar ══ */}
      <Header />

      {/* ══ Hero ══ */}
      <section className="relative overflow-hidden px-6 pb-24 pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-primary/5 blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm text-primary">
                <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                Solana • رسوم أقل من $0.01
              </div>

              <h1 className="mb-6 text-5xl font-black leading-tight lg:text-6xl">
                حوّل أموالك{" "}
                <span className="text-primary">فوراً</span>
                <br />
                من الخليج لأهلك
              </h1>

              <p className="mb-8 text-xl leading-relaxed text-muted-foreground">
                بدون رسوم مصرفية مرتفعة. بدون انتظار.
                <br />
                فقط رقم الهاتف — وخلال ثوانٍ يصل المال.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/send"
                  className="group flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-primary-foreground shadow-xl shadow-primary/30 transition hover:bg-primary/90 active:scale-95"
                >
                  ابدأ التحويل الآن
                  <ArrowLeft size={18} style={{ marginLeft: 6 }} className="transition-transform group-hover:-translate-x-1" aria-hidden="true" />
                </Link>
                <a
                  href="#how"
                  className="flex items-center gap-2 rounded-full border border-border px-8 py-4 text-lg font-medium text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
                >
                  كيف يعمل؟
                </a>
              </div>

              <div className="mt-12 flex gap-8">
                {[
                  { value: "$0.01", label: "رسوم التحويل" },
                  { value: "~5 ثوانٍ", label: "وقت الوصول" },
                  { value: "100%", label: "شفافية Blockchain" },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl font-black text-primary">{s.value}</div>
                    <div className="text-sm text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculator */}
            <div className="rounded-3xl border border-border bg-card p-8 backdrop-blur-sm shadow-2xl">
              <div className="mb-6 text-center text-sm font-medium text-muted-foreground">
                احسب تحويلك الآن
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-xs text-muted-foreground">أرسل</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-2xl font-bold text-foreground outline-none transition focus:border-primary/50"
                  />
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="rounded-xl border border-border bg-card px-3 py-3 text-sm font-medium text-foreground outline-none"
                  >
                    {FROM_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="my-4 flex items-center justify-center gap-4">
                <div className="flex-1 border-t border-border" />
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <ArrowDown size={18} aria-hidden="true" />
                </div>
                <div className="flex-1 border-t border-border" />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-xs text-muted-foreground">يستلم</label>
                <div className="flex gap-3">
                  <div className="flex-1 rounded-xl border border-primary/30 bg-primary/10 px-4 py-3">
                    <span className="text-2xl font-black text-primary">
                      {converted.toLocaleString("ar", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="rounded-xl border border-border bg-card px-3 py-3 text-sm font-medium text-foreground outline-none"
                  >
                    {TO_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Fee comparison */}
              <div className="mb-6 space-y-2 rounded-xl border border-border bg-background/50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">رسوم VeloPay</span>
                  <span className="flex items-center gap-1 font-bold text-primary">
                    $0.01 فقط <Zap size={14} aria-hidden="true" />
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Western Union</span>
                  <span className="text-red-500 line-through">${wuFee}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">تحويل بنكي</span>
                  <span className="text-red-500 line-through">${bankFee}</span>
                </div>
                <div className="mt-2 flex items-center justify-center gap-1 border-t border-border pt-2 text-center text-xs text-primary">
                  <Banknote size={14} aria-hidden="true" /> توفر{" "}
                  <strong>${(parseFloat(bankFee) - 0.01).toFixed(2)}</strong> مقارنة
                  بالبنك
                </div>
              </div>

              <button
                onClick={() => setShowPaymentMethod(true)}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-center text-lg font-bold text-primary-foreground shadow-lg shadow-primary/30 transition hover:bg-primary/90 active:scale-95"
              >
                أرسل {amount || "..."} {fromCurrency} الآن 
                <ArrowRight size={18} aria-hidden="true" />
              </button>
              <p className="mt-3 flex items-center justify-center gap-1 text-center text-xs text-muted-foreground">
                <Zap size={12} aria-hidden="true" /> يصل خلال ~5 ثوانٍ عبر Solana Devnet
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ══ How it works ══ */}
      <HowItWorksFlow />

      {/* ══ Comparison table ══ */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black">لماذا VeloPay؟</h2>
            <p className="text-muted-foreground">المقارنة تتكلم عن نفسها</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border bg-card">
                  <th className="py-4 pr-6 text-right text-sm text-muted-foreground" />
                  <th className="py-4 text-center text-sm font-bold text-primary">VeloPay</th>
                  <th className="py-4 text-center text-sm text-muted-foreground">Western Union</th>
                  <th className="py-4 text-center text-sm text-muted-foreground">بنكي</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "الرسوم", a: "$0.01", b: "$15-20", c: "$25-35" },
                  { label: "الوقت", a: "< 5 ثوانٍ", b: "ساعات", c: "أيام" },
                  { label: "الشفافية", a: "Blockchain", b: "❌", c: "❌", hasCheck: true },
                  { label: "رقم هاتف فقط", a: "✅", b: "❌", c: "❌", hasCheck: true },
                  { label: "Yield", a: "Premium", b: "❌", c: "❌", hasCheck: true },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-border last:border-0">
                    <td className="py-4 pr-6 text-sm text-muted-foreground">{row.label}</td>
                    <td className="py-4 text-center text-sm font-bold text-primary">
                      <span className="flex items-center justify-center gap-1">
                        {row.hasCheck && <CheckCircle2 size={14} aria-hidden="true" />}
                        {row.a}
                      </span>
                    </td>
                    <td className="py-4 text-center text-sm text-muted-foreground/60">{row.b}</td>
                    <td className="py-4 text-center text-sm text-muted-foreground/60">{row.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ══ Footer ══ */}
      <Footer />

      <PremiumModal open={showPremium} onClose={() => setShowPremium(false)} />
      <PaymentMethodModal open={showPaymentMethod} onClose={() => setShowPaymentMethod(false)} />
    </div>
  );
}