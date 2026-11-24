import React from 'react';
import { motion } from 'framer-motion';
import { Calculator, Info, ExternalLink, RotateCcw } from 'lucide-react';
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
  onProceedToTicket?: () => void;
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
  onProceedToTicket,
}) => {
  const fares = calculateFareBreakdown(
    segment.distanceKm,
    availableClasses,
    bookingChannel,
    passengers
  );

  const handleResetCalculator = () => {
    setBookingChannel('ONLINE');
    setPassengers(1);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 gap-2">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div>
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {isBengali ? 'ভাড়ার তালিকা ও সিট বিন্যাস' : 'Statutory Fare Calculator & Breakdown'}
            </h2>
            <p className="text-[11px] font-mono text-zinc-600 dark:text-zinc-400 tabular-nums">
              {segment.originHalt.stationName} → {segment.destinationHalt.stationName} •{' '}
              {segment.distanceKm} km
            </p>
          </div>
        </div>

        {(bookingChannel !== 'ONLINE' || passengers !== 1) && (
          <button
            type="button"
            onClick={handleResetCalculator}
            className="h-8 px-2.5 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 text-xs font-semibold inline-flex items-center gap-1.5 self-start sm:self-auto active:scale-[0.98]"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset</span>
          </button>
        )}
      </div>

      {/* Interactive Calculator Controls: Channel & Passengers */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 rounded-md bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800">
        {/* Booking Channel Toggle */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Channel:
          </span>
          <div className="inline-flex p-0.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-700">
            {(
              [
                { id: 'ONLINE', label: 'Online (+৳20/seat)' },
                { id: 'COUNTER', label: 'Counter (৳0 fee)' },
              ] as const
            ).map((opt) => {
              const active = bookingChannel === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setBookingChannel(opt.id)}
                  aria-pressed={active}
                  className={`relative px-2.5 py-1.5 rounded text-xs font-semibold transition-colors duration-200 active:scale-[0.98] ${
                    active ? 'text-white' : 'text-zinc-700 dark:text-zinc-300'
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId="booking-channel-pill"
                      transition={TAB_SPRING}
                      className="absolute inset-0 rounded bg-emerald-600"
                    />
                  )}
                  <span className="relative z-10">{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Passenger Count Selector (BR Official Max 4 seats per NID) */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">
            Seats (Max 4):
          </span>
          <div className="inline-flex items-center gap-1 font-mono tabular-nums">
            {[1, 2, 3, 4].map((count) => {
              const active = passengers === count;
              return (
                <button
                  key={count}
                  type="button"
                  onClick={() => setPassengers(count)}
                  aria-pressed={active}
                  aria-label={`${count} passenger${count > 1 ? 's' : ''}`}
                  className={`h-8 w-8 rounded-md text-xs font-bold transition-colors duration-200 active:scale-[0.96] ${
                    active
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white dark:bg-zinc-900 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700 hover:border-emerald-500'
                  }`}
                >
                  {count}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* High-Density Fare Matrix Table */}
      <div className="overflow-x-auto rounded-md border border-zinc-200 dark:border-zinc-800">
        <table className="w-full text-left border-collapse text-xs min-w-[600px]">
          <thead>
            <tr className="bg-slate-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800 text-[11px] font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider">
              <th className="py-2.5 px-3">Seat Class</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">Base</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">VAT (15%)</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">Bedding</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap">Fee</th>
              <th className="py-2.5 px-3 text-right whitespace-nowrap font-bold text-zinc-900 dark:text-zinc-100">
                {passengers > 1 ? `Total (×${passengers})` : 'Total'}
              </th>
              <th className="py-2.5 px-3 text-center whitespace-nowrap">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800 font-mono tabular-nums">
            {fares.map((fare) => {
              const meta = SEAT_CLASS_META[fare.seatClass];
              const isSelected = selectedClass === fare.seatClass;

              return (
                <tr
                  key={fare.seatClass}
                  onClick={() => onSelectClass(fare.seatClass)}
                  className={`transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-50/70 dark:bg-emerald-950/35'
                      : 'hover:bg-slate-50 dark:hover:bg-zinc-800/40'
                  }`}
                >
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="font-sans font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        {isBengali ? fare.classNameBn : fare.className}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-mono font-bold">
                        {fare.seatClass}
                      </span>
                    </div>
                    <p className="font-sans text-[11px] text-zinc-600 dark:text-zinc-400 mt-0.5 hidden sm:block">
                      {meta.description} • Free luggage: {meta.luggageLimitKg} kg
                    </p>
                  </td>

                  <td className="py-3 px-3 text-right whitespace-nowrap text-zinc-800 dark:text-zinc-200">
                    ৳ {fare.baseFarePerSeat}
                  </td>

                  <td className="py-3 px-3 text-right whitespace-nowrap text-zinc-800 dark:text-zinc-200">
                    ৳ {fare.vatAmountPerSeat}
                  </td>

                  <td className="py-3 px-3 text-right whitespace-nowrap text-zinc-600 dark:text-zinc-400">
                    ৳ {fare.beddingChargePerSeat}
                  </td>

                  <td className="py-3 px-3 text-right whitespace-nowrap text-zinc-600 dark:text-zinc-400">
                    ৳ {fare.serviceChargePerSeat}
                  </td>

                  <td className="py-3 px-3 text-right whitespace-nowrap">
                    <div className="font-bold text-sm text-emerald-700 dark:text-emerald-400">
                      ৳ {fare.grandTotal}
                    </div>
                    {passengers > 1 && (
                      <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                        ৳ {fare.totalPerSeat}/seat
                      </div>
                    )}
                  </td>

                  <td className="py-3 px-3 text-center whitespace-nowrap">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectClass(fare.seatClass);
                        if (onProceedToTicket) onProceedToTicket();
                      }}
                      className={`h-8 px-2.5 whitespace-nowrap rounded-md text-xs font-sans font-semibold transition-colors duration-200 active:scale-[0.98] ${
                        isSelected
                          ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                          : 'bg-slate-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 border border-zinc-300 dark:border-zinc-700'
                      }`}
                    >
                      {isSelected ? 'Pass →' : 'Select'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Statutory Formula Notice + Official Live Seat Inventory Link */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-slate-50 dark:bg-zinc-950 rounded-md border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
        <div className="flex items-start gap-2">
          <Info className="w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0 mt-0.5" />
          <p>
            Distance-based estimate following BR statutory rules: 15% VAT on AC classes only, ৳50 berth bedding on AC_B/F_BERTH, and ৳20/seat online service fee. Check live seat availability and exact train tariff on the official portal.
          </p>
        </div>
        <a
          href={DATASET_METADATA.officialPortalUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-emerald-700 dark:text-emerald-400 font-semibold whitespace-nowrap hover:border-emerald-500 transition-colors shrink-0 self-start sm:self-center"
        >
          <span>Check Live Seats</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
