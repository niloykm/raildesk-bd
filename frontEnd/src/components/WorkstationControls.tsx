import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, Compass, TrainTrack, RotateCcw } from 'lucide-react';
import { StationSelector } from './StationSelector';
import { TRAINS, getWeekdayName } from '../data/railway';
import { SeatClass } from '../types/railway';
import { TAB_SPRING, TRANSIT_EASE } from './MotionPrimitives';

interface WorkstationControlsProps {
  mode: 'JOURNEY' | 'TRACKER';
  setMode: (mode: 'JOURNEY' | 'TRACKER') => void;
  fromStationCode: string;
  setFromStationCode: (code: string) => void;
  toStationCode: string;
  setToStationCode: (code: string) => void;
  travelDate: string;
  setTravelDate: (date: string) => void;
  selectedClass: SeatClass | 'ALL';
  setSelectedClass: (cls: SeatClass | 'ALL') => void;
  hideOffDayTrains: boolean;
  setHideOffDayTrains: (val: boolean) => void;
  selectedTrainNumber: string;
  setSelectedTrainNumber: (trainNum: string) => void;
  onSwapStations: () => void;
  onResetFilters: () => void;
  isBengali: boolean;
}

const CLASS_OPTIONS: { id: SeatClass | 'ALL'; label: string; labelBn: string }[] = [
  { id: 'ALL', label: 'All Classes', labelBn: 'সকল শ্রেণি' },
  { id: 'SNIGDHA', label: 'Snigdha (AC)', labelBn: 'স্নিগ্ধা' },
  { id: 'S_CHAIR', label: 'Shovan Chair', labelBn: 'শোভন চেয়ার' },
  { id: 'SHOVAN', label: 'Shovan', labelBn: 'শোভন' },
  { id: 'AC_B', label: 'AC Berth', labelBn: 'এসি বার্থ' },
  { id: 'AC_S', label: 'AC Seat', labelBn: 'এসি সিট' },
];

const POPULAR_TRAINS = [
  { number: '702', name: 'Subarna [702]' },
  { number: '788', name: 'Sonar Bangla [788]' },
  { number: '753', name: 'Silk City [753]' },
  { number: '759', name: 'Padma [759]' },
  { number: '709', name: 'Parabat [709]' },
  { number: '726', name: 'Sundarban [726]' },
  { number: '771', name: 'Rangpur [771]' },
];

