"use client";

import { useState, useEffect, useCallback } from "react";

interface CurrencyPair {
  from: string;
  to: string;
  fromFlag: string;
  toFlag: string;
  rate: number;
  change: number; // percentage change (simulated)
}

const INITIAL_PAIRS: CurrencyPair[] = [
  { from: "SAR", to: "JOD", fromFlag: "🇸🇦", toFlag: "🇯🇴", rate: 0.0995, change: 0.12 },
  { from: "AED", to: "JOD", fromFlag: "🇦🇪", toFlag: "🇯🇴", rate: 0.1015, change: -0.08 },
  { from: "SAR", to: "USD", fromFlag: "🇸🇦", toFlag: "🇺🇸", rate: 0.2667, change: 0.05 },
  { from: "KWD", to: "JOD", fromFlag: "🇰🇼", toFlag: "🇯🇴", rate: 2.31, change: 0.15 },
  { from: "QAR", to: "JOD", fromFlag: "🇶🇦", toFlag: "🇯🇴", rate: 0.1948, change: -0.03 },
  { from: "USDC", to: "SAR", fromFlag: "💲", toFlag: "🇸🇦", rate: 3.75, change: 0.02 },
  { from: "USDC", to: "JOD", fromFlag: "💲", toFlag: "🇯🇴", rate: 0.709, change: -0.01 },
];

export function LiveRateTicker() {
  const [pairs, setPairs] = useState(INITIAL_PAIRS);
  const [activePairIndex, setActivePairIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Simulate small rate fluctuations every 10 seconds
  const updateRates = useCallback(() => {
    setPairs((prev) =>
      prev.map((pair) => {
        const variation = (Math.random() - 0.5) * 0.002 * pair.rate;
        const newRate = parseFloat((pair.rate + variation).toFixed(4));
        const newChange = parseFloat(((Math.random() - 0.45) * 0.3).toFixed(2));
        return { ...pair, rate: newRate, change: newChange };
      })
    );
  }, []);

  useEffect(() => {
    const rateInterval = setInterval(updateRates, 10000);
    return () => clearInterval(rateInterval);
  }, [updateRates]);

  // Auto-rotate featured pair
  useEffect(() => {
    const rotateInterval = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActivePairIndex((prev) => (prev + 1) % pairs.length);
        setIsTransitioning(false);
      }, 300);
    }, 4000);
    return () => clearInterval(rotateInterval);
  }, [pairs.length]);

  const activePair = pairs[activePairIndex];

  return (
    <div className="rounded-2xl border border-white/10 bg-white/3 p-6 backdrop-blur-sm">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-[#13B601]" />
          <span className="text-sm font-semibold text-gray-300">أسعار الصرف الحية</span>
        </div>
        <span className="text-xs text-gray-600">عبر Solana • USDC</span>
      </div>

      {/* Featured Rate - Large Display */}
      <div
        className={`mb-5 rounded-xl border border-[#13B601]/20 bg-[#13B601]/5 p-5 transition-all duration-300 ${
          isTransitioning ? "opacity-0 scale-95" : "opacity-100 scale-100"
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">{activePair.fromFlag}</span>
            <span className="text-gray-500">→</span>
            <span className="text-2xl">{activePair.toFlag}</span>
          </div>
          <div className="text-left">
            <div className="text-2xl font-black text-white">{activePair.rate.toFixed(4)}</div>
            <div
              className={`text-xs font-medium ${
                activePair.change >= 0 ? "text-[#13B601]" : "text-red-400"
              }`}
            >
              {activePair.change >= 0 ? "▲" : "▼"} {Math.abs(activePair.change).toFixed(2)}%
            </div>
          </div>
        </div>
        <div className="mt-2 text-xs text-gray-500">
          1 {activePair.from} = {activePair.rate.toFixed(4)} {activePair.to}
        </div>
      </div>

      {/* Compact Rate List */}
      <div className="space-y-1.5">
        {pairs.map((pair, i) => (
          <button
            key={`${pair.from}-${pair.to}`}
            type="button"
            onClick={() => {
              setIsTransitioning(true);
              setTimeout(() => {
                setActivePairIndex(i);
                setIsTransitioning(false);
              }, 200);
            }}
            className={`flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm transition ${
              i === activePairIndex
                ? "bg-[#13B601]/10 border border-[#13B601]/20"
                : "hover:bg-white/5 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-xs">
                {pair.fromFlag} {pair.from}
              </span>
              <span className="text-gray-600">→</span>
              <span className="text-xs">
                {pair.toFlag} {pair.to}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-medium text-white">
                {pair.rate.toFixed(4)}
              </span>
              <span
                className={`text-[10px] font-medium ${
                  pair.change >= 0 ? "text-[#13B601]" : "text-red-400"
                }`}
              >
                {pair.change >= 0 ? "+" : ""}
                {pair.change.toFixed(2)}%
              </span>
            </div>
          </button>
        ))}
      </div>

      {/* Mini sparkline bars (decorative) */}
      <div className="mt-4 flex items-end gap-[3px] justify-center h-8">
        {[
          { height: 12.5, isPositive: true },
          { height: 25.2, isPositive: false },
          { height: 18.1, isPositive: true },
          { height: 31.4, isPositive: true },
          { height: 15.6, isPositive: false },
          { height: 22.8, isPositive: true },
          { height: 9.3, isPositive: false },
          { height: 28.5, isPositive: true },
          { height: 19.7, isPositive: false },
          { height: 24.1, isPositive: true },
          { height: 11.2, isPositive: false },
          { height: 29.8, isPositive: true },
          { height: 14.5, isPositive: false },
          { height: 21.3, isPositive: true },
          { height: 27.6, isPositive: true },
          { height: 16.9, isPositive: false },
          { height: 23.4, isPositive: true },
          { height: 10.8, isPositive: false },
          { height: 30.1, isPositive: true },
          { height: 17.5, isPositive: true },
        ].map((data, i) => (
          <div
            key={i}
            className={`w-1.5 rounded-sm transition-all duration-500 ${
              data.isPositive ? "bg-[#13B601]/40" : "bg-red-400/30"
            }`}
            style={{ height: `${data.height}px` }}
          />
        ))}
      </div>

      <p className="mt-3 text-center text-[10px] text-gray-600">
        أسعار تقريبية — السعر النهائي عند التحويل عبر Solana Devnet
      </p>
    </div>
  );
}
