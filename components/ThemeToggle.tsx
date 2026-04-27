"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { HiSun, HiMoon } from "react-icons/hi2";
import { motion, AnimatePresence } from "framer-motion";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // Avoid hydration mismatch
  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/20">
        <div className="h-5 w-5 rounded-full bg-muted animate-pulse" />
      </div>
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex h-10 w-10 items-center justify-center rounded-full bg-card shadow-sm ring-1 ring-border transition-all hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={isDark ? "dark" : "light"}
          initial={{ y: 10, opacity: 0, rotate: -45 }}
          animate={{ y: 0, opacity: 1, rotate: 0 }}
          exit={{ y: -10, opacity: 0, rotate: 45 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="text-xl"
        >
          {isDark ? (
            <HiSun className="text-yellow-400" />
          ) : (
            <HiMoon className="text-slate-700" />
          )}
        </motion.div>
      </AnimatePresence>
    </button>
  );
}
