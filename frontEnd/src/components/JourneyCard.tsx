import React, { useEffect, useState, useMemo } from 'react';
import QRCode from 'qrcode';
import { Ticket, Printer, Clock, ShieldCheck, AlertCircle, Copy, Check } from 'lucide-react';
import { Train, SeatClass } from '../types/railway';
import { calculateFares, SEAT_CLASS_META } from '../data/railway';

interface JourneyCardProps {
  train: Train;
  fromStationCode: string;
  toStationCode: string;
  travelDate: string;
  seatClass: SeatClass;
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

  const target = new Date(`${travelDate}T${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:00`);
  const diffMs = target.getTime() - Date.now();

  if (diffMs <= 0) {
    return { label: 'BOARDING / DEPARTED', isPast: true };
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
  fromStationCode,
  toStationCode,
  travelDate,
  seatClass,
  isBengali,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedPnr, setCopiedPnr] = useState<boolean>(false);

  const fares = calculateFares(train.totalDistanceKm, [seatClass]);
  const currentFare = fares[seatClass] || { total: 450 };

  const originHalt = useMemo(
    () => train.halts.find((h) => h.stationCode === fromStationCode) || train.halts[0],
    [train.halts, fromStationCode]
  );
  const destHalt = useMemo(
    () =>
      train.halts.find((h) => h.stationCode === toStationCode) ||
      train.halts[train.halts.length - 1],
    [train.halts, toStationCode]
  );

  const effectiveDeparture =
    originHalt.departureTime !== '--' ? originHalt.departureTime : train.departureTime;
  const effectiveArrival =
    destHalt.arrivalTime !== '--' ? destHalt.arrivalTime : train.arrivalTime;

  const pnr = `BR-${train.trainNumber}-${Math.abs(
    originHalt.stationCode.charCodeAt(0) * 1000 +
      destHalt.stationCode.charCodeAt(0) * 37 +
      4821
  )
    .toString()
    .slice(0, 6)}`;

  const classMeta = SEAT_CLASS_META[seatClass] || { name: seatClass, nameBn: seatClass };

  const [countdown, setCountdown] = useState(() =>
    computeCountdown(travelDate, effectiveDeparture)
  );

  useEffect(() => {
    setCountdown(computeCountdown(travelDate, effectiveDeparture));
    const timer = setInterval(() => {
      setCountdown(computeCountdown(travelDate, effectiveDeparture));
    }, 1000);
    return () => clearInterval(timer);
  }, [travelDate, effectiveDeparture]);

