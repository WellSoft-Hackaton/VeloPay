"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function ConditionalPayPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f5f5f5]" dir="rtl">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white px-6 shadow-sm flex items-center h-16">
        <div className="mx-auto flex w-full max-w-2xl items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/VeloPay.png" alt="VeloPay Logo" className="h-22 -my-8 object-contain" />
          </Link>
          <span className="text-sm font-semibold text-[#13B601]">
            الدفع المشروط
          </span>
        </div>
      </div>

      <div className="mx-auto max-w-2xl px-6 py-12">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition"
        >
          <ArrowRight className="h-4 w-4" /> رجوع
        </button>

        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-lg text-center">
          <div className="mb-6 flex justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#13B601]/10 text-4xl">
              🤝
            </div>
          </div>
          <h1 className="mb-4 text-3xl font-black text-gray-900">الدفع المشروط</h1>
          <p className="mb-8 text-lg text-gray-500">
            هذه الميزة تتيح لك إرسال الأموال بشرط محدد. سيتم الاحتفاظ بالمبلغ ولن يتم تحريره للمستلم إلا عند تحقق الشرط.
          </p>

          <div className="rounded-xl bg-blue-50 p-6 text-right mb-8 border border-blue-100">
            <h3 className="font-bold text-blue-900 mb-2 flex items-center gap-2">
              <span className="text-xl">ℹ️</span> كيف تعمل؟
            </h3>
            <ul className="list-disc list-inside text-sm text-blue-800 space-y-2">
              <li>تحدد المبلغ والمستلم.</li>
              <li>تضع شرطاً (مثال: استلام وثيقة، إنجاز مهمة).</li>
              <li>يبقى المبلغ في عقد ذكي آمن (Smart Contract).</li>
              <li>يتحرر المبلغ تلقائياً عند التأكيد.</li>
            </ul>
          </div>

          <button
            onClick={() => alert("قريباً! هذه الميزة قيد التطوير.")}
            className="w-full rounded-full bg-[#13B601] py-4 text-lg font-bold text-white shadow-lg shadow-[#13B601]/25 transition hover:bg-[#0fa301] active:scale-95"
          >
            إعداد الدفع المشروط الآن
          </button>
        </div>
      </div>
    </div>
  );
}
