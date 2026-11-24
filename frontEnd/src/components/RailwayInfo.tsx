import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Phone,
  Briefcase,
  Calendar,
  MessageSquare,
  ChevronDown,
  ExternalLink,
} from 'lucide-react';
import { DATASET_METADATA, RAILWAY_GUIDELINES, TRAINS } from '../data/railway';
import { ScrollReveal, TRANSIT_EASE } from './MotionPrimitives';

interface RailwayInfoProps {
  isBengali: boolean;
}

export const RailwayInfo: React.FC<RailwayInfoProps> = ({ isBengali }) => {
  const [openRules, setOpenRules] = useState(false);
  const [openOffDays, setOpenOffDays] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-zinc-100">
          {isBengali ? 'প্রয়োজনীয় ভ্রমণ তথ্য' : 'Helpful Travel Information'}
        </h2>
        <a
          href={DATASET_METADATA.officialPortalUrl}
          target="_blank"
          rel="noreferrer"
          className="text-xs font-medium text-emerald-700 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
        >
          <span>eticket.railway.gov.bd</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Quick Help Strip: Helpline + SMS Live Location */}
      <ScrollReveal>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <Phone className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                {isBengali ? 'রেলওয়ে হেল্পলাইন' : 'Railway Helpline'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1 tabular-nums">
                Hotline <strong className="font-mono text-slate-900 dark:text-zinc-100">131</strong>{' '}
                • Customer Care{' '}
                <strong className="font-mono text-slate-900 dark:text-zinc-100">16122</strong> •
                Emergency <strong className="font-mono text-slate-900 dark:text-zinc-100">999</strong>
              </p>
            </div>
          </div>

          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-4 sm:p-5 flex items-start gap-3">
            <div className="h-9 w-9 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 flex items-center justify-center shrink-0">
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                {isBengali ? 'এসএমএস দিয়ে ট্রেনের অবস্থান' : 'Check Live Train Location by SMS'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-zinc-400 mt-1">
                Send{' '}
                <code className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 bg-slate-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded">
                  TR &lt;Train No&gt;
                </code>{' '}
                to <strong className="font-mono text-slate-900 dark:text-zinc-100">9999</strong> (for example, <code className="font-mono">TR 753</code>).
              </p>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Calm Collapsible Disclosures (Closed by default to keep the page serene) */}
      <div className="space-y-3">
        {/* Luggage & Refund Rules */}
        <ScrollReveal delay={0.05}>
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl">
            <button
              type="button"
              onClick={() => setOpenRules(!openRules)}
              aria-expanded={openRules}
              className="w-full p-4 sm:px-5 flex items-center justify-between gap-3 text-left rounded-xl hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                  {isBengali ? 'লাগেজ সীমা ও টিকেট রিফান্ড নিয়ম' : 'Luggage Limits & Ticket Refund Rules'}
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 dark:text-zinc-400 shrink-0 transition-transform duration-200 ${
                  openRules ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {openRules && (
                <motion.div
                  key="rules-body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: TRANSIT_EASE }}
                  className="overflow-hidden"
                >
                  <div className="px-4 sm:px-5 pb-5 pt-2 border-t border-slate-200 dark:border-zinc-800 grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400">
                        Free Luggage Allowance
                      </h4>
                      <div className="space-y-2">
                        {RAILWAY_GUIDELINES.luggageRules.map((rule, idx) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-950 text-xs"
                          >
                            <span className="font-medium text-slate-700 dark:text-zinc-300">
                              {rule.class}
                            </span>
                            <span className="font-mono font-semibold text-slate-900 dark:text-zinc-100 tabular-nums">
                              {rule.limit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-zinc-400">
                        Ticket Cancellation Deductions
                      </h4>
                      <div className="space-y-2">
                        {RAILWAY_GUIDELINES.cancellationRules.map((rule, idx) => (
                          <div
                            key={idx}
                            className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-950 text-xs"
                          >
                            <span className="text-slate-700 dark:text-zinc-300">
                              {rule.timeframe}
                            </span>
                            <span className="font-mono font-semibold text-rose-700 dark:text-rose-400 tabular-nums sm:text-right">
                              {rule.deduction}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>

        {/* Weekly Off-Days Quick Reference */}
        <ScrollReveal delay={0.1}>
          <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl">
            <button
              type="button"
              onClick={() => setOpenOffDays(!openOffDays)}
              aria-expanded={openOffDays}
              className="w-full p-4 sm:px-5 flex items-center justify-between gap-3 text-left rounded-xl hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-sm font-semibold text-slate-900 dark:text-zinc-100">
                  {isBengali ? 'সকল আন্তঃনগর ট্রেনের সাপ্তাহিক ছুটি' : 'Weekly Off-Days for Intercity Trains'}
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-500 dark:text-zinc-400 shrink-0 transition-transform duration-200 ${
                  openOffDays ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {openOffDays && (
                <motion.div
                  key="offdays-body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: TRANSIT_EASE }}
                  className="overflow-hidden"
                >
                  <div className="px-4 sm:px-5 pb-5 pt-3 border-t border-slate-200 dark:border-zinc-800 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5 text-xs">
                    {TRAINS.map((train) => (
                      <div
                        key={train.trainNumber}
                        className="p-2.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-100 dark:border-zinc-800 min-w-0"
                      >
                        <div className="font-semibold text-slate-900 dark:text-zinc-100 truncate">
                          {train.trainName}
                        </div>
                        <div className="flex items-center justify-between gap-1 mt-0.5 tabular-nums">
                          <span className="font-mono text-slate-500 dark:text-zinc-400">
                            #{train.trainNumber}
                          </span>
                          <span
                            className={`font-medium truncate ${
                              train.offDays.length === 0
                                ? 'text-emerald-700 dark:text-emerald-400'
                                : 'text-rose-700 dark:text-rose-400'
                            }`}
                          >
                            {train.offDays.length === 0 ? 'Daily' : train.offDays.join(', ')}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>
      </div>
    </div>
  );
};
