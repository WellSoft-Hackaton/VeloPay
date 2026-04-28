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
  HelpCircle
} from "lucide-react";
import { signOut } from "next-auth/react";

interface SidebarProps {
  onTransactionsClick?: () => void;
  onSettingsClick?: () => void;
}

export function Sidebar({ onTransactionsClick, onSettingsClick }: SidebarProps = {}) {
  const pathname = usePathname();
  const [isHelpOpen, setIsHelpOpen] = useState(false);

  const navigation = [
    { name: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
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
        <button 
          onClick={() => signOut()}
          className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10"
        >
          <LogOut size={20} />
          تسجيل الخروج
        </button>
      </nav>

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
