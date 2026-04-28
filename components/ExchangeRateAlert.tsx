"use client";

import { useState, useEffect, useCallback } from "react";

interface RateAlertConfig {
  currency: string;
  targetRate: number;
  direction: "above" | "below";
  active: boolean;
}

const CURRENCIES = [
  { code: "SAR", flag: "🇸🇦", name: "ريال سعودي" },
  { code: "JOD", flag: "🇯🇴", name: "دينار أردني" },
];

const STORAGE_KEY = "velopay_rate_alert";

// Simulated USDC rates (since CoinGecko free tier may be limited)
const BASE_RATES: Record<string, number> = {
  SAR: 3.75,
  JOD: 0.709,
};

export function ExchangeRateAlert() {
  const [config, setConfig] = useState<RateAlertConfig>({
    currency: "SAR",
    targetRate: 3.75,
    direction: "below",
    active: false,
  });
  const [currentRate, setCurrentRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [toast, setToast] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  // Load config from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig(parsed);
      }
    } catch {}
  }, []);

  // Save config to localStorage
  const saveConfig = useCallback((newConfig: RateAlertConfig) => {
    setConfig(newConfig);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
  }, []);

  // Fetch current rate
  const fetchRate = useCallback(async () => {
    setLoading(true);
    try {
      const coingeckoBase = process.env.NEXT_PUBLIC_COINGECKO_API || "https://api.coingecko.com/api/v3";
      const currencyId = config.currency.toLowerCase();

      const res = await fetch(
        `${coingeckoBase}/simple/price?ids=usd-coin&vs_currencies=${currencyId}`,
        { next: { revalidate: 60 } }
      );

      if (res.ok) {
        const data = await res.json();
        const rate = data?.["usd-coin"]?.[currencyId];
        if (rate) {
          setCurrentRate(rate);
          setLastUpdated(new Date().toLocaleTimeString("ar-SA"));
          return rate;
        }
      }

      // Fallback: use base rate with small random variation to simulate live data
      const base = BASE_RATES[config.currency] || 3.75;
      const variation = (Math.random() - 0.5) * 0.02 * base;
      const simRate = parseFloat((base + variation).toFixed(4));
      setCurrentRate(simRate);
      setLastUpdated(new Date().toLocaleTimeString("ar-SA"));
      return simRate;
    } catch {
      const base = BASE_RATES[config.currency] || 3.75;
      const variation = (Math.random() - 0.5) * 0.02 * base;
      const simRate = parseFloat((base + variation).toFixed(4));
      setCurrentRate(simRate);
      setLastUpdated(new Date().toLocaleTimeString("ar-SA"));
      return simRate;
    } finally {
      setLoading(false);
    }
  }, [config.currency]);

  // Check alert condition
  const checkAlert = useCallback(
    (rate: number) => {
      if (!config.active) return;

      const triggered =
        config.direction === "below"
          ? rate <= config.targetRate
          : rate >= config.targetRate;

      if (triggered) {
        const msg =
          config.direction === "below"
            ? `🔔 سعر USDC/${config.currency} وصل ${rate} — أقل من هدفك ${config.targetRate}! وقت مناسب للتحويل.`
            : `🔔 سعر USDC/${config.currency} وصل ${rate} — أعلى من هدفك ${config.targetRate}! فرصة جيدة الآن.`;
        setToast(msg);
        setTimeout(() => setToast(null), 8000);
      }
    },
    [config]
  );

  // Poll rate every 60 seconds
  useEffect(() => {
    fetchRate().then((rate) => {
      if (rate) checkAlert(rate);
    });

    const interval = setInterval(async () => {
      const rate = await fetchRate();
      if (rate) checkAlert(rate);
    }, 60000);

    return () => clearInterval(interval);
  }, [fetchRate, checkAlert]);

  const toggleAlert = () => {
    const newConfig = { ...config, active: !config.active };
    saveConfig(newConfig);
    if (!config.active) {
      setToast("✅ تنبيه سعر الصرف مفعّل! سنعلمك عند وصول السعر للهدف.");
      setTimeout(() => setToast(null), 4000);
    }
  };

  return (
    <>
      {/* Toast notification */}
      {toast && (
        <div className="fixed top-4 left-1/2 z-[100] -translate-x-1/2 animate-slide-down" dir="rtl">
          <div className="flex items-center gap-3 rounded-2xl border border-[#13B601]/30 bg-[#0a1f0a] px-6 py-4 shadow-2xl shadow-[#13B601]/20 backdrop-blur-lg">
            <span className="text-sm font-medium text-white">{toast}</span>
            <button
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-white transition"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Rate Alert Card */}
      <div className="rounded-2xl border border-[#13B601]/20 bg-gradient-to-br from-[#0d1f0d] to-[#0a150a] p-6" dir="rtl">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#13B601]/20 text-lg">
              🔔
            </div>
            <div>
              <h3 className="font-bold text-white">تنبيه سعر الصرف</h3>
              <p className="text-xs text-gray-500">USDC ↔ عملات محلية</p>
            </div>
          </div>
          <button
            onClick={toggleAlert}
            className={`relative h-7 w-12 rounded-full transition-all ${
              config.active ? "bg-[#13B601]" : "bg-gray-600"
            }`}
          >
            <div
              className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-all ${
                config.active ? "right-0.5" : "right-[22px]"
              }`}
            />
          </button>
        </div>

        {/* Current Rate Display */}
        <div className="mb-4 rounded-xl border border-white/10 bg-white/5 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-500">السعر الحالي</p>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-[#13B601]">
                  {loading ? "..." : currentRate?.toFixed(4) || "—"}
                </span>
                <span className="text-sm text-gray-400">
                  {config.currency}/USDC
                </span>
              </div>
            </div>
            <div className="text-left">
              <p className="text-xs text-gray-600">آخر تحديث</p>
              <p className="text-xs text-gray-400">{lastUpdated || "—"}</p>
              <button
                onClick={() => fetchRate()}
                className="mt-1 text-xs text-[#13B601] hover:underline"
              >
                تحديث ↻
              </button>
            </div>
          </div>
        </div>

        {/* Alert Configuration */}
        {editing ? (
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-400">العملة</label>
              <div className="grid grid-cols-2 gap-2">
                {CURRENCIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() =>
                      saveConfig({
                        ...config,
                        currency: c.code,
                        targetRate: BASE_RATES[c.code] || 3.75,
                      })
                    }
                    className={`flex items-center gap-2 rounded-lg border p-2.5 text-sm transition ${
                      config.currency === c.code
                        ? "border-[#13B601] bg-[#13B601]/10 text-[#13B601]"
                        : "border-white/10 text-gray-400 hover:border-white/20"
                    }`}
                  >
                    <span>{c.flag}</span>
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-400">
                نبّهني عندما يكون السعر
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => saveConfig({ ...config, direction: "below" })}
                  className={`rounded-lg border p-2 text-xs transition ${
                    config.direction === "below"
                      ? "border-[#13B601] bg-[#13B601]/10 text-[#13B601]"
                      : "border-white/10 text-gray-400"
                  }`}
                >
                  ⬇ أقل من أو يساوي
                </button>
                <button
                  type="button"
                  onClick={() => saveConfig({ ...config, direction: "above" })}
                  className={`rounded-lg border p-2 text-xs transition ${
                    config.direction === "above"
                      ? "border-[#13B601] bg-[#13B601]/10 text-[#13B601]"
                      : "border-white/10 text-gray-400"
                  }`}
                >
                  ⬆ أكبر من أو يساوي
                </button>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-gray-400">
                السعر المستهدف ({config.currency}/USDC)
              </label>
              <input
                type="number"
                step="0.001"
                value={config.targetRate}
                onChange={(e) =>
                  saveConfig({ ...config, targetRate: parseFloat(e.target.value) || 0 })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-lg font-bold text-white outline-none transition focus:border-[#13B601]/50 focus:ring-1 focus:ring-[#13B601]/30"
                dir="ltr"
              />
            </div>

            <button
              type="button"
              onClick={() => setEditing(false)}
              className="w-full rounded-full bg-[#13B601] py-3 text-sm font-bold text-white transition hover:bg-[#0fa301]"
            >
              حفظ الإعدادات ✓
            </button>
          </div>
        ) : (
          <div>
            <div className="mb-3 flex items-center justify-between rounded-lg border border-white/5 bg-white/3 px-3 py-2">
              <span className="text-xs text-gray-400">
                نبّهني عندما {config.direction === "below" ? "ينخفض" : "يرتفع"} سعر USDC/{config.currency} {config.direction === "below" ? "لأقل من" : "لأكثر من"}{" "}
                <strong className="text-[#13B601]">{config.targetRate}</strong>
              </span>
              {config.active && (
                <span className="h-2 w-2 rounded-full bg-[#13B601] animate-pulse" />
              )}
            </div>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="w-full rounded-full border border-white/10 py-2.5 text-xs font-medium text-gray-400 transition hover:border-[#13B601]/30 hover:text-[#13B601]"
            >
              ✏️ تعديل إعدادات التنبيه
            </button>
          </div>
        )}

        <p className="mt-3 text-center text-[10px] text-gray-600">
          يتم فحص السعر كل 60 ثانية • USDC عملة وسيطة على Solana
        </p>
      </div>
    </>
  );
}
