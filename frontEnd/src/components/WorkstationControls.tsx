import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeftRight, Calendar, RotateCcw, Search, Train as TrainIcon } from 'lucide-react';
import { StationSelector } from './StationSelector';
import { TRAINS, TRANSIT_CORRIDORS, getWeekdayName } from '../data/railway';
import { SeatClass, TransitCorridor } from '../types/railway';
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
  activeCorridorId: string;
  onSelectCorridor: (corridor: TransitCorridor) => void;
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
  { number: '702', name: 'Subarna Express' },
  { number: '788', name: 'Sonar Bangla' },
  { number: '753', name: 'Silk City' },
  { number: '759', name: 'Padma Express' },
  { number: '709', name: 'Parabat Express' },
  { number: '726', name: 'Sundarban' },
  { number: '771', name: 'Rangpur Express' },
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
  activeCorridorId,
  onSelectCorridor,
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
      aria-label="Plan Your Train Journey"
      className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-5 sm:p-7 shadow-xs transition-colors duration-200 space-y-6"
    >
      {/* Calm Welcoming Header + Simple Search Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-100">
            {isBengali ? 'আপনার ট্রেন যাত্রা পরিকল্পনা করুন' : 'Plan Your Train Journey'}
          </h1>
          <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1">
            {isBengali
              ? 'আন্তঃনগর ট্রেনের সময়সূচী, স্টপ এবং টিকেটের ভাড়া সহজে জানুন।'
              : 'Find intercity train times, check stops along the way, and calculate ticket fares.'}
          </p>
        </div>

        {/* Simple 2-Tab Search Switcher */}
        <div
          role="tablist"
          aria-label="Search method"
          className="inline-flex p-1 bg-slate-100 dark:bg-zinc-950 rounded-lg border border-slate-200 dark:border-zinc-800 self-start sm:self-auto shrink-0"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === 'JOURNEY'}
            onClick={() => setMode('JOURNEY')}
            className={`relative min-h-[38px] px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-colors duration-200 active:scale-[0.98] ${
              mode === 'JOURNEY'
                ? 'text-slate-900 dark:text-zinc-100'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            {mode === 'JOURNEY' && (
              <motion.span
                layoutId="search-mode-pill"
                transition={TAB_SPRING}
                className="absolute inset-0 rounded-md bg-white dark:bg-zinc-800 shadow-xs border border-slate-200/80 dark:border-zinc-700"
              />
            )}
            <Search className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 relative z-10" />
            <span className="relative z-10">{isBengali ? 'রুট অনুযায়ী' : 'By Route'}</span>
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === 'TRACKER'}
            onClick={() => setMode('TRACKER')}
            className={`relative min-h-[38px] px-3.5 py-1.5 rounded-md text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-colors duration-200 active:scale-[0.98] ${
              mode === 'TRACKER'
                ? 'text-slate-900 dark:text-zinc-100'
                : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
            }`}
          >
            {mode === 'TRACKER' && (
              <motion.span
                layoutId="search-mode-pill"
                transition={TAB_SPRING}
                className="absolute inset-0 rounded-md bg-white dark:bg-zinc-800 shadow-xs border border-slate-200/80 dark:border-zinc-700"
              />
            )}
            <TrainIcon className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 relative z-10" />
            <span className="relative z-10">{isBengali ? 'ট্রেনের নাম দিয়ে' : 'By Train Name'}</span>
          </button>
        </div>
      </div>

      {/* Animated Mode Panel */}
      <AnimatePresence mode="wait">
        {mode === 'JOURNEY' ? (
          <motion.div
            key="search-by-route"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: TRANSIT_EASE }}
            className="space-y-6"
          >
            {/* Quick-pick Popular Routes */}
            <div className="space-y-2">
              <span className="block text-xs font-medium text-slate-600 dark:text-zinc-400">
                {isBengali ? 'জনপ্রিয় রুটসমূহ' : 'Popular Routes'}
              </span>
              <div className="flex flex-wrap gap-2">
                {TRANSIT_CORRIDORS.map((corridor) => {
                  const isActive = activeCorridorId === corridor.id;
                  return (
                    <button
                      key={corridor.id}
                      type="button"
                      onClick={() => onSelectCorridor(corridor)}
                      aria-pressed={isActive}
                      className={`relative px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 active:scale-[0.98] ${
                        isActive
                          ? 'text-white'
                          : 'bg-slate-50 dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-800 hover:border-emerald-500'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="popular-route-pill"
                          transition={TAB_SPRING}
                          className="absolute inset-0 rounded-lg bg-emerald-600"
                        />
                      )}
                      <span className="relative z-10">
                        {isBengali ? corridor.labelBn : corridor.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* From -> Swap -> To */}
            <div className="flex flex-col md:flex-row items-stretch md:items-start gap-3">
              <StationSelector
                label="From"
                labelBn="কোথা থেকে"
                selectedStationCode={fromStationCode}
                onSelectStation={setFromStationCode}
                excludeCode={toStationCode}
                isBengali={isBengali}
              />

              <div className="flex justify-center md:pt-[28px]">
                <button
                  type="button"
                  onClick={handleSwap}
                  aria-label="Swap From and To stations"
                  title="Swap From and To stations"
                  className="h-11 w-11 rounded-lg border border-slate-300 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-950 hover:bg-emerald-50 dark:hover:bg-zinc-800 hover:border-emerald-500 flex items-center justify-center text-slate-700 dark:text-zinc-200 transition-colors duration-200 active:scale-[0.96]"
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
                label="To"
                labelBn="কোথায় যাবেন"
                selectedStationCode={toStationCode}
                onSelectStation={setToStationCode}
                excludeCode={fromStationCode}
                isBengali={isBengali}
              />
            </div>

            {/* Travel Day & Seat Class */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-5 border-t border-slate-200 dark:border-zinc-800">
              {/* Travel Day */}
              <div className="md:col-span-5 space-y-2">
                <label
                  htmlFor="raildesk-travel-date"
                  className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-zinc-300"
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>{isBengali ? 'যাত্রার দিন' : 'Travel Day'}</span>
                  </span>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {selectedWeekday}
                  </span>
                </label>

                <input
                  id="raildesk-travel-date"
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full min-h-[44px] px-3.5 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm tabular-nums text-slate-900 dark:text-zinc-100"
                />

                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { days: 0, en: 'Today', bn: 'আজ' },
                    { days: 1, en: 'Tomorrow', bn: 'আগামীকাল' },
                    { days: 2, en: 'In 2 Days', bn: '২ দিন পর' },
                  ].map((item) => (
                    <button
                      key={item.days}
                      type="button"
                      onClick={() => handleDateOffset(item.days)}
                      className="text-xs px-2.5 py-1 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200/80 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 transition-colors active:scale-[0.98]"
                    >
                      {isBengali ? item.bn : item.en}
                    </button>
                  ))}
                </div>
              </div>

              {/* Seat Class */}
              <div className="md:col-span-7 flex flex-col justify-between gap-3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium text-slate-700 dark:text-zinc-300">
                      {isBengali ? 'আসনের শ্রেণি' : 'Seat Class'}
                    </span>
                    <button
                      type="button"
                      onClick={onResetFilters}
                      className="text-xs text-slate-600 dark:text-zinc-400 hover:text-emerald-700 dark:hover:text-emerald-400 inline-flex items-center gap-1 transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{isBengali ? 'রিসেট' : 'Reset'}</span>
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {CLASS_OPTIONS.map((opt) => {
                      const isSelected = selectedClass === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setSelectedClass(opt.id)}
                          aria-pressed={isSelected}
                          className={`relative min-h-[38px] px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors duration-200 active:scale-[0.98] ${
                            isSelected
                              ? 'text-white'
                              : 'bg-slate-50 dark:bg-zinc-950 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 hover:border-emerald-500'
                          }`}
                        >
                          {isSelected && (
                            <motion.span
                              layoutId="seat-class-pill"
                              transition={TAB_SPRING}
                              className="absolute inset-0 rounded-lg bg-emerald-600"
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

                {/* Friendly Operating-Day Toggle */}
                <label className="inline-flex items-center gap-2 text-xs sm:text-sm text-slate-700 dark:text-zinc-300 cursor-pointer select-none w-fit">
                  <input
                    type="checkbox"
                    checked={hideOffDayTrains}
                    onChange={(e) => setHideOffDayTrains(e.target.checked)}
                    className="h-4 w-4 rounded accent-emerald-600 cursor-pointer"
                  />
                  <span>
                    {isBengali
                      ? `শুধু ${selectedWeekday} চলাচলকারী ট্রেন দেখান`
                      : `Only show trains running on ${selectedWeekday}`}
                  </span>
                </label>
              </div>
            </div>
          </motion.div>
        ) : (
          /* Find by Train Name */
          <motion.div
            key="search-by-train"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.22, ease: TRANSIT_EASE }}
            className="space-y-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8">
                <label
                  htmlFor="raildesk-train-select"
                  className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5"
                >
                  {isBengali ? 'ট্রেন নির্বাচন করুন' : 'Choose a Train'}
                </label>
                <select
                  id="raildesk-train-select"
                  value={selectedTrainNumber}
                  onChange={(e) => setSelectedTrainNumber(e.target.value)}
                  className="w-full min-h-[46px] px-3.5 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm font-medium text-slate-900 dark:text-zinc-100"
                >
                  {TRAINS.map((t) => (
                    <option key={t.trainNumber} value={t.trainNumber}>
                      {t.trainName} (#{t.trainNumber}) — {t.halts[0].stationName} to{' '}
                      {t.halts[t.halts.length - 1].stationName} ({t.departureTime})
                    </option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-4">
                <label
                  htmlFor="raildesk-train-date"
                  className="flex items-center justify-between text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5"
                >
                  <span>{isBengali ? 'যাত্রার দিন' : 'Travel Day'}</span>
                  <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">
                    {selectedWeekday}
                  </span>
                </label>
                <input
                  id="raildesk-train-date"
                  type="date"
                  value={travelDate}
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full min-h-[46px] px-3.5 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg text-sm tabular-nums text-slate-900 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <span className="block text-xs font-medium text-slate-600 dark:text-zinc-400">
                {isBengali ? 'জনপ্রিয় ট্রেন' : 'Popular Trains'}
              </span>
              <div className="flex flex-wrap gap-2">
                {POPULAR_TRAINS.map((train) => {
                  const isSelected = selectedTrainNumber === train.number;
                  return (
                    <button
                      key={train.number}
                      type="button"
                      onClick={() => setSelectedTrainNumber(train.number)}
                      aria-pressed={isSelected}
                      className={`text-xs sm:text-sm px-3 py-1.5 rounded-lg transition-colors duration-200 active:scale-[0.98] ${
                        isSelected
                          ? 'bg-emerald-600 text-white font-semibold'
                          : 'bg-slate-50 dark:bg-zinc-950 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 hover:border-emerald-500'
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
