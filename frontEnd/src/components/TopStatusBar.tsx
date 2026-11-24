import React, { useEffect, useState } from 'react';
import { Sun, Moon, Train as TrainIcon, Clock } from 'lucide-react';
import { getBangladeshTimeNow } from '../data/railway';

interface TopStatusBarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  isBengali: boolean;
  setIsBengali: (val: boolean) => void;
  onNavigateHome: () => void;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  darkMode,
  setDarkMode,
  isBengali,
  setIsBengali,
  onNavigateHome,
}) => {
  const [bstClock, setBstClock] = useState(() => getBangladeshTimeNow());

  useEffect(() => {
    const timer = setInterval(() => {
      setBstClock(getBangladeshTimeNow());
    }, 15000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm transition-colors duration-200">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-3">
        {/* Friendly Brand */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left rounded-lg active:scale-[0.99] transition-transform min-w-0"
        >
          <div className="h-9 w-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <TrainIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <span className="block font-bold tracking-tight text-base sm:text-lg text-slate-900 dark:text-zinc-100 leading-tight">
              {isBengali ? 'রেলডেস্ক বিডি' : 'RailDesk BD'}
            </span>
            <span className="block text-xs text-slate-600 dark:text-zinc-400 truncate">
              {isBengali ? 'বাংলাদেশ রেলওয়ে ভ্রমণ পরিকল্পনা' : 'Bangladesh Railway Travel Planner'}
            </span>
          </div>
        </button>

        {/* Quiet Utility Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 text-xs font-medium tabular-nums"
            title="Current Bangladesh Standard Time"
          >
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{bstClock.hhmm} BST</span>
          </div>

          <button
            type="button"
            onClick={() => setIsBengali(!isBengali)}
            className="h-9 px-3 rounded-md border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-medium transition-colors duration-200 text-xs active:scale-[0.98]"
            aria-label={isBengali ? 'Switch language to English' : 'Switch language to Bengali'}
          >
            {isBengali ? 'English' : 'বাংলা'}
          </button>

          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="h-9 w-9 rounded-md border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 flex items-center justify-center transition-colors duration-200 active:scale-[0.98]"
            aria-label="Toggle color theme"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
