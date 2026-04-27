"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { 
  Rocket, 
  CreditCard, 
  Link2, 
  CheckCircle2, 
  Hourglass, 
  PartyPopper, 
  Check, 
  Handshake, 
  Bot, 
  ExternalLink 
} from "lucide-react";

const STEPS = [
  { id: "initiated", label: "تم الإرسال", icon: <Rocket size={20} aria-hidden="true" />, desc: "تم استلام طلب التحويل" },
  { id: "processing", label: "معالجة الدفع", icon: <CreditCard size={20} aria-hidden="true" />, desc: "يتم تحويل Fiat إلى USDC" },
  { id: "confirmed", label: "تأكيد Blockchain", icon: <Link2 size={20} aria-hidden="true" />, desc: "تم التسجيل على Solana" },
  { id: "delivered", label: "تم التسليم", icon: <CheckCircle2 size={20} aria-hidden="true" />, desc: "وصل للمستلم بنجاح" },
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
  isEscrow?: boolean;
  escrowCondition?: string;
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
    if (!tx) return;

    const timer = setInterval(() => {
      setElapsed((e) => e + 1);
      setCurrentStep((s) => {
        // If it's escrow and not delivered, stop at the penultimate step ("confirmed")
        if (tx.isEscrow && tx.status === "locked") {
          if (s < STEPS.length - 2) return s + 1;
          clearInterval(timer);
          return s; // stays at step 2 (0-indexed, so 3rd step)
        }

        if (s < STEPS.length - 1) return s + 1;
        clearInterval(timer);
        return s;
      });
    }, 1500);
    return () => clearInterval(timer);
  }, [tx]);

  const handleReleaseFunds = () => {
    if (!tx) return;
    try {
      const txs: TxData[] = JSON.parse(localStorage.getItem("nexapay_txs") || "[]");
      const updatedTxs = txs.map(t => t.txHash === tx.txHash ? { ...t, status: "delivered" } : t);
      localStorage.setItem("nexapay_txs", JSON.stringify(updatedTxs));
      
      setTx({ ...tx, status: "delivered" });
      setCurrentStep(STEPS.length - 1); // jump to delivered
    } catch {}
  };

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
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300" dir="rtl">
      <Header />

      <div className="mx-auto max-w-2xl px-6 py-8 space-y-6">
        {/* Status header */}
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <div className="mb-2 flex justify-center text-5xl">
            {currentStep < STEPS.length - 1 ? (
              <Hourglass size={48} className="animate-pulse text-muted-foreground" aria-hidden="true" />
            ) : (
              <PartyPopper size={48} className="text-primary" aria-hidden="true" />
            )}
          </div>
          <h1 className="text-xl font-black text-foreground">
            {tx?.isEscrow && tx.status === "locked" && currentStep === STEPS.length - 2
              ? "محجوز في العقد الذكي"
              : currentStep < STEPS.length - 1
              ? "جاري التحويل..."
              : "تم التحويل بنجاح!"}
          </h1>
          {tx && (
            <p className="mt-1 text-muted-foreground">
              {tx.amount} {tx.fromCurrency} → {tx.converted} {tx.toCurrency}
            </p>
          )}
        </div>

        {/* Progress steps */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h3 className="mb-6 font-semibold text-foreground">حالة المعاملة</h3>
          <div className="space-y-4">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                    i < currentStep
                      ? "bg-primary text-primary-foreground"
                      : i === currentStep
                      ? "border-2 border-primary bg-primary/10 text-primary"
                      : "border-2 border-border bg-muted text-muted-foreground"
                  }`}
                >
                  {i < currentStep ? <Check size={18} aria-hidden="true" /> : s.icon}
                  {i === currentStep && i < STEPS.length - 1 && (
                    <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pt-1">
                  <div
                    className={`font-semibold ${
                      i <= currentStep ? "text-foreground" : "text-muted-foreground"
                    }`}
                  >
                    {s.label}
                  </div>
                  <div className="text-sm text-muted-foreground">{s.desc}</div>
                  {i <= currentStep && (
                    <div className="mt-0.5 text-xs text-primary">
                      {new Date().toLocaleTimeString("ar", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                    </div>
                  )}
                </div>

                {/* Status */}
                <div className="pt-1">
                  {i < currentStep && <span className="text-xs font-medium text-primary">✓ مكتمل</span>}
                  {i === currentStep && i < STEPS.length - 1 && (!tx?.isEscrow || tx.status !== "locked" || i !== STEPS.length - 2) && (
                    <span className="inline-flex items-center gap-1 text-xs text-amber-600">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-amber-500" />
                      جارٍ...
                    </span>
                  )}
                  {i === currentStep && tx?.isEscrow && tx.status === "locked" && i === STEPS.length - 2 && (
                    <span className="inline-flex items-center gap-1 text-xs text-blue-600">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-blue-500" />
                      بانتظار التحرير
                    </span>
                  )}
                  {i === currentStep && i === STEPS.length - 1 && (
                    <span className="text-xs font-medium text-primary">✓ مكتمل</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaction details */}
        {tx && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <h3 className="mb-4 font-semibold text-foreground">تفاصيل المعاملة</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">المبلغ المُرسَل</span>
                <span className="font-medium text-foreground">{tx.amount} {tx.fromCurrency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">المبلغ المستلَم</span>
                <span className="font-bold text-primary">{tx.converted} {tx.toCurrency}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">المستلم</span>
                <span className="font-medium text-foreground">{tx.countryFlag} {tx.recipientPhone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">الرسوم</span>
                <span className="font-medium text-primary">$0.01</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">الشبكة</span>
                <span className="font-medium text-foreground">Solana Devnet</span>
              </div>
              <div className="border-t border-border pt-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction Hash</span>
                  <div className="text-left">
                    <div className="font-mono text-xs text-muted-foreground dir-ltr">{shortHash}</div>
                  </div>
                </div>
              </div>
            </div>
            <a
              href={explorerUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-border py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              عرض على Solana Explorer <ExternalLink size={14} aria-hidden="true" />
            </a>
          </div>
        )}

        {/* Escrow Details & Action */}
        {tx?.isEscrow && (
          <div className="rounded-2xl border-2 border-blue-500/20 bg-blue-500/5 p-6 shadow-sm">
            <h3 className="mb-2 flex items-center gap-2 font-semibold text-blue-600">
              <Handshake size={20} aria-hidden="true" /> تفاصيل العقد الذكي (Escrow)
            </h3>
            <p className="mb-4 text-sm text-blue-700 bg-card p-3 rounded-lg border border-blue-500/10">
              <span className="block font-bold mb-1 text-xs text-blue-600">شرط التحرير:</span>
              {tx.escrowCondition || "لا يوجد شرط مكتوب"}
            </p>
            {tx.status === "locked" ? (
              <div>
                <p className="mb-4 text-xs text-blue-600/80">
                  المبلغ محتجز حالياً في العقد الذكي بأمان. إذا تم تنفيذ الشرط أعلاه، يمكنك تحرير المبلغ ليصل فوراً للمستلم.
                </p>
                <button
                  onClick={handleReleaseFunds}
                  className="w-full rounded-xl bg-blue-600 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 active:scale-95"
                >
                  تحرير الأموال الآن (Release Funds)
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm font-bold text-primary">
                <CheckCircle2 size={18} aria-hidden="true" /> تم تحرير الأموال بنجاح
              </div>
            )}
          </div>
        )}

        {/* AI Analysis */}
        {currentStep === STEPS.length - 1 && (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 shadow-sm">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-primary">
              <Bot size={18} aria-hidden="true" /> تحليل AI
            </div>
            {loadingAi ? (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                يحلل VeloPay AI تحويلك...
              </div>
            ) : (
              <p className="text-foreground text-sm leading-relaxed">{aiMessage}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-4">
          <Link
            href="/send"
            className="flex-1 rounded-full border border-border bg-card py-4 text-center font-semibold text-muted-foreground transition hover:bg-muted hover:text-foreground shadow-sm"
          >
            تحويل جديد
          </Link>
          <Link
            href="/receive"
            className="flex-1 rounded-full bg-primary py-4 text-center font-semibold text-primary-foreground transition hover:bg-primary/90 shadow-lg shadow-primary/20"
          >
            طرق الاستلام
          </Link>
        </div>
      </div>
    </div>
  );
}
