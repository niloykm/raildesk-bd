import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Radio, Sun, Moon, Train as TrainIcon, Clock } from 'lucide-react';
import { TRANSIT_CORRIDORS, getBangladeshTimeNow } from '../data/railway';
import { TransitCorridor } from '../types/railway';
import { TAB_SPRING } from './MotionPrimitives';

interface TopStatusBarProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onSelectCorridor: (corridor: TransitCorridor) => void;
  activeCorridorId?: string;
  isBengali: boolean;
  setIsBengali: (val: boolean) => void;
  onNavigateHome: () => void;
}

export const TopStatusBar: React.FC<TopStatusBarProps> = ({
  darkMode,
  setDarkMode,
  onSelectCorridor,
  activeCorridorId,
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
    <header className="sticky top-0 z-30 border-b border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm transition-colors duration-200">
      {/* Primary operational bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-2.5">
        {/* Brand identity */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="flex items-center gap-3 text-left rounded-md active:scale-[0.99] transition-transform min-w-0 max-w-full"
        >
          <div className="h-9 w-9 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0">
            <TrainIcon className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="font-mono font-extrabold tracking-tight text-base sm:text-lg text-zinc-900 dark:text-zinc-100">
                {isBengali ? 'রেলডেস্ক বিডি' : 'RailDesk BD'}
              </span>
              <span className="text-[11px] font-mono font-semibold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                BR ROSTER
              </span>
            </div>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 leading-tight truncate">
              {isBengali
                ? 'বাংলাদেশ রেলওয়ে সময়সূচী, রুট স্টেপার ও ভাড়া ক্যালকুলেটর'
                : 'Bangladesh Railway Timetable, Route Stepper & Statutory Fare Calculator'}
            </p>
          </div>
        </button>

        {/* Honest Dataset Provenance + Live BST Clock + Controls */}
        <div className="flex items-center flex-wrap gap-2 text-xs">
          <div
            className="inline-flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-800 font-mono tabular-nums"
            title="Reference timetable synchronized against Bangladesh Standard Time (Asia/Dhaka, UTC+6)"
          >
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span className="font-semibold text-[11px]">{bstClock.hhmm} BST</span>
            <span className="text-[10px] text-zinc-500 dark:text-zinc-400 hidden sm:inline">
              • STATIC ROSTER
            </span>
          </div>

          {/* Language Toggle */}
          <button
            type="button"
            onClick={() => setIsBengali(!isBengali)}
            className="h-9 sm:h-8 px-3 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium transition-colors duration-200 text-xs active:scale-[0.98]"
            title="Toggle Language / ভাষা পরিবর্তন"
            aria-label={isBengali ? 'Switch language to English' : 'Switch language to Bengali'}
          >
            {isBengali ? 'English' : 'বাংলা'}
          </button>

          {/* Theme Switcher */}
          <button
            type="button"
            onClick={() => setDarkMode(!darkMode)}
            className="h-9 w-9 sm:h-8 sm:w-8 rounded-md border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-800 dark:text-zinc-200 flex items-center justify-center transition-colors duration-200 active:scale-[0.98]"
            aria-label="Toggle Theme"
            title={
              darkMode
                ? 'Switch to Outdoor High-Contrast Light Mode'
                : 'Switch to High-Clarity Dark Canvas'
            }
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-zinc-700" />
            )}
          </button>
        </div>
      </div>

      {/* Corridor Quick-Selector Ribbon */}
      <div className="border-t border-zinc-200/80 dark:border-zinc-800 bg-slate-50/90 dark:bg-zinc-950/60">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-1.5 overflow-x-auto">
          <div className="flex items-center gap-2 text-xs w-max">
            <span className="text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5 mr-1 shrink-0">
              <Radio className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              {isBengali ? 'করিডোর:' : 'Corridors:'}
            </span>
            {TRANSIT_CORRIDORS.map((corridor) => {
              const isActive = activeCorridorId === corridor.id;
              return (
                <button
                  key={corridor.id}
                  type="button"
                  onClick={() => onSelectCorridor(corridor)}
                  aria-pressed={isActive}
                  className={`relative inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 active:scale-[0.98] shrink-0 ${
                    isActive
                      ? 'text-white'
                      : 'bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-800 hover:border-emerald-500 dark:hover:border-emerald-500'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="active-corridor-pill"
                      transition={TAB_SPRING}
                      className="absolute inset-0 rounded-md bg-emerald-600"
                    />
                  )}
                  <span className="relative z-10">
                    {isBengali ? corridor.labelBn : corridor.label}
                  </span>
                  <span
                    className={`relative z-10 text-[10px] font-mono tabular-nums ${
                      isActive ? 'text-emerald-100' : 'text-zinc-500 dark:text-zinc-400'
                    }`}
                  >
                    {corridor.distanceKm}km
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
};
