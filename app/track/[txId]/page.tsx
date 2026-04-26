"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

const STEPS = [
  { id: "initiated", label: "تم الإرسال", icon: "🚀", desc: "تم استلام طلب التحويل" },
  { id: "processing", label: "معالجة الدفع", icon: "💳", desc: "يتم تحويل Fiat إلى USDC" },
  { id: "confirmed", label: "تأكيد Blockchain", icon: "⛓️", desc: "تم التسجيل على Solana" },
  { id: "delivered", label: "تم التسليم", icon: "✅", desc: "وصل للمستلم بنجاح" },
];

interface TxData {
  txHash: string;
  amount: string;
  fromCurrency: string;
  toCurrency: string;
  converted: string;
  recipientPhone: string;
  countryFlag: string;
  status: string;
  createdAt: string;
}

export default function TrackPage() {
  const params = useParams();
  const txId = params.txId as string;
  const [currentStep, setCurrentStep] = useState(0);
  const [tx, setTx] = useState<TxData | null>(null);
  const [aiMessage, setAiMessage] = useState("");
  const [loadingAi, setLoadingAi] = useState(false);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    // Load tx from localStorage
    try {
      const txs: TxData[] = JSON.parse(localStorage.getItem("nexapay_txs") || "[]");
      const found = txs.find((t) => t.txHash === txId);
      if (found) setTx(found);
    } catch {}
  }, [txId]);

  // Simulate progress
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed((e) => e + 1);
      setCurrentStep((s) => {
        if (s < STEPS.length - 1) return s + 1;
        clearInterval(timer);
        return s;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, []);

  // Fetch AI analysis after completion
  useEffect(() => {
    if (currentStep === STEPS.length - 1 && tx && !aiMessage) {
      setLoadingAi(true);
      fetch("/api/ai/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            {
              role: "user",
              content: `المستخدم أرسل ${tx.amount} ${tx.fromCurrency} عبر VeloPay. الرسوم: $0.01. رسوم Western Union المكافئة: $${(parseFloat(tx.amount) * 0.035 + 5).toFixed(2)}. وقت الوصول: ~5 ثوانٍ. اكتب رسالة تحفيزية قصيرة جداً (جملة واحدة) بالعربية.`,
            },
          ],
        }),
      })
        .then((r) => r.json())
        .then((d) => setAiMessage(d.content || ""))
        .catch(() => setAiMessage(`🎉 رائع! وفّرت $${(parseFloat(tx?.amount || "0") * 0.035 + 4.99).toFixed(2)} مقارنة بـ Western Union.`))
        .finally(() => setLoadingAi(false));
    }
  }, [currentStep, tx]);

  const shortHash = txId ? `${txId.slice(0, 8)}...${txId.slice(-8)}` : "---";
  const explorerUrl = `https://explorer.solana.com/tx/${txId}?cluster=devnet`;

  return (
    <div className="min-h-screen bg-[#f5f5f5]" dir="rtl">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <div className="mx-auto flex max-w-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/VeloPay.png" alt="VeloPay logo" className="h-[30px] w-[30px] rounded-xl" />
          </Link>
          <span className="text-sm text-gray-500">تتبع التحويل</span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-8 space-y-6">
        {/* Status header */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center">
          <div className="mb-2 text-5xl">
            {currentStep < STEPS.length - 1 ? (
              <span className="animate-bounce inline-block">⏳</span>
            ) : (
              <span>🎉</span>
            )}
          </div>
          <h1 className="text-xl font-black text-gray-900">
            {currentStep < STEPS.length - 1 ? "جاري التحويل..." : "تم التحويل بنجاح!"}
          </h1>
          {tx && (
            <p className="mt-1 text-gray-500">
              {tx.amount} {tx.fromCurrency} → {tx.converted} {tx.toCurrency}
            </p>
          )}
        </div>

        {/* Progress steps */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6">
          <h3 className="mb-6 font-semibold text-gray-900">حالة المعاملة</h3>
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg transition-all duration-500 ${
                    i < currentStep
                      ? "bg-[#13B601] text-white"
                      : i === currentStep
                      ? "border-2 border-[#13B601] bg-[#13B601]/10"
                      : "border-2 border-gray-200 bg-gray-50"
                  }`}
                >
                  {i < currentStep ? "✓" : s.icon}
                  {i === currentStep && i < STEPS.length - 1 && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#13B601]/20" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div
                    className={`font-semibold ${
                      i <= currentStep ? "text-gray-900" : "text-gray-400"
                    }`}
                  >
                    {s.label}
                  </div>
                  <div className="text-sm text-gray-400">{s.desc}</div>
                  {i <= currentStep && (
                    <div className="mt-0.5 text-xs text-[#13B601]">
                      {new Date().toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="pt-1">
                  {i < currentStep && <span className="text-xs font-medium text-[#13B601]">✓ مكتمل</span>}
                  {i === currentStep && i < STEPS.length - 1 && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                      جارٍ...
                    </span>
                  )}
                  {i === currentStep && i === STEPS.length - 1 && (
                    <span className="text-xs font-medium text-[#13B601]">✓ مكتمل</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction details */}
        {tx && (
          <div className="rounded-2xl border border-gray-200 bg-white p-6">
            <h3 className="mb-4 font-semibold text-gray-900">تفاصيل المعاملة</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">المبلغ المُرسَل</span>
                <span className="font-medium">{tx.amount} {tx.fromCurrency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">المبلغ المستلَم</span>
                <span className="font-bold text-[#13B601]">{tx.converted} {tx.toCurrency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">المستلم</span>
                <span className="font-medium">{tx.countryFlag} {tx.recipientPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">الرسوم</span>
                <span className="font-medium text-[#13B601]">$0.01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">الشبكة</span>
                <span className="font-medium">Solana Devnet</span>
              </div>
              <div className="border-t border-gray-100 pt-3">
                <div className="flex justify-between">
                  <span className="text-gray-500">Transaction Hash</span>
                  <div className="text-left">
                    <div className="font-mono text-xs text-gray-600 dir-ltr">{shortHash}</div>
                  </div>
                </div>
              </div>
            </div>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
            >
              عرض على Solana Explorer ↗
            </a>
          </div>
        )}

        {/* AI Analysis */}
        {currentStep === STEPS.length - 1 && (
          <div className="rounded-2xl border border-[#13B601]/20 bg-[#13B601]/5 p-6">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[#13B601]">
              🤖 تحليل AI
            </div>
            {loadingAi ? (
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#13B601] border-t-transparent" />
                يحلل VeloPay AI تحويلك...
              </div>
            ) : (
              <p className="text-gray-700">{aiMessage}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/send"
            className="flex-1 rounded-full border border-gray-200 bg-white py-4 text-center font-semibold text-gray-700 transition hover:bg-gray-50"
          >
            تحويل جديد
          </Link>
          <Link
            href="/receive"
            className="flex-1 rounded-full bg-[#13B601] py-4 text-center font-semibold text-white transition hover:bg-[#0fa301]"
          >
            طرق الاستلام
          </Link>
        </div>
      </div>
    </div>
  );
}
