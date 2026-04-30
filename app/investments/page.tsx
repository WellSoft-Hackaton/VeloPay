"use client";

import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Sidebar } from "@/components/Sidebar";
import { TrendingUp, Sparkles, RefreshCw, ArrowUpRight, ArrowDownRight, ShieldCheck, Cpu } from "lucide-react";
import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/common/Dialog";
import Link from "next/link";

const ASSETS = [
  {
    id: "gold",
    name: "الذهب",
    symbol: "XAU",
    icon: "🥇",
    price: 2347.50,
    change: 0.8,
    holdings: 520.00,
    color: "from-amber-400 to-amber-600",
    bgLight: "bg-amber-500/10",
  },
  {
    id: "silver",
    name: "الفضة",
    symbol: "XAG",
    icon: "🥈",
    price: 28.45,
    change: 1.2,
    holdings: 185.30,
    color: "from-slate-300 to-slate-500",
    bgLight: "bg-slate-500/10",
  },
  {
    id: "btc",
    name: "بيتكوين",
    symbol: "BTC",
    icon: "₿",
    price: 67432.00,
    change: -1.4,
    holdings: 340.50,
    color: "from-orange-400 to-orange-600",
    bgLight: "bg-orange-500/10",
  },
  {
    id: "eth",
    name: "إيثيريوم",
    symbol: "ETH",
    icon: "⟠",
    price: 3521.80,
    change: 2.1,
    holdings: 200.00,
    color: "from-blue-400 to-indigo-600",
    bgLight: "bg-blue-500/10",
  },
];

const AI_TIPS = [
  {
    id: 1,
    title: "تنويع المحفظة",
    desc: "خصّص 50-60% من استثماراتك في الذهب والفضة كملاذ آمن، و40% في العملات الرقمية لتحقيق نمو أعلى.",
  },
  {
    id: 2,
    title: "استراتيجية الشراء التدريجي (DCA)",
    desc: "استثمر مبالغ ثابتة أسبوعياً بدلاً من مبلغ واحد كبير لتقليل مخاطر تقلبات السوق.",
  },
  {
    id: 3,
    title: "الذهب كدرع تضخمي",
    desc: "في أوقات التضخم المرتفع، الذهب يحافظ على القوة الشرائية. حافظ على نسبة 30% كحد أدنى.",
  },
  {
    id: 4,
    title: "إيثيريوم للمستقبل",
    desc: "مع تطور تقنية العقود الذكية، إيثيريوم يمثل فرصة نمو طويلة الأمد بمخاطر متوسطة.",
  },
  {
    id: 5,
    title: "قاعدة الـ 5%",
    desc: "لا تستثمر أكثر من 5% من محفظتك في أصل واحد عالي المخاطر. التوازن هو المفتاح.",
  }
];

