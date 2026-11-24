import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Printer, Clock, AlertTriangle, Copy, Check } from 'lucide-react';
import { BookingChannel, RouteSegment, SeatClass, Train } from '../types/railway';
import {
  calculateFareBreakdown,
  formatDuration,
  getWeekdayName,
  isTrainOperatingOnDate,
  SEAT_CLASS_META,
} from '../data/railway';

interface JourneyCardProps {
  train: Train;
  segment: RouteSegment;
  travelDate: string;
  seatClass: SeatClass;
  bookingChannel: BookingChannel;
  passengers: number;
  isBengali: boolean;
}

function computeCountdown(travelDate: string, departureTime: string): {
  label: string;
  isPast: boolean;
} {
  const [hStr, mStr] = departureTime.split(':');
  const hours = Number(hStr);
  const minutes = Number(mStr);
  if (!travelDate || Number.isNaN(hours) || Number.isNaN(minutes)) {
    return { label: '--', isPast: false };
  }

  const target = new Date(
    `${travelDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+06:00`
  );
  const diffMs = target.getTime() - Date.now();

  if (diffMs <= 0) {
    return { label: 'Departed for this date', isPast: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const remAfterDays = totalSeconds % 86400;
  const hrs = Math.floor(remAfterDays / 3600);
  const mins = Math.floor((remAfterDays % 3600) / 60);

  if (days > 0) return { label: `In ${days}d ${hrs}h ${mins}m`, isPast: false };
  return { label: `In ${hrs}h ${mins}m`, isPast: false };
}

export const JourneyCard: React.FC<JourneyCardProps> = ({
  train,
  segment,
  travelDate,
  seatClass,
  bookingChannel,
  passengers,
  isBengali,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  const operating = isTrainOperatingOnDate(train, travelDate);
  const weekday = getWeekdayName(travelDate);
  const [fare] = calculateFareBreakdown(
    segment.distanceKm,
    [seatClass],
    bookingChannel,
    passengers
  );
  const classMeta = SEAT_CLASS_META[seatClass];

  const [countdown, setCountdown] = useState(() =>
    computeCountdown(travelDate, segment.departureTime)
  );

  useEffect(() => {
    setCountdown(computeCountdown(travelDate, segment.departureTime));
    const timer = setInterval(() => {
      setCountdown(computeCountdown(travelDate, segment.departureTime));
    }, 30000);
    return () => clearInterval(timer);
  }, [travelDate, segment.departureTime]);

  const summaryText = `${train.trainName} (#${train.trainNumber}) | ${segment.originHalt.stationName} (${segment.departureTime}) -> ${segment.destinationHalt.stationName} (${segment.arrivalTime}) | ${travelDate} (${weekday}) | ${classMeta.name} x${passengers}: ৳${fare.grandTotal}`;

  useEffect(() => {
    QRCode.toDataURL(summaryText, {
      margin: 1,
      width: 120,
      color: { dark: '#0f172a', light: '#ffffff' },
    })
      .then((url: string) => setQrDataUrl(url))
      .catch((err: unknown) => console.error('QR generation error:', err));
  }, [summaryText]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(summaryText);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <div className="space-y-4">
      {!operating && (
        <div
          role="alert"
          className="p-3.5 rounded-lg bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-sm text-rose-800 dark:text-rose-200"
        >
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <span>
            <strong>Heads up:</strong> {train.trainName} does not run on {weekday}s (weekly off-day). Try choosing another travel day.
          </span>
        </div>
      )}

      <div
        id="printable-ticket"
        className="border border-slate-200 dark:border-zinc-800 rounded-lg bg-slate-50 dark:bg-zinc-950 p-4 sm:p-5 space-y-4"
      >
        {/* Top Row */}
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200 dark:border-zinc-800">
          <div>
            <h4 className="font-bold text-base text-slate-900 dark:text-zinc-100">
              {isBengali ? train.trainNameBn : train.trainName}{' '}
              <span className="font-mono text-sm font-medium text-slate-500 dark:text-zinc-400">
                #{train.trainNumber}
              </span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
              {travelDate} ({weekday}) • {formatDuration(segment.durationMinutes)} • {segment.distanceKm} km
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="h-8 px-3 rounded-md bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-medium text-slate-700 dark:text-zinc-200 inline-flex items-center gap-1.5 transition-colors active:scale-[0.98]"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="h-8 px-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-medium inline-flex items-center gap-1.5 transition-colors active:scale-[0.98]"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print</span>
            </button>
          </div>
        </div>

        {/* Trip Summary Details + QR */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <div className="grid grid-cols-2 gap-3 flex-1 text-sm">
            <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <div className="text-xs text-slate-500 dark:text-zinc-400">From</div>
              <div className="font-semibold text-slate-900 dark:text-zinc-100 mt-0.5">
                {isBengali ? segment.originHalt.stationNameBn : segment.originHalt.stationName}
              </div>
              <div className="font-mono text-xs text-slate-600 dark:text-zinc-400 tabular-nums mt-0.5">
                Departs {segment.departureTime}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <div className="text-xs text-slate-500 dark:text-zinc-400">To</div>
              <div className="font-semibold text-slate-900 dark:text-zinc-100 mt-0.5">
                {isBengali
                  ? segment.destinationHalt.stationNameBn
                  : segment.destinationHalt.stationName}
              </div>
              <div className="font-mono text-xs text-slate-600 dark:text-zinc-400 tabular-nums mt-0.5">
                Arrives {segment.arrivalTime}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <div className="text-xs text-slate-500 dark:text-zinc-400">Seat Class</div>
              <div className="font-semibold text-slate-900 dark:text-zinc-100 mt-0.5">
                {isBengali ? classMeta.nameBn : classMeta.name}
              </div>
              <div className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
                {passengers} {passengers > 1 ? 'passengers' : 'passenger'} •{' '}
                {bookingChannel === 'ONLINE' ? 'Online' : 'Counter'}
              </div>
            </div>

            <div className="p-3 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800">
              <div className="text-xs text-slate-500 dark:text-zinc-400">Estimated Fare</div>
              <div className="font-mono text-base font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mt-0.5">
                ৳ {fare.grandTotal}
              </div>
              <div className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5 inline-flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{operating ? countdown.label : 'Off-day'}</span>
              </div>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center justify-center p-3 rounded-lg bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shrink-0 self-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Saved trip summary QR code"
                className="w-24 h-24 object-contain"
              />
            ) : (
              <div className="w-24 h-24 bg-slate-200 dark:bg-zinc-800 animate-pulse rounded" />
            )}
            <span className="text-[11px] text-slate-500 dark:text-zinc-400 mt-1.5">
              Save for offline
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 dark:text-zinc-400 pt-2 border-t border-slate-200 dark:border-zinc-800">
          Planning summary only — purchase official tickets at eticket.railway.gov.bd and bring your original NID when boarding.
        </p>
      </div>
    </div>
  );
};
