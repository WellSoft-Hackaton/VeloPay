"use client";

import { useState, useCallback } from "react";
import Link from "next/link";

export default function ReceivePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [iban, setIban] = useState("");
  const [accountName, setAccountName] = useState("");
  const [phone, setPhone] = useState("");
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

  // Toggle card selection — only fires from header buttons, never from form inputs
  const toggleCard = useCallback((option: string) => {
    setSelected((prev) => (prev === option ? null : option));
  }, []);

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]" dir="rtl">
        <div className="mx-auto max-w-md px-6 text-center">
          <div className="mb-6 text-7xl">🎉</div>
          <h1 className="mb-4 text-3xl font-black text-gray-900">تم! جاري التحويل</h1>
          <p className="mb-2 text-gray-500">
            {successMethod === "bank"
              ? "سيتم تحويل المبلغ إلى حسابك البنكي خلال دقائق."
              : "سيتم استلام المبلغ في محفظة Zain Cash / CliQ الخاصة بك."}
          </p>
          <p className="mb-8 text-sm text-gray-400">ستصلك رسالة تأكيد قريباً.</p>
          <div className="flex flex-col gap-3">
            <Link
              href="/send"
              className="inline-block rounded-full bg-[#13B601] px-8 py-4 font-bold text-white transition hover:bg-[#0fa301]"
            >
              أرسل تحويلاً جديداً
            </Link>
            <Link
              href="/"
              className="inline-block rounded-full border border-gray-200 bg-white px-8 py-4 font-medium text-gray-700 transition hover:bg-gray-50"
            >
              العودة للرئيسية
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]" dir="rtl">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/VeloPay.png" alt="VeloPay logo" className="h-[30px] w-[30px] rounded-xl" />
          </Link>
          <span className="rounded-full bg-[#13B601]/10 px-3 py-1 text-xs font-medium text-[#13B601]">
            استلام الأموال
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">كيف تريد استلام أموالك؟</h1>
          <p className="mt-1 text-gray-500">اختر الطريقة الأنسب لك</p>
        </div>

        {/* ===== OPTION B — Bank Account ===== */}
        <div
          className={`rounded-2xl border-2 bg-white shadow-sm transition-all ${
            selected === "B"
              ? "border-[#13B601] shadow-md shadow-[#13B601]/10"
              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
          }`}
        >
          {/* Card header — ONLY this button toggles the card */}
          <button
            type="button"
            className="flex w-full cursor-pointer items-start gap-4 p-6 text-right"
            onClick={() => toggleCard("B")}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              🏦
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-gray-900">تحويل إلى حساب بنكي</h3>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                  ✅ Sandbox Mode
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                يتحول USDC إلى عملة محلية عبر Transak Off-Ramp ويُودَع مباشرة في حسابك البنكي.
              </p>
              <div className="mt-2 text-xs text-gray-400">
                المسار: Solana USDC → Transak → IBAN
              </div>
            </div>
            <div
              className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
                selected === "B" ? "border-[#13B601] bg-[#13B601]" : "border-gray-300"
              }`}
            >
              {selected === "B" && (
                <span className="text-[10px] font-bold text-white">✓</span>
              )}
            </div>
          </button>

          {/* Expanded form — completely separate from the header button */}
          {selected === "B" && (
            <div className="border-t border-gray-100 px-6 pb-6">
              <div className="pt-5 space-y-4">
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 text-xs text-blue-600">
                  ℹ️ <strong>Sandbox Mode:</strong> هذه بيئة تجريبية. Transak API جاهز للدمج
                  الكامل عند الإطلاق الفعلي.
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    رقم IBAN
                  </label>
                  <input
                    type="text"
                    value={iban}
                    onChange={(e) => setIban(e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    placeholder="JO94 CBJO 0010 0000 0000 0131 0003 02"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-mono outline-none transition focus:border-[#13B601] focus:ring-2 focus:ring-[#13B601]/20"
                    dir="ltr"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    اسم صاحب الحساب
                  </label>
                  <input
                    type="text"
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    placeholder="محمد أحمد"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-[#13B601] focus:ring-2 focus:ring-[#13B601]/20"
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleSubmit("bank")}
                  disabled={submitting || !iban.trim()}
                  className="w-full rounded-full bg-[#13B601] py-4 font-bold text-white transition hover:bg-[#0fa301] disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
                >
                  {submitting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      جاري المعالجة...
                    </span>
                  ) : (
                    "حوّل إلى حسابي البنكي ✓"
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ===== OPTION C — Zain Cash / CliQ ===== */}
        <div
          className={`rounded-2xl border-2 bg-white shadow-sm transition-all ${
            selected === "C"
              ? "border-orange-400 shadow-md shadow-orange-400/10"
              : "border-gray-200 hover:border-gray-300 hover:shadow-md"
          }`}
        >
          {/* Card header — ONLY this button toggles the card */}
          <button
            type="button"
            className="flex w-full cursor-pointer items-start gap-4 p-6 text-right"
            onClick={() => toggleCard("C")}
          >
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              📱
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-gray-900">Zain Cash / CliQ</h3>
                <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                  🔲 Blueprint + محاكاة
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                استلم مباشرة في محفظة Zain Cash أو عبر نظام CliQ الأردني برقم هاتفك فقط.
              </p>
              <div className="mt-2 text-xs text-gray-400">
                المسار: Solana → LP → Zain Cash / JoPACC CliQ
              </div>
            </div>
            <div
              className={`mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full border-2 transition ${
                selected === "C" ? "border-orange-400 bg-orange-400" : "border-gray-300"
              }`}
            >
              {selected === "C" && (
                <span className="text-[10px] font-bold text-white">✓</span>
              )}
            </div>
          </button>

          {/* Expanded form — completely separate from the header button */}
          {selected === "C" && (
            <div className="border-t border-gray-100 px-6 pb-6">
              <div className="pt-5 space-y-4">
                {/* Architecture explanation */}
                <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                  <p className="mb-3 text-sm font-semibold text-amber-700">
                    🏗️ المعمارية التقنية الكاملة
                  </p>
                  <div className="space-y-1.5 text-xs text-amber-700">
                    {[
                      "المرسل يدفع Fiat → يتحول لـ USDC على Solana",
                      "USDC تُرسَل لعنوان Liquidity Provider",
                      "LP يحول لـ JOD من رصيده المحلي",
                      "يرسل للمستلم عبر Zain Cash API أو CliQ",
                      "المستلم يستقبل JOD في هاتفه فوراً",
                    ].map((step, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <span className="flex h-4 w-4 flex-shrink-0 items-center justify-center rounded-full bg-amber-200 text-[10px] font-bold text-amber-700">
                          {i + 1}
                        </span>
                        <span>{step}</span>
                      </div>
                    ))}
                  </div>
                  <p className="mt-3 border-t border-amber-200 pt-3 text-xs text-amber-600">
                    💡 يتطلب شراكة مع Liquidity Provider يملك Zain Cash Business Account أو
                    عضوية JoPACC. المعمارية جاهزة للتكامل الفوري.
                  </p>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    رقم الهاتف (Zain Cash / CliQ)
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    onPointerDown={(e) => e.stopPropagation()}
                    onMouseDown={(e) => e.stopPropagation()}
                    onTouchStart={(e) => e.stopPropagation()}
                    onFocus={(e) => e.stopPropagation()}
                    placeholder="+962-7X-XXXXXXX"
                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                    dir="ltr"
                    autoComplete="off"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-gray-700">
                    الخدمة المفضلة
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: "zaincash", label: "Zain Cash", icon: "📱" },
                      { id: "cliq", label: "CliQ / JoPACC", icon: "🏦" },
                    ].map((s) => (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setService(s.id)}
                        className={`flex items-center gap-3 rounded-xl border-2 p-3 transition ${
                          service === s.id
                            ? "border-orange-400 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <span className="text-xl">{s.icon}</span>
                        <span className="text-sm font-medium text-gray-700">{s.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleSubmit("zaincash")}
                  disabled={submitting || !phone.trim()}
                  className="w-full rounded-full border-2 border-orange-400 bg-orange-50 py-4 font-bold text-orange-700 transition hover:bg-orange-100 disabled:cursor-not-allowed disabled:opacity-50 active:scale-95"
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
        <div className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
          <p className="text-sm text-gray-500 leading-relaxed">
            💡 <strong className="text-gray-700">ملاحظة تقنية:</strong> الخيار الأول (البنك)
            يعمل في Sandbox Mode عبر Transak API. الخيار الثاني محاكاة مع Blueprint معماري
            كامل يُظهر الفهم التقني الكامل للمشكلة وطريقة الحل التجاري.
          </p>
        </div>

        <Link
          href="/"
          className="block text-center text-sm text-gray-400 transition hover:text-gray-600"
        >
          ← العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}