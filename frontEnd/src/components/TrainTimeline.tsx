import React, { useState, useEffect } from 'react';
import {
  Clock,
  Navigation,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
  ExternalLink,
} from 'lucide-react';
import { RouteSegment, Train } from '../types/railway';
import {
  DATASET_METADATA,
  estimateTrainProgress,
  formatDuration,
} from '../data/railway';

interface TrainTimelineProps {
  train: Train;
  segment: RouteSegment;
  travelDate: string;
  isBengali: boolean;
}

export const TrainTimeline: React.FC<TrainTimelineProps> = ({
  train,
  segment,
  travelDate,
  isBengali,
}) => {
  const [simulatedOffset, setSimulatedOffset] = useState<number | null>(null);
  const [tick, setTick] = useState(0);

  // Reset simulator when switching trains
  useEffect(() => {
    setSimulatedOffset(null);
  }, [train.trainNumber]);

  // Refresh BST schedule estimate every 30s when using real BST clock
  useEffect(() => {
    if (simulatedOffset !== null) return;
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, [simulatedOffset]);

  void tick;
  const estimate = estimateTrainProgress(train, travelDate, simulatedOffset);

  const badgeStyles: Record<typeof estimate.phase, string> = {
    OFF_DAY:
      'bg-rose-50 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300 border-rose-300 dark:border-rose-700',
    SCHEDULED_FUTURE:
      'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700',
    PRE_DEPARTURE:
      'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-700',
    AT_STATION:
      'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    IN_TRANSIT:
      'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700',
    COMPLETED:
      'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700',
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 sm:p-5 space-y-4">
      {/* Train Schedule Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-zinc-200 dark:border-zinc-800 gap-3">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono text-sm sm:text-base font-bold px-2 py-0.5 rounded-md bg-emerald-600 text-white tabular-nums">
              {train.trainNumber}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-zinc-900 dark:text-zinc-100">
              {isBengali ? train.trainNameBn : train.trainName}
            </h2>
            <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
              {train.routeType}
            </span>
          </div>

          <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 flex items-center gap-x-2.5 gap-y-1 flex-wrap font-mono tabular-nums">
            <span>
              Full Run: {train.totalDistanceKm} km ({formatDuration(train.durationMinutes)})
            </span>
            {segment.isPartialSegment && (
              <>
                <span aria-hidden="true">•</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
                  Selected: {segment.originHalt.stationCode} → {segment.destinationHalt.stationCode}{' '}
                  ({segment.distanceKm} km, {formatDuration(segment.durationMinutes)})
                </span>
              </>
            )}
            <span aria-hidden="true">•</span>
            <span className="text-rose-700 dark:text-rose-400 font-semibold">
              {train.offDays.length === 0 ? 'Operates Daily' : `Off-Day: ${train.offDays.join(', ')}`}
            </span>
          </div>
        </div>

        <div className="flex flex-col sm:items-end gap-1 shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold border font-mono tabular-nums ${badgeStyles[estimate.phase]}`}
          >
            {estimate.phase === 'OFF_DAY' ? (
              <AlertTriangle className="w-3.5 h-3.5" />
            ) : (
              <Clock className="w-3.5 h-3.5" />
            )}
            <span>{estimate.statusHeadline}</span>
          </span>
          <span className="text-[11px] text-zinc-600 dark:text-zinc-400 font-mono tabular-nums">
            Schedule-Estimated • {estimate.referenceTimeLabel}
          </span>
        </div>
      </div>

      {/* Deterministic Schedule-Estimated Progress Banner + Interactive Time Preview */}
      <div className="p-3.5 bg-slate-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-start gap-2 min-w-0">
            <Navigation className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed">
              {estimate.statusDetail}
            </p>
          </div>
          <span className="font-mono text-xs font-bold text-zinc-900 dark:text-zinc-100 tabular-nums shrink-0">
            {estimate.progressPercent}% scheduled
          </span>
        </div>

        {/* Deterministic Progress Bar */}
        <div className="w-full h-1.5 rounded-full bg-zinc-200 dark:bg-zinc-800 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              estimate.phase === 'OFF_DAY' ? 'bg-rose-500' : 'bg-emerald-600'
            }`}
            style={{ width: `${estimate.progressPercent}%` }}
          />
        </div>

        {/* Interactive Schedule Time Preview Control */}
        <div className="pt-2 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
          <div className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400">
            <SlidersHorizontal className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <label htmlFor="raildesk-stepper-sim" className="font-medium">
              {isBengali ? 'সময়সূচী প্রিভিউ:' : 'Inspect Schedule Progress:'}
            </label>
          </div>

          <div className="flex items-center gap-2.5 flex-1 sm:max-w-xs">
            <input
              id="raildesk-stepper-sim"
              type="range"
              min={0}
              max={train.durationMinutes}
              step={5}
              value={simulatedOffset ?? Math.round((estimate.progressPercent / 100) * train.durationMinutes)}
              onChange={(e) => setSimulatedOffset(Number(e.target.value))}
              aria-label="Preview train schedule progression in minutes"
              className="w-full accent-emerald-600 cursor-pointer"
            />
            {simulatedOffset !== null && (
              <button
                type="button"
                onClick={() => setSimulatedOffset(null)}
                className="h-7 px-2 rounded-md bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 text-[11px] font-semibold text-zinc-700 dark:text-zinc-200 inline-flex items-center gap-1 shrink-0 active:scale-[0.98]"
                title="Return to live Bangladesh Standard Time"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Live BST</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Vertical Transit Stepper */}
      <div className="pt-1">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
          <h3 className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>Chronological Station Progression &amp; Halt Times</span>
          </h3>
          <span className="font-mono text-[11px] text-zinc-500 dark:text-zinc-400 tabular-nums">
            {train.halts.length} stops • SMS: TR {train.trainNumber} → 9999
          </span>
        </div>

        <div className="relative pl-7 sm:pl-8 space-y-5">
          {/* Continuous Vertical Line */}
          <div
            aria-hidden="true"
            className="absolute left-[11px] sm:left-[15px] top-2 bottom-3 w-0.5 bg-zinc-300 dark:bg-zinc-700"
          />

          {train.halts.map((halt, idx) => {
            const isOrigin = idx === 0;
            const isTerminus = idx === train.halts.length - 1;
            const haltState = estimate.haltStates[halt.stationCode] ?? 'upcoming';
            const isPassed = haltState === 'passed';
            const isAtStation = haltState === 'at_station';
            const isNext = haltState === 'next';
            const isInSelectedSegment =
              idx >= segment.fromIndex && idx <= segment.toIndex;

            return (
              <div
                key={halt.stationCode}
                className={`relative flex flex-col sm:flex-row sm:items-start justify-between gap-2 text-xs ${
                  segment.isPartialSegment && !isInSelectedSegment ? 'opacity-50' : ''
                }`}
              >
                {/* Node icon */}
                <div
                  className={`absolute -left-7 sm:-left-8 top-0.5 flex items-center justify-center rounded-full transition-colors ${
                    isAtStation || isNext
                      ? 'w-6 h-6 -translate-x-[2px] bg-emerald-600 text-white ring-4 ring-emerald-500/20'
                      : isPassed
                      ? 'w-5 h-5 bg-zinc-700 dark:bg-zinc-600 text-white'
                      : 'w-5 h-5 bg-white dark:bg-zinc-900 border-2 border-zinc-400 dark:border-zinc-600'
                  }`}
                >
                  {isPassed ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : isAtStation || isNext ? (
                    <span className="w-2 h-2 rounded-full bg-white" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 dark:bg-zinc-500" />
                  )}
                </div>

                {/* Station Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span
                      className={`font-bold text-sm ${
                        isAtStation || isNext
                          ? 'text-emerald-700 dark:text-emerald-400'
                          : 'text-zinc-900 dark:text-zinc-100'
                      }`}
                    >
                      {isBengali ? halt.stationNameBn : halt.stationName}
                    </span>
                    <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold tabular-nums">
                      {halt.stationCode}
                    </span>
                    {isAtStation && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        EST. AT STATION
                      </span>
                    )}
                    {isNext && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold uppercase rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700">
                        NEXT SCHEDULED HALT
                      </span>
                    )}
                    {idx === segment.fromIndex && segment.isPartialSegment && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold">
                        BOARDING
                      </span>
                    )}
                    {idx === segment.toIndex && segment.isPartialSegment && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase rounded bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950 font-bold">
                        ALIGHTING
                      </span>
                    )}
                    {!segment.isPartialSegment && isOrigin && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        ORIGIN
                      </span>
                    )}
                    {!segment.isPartialSegment && isTerminus && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono uppercase rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300">
                        TERMINUS
                      </span>
                    )}
                    {halt.dayOffset === 1 && (
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        +1 DAY
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2.5 text-[11px] text-zinc-600 dark:text-zinc-400 mt-1 font-mono tabular-nums">
                    <span>{halt.platform}</span>
                    <span aria-hidden="true">•</span>
                    <span>{halt.distanceKm} km from origin</span>
                  </div>
                </div>

                {/* Schedule & Halt Metrics */}
                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2 shrink-0 font-mono tabular-nums bg-slate-50 dark:bg-zinc-950 sm:bg-transparent sm:dark:bg-transparent px-2.5 py-1.5 sm:p-0 rounded-md border sm:border-0 border-zinc-200 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-zinc-600 dark:text-zinc-400">Arr:</span>
                    <span className="font-semibold text-xs text-zinc-900 dark:text-zinc-200">
                      {halt.arrivalTime}
                    </span>
                    <span className="text-[11px] text-zinc-600 dark:text-zinc-400 ml-1">Dep:</span>
                    <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                      {halt.departureTime}
                    </span>
                  </div>

                  {halt.haltDurationMinutes > 0 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700">
                      Halt: {String(halt.haltDurationMinutes).padStart(2, '0')}m
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Provenance & Live Verification Footer */}
      <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-zinc-600 dark:text-zinc-400">
        <span>
          Progress is calculated deterministically from the BR {DATASET_METADATA.version} static roster — not live GPS.
        </span>
        <a
          href={DATASET_METADATA.officialPortalUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-emerald-700 dark:text-emerald-400 hover:underline shrink-0"
        >
          <span>eticket.railway.gov.bd</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
