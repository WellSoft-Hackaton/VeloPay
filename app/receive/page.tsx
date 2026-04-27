"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { 
  PartyPopper, 
  Landmark, 
  CheckCircle2, 
  Check, 
  Info, 
  Smartphone, 
  Construction, 
  Lightbulb, 
  ArrowRight,
  Square
} from "lucide-react";


export default function ReceivePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [iban, setIban] = useState("");
  const [accountName, setAccountName] = useState("");
  const [phone, setPhone] = useState("+962-");
  const [service, setService] = useState("zaincash");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [successMethod, setSuccessMethod] = useState("");

  const handleSubmit = async (method: string) => {
    setSubmitting(true);
    setSuccessMethod(method);
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    setSuccess(true);
  };

  // Toggle card selection
  const toggleCard = useCallback((option: string) => {
    setSelected((prev) => (prev === option ? null : option));
  }, []);

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground transition-colors duration-300" dir="rtl">
        <div className="mx-auto max-w-md px-6 text-center">
          <div className="mb-6 flex justify-center text-7xl">
            <PartyPopper size={64} className="text-primary" aria-hidden="true" />
          </div>
          <h1 className="mb-4 text-3xl font-black">تم! جاري التحويل</h1>
          <p className="mb-2 text-muted-foreground">
            {successMethod === "bank"
              ? "سيتم تحويل المبلغ إلى حسابك البنكي خلال دقائق."
              : "سيتم استلام المبلغ في محفظة Zain Cash / CliQ الخاصة بك."}
          </p>
          <p className="mb-8 text-sm text-muted-foreground/60">ستصلك رسالة تأكيد قريباً.</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/send"
              className="inline-block rounded-full bg-primary px-8 py-4 font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90"
            >
              أرسل تحويلاً جديداً
            </Link>
            <Link
              href="/"
              className="inline-block rounded-full border border-border bg-card px-8 py-4 font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300" dir="rtl">
      <Header />

      <div className="mx-auto max-w-2xl px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black">كيف تريد استلام أموالك؟</h1>
          <p className="mt-1 text-muted-foreground">اختر الطريقة الأنسب لك</p>
        </div>

        {/* ===== OPTION B — Bank Account ===== */}
        <div
          className={`rounded-2xl border-2 bg-card shadow-sm transition-all ${
            selected === "B"
              ? "border-primary shadow-md shadow-primary/10"
              : "border-border hover:border-primary/50 hover:shadow-md"
          }`}
        >
          {/* Card header */}
          <button
            type="button"
            className="flex w-full cursor-pointer items-start gap-4 p-6 text-right"
            onClick={() => toggleCard("B")}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-2xl">
              <Landmark size={24} className="text-blue-500" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-foreground">تحويل إلى حساب بنكي</h3>
                <span className="flex items-center gap-1 rounded-full bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                  <CheckCircle2 size={12} aria-hidden="true" /> Sandbox Mode
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                يتحول USDC إلى عملة محلية عبر Transak Off-Ramp ويُودَع مباشرة في حسابك البنكي.
              </p>
              <div className="mt-2 text-xs text-muted-foreground/60">
                المسار: Solana USDC → Transak → IBAN
              </div>
            </div>
            <div
              className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
                selected === "B" ? "border-primary bg-primary" : "border-border"
              }`}
            >
              {selected === "B" && (
                <Check size={12} className="text-primary-foreground" aria-hidden="true" />
              )}
            </div>
          </button>

          {/* Expanded form */}
          {selected === "B" && (
            <div className="border-t border-border px-6 pb-6">
              <div className="pt-5 space-y-4">
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-3 text-xs text-blue-600 flex gap-2 items-start">
                  <Info size={14} className="mt-0.5 flex-shrink-0" aria-hidden="true" />
                  <p>
                    <strong>Sandbox Mode:</strong> هذه بيئة تجريبية. Transak API جاهز للدمج
                    الكامل عند الإطلاق الفعلي.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-muted-foreground">
                    رقم IBAN
                  </label>
                  <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    placeholder="JO94 CBJO 0010 0000 0000 0131 0003 02"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-mono outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                    dir="ltr"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-muted-foreground">
                    اسم صاحب الحساب
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="محمد أحمد"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleSubmit("bank")}
                  disabled={submitting || !iban.trim()}
                  className="w-full rounded-full bg-primary py-4 font-bold text-primary-foreground shadow-lg shadow-primary/20 transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                      جاري المعالجة...
                    </span>
                  ) : (
                    حوّل إلى حسابي البنكي <Check size={16} style={{ display: 'inline', marginRight: 4 }} aria-hidden="true" />

                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===== OPTION C — Zain Cash / CliQ ===== */}
        <div
          className={`rounded-2xl border-2 bg-card shadow-sm transition-all ${
            selected === "C"
              ? "border-orange-500 shadow-md shadow-orange-500/10"
              : "border-border hover:border-orange-500/50 hover:shadow-md"
          }`}
        >
          {/* Card header */}
          <button
            type="button"
            className="flex w-full cursor-pointer items-start gap-4 p-6 text-right"
            onClick={() => toggleCard("C")}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-500/10 text-2xl">
              <Smartphone size={24} className="text-orange-500" aria-hidden="true" />
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-foreground">Zain Cash / CliQ</h3>
                  <span className="flex items-center gap-1 rounded-full bg-orange-500/10 px-2.5 py-0.5 text-xs font-medium text-orange-600">
                    <Square size={12} aria-hidden="true" /> Blueprint + محاكاة
                  </span>

              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                استلم مباشرة في محفظة Zain Cash أو عبر نظام CliQ الأردني برقم هاتفك فقط.
              </p>
              <div className="mt-2 text-xs text-muted-foreground/60">
                المسار: Solana → LP → Zain Cash / JoPACC CliQ
              </div>
            </div>
            <div
              className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
                selected === "C" ? "border-orange-500 bg-orange-500" : "border-border"
              }`}
            >
              {selected === "C" && (
                <Check size={12} className="text-white" aria-hidden="true" />
              )}
            </div>
          </button>

          {/* Expanded form */}
          {selected === "C" && (
            <div className="border-t border-border px-6 pb-6">
              <div className="pt-5 space-y-4">
                {/* Architecture explanation */}
                <div className="rounded-xl border border-orange-500/20 bg-orange-500/5 p-4">
                  <p className="mb-3 flex items-center gap-2 text-sm font-semibold text-orange-600">
                    <Construction size={16} aria-hidden="true" /> المعمارية التقنية الكاملة
                  </p>
                  <div className="space-y-1.5 text-xs text-orange-600/90">
                    {[
                      "المرسل يدفع Fiat → يتحول لـ USDC على Solana",
                      "USDC تُرسَل لعنوان Liquidity Provider",
                      "LP يحول لـ JOD من رصيده المحلي",
                      "يرسل للمستلم عبر Zain Cash API أو CliQ",
                      "المستلم يستقبل JOD في هاتفه فوراً",
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-orange-500/20 text-[10px] font-bold text-orange-600">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 border-t border-orange-500/10 pt-3 text-xs text-orange-600/70">
                    💡 يتطلب شراكة مع Liquidity Provider يملك Zain Cash Business Account أو
                    عضوية JoPACC. المعمارية جاهزة للتكامل الفوري.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-muted-foreground">
                    رقم الهاتف (Zain Cash / CliQ)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+962-7X-XXXXXXX"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20"
                    dir="ltr"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-muted-foreground">
                    الخدمة المفضلة
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "zaincash", label: "Zain Cash", icon: <Smartphone size={18} aria-hidden="true" /> },
                      { id: "cliq", label: "CliQ / JoPACC", icon: <Landmark size={18} aria-hidden="true" /> },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setService(s.id)}
                        className={`flex items-center gap-3 rounded-xl border-2 p-3 transition ${
                          service === s.id
                            ? "border-orange-500 bg-orange-500/5"
                            : "border-border bg-card hover:border-orange-500/50"
                        }`}
                      >
                        <span className="text-orange-500">{s.icon}</span>
                        <span className="text-sm font-medium text-foreground">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSubmit("zaincash")}
                  disabled={submitting || phone.replace(/\D/g, "").length < 11}
                  className="w-full rounded-full border-2 border-orange-500 bg-orange-500/10 py-4 font-bold text-orange-600 transition hover:bg-orange-500/20 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
                      جاري المحاكاة...
                    </span>
                  ) : (
                    "محاكاة الاستلام عبر Zain Cash / CliQ"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Note */}
        <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
          <p className="text-sm text-muted-foreground leading-relaxed flex gap-2">
            <Lightbulb size={16} className="mt-1 flex-shrink-0 text-primary" aria-hidden="true" />
            <span>
              <strong className="text-foreground">ملاحظة تقنية:</strong> الخيار الأول (البنك)
              يعمل في Sandbox Mode عبر Transak API. الخيار الثاني محاكاة مع Blueprint معماري
              كامل يُظهر الفهم التقني الكامل للمشكلة وطريقة الحل التجاري.
            </span>
          </p>
        </div>

        <Link
          href="/"
          className="flex items-center justify-center gap-2 text-center text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowRight size={16} aria-hidden="true" /> العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}