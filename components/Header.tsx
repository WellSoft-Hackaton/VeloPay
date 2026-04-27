"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useCrossmintAuth } from "@crossmint/client-sdk-react-ui";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Bell, Star } from "lucide-react";
import { PaymentMethodModal } from "@/components/PaymentMethodModal";

// ─── Notification Bell (extracted for reuse) ───────────────────────────────────
function NotificationBell() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border text-muted-foreground transition hover:border-primary/50 hover:text-foreground"
      >
        <Bell size={18} aria-hidden="true" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-11 z-40 w-72 rounded-2xl border border-border bg-card p-1 shadow-2xl">
            <div className="px-3 py-2 text-xs font-bold text-muted-foreground">الإشعارات</div>
            <div className="px-3 py-4 text-center text-sm text-muted-foreground">لا توجد إشعارات حالياً</div>
          </div>
        </>
      )}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const { user, login, logout, status } = useCrossmintAuth();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <img src="/VeloPay.png" alt="VeloPay Logo" className="h-14 object-contain" />
        </Link>

        {/* Desktop Navigation / Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Notification bell */}
          <NotificationBell />

          {/* Developer link */}
          <Link
            href="/developer"
            className="hidden items-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-medium text-muted-foreground transition hover:border-primary/50 hover:text-foreground sm:flex"
          >
            <span className="text-[10px]">{"</>"}</span>
            Developer
          </Link>

          {/* Premium */}
          <button
            className="hidden items-center gap-1.5 rounded-full border border-primary/40 px-4 py-2 text-xs font-semibold text-primary transition hover:bg-primary/10 sm:flex"
          >
            <Star size={18} style={{ marginRight: 6 }} aria-hidden="true" />
            Premium
          </button>

          {/* Dashboard Link */}
          <Link
            href="/dashboard"
            className={`hidden text-sm font-medium transition hover:text-foreground sm:block ${
              pathname === "/dashboard" ? "text-primary" : "text-muted-foreground"
            }`}
          >
            الحساب
          </Link>

          {/* CTA */}
          <button
            onClick={() => setShowPaymentModal(true)}
            className="rounded-full bg-primary px-5 py-2 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition hover:bg-primary/90 active:scale-95"
          >
            أرسل الآن
          </button>

          {/* Auth / Login (Arabic, RTL-aware) */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-2 flex-row-reverse" dir="rtl">
                <div className="text-sm font-medium text-foreground">{user.name || user.email}</div>
                {user.image ? (
                  <Image
                    src={user.image}
                    alt={user.name || user.email}
                    width={36}
                    height={36}
                    className="rounded-full object-cover"
                    unoptimized
                  />
                ) : (
                  <div className="h-9 w-9 rounded-full border border-border bg-card flex items-center justify-center text-sm text-muted-foreground">
                    {user.name ? user.name.charAt(0) : (user.email || "?").charAt(0)}
                  </div>
                )}
                <button
                  onClick={logout}
                  className="hidden text-xs text-muted-foreground hover:text-foreground sm:inline"
                >
                  تسجيل الخروج
                </button>
              </div>
            ) : (
              <button
                onClick={() => login?.()}
                className="rounded-full border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-accent"
                dir="rtl"
              >
                تسجيل الدخول
              </button>
            )}
          </div>
        </div>
      </div>
      
      <PaymentMethodModal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
    </header>
  );
}
