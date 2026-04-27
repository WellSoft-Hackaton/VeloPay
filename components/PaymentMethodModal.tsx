"use client";

import { Dialog, DialogContent, DialogTitle } from "@/components/common/Dialog";
import { useRouter } from "next/navigation";

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
      <DialogContent className="sm:max-w-md rounded-3xl p-6" dir="rtl">
        <DialogTitle className="text-center text-2xl font-black text-gray-900 mb-6">
          اختر طريقة الدفع
        </DialogTitle>
        <div className="flex flex-col gap-4">
          <button
            onClick={handleDirectPay}
            className="w-full rounded-2xl bg-[#13B601] py-4 text-lg font-bold text-white shadow-lg shadow-[#13B601]/25 transition hover:bg-[#0fa301] active:scale-95"
          >
            دفع مباشر
          </button>
          <button
            onClick={handleConditionalPay}
            className="w-full rounded-2xl border-2 border-[#13B601] bg-white py-4 text-lg font-bold text-[#13B601] transition hover:bg-[#13B601]/5 active:scale-95"
          >
            دفع مشروط
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