export const WorkstationControls: React.FC<WorkstationControlsProps> = ({
  mode,
  setMode,
  fromStationCode,
  setFromStationCode,
  toStationCode,
  setToStationCode,
  travelDate,
  setTravelDate,
  selectedClass,
  setSelectedClass,
  hideOffDayTrains,
  setHideOffDayTrains,
  selectedTrainNumber,
  setSelectedTrainNumber,
  onSwapStations,
  onResetFilters,
  isBengali,
}) => {
  const [swapCount, setSwapCount] = useState(0);
  const selectedWeekday = getWeekdayName(travelDate);

  const handleSwap = () => {
    setSwapCount((c) => c + 1);
    onSwapStations();
  };

  const handleDateOffset = (days: number) => {
    const d = new Date();
    d.setDate(d.getDate() + days);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setTravelDate(`${yyyy}-${mm}-${dd}`);
  };

  return (
    <section
      aria-label="Transit Search and Schedule Controls"
      className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 sm:p-5 transition-colors duration-200"
    >
      {/* Mode Switcher Tabs with Shared-Element Active Indicator */}
      <div
        role="tablist"
        aria-label="Workstation Mode"
        className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-1 bg-slate-100 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 mb-4"
      >
        <button
          type="button"
          role="tab"
          aria-selected={mode === 'JOURNEY'}
          onClick={() => setMode('JOURNEY')}
          className={`relative min-h-[44px] sm:min-h-[38px] py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-200 active:scale-[0.98] ${
            mode === 'JOURNEY'
              ? 'text-zinc-900 dark:text-zinc-100'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          {mode === 'JOURNEY' && (
            <motion.span
              layoutId="workstation-mode-pill"
              transition={TAB_SPRING}
              className="absolute inset-0 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs"
            />
          )}
          <Compass className="w-4 h-4 text-emerald-600 dark:text-emerald-400 relative z-10 shrink-0" />
          <span className="relative z-10">
            {isBengali ? 'মোড ১: রুট ও সময়সূচী অনুসন্ধান' : 'Mode A: Route & Schedule Search'}
          </span>
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={mode === 'TRACKER'}
          onClick={() => setMode('TRACKER')}
          className={`relative min-h-[44px] sm:min-h-[38px] py-2 px-3 rounded-md text-xs font-semibold flex items-center justify-center gap-2 transition-colors duration-200 active:scale-[0.98] ${
            mode === 'TRACKER'
              ? 'text-zinc-900 dark:text-zinc-100'
              : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
          }`}
        >
          {mode === 'TRACKER' && (
            <motion.span
              layoutId="workstation-mode-pill"
              transition={TAB_SPRING}
              className="absolute inset-0 rounded-md bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 shadow-xs"
            />
          )}
          <TrainTrack className="w-4 h-4 text-emerald-600 dark:text-emerald-400 relative z-10 shrink-0" />
          <span className="relative z-10">
            {isBengali ? 'মোড ২: সরাসরি ট্রেন ইন্সপেক্টর' : 'Mode B: Direct Train Roster & Stepper'}
          </span>
        </button>
      </div>

      {/* Animated Mode Panel Content */}
      <AnimatePresence mode="wait">
        {mode === 'JOURNEY' ? (
          <motion.div
            key="mode-journey"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: TRANSIT_EASE }}
            className="space-y-4"
          >
            {/* Station Selection Grid with 1-click Fast Swap */}
            <div className="flex flex-col md:flex-row items-stretch md:items-start gap-3">
              <StationSelector
                label="Origin Station"
                labelBn="যাত্রা শুরুর স্টেশন"
                selectedStationCode={fromStationCode}
                onSelectStation={setFromStationCode}
                excludeCode={toStationCode}
                isBengali={isBengali}
              />

              {/* Fast 1-click Swap Button with smooth 180 deg rotation */}
              <div className="flex justify-center md:pt-[22px]">
                <button
                  type="button"
                  onClick={handleSwap}
                  aria-label="Swap Origin and Destination"
                  title="Swap Origin and Destination / স্টেশন অদলবদল"
                  className="h-11 w-11 rounded-md border border-zinc-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:border-emerald-500 flex items-center justify-center text-zinc-700 dark:text-zinc-200 transition-colors duration-200 active:scale-[0.96]"
                >
                  <motion.span
                    animate={{ rotate: swapCount * 180 }}
                    transition={{ duration: 0.28, ease: TRANSIT_EASE }}
                    className="inline-flex"
                  >
                    <ArrowLeftRight className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </motion.span>
                </button>
              </div>

              <StationSelector
                label="Destination Station"
                labelBn="গন্তব্য স্টেশন"
                selectedStationCode={toStationCode}
                onSelectStation={setToStationCode}
                excludeCode={fromStationCode}
                isBengali={isBengali}
              />
            </div>

            {/* Secondary Controls: Date Picker, Operating Day Filter & Class Filter */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 pt-3 border-t border-zinc-200 dark:border-zinc-800">
              {/* Travel Date */}
              <div className="md:col-span-4">
                <label
                  htmlFor="raildesk-travel-date"
                  className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5 flex items-center justify-between"
                >
                  <span>{isBengali ? 'যাত্রার তারিখ' : 'Travel Date'}</span>
                  <span className="font-mono text-[11px] font-bold text-emerald-700 dark:text-emerald-400 normal-case">
                    {selectedWeekday}
                  </span>
                </label>
                <input
                  id="raildesk-travel-date"
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full min-h-[44px] md:min-h-[40px] px-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-md text-xs font-mono tabular-nums text-zinc-900 dark:text-zinc-100"
                />
                {/* Quick Date offsets */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  {[
                    { days: 0, en: 'Today', bn: 'আজ' },
                    { days: 1, en: '+1 Day', bn: '+১ দিন' },
                    { days: 2, en: '+2 Days', bn: '+২ দিন' },
                  ].map((item) => (
                    <button
                      key={item.days}
                      type="button"
                      onClick={() => handleDateOffset(item.days)}
                      className="text-[11px] px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 transition-colors active:scale-[0.98]"
                    >
                      {isBengali ? item.bn : item.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Travel Class Selector + Operating-Day Toggle */}
              <div className="md:col-span-8 flex flex-col justify-between gap-2.5">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
                      {isBengali ? 'শ্রেণি নির্বাচন' : 'Travel Class Filter'}
                    </span>
                    <button
                      type="button"
                      onClick={onResetFilters}
                      className="text-[11px] text-zinc-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{isBengali ? 'রিসেট' : 'Reset'}</span>
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {CLASS_OPTIONS.map((opt) => {
                      const isSelected = selectedClass === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedClass(opt.id)}
                          aria-pressed={isSelected}
                          className={`relative min-h-[40px] px-3 rounded-md text-xs font-medium transition-colors duration-200 active:scale-[0.98] ${
                            isSelected
                              ? 'text-white'
                              : 'bg-slate-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500'
                          }`}
                        >
                          {isSelected && (
                            <motion.span
                              layoutId="class-filter-pill"
                              transition={TAB_SPRING}
                              className="absolute inset-0 rounded-md bg-emerald-600"
                            />
                          )}
                          <span className="relative z-10">
                            {isBengali ? opt.labelBn : opt.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Operating Day Filter Checkbox */}
                <label className="inline-flex items-center gap-2 text-xs text-zinc-700 dark:text-zinc-300 cursor-pointer select-none w-fit">
                  <input
                    type="checkbox"
                    checked={hideOffDayTrains}
                    onChange={(e) => setHideOffDayTrains(e.target.checked)}
                    className="h-4 w-4 rounded accent-emerald-600 cursor-pointer"
                  />
                  <span>
                    {isBengali
                      ? `শুধুমাত্র ${selectedWeekday} চলাচলকারী ট্রেন দেখান`
                      : `Hide trains on weekly off-day (${selectedWeekday})`}
                  </span>
                </label>
              </div>
            </div>
          </motion.div>
        ) : (
          /* MODE B: DIRECT TRAIN ROUTE & STEPPER */
          <motion.div
            key="mode-tracker"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: TRANSIT_EASE }}
            className="space-y-4"
          >
            <div>
              <label
                htmlFor="raildesk-train-select"
                className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5"
              >
                {isBengali ? 'ট্রেন নম্বর অথবা নাম নির্বাচন করুন' : 'Select Train Number / Name'}
              </label>
              <select
                id="raildesk-train-select"
                value={selectedTrainNumber}
                onChange={(e) => setSelectedTrainNumber(e.target.value)}
                className="w-full min-h-[44px] px-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-md text-xs sm:text-sm font-medium text-zinc-900 dark:text-zinc-100"
              >
                {TRAINS.map((t) => (
                  <option key={t.trainNumber} value={t.trainNumber}>
                    [{t.trainNumber}] {t.trainName} ({t.trainNameBn}) — {t.originStationCode} →{' '}
                    {t.destinationStationCode} ({t.departureTime}
                    {t.overnight ? ' +1d' : ''})
                  </option>
                ))}
              </select>

              {/* Quick Train Chips */}
              <div className="flex flex-wrap items-center gap-1.5 mt-3">
                <span className="text-[11px] uppercase font-semibold text-zinc-500 dark:text-zinc-400">
                  {isBengali ? 'জনপ্রিয়:' : 'Popular:'}
                </span>
                {POPULAR_TRAINS.map((train) => {
                  const isSelected = selectedTrainNumber === train.number;
                  return (
                    <button
                      key={train.number}
                      type="button"
                      onClick={() => setSelectedTrainNumber(train.number)}
                      aria-pressed={isSelected}
                      className={`text-xs px-2.5 py-1.5 rounded-md font-mono tabular-nums transition-colors duration-200 active:scale-[0.98] ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-semibold border border-emerald-600'
                          : 'bg-slate-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700 hover:border-emerald-500'
                      }`}
                    >
                      {train.name}
                    </button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
