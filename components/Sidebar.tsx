"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Settings, 
  History, 
  Wallet,
  LogOut,
  HelpCircle
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const navigation = [
    { name: "لوحة التحكم", href: "/dashboard", icon: LayoutDashboard },
    { name: "المعاملات السابقة", href: "/transactions", icon: History },
    { name: "المحفظة", href: "/wallet", icon: Wallet },
    { name: "الإعدادات", href: "/settings", icon: Settings },
    { name: "المساعدة", href: "/help", icon: HelpCircle },
  ];

  return (
    <aside className="hidden w-64 flex-col border-l border-border bg-card/50 px-4 py-6 sm:flex">
      <nav className="flex flex-1 flex-col gap-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
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
      </nav>

      <div className="mt-auto border-t border-border pt-4">
        <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-red-500 transition-colors hover:bg-red-500/10">
          <LogOut size={20} />
          تسجيل الخروج
        </button>
      </div>
    </aside>
  );
}
