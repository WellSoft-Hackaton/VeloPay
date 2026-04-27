"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────
type ReceiveMethod = "bank" | "zaincash" | "wallet" | null;

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

// ─── Recurring Confirm Dialog ─────────────────────────────────────────────────
interface RecurringDialogProps {
  open: boolean;
  amount: string;
  currency: string;
  day: number;
  onConfirm: () => void;
  onCancel: () => void;
}

function RecurringDialog({
  open,
  amount,
  currency,
  day,
  onConfirm,
  onCancel,
}: RecurringDialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" dir="rtl">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        style={{ animation: "fadeIn 0.2s ease" }}
        onClick={onCancel}
      />
      {/* Modal */}
      <div
        className="relative w-full max-w-sm rounded-3xl bg-white p-7 shadow-2xl"
        style={{ animation: "scaleIn 0.25s cubic-bezier(0.34,1.56,0.64,1)" }}
      >
        {/* Icon */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#13B601]/10 text-3xl">
          🔄
        </div>
        <h3 className="mb-2 text-xl font-black text-gray-900">تأكيد الإرسال الدوري</h3>
        <p className="mb-6 leading-relaxed text-gray-500 text-sm">
          سوف يتم إرسال{" "}
          <span className="font-bold text-gray-900">
            {amount} {currency}
          </span>{" "}
          بشكل تلقائي في يوم{" "}
          <span className="font-bold text-[#13B601]">{day}</span> من كل شهر.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 rounded-2xl border-2 border-gray-200 bg-white py-3.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 active:scale-95"
          >
            إلغاء
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 rounded-2xl bg-[#13B601] py-3.5 text-sm font-bold text-white shadow-lg shadow-[#13B601]/25 transition hover:bg-[#0fa301] active:scale-95"
          >
            تأكيد ✓
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes scaleIn { from { opacity:0; transform:scale(0.85) translateY(8px) } to { opacity:1; transform:scale(1) translateY(0) } }
      `}</style>
    </div>
  );
}

// ─── Animated Accordion ───────────────────────────────────────────────────────
function Accordion({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(open ? ref.current.scrollHeight : 0);
    }
  }, [open, children]);

  return (
    <div
      style={{
        height,
        overflow: "hidden",
        transition: "height 0.35s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div ref={ref}>{children}</div>
    </div>
  );
}

// ─── Receive Method Card ──────────────────────────────────────────────────────
function MethodCard({
  id,
  icon,
  title,
  description,
  badge,
  selected,
  onSelect,
  children,
}: {
  id: ReceiveMethod;
  icon: string;
  title: string;
  description: string;
  badge?: string;
  selected: ReceiveMethod;
  onSelect: (id: ReceiveMethod) => void;
  children?: React.ReactNode;
}) {
  const isActive = selected === id;
  return (
    <div
      className={`rounded-2xl border-2 bg-white shadow-sm transition-all duration-300 ${
        isActive
          ? "border-[#13B601] shadow-[#13B601]/10 shadow-lg"
          : "border-gray-100 hover:border-gray-200 hover:shadow-md"
      }`}
    >
      {/* Header — clicking toggles */}
      <button
        type="button"
        className="flex w-full items-start gap-4 p-5 text-right"
        onClick={() => onSelect(isActive ? null : id)}
      >
        <div
          className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl text-xl transition-colors ${
            isActive ? "bg-[#13B601]/15" : "bg-gray-100"
          }`}
        >
          {icon}
        </div>
        <div className="flex-1 text-right">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-gray-900">{title}</span>
            {badge && (
              <span className="rounded-full bg-[#13B601]/10 px-2 py-0.5 text-[10px] font-bold text-[#13B601]">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-gray-400">{description}</p>
        </div>
        <div
          className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
            isActive ? "border-[#13B601] bg-[#13B601]" : "border-gray-300"
          }`}
        >
          {isActive && <span className="text-[9px] font-bold text-white">✓</span>}
        </div>
      </button>

      {/* Accordion body — clicks inside do NOT close the card */}
      <Accordion open={isActive}>
        <div
          className="px-5 pb-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-t border-gray-100 pt-4">{children}</div>
        </div>
      </Accordion>
    </div>
  );
}

// ─── Main Send Page ────────────────────────────────────────────────────────────
export default function SendPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [amount, setAmount] = useState("500");
  const [fromCurrency, setFromCurrency] = useState("SAR");
  const [country, setCountry] = useState(COUNTRIES[0]);
  const [phone, setPhone] = useState("");
  const [converted, setConverted] = useState(0);

  // Receiving method state
  const [receiveMethod, setReceiveMethod] = useState<ReceiveMethod>(null);
  const [iban, setIban] = useState("");
  const [receivePhone, setReceivePhone] = useState("");

  // Recurring transfer state
  const [recurringEnabled, setRecurringEnabled] = useState(false);
  const [recurringDay, setRecurringDay] = useState<number | "">("");
  const [showRecurringDialog, setShowRecurringDialog] = useState(false);
  const [recurringConfirmed, setRecurringConfirmed] = useState(false);

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

  // Recurring day change — show confirmation dialog
  const handleRecurringDayChange = (val: string) => {
    const day = parseInt(val);
    if (!isNaN(day) && day >= 1 && day <= 31) {
      setRecurringDay(day);
      if (recurringEnabled) {
        setShowRecurringDialog(true);
      }
    } else {
      setRecurringDay("");
    }
  };

  const handleRecurringConfirm = () => {
    setRecurringConfirmed(true);
    setShowRecurringDialog(false);
  };

  const handleRecurringCancel = () => {
    setShowRecurringDialog(false);
    setRecurringEnabled(false);
    setRecurringDay("");
    setRecurringConfirmed(false);
  };

  const handleToggleRecurring = () => {
    const next = !recurringEnabled;
    setRecurringEnabled(next);
    if (!next) {
      setRecurringDay("");
      setRecurringConfirmed(false);
    }
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
          receiveMethod,
          iban: receiveMethod === "bank" ? iban : undefined,
          receivePhone: receiveMethod === "zaincash" ? receivePhone : undefined,
          recurring: recurringConfirmed ? { day: recurringDay } : null,
        }),
      });
      const data = await res.json();
      if (data.txHash) {
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
        status: "pending",
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

  const canProceed = amount && parseFloat(amount) > 0 && phone.length > 5;

  return (
    <div className="min-h-screen bg-[#f5f5f5]" dir="rtl">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/VeloPay.png" alt="VeloPay Logo" className="h-8" />
          </Link>
          <span className="text-sm text-gray-400">
            {step === 1 ? "التفاصيل" : step === 2 ? "طريقة الدفع" : "التأكيد"}
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
              <h1 className="text-2xl font-black text-gray-900">أرسل الأموال</h1>
              <p className="mt-1 text-gray-500 text-sm">أدخل تفاصيل التحويل</p>
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
                يستلم
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
              <div className="mb-4">
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

              <div className="space-y-3">
                {/* Zain Cash */}
                <MethodCard
                  id="zaincash"
                  icon="📱"
                  title="Zain Cash / CliQ"
                  description="استلام مباشر في المحفظة المحلية برقم الهاتف"
                  badge="Blueprint"
                  selected={receiveMethod}
                  onSelect={setReceiveMethod}
                >
                  <div className="space-y-3">
                    <div className="rounded-lg bg-amber-50 p-3 text-xs text-amber-700">
                      🏗️ يتطلب شراكة مع Liquidity Provider — المعمارية جاهزة
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        رقم الهاتف (Zain Cash / CliQ)
                      </label>
                      <input
                        type="tel"
                        value={receivePhone}
                        onChange={(e) => setReceivePhone(e.target.value)}
                        placeholder="+962-7X-XXXXXXX"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                        dir="ltr"
                        autoComplete="off"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </MethodCard>

                {/* Digital Wallet */}
                <MethodCard
                  id="wallet"
                  icon="👛"
                  title="محفظة رقمية"
                  description="إرسال USDC مباشرة لمحفظة Solana"
                  selected={receiveMethod}
                  onSelect={setReceiveMethod}
                >
                  <div className="rounded-xl border border-[#13B601]/20 bg-[#13B601]/5 p-4">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">✨</span>
                      <div>
                        <p className="font-semibold text-[#13B601] text-sm">
                          لا تحتاج إلى محفظة مسبقاً!
                        </p>
                        <p className="mt-1 text-xs text-gray-500 leading-relaxed">
                          إن لم يكن لديه محفظة، فسوف نُنشئ له محفظة{" "}
                          <strong>VeloPay</strong> تلقائياً! يستلم رصيده ويختار لاحقاً
                          كيفية الصرف.
                        </p>
                      </div>
                    </div>
                  </div>
                </MethodCard>

                <div className="text-center text-sm font-medium text-gray-500 my-4">او عن طريق :</div>

                {/* Bank */}
                <MethodCard
                  id="bank"
                  icon="🏦"
                  title="إيداع بنكي"
                  description="يُحوَّل المبلغ مباشرةً إلى الحساب البنكي عبر Transak Off-Ramp"
                  badge="Sandbox"
                  selected={receiveMethod}
                  onSelect={setReceiveMethod}
                >
                  <div className="space-y-3">
                    <div className="rounded-lg bg-blue-50 p-3 text-xs text-blue-600">
                      ℹ️ بيئة تجريبية — Transak API جاهز للتكامل الكامل
                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-gray-600">
                        رقم IBAN
                      </label>
                      <input
                        type="text"
                        value={iban}
                        onChange={(e) => setIban(e.target.value)}
                        placeholder="JO94 CBJO 0010 0000 0000 0131 0003 02"
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 font-mono text-sm outline-none transition focus:border-[#13B601] focus:ring-2 focus:ring-[#13B601]/20"
                        dir="ltr"
                        autoComplete="off"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </MethodCard>
              </div>

              <div className="mt-6">
                <label className="mb-1.5 block text-sm font-medium text-gray-600">الاسم الكامل</label>
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-gray-900 outline-none transition focus:border-[#13B601] focus:ring-2 focus:ring-[#13B601]/20"
                />
              </div>
            </div>

            {/* ═══ RECURRING TRANSFER ═══ */}
            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-gray-900">إرسال دوري</p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    جدوِل هذا التحويل تلقائياً كل شهر
                  </p>
                </div>
                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={handleToggleRecurring}
                  className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors duration-300 ${
                    recurringEnabled ? "bg-[#13B601]" : "bg-gray-200"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow-md transition-all duration-300 ${
                      recurringEnabled ? "right-0.5 left-auto" : "left-0.5"
                    }`}
                  />
                </button>
              </div>

              {/* Recurring options */}
              <Accordion open={recurringEnabled}>
                <div
                  className="mt-4 space-y-3"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center gap-3 rounded-xl bg-gray-50 px-4 py-3">
                    <span className="text-sm text-gray-600 whitespace-nowrap">
                      إرسال هذا المبلغ تلقائياً كل شهر في يوم
                    </span>
                    <select
                      value={recurringDay}
                      onChange={(e) => handleRecurringDayChange(e.target.value)}
                      className="w-20 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-center text-sm font-bold text-gray-900 outline-none focus:border-[#13B601]"
                    >
                      <option value="">--</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-600">من كل شهر</span>
                  </div>

                  {recurringConfirmed && recurringDay && (
                    <div className="flex items-center gap-2 rounded-xl bg-[#13B601]/10 px-4 py-3 text-sm text-[#13B601]">
                      <span className="text-base">✅</span>
                      <span>
                        سيُرسَل{" "}
                        <strong>
                          {amount} {fromCurrency}
                        </strong>{" "}
                        تلقائياً في يوم <strong>{recurringDay}</strong> من كل شهر
                      </span>
                    </div>
                  )}
                </div>
              </Accordion>
            </div>

            {/* Fee summary */}
            <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
              <div className="space-y-2.5 text-sm">
                {[
                  { label: "المبلغ", value: `${amount} ${fromCurrency}` },
                  {
                    label: "رسوم المعاملة",
                    value: "$0.01",
                    valueClass: "font-bold text-[#13B601]",
                  },
                  {
                    label: "سعر الصرف",
                    value: `1 ${fromCurrency} = ${(RATES[fromCurrency]?.[country.currency] ?? 0).toFixed(4)} ${country.currency}`,
                  },
                ].map(({ label, value, valueClass }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-gray-500">{label}</span>
                    <span className={`font-medium text-gray-900 ${valueClass ?? ""}`}>
                      {value}
                    </span>
                  </div>
                ))}
                <div className="border-t border-gray-100 pt-2.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-gray-900">يستلم</span>
                    <span className="text-[#13B601]">
                      {converted.toLocaleString("ar", { maximumFractionDigits: 2 })}{" "}
                      {country.currency}
                    </span>
                  </div>
                </div>
                <p className="text-center text-xs text-gray-400">⚡ يصل خلال ~5 ثوانٍ</p>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceed}
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
              <p className="mt-1 text-gray-500 text-sm">اختر كيف تدفع</p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "card",
                  icon: "💳",
                  title: "بطاقة ائتمانية",
                  desc: "Visa / Mastercard — عبر Transak Sandbox",
                },
                {
                  id: "apple",
                  icon: "🍎",
                  title: "Apple Pay",
                  desc: "قريباً",
                  disabled: true,
                },
                {
                  id: "usdc",
                  icon: "🪙",
                  title: "USDC من محفظتي",
                  desc: "إذا كان لديك رصيد USDC",
                },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => !m.disabled && setPaymentMethod(m.id)}
                  className={`w-full rounded-2xl border-2 p-5 text-right transition ${
                    paymentMethod === m.id
                      ? "border-[#13B601] bg-[#13B601]/5"
                      : m.disabled
                      ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-3xl">{m.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 font-semibold text-gray-900">
                        {m.title}
                        {m.disabled && (
                          <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-500">
                            قريباً
                          </span>
                        )}
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

            {paymentMethod === "card" && (
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                <p className="mb-1 text-sm font-medium text-blue-700">🧪 بيانات البطاقة التجريبية:</p>
                <p className="font-mono text-sm text-blue-600 ltr:text-left" dir="ltr">
                  4242 4242 4242 4242 | MM/YY: 12/26 | CVV: 123
                </p>
              </div>
            )}

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
              <h1 className="text-2xl font-black text-gray-900">تأكيد التحويل</h1>
              <p className="mt-1 text-gray-500 text-sm">راجع التفاصيل قبل الإرسال</p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3 text-sm">
              {[
                { label: "تُرسل", value: `${amount} ${fromCurrency}` },
                { label: "القيمة بالدولار", value: `$${usdAmount}` },
                {
                  label: "يستلم",
                  value: `${converted.toLocaleString("ar", { maximumFractionDigits: 2 })} ${country.currency}`,
                  valueClass: "text-[#13B601] font-bold",
                },
                { label: "إلى", value: `${country.flag} ${phone}` },
                {
                  label: "طريقة الاستلام",
                  value:
                    receiveMethod === "bank"
                      ? "🏦 إيداع بنكي"
                      : receiveMethod === "zaincash"
                      ? "📱 Zain Cash / CliQ"
                      : receiveMethod === "wallet"
                      ? "👛 محفظة رقمية"
                      : "غير محدد",
                },
                { label: "رسوم المعاملة", value: "$0.01", valueClass: "text-[#13B601] font-bold" },
                {
                  label: "طريقة الدفع",
                  value: paymentMethod === "card" ? "💳 بطاقة ائتمانية" : "🪙 USDC",
                },
                { label: "الشبكة", value: "⚡ Solana Devnet" },
              ].map(({ label, value, valueClass }) => (
                <div key={label} className="flex justify-between">
                  <span className="text-gray-500">{label}</span>
                  <span className={`font-medium text-gray-900 text-right ${valueClass ?? ""}`}>
                    {value}
                  </span>
                </div>
              ))}

              {recurringConfirmed && recurringDay && (
                <div className="rounded-xl bg-[#13B601]/10 px-3 py-2 text-xs text-[#13B601]">
                  🔄 إرسال دوري: يوم {recurringDay} من كل شهر
                </div>
              )}
            </div>

            <div className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
              ⚠️ هذا Hackathon MVP — التحويلات تجريبية على Solana Devnet
            </div>

            <button
              onClick={handleSend}
              disabled={isLoading}
              className="w-full rounded-full bg-[#13B601] py-5 text-xl font-black text-white shadow-xl shadow-[#13B601]/30 transition hover:bg-[#0fa301] disabled:cursor-not-allowed disabled:bg-gray-300 active:scale-95"
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

      {/* Recurring confirm dialog */}
      <RecurringDialog
        open={showRecurringDialog}
        amount={amount}
        currency={fromCurrency}
        day={typeof recurringDay === "number" ? recurringDay : 1}
        onConfirm={handleRecurringConfirm}
        onCancel={handleRecurringCancel}
      />
    </div>
  );
}