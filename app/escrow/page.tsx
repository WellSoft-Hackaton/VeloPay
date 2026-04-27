"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

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

const COUNTRIES = [
  { code: "JO", flag: "🇯🇴", name: "الأردن", currency: "JOD", phone: "+962" },
  { code: "PS", flag: "🇵🇸", name: "فلسطين", currency: "USD", phone: "+970" },
  { code: "IQ", flag: "🇮🇶", name: "العراق", currency: "IQD", phone: "+964" },
  { code: "SY", flag: "🇸🇾", name: "سوريا", currency: "SYP", phone: "+963" },
];

function generateTxHash() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
  return Array.from({ length: 64 }, () =>
    chars.charAt(Math.floor(Math.random() * chars.length))
  ).join("");
}

export default function EscrowPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("500");
  const [fromCurrency, setFromCurrency] = useState("SAR");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [converted, setConverted] = useState(0);

  // Escrow condition state
  const [escrowCondition, setEscrowCondition] = useState("");

  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const rate = RATES[fromCurrency]?.[country.currency] ?? 0.1;
    setConverted(parseFloat(amount || "0") * rate);
  }, [amount, fromCurrency, country]);

  const handleCountryChange = (code: string) => {
    const c = COUNTRIES.find((c) => c.code === code) || COUNTRIES[0];
    setCountry(c);
    setPhone(c.phone + "-");
  };

  const handleSend = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/transfer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          fromCurrency,
          toCurrency: country.currency,
          recipientPhone: phone,
          toCountry: country.code,
          isEscrow: true,
          escrowCondition,
        }),
      });
      const data = await res.json();

      const txHash = data.txHash || generateTxHash();
      const existing = JSON.parse(localStorage.getItem("nexapay_txs") || "[]");
      existing.unshift({
        txHash,
        amount,
        fromCurrency,
        toCurrency: country.currency,
        converted: converted.toFixed(2),
        recipientPhone: phone,
        countryFlag: country.flag,
        status: "locked",
        isEscrow: true,
        escrowCondition,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("nexapay_txs", JSON.stringify(existing.slice(0, 10)));
      router.push(`/track/${txHash}`);
    } catch {
      const txHash = generateTxHash();
      const existing = JSON.parse(localStorage.getItem("nexapay_txs") || "[]");
      existing.unshift({
        txHash,
        amount,
        fromCurrency,
        toCurrency: country.currency,
        converted: converted.toFixed(2),
        recipientPhone: phone,
        countryFlag: country.flag,
        status: "locked",
        isEscrow: true,
        escrowCondition,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("nexapay_txs", JSON.stringify(existing.slice(0, 10)));
      router.push(`/track/${txHash}`);
    } finally {
      setIsLoading(false);
    }
  };

  const usdAmount = (
    parseFloat(amount || "0") * (RATES[fromCurrency]?.["USD"] ?? 0.267)
  ).toFixed(2);

  const canProceedStep1 = amount && parseFloat(amount) > 0 && phone.length > 5 && escrowCondition.trim().length > 3;

  return (
    <div className="min-h-screen bg-[#f5f5f5]" dir="rtl">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 shadow-sm flex items-center h-16">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/VeloPay.png" alt="VeloPay Logo" className="h-22 -my-8 object-contain" />
          </Link>
          <span className="text-sm font-semibold text-[#13B601]">
            الضمان (Escrow)
          </span>
        </div>
      </div>

      {/* Progress bar */}
      <div className="bg-white px-6 pb-4 pt-2">
        <div className="mx-auto max-w-2xl">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200"
              >
                <div
                  className="h-full rounded-full bg-[#13B601] transition-all duration-500"
                  style={{ width: s <= step ? "100%" : "0%" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-6">
        {/* ══════════ STEP 1 ══════════ */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h1 className="text-2xl font-black text-gray-900">إعداد الدفع المشروط</h1>
              <p className="mt-1 text-gray-500 text-sm">أدخل تفاصيل التحويل والشرط</p>
            </div>

            {/* Info Notice */}
            <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 flex gap-3 text-sm text-blue-800">
              <span className="text-xl">ℹ️</span>
              <p>
                سيتم احتجاز المبلغ في عقد ذكي، ولن يتم إرساله للمستلم حتى تؤكد تحقق الشرط الذي تضعه أدناه.
              </p>
            </div>

            {/* Amount card */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <label className="mb-2 block text-sm font-semibold text-gray-600">
                المبلغ المُرسَل
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-2xl font-bold text-gray-900 outline-none transition focus:border-[#13B601] focus:ring-2 focus:ring-[#13B601]/20"
                  placeholder="500"
                />
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-3 py-3 font-medium text-gray-900 outline-none"
                >
                  {FROM_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="my-4 flex items-center gap-3">
                <div className="flex-1 border-t border-dashed border-gray-200" />
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-[#13B601]/30 bg-[#13B601]/10 text-[#13B601]">
                  ↓
                </div>
                <div className="flex-1 border-t border-dashed border-gray-200" />
              </div>

              <label className="mb-2 block text-sm font-semibold text-gray-600">
                يستلم (عند تحقق الشرط)
              </label>
              <div className="flex gap-3">
                <div className="flex-1 rounded-xl border border-[#13B601]/30 bg-[#13B601]/5 px-4 py-3">
                  <span className="text-2xl font-black text-[#13B601]">
                    {converted.toLocaleString("ar", { maximumFractionDigits: 2 })}
                  </span>
                  <span className="mr-2 text-sm text-[#13B601]">{country.currency}</span>
                </div>
                <div className="flex items-center rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                  {country.flag} {country.currency}
                </div>
              </div>
            </div>

            {/* Recipient */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <h3 className="mb-4 font-semibold text-gray-900">بيانات المُرسَل إليه</h3>
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-600">الدولة</label>
                <select
                  value={country.code}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-900 outline-none transition focus:border-[#13B601]"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-600">رقم هاتف المُرسَل إليه</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={`${country.phone}-7XXXXXXXX`}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-[#13B601] focus:ring-2 focus:ring-[#13B601]/20"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Escrow Condition */}
            <div className="rounded-2xl border-2 border-[#13B601]/30 bg-[#13B601]/5 p-5 shadow-sm">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-[#13B601]">
                <span className="text-xl">🤝</span> شرط التحرير
              </h3>
              <p className="mb-4 text-xs text-gray-600">
                اكتب بوضوح متى يجب تسليم المبلغ. (مثال: "عند استلام السيارة والتأكد من سلامتها" أو "بعد تسليم التصميم النهائي").
              </p>
              <textarea
                value={escrowCondition}
                onChange={(e) => setEscrowCondition(e.target.value)}
                placeholder="اكتب الشرط هنا..."
                className="w-full rounded-xl border border-gray-500 px-4 py-3 text-gray-900 outline-none transition focus:border-[#13B601] focus:ring-2 focus:ring-[#13B601]/20 min-h-[100px] resize-none"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="w-full rounded-full bg-[#13B601] py-4 text-lg font-bold text-white shadow-lg shadow-[#13B601]/25 transition hover:bg-[#0fa301] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 disabled:shadow-none active:scale-95"
            >
              متابعة →
            </button>
          </div>
        )}

        {/* ══════════ STEP 2 ══════════ */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <button
                onClick={() => setStep(1)}
                className="mb-3 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
              >
                ← رجوع
              </button>
              <h1 className="text-2xl font-black text-gray-900">طريقة الدفع</h1>
              <p className="mt-1 text-gray-500 text-sm">اختر كيف تدفع لتمويل العقد الذكي</p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "card",
                  icon: "💳",
                  title: "بطاقة ائتمانية",
                  desc: "Visa / Mastercard",
                },
                {
                  id: "usdc",
                  icon: "🪙",
                  title: "USDC من محفظتي",
                  desc: "استخدام رصيد العملات الرقمية",
                },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`w-full rounded-2xl border-2 p-5 text-right transition ${paymentMethod === m.id
                    ? "border-[#13B601] bg-[#13B601]/5"
                    : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{m.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-semibold text-gray-900">
                        {m.title}
                        {paymentMethod === m.id && (
                          <span className="mr-auto text-[#13B601]">✓</span>
                        )}
                      </div>
                      <p className="mt-0.5 text-sm text-gray-400">{m.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(3)}
              className="w-full rounded-full bg-[#13B601] py-4 text-lg font-bold text-white shadow-lg shadow-[#13B601]/25 transition hover:bg-[#0fa301] active:scale-95"
            >
              تأكيد طريقة الدفع →
            </button>
          </div>
        )}

        {/* ══════════ STEP 3 ══════════ */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <button
                onClick={() => setStep(2)}
                className="mb-3 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
              >
                ← رجوع
              </button>
              <h1 className="text-2xl font-black text-gray-900">تأكيد الضمان</h1>
              <p className="mt-1 text-gray-500 text-sm">راجع التفاصيل قبل الاحتفاظ بالمبلغ</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3 text-sm">
              {[
                { label: "يتم حجزه", value: `${amount} ${fromCurrency}` },
                {
                  label: "يستلمه الطرف الآخر",
                  value: `${converted.toLocaleString("ar", { maximumFractionDigits: 2 })} ${country.currency}`,
                  valueClass: "text-[#13B601] font-bold",
                },
                { label: "إلى الهاتف", value: `${country.flag} ${phone}` },
                { label: "رسوم العقد الذكي", value: "$0.01", valueClass: "text-[#13B601] font-bold" },
                {
                  label: "طريقة الدفع",
                  value: paymentMethod === "card" ? "💳 بطاقة ائتمانية" : "🪙 USDC",
                },
              ].map(({ label, value, valueClass }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}</span>
                  <span className={`font-medium text-gray-900 text-right ${valueClass ?? ""}`}>
                    {value}
                  </span>
                </div>
              ))}

              <div className="border-t border-gray-100 pt-3 mt-3">
                <span className="block text-gray-500 mb-1">شرط التحرير:</span>
                <p className="font-medium text-gray-900 text-right bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {escrowCondition}
                </p>
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={isLoading}
              className="w-full flex items-center justify-center rounded-full bg-[#13B601] py-4 text-lg font-bold text-white shadow-lg shadow-[#13B601]/25 transition hover:bg-[#0fa301] active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                "دفع وحجز المبلغ (Escrow) →"
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
