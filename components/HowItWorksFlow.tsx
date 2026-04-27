"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CreditCard, ArrowRightLeft, Zap, Smartphone, CheckCircle2 } from "lucide-react";

// ================================
// بيانات المراحل - مرتبة من اليمين (البداية) إلى اليسار
// ================================
const FLOW_STEPS = [
  {
    id: "source",
    title: "البداية",
    desc: "بطاقة بنكية أو محفظة رقمية",
    icon: CreditCard,
    color: "text-blue-400",
    glow: "shadow-blue-500/40",
    bg: "bg-blue-500/10",
  },
  {
    id: "usdc",
    title: "التحويل الذكي",
    desc: "تحويل فوري وآمن إلى USDC",
    icon: ArrowRightLeft,
    color: "text-indigo-400",
    glow: "shadow-indigo-500/40",
    bg: "bg-indigo-500/10",
  },
  {
    id: "solana",
    title: "شبكة Solana",
    desc: "نقل بسرعة الضوء بـ 0.01$",
    icon: Zap,
    color: "text-[#13B601]",
    glow: "shadow-[#13B601]/50",
    bg: "bg-[#13B601]/10",
  },
  {
    id: "destination",
    title: "الوصول",
    desc: "Zain Cash أو حساب بنكي",
    icon: Smartphone,
    color: "text-emerald-400",
    glow: "shadow-emerald-500/40",
    bg: "bg-emerald-500/10",
  },
];

export default function VeloPayFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => {
        if (prev === FLOW_STEPS.length - 1) {
          setIsCompleted(true);
          setTimeout(() => {
            setIsCompleted(false);
            setActiveStep(0);
          }, 3000);
          return prev;
        }
        return prev + 1;
      });
    }, 2500);

    return () => clearInterval(timer);
  }, []);

  return (
    <section id="how" dir="rtl" className="relative overflow-hidden bg-[#050A05] px-6 py-24 text-white">
      {/* تأثيرات خلفية خافتة */}
      <div className="absolute top-0 right-0 h-[300px] w-[300px] bg-[#13B601]/5 blur-[100px]" />
      
      <div className="relative mx-auto max-w-6xl">
        {/* العنوان */}
        <div className="mb-20 text-center">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-black mb-6"
          >
            رحلة أموالك مع <span className="text-[#13B601]">VeloPay</span>
          </motion.h2>
          <p className="text-gray-400 text-lg">بساطة البنوك.. وقوة الـ Blockchain</p>
        </div>

        {/* حاوية الأنيميشن */}
        <div className="relative rounded-3xl border border-white/5 bg-white/[0.02] p-10 md:p-20 backdrop-blur-sm">
          
          {/* 1. الشريط الخلفي الثابت - يمر بمنتصف الأيقونات (40px من الأعلى) */}
          <div className="absolute top-[60px] md:top-[290px] right-[15%] left-[15%] h-[2px] bg-white/5 hidden md:block" />
          
          {/* 2. شريط التقدم النشط - ينمو من اليمين إلى اليسار */}
          <motion.div
            className="absolute top-[60px] md:top-[290px] right-[15%] h-[2px] bg-gradient-to-l from-blue-500 via-[#13B601] to-emerald-500 hidden md:block origin-right"
            initial={{ width: "0%" }}
            animate={{ width: `${(activeStep / (FLOW_STEPS.length - 1)) * 70}%` }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          />

          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start gap-16 md:gap-0">
            {FLOW_STEPS.map((step, index) => {
              const isActive = index === activeStep;
              const isPast = index < activeStep;
              const Icon = step.icon;

              return (
                <div key={step.id} className="relative flex flex-col items-center w-full md:w-1/4">
                  {/* أيقونة المرحلة */}
                  <motion.div
                    className={`relative z-20 flex h-20 w-20 items-center justify-center rounded-2xl border transition-all duration-500 
                      ${isActive || isPast ? "border-white/20 " + step.bg : "border-white/5 bg-[#0a0f0a]"}
                      ${isActive ? "scale-125 " + step.glow : "scale-100"}
                    `}
                  >
                    <Icon className={`h-8 w-8 ${isActive || isPast ? step.color : "text-gray-700"}`} />
                    
                    {/* نبض للمرحلة النشطة */}
                    {isActive && (
                      <motion.div
                        className="absolute inset-0 rounded-2xl border border-[#13B601]/30"
                        animate={{ scale: [1, 1.4, 1], opacity: [1, 0, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      />
                    )}
                  </motion.div>

                  {/* النصوص - تم وضعها بالأسفل لمنع التداخل */}
                  <div className="mt-8 text-center">
                    <h3 className={`text-xl font-bold mb-2 transition-colors ${isActive || isPast ? "text-white" : "text-gray-600"}`}>
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 max-w-[150px] leading-relaxed">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* بطاقة الحالة التفاعلية بالأسفل */}
          <div className="mt-20 flex justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep + (isCompleted ? "done" : "loading")}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center gap-4 rounded-2xl bg-black/40 border border-white/10 px-8 py-4 backdrop-blur-md shadow-xl"
              >
                {isCompleted ? (
                  <>
                    <div className="h-10 w-10 rounded-full bg-emerald-500/20 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-emerald-400" />
                    </div>
                    <div>
                      <p className="font-bold text-white">وصلت الدفعة!</p>
                      <p className="text-xs text-emerald-400/70 uppercase tracking-widest">Transaction Confirmed</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex gap-1.5">
                      <div className="h-2 w-2 rounded-full bg-[#13B601] animate-bounce [animation-delay:-0.3s]" />
                      <div className="h-2 w-2 rounded-full bg-[#13B601] animate-bounce [animation-delay:-0.15s]" />
                      <div className="h-2 w-2 rounded-full bg-[#13B601] animate-bounce" />
                    </div>
                    <div className="mr-4 text-right">
                      <p className="text-sm font-medium text-gray-300">
                        {activeStep === 0 && "يتم الآن معالجة مصدر الدفع..."}
                        {activeStep === 1 && "تحويل العملة إلى USDC المستقر..."}
                        {activeStep === 2 && "تأكيد المعاملة عبر Solana Network..."}
                        {activeStep === 3 && "إرسال الرصيد إلى المحفظة النهائية..."}
                      </p>
                    </div>
                  </>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}