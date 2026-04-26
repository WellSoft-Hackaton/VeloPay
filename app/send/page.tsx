"use client";

import { useState, useEffect } from "react";
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

const TO_CURRENCIES = [
  { code: "JOD", flag: "🇯🇴", name: "دينار أردني", phone: "+962" },
  { code: "USD", flag: "🇵🇸", name: "دولار (فلسطين)", phone: "+970" },
  { code: "IQD", flag: "🇮🇶", name: "دينار عراقي", phone: "+964" },
  { code: "SYP", flag: "🇸🇾", name: "ليرة سورية", phone: "+963" },
];

const COUNTRIES = [
  { code: "JO", flag: "🇯🇴", name: "الأردن", currency: "JOD", phone: "+962" },
  { code: "PS", flag: "🇵🇸", name: "فلسطين", currency: "USD", phone: "+970" },
  { code: "IQ", flag: "🇮🇶", name: "العراق", currency: "IQD", phone: "+964" },
  { code: "SY", flag: "🇸🇾", name: "سوريا", currency: "SYP", phone: "+963" },
];

function generateTxHash() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz123456789";
  let result = "";
  for (let i = 0; i < 64; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export default function SendPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("500");
  const [fromCurrency, setFromCurrency] = useState("SAR");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [isLoading, setIsLoading] = useState(false);
  const [converted, setConverted] = useState(0);

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
        }),
      });
      const data = await res.json();
      if (data.txHash) {
        // Save to localStorage for tracking
        const existing = JSON.parse(localStorage.getItem("nexapay_txs") || "[]");
        existing.unshift({
          txHash: data.txHash,
          amount,
          fromCurrency,
          toCurrency: country.currency,
          converted: converted.toFixed(2),
          recipientPhone: phone,
          countryFlag: country.flag,
          status: "pending",
          createdAt: new Date().toISOString(),
        });
        localStorage.setItem("nexapay_txs", JSON.stringify(existing.slice(0, 10)));
        router.push(`/track/${data.txHash}`);
      }
    } catch (e) {
      console.error(e);
      // Fallback: generate local txHash
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
        status: "pending",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("nexapay_txs", JSON.stringify(existing.slice(0, 10)));
      router.push(`/track/${txHash}`);
    } finally {
      setIsLoading(false);
    }
  };

  const usdAmount = (parseFloat(amount || "0") * (RATES[fromCurrency]?.["USD"] ?? 0.267)).toFixed(2);

  return (
    <div className="min-h-screen bg-[#f5f5f5]" dir="rtl">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/VeloPay.png" alt="VeloPay logo" className="h-[30px] w-[30px] rounded-xl" />
          </Link>
          <div className="text-sm text-gray-500">
            {step === 1 ? "التفاصيل" : step === 2 ? "طريقة الدفع" : "التأكيد"}
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="bg-white px-6 pb-4 pt-2">
        <div className="mx-auto max-w-2xl">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1.5 flex-1 rounded-full transition-all ${
                  s <= step ? "bg-[#13B601]" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8">
        {/* ===== STEP 1: التفاصيل ===== */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-black text-gray-900">أرسل الأموال</h1>
              <p className="mt-1 text-gray-500">أدخل تفاصيل التحويل</p>
            </div>

            {/* Amount */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">المبلغ المُرسَل</label>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="flex-1 rounded-xl border border-gray-200 px-4 py-3 text-2xl font-bold text-gray-900 outline-none transition focus:border-[#13B601] focus:ring-2 focus:ring-[#13B601]/20"
                    placeholder="500"
                    min="1"
                  />
                  <select
                    value={fromCurrency}
                    onChange={(e) => setFromCurrency(e.target.value)}
                    className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 font-medium text-gray-900 outline-none"
                  >
                    {FROM_CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Arrow */}
              <div className="my-4 flex items-center justify-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-[#13B601]/30 bg-[#13B601]/10 text-[#13B601] font-bold">
                  ↓
                </div>
              </div>

              {/* Receiving */}
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">يستلم</label>
                <div className="flex gap-3">
                  <div className="flex-1 rounded-xl border border-[#13B601]/30 bg-[#13B601]/5 px-4 py-3">
                    <span className="text-2xl font-black text-[#13B601]">
                      {converted.toLocaleString("ar", { maximumFractionDigits: 2 })}
                    </span>
                    <span className="mr-2 text-sm text-[#13B601]">{country.currency}</span>
                  </div>
                  <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium">
                    {country.flag} {country.currency}
                  </div>
                </div>
              </div>
            </div>

            {/* Recipient */}
            <div className="rounded-2xl border border-gray-200 bg-white p-6">
              <h3 className="mb-4 font-semibold text-gray-900">بيانات المستلم</h3>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">الدولة</label>
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
                <label className="mb-2 block text-sm font-medium text-gray-700">رقم الهاتف</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={country.phone + "-7XXXXXXXX"}
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-[#13B601] focus:ring-2 focus:ring-[#13B601]/20"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Fee summary */}
            <div className="rounded-2xl border border-gray-100 bg-white p-6">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">المبلغ</span>
                  <span className="font-medium">{amount} {fromCurrency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">رسوم المعاملة</span>
                  <span className="font-bold text-[#13B601]">$0.01 فقط</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">سعر الصرف</span>
                  <span className="font-medium">
                    1 {fromCurrency} = {RATES[fromCurrency]?.[country.currency]?.toFixed(4)} {country.currency}
                  </span>
                </div>
                <div className="border-t border-gray-100 pt-3">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-900">يستلم</span>
                    <span className="text-[#13B601]">
                      {converted.toLocaleString("ar", { maximumFractionDigits: 2 })} {country.currency}
                    </span>
                  </div>
                </div>
                <div className="text-center text-xs text-gray-400">⚡ يصل خلال ~5 ثوانٍ</div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!amount || !phone || parseFloat(amount) <= 0}
              className="w-full rounded-full bg-[#13B601] py-4 text-lg font-bold text-white transition hover:bg-[#0fa301] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400 active:scale-95"
            >
              متابعة →
            </button>
          </div>
        )}

        {/* ===== STEP 2: طريقة الدفع ===== */}
        {step === 2 && (
          <div className="space-y-6">
            <div>
              <button onClick={() => setStep(1)} className="mb-6 flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 active:scale-95">
                <span className="text-lg leading-none">←</span>
                رجوع
              </button>
              <h1 className="text-2xl font-black text-gray-900">طريقة الدفع</h1>
              <p className="mt-1 text-gray-500">اختر كيف تدفع</p>
            </div>

            <div className="space-y-3">
              {[
                { id: "card", icon: "💳", title: "بطاقة ائتمانية", desc: "Visa / Mastercard — عبر Transak Sandbox" },
                { id: "apple", icon: "🍎", title: "Apple Pay", desc: "قريباً" },
                { id: "usdc", icon: "🪙", title: "USDC من محفظتي", desc: "إذا كان لديك رصيد USDC" },
              ].map((method) => (
                <button
                  key={method.id}
                  onClick={() => method.id !== "apple" && setPaymentMethod(method.id)}
                  className={`w-full rounded-2xl border-2 p-5 text-right transition ${
                    paymentMethod === method.id
                      ? "border-[#13B601] bg-[#13B601]/5"
                      : method.id === "apple"
                      ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{method.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-semibold text-gray-900">
                        {method.title}
                        {method.id === "apple" && (
                          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500">
                            قريباً
                          </span>
                        )}
                        {paymentMethod === method.id && (
                          <span className="mr-auto text-[#13B601]">✓</span>
                        )}
                      </div>
                      <div className="mt-0.5 text-sm text-gray-400">{method.desc}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Test card info */}
            {paymentMethod === "card" && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-700 font-medium">🧪 بيانات البطاقة التجريبية:</p>
                <p className="mt-1 font-mono text-sm text-blue-600 dir-ltr text-left">
                  4242 4242 4242 4242 | MM/YY: 12/26 | CVV: 123
                </p>
              </div>
            )}

            <button
              onClick={() => setStep(3)}
              className="w-full rounded-full bg-[#13B601] py-4 text-lg font-bold text-white transition hover:bg-[#0fa301] active:scale-95"
            >
              تأكيد طريقة الدفع →
            </button>
          </div>
        )}

        {/* ===== STEP 3: التأكيد ===== */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <button onClick={() => setStep(2)} className="mb-6 flex w-fit items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-bold text-gray-700 shadow-sm transition hover:bg-gray-50 hover:text-gray-900 active:scale-95">
                <span className="text-lg leading-none">←</span>
                رجوع
              </button>
              <h1 className="text-2xl font-black text-gray-900">تأكيد التحويل</h1>
              <p className="mt-1 text-gray-500">راجع التفاصيل قبل الإرسال</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-6 space-y-4">
              {[
                { label: "تُرسل", value: `${amount} ${fromCurrency}` },
                { label: "القيمة بالدولار", value: `$${usdAmount}` },
                { label: "يستلم", value: `${converted.toLocaleString("ar", { maximumFractionDigits: 2 })} ${country.currency}` },
                { label: "إلى", value: `${country.flag} ${phone}` },
                { label: "رسوم المعاملة", value: "$0.01 فقط" },
                { label: "طريقة الدفع", value: paymentMethod === "card" ? "💳 بطاقة ائتمانية" : "🪙 USDC" },
                { label: "الشبكة", value: "⚡ Solana Devnet" },
                { label: "وقت الوصول المتوقع", value: "~5 ثوانٍ" },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="font-semibold text-gray-900">{value}</span>
                </div>
              ))}
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              ⚠️ هذا Hackathon MVP — التحويلات تجريبية على Solana Devnet. لا أموال حقيقية.
            </div>

            <button
              onClick={handleSend}
              disabled={isLoading}
              className="w-full rounded-full bg-[#13B601] py-5 text-xl font-black text-white transition hover:bg-[#0fa301] disabled:cursor-not-allowed disabled:bg-gray-300 active:scale-95"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  جاري معالجة التحويل...
                </span>
              ) : (
                `✓ أرسل ${amount} ${fromCurrency} الآن`
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