export default function InvestmentsPage() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("اليوم 10:30 ص");
  const [investModalOpen, setInvestModalOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<typeof ASSETS[0] | null>(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      const now = new Date();
      setLastUpdated(`اليوم ${now.toLocaleTimeString("ar-IQ", { hour: '2-digit', minute: '2-digit' })}`);
    }, 2000);
  };

  const handleInvestClick = (asset: typeof ASSETS[0]) => {
    setSelectedAsset(asset);
    setInvestModalOpen(true);
  };

  return (
    <div className="flex min-h-screen flex-col bg-background" dir="rtl">
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        
        <main className="flex-1 overflow-y-auto p-6 lg:p-10">
          <div className="mx-auto max-w-6xl space-y-12">
            
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
                  <TrendingUp className="text-primary" size={32} />
                  الاستثمارات
                </h1>
                <p className="text-muted-foreground mt-2">إدارة محفظتك الاستثمارية بأمان وبطرق منخفضة المخاطر.</p>
              </div>
            </div>

            {/* Portfolio Summary */}
            <div className="flex flex-col items-center justify-center rounded-3xl border border-green-500/20 bg-gradient-to-br from-background to-muted/20 p-10 shadow-lg relative overflow-hidden group">
              <div className="absolute -right-20 -top-20 h-40 w-40 rounded-full bg-green-500/10 blur-3xl group-hover:bg-green-500/20 transition-all duration-500"></div>
              
              <div className="flex items-center gap-1.5 mb-4">
                <span className="text-sm font-medium text-muted-foreground">إجمالي المحفظة الاستثمارية</span>
              </div>
              
              <h2 className="text-5xl font-black tracking-tight text-foreground mb-4">$1,245.80</h2>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 rounded-full bg-green-500/20 px-4 py-1.5 text-sm font-bold text-green-600 dark:text-green-400">
                  <ArrowUpRight size={16} /> +$42.50 (3.5%)
                </div>
                <span className="text-sm text-muted-foreground">هذا الشهر</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Assets Grid (Takes 2/3 of space on large screens) */}
              <div className="lg:col-span-2 space-y-6">
                <h3 className="text-xl font-bold text-foreground">الأصول المتاحة</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {ASSETS.map((asset, index) => (
                    <div 
                      key={asset.id} 
                      className="animate-card-appear flex flex-col justify-between rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all hover:border-primary/30 group"
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${asset.bgLight} border border-border`}>
                            {asset.icon}
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground text-lg">{asset.name}</h4>
                            <span className="text-sm font-medium text-muted-foreground">{asset.symbol}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <p className="text-sm text-muted-foreground mb-1">السعر الحالي</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-black text-foreground">${asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                            <span className={`flex items-center text-xs font-bold ${asset.change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                              {asset.change >= 0 ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
                              {Math.abs(asset.change)}%
                            </span>
                          </div>
                        </div>
                        <div className="text-left">
                          <p className="text-sm text-muted-foreground mb-1">حيازتك</p>
                          <span className="text-lg font-bold text-foreground">${asset.holdings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleInvestClick(asset)}
                        className="w-full py-3 rounded-xl bg-muted hover:bg-primary/10 text-foreground hover:text-primary font-bold transition-colors border border-transparent hover:border-primary/20"
                      >
                        استثمر الآن
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Tips Section (Takes 1/3 of space on large screens) */}
              <div className="lg:col-span-1">
                <div className="sticky top-6 rounded-3xl border-2 border-primary/20 bg-card p-6 shadow-xl relative overflow-hidden backdrop-blur-xl">
                  {/* Glassmorphism/Glow effect */}
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-3xl"></div>
                  <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>

                  <div className="relative z-10 flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center animate-ai-pulse">
                        <Cpu className="text-primary" size={20} />
                      </div>
                      <h3 className="text-xl font-black text-foreground bg-clip-text text-transparent bg-gradient-to-l from-primary to-green-300">
                        مستشار AI
                      </h3>
                    </div>
                    <button 
                      onClick={handleRefresh}
                      className={`p-2 rounded-full hover:bg-muted/50 transition-colors ${isRefreshing ? 'animate-spin text-primary' : 'text-muted-foreground'}`}
                      disabled={isRefreshing}
                      title="تحديث النصائح"
                    >
                      <RefreshCw size={18} />
                    </button>
                  </div>

                  <div className="relative z-10 space-y-5">
                    {isRefreshing ? (
                      <div className="flex flex-col items-center justify-center py-10 space-y-4">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                        <p className="text-sm font-medium text-muted-foreground animate-pulse">جاري تحليل السوق...</p>
                      </div>
                    ) : (
                      <>
                        {AI_TIPS.map((tip) => (
                          <div key={tip.id} className="p-4 rounded-2xl bg-background/60 border border-border backdrop-blur-md hover:border-primary/30 transition-colors">
                            <h4 className="font-bold text-foreground text-sm flex items-center gap-2 mb-2">
                              <Sparkles size={14} className="text-yellow-500" />
                              {tip.title}
                            </h4>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {tip.desc}
                            </p>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  <div className="relative z-10 mt-6 flex items-center gap-2 justify-center text-xs text-muted-foreground">
                    <ShieldCheck size={14} className="text-green-500" />
                    <span>آخر تحديث: {lastUpdated}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
          
          <div className="mt-16">
            <Footer />
          </div>
        </main>
      </div>

      {/* Invest Modal */}
      <Dialog open={investModalOpen} onOpenChange={setInvestModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border" dir="rtl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-foreground flex items-center gap-2">
              شراء {selectedAsset?.name} {selectedAsset?.icon}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              أدخل المبلغ الذي ترغب في استثماره في {selectedAsset?.name}.
            </DialogDescription>
          </DialogHeader>
          
          <div className="mt-4 flex flex-col gap-5">
            <div className="p-4 rounded-xl border border-primary/20 bg-primary/5 flex justify-between items-center">
              <span className="text-sm font-bold text-foreground">السعر الحالي:</span>
              <span className="font-black text-primary">${selectedAsset?.price.toLocaleString()}</span>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">المبلغ (USD)</label>
              <div className="relative">
                <input
                  type="number"
                  placeholder="0.00"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 pl-12 text-foreground text-xl font-bold placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary text-left"
                  dir="ltr"
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground font-bold">$</span>
              </div>
            </div>

            <button
              onClick={() => {
                setInvestModalOpen(false);
                // In a real app, this would trigger a payment/swap flow
                alert(`تم استلام طلب استثمار في ${selectedAsset?.name} بنجاح!`);
              }}
              className="mt-2 w-full rounded-xl bg-primary px-4 py-4 font-bold text-primary-foreground transition-colors hover:bg-primary/90 flex justify-center items-center gap-2 shadow-lg shadow-primary/20"
            >
              تأكيد الاستثمار <TrendingUp size={18} />
            </button>
            <p className="text-center text-xs text-muted-foreground">
              هذه عملية تجريبية فقط. لا يتم خصم أموال حقيقية.
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
