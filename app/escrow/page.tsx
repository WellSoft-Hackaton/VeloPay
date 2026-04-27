"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { 
  Info, 
  ArrowDown, 
  Handshake, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard, 
  Coins, 
  Check,
  Zap
} from "lucide-react";


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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300" dir="rtl">
      <Header />

      {/* Progress bar */}
      <div className="bg-card px-6 pb-4 pt-4 border-b border-border">
        <div className="mx-auto max-w-2xl">
          <div className="flex gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
              >
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
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
              <h1 className="text-2xl font-black text-foreground">إعداد الدفع المشروط</h1>
              <p className="mt-1 text-muted-foreground text-sm">أدخل تفاصيل التحويل والشرط</p>
            </div>

            {/* Info Notice */}
            <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4 flex gap-3 text-sm text-blue-600">
              <Info size={18} className="flex-shrink-0" aria-hidden="true" />
              <p>
                سيتم احتجاز المبلغ في عقد ذكي، ولن يتم إرساله للمستلم حتى تؤكد تحقق الشرط الذي تضعه أدناه.
              </p>
            </div>

            {/* Amount card */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <label className="mb-2 block text-sm font-semibold text-muted-foreground">
                المبلغ المُرسَل
              </label>
              <div className="flex gap-3">
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-2xl font-bold text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  placeholder="500"
                />
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="rounded-xl border border-border bg-muted px-3 py-3 font-medium text-foreground outline-none"
                >
                  {FROM_CURRENCIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code}
                    </option>
                  ))}
                </select>
              </div>

              <div className="my-4 flex items-center justify-center gap-3">
                <div className="flex-1 border-t border-dashed border-border" />
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <ArrowDown size={18} aria-hidden="true" />
                </div>
                <div className="flex-1 border-t border-dashed border-border" />
              </div>

              <label className="mb-2 block text-sm font-semibold text-muted-foreground">
                يستلم (عند تحقق الشرط)
              </label>
              <div className="flex gap-3">
                <div className="flex-1 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
                  <span className="text-2xl font-black text-primary">
                    {converted.toLocaleString("ar", { maximumFractionDigits: 2 })}
                  </span>
                  <span className="mr-2 text-sm text-primary">{country.currency}</span>
                </div>
                <div className="flex items-center rounded-xl border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground">
                  {country.flag} {country.currency}
                </div>
              </div>
            </div>

            {/* Recipient */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <h3 className="mb-4 font-semibold text-foreground">بيانات المُرسَل إليه</h3>
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">الدولة</label>
                <select
                  value={country.code}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="w-full rounded-xl border border-border bg-muted px-4 py-3 font-medium text-foreground outline-none transition focus:border-primary"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-muted-foreground">رقم هاتف المُرسَل إليه</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={`${country.phone}-7XXXXXXXX`}
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  dir="ltr"
                />
              </div>
            </div>

            {/* Escrow Condition */}
            <div className="rounded-2xl border-2 border-primary/30 bg-primary/5 p-5 shadow-sm">
              <h3 className="mb-2 flex items-center gap-2 font-semibold text-primary">
                <Handshake size={20} aria-hidden="true" /> شرط التحرير
              </h3>
              <p className="mb-4 text-xs text-muted-foreground">
                اكتب بوضوح متى يجب تسليم المبلغ. (مثال: "عند استلام السيارة والتأكد من سلامتها" أو "بعد تسليم التصميم النهائي").
              </p>
              <textarea
                value={escrowCondition}
                onChange={(e) => setEscrowCondition(e.target.value)}
                placeholder="اكتب الشرط هنا..."
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 min-h-[100px] resize-none"
              />
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceedStep1}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none active:scale-95"
            >
              متابعة <ArrowLeft size={18} aria-hidden="true" />
            </button>
          </div>
        )}

        {/* ══════════ STEP 2 ══════════ */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <button
                onClick={() => setStep(1)}
                className="mb-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowRight size={16} aria-hidden="true" /> رجوع
              </button>
              <h1 className="text-2xl font-black text-foreground">طريقة الدفع</h1>
              <p className="mt-1 text-muted-foreground text-sm">اختر كيف تدفع لتمويل العقد الذكي</p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "card",
                  icon: <CreditCard size={24} aria-hidden="true" />,
                  title: "بطاقة ائتمانية",
                  desc: "Visa / Mastercard",
                },
                {
                  id: "usdc",
                  icon: <Coins size={24} aria-hidden="true" />,
                  title: "USDC من محفظتي",
                  desc: "استخدام رصيد العملات الرقمية",
                },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`w-full rounded-2xl border-2 p-5 text-right transition ${paymentMethod === m.id
                    ? "border-primary bg-primary/5"
                    : "border-border bg-card hover:border-primary/50"
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-primary">{m.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-semibold text-foreground">
                        {m.title}
                        {paymentMethod === m.id && (
                          <span className="mr-auto text-primary"><Check size={16} aria-hidden="true" /></span>
                        )}

                      </div>
                      <p className="mt-0.5 text-sm text-muted-foreground">{m.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <button
              onClick={() => setStep(3)}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-4 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 active:scale-95"
            >
              تأكيد طريقة الدفع <ArrowLeft size={18} aria-hidden="true" />
            </button>
          </div>
        )}

        {/* ══════════ STEP 3 ══════════ */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <button
                onClick={() => setStep(2)}
                className="mb-3 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
              >
                <ArrowRight size={16} aria-hidden="true" /> رجوع
              </button>
              <h1 className="text-2xl font-black text-foreground">تأكيد الضمان</h1>
              <p className="mt-1 text-muted-foreground text-sm">راجع التفاصيل قبل الاحتفاظ بالمبلغ</p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm space-y-3 text-sm">
              {[
                { label: "يتم حجزه", value: `${amount} ${fromCurrency}` },
                {
                  label: "يستلمه الطرف الآخر",
                  value: `${converted.toLocaleString("ar", { maximumFractionDigits: 2 })} ${country.currency}`,
                  valueClass: "text-primary font-bold",
                },
                { label: "إلى الهاتف", value: `${country.flag} ${phone}` },
                { label: "رسوم العقد الذكي", value: "$0.01", valueClass: "text-primary font-bold" },
                {
                  label: "طريقة الدفع",
                  value: paymentMethod === "card" ? "بطاقة ائتمانية" : "USDC",

                },
              ].map(({ label, value, valueClass }, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-muted-foreground">{label}</span>
                  <span className={`font-medium text-foreground text-right ${valueClass ?? ""}`}>
                    {value}
                  </span>
                </div>
              ))}

              <div className="border-t border-border pt-3 mt-3">
                <span className="block text-muted-foreground mb-1">شرط التحرير:</span>
                <p className="font-medium text-foreground text-right bg-muted p-3 rounded-lg border border-border">
                  {escrowCondition}
                </p>
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={isLoading}
              className="w-full flex items-center justify-center rounded-full bg-primary py-4 text-lg font-bold text-white shadow-lg shadow-primary/25 transition hover:bg-primary/90 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="h-6 w-6 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
              ) : (
                <span className="flex items-center gap-2">
                  دفع وحجز المبلغ (Escrow) <ArrowLeft size={18} aria-hidden="true" />
                </span>
              )}
            </button>

          </div>
        )}
      </div>
    </div>
  );
}
