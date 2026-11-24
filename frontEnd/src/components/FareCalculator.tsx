import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Minus, Plus, Ticket } from 'lucide-react';
import { BookingChannel, RouteSegment, SeatClass } from '../types/railway';
import {
  DATASET_METADATA,
  SEAT_CLASS_META,
  calculateFareBreakdown,
} from '../data/railway';
import { TAB_SPRING } from './MotionPrimitives';

interface FareCalculatorProps {
  segment: RouteSegment;
  availableClasses: SeatClass[];
  selectedClass: SeatClass;
  onSelectClass: (cls: SeatClass) => void;
  bookingChannel: BookingChannel;
  setBookingChannel: (channel: BookingChannel) => void;
  passengers: number;
  setPassengers: (count: number) => void;
  isBengali: boolean;
  onOpenTripSummary?: () => void;
}

export const FareCalculator: React.FC<FareCalculatorProps> = ({
  segment,
  availableClasses,
  selectedClass,
  onSelectClass,
  bookingChannel,
  setBookingChannel,
  passengers,
  setPassengers,
  isBengali,
  onOpenTripSummary,
}) => {
  const fares = calculateFareBreakdown(
    segment.distanceKm,
    availableClasses,
    bookingChannel,
    passengers
  );

  const selectedFare = fares.find((f) => f.seatClass === selectedClass) || fares[0];

  return (
    <div className="space-y-4">
      {/* Friendly Controls Row: Passengers + Online/Counter Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800">
        {/* Passenger Stepper */}
        <div className="flex items-center justify-between sm:justify-start gap-3">
          <div>
            <span className="block text-xs font-medium text-slate-700 dark:text-zinc-300">
              {isBengali ? 'যাত্রী সংখ্যা' : 'Passengers'}
            </span>
            <span className="block text-[11px] text-slate-500 dark:text-zinc-400">
              {isBengali ? 'সর্বোচ্চ ৪টি আসন' : 'Up to 4 seats per ticket'}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg p-1">
            <button
              type="button"
              onClick={() => setPassengers(Math.max(1, passengers - 1))}
              disabled={passengers <= 1}
              aria-label="Decrease passengers"
              className="h-8 w-8 rounded-md flex items-center justify-center text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors active:scale-[0.96]"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span
              className="w-7 text-center font-mono font-bold text-sm tabular-nums text-slate-900 dark:text-zinc-100"
              aria-live="polite"
            >
              {passengers}
            </span>
            <button
              type="button"
              onClick={() => setPassengers(Math.min(4, passengers + 1))}
              disabled={passengers >= 4}
              aria-label="Increase passengers"
              className="h-8 w-8 rounded-md flex items-center justify-center text-slate-700 dark:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors active:scale-[0.96]"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ticket Purchase Type Toggle */}
        <div className="inline-flex p-1 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 self-start sm:self-auto">
          {(
            [
              { id: 'ONLINE', label: 'Online (+৳20/seat)', labelBn: 'অনলাইন (+৳২০)' },
              { id: 'COUNTER', label: 'Station Counter', labelBn: 'কাউন্টার' },
            ] as const
          ).map((opt) => {
            const active = bookingChannel === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => setBookingChannel(opt.id)}
                aria-pressed={active}
                className={`relative px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-200 active:scale-[0.98] ${
                  active ? 'text-white' : 'text-slate-700 dark:text-zinc-300'
                }`}
              >
                {active && (
                  <motion.span
                    layoutId={`channel-pill-${segment.train.trainNumber}`}
                    transition={TAB_SPRING}
                    className="absolute inset-0 rounded-md bg-emerald-600"
                  />
                )}
                <span className="relative z-10">{isBengali ? opt.labelBn : opt.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Clean Per-Class Fare List (No cramped horizontal scroll on mobile!) */}
      <div className="divide-y divide-slate-200 dark:divide-zinc-800 border border-slate-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-white dark:bg-zinc-900">
        {fares.map((fare) => {
          const meta = SEAT_CLASS_META[fare.seatClass];
          const isSelected = selectedClass === fare.seatClass;
          const parts: string[] = [`Base ৳${fare.baseFarePerSeat}`];
          if (fare.vatAmountPerSeat > 0) parts.push(`15% VAT ৳${fare.vatAmountPerSeat}`);
          if (fare.beddingChargePerSeat > 0) parts.push(`Bedding ৳${fare.beddingChargePerSeat}`);
          if (fare.serviceChargePerSeat > 0) parts.push(`Online fee ৳${fare.serviceChargePerSeat}`);

          return (
            <button
              key={fare.seatClass}
              type="button"
              onClick={() => onSelectClass(fare.seatClass)}
              className={`w-full p-3.5 sm:p-4 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-2 transition-colors duration-150 ${
                isSelected
                  ? 'bg-emerald-50/70 dark:bg-emerald-950/30'
                  : 'hover:bg-slate-50 dark:hover:bg-zinc-800/40'
              }`}
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-sm text-slate-900 dark:text-zinc-100">
                    {isBengali ? fare.classNameBn : fare.className}
                  </span>
                  {isSelected && (
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-600 text-white">
                      {isBengali ? 'নির্বাচিত' : 'Selected'}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5 tabular-nums">
                  {parts.join(' + ')} • Free luggage {meta.luggageLimitKg} kg
                </p>
              </div>

              <div className="flex sm:flex-col items-baseline sm:items-end justify-between sm:justify-center gap-1 shrink-0 font-mono tabular-nums">
                <span className="text-base font-bold text-emerald-700 dark:text-emerald-400">
                  ৳ {fare.grandTotal}
                </span>
                <span className="text-xs font-sans text-slate-500 dark:text-zinc-400">
                  {passengers > 1
                    ? `৳ ${fare.totalPerSeat} × ${passengers} seats`
                    : 'per seat'}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Clear Selected Total + Friendly Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div className="text-xs text-slate-600 dark:text-zinc-400 tabular-nums">
          <span>
            {isBengali ? 'নির্বাচিত ভাড়া:' : 'Selected:'}{' '}
            <strong className="text-slate-900 dark:text-zinc-100">
              {isBengali ? selectedFare.classNameBn : selectedFare.className} — ৳{' '}
              {selectedFare.grandTotal}
            </strong>{' '}
            ({passengers} {passengers > 1 ? 'passengers' : 'passenger'})
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onOpenTripSummary && (
            <button
              type="button"
              onClick={onOpenTripSummary}
              className="h-9 px-3.5 rounded-lg bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 text-xs font-semibold inline-flex items-center gap-1.5 transition-colors duration-200 active:scale-[0.98]"
            >
              <Ticket className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{isBengali ? 'যাত্রার সারাংশ' : 'Trip Summary'}</span>
            </button>
          )}

          <a
            href={DATASET_METADATA.officialPortalUrl}
            target="_blank"
            rel="noreferrer"
            className="h-9 px-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors duration-200 active:scale-[0.98]"
          >
            <span>{isBengali ? 'টিকেট বুক করুন' : 'Book Official Ticket'}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
