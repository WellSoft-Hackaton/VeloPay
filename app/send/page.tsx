"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { 
  RefreshCcw, 
  Check, 
  ArrowDown, 
  Smartphone, 
  Wallet, 
  Sparkles, 
  Landmark, 
  Info, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  CreditCard, 
  Coins, 
  TestTube2, 
  Zap 
} from "lucide-react";
import { FaApple } from "react-icons/fa";


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
  { code: "SA", flag: "🇸🇦", name: "السعودية", currency: "SAR", phone: "+966" },
  { code: "AE", flag: "🇦🇪", name: "الإمارات", currency: "AED", phone: "+971" },
  { code: "KW", flag: "🇰🇼", name: "الكويت", currency: "KWD", phone: "+965" },
  { code: "QA", flag: "🇶🇦", name: "قطر", currency: "QAR", phone: "+974" },
  { code: "BH", flag: "🇧🇭", name: "البحرين", currency: "BHD", phone: "+973" },
  { code: "OM", flag: "🇴🇲", name: "عُمان", currency: "OMR", phone: "+968" },
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
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#13B601]/10 text-[#13B601]">
          <RefreshCcw size={32} aria-hidden="true" />
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
            تأكيد <Check size={16} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />

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
  icon: React.ReactNode;
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
      className={`rounded-2xl border-2 bg-card shadow-sm transition-all duration-300 ${
        isActive
          ? "border-primary shadow-primary/10 shadow-lg"
          : "border-border hover:border-primary/50 hover:shadow-md"
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
            isActive ? "bg-primary/15" : "bg-muted"
          }`}
        >
          {icon}
        </div>
        <div className="flex-1 text-right">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-bold text-foreground">{title}</span>
            {badge && (
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary">
                {badge}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        </div>
        <div
          className={`mt-1 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-2 transition-all ${
            isActive ? "border-primary bg-primary" : "border-border"
          }`}
        >
          {isActive && <Check size={12} className="text-primary-foreground" aria-hidden="true" />}

        </div>
      </button>

      {/* Accordion body — clicks inside do NOT close the card */}
      <Accordion open={isActive}>
        <div
          className="px-5 pb-5"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="border-t border-border pt-4">{children}</div>
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
              <h1 className="text-2xl font-black text-foreground">أرسل الأموال</h1>
              <p className="mt-1 text-muted-foreground text-sm">أدخل تفاصيل التحويل</p>
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

              <div className="my-4 flex items-center gap-3">
                <div className="flex-1 border-t border-dashed border-border" />
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-primary/30 bg-primary/10 text-primary">
                  <ArrowDown size={18} aria-hidden="true" />
                </div>
                <div className="flex-1 border-t border-dashed border-border" />
              </div>

              <label className="mb-2 block text-sm font-semibold text-muted-foreground">
                يستلم
              </label>
              <div className="flex gap-3">
                <div className="flex-1 rounded-xl border border-primary/30 bg-primary/5 px-4 py-3">
                  <span className="text-2xl font-black text-primary">
                    {converted.toLocaleString("ar", { maximumFractionDigits: 2 })}
                  </span>
                  <span className="mr-2 text-sm text-primary">{country.currency}</span>
                </div>
                <select
                  value={country.code}
                  onChange={(e) => handleCountryChange(e.target.value)}
                  className="flex items-center rounded-xl border border-border bg-muted px-3 py-3 text-sm font-medium text-foreground outline-none transition focus:border-primary"
                >
                  {COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.currency}
                    </option>
                  ))}
                </select>
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
              <div className="mb-4">
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

              <div className="space-y-3">
                {/* Zain Cash */}
                <MethodCard
                  id="zaincash"
                  icon={<Smartphone size={20} aria-hidden="true" />}
                  title="Zain Cash / CliQ"
                  description="استلام مباشر في المحفظة المحلية برقم الهاتف"
                  badge="Blueprint"

                  selected={receiveMethod}
                  onSelect={setReceiveMethod}
                >
                  <div className="space-y-3">
                    <div className="rounded-lg bg-amber-500/10 p-3 text-xs text-amber-600">
                      🏗️ يتطلب شراكة مع Liquidity Provider — المعمارية جاهزة
                    </div>
                  </div>
                </MethodCard>

                {/* Digital Wallet */}
                <MethodCard
                  id="wallet"
                  icon={<Wallet size={20} aria-hidden="true" />}
                  title="محفظة رقمية"
                  description="إرسال USDC مباشرة لمحفظة Solana"
                  selected={receiveMethod}
                  onSelect={setReceiveMethod}

                >
                  <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                    <div className="flex items-start gap-3">
                      <Sparkles size={24} className="text-primary" aria-hidden="true" />

                      <div>
                        <p className="font-semibold text-primary text-sm">
                          لا تحتاج إلى محفظة مسبقاً!
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                          إن لم يكن لديه محفظة، فسوف نُنشئ له محفظة{" "}
                          <strong>VeloPay</strong> تلقائياً! يستلم رصيده ويختار لاحقاً
                          كيفية الصرف.
                        </p>
                      </div>
                    </div>
                  </div>
                </MethodCard>

                <div className="text-center text-sm font-medium text-muted-foreground my-4">او عن طريق :</div>

                {/* Bank */}
                <MethodCard
                  id="bank"
                  icon={<Landmark size={20} aria-hidden="true" />}
                  title="إيداع بنكي"
                  description="يُحوَّل المبلغ مباشرةً إلى الحساب البنكي عبر Transak Off-Ramp"
                  badge="Sandbox"
                  selected={receiveMethod}
                  onSelect={setReceiveMethod}

                >
                  <div className="space-y-3">
                    <div className="rounded-lg bg-blue-500/10 p-3 text-xs text-blue-600">
                      <Info size={14} style={{ display: 'inline', marginLeft: 4 }} aria-hidden="true" /> بيئة تجريبية — Transak API جاهز للتكامل الكامل

                    </div>
                    <div>
                      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">الاسم الكامل</label>
                      <input
                        type="text"
                        placeholder="الاسم الكامل"
                        className="w-full mb-3 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        autoComplete="off"
                        onClick={(e) => e.stopPropagation()}
                      />
                      <label className="mb-1.5 block text-xs font-semibold text-muted-foreground">
                        رقم IBAN
                      </label>
                      <input
                        type="text"
                        value={iban}
                        onChange={(e) => setIban(e.target.value)}
                        placeholder="JO94 CBJO 0010 0000 0000 0131 0003 02"
                        className="w-full rounded-xl border border-border bg-background px-4 py-3 font-mono text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                        dir="ltr"
                        autoComplete="off"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </MethodCard>
              </div>
            </div>

            {/* ═══ RECURRING TRANSFER ═══ */}
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-foreground">إرسال دوري</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    جدوِل هذا التحويل تلقائياً كل شهر
                  </p>
                </div>
                {/* Toggle switch */}
                <button
                  type="button"
                  onClick={handleToggleRecurring}
                  className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors duration-300 ${
                    recurringEnabled ? "bg-primary" : "bg-muted"
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
                  <div className="flex items-center gap-3 rounded-xl bg-muted px-4 py-3">
                    <span className="text-sm text-muted-foreground whitespace-nowrap">
                      إرسال هذا المبلغ تلقائياً كل شهر في يوم
                    </span>
                    <select
                      value={recurringDay}
                      onChange={(e) => handleRecurringDayChange(e.target.value)}
                      className="w-20 rounded-lg border border-border bg-background px-2 py-1.5 text-center text-sm font-bold text-foreground outline-none focus:border-primary"
                    >
                      <option value="">--</option>
                      {Array.from({ length: 31 }, (_, i) => i + 1).map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                    <span className="text-sm text-muted-foreground">من كل شهر</span>
                  </div>

                  {recurringConfirmed && recurringDay && (
                    <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary">
                      <CheckCircle2 size={16} aria-hidden="true" />

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
            <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
              <div className="space-y-2.5 text-sm">
                {[
                  { label: "المبلغ", value: `${amount} ${fromCurrency}` },
                  {
                    label: "رسوم المعاملة",
                    value: "$0.01",
                    valueClass: "font-bold text-primary",
                  },
                  {
                    label: "سعر الصرف",
                    value: `1 ${fromCurrency} = ${(RATES[fromCurrency]?.[country.currency] ?? 0).toFixed(4)} ${country.currency}`,
                  },
                ].map(({ label, value, valueClass }) => (
                  <div key={label} className="flex justify-between">
                    <span className="text-muted-foreground">{label}</span>
                    <span className={`font-medium text-foreground ${valueClass ?? ""}`}>
                      {value}
                    </span>
                  </div>
                ))}
                <div className="border-t border-border pt-2.5">
                  <div className="flex justify-between font-bold">
                    <span className="text-foreground">يستلم</span>
                    <span className="text-primary">
                      {converted.toLocaleString("ar", { maximumFractionDigits: 2 })}{" "}
                      {country.currency}
                    </span>
                  </div>
                </div>
                <p className="flex items-center justify-center gap-1 text-center text-xs text-muted-foreground"><Zap size={12} aria-hidden="true" /> يصل خلال ~5 ثوانٍ</p>

              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              disabled={!canProceed}
              className="w-full rounded-full bg-primary py-4 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:bg-muted disabled:text-muted-foreground disabled:shadow-none active:scale-95"
            >
              متابعة <ArrowLeft size={18} style={{ display: 'inline', marginRight: 6 }} aria-hidden="true" />

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
                <ArrowRight size={16} style={{ display: 'inline', marginLeft: 6 }} aria-hidden="true" /> رجوع

              </button>
              <h1 className="text-2xl font-black text-foreground">طريقة الدفع</h1>
              <p className="mt-1 text-muted-foreground text-sm">اختر كيف تدفع</p>
            </div>

            <div className="space-y-3">
              {[
                {
                  id: "card",
                  icon: <CreditCard size={24} aria-hidden="true" />,
                  title: "بطاقة ائتمانية",
                  desc: "Visa / Mastercard — عبر Transak Sandbox",
                },
                {
                  id: "apple",
                  icon: <FaApple size={24} aria-hidden="true" />,
                  title: "Apple Pay",
                  desc: "الدفع السريع والآمن",
                },
                {
                  id: "usdc",
                  icon: <Coins size={24} aria-hidden="true" />,
                  title: "USDC من محفظتي",
                  desc: "إذا كان لديك رصيد USDC",
                },

              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setPaymentMethod(m.id)}
                  className={`w-full rounded-2xl border-2 p-5 text-right transition ${
                    paymentMethod === m.id
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

            {paymentMethod === "card" && (
              <div className="rounded-xl border border-blue-500/20 bg-blue-500/10 p-4">
                <p className="mb-1 flex items-center gap-1 text-sm font-medium text-blue-600"><TestTube2 size={16} aria-hidden="true" /> بيانات البطاقة التجريبية:</p>

                <p className="font-mono text-sm text-blue-500 ltr:text-left" dir="ltr">
                  4242 4242 4242 4242 | MM/YY: 12/26 | CVV: 123
                </p>
              </div>
            )}

            {paymentMethod === "apple" && (
              <div className="rounded-[2rem] border border-gray-800 bg-black p-6 text-white shadow-2xl relative overflow-hidden transform transition-all duration-500 animate-in slide-in-from-bottom-4 fade-in">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.1),transparent_50%)] pointer-events-none" />
                <div className="relative flex flex-col items-center text-center">
                  <div className="mb-5 mt-2 flex items-center justify-center gap-1.5 text-3xl font-medium tracking-tight">
                    <FaApple size={34} className="text-white -mt-1" />
                    <span>Pay</span>
                  </div>
                  
                  <div className="w-full rounded-2xl bg-gray-900/80 p-5 border border-gray-800 backdrop-blur-md text-right">
                    <div className="flex justify-between items-center mb-4 text-sm">
                      <span className="font-mono flex items-center gap-2 text-white">
                        <CreditCard size={16} className="text-gray-400"/> •••• 4242
                      </span>
                      <span className="text-gray-400 font-medium">البطاقة</span>
                    </div>
                    <div className="border-t border-gray-800 my-4" />
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-black text-2xl">{amount} <span className="text-lg text-gray-400 font-bold">{fromCurrency}</span></span>
                      <span className="text-gray-400 font-medium">المبلغ الإجمالي</span>
                    </div>
                  </div>

                  <div className="mt-6 w-full flex flex-col items-center">
                    <div className="mb-4 p-3 rounded-full bg-gray-800/50 border border-gray-700 animate-pulse">
                      <Zap size={24} className="text-primary" />
                    </div>
                    <p className="text-gray-400 text-xs mb-4 font-medium tracking-wide">
                      التأكيد عبر Face ID
                    </p>
                    <button 
                      onClick={() => setStep(3)}
                      className="w-full flex items-center justify-center gap-2 rounded-2xl bg-white text-black py-4 text-lg font-bold transition hover:bg-gray-200 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                    >
                      <FaApple size={22} className="-mt-0.5" /> Pay
                    </button>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod !== "apple" && (
              <button
                onClick={() => setStep(3)}
                className="w-full rounded-full bg-primary py-4 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 active:scale-95"
              >
                تأكيد طريقة الدفع <ArrowLeft size={18} style={{ display: 'inline', marginRight: 6 }} aria-hidden="true" />
              </button>
            )}
          </div>
        )}

        {/* ══════════ STEP 3 ══════════ */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <button
                onClick={() => setStep(2)}
                className="mb-4 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                <ArrowRight size={16} style={{ display: 'inline', marginLeft: 6 }} aria-hidden="true" /> رجوع
              </button>
              <h1 className="text-3xl font-black text-foreground tracking-tight">تأكيد التحويل</h1>
              <p className="mt-2 text-muted-foreground">راجع التفاصيل قبل الإرسال</p>
            </div>

            <div className="relative overflow-hidden rounded-3xl border border-border bg-card p-1 shadow-lg">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none" />
              <div className="relative rounded-[22px] bg-card p-6">
                <div className="flex justify-between items-center mb-6 pb-6 border-b border-dashed border-border">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">المبلغ الإجمالي للتسديد</div>
                    <div className="text-3xl font-black text-foreground">{amount} <span className="text-xl text-muted-foreground">{fromCurrency}</span></div>
                    <div className="text-sm text-muted-foreground mt-1">≈ ${usdAmount}</div>
                  </div>
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Sparkles size={24} className="text-primary" aria-hidden="true" />
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  {[
                    {
                      label: "المستلم سيحصل على",
                      value: `${converted.toLocaleString("ar", { maximumFractionDigits: 2 })} ${country.currency}`,
                      valueClass: "text-2xl text-primary font-black",
                    },
                    { label: "إلى", value: `${country.flag} ${phone}` },
                    {
                      label: "طريقة الاستلام",
                      value:
                        receiveMethod === "bank"
                          ? "إيداع بنكي"
                          : receiveMethod === "zaincash"
                          ? "Zain Cash / CliQ"
                          : receiveMethod === "wallet"
                          ? "محفظة رقمية"
                          : "غير محدد",
                    },
                    { label: "طريقة الدفع", value: paymentMethod === "card" ? "بطاقة ائتمانية" : "USDC" },
                  ].map(({ label, value, valueClass }) => (
                    <div key={label} className="flex justify-between items-center py-2">
                      <span className="text-muted-foreground font-medium">{label}</span>
                      <span className={`font-medium text-foreground text-right ${valueClass ?? ""}`}>
                        {value}
                      </span>
                    </div>
                  ))}
                  
                  <div className="mt-4 rounded-2xl bg-muted/50 p-4 border border-border space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">رسوم VeloPay</span>
                      <span className="text-primary font-bold bg-primary/10 px-2 py-1 rounded-lg">$0.01</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground font-medium">الشبكة</span>
                      <span className="font-medium flex items-center gap-1.5"><Zap size={14} className="text-primary" aria-hidden="true"/> Solana Devnet</span>
                    </div>
                  </div>
                </div>

                {recurringConfirmed && recurringDay && (
                  <div className="mt-6 rounded-xl bg-primary/10 px-4 py-3 text-sm text-primary flex items-center gap-2 border border-primary/20">
                    <RefreshCcw size={16} aria-hidden="true" /> تم تفعيل الإرسال الدوري يوم {recurringDay} من كل شهر
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={isLoading}
              className="w-full relative overflow-hidden rounded-full bg-primary py-5 text-xl font-black text-black shadow-[0_0_30px_rgba(19,182,1,0.3)] transition-all hover:bg-[#15cf01] hover:scale-[1.02] hover:shadow-[0_0_50px_rgba(19,182,1,0.5)] active:scale-95 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <RefreshCcw size={20} className="animate-spin" aria-hidden="true" /> جاري التحويل...
                </span>
              ) : (
                "تأكيد وإرسال"
              )}
            </button>
          </div>
        )}
      </div>

      <RecurringDialog
        open={showRecurringDialog}
        amount={amount}
        currency={fromCurrency}
        day={recurringDay as number}
        onConfirm={handleRecurringConfirm}
        onCancel={handleRecurringCancel}
      />
    </div>
  );
}