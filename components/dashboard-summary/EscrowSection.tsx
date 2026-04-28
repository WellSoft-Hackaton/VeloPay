"use client";

import { useState } from "react";
import { Plus, CheckCircle, Clock, ShieldCheck } from "lucide-react";
import Link from "next/link";

const staticSentEscrows = [
  { id: "ESC-1001", amount: "$500", to: "+1234567890", condition: "وصول البضاعة", status: "locked", date: "اليوم" },
  { id: "ESC-1002", amount: "$1,200", to: "+0987654321", condition: "إتمام العمل", status: "released", date: "أمس" },
];

const staticReceivedEscrows = [
  { id: "ESC-2001", amount: "$300", from: "+1122334455", condition: "تسليم المشروع", status: "locked", date: "25 أبريل" },
];

export function EscrowSection() {
  const [tab, setTab] = useState<"sent" | "received">("sent");
  const [sentEscrows, setSentEscrows] = useState(staticSentEscrows);
  const receivedEscrows = staticReceivedEscrows;

  const handleRelease = (id: string) => {
    setSentEscrows(prev => prev.map(escrow => 
      escrow.id === id ? { ...escrow, status: "released" } : escrow
    ));
  };

  return (
    <div className="mb-12">
      <div className="mb-6 flex justify-between items-center">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="text-primary" size={24} />
          معاملات الضمان (Escrow)
        </h3>
        <Link 
          href="/send?escrow=true" 
          className="flex items-center gap-2 text-sm font-bold bg-primary/10 text-primary px-4 py-2 rounded-full hover:bg-primary/20 transition-colors"
        >
          <Plus size={16} />
          ضمان جديد
        </Link>
      </div>

      <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden p-6">
        <div className="flex gap-4 mb-6 border-b border-border pb-4">
          <button 
            onClick={() => setTab("sent")}
            className={`text-sm font-bold px-6 py-2.5 rounded-full transition-all ${tab === "sent" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-accent"}`}
          >
            المرسلة
          </button>
          <button 
            onClick={() => setTab("received")}
            className={`text-sm font-bold px-6 py-2.5 rounded-full transition-all ${tab === "received" ? "bg-primary text-primary-foreground shadow-md" : "text-muted-foreground hover:bg-accent"}`}
          >
            المستلمة
          </button>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {tab === "sent" && sentEscrows.map(escrow => (
            <div key={escrow.id} className="border border-border rounded-3xl p-6 flex flex-col justify-between hover:border-primary/50 transition-colors bg-background/50">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">{escrow.id}</span>
                  <h4 className="text-2xl font-bold text-foreground mt-3">{escrow.amount}</h4>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${escrow.status === 'locked' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' : 'bg-green-500/10 text-green-600 dark:text-green-400'}`}>
                  {escrow.status === 'locked' ? <Clock size={14} /> : <CheckCircle size={14} />}
                  {escrow.status === 'locked' ? 'قيد الانتظار' : 'مكتمل'}
                </div>
              </div>
              <div className="space-y-3 mb-8 bg-card rounded-2xl p-4 border border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">إلى:</span>
                  <span className="font-bold text-foreground">{escrow.to}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الشرط:</span>
                  <span className="font-bold text-foreground">{escrow.condition}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">التاريخ:</span>
                  <span className="font-bold text-foreground">{escrow.date}</span>
                </div>
              </div>
              {escrow.status === 'locked' ? (
                <button 
                  onClick={() => handleRelease(escrow.id)}
                  className="w-full py-3 bg-primary/10 text-primary font-bold rounded-xl hover:bg-primary hover:text-primary-foreground transition-all active:scale-[0.98]"
                >
                  تحرير المبلغ
                </button>
              ) : (
                <button disabled className="w-full py-3 bg-muted/50 text-muted-foreground font-bold rounded-xl cursor-not-allowed">
                  تم التحرير بنجاح
                </button>
              )}
            </div>
          ))}

          {tab === "received" && receivedEscrows.map(escrow => (
             <div key={escrow.id} className="border border-border rounded-3xl p-6 flex flex-col justify-between hover:border-primary/50 transition-colors bg-background/50">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <span className="text-xs font-bold text-muted-foreground bg-muted px-2 py-1 rounded-md">{escrow.id}</span>
                  <h4 className="text-2xl font-bold text-foreground mt-3">{escrow.amount}</h4>
                </div>
                <div className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 ${escrow.status === 'locked' ? 'bg-yellow-500/10 text-yellow-600 dark:text-yellow-400' : 'bg-green-500/10 text-green-600 dark:text-green-400'}`}>
                  {escrow.status === 'locked' ? <Clock size={14} /> : <CheckCircle size={14} />}
                  {escrow.status === 'locked' ? 'قيد الانتظار' : 'مكتمل'}
                </div>
              </div>
              <div className="space-y-3 mb-8 bg-card rounded-2xl p-4 border border-border/50">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">من:</span>
                  <span className="font-bold text-foreground">{escrow.from}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">الشرط:</span>
                  <span className="font-bold text-foreground">{escrow.condition}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">التاريخ:</span>
                  <span className="font-bold text-foreground">{escrow.date}</span>
                </div>
              </div>
              {escrow.status === 'locked' ? (
                <div className="w-full py-3 text-center text-sm font-bold text-muted-foreground border-2 border-border border-dashed rounded-xl bg-card">
                  في انتظار تحرير المرسل
                </div>
              ) : (
                <button disabled className="w-full py-3 bg-green-500/10 text-green-600 font-bold rounded-xl cursor-not-allowed">
                  تم الاستلام بنجاح
                </button>
              )}
            </div>
          ))}

          {tab === "sent" && sentEscrows.length === 0 && (
            <div className="col-span-2 text-center py-16 flex flex-col items-center justify-center">
              <ShieldCheck size={48} className="text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">لا توجد معاملات ضمان مرسلة</p>
            </div>
          )}
          {tab === "received" && receivedEscrows.length === 0 && (
            <div className="col-span-2 text-center py-16 flex flex-col items-center justify-center">
              <ShieldCheck size={48} className="text-muted-foreground/30 mb-4" />
              <p className="text-muted-foreground font-medium">لا توجد معاملات ضمان مستلمة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
