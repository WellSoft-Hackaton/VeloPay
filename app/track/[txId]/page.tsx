"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/Header";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Send, 
  CreditCard, 
  Link2, 
  CheckCircle2, 
  Bot, 
  Zap, 
  ExternalLink, 
  ShieldCheck, 
  ArrowRight, 
  RefreshCcw
} from "lucide-react";

const STEPS = [
  { id: "initiated", label: "تم الإرسال", icon: Send, desc: "تم استلام طلب التحويل" },
  { id: "processing", label: "معالجة الدفع", icon: CreditCard, desc: "يتم تحويل Fiat إلى USDC" },
  { id: "confirmed", label: "تأكيد Blockchain", icon: Link2, desc: "تم التسجيل على Solana" },
  { id: "delivered", label: "تم التسليم", icon: CheckCircle2, desc: "وصل للمستلم بنجاح" },
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

  useEffect(() => {
    try {
      const txs: TxData[] = JSON.parse(localStorage.getItem("nexapay_txs") || "[]");
      const found = txs.find((t) => t.txHash === txId);
      if (found) setTx(found);
    } catch {}
  }, [txId]);

  useEffect(() => {
    if (!tx) return;

    const timer = setInterval(() => {
      setCurrentStep((s) => {
        if (tx.isEscrow && tx.status === "locked") {
          if (s < STEPS.length - 2) return s + 1;
          clearInterval(timer);
          return s;
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
      setCurrentStep(STEPS.length - 1);
    } catch {}
  };

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
        .catch(() => setAiMessage(`رائع! وفّرت $${(parseFloat(tx?.amount || "0") * 0.035 + 4.99).toFixed(2)} مقارنة بـ Western Union.`))
        .finally(() => setLoadingAi(false));
    }
  }, [currentStep, tx]);

  const shortHash = txId ? `${txId.slice(0, 8)}...${txId.slice(-8)}` : "---";
  const explorerUrl = `https://explorer.solana.com/tx/${txId}?cluster=devnet`;
  const isSuccess = currentStep === STEPS.length - 1;

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300" dir="rtl">
      <Header />

      <div className="mx-auto max-w-4xl px-6 py-12 space-y-10">
        
        {/* Status Header - WOW Factor */}
        <div className="relative overflow-hidden rounded-[2.5rem] border border-border bg-card p-10 text-center shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(19,182,1,0.08),transparent_70%)] pointer-events-none" />
          
          <AnimatePresence mode="wait">
            {!isSuccess ? (
              <motion.div
                key="processing"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative z-10"
              >
                <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-primary/10 border border-primary/20">
                  <RefreshCcw size={40} className="text-primary animate-spin" aria-hidden="true" />
                </div>
                <h1 className="text-3xl font-black text-foreground mb-3">
                  {tx?.isEscrow && tx.status === "locked" && currentStep === STEPS.length - 2
                    ? "محجوز في العقد الذكي"
                    : "جاري معالجة التحويل..."}
                </h1>
                {tx && (
                  <p className="text-xl text-muted-foreground font-medium flex items-center justify-center gap-3">
                    <span className="font-bold text-foreground">{tx.amount} {tx.fromCurrency}</span> 
                    <ArrowRight size={18} aria-hidden="true" /> 
                    <span className="font-bold text-foreground">{tx.converted} {tx.toCurrency}</span>
                  </p>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="relative z-10"
              >
                <div className="relative mx-auto mb-8 flex h-32 w-32 items-center justify-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                    className="absolute inset-0 rounded-full bg-primary/20 blur-2xl"
                  />
                  <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-ping" style={{ animationDuration: '3s' }} />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-primary to-emerald-400 shadow-[0_0_50px_rgba(19,182,1,0.6)]">
                    <CheckCircle2 size={48} className="text-black" aria-hidden="true" />
                  </div>
                </div>
                <h1 className="text-4xl font-black text-foreground mb-4 tracking-tight">
                  تم التحويل بنجاح!
                </h1>
                {tx && (
                  <p className="text-2xl text-primary font-bold flex items-center justify-center gap-3">
                    <span>{tx.amount} {tx.fromCurrency}</span> 
                    <ArrowRight size={20} className="text-muted-foreground" aria-hidden="true" /> 
                    <span>{tx.converted} {tx.toCurrency}</span>
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="grid gap-8 md:grid-cols-[1fr_1fr]">
          {/* Progress Timeline */}
          <div className="rounded-[2rem] border border-border bg-card p-8 shadow-lg h-fit">
            <h3 className="mb-8 font-bold text-xl flex items-center gap-2">
              <Zap size={24} className="text-primary fill-primary" aria-hidden="true" /> التتبع اللحظي
            </h3>
            <div className="space-y-8 relative">
              <div className="absolute right-7 top-7 bottom-7 w-0.5 bg-border rounded-full" />
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const isCompleted = i < currentStep;
                const isCurrent = i === currentStep;
                const isPending = i > currentStep;
                
                return (
                  <div key={s.id} className="relative flex items-start gap-5">
                    <div
                      className={`relative z-10 flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-full transition-all duration-500 ${
                        isCompleted
                          ? "bg-primary text-black shadow-[0_0_20px_rgba(19,182,1,0.3)]"
                          : isCurrent
                          ? "bg-primary/20 text-primary border-2 border-primary shadow-[0_0_15px_rgba(19,182,1,0.2)]"
                          : "bg-muted border-2 border-border text-muted-foreground"
                      }`}
                    >
                      <Icon size={24} aria-hidden="true" />
                      {isCurrent && !isSuccess && (
                        <span className="absolute inset-0 animate-ping rounded-full bg-primary/30" />
                      )}
                    </div>
                    
                    <div className="flex-1 pt-2">
                      <div className={`font-bold text-lg ${isPending ? "text-muted-foreground" : "text-foreground"}`}>
                        {s.label}
                      </div>
                      <div className="text-sm text-muted-foreground/80 mt-1">{s.desc}</div>
                      
                      {isCompleted && (
                        <div className="mt-2 text-sm font-semibold text-primary flex items-center gap-1.5">
                          <CheckCircle2 size={16} aria-hidden="true" /> 05:50:02 م
                        </div>
                      )}
                      {isCurrent && !isSuccess && (!tx?.isEscrow || tx.status !== "locked" || i !== STEPS.length - 2) && (
                        <div className="mt-2 text-sm font-semibold text-amber-500 flex items-center gap-2">
                          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-amber-500" />
                          قيد المعالجة...
                        </div>
                      )}
                      {isCurrent && tx?.isEscrow && tx.status === "locked" && i === STEPS.length - 2 && (
                        <div className="mt-2 text-sm font-semibold text-blue-500 flex items-center gap-2">
                          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-500" />
                          بانتظار التحرير
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Details & AI */}
          <div className="space-y-8">
            {tx && (
              <div className="rounded-[2rem] border border-border bg-card p-8 shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                  <ShieldCheck size={160} aria-hidden="true" />
                </div>
                <h3 className="mb-8 font-bold text-xl flex items-center gap-2">
                  <Link2 size={24} className="text-primary" aria-hidden="true" /> تفاصيل المعاملة
                </h3>
                
                <div className="space-y-5 relative z-10">
                  {[
                    { label: "المبلغ المُرسَل", value: `${tx.amount} ${tx.fromCurrency}` },
                    { label: "المبلغ المستلَم", value: `${tx.converted} ${tx.toCurrency}`, highlight: true },
                    { label: "المستلم", value: `${tx.countryFlag} ${tx.recipientPhone}` },
                    { label: "الرسوم", value: "$0.01", highlight: true },
                    { label: "الشبكة", value: "Solana Devnet" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center py-1">
                      <span className="text-muted-foreground font-medium text-base">{item.label}</span>
                      <span className={`font-bold ${item.highlight ? "text-primary text-xl" : "text-foreground text-lg"}`}>
                        {item.value}
                      </span>
                    </div>
                  ))}
                  
                  <div className="mt-8 pt-6 border-t border-dashed border-border">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-muted-foreground font-medium text-base">Transaction Hash</span>
                      <a href={explorerUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex items-center gap-1.5 text-sm font-bold bg-primary/10 px-3 py-1.5 rounded-lg">
                        Solana Explorer <ExternalLink size={16} aria-hidden="true" />
                      </a>
                    </div>
                    <div className="bg-muted p-4 rounded-xl font-mono text-xs text-muted-foreground text-left break-all border border-border/50">
                      {txId}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* AI Analysis */}
            {isSuccess && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[2rem] border border-primary/30 bg-primary/5 p-8 shadow-[0_0_30px_rgba(19,182,1,0.1)] backdrop-blur-md"
              >
                <div className="mb-4 flex items-center gap-2 text-xl font-black text-primary">
                  <Bot size={28} aria-hidden="true" /> تحليل AI
                </div>
                {loadingAi ? (
                  <div className="flex items-center gap-3 text-sm font-medium text-muted-foreground p-4 bg-background rounded-xl border border-primary/10">
                    <RefreshCcw size={18} className="animate-spin text-primary" aria-hidden="true" />
                    يقوم VeloPay AI بتحليل بيانات التحويل...
                  </div>
                ) : (
                  <p className="text-foreground text-base leading-relaxed font-medium p-4 bg-background rounded-xl border border-primary/20 shadow-sm">
                    {aiMessage}
                  </p>
                )}
              </motion.div>
            )}
          </div>
        </div>

        {/* Escrow Details & Action */}
        {tx?.isEscrow && (
          <div className="rounded-[2rem] border-2 border-blue-500/30 bg-blue-500/5 p-8 shadow-lg backdrop-blur-sm">
            <h3 className="mb-6 flex items-center gap-3 font-black text-2xl text-blue-600">
              <ShieldCheck size={32} aria-hidden="true" /> العقد الذكي (Escrow)
            </h3>
            <div className="bg-card p-6 rounded-2xl border border-blue-500/20 mb-8 shadow-sm">
              <span className="flex items-center gap-2 font-bold mb-3 text-base text-blue-600">
                <Link2 size={18} aria-hidden="true" /> شرط التحرير المبرمج:
              </span>
              <p className="text-foreground font-medium text-base leading-relaxed p-4 bg-muted/50 rounded-xl">
                {tx.escrowCondition || "لا يوجد شرط مكتوب"}
              </p>
            </div>
            
            {tx.status === "locked" ? (
              <div className="space-y-6">
                <p className="text-base font-medium text-blue-600/80 bg-blue-500/10 p-4 rounded-xl">
                  المبلغ محتجز حالياً في العقد الذكي بأمان تام. بمجرد استيفاء الشرط، قم بالتحرير.
                </p>
                <button
                  onClick={handleReleaseFunds}
                  className="w-full flex items-center justify-center gap-3 rounded-full bg-blue-600 py-5 text-xl font-bold text-white shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all hover:bg-blue-700 hover:scale-[1.02] active:scale-95"
                >
                  <CheckCircle2 size={24} aria-hidden="true" /> تحرير الأموال الآن
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-3 rounded-2xl bg-primary/10 py-6 text-primary font-bold text-xl border border-primary/20">
                <CheckCircle2 size={28} aria-hidden="true" /> تم تحرير الأموال بنجاح
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-6 pt-6 pb-12">
          <Link
            href="/send"
            className="flex-1 rounded-full border-2 border-border bg-card py-5 text-center text-xl font-bold text-foreground transition-all hover:bg-muted hover:border-muted-foreground/30 active:scale-95 shadow-sm"
          >
            تحويل جديد
          </Link>
          <Link
            href="/dashboard"
            className="flex-1 rounded-full bg-primary py-5 text-center text-xl font-bold text-black shadow-[0_0_30px_rgba(19,182,1,0.25)] transition-all hover:brightness-110 active:scale-95"
          >
            لوحة التحكم
          </Link>
        </div>
      </div>
    </div>
  );
}
