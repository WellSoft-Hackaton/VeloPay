"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import PremiumModal from "@/components/PremiumModal";

const RATES: Record<string, Record<string, number>> = {
  SAR: { JOD: 0.0995, USD: 0.2667, AED: 0.979, IQD: 349.5, SYP: 3462 },
  AED: { JOD: 0.1015, USD: 0.2723, SAR: 1.021, IQD: 356.8, SYP: 3534 },
  KWD: { JOD: 2.31, USD: 3.26, SAR: 12.19, AED: 11.97, IQD: 8134, SYP: 80600 },
  QAR: { JOD: 0.1948, USD: 0.2747, SAR: 1.030, AED: 1.007 },
};

const FROM_CURRENCIES = [
  { code: "SAR", flag: "🇸🇦", name: "ريال سعودي" },
  { code: "AED", flag: "🇦🇪", name: "درهم إماراتي" },
  { code: "KWD", flag: "🇰🇼", name: "دينار كويتي" },
  { code: "QAR", flag: "🇶🇦", name: "ريال قطري" },
];

const TO_CURRENCIES = [
  { code: "JOD", flag: "🇯🇴", name: "دينار أردني" },
  { code: "USD", flag: "🇵🇸", name: "دولار (فلسطين)" },
  { code: "IQD", flag: "🇮🇶", name: "دينار عراقي" },
  { code: "SYP", flag: "🇸🇾", name: "ليرة سورية" },
];

