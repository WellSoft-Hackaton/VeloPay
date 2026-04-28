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
    <div className="order-2 lg:order-1 flex flex-col justify-center">
      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-medium text-primary shadow-[0_0_30px_rgba(19,182,1,0.12)]">
        <span className="h-2 w-2 animate-pulse rounded-full bg-primary shadow-[0_0_12px_rgba(19,182,1,0.95)]" />
        يعمل على شبكة Solona
      </div>

      <h1 className="mt-6 max-w-2xl text-5xl font-black leading-[1.1] tracking-tight text-white sm:text-6xl xl:text-7xl">
        حوّل أموالك
        <span className="block bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent pb-2">بذكاء وراحة</span>
      </h1>

      <p className="mt-6 max-w-xl text-lg leading-relaxed sm:text-xl font-light text-transparent bg-clip-text bg-[linear-gradient(to_right,rgba(255,255,255,0.4)_0%,rgba(255,255,255,1)_50%,rgba(255,255,255,0.4)_100%)] bg-[length:200%_auto] animate-[shimmer-ltr_3s_linear_infinite]">
        حوالات مالية سريعة، آمنة، وتكلفة منخفضة إلى العائلة والأصدقاء في مختلف دول الشرق الأوسط، مدعومة بتقنية البلوكتشين.
        <style>{`
          @keyframes shimmer-ltr {
            to {
              background-position: 200% center;
            }
          }
        `}</style>
      </p>

      <div className="mt-10 flex flex-wrap items-center gap-5">
        <button
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('how')?.scrollIntoView({ behavior: 'smooth' });
          }}
          className="group relative inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-8 py-4 text-lg font-medium text-white backdrop-blur-md transition-all hover:border-white/40 hover:bg-white/10 hover:shadow-[0_0_30px_rgba(255,255,255,0.1)] active:scale-95 overflow-hidden"
        >
          <span className="relative z-10 flex items-center gap-2">
            كيف يعمل؟
            <ArrowDown size={20} className="transition-transform group-hover:translate-y-1" aria-hidden="true" />
          </span>
          <div className="absolute inset-0 bg-white/5 translate-y-full transition-transform group-hover:translate-y-0" />
        </button>
      </div>

      <div className="mt-12 grid max-w-2xl grid-cols-1 gap-4 sm:grid-cols-2">
        {[
          { label: "رسوم التحويل", value: "$0.01" },
          { label: "وقت الوصول", value: "~5 ثوانٍ" }
        ].map((stat, i) => (
          <div key={i} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 px-5 py-4 backdrop-blur-md transition-colors hover:bg-white/10 hover:border-primary/50">
            <div className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-primary/20 blur-2xl transition-all group-hover:bg-primary/40" />
            <div className="relative z-10 text-sm font-medium text-white/50">{stat.label}</div>
            <div className="relative z-10 mt-1 text-2xl font-black text-white">{stat.value}</div>
          </div>
        ))}
      </div>
    </div>

    {/* Calculator */}
    <div className="order-1 lg:order-2 flex justify-center">
      <div className="relative w-full max-w-[420px] overflow-hidden rounded-3xl border border-white/10 bg-[#101010]/90 p-4 shadow-[0_30px_100px_rgba(0,0,0,0.65)] backdrop-blur-xl sm:p-5">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(19,182,1,0.14),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(19,182,1,0.08),transparent_22%)]" />

        <div className="relative">
          <div className="mb-6 text-center">
            <h2 className="text-xl font-bold text-white tracking-tight">احسب تحويلك الآن</h2>
            <p className="mt-1.5 text-xs font-medium text-white/60">سعر مباشر، تحويل فوري، ورسوم شبه معدومة</p>
          </div>

          <div className="space-y-3">
            <div className="group relative rounded-2xl border border-white/10 bg-white/5 p-3 transition-colors focus-within:border-primary/50 focus-within:bg-white/10">
              <div className="mb-2 flex items-center justify-between text-xs font-medium text-white/60">
                <span>أنت ترسل</span>
                <span>المبلغ المُرسَل</span>
              </div>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 w-full bg-transparent px-2 text-2xl font-black text-white outline-none placeholder:text-white/20"
                />
                <div className="flex items-center gap-1 rounded-xl bg-black/50 p-1 pr-2 border border-white/5">
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="bg-transparent text-base font-bold text-white outline-none cursor-pointer w-[80px] appearance-none text-center"
                  >
                    {FROM_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code} className="bg-zinc-900 text-left">
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center -my-1 z-20">
              <div className="absolute w-full border-t border-dashed border-white/10" />
              <div className="relative flex h-10 w-10 items-center justify-center rounded-full border-4 border-[#0a0a0a] bg-primary text-black shadow-[0_0_15px_rgba(19,182,1,0.3)] transition-transform hover:rotate-180 duration-500">
                <ArrowDown size={18} strokeWidth={3} aria-hidden="true" />
              </div>
            </div>

            <div className="group relative rounded-2xl border border-primary/30 bg-primary/5 p-3 transition-colors">
              <div className="absolute inset-0 bg-primary/5 blur-xl rounded-2xl pointer-events-none" />
              <div className="relative">
                <div className="mb-2 flex items-center justify-between text-xs font-medium text-primary/80">
                  <span>المستلم يحصل على</span>
                  <span>المبلغ النهائي</span>
                </div>
                <div className="flex gap-3">
                  <div className="flex-1 px-2 text-2xl font-black text-primary overflow-hidden text-ellipsis">
                    {converted.toLocaleString("ar", { maximumFractionDigits: 2 })}
                  </div>
                  <div className="flex items-center gap-1 rounded-xl bg-black/50 p-1 pr-2 border border-primary/20">
                    <select
                      value={toCurrency}
                      onChange={(e) => setToCurrency(e.target.value)}
                      className="bg-transparent text-base font-bold text-white outline-none cursor-pointer w-[80px] appearance-none text-center"
                    >
                      {TO_CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code} className="bg-zinc-900 text-left">
                          {c.flag} {c.code}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-2 flex items-center justify-between px-2 text-xs font-medium">
              <span className="text-white/50">سعر الصرف المباشر</span>
              <span className="text-primary">1 {fromCurrency} = {RATES[fromCurrency]?.[toCurrency]?.toFixed(4) ?? "0.0000"} {toCurrency}</span>
            </div>

            <button
              onClick={() => setShowPaymentMethod(true)}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-center text-lg font-black text-black shadow-[0_0_20px_rgba(19,182,1,0.3)] transition-all hover:bg-[#15cf01] hover:shadow-[0_0_30px_rgba(19,182,1,0.5)] active:scale-[0.98]"
            >
              أرسل الآن
              <ArrowLeft size={20} strokeWidth={3} aria-hidden="true" />
            </button>

            <div className="mt-3 flex items-center justify-center gap-1.5 text-xs font-medium text-white/50">
              <Zap size={14} className="text-primary" aria-hidden="true" />
              يصل خلال <span className="text-white">~5 ثوانٍ</span> عبر Solana Devnet
            </div>
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
      {/* ══ Bento Box Features ══ */}
      <section className="relative px-6 py-32 overflow-hidden bg-black text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,rgba(19,182,1,0.1),transparent_50%)] pointer-events-none" />
        <div className="relative mx-auto max-w-6xl">
          <div className="mb-20">
            <h2 className="mb-4 text-4xl md:text-5xl font-black tracking-tight text-white/90">
              أعدنا ابتكار <span className="bg-gradient-to-r from-primary to-emerald-300 bg-clip-text text-transparent">التحويلات المالية</span>
            </h2>
            <p className="text-xl text-white/50 font-light max-w-2xl">
              تخلصنا من الأنظمة المصرفية القديمة لنقدم لك تجربة تحويل مالية تليق بالمستقبل.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
            {/* Bento Item 1: Speed */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-all hover:border-primary/50 hover:bg-white/10">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex justify-between items-start">
                  <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center backdrop-blur-md border border-primary/30 text-primary">
                    <Zap size={28} />
                  </div>
                  <div className="text-right">
                    <span className="inline-block rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur-sm">
                      مقارنة بالبنوك
                    </span>
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-2">سرعة فائقة</h3>
                  <p className="text-white/60 text-lg">تصل حوالتك في أقل من 5 ثوانٍ، بينما تستغرق البنوك التقليدية أياماً.</p>
                </div>
              </div>
              {/* Background abstract element */}
              <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-primary/20 blur-[80px] pointer-events-none group-hover:bg-primary/30 transition-all duration-700" />
            </div>

            {/* Bento Item 2: Cost */}
            <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-all hover:border-primary/50 hover:bg-white/10">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="h-14 w-14 rounded-2xl bg-primary/20 flex items-center justify-center backdrop-blur-md border border-primary/30 text-primary">
                  <Banknote size={28} />
                </div>
                <div>
                  <div className="text-5xl font-black text-primary mb-2">$0.01</div>
                  <h3 className="text-xl font-bold text-white mb-1">تكلفة شبه معدومة</h3>
                  <p className="text-white/60 text-sm">وداعاً للرسوم المرتفعة التي تقتطع من أموالك.</p>
                </div>
              </div>
            </div>

            {/* Bento Item 3: Transparency */}
            <div className="group relative overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 p-8 transition-all hover:border-primary/50 hover:bg-white/10">
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20 text-white">
                  <CheckCircle2 size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-1">شفافية البلوكتشين</h3>
                  <p className="text-white/60 text-sm">كل معاملة مسجلة على شبكة Solana، لا مجال للأخطاء أو الرسوم الخفية.</p>
                </div>
              </div>
            </div>

            {/* Bento Item 4: Ease of use */}
            <div className="md:col-span-2 group relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-r from-primary/5 to-white/5 p-8 transition-all hover:border-primary/30 hover:from-primary/10">
              <div className="relative z-10 flex flex-col md:flex-row gap-8 items-center h-full">
                <div className="flex-1">
                  <h3 className="text-3xl font-black text-white mb-4">بساطة مطلقة</h3>
                  <p className="text-white/60 text-lg">أرسل واستقبل الأموال برقم الهاتف فقط. لا حاجة لحسابات بنكية معقدة أو زيارة فروع الصرافة.</p>
                </div>
                <div className="h-32 w-full md:w-48 rounded-xl bg-black/50 border border-white/10 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%)] bg-[length:250%_250%,100%_100%] animate-[shimmer-rtl_2s_infinite]" />
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                      <Zap size={16} />
                    </div>
                    <div className="h-2 w-16 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-full animate-pulse" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
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