"use client";

import { useState, useEffect } from "react";

interface PremiumModalProps {
  open: boolean;
  onClose: () => void;
}

const PREMIUM_KEY = "velopay_premium_status";

const FEATURES = [
  {
    icon: "∞",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    title: "تحويلات غير محدودة",
    free: "3 تحويلات / شهر",
    premium: "تحويلات بلا حدود",
    badge: "الأكثر طلباً",
    badgeColor: "bg-violet-100 text-violet-600",
  },
  {
    icon: "📈",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    title: "مبالغ غير محدودة",
    free: "حتى $5,000 فقط",
    premium: "أي مبلغ تريده",
    badge: null,
    badgeColor: "",
  },
  {
    icon: "🪙",
    iconBg: "bg-yellow-100",
    iconColor: "text-yellow-600",
    title: "عائد الرصيد (Yield API)",
    free: "غير متاح",
    premium: "ربح على رصيدك المحفوظ",
    badge: "جديد",
    badgeColor: "bg-yellow-100 text-yellow-600",
  },
  {
    icon: "⏰",
    iconBg: "bg-green-100",
    iconColor: "text-green-600",
    title: "أتمتة مدفوعة",
    free: "غير متاح",
    premium: "جدولة تحويلات تلقائية",
    badge: null,
    badgeColor: "",
  },
  {
    icon: "🔔",
    iconBg: "bg-orange-100",
    iconColor: "text-orange-600",
    title: "تنبيه سعر الصرف",
    free: "غير متاح",
    premium: "تنبيهات ذكية بأفضل الأسعار",
    badge: null,
    badgeColor: "",
  },
  {
    icon: "📊",
    iconBg: "bg-pink-100",
    iconColor: "text-pink-600",
    title: "AI Dashboard Analysis",
    free: "غير متاح",
    premium: "تحليل ذكي لنفقاتك وتحويلاتك",
    badge: "AI مدعوم",
    badgeColor: "bg-pink-100 text-pink-600",
  },
];

