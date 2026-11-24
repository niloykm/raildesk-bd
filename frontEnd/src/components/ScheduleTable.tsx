import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  ChevronDown,
  Clock,
  MapPin,
  Receipt,
  Ticket,
} from 'lucide-react';
import { BookingChannel, SeatClass, Train } from '../types/railway';
import {
  calculateFareBreakdown,
  computeRouteSegment,
  formatDuration,
  getWeekdayName,
  isTrainOperatingOnDate,
  SEAT_CLASS_META,
} from '../data/railway';
import { TrainTimeline } from './TrainTimeline';
import { FareCalculator } from './FareCalculator';
import { JourneyCard } from './JourneyCard';
import { TAB_SPRING, TRANSIT_EASE } from './MotionPrimitives';

export type ExpandedPanel = 'STOPS' | 'FARE' | 'SUMMARY';

interface ScheduleTableProps {
  trains: Train[];
  fromStationCode?: string;
  toStationCode?: string;
  travelDate: string;
  expandedTrainNumber: string | null;
  expandedPanel: ExpandedPanel;
  onToggleTrainPanel: (trainNumber: string, panel: ExpandedPanel) => void;
  selectedClass: SeatClass | 'ALL';
  onSelectClass: (cls: SeatClass) => void;
  bookingChannel: BookingChannel;
  setBookingChannel: (channel: BookingChannel) => void;
  passengers: number;
  setPassengers: (count: number) => void;
  isBengali: boolean;
  onResetFilters?: () => void;
  headingOverride?: string;
}

type SortField = 'DEPARTURE' | 'DURATION' | 'FARE';

