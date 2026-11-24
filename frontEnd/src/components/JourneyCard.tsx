import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import {
  Ticket,
  Printer,
  Clock,
  ShieldCheck,
  AlertCircle,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react';
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
    return { label: '--:--:--', isPast: false };
  }

  // Interpret departure timestamp in Bangladesh Standard Time (+06:00)
  const target = new Date(
    `${travelDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00+06:00`
  );
  const diffMs = target.getTime() - Date.now();

  if (diffMs <= 0) {
    return { label: 'BOARDING / DEPARTED (BST)', isPast: true };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const remAfterDays = totalSeconds % 86400;
  const hrs = Math.floor(remAfterDays / 3600);
  const mins = Math.floor((remAfterDays % 3600) / 60);
  const secs = remAfterDays % 60;

  const hhmmss = `${String(hrs).padStart(2, '0')}h : ${String(mins).padStart(2, '0')}m : ${String(secs).padStart(2, '0')}s`;
  return {
    label: days > 0 ? `${days}d ${hhmmss}` : hhmmss,
    isPast: false,
  };
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
  const [copiedRef, setCopiedRef] = useState<boolean>(false);

  const operating = isTrainOperatingOnDate(train, travelDate);
  const weekday = getWeekdayName(travelDate);
  const [fare] = calculateFareBreakdown(
    segment.distanceKm,
    [seatClass],
    bookingChannel,
    passengers
  );

  const refCode = `RD-${train.trainNumber}-${segment.originHalt.stationCode}-${segment.destinationHalt.stationCode}-${travelDate.replaceAll('-', '')}`;
  const classMeta = SEAT_CLASS_META[seatClass];

  const [countdown, setCountdown] = useState(() =>
    computeCountdown(travelDate, segment.departureTime)
  );

  useEffect(() => {
    setCountdown(computeCountdown(travelDate, segment.departureTime));
    const timer = setInterval(() => {
      setCountdown(computeCountdown(travelDate, segment.departureTime));
    }, 1000);
    return () => clearInterval(timer);
  }, [travelDate, segment.departureTime]);

  useEffect(() => {
    const qrPayload = JSON.stringify({
      ref: refCode,
      train: train.trainNumber,
      from: segment.originHalt.stationCode,
      to: segment.destinationHalt.stationCode,
      date: travelDate,
      dep: segment.departureTime,
      cls: seatClass,
      pax: passengers,
      estFareBdt: fare.grandTotal,
    });

    QRCode.toDataURL(qrPayload, {
      margin: 1,
      width: 140,
      color: {
        dark: '#09090b',
        light: '#ffffff',
      },
    })
      .then((url: string) => setQrDataUrl(url))
      .catch((err: unknown) => console.error('QR generation error:', err));
  }, [
    refCode,
    train.trainNumber,
    segment.originHalt.stationCode,
    segment.destinationHalt.stationCode,
    segment.departureTime,
    travelDate,
    seatClass,
    passengers,
    fare.grandTotal,
  ]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyRef = async () => {
    try {
      await navigator.clipboard.writeText(refCode);
      setCopiedRef(true);
      setTimeout(() => setCopiedRef(false), 1800);
    } catch {
      setCopiedRef(false);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 sm:p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-zinc-200 dark:border-zinc-800 gap-2.5">
        <div className="flex items-center gap-2 min-w-0">
          <Ticket className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="min-w-0">
            <h2 className="text-base font-bold text-zinc-900 dark:text-zinc-100">
              {isBengali
                ? 'অফলাইন যাত্রা সারসংক্ষেপ কার্ড'
                : 'Offline Journey Summary & Boarding Reference'}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Printable itinerary card with offline QR summary
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyRef}
            className="h-9 px-3 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 inline-flex items-center gap-1.5 transition-colors duration-200 active:scale-[0.98]"
          >
            {copiedRef ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Copied Ref</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Ref</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="h-9 px-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors duration-200 active:scale-[0.98]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isBengali ? 'প্রিন্ট কার্ড' : 'Print Summary'}</span>
          </button>
        </div>
      </div>

      {/* Off-Day Alert if train does not run on selected date */}
      {!operating && (
        <div
          role="alert"
          className="p-3 rounded-md bg-rose-50 dark:bg-rose-950/40 border border-rose-300 dark:border-rose-800 flex items-start gap-2.5 text-xs text-rose-800 dark:text-rose-200"
        >
          <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Weekly Off-Day Warning ({weekday}):</span> Train #
            {train.trainNumber} ({train.trainName}) is scheduled OFF on {train.offDays.join(', ')}. Choose another date or select an operating train.
          </div>
        </div>
      )}

      {/* Printable Journey Reference Card */}
      <div
        id="printable-ticket"
        className="border border-zinc-300 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-950 p-4 sm:p-5 space-y-4"
      >
        {/* Top Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white">
              RAILDESK BD • ITINERARY
            </span>
            <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 tabular-nums break-all">
              {refCode}
            </span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded border text-[11px] font-mono font-bold ${
              operating
                ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700'
                : 'bg-rose-50 dark:bg-rose-950/60 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700'
            }`}
          >
            {operating ? <ShieldCheck className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
            <span>{operating ? 'OPERATING DAY' : 'OFF-DAY'}</span>
          </div>
        </div>

        {/* Live Departure Countdown Banner (BST UTC+6) */}
        <div
          className={`p-3 rounded-md border flex items-center justify-between text-xs flex-wrap gap-2 ${
            countdown.isPast || !operating
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60'
              : 'bg-emerald-50 dark:bg-emerald-950/35 border-emerald-300 dark:border-emerald-800/60'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock
              className={`w-4 h-4 shrink-0 ${
                countdown.isPast || !operating
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-emerald-700 dark:text-emerald-400'
              }`}
            />
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">
              Scheduled Departure Countdown (BST):
            </span>
          </div>
          <div
            className={`font-mono font-bold text-sm tabular-nums ${
              countdown.isPast || !operating
                ? 'text-amber-800 dark:text-amber-300'
                : 'text-emerald-800 dark:text-emerald-300'
            }`}
          >
            {operating ? countdown.label : `NOT RUNNING ON ${weekday.toUpperCase()}`}
          </div>
        </div>

        {/* Journey Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-2 border-b border-zinc-200 dark:border-zinc-800">
          <div>
            <div className="text-[11px] uppercase font-semibold text-zinc-500 dark:text-zinc-400">
              Train Service
            </div>
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">
              {isBengali ? train.trainNameBn : train.trainName}
            </div>
            <div className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400 tabular-nums mt-0.5">
              #{train.trainNumber} • {formatDuration(segment.durationMinutes)} • {segment.distanceKm} km
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase font-semibold text-zinc-500 dark:text-zinc-400">
              Boarding Station
            </div>
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">
              {isBengali ? segment.originHalt.stationNameBn : segment.originHalt.stationName}
            </div>
            <div className="font-mono text-xs text-zinc-700 dark:text-zinc-300 tabular-nums mt-0.5">
              {segment.departureTime} BST • {segment.originHalt.platform}
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase font-semibold text-zinc-500 dark:text-zinc-400">
              Alighting Station
            </div>
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">
              {isBengali ? segment.destinationHalt.stationNameBn : segment.destinationHalt.stationName}
            </div>
            <div className="font-mono text-xs text-zinc-700 dark:text-zinc-300 tabular-nums mt-0.5">
              {segment.arrivalTime} BST • {segment.destinationHalt.platform}
            </div>
          </div>
        </div>

        {/* Fare, Class & QR Code Section */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
          <div className="grid grid-cols-2 gap-2.5 flex-1 font-mono tabular-nums text-xs">
            <div className="p-2.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-sans font-semibold">
                Travel Date
              </div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {travelDate} ({weekday.slice(0, 3)})
              </div>
            </div>

            <div className="p-2.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-sans font-semibold">
                Class
              </div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100 font-sans truncate mt-0.5">
                {isBengali ? classMeta.nameBn : classMeta.name}
              </div>
            </div>

            <div className="p-2.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-sans font-semibold">
                Seats / Channel
              </div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">
                {passengers} {passengers > 1 ? 'Seats' : 'Seat'} • {bookingChannel}
              </div>
            </div>

            <div className="p-2.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-sans font-semibold">
                Estimated Total
              </div>
              <div className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                ৳ {fare.grandTotal}
              </div>
            </div>
          </div>

          {/* Offline Summary QR Code */}
          <div className="flex flex-col items-center justify-center p-2.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shrink-0 self-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="RailDesk BD offline itinerary QR code"
                className="w-24 h-24 object-contain rounded-sm"
              />
            ) : (
              <div className="w-24 h-24 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
            )}
            <span className="text-[10px] font-mono font-semibold text-zinc-600 dark:text-zinc-400 mt-1.5 uppercase">
              Itinerary QR
            </span>
          </div>
        </div>

        {/* Honest Reference Disclaimer */}
        <div className="text-[11px] text-zinc-600 dark:text-zinc-400 pt-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-start gap-2 leading-relaxed">
          <AlertCircle className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0 mt-0.5" />
          <span>
            Planning summary only — not a valid Bangladesh Railway boarding ticket. Purchase official e-tickets at eticket.railway.gov.bd and carry your original NID.
          </span>
        </div>
      </div>
    </div>
  );
};
