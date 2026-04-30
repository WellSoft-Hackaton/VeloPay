"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/common/Dialog";
import { 
  LayoutDashboard, 
  Settings, 
  History, 
  LogOut,
  HelpCircle,
  Star,
  CheckCircle2,
  Crown,
  TrendingUp
} from "lucide-react";
import { signOut } from "next-auth/react";
import { PremiumModal, usePremiumStatus } from "@/components/PremiumModal";

interface SidebarProps {
  onTransactionsClick?: () => void;
  onSettingsClick?: () => void;
}

export function Sidebar({ onTransactionsClick, onSettingsClick }: SidebarProps = {}) {
  const pathname = usePathname();
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const isPremium = usePremiumStatus();

  const navigation = [
    { name: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
    { name: "الاستثمارات", href: "/investments", icon: TrendingUp },
    { name: "المعاملات السابقة", href: "/transactions", icon: History },
    { name: "الإعدادات", href: "/settings", icon: Settings },
    { name: "المساعدة", href: "/help", icon: HelpCircle },
  ];

  return (
    <aside className="hidden w-64 flex-col border-l border-border bg-card/50 px-4 py-6 sm:flex">
      <nav className="flex flex-1 flex-col gap-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          if (item.name === "المساعدة") {
            return (
              <button
                key={item.name}
                onClick={() => setIsHelpOpen(true)}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </button>
            );
          }

          if (item.name === "المعاملات السابقة" && onTransactionsClick) {
            return (
              <button
                key={item.name}
                onClick={onTransactionsClick}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </button>
            );
          }

          if (item.name === "الإعدادات" && onSettingsClick) {
            return (
              <button
                key={item.name}
                onClick={onSettingsClick}
                className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                }`}
              >
                <item.icon size={20} />
                {item.name}
              </button>
            );
          }

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              <item.icon size={20} />
              {item.name}
            </Link>
          );
        })}

        {/* ─── Premium CTA Card ──────────────────────────────────────────────── */}
        <div className="my-3">
          {isPremium ? (
            /* Already subscribed — elegant subtle badge */
            <button
              onClick={() => setIsPremiumModalOpen(true)}
              className="flex w-full items-center gap-3 rounded-2xl border border-amber-600/20 bg-amber-50/50 dark:bg-amber-900/10 px-4 py-3.5 transition-all hover:bg-amber-50 dark:hover:bg-amber-900/20"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-800/30">
                <CheckCircle2 size={16} className="text-amber-700 dark:text-amber-400" />
              </div>
              <div className="flex-1 text-right">
                <span className="text-sm font-bold text-amber-800 dark:text-amber-300">Premium مفعّل</span>
              </div>
              <Crown size={14} className="text-amber-600/50 dark:text-amber-500/50" />
            </button>
          ) : (
            /* Not subscribed — eye-catching upsell card */
            <button
              onClick={() => setIsPremiumModalOpen(true)}
              className="group relative flex w-full flex-col items-center gap-3 overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: "linear-gradient(135deg, #92711a 0%, #b8960b 40%, #d4af37 70%, #b8960b 100%)",
              }}
            >
              {/* Shimmer overlay */}
              <div 
                className="absolute inset-0 animate-premium-shimmer opacity-30"
                style={{
                  background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)",
                  backgroundSize: "200% 100%",
                }}
              />
              
              {/* Content */}
              <div className="relative z-10 flex w-full items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                  <Star size={18} className="text-white" fill="currentColor" />
                </div>
                <div className="flex-1 text-right">
                  <div className="text-sm font-black text-white">VeloPay Premium</div>
                  <div className="text-[11px] font-medium text-white/70">افتح الإمكانيات الكاملة</div>
                </div>
              </div>

              <div className="relative z-10 w-full rounded-xl bg-white/20 backdrop-blur-sm py-2 text-center text-xs font-bold text-white transition-all group-hover:bg-white/30">
                اشترك الآن
              </div>
            </button>
          )}
        </div>

        <button 
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
        >
          <LogOut size={20} />
          تسجيل الخروج
        </button>
      </nav>

      {/* Premium Modal */}
      <PremiumModal open={isPremiumModalOpen} onClose={() => setIsPremiumModalOpen(false)} />

      {/* Help Modal */}
      <Dialog open={isHelpOpen} onOpenChange={setIsHelpOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground">المساعدة: كيف يعمل VeloPay؟</DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              دليل سريع يوضح لك كيفية استخدام المنصة لإرسال واستقبال الأموال.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4 text-sm text-foreground">
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">1</div>
              <div>
                <p className="font-bold mb-1">إضافة الأموال</p>
                <p className="text-muted-foreground leading-relaxed">قم بإيداع الأموال في محفظتك باستخدام بطاقتك البنكية بأمان تام.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">2</div>
              <div>
                <p className="font-bold mb-1">إرسال الأموال</p>
                <p className="text-muted-foreground leading-relaxed">اختر المستلم وأدخل المبلغ المراد إرساله بكل سهولة من لوحة التحكم.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/20 text-primary font-bold">3</div>
              <div>
                <p className="font-bold mb-1">وصول فوري</p>
                <p className="text-muted-foreground leading-relaxed">بفضل تقنية بلوكتشين <span className="font-semibold text-primary">سولانا (Solana)</span>، تصل الأموال إلى المستلم في ثوانٍ معدودة وبرسوم شبه معدومة.</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </aside>
  );
}
