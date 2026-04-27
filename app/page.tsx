"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { PremiumModal } from "@/components/PremiumModal";
import HowItWorksFlow from "@/components/HowItWorksFlow";

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

// ─── Notification Bell ────────────────────────────────────────────────────────
function NotificationBell() {
  const [open, setOpen] = useState(false);
  const NOTIFICATIONS: any[] = [];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/20 text-gray-300 transition hover:border-white/40 hover:text-white"
      >
        🔔
        <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
          {NOTIFICATIONS.length}
        </span>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-11 z-40 w-72 rounded-2xl border border-white/10 bg-[#0d1a0d] p-1 shadow-2xl">
            <div className="px-3 py-2 text-xs font-bold text-gray-400">الإشعارات</div>
            {NOTIFICATIONS.length > 0 ? (
              NOTIFICATIONS.map((n, i) => (
                <div
                  key={i}
                  className="flex cursor-pointer items-start gap-3 rounded-xl px-3 py-3 transition hover:bg-white/5"
                >
                  <span className="text-xl">{n.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-200 leading-tight">{n.text}</p>
                    <p className="mt-0.5 text-xs text-gray-500">{n.time}</p>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-3 py-4 text-center text-sm text-gray-500">
                لا توجد إشعارات حالياً
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

// ─── Live Rate Ticker (scrolling) ────────────────────────────────────────────
function LiveTicker() {
  const items = [...TICKER_PAIRS, ...TICKER_PAIRS]; // duplicate for seamless loop

  return (
    <div className="overflow-hidden border-b border-white/5 bg-[#0a110a] py-2">
      <div
        className="flex gap-8 whitespace-nowrap"
        style={{
          animation: "ticker 30s linear infinite",
          width: "max-content",
        }}
      >
        {items.map((p, i) => {
          const rate = RATES[p.from]?.[p.to] ?? 0;
          const isUp = Math.random() > 0.5; // demo: random direction
          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-gray-300">{p.label}</span>
              <span className="font-mono font-black text-[#13B601]">{rate.toFixed(4)}</span>
              <span className={`text-[10px] ${isUp ? "text-green-400" : "text-red-400"}`}>
                {isUp ? "▲" : "▼"} {(Math.random() * 0.0005).toFixed(4)}
              </span>
              <span className="text-gray-700">|</span>
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
  const [scrolled, setScrolled] = useState(false);
  const [showPremium, setShowPremium] = useState(false);

  useEffect(() => {
    const rate = RATES[fromCurrency]?.[toCurrency] ?? 0.1;
    setConverted(parseFloat(amount || "0") * rate);
  }, [amount, fromCurrency, toCurrency]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const wuFee = (parseFloat(amount || "0") * 0.035 + 5).toFixed(2);
  const bankFee = (parseFloat(amount || "0") * 0.05 + 15).toFixed(2);

  return (
    <div className="min-h-screen bg-[#050a05] text-white" dir="rtl">
      {/* ══ Live ticker ══ */}
      <LiveTicker />

      {/* ══ Navbar ══ */}
      <nav
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "bg-[#050a05]/95 backdrop-blur-md shadow-lg shadow-black/30"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/VeloPay.png" alt="VeloPay Logo" className="h-9" />
          </Link>

          {/* Right actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notification bell */}
            <NotificationBell />

            {/* Developer link */}
            <Link
              href="/developer"
              className="hidden items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-medium text-gray-300 transition hover:border-white/30 hover:text-white sm:flex"
            >
              <span className="text-[10px]">{"</>"}</span>
              Developer
            </Link>

            {/* Premium */}
            <button
              onClick={() => setShowPremium(true)}
              className="hidden items-center gap-1.5 rounded-full border border-[#13B601]/40 px-4 py-2 text-xs font-semibold text-[#13B601] transition hover:bg-[#13B601]/10 sm:flex"
            >
              ⭐ Premium
            </button>

            {/* Dashboard */}
            <Link
              href="/dashboard"
              className="hidden text-sm text-gray-400 transition hover:text-white sm:block"
            >
              الحساب
            </Link>

            {/* CTA */}
            <Link
              href="/send"
              className="rounded-full bg-[#13B601] px-5 py-2 text-sm font-bold text-white shadow-lg shadow-[#13B601]/25 transition hover:bg-[#0fa301] active:scale-95"
            >
              أرسل الآن
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ Hero ══ */}
      <section className="relative overflow-hidden px-6 pb-24 pt-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#13B601]/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#13B601]/5 blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Text */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#13B601]/30 bg-[#13B601]/10 px-4 py-1.5 text-sm text-[#13B601]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#13B601]" />
                Solana • رسوم أقل من $0.01
              </div>

              <h1 className="mb-6 text-5xl font-black leading-tight lg:text-6xl">
                حوّل أموالك{" "}
                <span className="text-[#13B601]">فوراً</span>
                <br />
                من الخليج لأهلك
              </h1>

              <p className="mb-8 text-xl leading-relaxed text-gray-400">
                بدون رسوم مصرفية مرتفعة. بدون انتظار.
                <br />
                فقط رقم الهاتف — وخلال ثوانٍ يصل المال.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/send"
                  className="group flex items-center gap-2 rounded-full bg-[#13B601] px-8 py-4 text-lg font-bold text-white shadow-xl shadow-[#13B601]/30 transition hover:bg-[#0fa301] active:scale-95"
                >
                  ابدأ التحويل الآن
                  <span className="transition-transform group-hover:-translate-x-1">←</span>
                </Link>
                <a
                  href="#how"
                  className="flex items-center gap-2 rounded-full border border-white/20 px-8 py-4 text-lg font-medium text-gray-300 transition hover:border-white/40 hover:text-white"
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
                    <div className="text-2xl font-black text-[#13B601]">{s.value}</div>
                    <div className="text-sm text-gray-500">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculator */}
            <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm shadow-2xl">
              <div className="mb-6 text-center text-sm font-medium text-gray-400">
                احسب تحويلك الآن
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-xs text-gray-500">أرسل</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-2xl font-bold text-white outline-none transition focus:border-[#13B601]/50"
                  />
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#0d1a0d] px-3 py-3 text-sm font-medium text-white outline-none"
                  >
                    {FROM_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="my-4 flex items-center gap-4">
                <div className="flex-1 border-t border-white/10" />
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#13B601]/30 bg-[#13B601]/10 text-[#13B601]">
                  ↓
                </div>
                <div className="flex-1 border-t border-white/10" />
              </div>

              <div className="mb-6">
                <label className="mb-2 block text-xs text-gray-500">يستلم</label>
                <div className="flex gap-3">
                  <div className="flex-1 rounded-xl border border-[#13B601]/30 bg-[#13B601]/10 px-4 py-3">
                    <span className="text-2xl font-black text-[#13B601]">
                      {converted.toLocaleString("ar", { maximumFractionDigits: 2 })}
                    </span>
                  </div>
                  <select
                    value={toCurrency}
                    onChange={(e) => setToCurrency(e.target.value)}
                    className="rounded-xl border border-white/10 bg-[#0d1a0d] px-3 py-3 text-sm font-medium text-white outline-none"
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
              <div className="mb-6 space-y-2 rounded-xl border border-white/5 bg-white/3 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">رسوم VeloPay</span>
                  <span className="font-bold text-[#13B601]">$0.01 فقط ⚡</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">Western Union</span>
                  <span className="text-red-400 line-through">${wuFee}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-400">تحويل بنكي</span>
                  <span className="text-red-400 line-through">${bankFee}</span>
                </div>
                <div className="mt-2 border-t border-white/10 pt-2 text-center text-xs text-[#13B601]">
                  💰 توفر{" "}
                  <strong>${(parseFloat(bankFee) - 0.01).toFixed(2)}</strong> مقارنة
                  بالبنك
                </div>
              </div>

              <Link
                href="/send"
                className="block w-full rounded-full bg-[#13B601] py-4 text-center text-lg font-bold text-white shadow-lg shadow-[#13B601]/30 transition hover:bg-[#0fa301] active:scale-95"
              >
                أرسل {amount || "..."} {fromCurrency} الآن →
              </Link>
              <p className="mt-3 text-center text-xs text-gray-600">
                ⚡ يصل خلال ~5 ثوانٍ عبر Solana Devnet
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
            <p className="text-gray-400">المقارنة تتكلم عن نفسها</p>
          </div>
          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10 bg-white/5">
                  <th className="py-4 pr-6 text-right text-sm text-gray-400" />
                  <th className="py-4 text-center text-sm font-bold text-[#13B601]">VeloPay</th>
                  <th className="py-4 text-center text-sm text-gray-400">Western Union</th>
                  <th className="py-4 text-center text-sm text-gray-400">بنكي</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "الرسوم", a: "$0.01", b: "$15-20", c: "$25-35" },
                  { label: "الوقت", a: "< 5 ثوانٍ", b: "ساعات", c: "أيام" },
                  { label: "الشفافية", a: "✅ Blockchain", b: "❌", c: "❌" },
                  { label: "رقم هاتف فقط", a: "✅", b: "❌", c: "❌" },
                  { label: "Yield", a: "✅ Premium", b: "❌", c: "❌" },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-white/5 last:border-0">
                    <td className="py-4 pr-6 text-sm text-gray-400">{row.label}</td>
                    <td className="py-4 text-center text-sm font-bold text-[#13B601]">{row.a}</td>
                    <td className="py-4 text-center text-sm text-gray-500">{row.b}</td>
                    <td className="py-4 text-center text-sm text-gray-500">{row.c}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>



      {/* ══ Footer ══ */}
      <footer className="border-t border-white/5 px-6 py-10 text-center text-sm text-gray-600">
        <div className="mb-2 flex items-center justify-center gap-2">
          <img src="/VeloPay.png" alt="VeloPay Logo" className="h-6" />
        </div>
        <p>© 2026 VeloPay — مبني على Solana Blockchain</p>
        <p className="mt-1 text-xs">Hackathon MVP — بيانات تجريبية على Devnet</p>
      </footer>

      <PremiumModal open={showPremium} onClose={() => setShowPremium(false)} />
    </div>
  );
}