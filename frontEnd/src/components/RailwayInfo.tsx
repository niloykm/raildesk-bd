import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  Phone,
  Briefcase,
  RefreshCcw,
  Calendar,
  MessageSquare,
  ExternalLink,
  ChevronDown,
  ShieldCheck,
} from 'lucide-react';
import { DATASET_METADATA, RAILWAY_GUIDELINES, TRAINS } from '../data/railway';
import { ScrollReveal, TRANSIT_EASE } from './MotionPrimitives';

interface RailwayInfoProps {
  isBengali: boolean;
}

export const RailwayInfo: React.FC<RailwayInfoProps> = ({ isBengali }) => {
  const [openOffDays, setOpenOffDays] = useState(true);
  const [openRefunds, setOpenRefunds] = useState(true);

  return (
    <div className="space-y-4">
      {/* 4-Column High-Utility Railway Operational Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Helpline Card */}
        <ScrollReveal delay={0}>
          <div className="h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2.5 text-emerald-600 dark:text-emerald-400">
              <Phone className="w-4 h-4 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                {isBengali ? 'জরুরি হেল্পলাইন' : 'Helpline & Support'}
              </h3>
            </div>
            <div className="space-y-2 font-mono text-xs tabular-nums">
              <div className="flex items-center justify-between gap-2">
                <span className="text-zinc-600 dark:text-zinc-400">BR Hotline:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100 bg-slate-100 dark:bg-zinc-800 px-2 py-0.5 rounded">
                  {RAILWAY_GUIDELINES.helpline}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-zinc-600 dark:text-zinc-400">Customer Care:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">
                  {RAILWAY_GUIDELINES.customerCare}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-zinc-600 dark:text-zinc-400">Emergency:</span>
                <span className="font-bold text-zinc-900 dark:text-zinc-100">999</span>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* SMS Live Tracker Card */}
        <ScrollReveal delay={0.05}>
          <div className="h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2.5 text-emerald-600 dark:text-emerald-400">
              <MessageSquare className="w-4 h-4 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                {isBengali ? 'এসএমএস লাইভ ট্র্যাকিং' : 'Official SMS Tracking'}
              </h3>
            </div>
            <div className="text-xs text-zinc-700 dark:text-zinc-300 space-y-2">
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400">
                Check real-time GPS location via SMS:
              </p>
              <div className="p-2 rounded-md bg-slate-100 dark:bg-zinc-950 font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 border border-zinc-200 dark:border-zinc-800">
                {RAILWAY_GUIDELINES.smsTrackingCode}
              </div>
              <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono">
                Example: TR 753
              </p>
            </div>
          </div>
        </ScrollReveal>

        {/* Luggage Allowance Card */}
        <ScrollReveal delay={0.1}>
          <div className="h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2.5 text-emerald-600 dark:text-emerald-400">
              <Briefcase className="w-4 h-4 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                {isBengali ? 'লাগেজ ব্যাগেজ নিয়ম' : 'Free Luggage Limits'}
              </h3>
            </div>
            <div className="space-y-2 font-mono text-xs tabular-nums text-zinc-800 dark:text-zinc-200">
              {RAILWAY_GUIDELINES.luggageRules.map((r, i) => (
                <div key={i} className="flex items-center justify-between gap-2 text-[11px]">
                  <span className="text-zinc-600 dark:text-zinc-400">{r.class.split(' ')[0]}:</span>
                  <span className="font-semibold">{r.limit.split(' ')[0]} kg</span>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>

        {/* Honest Dataset Provenance & Booking Portal Card */}
        <ScrollReveal delay={0.15}>
          <div className="h-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2.5 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                {isBengali ? 'তথ্য উৎস ও ই-টিকেট' : 'Data Source & Booking'}
              </h3>
            </div>
            <div className="space-y-2 font-mono text-[11px] tabular-nums text-zinc-800 dark:text-zinc-200">
              <div className="flex items-center justify-between gap-2">
                <span className="text-zinc-600 dark:text-zinc-400">Roster:</span>
                <span className="font-bold">{DATASET_METADATA.version}</span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-zinc-600 dark:text-zinc-400">Services:</span>
                <span>{TRAINS.length} directional runs</span>
              </div>
              <a
                href={DATASET_METADATA.officialPortalUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 font-sans font-semibold text-emerald-700 dark:text-emerald-400 hover:underline pt-0.5"
              >
                <span>eticket.railway.gov.bd</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Structured 2-Column Animated Disclosures: Off-Days & Cancellation Rules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        {/* Off-Day Directory Accordion */}
        <ScrollReveal delay={0.06}>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 sm:p-5">
            <button
              type="button"
              onClick={() => setOpenOffDays(!openOffDays)}
              aria-expanded={openOffDays}
              className="w-full flex items-center justify-between gap-2 text-left rounded-md py-1 transition-colors"
            >
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  {isBengali
                    ? 'আন্তঃনগর ট্রেনের সাপ্তাহিক ছুটির দিন'
                    : 'Intercity Weekly Maintenance Off-Days'}
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0 transition-transform duration-200 ${
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
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-xs tabular-nums pt-3 mt-3 border-t border-zinc-200 dark:border-zinc-800">
                    {TRAINS.map((train) => (
                      <div
                        key={train.trainNumber}
                        className="p-2 rounded-md bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 min-w-0"
                      >
                        <div className="font-bold text-zinc-900 dark:text-zinc-100 truncate">
                          #{train.trainNumber} {train.trainName.split(' ')[0]}
                        </div>
                        <div
                          className={`text-[11px] font-semibold mt-0.5 truncate ${
                            train.offDays.length === 0
                              ? 'text-emerald-700 dark:text-emerald-400'
                              : 'text-rose-700 dark:text-rose-400'
                          }`}
                        >
                          {train.offDays.length === 0 ? 'Daily' : train.offDays.join(', ')}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </ScrollReveal>

        {/* Cancellation Deductions Accordion */}
        <ScrollReveal delay={0.12}>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 sm:p-5">
            <button
              type="button"
              onClick={() => setOpenRefunds(!openRefunds)}
              aria-expanded={openRefunds}
              className="w-full flex items-center justify-between gap-2 text-left rounded-md py-1 transition-colors"
            >
              <span className="flex items-center gap-2">
                <RefreshCcw className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-900 dark:text-zinc-100">
                  {isBengali
                    ? 'টিকেট বাতিল ও রিফান্ড নীতি'
                    : 'Official BR Ticket Refund & Cancellation Rules'}
                </span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0 transition-transform duration-200 ${
                  openRefunds ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence initial={false}>
              {openRefunds && (
                <motion.div
                  key="refunds-body"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.24, ease: TRANSIT_EASE }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 pt-3 mt-3 border-t border-zinc-200 dark:border-zinc-800">
                    {RAILWAY_GUIDELINES.cancellationRules.map((rule, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-md bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-1 sm:gap-3 text-xs"
                      >
                        <div className="font-medium text-zinc-800 dark:text-zinc-200">
                          {rule.timeframe}
                        </div>
                        <div className="font-mono sm:text-right font-bold text-rose-700 dark:text-rose-400 tabular-nums">
                          {rule.deduction}
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