export const ScheduleTable: React.FC<ScheduleTableProps> = ({
  trains,
  fromStationCode,
  toStationCode,
  travelDate,
  expandedTrainNumber,
  expandedPanel,
  onToggleTrainPanel,
  selectedClass,
  onSelectClass,
  bookingChannel,
  setBookingChannel,
  passengers,
  setPassengers,
  isBengali,
  onResetFilters,
  headingOverride,
}) => {
  const [sortField, setSortField] = useState<SortField>('DEPARTURE');
  const weekday = getWeekdayName(travelDate);

  const rows = trains.map((train) => {
    const segment = computeRouteSegment(train, fromStationCode, toStationCode);
    const fares = calculateFareBreakdown(
      segment.distanceKm,
      train.availableClasses,
      bookingChannel,
      1
    );
    const matchingClassFare =
      selectedClass !== 'ALL'
        ? fares.find((f) => f.seatClass === selectedClass)
        : undefined;
    const lowestFare = fares.reduce(
      (min, f) => (f.totalPerSeat < min.totalPerSeat ? f : min),
      fares[0]
    );
    const displayFare = matchingClassFare || lowestFare;
    const operating = isTrainOperatingOnDate(train, travelDate);
    return { train, segment, displayFare, lowestFare, operating };
  });

  const sortedRows = [...rows].sort((a, b) => {
    if (a.operating !== b.operating) {
      return a.operating ? -1 : 1;
    }
    if (sortField === 'DEPARTURE') {
      return a.segment.departureTime.localeCompare(b.segment.departureTime);
    }
    if (sortField === 'DURATION') {
      return a.segment.durationMinutes - b.segment.durationMinutes;
    }
    return a.displayFare.totalPerSeat - b.displayFare.totalPerSeat;
  });

  if (trains.length === 0) {
    return (
      <section className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-xl p-8 text-center space-y-3">
        <Clock className="w-8 h-8 text-slate-400 dark:text-zinc-500 mx-auto" />
        <div>
          <h2 className="font-semibold text-base text-slate-900 dark:text-zinc-100">
            {isBengali ? 'কোনো সরাসরি ট্রেন পাওয়া যায়নি' : 'No Direct Trains Found'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1 max-w-md mx-auto">
            {isBengali
              ? 'অন্য স্টেশন, দিন বা সকল শ্রেণি বেছে নিয়ে আবার চেষ্টা করুন।'
              : 'Try swapping stations, choosing another travel day, or selecting All Classes.'}
          </p>
        </div>
        {onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="h-10 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors active:scale-[0.98]"
          >
            {isBengali ? 'ফিল্টার রিসেট করুন' : 'Reset Search'}
          </button>
        )}
      </section>
    );
  }

  return (
    <section aria-label="Available Trains" className="space-y-4">
      {/* Clean Results Header & Sort Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-zinc-100">
            {headingOverride || (isBengali ? 'উপলব্ধ ট্রেনসমূহ' : 'Available Trains')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 tabular-nums mt-0.5">
            {trains.length} {trains.length === 1 ? 'train' : 'trains'} for {weekday}, {travelDate}
          </p>
        </div>

        {trains.length > 1 && (
          <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 self-start sm:self-auto">
            {(
              [
                { id: 'DEPARTURE', label: 'Earliest', labelBn: 'সবার আগে' },
                { id: 'DURATION', label: 'Fastest', labelBn: 'দ্রুততম' },
                { id: 'FARE', label: 'Lowest Fare', labelBn: 'কম ভাড়া' },
              ] as const
            ).map((opt) => {
              const active = sortField === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setSortField(opt.id)}
                  aria-pressed={active}
                  className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 active:scale-[0.98] ${
                    active
                      ? 'text-white'
                      : 'text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-zinc-100'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="sort-trains-pill"
                      transition={TAB_SPRING}
                      className="absolute inset-0 rounded-md bg-emerald-600"
                    />
                  )}
                  <span className="relative z-10">{isBengali ? opt.labelBn : opt.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Step 2: Clean, Spacious Passenger Train Cards */}
      <div className="space-y-4">
        {sortedRows.map(({ train, segment, displayFare, operating }) => {
          const isExpanded = expandedTrainNumber === train.trainNumber;
          const isStopsOpen = isExpanded && expandedPanel === 'STOPS';
          const isFareOpen = isExpanded && (expandedPanel === 'FARE' || expandedPanel === 'SUMMARY');
          const arrivesNextDay =
            (segment.destinationHalt.dayOffset ?? 0) > (segment.originHalt.dayOffset ?? 0);

          const effectiveClass: SeatClass =
            selectedClass !== 'ALL' && train.availableClasses.includes(selectedClass)
              ? selectedClass
              : train.availableClasses[0] || 'S_CHAIR';

          const pricePrefix =
            selectedClass !== 'ALL' && train.availableClasses.includes(selectedClass)
              ? SEAT_CLASS_META[selectedClass].name.split(' ')[0]
              : isBengali
              ? 'শুরু'
              : 'From';

          return (
            <article
              key={train.trainNumber}
              className={`bg-white dark:bg-zinc-900 rounded-xl border transition-all duration-200 overflow-hidden ${
                !operating
                  ? 'border-rose-200 dark:border-rose-900/60'
                  : isExpanded
                  ? 'border-emerald-500/80 dark:border-emerald-500/70 shadow-sm'
                  : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
              }`}
            >
              {/* Main Scannable Train Summary */}
              <div className="p-5 sm:p-6 space-y-5">
                {/* Top Row: Train Name + Operating Pill | Ticket Fare */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-zinc-100 leading-snug">
                        {isBengali ? train.trainNameBn : train.trainName}
                      </h3>
                      <span className="font-mono text-xs font-medium text-slate-500 dark:text-zinc-400 tabular-nums">
                        #{train.trainNumber}
                      </span>
                      <span
                        className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${
                          operating
                            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                            : 'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300'
                        }`}
                      >
                        {operating
                          ? isBengali
                            ? `${weekday} চালু`
                            : `Runs ${weekday}`
                          : isBengali
                          ? `${weekday} বন্ধ`
                          : `Off on ${weekday}`}
                      </span>
                    </div>

                    <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
                      {train.offDays.length === 0
                        ? isBengali
                          ? 'প্রতিদিন চলাচল করে'
                          : 'Runs every day of the week'
                        : isBengali
                        ? `সাপ্তাহিক বন্ধ: ${train.offDays.join(', ')}`
                        : `Weekly off-day: ${train.offDays.join(', ')}`}
                    </p>
                  </div>

                  {/* Ticket Price */}
                  <div className="text-left sm:text-right shrink-0">
                    <div className="text-xs text-slate-500 dark:text-zinc-400">
                      {isBengali ? 'টিকেটের ভাড়া' : 'Ticket Fare'}
                    </div>
                    <div className="flex items-baseline sm:justify-end gap-1.5 mt-0.5 tabular-nums">
                      <span className="text-xs font-medium text-slate-600 dark:text-zinc-400">
                        {pricePrefix}
                      </span>
                      <span className="font-mono text-xl font-bold text-emerald-700 dark:text-emerald-400">
                        ৳ {displayFare.totalPerSeat}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Middle Row: Prominent Departure -> Duration -> Arrival */}
                <div className="grid grid-cols-[auto_1fr_auto] items-center gap-3 sm:gap-6 py-3.5 px-4 rounded-lg bg-slate-50 dark:bg-zinc-950/80 border border-slate-100 dark:border-zinc-800/80">
                  <div>
                    <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tabular-nums leading-none">
                      {segment.departureTime}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-400 mt-1">
                      <span className="sm:hidden">
                        {isBengali
                          ? segment.originHalt.stationNameBn.split(' ')[0]
                          : segment.originHalt.stationName.replace('Dhaka (Kamalapur)', 'Kamalapur').replace('Dhaka Biman Bandar', 'Biman Bandar')}
                      </span>
                      <span className="hidden sm:inline">
                        {isBengali
                          ? segment.originHalt.stationNameBn
                          : segment.originHalt.stationName}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col items-center text-center min-w-0 px-1">
                    <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-zinc-200 tabular-nums whitespace-nowrap">
                      {formatDuration(segment.durationMinutes)}
                    </span>
                    <div className="w-full max-w-[180px] h-[1.5px] bg-slate-300 dark:bg-zinc-700 relative my-2">
                      <ArrowRight className="w-3.5 h-3.5 absolute -right-1 -top-[6px] text-slate-400 dark:text-zinc-500" />
                    </div>
                    <span className="text-xs text-slate-500 dark:text-zinc-400 tabular-nums whitespace-nowrap">
                      {segment.intermediateStops === 0
                        ? isBengali
                          ? 'নন-স্টপ'
                          : 'Non-stop'
                        : `${segment.intermediateStops} ${
                            segment.intermediateStops === 1 ? 'stop' : 'stops'
                          }`}{' '}
                      • {segment.distanceKm} km
                    </span>
                  </div>

                  <div className="text-right">
                    <div className="font-mono text-xl sm:text-2xl font-bold text-slate-900 dark:text-zinc-100 tabular-nums leading-none">
                      {segment.arrivalTime}
                      {arrivesNextDay && (
                        <span className="text-[11px] font-sans font-semibold text-amber-700 dark:text-amber-400 ml-1 align-top">
                          +1d
                        </span>
                      )}
                    </div>
                    <div className="text-xs sm:text-sm font-medium text-slate-600 dark:text-zinc-400 mt-1">
                      <span className="sm:hidden">
                        {isBengali
                          ? segment.destinationHalt.stationNameBn.split(' ')[0]
                          : segment.destinationHalt.stationName.replace('Dhaka (Kamalapur)', 'Kamalapur').replace('Dhaka Biman Bandar', 'Biman Bandar')}
                      </span>
                      <span className="hidden sm:inline">
                        {isBengali
                          ? segment.destinationHalt.stationNameBn
                          : segment.destinationHalt.stationName}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Row: Calm Stops & Fare Details Toggles */}
                <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                  <div className="text-xs text-slate-500 dark:text-zinc-400">
                    {train.availableClasses.length}{' '}
                    {isBengali ? 'টি আসন শ্রেণি উপলব্ধ' : 'seat classes available'}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                    <button
                      type="button"
                      onClick={() => onToggleTrainPanel(train.trainNumber, 'STOPS')}
                      aria-expanded={isStopsOpen}
                      className={`flex-1 sm:flex-initial min-h-[42px] px-4 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 border transition-colors duration-200 active:scale-[0.98] ${
                        isStopsOpen
                          ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                          : 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border-slate-300 dark:border-zinc-700 hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <MapPin className="w-4 h-4 shrink-0" />
                      <span>{isBengali ? 'স্টপসমূহ' : 'Stops'}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                          isStopsOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>

                    <button
                      type="button"
                      onClick={() => onToggleTrainPanel(train.trainNumber, 'FARE')}
                      aria-expanded={isFareOpen}
                      className={`flex-1 sm:flex-initial min-h-[42px] px-4 rounded-lg text-xs sm:text-sm font-semibold inline-flex items-center justify-center gap-1.5 border transition-colors duration-200 active:scale-[0.98] ${
                        isFareOpen
                          ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700'
                          : 'bg-white dark:bg-zinc-900 text-slate-800 dark:text-zinc-200 border-slate-300 dark:border-zinc-700 hover:border-emerald-500 hover:bg-slate-50 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <Receipt className="w-4 h-4 shrink-0" />
                      <span>{isBengali ? 'ভাড়ার বিবরণ' : 'Fare Details'}</span>
                      <ChevronDown
                        className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                          isFareOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Step 3: Expandable Stops & Ticket Fare Drawer */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    key={`drawer-${train.trainNumber}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: TRANSIT_EASE }}
                    className="overflow-hidden border-t border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-950/40"
                  >
                    <div className="p-5 sm:p-6 space-y-5">
                      {/* Inner Tab Switcher with layoutId */}
                      <div
                        role="tablist"
                        aria-label="Train Details"
                        className="inline-flex flex-wrap p-1 rounded-lg bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 gap-1"
                      >
                        {(
                          [
                            {
                              id: 'STOPS' as const,
                              icon: <MapPin className="w-3.5 h-3.5" />,
                              shortLabel: 'Stops',
                              label: 'Stops Along the Way',
                              labelBn: 'স্টপসমূহ',
                            },
                            {
                              id: 'FARE' as const,
                              icon: <Receipt className="w-3.5 h-3.5" />,
                              shortLabel: 'Fare',
                              label: 'Ticket Fare',
                              labelBn: 'টিকেটের ভাড়া',
                            },
                            {
                              id: 'SUMMARY' as const,
                              icon: <Ticket className="w-3.5 h-3.5" />,
                              shortLabel: 'Summary',
                              label: 'Trip Summary',
                              labelBn: 'যাত্রার সারাংশ',
                            },
                          ]
                        ).map((tab) => {
                          const active = expandedPanel === tab.id;
                          return (
                            <button
                              key={tab.id}
                              type="button"
                              role="tab"
                              aria-selected={active}
                              onClick={() => {
                                if (!active) onToggleTrainPanel(train.trainNumber, tab.id);
                              }}
                              className={`relative px-2.5 sm:px-3 py-1.5 rounded-md text-xs sm:text-sm font-medium inline-flex items-center gap-1.5 transition-colors duration-200 active:scale-[0.98] ${
                                active
                                  ? 'text-slate-900 dark:text-zinc-100'
                                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-200'
                              }`}
                            >
                              {active && (
                                <motion.span
                                  layoutId={`card-tab-${train.trainNumber}`}
                                  transition={TAB_SPRING}
                                  className="absolute inset-0 rounded-md bg-white dark:bg-zinc-800 shadow-xs border border-slate-200/80 dark:border-zinc-700"
                                />
                              )}
                              <span className="relative z-10 inline-flex items-center gap-1.5">
                                {tab.icon}
                                {isBengali ? (
                                  <span>{tab.labelBn}</span>
                                ) : (
                                  <>
                                    <span className="sm:hidden">{tab.shortLabel}</span>
                                    <span className="hidden sm:inline">{tab.label}</span>
                                  </>
                                )}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* Switched Panel Content */}
                      <AnimatePresence mode="wait">
                        {expandedPanel === 'STOPS' && (
                          <motion.div
                            key={`stops-${train.trainNumber}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2, ease: TRANSIT_EASE }}
                          >
                            <TrainTimeline
                              train={train}
                              segment={segment}
                              travelDate={travelDate}
                              isBengali={isBengali}
                            />
                          </motion.div>
                        )}

                        {expandedPanel === 'FARE' && (
                          <motion.div
                            key={`fare-${train.trainNumber}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2, ease: TRANSIT_EASE }}
                          >
                            <FareCalculator
                              segment={segment}
                              availableClasses={train.availableClasses}
                              selectedClass={effectiveClass}
                              onSelectClass={onSelectClass}
                              bookingChannel={bookingChannel}
                              setBookingChannel={setBookingChannel}
                              passengers={passengers}
                              setPassengers={setPassengers}
                              isBengali={isBengali}
                              onOpenTripSummary={() =>
                                onToggleTrainPanel(train.trainNumber, 'SUMMARY')
                              }
                            />
                          </motion.div>
                        )}

                        {expandedPanel === 'SUMMARY' && (
                          <motion.div
                            key={`summary-${train.trainNumber}`}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2, ease: TRANSIT_EASE }}
                          >
                            <JourneyCard
                              train={train}
                              segment={segment}
                              travelDate={travelDate}
                              seatClass={effectiveClass}
                              bookingChannel={bookingChannel}
                              passengers={passengers}
                              isBengali={isBengali}
                            />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </article>
          );
        })}
      </div>
    </section>
  );
};
