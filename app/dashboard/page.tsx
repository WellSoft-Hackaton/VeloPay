"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { ArrowUp, Plus, Trash2, User, Mail, Phone, ShieldCheck, Settings, Pencil } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/common/Dialog";
import { EscrowSection } from "@/components/dashboard-summary/EscrowSection";

// Mock Data
const transactions = [
  { id: "TX-1092", status: "نجحت", amount: "$50", date: "اليوم", recipient: "+962 7xx xxx xxxx" },
  { id: "TX-1093", status: "قيد المعالجة", amount: "$120", date: "أمس", recipient: "+962 7xx xxx xxxx" },
  { id: "TX-1094", status: "نجحت", amount: "$300", date: "25 أبريل", recipient: "+962 7xx xxx xxxx" },
  { id: "TX-1095", status: "فشل", amount: "$50", date: "24 أبريل", recipient: "+962 7xx xxx xxxx" },
  { id: "TX-1096", status: "نجحت", amount: "$85", date: "22 أبريل", recipient: "+962 7xx xxx xxxx" },
];

const allTransactions = [
  ...transactions,
  { id: "TX-1097", status: "قيد المعالجة", amount: "$150", date: "21 أبريل", recipient: "+962 7xx xxx xxxx" },
  { id: "TX-1098", status: "نجحت", amount: "$20", date: "20 أبريل", recipient: "+962 7xx xxx xxxx" },
  { id: "TX-1099", status: "نجحت", amount: "$340", date: "18 أبريل", recipient: "+962 7xx xxx xxxx" },
  { id: "TX-1100", status: "فشل", amount: "$50", date: "15 أبريل", recipient: "+962 7xx xxx xxxx" },
  { id: "TX-1101", status: "نجحت", amount: "$120", date: "14 أبريل", recipient: "+962 7xx xxx xxxx" },
  { id: "TX-1102", status: "نجحت", amount: "$45", date: "12 أبريل", recipient: "+962 7xx xxx xxxx" },
  { id: "TX-1103", status: "نجحت", amount: "$99", date: "10 أبريل", recipient: "+962 7xx xxx xxxx" },
];

const initialCards = [
  { id: "mastercard", type: "Mastercard", label: "مدخرات", balance: "$324.00", last4: "8734", bg: "bg-blue-950", border: "border-blue-900", textColor: "text-white" },
  { id: "visa", type: "Visa", label: "رئيسية", balance: "$480.50", last4: "4291", bg: "bg-slate-900", border: "border-yellow-600/50", textColor: "text-white" },
];

const upcomingBills = [
  { id: 1, name: "الإيجار", due: "يستحق 1 مايو", amount: "$180.00" },
  { id: 2, name: "Apple One", due: "يستحق 3 مايو", amount: "$21.95" },
  { id: 3, name: "الصالة الرياضية", due: "يستحق 5 مايو", amount: "$45.00" },
];

const quickActions = [
  { name: "إرسال", icon: ArrowUp, href: "/send" },
];

