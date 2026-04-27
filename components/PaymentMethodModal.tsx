"use client";

import { Dialog, DialogContent, DialogTitle, DialogClose } from "@/components/common/Dialog";
import { useRouter } from "next/navigation";
import { Zap, Handshake, ArrowLeft } from "lucide-react";

interface PaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
}

export function PaymentMethodModal({ open, onClose }: PaymentMethodModalProps) {
  const router = useRouter();

  const handleDirectPay = () => {
    onClose();
    router.push("/send");
  };

  const handleConditionalPay = () => {
    onClose();
    router.push("/escrow");
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md rounded-[2.5rem] p-8 bg-background border-border shadow-2xl" dir="rtl">
        <DialogClose className="left-6 top-6 right-auto" />
        
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <Zap className="text-primary w-8 h-8" />
          </div>
          <DialogTitle className="text-2xl font-black text-foreground">
            كيف ترغب في الإرسال؟
          </DialogTitle>
          <p className="text-muted-foreground mt-2 text-sm">
            اختر نوع التحويل الذي يناسب احتياجك
          </p>
        </div>

        <div className="flex flex-col gap-4">
          {/* Direct Pay Option */}
          <button
            onClick={handleDirectPay}
            className="group relative overflow-hidden w-full rounded-3xl border-2 border-primary bg-primary p-6 text-right transition-all hover:shadow-lg hover:shadow-primary/20 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="bg-white/20 p-3 rounded-2xl">
                <Zap className="text-white w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="text-xl font-bold text-white flex items-center gap-2">
                  تحويل مباشر
                  <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded-full">سريع جداً</span>
                </div>
                <p className="text-white/80 text-sm mt-1">يصل المال فوراً للمستلم خلال ثوانٍ</p>
              </div>
              <ArrowLeft className="text-white/50 w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </div>
            {/* Subtle background glow */}
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-32 h-32 bg-white/10 rounded-full blur-3xl transition-opacity group-hover:opacity-100 opacity-0" />
          </button>

          {/* Escrow Option */}
          <button
            onClick={handleConditionalPay}
            className="group relative overflow-hidden w-full rounded-3xl border-2 border-border bg-card p-6 text-right transition-all hover:border-primary/50 hover:bg-primary/5 active:scale-[0.98]"
          >
            <div className="flex items-center gap-4 relative z-10">
              <div className="bg-primary/10 p-3 rounded-2xl">
                <Handshake className="text-primary w-6 h-6" />
              </div>
              <div className="flex-1">
                <div className="text-xl font-bold text-foreground">تحويل مشروط (Escrow)</div>
                <p className="text-muted-foreground text-sm mt-1">يُحجز المبلغ حتى تؤكد أنت استلام الخدمة</p>
              </div>
              <ArrowLeft className="text-muted-foreground/50 w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </div>
          </button>
        </div>

        <p className="text-center text-[10px] text-muted-foreground mt-8 uppercase tracking-widest font-bold">
          VeloPay Secure Transaction System
        </p>
      </DialogContent>
    </Dialog>
  );
}
