"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PremiumModal } from "@/components/PremiumModal";
import HowItWorksFlow from "@/components/HowItWorksFlow";
import { PaymentMethodModal } from "@/components/PaymentMethodModal";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { ExchangeRateAlert } from "@/components/ExchangeRateAlert";
import { LiveRateTicker } from "@/components/LiveRateTicker";
import { GlobeBackground } from "@/components/GlobeBackground";
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
<section className="relative isolate overflow-hidden bg-black px-6 pb-20 pt-10 sm:pt-14" style={{ minHeight: "680px" }}>
  {/* Background gradient overlay */}
  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_38%,rgba(19,182,1,0.10),transparent_22%),radial-gradient(circle_at_58%_52%,rgba(19,182,1,0.06),transparent_30%),linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.3))]" />
  <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent" />

  {/* Animated canvas globe */}
  <GlobeBackground />

  <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-[1.02fr_0.98fr]">
    {/* Text */}
    <div className="order-2 lg:order-1">
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-[0_0_30px_rgba(19,182,1,0.12)]">
        <span className="h-2 w-2 rounded-full bg-primary shadow-[0_0_12px_rgba(19,182,1,0.95)]" />
        حوالات ذكية في جميع أنحاء الشرق الأوسط
      </div>

      <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[1.02] tracking-tight text-white sm:text-6xl xl:text-7xl">
        حوّل أموالك
        <span className="block text-primary">بذكاء وراحة</span>
      </h1>

      <p className="mt-6 max-w-xl text-lg leading-8 text-white/68 sm:text-xl">
        حوالات مالية سريعة، آمنة، وتكلفة منخفضة إلى العائلة والأصدقاء في مختلف دول الشرق الأوسط.
      </p>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <Link
          href="/send"
          className="group inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-lg font-bold text-black shadow-[0_18px_45px_rgba(19,182,1,0.25)] transition hover:brightness-110 active:scale-[0.98]"
        >
          ابدأ التحويل الآن
          <ArrowLeft
            size={18}
            className="transition-transform group-hover:-translate-x-1"
            aria-hidden="true"
          />
        </Link>

        <a
          href="#how"
          className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/3 px-8 py-4 text-lg font-medium text-white/70 transition hover:border-primary/40 hover:bg-white/5 hover:text-white"
        >
          كيف يعمل؟
        </a>
      </div>

      <div className="mt-10 grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/8 bg-white/3 px-5 py-4 backdrop-blur-md">
          <div className="text-sm text-white/45">رسوم التحويل</div>
          <div className="mt-2 text-2xl font-black text-primary">$0.01</div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/3 px-5 py-4 backdrop-blur-md">
          <div className="text-sm text-white/45">وقت الوصول</div>
          <div className="mt-2 text-2xl font-black text-primary">~5 ثوانٍ</div>
        </div>

        <div className="rounded-2xl border border-white/8 bg-white/3 px-5 py-4 backdrop-blur-md">
          <div className="text-sm text-white/45">بدون رسوم خفية</div>
          <div className="mt-2 text-2xl font-black text-primary">واضح دائمًا</div>
        </div>
      </div>
    </div>

    {/* Calculator */}
    <div className="order-1 lg:order-2">
      <div className="relative mx-auto w-full max-w-[560px] overflow-hidden rounded-[30px] border border-white/10 bg-[#101010]/90 p-5 shadow-[0_40px_140px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:p-6">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(19,182,1,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(19,182,1,0.08),transparent_22%)]" />

        <div className="relative">
          <div className="mb-5 text-center">
            <h2 className="text-xl font-semibold text-white">احسب تحويلك الآن</h2>
            <p className="mt-1 text-sm text-white/55">أفضل سعر، تحويل فوري، ورسوم منخفضة</p>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
              <div className="mb-2 flex items-center justify-between text-sm text-white/50">
                <span>أرسل</span>
                <span>مبلغ التحويل</span>
              </div>

              <div className="flex gap-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 rounded-2xl border border-white/8 bg-[#0b0b0b] px-4 py-4 text-2xl font-black text-white outline-none transition placeholder:text-white/20 focus:border-primary/50"
                />
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="min-w-[110px] rounded-2xl border border-white/8 bg-[#111111] px-3 py-4 text-sm font-medium text-white outline-none"
                >
                  {FROM_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 text-sm text-white/45">الرصيد المتاح: 2,450.00 SAR</div>
            </div>

            <div className="flex items-center justify-center">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-primary/25 bg-primary/10 text-primary shadow-[0_0_30px_rgba(19,182,1,0.18)]">
                <ArrowDown size={18} aria-hidden="true" />
              </div>
            </div>

            <div className="rounded-2xl border border-white/8 bg-black/30 p-4">
              <div className="mb-2 flex items-center justify-between text-sm text-white/50">
                <span>يستلم</span>
                <span>المبلغ النهائي</span>
              </div>

              <div className="flex gap-3">
                <div className="flex flex-1 items-center rounded-2xl border border-primary/30 bg-primary/10 px-4 py-4">
                  <span className="text-2xl font-black text-primary">
                    {converted.toLocaleString("ar", { maximumFractionDigits: 2 })}
                  </span>
                </div>

                <select
                  value={toCurrency}
                  onChange={(e) => setToCurrency(e.target.value)}
                  className="min-w-[110px] rounded-2xl border border-white/8 bg-[#111111] px-3 py-4 text-sm font-medium text-white outline-none"
                >
                  {TO_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="mt-3 text-sm text-primary/85">
                1 {fromCurrency} = {RATES[fromCurrency]?.[toCurrency]?.toFixed(4) ?? "0.0000"} {toCurrency}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-4">
                <div className="text-sm text-white/45">طريقة الاستلام</div>
                <div className="mt-2 text-base font-semibold text-white">VeloPay</div>
                <div className="mt-1 text-sm text-white/45">فوري</div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-4">
                <div className="text-sm text-white/45">طريقة الدفع</div>
                <div className="mt-2 text-base font-semibold text-white">تحويل بنكي</div>
                <div className="mt-1 text-sm text-white/45">موثوق</div>
              </div>

              <div className="rounded-2xl border border-white/8 bg-white/4 px-4 py-4">
                <div className="text-sm text-white/45">الرسوم</div>
                <div className="mt-2 text-base font-semibold text-primary">$0.01</div>
                <div className="mt-1 text-sm text-white/45">منخفضة جدًا</div>
              </div>
            </div>

            <button
              onClick={() => setShowPaymentMethod(true)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-center text-lg font-bold text-black shadow-[0_18px_45px_rgba(19,182,1,0.24)] transition hover:brightness-110 active:scale-[0.98]"
            >
              أرسل {amount || "..."} {fromCurrency} الآن
              <ArrowRight size={18} aria-hidden="true" />
            </button>

            <p className="flex items-center justify-center gap-1 text-center text-xs text-white/50">
              <Zap size={12} aria-hidden="true" />
              يصل خلال ~5 ثوانٍ عبر Solana Devnet
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>

      {/* ══ How it works ══ */}
      <HowItWorksFlow />

      {/* ══ current exchange rate & alerts ══ */}
      <section className="px-6 py-12">
        <div className="mx-auto max-w-5xl grid gap-8 md:grid-cols-2 items-start">
          <LiveRateTicker />
          <ExchangeRateAlert />
        </div>
      </section>
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