export default function DashboardPage() {
  const [isAddCardOpen, setIsAddCardOpen] = useState(false);
  const [isTransactionsModalOpen, setIsTransactionsModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [cards, setCards] = useState(initialCards);
  const [isBillsMenuOpen, setIsBillsMenuOpen] = useState(false);
  const [dbTxs, setDbTxs] = useState<any[]>([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await fetch("/api/transactions");
        if (res.ok) {
          const data = await res.json();
          setDbTxs(data);
        }
      } catch (err) {
        console.error("Failed to fetch transactions:", err);
      }
    };
    fetchTransactions();
  }, []);

  const displayTransactions = dbTxs.length > 0 ? [...dbTxs, ...transactions].slice(0, 5) : transactions;
  const displayAllTransactions = dbTxs.length > 0 ? [...dbTxs, ...allTransactions] : allTransactions;

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("showTransactions") === "true") {
        setIsTransactionsModalOpen(true);
        // Clean up URL without reloading
        window.history.replaceState(null, "", "/dashboard");
      }
    }
  }, []);

  const handleDeleteCard = (id: string) => {
    setCards(cards.filter(card => card.id !== id));
  };

  const handleAddCard = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const cardNumber = formData.get("cardNumber") as string;
    const last4 = cardNumber.slice(-4) || "0000";
    
    const isVisa = cardNumber.startsWith("4");
    const type = isVisa ? "Visa" : "Mastercard";
    
    const newCard = {
      id: Date.now().toString(),
      type,
      label: "جديدة",
      balance: "$0.00",
      last4,
      bg: isVisa ? "bg-slate-900" : "bg-blue-950",
      border: isVisa ? "border-yellow-600/50" : "border-blue-900",
      textColor: "text-white"
    };

    setCards([...cards, newCard]);
    setIsAddCardOpen(false);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background" dir="rtl">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar onTransactionsClick={() => setIsTransactionsModalOpen(true)} onSettingsClick={() => setIsSettingsModalOpen(true)} />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-6xl space-y-12">
            <h1 className="text-3xl font-bold text-foreground">لوحة التحكم</h1>
            
            {/* 1. Summary Cards */}
            <div className="grid gap-6 md:grid-cols-2">
              <div className="flex flex-col items-center justify-center rounded-3xl border border-green-500/20 bg-gradient-to-br from-background to-muted/20 p-10 shadow-lg transition-all hover:shadow-green-500/5 hover:border-green-500/40 relative overflow-hidden group">
                <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-green-500/10 blur-3xl group-hover:bg-green-500/20 transition-all duration-500"></div>
                
                <div className="flex items-center gap-1.5 mb-4">
                  <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                  <span className="text-sm font-medium text-muted-foreground">محفظة</span>
                  <span className="text-lg font-bold text-foreground">
                    <span className="text-green-500">Velo</span>Pay
                  </span>
                  <span className="text-sm font-medium text-muted-foreground">الرقمية</span>
                </div>
                
                <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">$804.50</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-full bg-green-500/20 px-3 py-1 text-xs font-bold text-green-600 dark:text-green-400">
                    8.3% <span className="text-[10px]">▲</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-10 shadow-sm transition-shadow hover:shadow-md">
                <p className="text-sm font-medium text-muted-foreground mb-4">الإنفاق الشهري</p>
                <h2 className="text-4xl font-bold tracking-tight text-foreground mb-4">$248.91</h2>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 rounded-full bg-red-500/20 px-3 py-1 text-xs font-bold text-red-600 dark:text-red-400">
                    <span className="text-[10px]">▼</span> 12%
                  </div>
                  <span className="text-sm text-muted-foreground">مقارنة بالشهر الماضي</span>
                </div>
              </div>
            </div>

            {/* 2. Quick Actions */}
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground">الإجراءات السريعة</h3>
              </div>
              <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {quickActions.map((action) => {
                  const Comp = action.href ? Link : "button";
                  return (
                    <Comp
                      key={action.name}
                      href={action.href || "#"}
                      className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-card py-10 shadow-sm transition-all hover:bg-accent hover:shadow-md"
                    >
                      <action.icon size={28} className="text-yellow-600 dark:text-yellow-500" />
                      <span className="text-base font-bold text-foreground">{action.name}</span>
                    </Comp>
                  );
                })}
              </div>
            </div>

            {/* 3. My Cards */}
            <div>
              <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground">بطاقاتي</h3>
              </div>
              <div className="flex gap-6 overflow-x-auto pb-6 snap-x">
                {/* Add Card Button */}
                <button 
                  onClick={() => setIsAddCardOpen(true)}
                  className="flex min-w-[140px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border bg-card/50 transition-colors hover:bg-accent hover:border-primary snap-start"
                >
                  <Plus size={28} className="text-muted-foreground" />
                  <span className="text-sm font-medium text-muted-foreground">إضافة بطاقة</span>
                </button>

                {cards.map((card) => (
                  <div
                    key={card.id}
                    className={`flex h-56 min-w-[320px] flex-col justify-between rounded-3xl border p-8 shadow-md snap-start ${card.bg} ${card.border}`}
                  >
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-medium text-blue-300">{card.label}</span>
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleDeleteCard(card.id)}
                          className="text-white/40 transition-colors hover:text-red-400" 
                          title="حذف البطاقة"
                        >
                          <Trash2 size={18} />
                        </button>
                        <span className={`text-lg font-bold ${card.id === 'visa' ? 'text-yellow-400' : 'text-blue-200'}`}>
                          {card.type}
                        </span>
                      </div>
                    </div>
                    
                    <div className={`flex items-center justify-center gap-4 tracking-widest text-xl opacity-80 ${card.textColor}`}>
                      <span>••••</span>
                      <span>••••</span>
                      <span>{card.last4}</span>
                      <span>••••</span>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-full border-2 border-white/20 flex items-center justify-center ${card.id === 'visa' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-blue-500/20 text-blue-300'}`}>
                          <div className={`h-3 w-3 rotate-45 ${card.id === 'visa' ? 'bg-yellow-400' : 'bg-blue-300'}`}></div>
                        </div>
                        <h3 className={`text-2xl font-bold ${card.textColor}`}>{card.balance}</h3>
                      </div>
                      <span className="text-sm text-blue-200/70">الرصيد</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Escrow Section */}
            <EscrowSection />

            {/* 5. Upcoming Bills */}
            <div>
              <div className="mb-6 flex items-center gap-4">
                <h3 className="text-lg font-bold text-foreground">الفواتير القادمة</h3>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => setIsBillsMenuOpen(!isBillsMenuOpen)}
                    className={`p-1.5 rounded-full hover:bg-accent transition-all duration-300 ${isBillsMenuOpen ? 'rotate-90 text-primary' : 'text-muted-foreground'}`}
                  >
                    <Settings size={20} />
                  </button>
                  
                  <div className={`flex items-center gap-1.5 overflow-hidden transition-all duration-300 ease-in-out ${isBillsMenuOpen ? 'max-w-[300px] opacity-100' : 'max-w-0 opacity-0'}`}>
                    <button className="flex items-center gap-1 text-xs font-bold bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors whitespace-nowrap">
                      <Plus size={12} />
                      إضافة
                    </button>
                    <button className="flex items-center gap-1 text-xs font-bold bg-muted text-foreground px-3 py-1.5 rounded-full hover:bg-muted/80 transition-colors whitespace-nowrap">
                      <Pencil size={12} />
                      تعديل
                    </button>
                    <button className="flex items-center gap-1 text-xs font-bold bg-red-500/10 text-red-600 px-3 py-1.5 rounded-full hover:bg-red-500/20 transition-colors whitespace-nowrap">
                      <Trash2 size={12} />
                      حذف
                    </button>
                  </div>
                </div>
              </div>
              <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
                <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-around md:gap-0 divide-y md:divide-y-0 md:divide-x md:divide-x-reverse divide-border">
                  {upcomingBills.map((bill) => (
                    <div key={bill.id} className="flex flex-1 items-center justify-between py-4 md:py-0 md:px-8 first:pt-0 first:md:pr-0 last:pb-0 last:md:pl-0">
                      <div>
                        <h4 className="text-lg font-bold text-foreground">{bill.name}</h4>
                        <p className="text-sm text-muted-foreground mt-1">{bill.due}</p>
                      </div>
                      <span className="text-2xl font-bold text-red-600 dark:text-red-500">{bill.amount}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 5. Transactions Table */}
            <div>
              <div className="mb-6 flex justify-between items-center">
                <h3 
                  className="text-lg font-bold text-foreground cursor-pointer hover:text-primary transition-colors"
                  onClick={() => setIsTransactionsModalOpen(true)}
                >
                  أحدث المعاملات
                </h3>
                <button 
                  onClick={() => setIsTransactionsModalOpen(true)}
                  className="text-sm font-bold text-primary hover:underline"
                >
                  عرض الكل
                </button>
              </div>
              <div className="rounded-3xl border border-border bg-card shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right text-sm">
                    <thead className="bg-muted/50 text-muted-foreground">
                      <tr>
                        <th className="px-8 py-5 font-medium">رقم المعاملة</th>
                        <th className="px-8 py-5 font-medium">المستلم</th>
                        <th className="px-8 py-5 font-medium">التاريخ</th>
                        <th className="px-8 py-5 font-medium">المبلغ</th>
                        <th className="px-8 py-5 font-medium">الحالة</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {displayTransactions.map((tx) => (
                        <tr key={tx.id} className="transition-colors hover:bg-muted/20">
                          <td className="px-8 py-5 font-medium text-foreground">{tx.id}</td>
                          <td className="px-8 py-5 text-muted-foreground">{tx.recipient || "-"}</td>
                          <td className="px-8 py-5 text-muted-foreground">{tx.date}</td>
                          <td className="px-8 py-5 font-bold text-foreground">{tx.amount}</td>
                          <td className="px-8 py-5">
                            <span
                              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                              tx.status === "مكتمل" || tx.status === "نجحت"
                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                : tx.status === "قيد المعالجة"
                                ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {tx.status}
                          </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            
          </div>
          <div className="mt-16">
            <Footer />
          </div>

          {/* Add Card Modal */}
          <Dialog open={isAddCardOpen} onOpenChange={setIsAddCardOpen}>
            <DialogContent className="sm:max-w-md bg-card border-border" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground">إضافة بطاقة جديدة</DialogTitle>
                <DialogDescription className="text-muted-foreground mt-2">
                  أدخل تفاصيل بطاقتك البنكية بأمان. نحن نستخدم التشفير لحماية بياناتك.
                </DialogDescription>
              </DialogHeader>
              <form className="mt-4 flex flex-col gap-4" onSubmit={handleAddCard}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">رقم البطاقة</label>
                  <input
                    type="text"
                    name="cardNumber"
                    placeholder="0000 0000 0000 0000"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-left"
                    dir="ltr"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">تاريخ الانتهاء</label>
                    <input
                      type="text"
                      name="expiry"
                      placeholder="MM/YY"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-left"
                      dir="ltr"
                      required
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-foreground">رمز الأمان (CVC)</label>
                    <input
                      type="text"
                      name="cvc"
                      placeholder="123"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-left"
                      dir="ltr"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-foreground">اسم حامل البطاقة</label>
                  <input
                    type="text"
                    name="cardholder"
                    placeholder="الاسم كما هو مطبوع على البطاقة"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="mt-4 w-full rounded-xl bg-primary px-4 py-3 font-bold text-primary-foreground transition-colors hover:bg-primary/90"
                >
                  إضافة البطاقة
                </button>
              </form>
            </DialogContent>
          </Dialog>

          {/* Transactions Modal */}
          <Dialog open={isTransactionsModalOpen} onOpenChange={setIsTransactionsModalOpen}>
            <DialogContent className="sm:max-w-2xl bg-card border-border max-h-[80vh] flex flex-col" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-xl font-bold text-foreground">سجل المعاملات</DialogTitle>
                <DialogDescription className="text-muted-foreground mt-2">
                  عرض جميع معاملاتك السابقة وحالتها.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 overflow-y-auto rounded-3xl border border-border bg-card shadow-sm flex-1">
                <table className="w-full text-right text-sm">
                  <thead className="bg-muted/50 text-muted-foreground sticky top-0 backdrop-blur-sm">
                    <tr>
                      <th className="px-8 py-5 font-medium">رقم المعاملة</th>
                      <th className="px-8 py-5 font-medium">المستلم</th>
                      <th className="px-8 py-5 font-medium">التاريخ</th>
                      <th className="px-8 py-5 font-medium">المبلغ</th>
                      <th className="px-8 py-5 font-medium">الحالة</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {displayAllTransactions.map((tx) => (
                      <tr key={tx.id} className="transition-colors hover:bg-muted/20">
                        <td className="px-8 py-5 font-medium text-foreground">{tx.id}</td>
                        <td className="px-8 py-5 text-muted-foreground">{tx.recipient || "-"}</td>
                        <td className="px-8 py-5 text-muted-foreground">{tx.date}</td>
                        <td className="px-8 py-5 font-bold text-foreground">{tx.amount}</td>
                        <td className="px-8 py-5">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold ${
                              tx.status === "مكتمل" || tx.status === "نجحت"
                                ? "bg-green-500/10 text-green-600 dark:text-green-400"
                                : tx.status === "قيد المعالجة"
                                ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                                : "bg-red-500/10 text-red-600 dark:text-red-400"
                            }`}
                          >
                            {tx.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </DialogContent>
          </Dialog>

          {/* Settings Modal */}
          <Dialog open={isSettingsModalOpen} onOpenChange={setIsSettingsModalOpen}>
            <DialogContent className="sm:max-w-xl bg-card border-border" dir="rtl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
                  <User className="w-6 h-6 text-primary" /> إعدادات الحساب
                </DialogTitle>
                <DialogDescription className="text-muted-foreground mt-2">
                  تحديث معلوماتك الشخصية وإعدادات حسابك.
                </DialogDescription>
              </DialogHeader>
              <form className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500" onSubmit={(e) => { e.preventDefault(); setIsSettingsModalOpen(false); }}>
                <div className="space-y-5 bg-muted/30 p-6 rounded-3xl border border-border/50">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    المعلومات الأساسية
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-2 relative">
                      <label className="text-sm font-semibold text-muted-foreground ml-1 block">الاسم الكامل</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          defaultValue="المستخدم"
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
                          defaultValue="user@example.com"
                          disabled
                          className="w-full rounded-2xl border border-border bg-muted px-4 py-3.5 pl-10 text-muted-foreground cursor-not-allowed opacity-70 font-medium"
                        />
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 relative">
                    <label className="text-sm font-semibold text-muted-foreground ml-1 block">رقم الهاتف</label>
                    <div className="relative">
                      <input
                        type="tel"
                        name="phoneNumber"
                        defaultValue="+964 770 000 0000"
                        className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 pl-10 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-medium text-left"
                        dir="ltr"
                        required
                      />
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground/50" />
                    </div>
                    <p className="text-xs text-muted-foreground font-medium flex items-center gap-1 mt-2">
                      <ShieldCheck className="w-4 h-4 text-green-500" /> يتم استخدامه لتأمين حسابك.
                    </p>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-3 bg-primary hover:bg-primary/90 text-primary-foreground border-none py-4 px-4 rounded-2xl font-bold text-lg transition-all shadow-lg hover:shadow-xl active:scale-[0.98] mt-4"
                >
                  حفظ التغييرات
                </button>
              </form>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </div>
  );
}
