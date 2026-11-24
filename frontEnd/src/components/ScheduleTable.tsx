import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, ArrowRight, ArrowUpDown, ChevronRight } from 'lucide-react';
import { BookingChannel, SeatClass, Train } from '../types/railway';
import {
  calculateFareBreakdown,
  computeRouteSegment,
  formatDuration,
  getWeekdayName,
  isTrainOperatingOnDate,
} from '../data/railway';
import { TAB_SPRING } from './MotionPrimitives';

interface ScheduleTableProps {
  trains: Train[];
  fromStationCode: string;
  toStationCode: string;
  travelDate: string;
  selectedTrainNumber: string;
  onSelectTrain: (trainNumber: string) => void;
  selectedClass: SeatClass | 'ALL';
  bookingChannel: BookingChannel;
  isBengali: boolean;
  onResetFilters?: () => void;
}

type SortField = 'DEPARTURE' | 'DURATION' | 'FARE';

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  trains,
  fromStationCode,
  toStationCode,
  travelDate,
  selectedTrainNumber,
  onSelectTrain,
  selectedClass,
  bookingChannel,
  isBengali,
  onResetFilters,
}) => {
  const [sortField, setSortField] = useState<SortField>('DEPARTURE');
  const [sortAsc, setSortAsc] = useState<boolean>(true);
  const weekday = getWeekdayName(travelDate);

  const toggleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  };

  const rows = trains.map((train) => {
    const segment = computeRouteSegment(train, fromStationCode, toStationCode);
    const fares = calculateFareBreakdown(segment.distanceKm, train.availableClasses, bookingChannel, 1);
    const lowestFare = Math.min(...fares.map((f) => f.totalPerSeat));
    const operating = isTrainOperatingOnDate(train, travelDate);
    return { train, segment, fares, lowestFare, operating };
  });

  const sortedRows = [...rows].sort((a, b) => {
    // Operating trains always surface first unless explicitly reversed
    if (a.operating !== b.operating) {
      return a.operating ? -1 : 1;
    }
    let cmp = 0;
    if (sortField === 'DEPARTURE') {
      cmp = a.segment.departureTime.localeCompare(b.segment.departureTime);
    } else if (sortField === 'DURATION') {
      cmp = a.segment.durationMinutes - b.segment.durationMinutes;
    } else if (sortField === 'FARE') {
      cmp = a.lowestFare - b.lowestFare;
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
            Try swapping origin/destination, unchecking &ldquo;Hide off-day trains&rdquo;, choosing &ldquo;All Classes&rdquo;, or picking a major corridor above.
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
          <div>
            <h2 className="text-sm sm:text-base font-bold text-zinc-900 dark:text-zinc-100">
              {isBengali ? 'ট্রেনের সময়সূচী ও আনুমানিক ভাড়া' : 'Matching Intercity Timetable'}
            </h2>
            <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono tabular-nums mt-0.5">
              {travelDate} ({weekday}) • {bookingChannel === 'ONLINE' ? 'Online (+৳20 fee)' : 'Counter (৳0 fee)'}
            </p>
          </div>
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
              { id: 'FARE', label: 'Lowest Fare' },
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

      {/* High-Density Structured Train Cards */}
      <div className="space-y-3">
        {sortedRows.map(({ train, segment, fares, operating }) => {
          const isSelected = selectedTrainNumber === train.trainNumber;
          const arrivesNextDay =
            (segment.destinationHalt.dayOffset ?? 0) > (segment.originHalt.dayOffset ?? 0);

          return (
            <article
              key={train.trainNumber}
              onClick={() => onSelectTrain(train.trainNumber)}
              className={`p-3.5 sm:p-4 rounded-lg border transition-colors duration-200 cursor-pointer space-y-3 ${
                !operating
                  ? isSelected
                    ? 'border-rose-500 bg-rose-50/40 dark:bg-rose-950/20 ring-1 ring-rose-500/40'
                    : 'border-rose-200 dark:border-rose-900/60 bg-rose-50/20 dark:bg-rose-950/10 opacity-85 hover:opacity-100'
                  : isSelected
                  ? 'border-emerald-600 dark:border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/25 ring-1 ring-emerald-500/40'
                  : 'border-zinc-200 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-950/40 hover:border-zinc-400 dark:hover:border-zinc-700'
              }`}
            >
              {/* Row 1: Identity + Operating Day Status */}
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
                      <span className="font-mono text-zinc-700 dark:text-zinc-300">
                        {train.offDays.length === 0
                          ? 'Runs Daily'
                          : `Off: ${train.offDays.join(', ')}`}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`shrink-0 font-mono text-[10px] font-bold uppercase px-2 py-0.5 rounded-md border tabular-nums ${
                    operating
                      ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                      : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700'
                  }`}
                >
                  {operating ? 'OPERATING' : `OFF-DAY (${weekday.slice(0, 3)})`}
                </span>
              </div>

              {/* Row 2: Segment Departure -> Duration -> Segment Arrival Rail */}
              <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 py-2 px-3 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200/80 dark:border-zinc-800 font-mono tabular-nums">
                <div>
                  <div className="text-[10px] uppercase font-sans text-zinc-500 dark:text-zinc-400">
                    Departs
                  </div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {segment.departureTime}
                  </div>
                  <div className="text-[10px] text-zinc-600 dark:text-zinc-400">
                    {segment.originHalt.stationCode}
                  </div>
                </div>

                <div className="flex flex-col items-center text-center min-w-0 px-1">
                  <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
                    {formatDuration(segment.durationMinutes)}
                  </span>
                  <div className="w-full max-w-[140px] h-[2px] bg-zinc-300 dark:bg-zinc-700 relative my-1.5">
                    <ArrowRight className="w-3 h-3 absolute -right-1 -top-[5px] text-zinc-500 dark:text-zinc-400" />
                  </div>
                  <span className="text-[10px] font-sans text-zinc-600 dark:text-zinc-400 truncate max-w-full">
                    {segment.intermediateStops === 0
                      ? 'Non-stop segment'
                      : `${segment.intermediateStops} intermediate halt${segment.intermediateStops > 1 ? 's' : ''}`}{' '}
                    • {segment.distanceKm} km
                  </span>
                </div>

                <div className="text-right">
                  <div className="text-[10px] uppercase font-sans text-zinc-500 dark:text-zinc-400">
                    Arrives{arrivesNextDay ? ' (+1d)' : ''}
                  </div>
                  <div className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                    {segment.arrivalTime}
                  </div>
                  <div className="text-[10px] text-zinc-600 dark:text-zinc-400">
                    {segment.destinationHalt.stationCode}
                  </div>
                </div>
              </div>

              {/* Row 3: Deterministic Segment Fare Chips + Inspect CTA */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                <div className="flex flex-wrap gap-1.5 font-mono tabular-nums">
                  {fares.map((fare) => {
                    const isTarget = selectedClass === fare.seatClass || selectedClass === 'ALL';
                    return (
                      <div
                        key={fare.seatClass}
                        className={`px-2 py-1 rounded-md text-[11px] border flex items-center gap-1.5 ${
                          isTarget
                            ? 'bg-white dark:bg-zinc-900 border-zinc-200 dark:border-zinc-700'
                            : 'opacity-45 border-zinc-200/50 dark:border-zinc-800'
                        }`}
                      >
                        <span className="text-[10px] font-sans font-semibold text-zinc-600 dark:text-zinc-400">
                          {fare.seatClass}
                        </span>
                        <span className="font-bold text-emerald-700 dark:text-emerald-400">
                          ৳{fare.totalPerSeat}
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
