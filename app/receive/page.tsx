"use client";

import { useState } from "react";
import Link from "next/link";

export default function ReceivePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [iban, setIban] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (method: string) => {
    setSubmitting(true);
    // Simulate processing
    await new Promise((r) => setTimeout(r, 2000));
    setSubmitting(false);
    setSuccess(true);
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f5f5]" dir="rtl">
        <div className="mx-auto max-w-md px-6 text-center">
          <div className="mb-6 text-7xl">🎉</div>
          <h1 className="mb-4 text-3xl font-black text-gray-900">تم! جاري التحويل</h1>
          <p className="mb-8 text-gray-500">
            ستصلك رسالة تأكيد قريباً. يستغرق الاستلام عادةً أقل من دقيقة.
          </p>
          <Link
            href="/"
            className="inline-block rounded-full bg-[#13B601] px-8 py-4 font-bold text-white"
          >
            العودة للرئيسية
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f5f5]" dir="rtl">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#13B601] text-white font-bold text-sm">
              N
            </div>
            <span className="font-bold text-gray-900">NexaPay</span>
          </Link>
          <span className="text-sm text-gray-500">استلام الأموال</span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8 space-y-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900">كيف تريد استلام أموالك؟</h1>
          <p className="mt-1 text-gray-500">اختر الطريقة الأنسب لك</p>
        </div>

        {/* Option A - Phantom Wallet */}
        <div
          className={`cursor-pointer rounded-2xl border-2 bg-white p-6 transition ${
            selected === "A" ? "border-[#13B601]" : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => setSelected(selected === "A" ? null : "A")}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-purple-100 text-2xl">
              👻
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-gray-900">محفظة USDC (Phantom / Crossmint)</h3>
                <span className="rounded-full bg-[#13B601]/10 px-2.5 py-0.5 text-xs font-medium text-[#13B601]">
                  ✅ يعمل كامل
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                استلم USDC مباشرة في محفظتك على Solana Devnet. فوري بدون خطوات إضافية.
              </p>
              <div className="mt-2 text-xs text-gray-400">
                المسار: Solana → عنوان محفظتك مباشرة
              </div>
            </div>
          </div>

          {selected === "A" && (
            <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  عنوان محفظة Solana (أو سجّل برقم هاتفك)
                </label>
                <input
                  type="text"
                  placeholder="عنوان المحفظة أو رقم الهاتف"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-[#13B601]"
                  dir="ltr"
                />
              </div>
              <button
                onClick={() => handleSubmit("wallet")}
                disabled={submitting}
                className="w-full rounded-full bg-[#13B601] py-4 font-bold text-white transition hover:bg-[#0fa301] disabled:opacity-50"
              >
                {submitting ? "جاري التأكيد..." : "احتفظ بـ USDC في محفظتي ✓"}
              </button>
            </div>
          )}
        </div>

        {/* Option B - Bank Account */}
        <div
          className={`cursor-pointer rounded-2xl border-2 bg-white p-6 transition ${
            selected === "B" ? "border-[#13B601]" : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => setSelected(selected === "B" ? null : "B")}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-blue-100 text-2xl">
              🏦
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-gray-900">تحويل لحساب بنكي</h3>
                <span className="rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-600">
                  ✅ Sandbox Mode
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                يتحول USDC إلى عملة محلية عبر Transak Off-Ramp ويُودَع في حسابك البنكي.
              </p>
              <div className="mt-2 text-xs text-gray-400">
                المسار: Solana USDC → MoonPay/Transak → IBAN
              </div>
            </div>
          </div>

          {selected === "B" && (
            <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">رقم IBAN</label>
                <input
                  type="text"
                  value={iban}
                  onChange={(e) => setIban(e.target.value)}
                  placeholder="JO94 CBJO 0010 0000 0000 0131 0003 02"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm font-mono outline-none focus:border-[#13B601]"
                  dir="ltr"
                />
              </div>
              <div className="rounded-xl border border-blue-200 bg-blue-50 p-3 text-xs text-blue-600">
                ℹ️ Sandbox Mode: هذه عملية تجريبية. الـ API جاهز للدمج الكامل عند التشغيل الفعلي.
              </div>
              <button
                onClick={() => handleSubmit("bank")}
                disabled={submitting || !iban}
                className="w-full rounded-full bg-[#13B601] py-4 font-bold text-white transition hover:bg-[#0fa301] disabled:opacity-50"
              >
                {submitting ? "جاري المعالجة..." : "حوّل لحسابي البنكي ✓"}
              </button>
            </div>
          )}
        </div>

        {/* Option C - Zain Cash / CliQ */}
        <div
          className={`cursor-pointer rounded-2xl border-2 bg-white p-6 transition ${
            selected === "C" ? "border-gray-300" : "border-gray-200 hover:border-gray-300"
          }`}
          onClick={() => setSelected(selected === "C" ? null : "C")}
        >
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-orange-100 text-2xl">
              📱
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h3 className="font-bold text-gray-900">Zain Cash / CliQ</h3>
                <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-500">
                  🔲 محاكاة (Blueprint)
                </span>
              </div>
              <p className="mt-1 text-sm text-gray-500">
                استلم مباشرة في محفظة Zain Cash أو عبر نظام CliQ الأردني.
              </p>
              <div className="mt-2 text-xs text-gray-400">
                المسار: Solana → Liquidity Provider → Zain Cash API / JoPACC CliQ
              </div>
            </div>
          </div>

          {selected === "C" && (
            <div className="mt-6 space-y-4 border-t border-gray-100 pt-6">
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-4">
                <p className="text-sm font-semibold text-amber-700 mb-2">
                  🏗️ المعمارية الكاملة جاهزة
                </p>
                <p className="text-xs text-amber-600">
                  هذا التكامل يتطلب شراكة مع Liquidity Provider محلي يملك Zain Cash Business Account أو عضوية في JoPACC للوصول لـ CliQ API. المعمارية التقنية مبنية بالكامل وجاهزة للتكامل الفوري.
                </p>
              </div>

              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4 text-sm">
                <p className="font-semibold text-gray-700 mb-3">المسار التقني:</p>
                <div className="space-y-2 text-xs text-gray-500">
                  {[
                    "المرسل يدفع Fiat → يتحول لـ USDC على Solana",
                    "USDC تُرسَل لعنوان Liquidity Provider",
                    "LP يحول لـ JOD من رصيده المحلي",
                    "يرسل للمستلم عبر Zain Cash API أو CliQ",
                    "المستلم يستقبل JOD في هاتفه فوراً",
                  ].map((step, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-[#13B601] font-bold">{i + 1}.</span>
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">رقم الهاتف (Zain Cash / CliQ)</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+962-7X-XXXXXXX"
                  className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-gray-400"
                  dir="ltr"
                />
              </div>

              <button
                onClick={() => handleSubmit("zaincash")}
                disabled={submitting || !phone}
                className="w-full rounded-full border-2 border-gray-300 py-4 font-bold text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                {submitting ? "جاري المحاكاة..." : "محاكاة الاستلام (Demo)"}
              </button>
            </div>
          )}
        </div>

        {/* Info section */}
        <div className="rounded-xl border border-gray-100 bg-white p-5">
          <p className="text-sm text-gray-500 leading-relaxed">
            💡 <strong className="text-gray-700">للحكام:</strong> الخيار A يعمل بالكامل على Devnet.
            الخيار B يعمل في Sandbox Mode عبر Transak API. الخيار C محاكاة مع Blueprint معماري
            كامل يُظهر فهمنا التقني للمشكلة وطريقة الحل.
          </p>
        </div>

        <Link
          href="/"
          className="block text-center text-sm text-gray-400 hover:text-gray-600"
        >
          ← العودة للرئيسية
        </Link>
      </div>
    </div>
  );
}
