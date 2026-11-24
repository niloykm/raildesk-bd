import React from 'react';
import { Clock, AlertTriangle, ExternalLink, MapPin } from 'lucide-react';
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
  const estimate = estimateTrainProgress(train, travelDate, null);
  const isOffDay = estimate.phase === 'OFF_DAY';

  return (
    <div className="space-y-4">
      {/* Calm Journey Overview Line */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3.5 rounded-lg bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 text-sm">
        <div className="flex items-start gap-2.5 min-w-0">
          {isOffDay ? (
            <AlertTriangle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
          ) : (
            <Clock className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
          )}
          <div className="min-w-0">
            <div className="font-medium text-slate-900 dark:text-zinc-100">
              {isOffDay
                ? isBengali
                  ? `এই দিনে ট্রেনটি চলাচল করে না (${train.offDays.join(', ')})`
                  : `Does not run on this day (Weekly off: ${train.offDays.join(', ')})`
                : isBengali
                ? `মোট যাত্রার সময়: ${formatDuration(segment.durationMinutes)} • দূরত্ব ${segment.distanceKm} কি.মি.`
                : `Journey time: ${formatDuration(segment.durationMinutes)} • ${segment.distanceKm} km`}
            </div>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-0.5">
              {isBengali
                ? `সরাসরি অবস্থান জানতে এসএমএস করুন: TR ${train.trainNumber} লিখে পাঠান 9999 নম্বরে`
                : `Check live train location via SMS: text TR ${train.trainNumber} to 9999`}
            </p>
          </div>
        </div>
      </div>

      {/* Clean Vertical Station Timeline */}
      <div className="pt-1">
        <div className="flex items-center justify-between gap-2 mb-4">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>{isBengali ? 'যাত্রাপথের স্টপসমূহ' : 'Stops Along the Way'}</span>
          </h4>
          <span className="text-xs text-slate-500 dark:text-zinc-400 tabular-nums">
            {train.halts.length} {isBengali ? 'স্টেশন' : 'stations'}
          </span>
        </div>

        <ol className="relative pl-6 sm:pl-7 space-y-4">
          {/* Clean vertical line */}
          <div
            aria-hidden="true"
            className="absolute left-[9px] sm:left-[11px] top-2 bottom-2.5 w-0.5 bg-slate-200 dark:bg-zinc-700"
          />

          {train.halts.map((halt, idx) => {
            const isBoarding = idx === segment.fromIndex;
            const isDestination = idx === segment.toIndex;
            const isInTrip = idx >= segment.fromIndex && idx <= segment.toIndex;
            const isEndpoint = isBoarding || isDestination;

            return (
              <li
                key={halt.stationCode}
                className={`relative flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 sm:gap-4 ${
                  segment.isPartialSegment && !isInTrip ? 'opacity-45' : ''
                }`}
              >
                {/* Clean Node Circle */}
                <span
                  aria-hidden="true"
                  className={`absolute -left-6 sm:-left-7 top-1.5 flex items-center justify-center rounded-full ${
                    isEndpoint
                      ? 'w-5 h-5 -translate-x-[1px] bg-emerald-600 ring-4 ring-emerald-500/15'
                      : isInTrip
                      ? 'w-3.5 h-3.5 translate-x-[2px] bg-white dark:bg-zinc-900 border-2 border-emerald-600 dark:border-emerald-400'
                      : 'w-3 h-3 translate-x-[3px] bg-slate-300 dark:bg-zinc-600'
                  }`}
                >
                  {isEndpoint && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </span>

                {/* Station Name & Halt Info */}
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={`text-sm ${
                        isEndpoint
                          ? 'font-semibold text-slate-900 dark:text-zinc-100'
                          : 'font-medium text-slate-800 dark:text-zinc-200'
                      }`}
                    >
                      {isBengali ? halt.stationNameBn : halt.stationName}
                    </span>

                    {isBoarding && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        {isBengali ? 'যাত্রা শুরু' : 'Boarding'}
                      </span>
                    )}

                    {isDestination && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
                        {isBengali ? 'গন্তব্য' : 'Arrival'}
                      </span>
                    )}

                    {halt.dayOffset === 1 && (
                      <span className="text-[11px] font-medium px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300">
                        +1 day
                      </span>
                    )}
                  </div>

                  <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 tabular-nums flex items-center gap-2">
                    <span>{halt.distanceKm} km</span>
                    {halt.haltDurationMinutes > 0 && (
                      <>
                        <span aria-hidden="true">•</span>
                        <span>
                          {halt.haltDurationMinutes} {isBengali ? 'মি. বিরতি' : 'min stop'}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Arrival / Departure Timestamps */}
                <div className="flex items-center gap-3 text-xs sm:text-sm tabular-nums text-slate-700 dark:text-zinc-300 shrink-0 pl-0 sm:pl-2">
                  {halt.arrivalTime !== '--' && (
                    <div>
                      <span className="text-slate-500 dark:text-zinc-400 text-xs mr-1">
                        {isBengali ? 'আগমন' : 'Arr'}
                      </span>
                      <span className="font-mono font-medium text-slate-900 dark:text-zinc-100">
                        {halt.arrivalTime}
                      </span>
                    </div>
                  )}
                  {halt.departureTime !== '--' && (
                    <div>
                      <span className="text-slate-500 dark:text-zinc-400 text-xs mr-1">
                        {isBengali ? 'ছাড়বে' : 'Dep'}
                      </span>
                      <span className="font-mono font-semibold text-slate-900 dark:text-zinc-100">
                        {halt.departureTime}
                      </span>
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {/* Simple Verification Link */}
      <div className="pt-3 border-t border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-zinc-400">
        <span>
          {isBengali
            ? 'স্ট্যান্ডার্ড আন্তঃনগর সময়সূচী অনুযায়ী।'
            : 'Times shown follow standard Bangladesh Railway intercity schedules.'}
        </span>
        <a
          href={DATASET_METADATA.officialPortalUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1 font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
        >
          <span>eticket.railway.gov.bd</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
};