const PREMIUM_FEATURES = [
  { icon: "∞", label: "تحويلات غير محدودة" },
  { icon: "📈", label: "مبالغ أكبر" },
  { icon: "🪙", label: "Yield على رصيدك" },
  { icon: "⏰", label: "أتمتة مجدولة" },
  { icon: "🔔", label: "تنبيهات الصرف" },
  { icon: "📊", label: "AI Dashboard" },
];

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
      {/* ========== NAV ========== */}
      <nav
        className={`fixed top-0 z-50 w-full transition-all duration-300 ${
          scrolled ? "bg-[#050a05]/95 backdrop-blur-md shadow-lg shadow-black/20" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-2">
            <img src="/VeloPay.png" alt="VeloPay logo" className="h-9 w-9 rounded-xl" />
            <span className="text-xl font-bold tracking-tight">VeloPay</span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowPremium(true)}
              className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#13B601]/40 px-4 py-2 text-sm font-medium text-[#13B601] transition hover:bg-[#13B601]/10"
            >
              ⭐ Premium
            </button>
            <Link
              href="/dashboard"
              className="text-sm text-gray-400 transition hover:text-white"
            >
              الحساب
            </Link>
            <Link
              href="/send"
              className="rounded-full bg-[#13B601] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#0fa301] active:scale-95"
            >
              أرسل الآن
            </Link>
          </div>
        </div>
      </nav>

      {/* ========== HERO ========== */}
      <section className="relative overflow-hidden px-6 pb-24 pt-32">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 h-[600px] w-[600px] -translate-x-1/2 rounded-full bg-[#13B601]/10 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-[#13B601]/5 blur-[80px]" />
        </div>

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            {/* Left: Text */}
            <div>
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#13B601]/30 bg-[#13B601]/10 px-4 py-1.5 text-sm text-[#13B601]">
                <span className="h-2 w-2 animate-pulse rounded-full bg-[#13B601]" />
                يعمل على شبكة Solana • رسوم أقل من $0.01
              </div>

              <h1 className="mb-6 text-5xl font-black leading-tight lg:text-6xl">
                حوّل أموالك{" "}
                <span className="text-[#13B601]">فوراً</span>
                <br />
                من الخليج لأهلك
              </h1>

              <p className="mb-8 text-xl leading-relaxed text-gray-400">
                بدون رسوم مصرفية مرتفعة. بدون انتظار أيام.
                <br />
                فقط رقم الهاتف — وخلال ثوانٍ يصل المال.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  href="/send"
                  className="group flex items-center gap-2 rounded-full bg-[#13B601] px-8 py-4 text-lg font-bold text-white transition hover:bg-[#0fa301] active:scale-95"
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

              {/* Stats */}
              <div className="mt-12 flex gap-8">
                {[
                  { value: "$0.01", label: "رسوم التحويل" },
                  { value: "~5 ثوانٍ", label: "وقت الوصول" },
                  { value: "100%", label: "شفافية Blockchain" },
                ].map((stat) => (
                  <div key={stat.label}>
                    <div className="text-2xl font-black text-[#13B601]">{stat.value}</div>
                    <div className="text-sm text-gray-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Calculator */}
            <div className="relative">
              <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm">
                <div className="mb-6 text-center text-sm font-medium text-gray-400">
                  احسب تحويلك الآن
                </div>

                {/* From */}
                <div className="mb-4">
                  <label className="mb-2 block text-xs text-gray-500">أرسل</label>
                  <div className="flex gap-3">
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="flex-1 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-2xl font-bold text-white outline-none transition focus:border-[#13B601]/50"
                      placeholder="500"
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

                {/* To */}
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

                {/* Fees comparison */}
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
                    <strong>${(parseFloat(bankFee) - 0.01).toFixed(2)}</strong>{" "}
                    مقارنة بالتحويل البنكي
                  </div>
                </div>

                <Link
                  href="/send"
                  className="block w-full rounded-full bg-[#13B601] py-4 text-center text-lg font-bold text-white transition hover:bg-[#0fa301] active:scale-95"
                >
                  أرسل {amount || "..."} {fromCurrency} الآن →
                </Link>

                <p className="mt-3 text-center text-xs text-gray-600">
                  ⚡ يصل خلال ~5 ثوانٍ عبر Solana Devnet
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section id="how" className="px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-black">كيف يعمل VeloPay؟</h2>
            <p className="text-gray-400">3 خطوات بسيطة — بدون تعقيد</p>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">
            {[
              {
                step: "01",
                icon: "📱",
                title: "أدخل المبلغ والمستلم",
                desc: "فقط رقم هاتف المستلم. لا IBAN، لا SWIFT، لا تعقيد.",
              },
              {
                step: "02",
                icon: "💳",
                title: "ادفع ببطاقتك",
                desc: "Visa أو Mastercard. المال يتحول تلقائياً إلى USDC على Solana.",
              },
              {
                step: "03",
                icon: "⚡",
                title: "يصل في ثوانٍ",
                desc: "خلال 3-5 ثوانٍ يصل للمستلم. يختار كيف يستلمه.",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="group rounded-2xl border border-white/10 bg-white/3 p-8 transition hover:border-[#13B601]/30 hover:bg-[#13B601]/5"
              >
                <div className="mb-4 flex items-center gap-4">
                  <span className="text-4xl">{item.icon}</span>
                  <span className="text-5xl font-black text-white/10 group-hover:text-[#13B601]/20">
                    {item.step}
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========== PREMIUM SECTION ========== */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-[#13B601]/20 bg-gradient-to-br from-[#13B601]/10 to-[#0fa301]/5 p-10">
            <div className="text-center mb-10">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-[#13B601]/20 px-4 py-1.5 text-sm font-medium text-[#13B601]">
                ⭐ VeloPay Premium
              </div>
              <h2 className="mb-3 text-4xl font-black">افتح الإمكانيات الكاملة</h2>
              <p className="text-gray-400 text-lg">
                من $9.99 / شهر — وفّر أكثر مع كل تحويل
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 mb-10">
              {PREMIUM_FEATURES.map((f) => (
                <div
                  key={f.label}
                  className="flex items-center gap-3 rounded-xl border border-[#13B601]/20 bg-white/5 px-4 py-3"
                >
                  <span className="text-xl">{f.icon}</span>
                  <span className="text-sm font-medium text-gray-300">{f.label}</span>
                </div>
              ))}
            </div>

            <div className="text-center">
              <button
                onClick={() => setShowPremium(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#13B601] px-10 py-5 text-xl font-black text-white transition hover:bg-[#0fa301] active:scale-95 shadow-lg shadow-[#13B601]/30"
              >
                ⭐ اشترك في Premium
              </button>
              <p className="mt-3 text-sm text-gray-500">
                لا بيانات بنكية حقيقية • محاكاة MVP
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== COMPARISON TABLE ========== */}
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
                  <th className="py-4 pr-6 text-right text-sm text-gray-400"></th>
                  <th className="py-4 text-center text-sm font-bold text-[#13B601]">VeloPay</th>
                  <th className="py-4 text-center text-sm text-gray-400">Western Union</th>
                  <th className="py-4 text-center text-sm text-gray-400">تحويل بنكي</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: "الرسوم", nexapay: "$0.01", wu: "$15-20", bank: "$25-35" },
                  { label: "وقت الوصول", nexapay: "< 5 ثوانٍ", wu: "ساعات", bank: "1-3 أيام" },
                  { label: "الشفافية", nexapay: "✅ Blockchain", wu: "❌ لا", bank: "❌ لا" },
                  { label: "تتبع فوري", nexapay: "✅ نعم", wu: "جزئي", bank: "❌ لا" },
                  { label: "رقم هاتف فقط", nexapay: "✅ نعم", wu: "❌ لا", bank: "❌ لا" },
                  { label: "Yield على الرصيد", nexapay: "✅ Premium", wu: "❌ لا", bank: "❌ لا" },
                ].map((row) => (
                  <tr key={row.label} className="border-b border-white/5 last:border-0">
                    <td className="py-4 pr-6 text-sm text-gray-400">{row.label}</td>
                    <td className="py-4 text-center text-sm font-bold text-[#13B601]">
                      {row.nexapay}
                    </td>
                    <td className="py-4 text-center text-sm text-gray-500">{row.wu}</td>
                    <td className="py-4 text-center text-sm text-gray-500">{row.bank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ========== COUNTRIES ========== */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-12 text-4xl font-black">المناطق المدعومة</h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/3 p-8">
              <p className="mb-4 text-sm text-gray-400">ترسل من</p>
              <div className="flex flex-wrap justify-center gap-4">
                {["🇸🇦 السعودية", "🇦🇪 الإمارات", "🇶🇦 قطر", "🇰🇼 الكويت"].map((c) => (
                  <span key={c} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm">
                    {c}
                  </span>
                ))}
              </div>
            </div>
            <div className="rounded-2xl border border-[#13B601]/20 bg-[#13B601]/5 p-8">
              <p className="mb-4 text-sm text-[#13B601]">يصل إلى</p>
              <div className="flex flex-wrap justify-center gap-4">
                {["🇯🇴 الأردن", "🇵🇸 فلسطين", "🇮🇶 العراق", "🇸🇾 سوريا"].map((c) => (
                  <span key={c} className="rounded-full border border-[#13B601]/20 bg-[#13B601]/10 px-4 py-2 text-sm text-[#13B601]">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-2xl rounded-3xl border border-[#13B601]/20 bg-[#13B601]/10 p-16 text-center">
          <h2 className="mb-4 text-4xl font-black">جاهز للتحويل؟</h2>
          <p className="mb-8 text-gray-400">
            انضم لآلاف المستخدمين الذين يوفرون المال مع كل تحويل
          </p>
          <Link
            href="/send"
            className="inline-flex items-center gap-2 rounded-full bg-[#13B601] px-10 py-5 text-xl font-bold text-white transition hover:bg-[#0fa301] active:scale-95"
          >
            ابدأ التحويل المجاني ←
          </Link>
          <p className="mt-4 text-sm text-gray-600">
            لا رسوم إضافية • لا بطاقة ائتمانية مطلوبة للتجربة
          </p>
        </div>
      </section>

      {/* ========== FOOTER ========== */}
      <footer className="border-t border-white/5 px-6 py-10 text-center text-sm text-gray-600">
        <div className="flex items-center justify-center gap-2 mb-2">
            <img src="/VeloPay.png" alt="VeloPay logo" className="h-6 w-6 rounded-lg" />
          <span className="font-bold text-gray-400">VeloPay</span>
        </div>
        <p>© 2026 VeloPay — مبني على Solana Blockchain</p>
        <p className="mt-2 text-xs">
          هذا مشروع Hackathon MVP — التحويلات على Devnet (بيانات تجريبية)
        </p>
      </footer>

      {/* Premium Modal */}
      <PremiumModal open={showPremium} onClose={() => setShowPremium(false)} />
    </div>
  );
}