  // Generate real offline verification QR Code
  useEffect(() => {
    const qrPayload = JSON.stringify({
      pnr,
      trn: train.trainNumber,
      from: originHalt.stationCode,
      to: destHalt.stationCode,
      date: travelDate,
      cls: seatClass,
      sec: 'BR-GOV-AUTH-PASS',
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
  }, [pnr, train.trainNumber, originHalt.stationCode, destHalt.stationCode, travelDate, seatClass]);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPnr = async () => {
    try {
      await navigator.clipboard.writeText(pnr);
      setCopiedPnr(true);
      setTimeout(() => setCopiedPnr(false), 1800);
    } catch {
      setCopiedPnr(false);
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
                ? 'অফলাইন ট্র্যাভেল পাস / ই-টিকেট সামারি'
                : 'Offline-First Journey Pass & Ticket Summary'}
            </h2>
            <p className="text-xs text-zinc-600 dark:text-zinc-400">
              Printable boarding card with offline QR verification
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyPnr}
            className="h-9 px-3 rounded-md bg-slate-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 text-xs font-semibold border border-zinc-300 dark:border-zinc-700 inline-flex items-center gap-1.5 transition-colors duration-200 active:scale-[0.98]"
          >
            {copiedPnr ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                <span>Copied PNR</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy PNR</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="h-9 px-3 rounded-md bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1.5 transition-colors duration-200 active:scale-[0.98]"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>{isBengali ? 'প্রিন্ট পাস' : 'Print Pass'}</span>
          </button>
        </div>
      </div>

      {/* Official Boarding Pass Card */}
      <div
        id="printable-ticket"
        className="border border-zinc-300 dark:border-zinc-700 rounded-lg bg-slate-50 dark:bg-zinc-950 p-4 sm:p-5 space-y-4"
      >
        {/* Top Authority Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-zinc-200 dark:border-zinc-800 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-mono text-xs font-extrabold px-2 py-0.5 rounded bg-emerald-600 text-white">
              BANGLADESH RAILWAY
            </span>
            <span className="text-xs font-mono font-bold text-zinc-700 dark:text-zinc-300 tabular-nums">
              PNR: {pnr}
            </span>
          </div>

          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 text-[11px] font-mono font-bold">
            <ShieldCheck className="w-3.5 h-3.5" />
            CONFIRMED
          </div>
        </div>

        {/* Live Departure Countdown Banner */}
        <div
          className={`p-3 rounded-md border flex items-center justify-between text-xs flex-wrap gap-2 ${
            countdown.isPast
              ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-700/60'
              : 'bg-emerald-50 dark:bg-emerald-950/35 border-emerald-300 dark:border-emerald-800/60'
          }`}
        >
          <div className="flex items-center gap-2">
            <Clock
              className={`w-4 h-4 shrink-0 ${
                countdown.isPast
                  ? 'text-amber-700 dark:text-amber-400'
                  : 'text-emerald-700 dark:text-emerald-400'
              }`}
            />
            <span className="text-zinc-700 dark:text-zinc-300 font-medium">
              Scheduled Departure Countdown:
            </span>
          </div>
          <div
            className={`font-mono font-bold text-sm tabular-nums ${
              countdown.isPast
                ? 'text-amber-800 dark:text-amber-300'
                : 'text-emerald-800 dark:text-emerald-300'
            }`}
          >
            {countdown.label}
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
              #{train.trainNumber} ({train.routeType})
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase font-semibold text-zinc-500 dark:text-zinc-400">
              Origin / Boarding
            </div>
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">
              {isBengali ? originHalt.stationNameBn : originHalt.stationName}
            </div>
            <div className="font-mono text-xs text-zinc-700 dark:text-zinc-300 tabular-nums mt-0.5">
              {effectiveDeparture} • {originHalt.platform}
            </div>
          </div>

          <div>
            <div className="text-[11px] uppercase font-semibold text-zinc-500 dark:text-zinc-400">
              Destination / Arrival
            </div>
            <div className="font-bold text-sm text-zinc-900 dark:text-zinc-100 mt-0.5">
              {isBengali ? destHalt.stationNameBn : destHalt.stationName}
            </div>
            <div className="font-mono text-xs text-zinc-700 dark:text-zinc-300 tabular-nums mt-0.5">
              {effectiveArrival} • {destHalt.platform}
            </div>
          </div>
        </div>

        {/* Coach, Seat & QR Code Section */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-1">
          <div className="grid grid-cols-2 gap-2.5 flex-1 font-mono tabular-nums text-xs">
            <div className="p-2.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-sans font-semibold">
                Travel Date
              </div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">{travelDate}</div>
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
                Coach / Seat
              </div>
              <div className="font-bold text-zinc-900 dark:text-zinc-100 mt-0.5">KHA — 24, 25</div>
            </div>

            <div className="p-2.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800">
              <div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase font-sans font-semibold">
                Total Fare
              </div>
              <div className="font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                ৳ {currentFare.total}
              </div>
            </div>
          </div>

          {/* Verification QR Code */}
          <div className="flex flex-col items-center justify-center p-2.5 rounded-md bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shrink-0 self-center">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Bangladesh Railway offline ticket verification QR code"
                className="w-24 h-24 object-contain rounded-sm"
              />
            ) : (
              <div className="w-24 h-24 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded" />
            )}
            <span className="text-[10px] font-mono font-semibold text-zinc-600 dark:text-zinc-400 mt-1.5 uppercase">
              BR TTE Scan Valid
            </span>
          </div>
        </div>

        {/* Security & Offline Notice */}
        <div className="text-[11px] text-zinc-600 dark:text-zinc-400 pt-2.5 border-t border-zinc-200 dark:border-zinc-800 flex items-start gap-2 leading-relaxed">
          <AlertCircle className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400 shrink-0 mt-0.5" />
          <span>
            Save or print this pass for offline verification by the Traveling Ticket Examiner (TTE). Original NID or photo identification is required at boarding.
          </span>
        </div>
      </div>
    </div>
  );
};
