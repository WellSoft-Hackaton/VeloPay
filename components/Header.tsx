"use client";

import Link from "next/link";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSession, signOut } from "next-auth/react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Bell, LogOut, User, Send, LayoutDashboard, Code, Home, Menu, X, Star, Crown, CheckCircle2 } from "lucide-react";
import { PaymentMethodModal } from "@/components/PaymentMethodModal";
import { PremiumModal, usePremiumStatus } from "@/components/PremiumModal";

// ─── Notification Bell ──────────────────────────────────────────────────────────
function NotificationBell() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative flex h-10 w-10 items-center justify-center rounded-full bg-secondary/40 text-secondary-foreground transition-all hover:bg-secondary/80 hover:text-primary active:scale-95"
        aria-label="الإشعارات"
      >
        <Bell size={20} aria-hidden="true" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 sm:left-auto sm:right-0 top-14 z-40 w-80 rounded-3xl border border-border/50 bg-background/95 backdrop-blur-xl p-3 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 origin-top-left sm:origin-top-right animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/50 pb-3 mb-2">
              <span className="text-sm font-bold text-foreground">الإشعارات</span>
              <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full">0 جديد</span>
            </div>
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="rounded-full bg-secondary/50 p-4 mb-4">
                <Bell size={28} className="text-muted-foreground/50" />
              </div>
              <div className="text-base font-bold text-foreground">لا توجد إشعارات حالياً</div>
              <div className="text-xs font-medium text-muted-foreground mt-2">سنخبرك عندما يكون هناك شيء جديد</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function Header() {
  const pathname = usePathname();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showPremiumModal, setShowPremiumModal] = useState(false);
  const { data: session } = useSession();
  const user = session?.user;
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isPremium = usePremiumStatus();

  // Prevent scrolling when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  return (
    <>
      <header
        className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-2xl shadow-sm transition-all duration-300"
        dir="rtl"
      >
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 lg:gap-16 px-4 sm:px-6 lg:px-8">

          {/* Right side - Logo & Main Nav */}
          <div className="flex items-center gap-4 md:gap-12">
            {/* Hamburger Button for Mobile */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 -mr-2 text-foreground/80 hover:text-foreground focus:outline-none transition-colors"
              aria-label="القائمة"
            >
              <Menu size={24} />
            </button>

            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/VeloPay.png" alt="شعار فيلوباي" className="h-27 object-contain -my-6" />
            </Link>

            {/* Primary Navigation Tabs with generous spacing */}
            <nav className="hidden md:flex items-center gap-12 lg:gap-20">
              <Link
                href="/"
                className={`relative flex items-center whitespace-nowrap gap-2 py-2 text-[15px] font-bold transition-all duration-200 ${pathname === "/"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Home size={18} />
                الرئيسية
                {pathname === "/" && (
                  <span className="absolute -bottom-[26px] left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(var(--primary),0.5)]" />
                )}
              </Link>
              <Link
                href="/dashboard"
                className={`relative flex items-center whitespace-nowrap gap-2 py-2 text-[15px] font-bold transition-all duration-200 ${pathname === "/dashboard"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <LayoutDashboard size={18} />
                لوحة التحكم
                {pathname === "/dashboard" && (
                  <span className="absolute -bottom-[26px] left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(var(--primary),0.5)]" />
                )}
              </Link>
              <Link
                href="/developer"
                className={`relative flex items-center whitespace-nowrap gap-2 py-2 text-[15px] font-bold transition-all duration-200 ${pathname === "/developer"
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                  }`}
              >
                <Code size={18} />
                للمطورين
                {pathname === "/developer" && (
                  <span className="absolute -bottom-[26px] left-0 right-0 h-[3px] bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(var(--primary),0.5)]" />
                )}
              </Link>
            </nav>
          </div>

          {/* Left side - Actions */}
          <div className="flex items-center gap-3 sm:gap-6">



            {/* CTA: Send Now */}
            <button
              onClick={() => setShowPaymentModal(true)}
              className="hidden md:flex items-center whitespace-nowrap gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-bold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:scale-105 hover:shadow-primary/40 active:scale-95"
            >
              <Send size={16} className="rtl:-scale-x-100" />
              <span>أرسل الآن</span>
            </button>

            {/* Dividers */}
            <div className="hidden md:block h-10 w-[2px] rounded-full bg-border/50 mx-1" />

            {/* Icons */}
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <NotificationBell />
            </div>

            {/* User profile / Login */}
            <div className="flex items-center border-r-2 border-border/50 pr-3 sm:pr-6 mr-1 sm:mr-2">
              {user ? (
                <div className="group relative flex items-center gap-4 sm:gap-5">
                  {/* User Profile - clickable to toggle menu */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setMenuOpen((s) => !s)}
                      className="flex items-center gap-3 cursor-pointer rounded-full focus:outline-none"
                      aria-expanded={menuOpen}
                      aria-haspopup="true"
                    >
                      <div className="hidden md:flex flex-col items-end">
                        <span className="text-sm font-bold text-foreground">
                          {user.name || user.email?.split('@')[0]}
                        </span>
                      </div>
                      {user.image ? (
                        <Image
                          src={user.image}
                          alt={user.name || user.email || "المستخدم"}
                          width={46}
                          height={46}
                          className={`rounded-full object-cover p-0.5 transition-all duration-300 w-10 h-10 sm:w-[46px] sm:h-[46px] ${
                            isPremium
                              ? "premium-avatar-border"
                              : "border-2 border-primary/30 group-hover:border-primary/80 group-hover:shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                          }`}
                          unoptimized
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className={`h-10 w-10 sm:h-[46px] sm:w-[46px] rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                          isPremium
                            ? "premium-avatar-border bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400"
                            : "bg-primary/10 border-2 border-primary/30 text-primary group-hover:border-primary/80 group-hover:shadow-[0_0_15px_rgba(var(--primary),0.3)]"
                        }`}>
                          {user.name ? user.name.charAt(0).toUpperCase() : (user.email || "?").charAt(0).toUpperCase()}
                        </div>
                      )}
                    </button>

                    {/* Dropdown menu */}
                    {menuOpen && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setMenuOpen(false)} />
                        <div className="absolute left-0 sm:left-auto sm:right-0 top-14 z-40 w-40 rounded-2xl border border-border/50 bg-background/95 backdrop-blur-xl p-2 shadow-2xl ring-1 ring-black/5 dark:ring-white/10 origin-top-right animate-in fade-in zoom-in-95 duration-200">
                          <button
                            onClick={() => {
                              setMenuOpen(false);
                              signOut();
                            }}
                            className="group flex w-full items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-foreground transition-colors duration-200 ease-in-out hover:text-red-600 hover:bg-red-600/10"
                          >
                            <LogOut size={16} className="text-foreground group-hover:text-red-600 transition-colors duration-200" />
                            <span className="transition-colors duration-200">تسجيل الخروج</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              ) : (
                <Link
                  href="/login"
                  className="flex items-center whitespace-nowrap gap-2 rounded-full border-2 border-primary/20 bg-primary/5 px-4 sm:px-6 py-2 sm:py-2.5 text-sm font-bold text-primary transition-all hover:bg-primary hover:text-primary-foreground hover:shadow-lg hover:shadow-primary/25 active:scale-95"
                >
                  <User size={18} />
                  <span className="hidden sm:inline">تسجيل الدخول</span>
                  <span className="sm:hidden">دخول</span>
                </Link>
              )}
            </div>
          </div>
        </div>

        <PaymentMethodModal open={showPaymentModal} onClose={() => setShowPaymentModal(false)} />
        <PremiumModal open={showPremiumModal} onClose={() => setShowPremiumModal(false)} />
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col bg-black/80 backdrop-blur-xl animate-in fade-in duration-300"
          dir="rtl"
        >
          {/* Header of mobile menu */}
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 border-b border-white/10">
            <Link href="/" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <img src="/VeloPay.png" alt="شعار فيلوباي" className="h-27 object-contain brightness-0 invert -my-6" />
            </Link>
            <button
              className="p-2 -mr-2 text-white/80 hover:text-white transition-colors focus:outline-none"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="إغلاق القائمة"
            >
              <X size={28} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex flex-col items-start px-6 pt-12 pb-6 gap-6 flex-1 overflow-y-auto">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-4 text-2xl font-bold transition-colors ${pathname === "/" ? "text-primary" : "text-white/80 hover:text-white"}`}
            >
              <Home size={28} />
              الرئيسية
            </Link>
            <Link
              href="/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-4 text-2xl font-bold transition-colors ${pathname === "/dashboard" ? "text-primary" : "text-white/80 hover:text-white"}`}
            >
              <LayoutDashboard size={28} />
              لوحة التحكم
            </Link>
            <Link
              href="/developer"
              onClick={() => setMobileMenuOpen(false)}
              className={`flex items-center gap-4 text-2xl font-bold transition-colors ${pathname === "/developer" ? "text-primary" : "text-white/80 hover:text-white"}`}
            >
              <Code size={28} />
              للمطورين
            </Link>

            <div className="h-px w-full bg-white/10 my-4" />

            {/* Actions previously hidden on mobile */}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setShowPaymentModal(true);
              }}
              className="flex items-center w-full gap-4 text-xl font-bold text-white/80 hover:text-white transition-colors"
            >
              <Send size={24} className="rtl:-scale-x-100 text-primary" />
              أرسل الآن
            </button>

            {/* Premium CTA in mobile menu */}
            {isPremium ? (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowPremiumModal(true);
                }}
                className="flex items-center w-full gap-4 text-xl font-bold text-amber-400 transition-colors"
              >
                <CheckCircle2 size={24} className="text-amber-500" />
                Premium مفعّل
              </button>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  setShowPremiumModal(true);
                }}
                className="flex items-center w-full gap-4 text-xl font-bold text-amber-400 hover:text-amber-300 transition-colors"
              >
                <Star size={24} className="text-amber-500" fill="currentColor" />
                VeloPay Premium
              </button>
            )}

          </nav>
        </div>
      )}
    </>
  );
}
