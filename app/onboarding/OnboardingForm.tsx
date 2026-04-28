"use client";

import { useState, useTransition } from "react";
import { completeOnboardingAction } from "@/server-actions/onboarding";
import { CreditCard, Phone, User, Mail, ShieldCheck, ChevronDown, Check } from "lucide-react";

export function OnboardingForm({ user }: { user: { name: string; email: string } }) {
  const [addVisaCard, setAddVisaCard] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("addVisaCard", addVisaCard ? "on" : "off");
    
    startTransition(async () => {
      setError(null);
      const res = await completeOnboardingAction(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {error && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl text-red-600 dark:text-red-400 font-bold text-sm text-center">
          {error}
        </div>
      )}

      {/* Personal Information Section */}
      <div className="space-y-5 bg-muted/30 p-6 rounded-3xl border border-border/50">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <User className="w-5 h-5 text-primary" /> المعلومات الأساسية
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-2 relative">
            <label className="text-sm font-semibold text-muted-foreground ml-1 block">الاسم الكامل</label>
            <div className="relative">
              <input
                type="text"
                name="name"
                defaultValue={user.name}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium"
                required
              />
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
            </div>
          </div>
          <div className="space-y-2 relative">
            <label className="text-sm font-semibold text-muted-foreground ml-1 block">البريد الإلكتروني</label>
            <div className="relative">
              <input
                type="email"
                defaultValue={user.email}
                disabled
                className="w-full rounded-2xl border border-border bg-muted px-4 py-3.5 pl-10 text-muted-foreground cursor-not-allowed opacity-70 font-medium"
              />
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
            </div>
          </div>
        </div>

        <div className="space-y-2 relative">
          <label className="text-sm font-semibold text-muted-foreground ml-1 block">رقم الهاتف (المرتبط بمحفظتك)</label>
          <div className="relative">
            <input
              type="tel"
              name="phoneNumber"
              placeholder="+964 000 0000 000"
              className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-left"
              dir="ltr"
              required
            />
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
          </div>
          <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-2">
            <ShieldCheck className="w-4 h-4 text-green-500" /> نستخدم هذا الرقم لتأمين حسابك ومعاملاتك.
          </p>
        </div>
      </div>

      {/* Payment Information Section */}
      <div className="space-y-5 bg-muted/30 p-6 rounded-3xl border border-border/50">
        <button
          type="button"
          onClick={() => setAddVisaCard(!addVisaCard)}
          className="w-full flex items-center justify-between p-4 rounded-2xl border-2 border-transparent hover:border-primary/20 hover:bg-accent/50 transition-all group focus:outline-none"
        >
          <div className="flex items-center gap-4">
            <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${addVisaCard ? 'bg-primary border-primary text-white' : 'border-muted-foreground/50 bg-background'}`}>
              {addVisaCard && <Check className="w-4 h-4" />}
            </div>
            <div className="text-right">
              <h3 className="text-lg font-bold text-foreground">هل ترغب في إضافة بطاقة بنكية (Visa/Mastercard)؟</h3>
              <p className="text-sm text-muted-foreground">اختياري، يمكنك إضافتها لاحقاً من لوحة التحكم.</p>
            </div>
          </div>
          <CreditCard className={`w-8 h-8 transition-colors ${addVisaCard ? 'text-primary' : 'text-muted-foreground/30 group-hover:text-primary/50'}`} />
        </button>

        <div className={`grid transition-all duration-500 ease-in-out ${addVisaCard ? 'grid-rows-[1fr] opacity-100 mt-4' : 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none'}`}>
          <div className="overflow-hidden">
            <div className="pt-4 space-y-4 border-t border-border">
              <div>
                <label className="text-sm font-semibold text-muted-foreground ml-1 mb-2 block">رقم البطاقة</label>
                <div className="relative">
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 pl-12 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-left font-medium tracking-widest"
                    dir="ltr"
                    required={addVisaCard}
                  />
                  <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold text-muted-foreground ml-1 mb-2 block">تاريخ الانتهاء</label>
                  <input
                    type="text"
                    name="expiryDate"
                    placeholder="MM/YY"
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-center font-medium"
                    dir="ltr"
                    required={addVisaCard}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-muted-foreground ml-1 mb-2 block">رمز الأمان (CVC)</label>
                  <input
                    type="text"
                    name="cvc"
                    placeholder="123"
                    className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 text-center font-medium tracking-widest"
                    dir="ltr"
                    required={addVisaCard}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground ml-1 mb-2 block">اسم حامل البطاقة</label>
                <input
                  type="text"
                  name="cardholderName"
                  placeholder="الاسم كما هو مطبوع على البطاقة"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 font-medium"
                  required={addVisaCard}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground border-none py-4 px-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group mt-8"
      >
        {isPending ? "جاري حفظ البيانات..." : "متابعة إلى لوحة التحكم"}
      </button>
    </form>
  );
}