export function PremiumModal({ open, onClose }: PremiumModalProps) {
  const [plan, setPlan] = useState<"monthly" | "yearly">("monthly");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  // Check if already subscribed
  useEffect(() => {
    const status = localStorage.getItem(PREMIUM_KEY);
    if (status === "active") setSubscribed(true);
  }, []);

  const handleSubscribe = async () => {
    setSubscribing(true);
    // Simulate payment processing
    await new Promise((r) => setTimeout(r, 2500));
    setSubscribing(false);
    setSubscribed(true);
    localStorage.setItem(PREMIUM_KEY, "active");
  };

  if (!open) return null;

  const monthlyPrice = 9.99;
  const yearlyPrice = 79.99;
  const yearlyMonthly = (yearlyPrice / 12).toFixed(2);
  const yearlySavings = (
    ((monthlyPrice * 12 - yearlyPrice) / (monthlyPrice * 12)) *
    100
  ).toFixed(0);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
      dir="rtl"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-3xl bg-white shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 z-10 rounded-t-3xl bg-gradient-to-l from-[#0fa301] to-[#13B601] p-6 text-white">
          <button
            onClick={onClose}
            className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-white hover:bg-white/30 transition"
          >
            ✕
          </button>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-lg">
              ⭐
            </div>
            <div>
              <h2 className="text-xl font-black">VeloPay Premium</h2>
              <p className="text-sm text-green-100">افتح الإمكانيات الكاملة</p>
            </div>
          </div>

          {subscribed ? (
            <div className="rounded-xl bg-white/20 p-3 text-center text-sm font-semibold">
              ✅ أنت مشترك في Premium! استمتع بجميع الميزات.
            </div>
          ) : (
            /* Pricing toggle */
            <div className="rounded-2xl bg-white/10 p-1 flex gap-1">
              <button
                onClick={() => setPlan("monthly")}
                className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
                  plan === "monthly" ? "bg-white text-[#13B601]" : "text-white/80"
                }`}
              >
                شهري
              </button>
              <button
                onClick={() => setPlan("yearly")}
                className={`flex-1 rounded-xl py-2 text-sm font-semibold transition ${
                  plan === "yearly" ? "bg-white text-[#13B601]" : "text-white/80"
                }`}
              >
                سنوي{" "}
                <span className="text-xs opacity-80">وفّر {yearlySavings}%</span>
              </button>
            </div>
          )}
        </div>

        <div className="p-6 space-y-5">
          {/* Price display */}
          {!subscribed && (
            <div className="text-center">
              <div className="text-4xl font-black text-gray-900">
                ${plan === "monthly" ? monthlyPrice : yearlyMonthly}
                <span className="text-lg font-normal text-gray-400"> / شهر</span>
              </div>
              {plan === "yearly" && (
                <div className="mt-1 text-sm text-gray-500">
                  يُدفع سنوياً ${yearlyPrice} — توفير $
                  {(monthlyPrice * 12 - yearlyPrice).toFixed(2)}
                </div>
              )}
            </div>
          )}

          {/* Features list */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
              ما تحصل عليه
            </h3>
            {FEATURES.map((f) => (
              <div
                key={f.title}
                className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50/50 p-4 transition hover:border-[#13B601]/20 hover:bg-[#13B601]/5"
              >
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl ${f.iconBg} text-lg`}
                >
                  {f.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-900 text-sm">
                      {f.title}
                    </span>
                    {f.badge && (
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${f.badgeColor}`}
                      >
                        {f.badge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-red-400 line-through">{f.free}</span>
                    <span className="text-gray-300">→</span>
                    <span className="text-[#13B601] font-medium">{f.premium}</span>
                  </div>
                </div>
                <div
                  className={`flex-shrink-0 h-5 w-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    subscribed
                      ? "bg-[#13B601] text-white"
                      : "bg-gray-200 text-gray-400"
                  }`}
                >
                  {subscribed ? "✓" : "★"}
                </div>
              </div>
            ))}
          </div>

          {/* Subscribe / Success */}
          {subscribed ? (
            <div className="rounded-2xl border border-[#13B601]/20 bg-[#13B601]/5 p-5 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <p className="font-bold text-[#13B601] text-lg">
                مرحباً بك في Premium!
              </p>
              <p className="text-sm text-gray-500 mt-1">
                جميع الميزات مفعّلة الآن. استمتع بتجربة VeloPay الكاملة.
              </p>
              <button
                onClick={onClose}
                className="mt-4 rounded-full bg-[#13B601] px-8 py-3 font-bold text-white transition hover:bg-[#0fa301]"
              >
                ابدأ الاستخدام →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <button
                onClick={handleSubscribe}
                disabled={subscribing}
                className="w-full rounded-full bg-[#13B601] py-4 text-lg font-black text-white transition hover:bg-[#0fa301] disabled:opacity-70 active:scale-95 shadow-lg shadow-[#13B601]/30"
              >
                {subscribing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                    جاري تفعيل الاشتراك...
                  </span>
                ) : (
                  `اشترك الآن — $${plan === "monthly" ? monthlyPrice : yearlyPrice} / ${
                    plan === "monthly" ? "شهر" : "سنة"
                  }`
                )}
              </button>
              <p className="text-center text-xs text-gray-400">
                🔒 محاكاة آمنة — لا بيانات بنكية حقيقية مطلوبة في هذا الـ MVP
              </p>
              <p className="text-center text-xs text-gray-400">
                يمكن إلغاء الاشتراك في أي وقت • بدون التزامات
              </p>
            </div>
          )}

          {/* Revenue model note */}
          <div className="rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
            <p className="text-xs text-gray-500 leading-relaxed text-center">
              <strong className="text-gray-700">نموذج الإيرادات:</strong> نستخدم نموذج تسعير
              نفسي — نعرض $3 رسوم على تحويل 100 دينار، بينما تكلفتنا الفعلية $1 فقط. الربح
              الصافي: $2 لكل معاملة + اشتراكات Premium.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PremiumModal;

// Hook to check premium status
export function usePremiumStatus() {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    const status = localStorage.getItem(PREMIUM_KEY);
    setIsPremium(status === "active");
  }, []);

  return isPremium;
}
