import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, ArrowUpDown, ChevronRight } from 'lucide-react';
import { Train, SeatClass } from '../types/railway';
import { calculateFares } from '../data/railway';
import { TAB_SPRING } from './MotionPrimitives';

interface ScheduleTableProps {
  trains: Train[];
  selectedTrainNumber: string;
  onSelectTrain: (trainNumber: string) => void;
  selectedClass: SeatClass | 'ALL';
  isBengali: boolean;
  onResetFilters?: () => void;
}

type SortField = 'DEPARTURE' | 'DURATION' | 'AVAILABILITY';

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  trains,
  selectedTrainNumber,
  onSelectTrain,
  selectedClass,
  isBengali,
  onResetFilters,
}) => {
  const [sortField, setSortField] = useState<SortField>('DEPARTURE');
  const [sortAsc, setSortAsc] = useState<boolean>(true);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const sortedTrains = [...trains].sort((a, b) => {
    let cmp = 0;
    if (sortField === 'DEPARTURE') {
      cmp = a.departureTime.localeCompare(b.departureTime);
    } else if (sortField === 'DURATION') {
      cmp = a.durationMinutes - b.durationMinutes;
    } else if (sortField === 'AVAILABILITY') {
      const aFare = calculateFares(a.totalDistanceKm, a.availableClasses);
      const bFare = calculateFares(b.totalDistanceKm, b.availableClasses);
      const aAvail = Object.values(aFare).reduce(
        (acc: number, curr: { available: number }) => acc + curr.available,
        0
      );
      const bAvail = Object.values(bFare).reduce(
        (acc: number, curr: { available: number }) => acc + curr.available,
        0
      );
      cmp = aAvail - bAvail;
    }
    return sortAsc ? cmp : -cmp;
  });

  if (trains.length === 0) {
    return (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6 text-center space-y-3">
        <Clock className="w-8 h-8 text-zinc-500 dark:text-zinc-400 mx-auto" />
        <div>
          <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
            {isBengali ? 'কোনো সরাসরি ট্রেন পাওয়া যায়নি' : 'No Direct Train Services Found'}
          </h3>
          <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 max-w-sm mx-auto leading-relaxed">
            Try swapping your origin and destination, selecting &ldquo;All Classes&rdquo;, or choosing a major transit corridor above.
          </p>
        </div>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="h-9 px-3.5 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold transition-colors active:scale-[0.98]"
          >
            {isBengali ? 'ফিল্টার রিসেট করুন' : 'Reset Route Filters'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 sm:p-5 space-y-4">
      {/* Table Header Controls */}
      <div className="flex flex-col gap-3 pb-3 border-b border-zinc-200 dark:border-zinc-800">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
            {isBengali ? 'ট্রেনের সময়সূচী ও সিট প্রাপ্যতা' : 'Daily Train Timetable'}
          </h2>
          <span className="font-mono text-xs px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 font-bold tabular-nums shrink-0">
            {trains.length} {trains.length === 1 ? 'TRAIN' : 'TRAINS'}
          </span>
        </div>

        {/* Sorting Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <span className="text-[11px] text-zinc-600 dark:text-zinc-400 uppercase font-semibold mr-0.5">
            Sort:
          </span>
          {(
            [
              { id: 'DEPARTURE', label: 'Departure' },
              { id: 'DURATION', label: 'Duration' },
              { id: 'AVAILABILITY', label: 'Seats' },
            ] as const
          ).map((s) => {
            const isActive = sortField === s.id;
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => toggleSort(s.id)}
                aria-pressed={isActive}
                className={`relative px-2.5 py-1.5 rounded-md text-[11px] font-semibold inline-flex items-center gap-1 transition-colors duration-200 active:scale-[0.98] ${
                  isActive
                    ? 'text-white dark:text-zinc-950'
                    : 'bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:border-zinc-400'
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="schedule-sort-pill"
                    transition={TAB_SPRING}
                    className="absolute inset-0 rounded-md bg-zinc-900 dark:bg-zinc-100"
                  />
                )}
                <span className="relative z-10">{s.label}</span>
                <ArrowUpDown className="w-3 h-3 relative z-10" />
              </button>
            );
          })}
        </div>
      </div>

      {/* High-Density Structured Train Cards (Zero Clipping / Zero Crushing) */}
      <div className="space-y-3">
        {sortedTrains.map((train) => {
          const isSelected = selectedTrainNumber === train.trainNumber;
          const fares = calculateFares(train.totalDistanceKm, train.availableClasses);
          const originHalt = train.halts[0];
          const terminusHalt = train.halts[train.halts.length - 1];
          const isDelayed = train.liveStatus.state === 'DELAYED';

          return (
            <article
              key={train.trainNumber}
              onClick={() => onSelectTrain(train.trainNumber)}
              className={`p-3.5 sm:p-4 rounded-lg border transition-colors duration-200 cursor-pointer space-y-3 ${
                isSelected
                  ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/25 ring-1 ring-emerald-500/40'
                  : 'border-zinc-200 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-950/40 hover:border-zinc-400 dark:hover:border-zinc-700'
              }`}
            >
              {/* Row 1: Identity + Status */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-start gap-2.5 min-w-0">
                  <span className="font-mono text-xs sm:text-sm font-bold px-2 py-1 rounded-md bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 shrink-0 tabular-nums">
                    {train.trainNumber}
                  </span>
                  <div className="min-w-0">
                    <h3 className="font-bold text-sm text-zinc-900 dark:text-zinc-100 leading-snug truncate">
                      {isBengali ? train.trainNameBn : train.trainName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5">
                      <span>{train.routeType}</span>
                      <span aria-hidden="true">•</span>
                      <span className="font-mono text-rose-700 dark:text-rose-400 font-semibold">
                        Off: {train.offDays.join(', ')}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`shrink-0 font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border tabular-nums ${
                    isDelayed
                      ? 'bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-500/30'
                      : 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/30'
                  }`}
                >
                  {isDelayed ? `+${train.liveStatus.delayMinutes}m DELAY` : 'ON TIME'}
                </span>
              </div>

              {/* Row 2: Clean Departure -> Duration -> Arrival Rail */}
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2 px-3 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 font-mono tabular-nums">
                <div>
                  <div className="text-[10px] uppercase font-sans text-zinc-500 dark:text-zinc-400">
                    Departs
                  </div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {train.departureTime}
                  </div>
                  <div className="text-[10px] text-zinc-600 dark:text-zinc-400">
                    {originHalt.stationCode}
                  </div>
                </div>

                <div className="flex flex-col items-center text-center min-w-0 px-1">
                  <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                    {Math.floor(train.durationMinutes / 60)}h {train.durationMinutes % 60}m
                  </span>
                  <div className="w-full max-w-[140px] h-[2px] bg-zinc-300 dark:bg-zinc-700 relative my-1.5">
                    <ArrowRight className="w-3 h-3 absolute -right-1 -top-[5px] text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <span className="text-[10px] font-sans text-zinc-600 dark:text-zinc-400 truncate max-w-full">
                    {train.halts.length} stops • {train.totalDistanceKm} km
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-sans text-zinc-500 dark:text-zinc-400">
                    Arrives
                  </div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {train.arrivalTime}
                  </div>
                  <div className="text-[10px] text-zinc-600 dark:text-zinc-400">
                    {terminusHalt.stationCode}
                  </div>
                </div>
              </div>

              {/* Row 3: Horizontal Seat Availability Chips + Action Button */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="flex flex-wrap gap-1.5 font-mono tabular-nums">
                  {train.availableClasses.map((cls) => {
                    const fare = fares[cls];
                    if (!fare) return null;
                    const isTarget = selectedClass === cls || selectedClass === 'ALL';
                    return (
                      <div
                        key={cls}
                        className={`px-2 py-1 rounded-md text-[11px] border flex items-center gap-1.5 ${
                          isTarget
                            ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700'
                            : 'opacity-45 border-zinc-200/50 dark:border-zinc-800'
                        }`}
                      >
                        <span className="text-[10px] font-sans font-semibold text-zinc-600 dark:text-zinc-400">
                          {cls}
                        </span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          ৳{fare.total}
                        </span>
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-400">
                          ({fare.available})
                        </span>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelectTrain(train.trainNumber);
                  }}
                  className={`h-9 px-3 rounded-md text-xs font-semibold inline-flex items-center gap-1 transition-colors duration-200 shrink-0 active:scale-[0.98] ${
                    isSelected
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : 'bg-white dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-700 border border-zinc-300 dark:border-zinc-700'
                  }`}
                >
                  <span>{isSelected ? 'Viewing' : 'Inspect'}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
