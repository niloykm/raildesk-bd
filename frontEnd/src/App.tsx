import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { TopStatusBar } from './components/TopStatusBar';
import { WorkstationControls } from './components/WorkstationControls';
import { ScheduleTable } from './components/ScheduleTable';
import { TrainTimeline } from './components/TrainTimeline';
import { FareCalculator } from './components/FareCalculator';
import { JourneyCard } from './components/JourneyCard';
import { RailwayInfo } from './components/RailwayInfo';
import {
  ScrollProgressBar,
  RouteTransition,
  TAB_SPRING,
  TRANSIT_EASE,
} from './components/MotionPrimitives';
import {
  TRAINS,
  TRANSIT_CORRIDORS,
  DATASET_METADATA,
  computeRouteSegment,
  formatDuration,
  getBangladeshTimeNow,
  getWeekdayName,
  isTrainOperatingOnDate,
} from './data/railway';
import { BookingChannel, SeatClass, TransitCorridor } from './types/railway';
import { TrainTrack, MapPin, Calculator, Ticket, Info } from 'lucide-react';

type InspectorTab = 'TIMELINE' | 'FARE' | 'TICKET';
type WorkstationMode = 'JOURNEY' | 'TRACKER';

function parseRouteState(pathname: string): {
  mode: WorkstationMode;
  tab: InspectorTab;
} {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/tracker') return { mode: 'TRACKER', tab: 'TIMELINE' };
  if (clean === '/fares') return { mode: 'JOURNEY', tab: 'FARE' };
  if (clean === '/pass') return { mode: 'JOURNEY', tab: 'TICKET' };
  return { mode: 'JOURNEY', tab: 'TIMELINE' };
}

function getInitialDarkMode(): boolean {
  try {
    const saved =
      localStorage.getItem('raildesk-theme') || localStorage.getItem('nrl-theme');
    if (saved === 'light') return false;
    return true;
  } catch {
    return true;
  }
}

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(getInitialDarkMode);
  const [isBengali, setIsBengali] = useState<boolean>(false);

  // Sync theme with HTML class, localStorage, and theme-color meta tag
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('raildesk-theme', darkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage write errors in restricted browsing modes
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', darkMode ? '#09090b' : '#ffffff');
    }
  }, [darkMode]);

  // Initial route state synced with URL pathname
  const initialRoute = useMemo(
    () => parseRouteState(typeof window !== 'undefined' ? window.location.pathname : '/'),
    []
  );

  const [routeKey, setRouteKey] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname || '/' : '/'
  );
  const [mode, setModeState] = useState<WorkstationMode>(initialRoute.mode);
  const [activeTab, setActiveTabState] = useState<InspectorTab>(initialRoute.tab);

  const syncUrl = useCallback((nextPath: string) => {
    setRouteKey(nextPath);
    try {
      if (typeof window !== 'undefined' && window.location.pathname !== nextPath) {
        window.history.pushState({}, '', nextPath);
      }
    } catch {
      // Ignore history API restrictions
    }
  }, []);

  const setMode = useCallback(
    (nextMode: WorkstationMode) => {
      setModeState(nextMode);
      syncUrl(nextMode === 'TRACKER' ? '/tracker' : '/');
    },
    [syncUrl]
  );

  const setActiveTab = useCallback(
    (nextTab: InspectorTab) => {
      setActiveTabState(nextTab);
      if (nextTab === 'FARE') syncUrl('/fares');
      else if (nextTab === 'TICKET') syncUrl('/pass');
      else syncUrl(mode === 'TRACKER' ? '/tracker' : '/');
    },
    [mode, syncUrl]
  );

  // Handle browser Back/Forward navigation cleanly
  useEffect(() => {
    const onPopState = () => {
      const parsed = parseRouteState(window.location.pathname);
      setModeState(parsed.mode);
      setActiveTabState(parsed.tab);
      setRouteKey(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  // Search, Fare & Filter State
  const [fromStationCode, setFromStationCode] = useState<string>('DA');
  const [toStationCode, setToStationCode] = useState<string>('RJ');
  const [travelDate, setTravelDate] = useState<string>(() => getBangladeshTimeNow().isoDate);
  const [selectedClass, setSelectedClass] = useState<SeatClass | 'ALL'>('ALL');
  const [hideOffDayTrains, setHideOffDayTrains] = useState<boolean>(false);
  const [bookingChannel, setBookingChannel] = useState<BookingChannel>('ONLINE');
  const [passengers, setPassengers] = useState<number>(1);
  const [activeCorridorId, setActiveCorridorId] = useState<string>('corridor-dhk-raj');
  const [selectedTrainNumber, setSelectedTrainNumber] = useState<string>('753');

  // Filter trains for Journey Search
  const matchingTrains = useMemo(() => {
    return TRAINS.filter((train) => {
      const fromHaltIndex = train.halts.findIndex((h) => h.stationCode === fromStationCode);
      const toHaltIndex = train.halts.findIndex((h) => h.stationCode === toStationCode);
      const stopsAtBothInOrder =
        fromHaltIndex !== -1 && toHaltIndex !== -1 && fromHaltIndex < toHaltIndex;
      if (!stopsAtBothInOrder) return false;

      if (selectedClass !== 'ALL' && !train.availableClasses.includes(selectedClass)) {
        return false;
      }

      if (hideOffDayTrains && !isTrainOperatingOnDate(train, travelDate)) {
        return false;
      }

      return true;
    });
  }, [fromStationCode, toStationCode, selectedClass, hideOffDayTrains, travelDate]);

  // Keep selectedTrainNumber synced with matchingTrains in Journey Mode
  useEffect(() => {
    if (mode === 'JOURNEY' && matchingTrains.length > 0) {
      const stillValid = matchingTrains.some((t) => t.trainNumber === selectedTrainNumber);
      if (!stillValid) {
        const firstOperating =
          matchingTrains.find((t) => isTrainOperatingOnDate(t, travelDate)) || matchingTrains[0];
        setSelectedTrainNumber(firstOperating.trainNumber);
      }
    }
  }, [mode, matchingTrains, selectedTrainNumber, travelDate]);

  // Handle Corridor Quick Selection
  const handleSelectCorridor = (corridor: TransitCorridor) => {
    setModeState('JOURNEY');
    setFromStationCode(corridor.originCode);
    setToStationCode(corridor.destinationCode);
    setActiveCorridorId(corridor.id);
    setSelectedClass('ALL');
    syncUrl('/');

    const matching = TRAINS.filter((t) => {
      const fromIdx = t.halts.findIndex((h) => h.stationCode === corridor.originCode);
      const toIdx = t.halts.findIndex((h) => h.stationCode === corridor.destinationCode);
      return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
    });
    if (matching.length > 0) {
      const preferred =
        matching.find((t) => isTrainOperatingOnDate(t, travelDate)) || matching[0];
      setSelectedTrainNumber(preferred.trainNumber);
    }
  };

  // Station Swapping with 1-click (preserves travelDate, class, channel, and passengers)
  const handleSwapStations = () => {
    const nextFrom = toStationCode;
    const nextTo = fromStationCode;
    setFromStationCode(nextFrom);
    setToStationCode(nextTo);

    const matchedCorridor = TRANSIT_CORRIDORS.find(
      (c) => c.originCode === nextFrom && c.destinationCode === nextTo
    );
    setActiveCorridorId(matchedCorridor ? matchedCorridor.id : '');

    const matching = TRAINS.filter((t) => {
      const fromIdx = t.halts.findIndex((h) => h.stationCode === nextFrom);
      const toIdx = t.halts.findIndex((h) => h.stationCode === nextTo);
      return fromIdx !== -1 && toIdx !== -1 && fromIdx < toIdx;
    });
    if (matching.length > 0) {
      const preferred =
        matching.find((t) => isTrainOperatingOnDate(t, travelDate)) || matching[0];
      setSelectedTrainNumber(preferred.trainNumber);
    }
  };

  const handleResetFilters = () => {
    setFromStationCode('DA');
    setToStationCode('RJ');
    setSelectedClass('ALL');
    setHideOffDayTrains(false);
    setActiveCorridorId('corridor-dhk-raj');
    setSelectedTrainNumber('753');
  };

  // Selected Train object & Single Source of Truth Route Segment
  const currentTrain = useMemo(() => {
    return TRAINS.find((t) => t.trainNumber === selectedTrainNumber) || TRAINS[0];
  }, [selectedTrainNumber]);

  const activeSegment = useMemo(() => {
    if (mode === 'JOURNEY') {
      return computeRouteSegment(currentTrain, fromStationCode, toStationCode);
    }
    return computeRouteSegment(currentTrain);
  }, [mode, currentTrain, fromStationCode, toStationCode]);

  const effectiveClass: SeatClass = useMemo(() => {
    if (selectedClass !== 'ALL' && currentTrain.availableClasses.includes(selectedClass)) {
      return selectedClass;
    }
    return currentTrain.availableClasses[0] || 'S_CHAIR';
  }, [selectedClass, currentTrain]);

  const inspectorTabs: { id: InspectorTab; icon: React.ReactNode; label: string; labelBn: string }[] = [
    {
      id: 'TIMELINE',
      icon: <MapPin className="w-3.5 h-3.5 shrink-0" />,
      label: 'Stops & Stepper',
      labelBn: 'স্টেশন ও স্টেপার',
    },
    {
      id: 'FARE',
      icon: <Calculator className="w-3.5 h-3.5 shrink-0" />,
      label: 'Fare Calculator',
      labelBn: 'ভাড়া ক্যালকুলেটর',
    },
    {
      id: 'TICKET',
      icon: <Ticket className="w-3.5 h-3.5 shrink-0" />,
      label: 'Journey Summary',
      labelBn: 'যাত্রা কার্ড',
    },
  ];

  const selectedWeekday = getWeekdayName(travelDate);
  const currentTrainOperating = isTrainOperatingOnDate(currentTrain, travelDate);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      {/* Subtle Top Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Top Utility & Roster Header */}
      <TopStatusBar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onSelectCorridor={handleSelectCorridor}
        activeCorridorId={activeCorridorId}
        isBengali={isBengali}
        setIsBengali={setIsBengali}
        onNavigateHome={() => {
          setModeState('JOURNEY');
          setActiveTabState('TIMELINE');
          syncUrl('/');
        }}
      />

      {/* Main Workspace with Route Open Transition */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-5 lg:p-6">
        <RouteTransition routeKey={routeKey.split('/')[1] || 'home'} className="space-y-5">
          {/* Workstation Controls (Search or Direct Roster Inspector) */}
          <WorkstationControls
            mode={mode}
            setMode={setMode}
            fromStationCode={fromStationCode}
            setFromStationCode={(code) => {
              setFromStationCode(code);
              setActiveCorridorId('');
            }}
            toStationCode={toStationCode}
            setToStationCode={(code) => {
              setToStationCode(code);
              setActiveCorridorId('');
            }}
            travelDate={travelDate}
            setTravelDate={setTravelDate}
            selectedClass={selectedClass}
            setSelectedClass={setSelectedClass}
            hideOffDayTrains={hideOffDayTrains}
            setHideOffDayTrains={setHideOffDayTrains}
            selectedTrainNumber={selectedTrainNumber}
            setSelectedTrainNumber={setSelectedTrainNumber}
            onSwapStations={handleSwapStations}
            onResetFilters={handleResetFilters}
            isBengali={isBengali}
          />

          {/* Desktop Split Workstation (12-col) / Mobile Single-Column */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Workstation Pane (5 cols on desktop) */}
            <div className="lg:col-span-5 min-w-0 space-y-4">
              {mode === 'JOURNEY' ? (
                <ScheduleTable
                  trains={matchingTrains}
                  fromStationCode={fromStationCode}
                  toStationCode={toStationCode}
                  travelDate={travelDate}
                  selectedTrainNumber={selectedTrainNumber}
                  onSelectTrain={(num) => {
                    setSelectedTrainNumber(num);
                    setActiveTab('TIMELINE');
                  }}
                  selectedClass={selectedClass}
                  bookingChannel={bookingChannel}
                  isBengali={isBengali}
                  onResetFilters={handleResetFilters}
                />
              ) : (
                /* Mode B active roster summary panel */
                <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 sm:p-5 space-y-3">
                  <div className="flex items-center justify-between pb-2.5 border-b border-zinc-200 dark:border-zinc-800">
                    <div className="flex items-center gap-2">
                      <TrainTrack className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                      <h2 className="font-bold text-sm text-zinc-900 dark:text-zinc-100">
                        Roster Specifications
                      </h2>
                    </div>
                    <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-600 text-white font-bold tabular-nums">
                      #{currentTrain.trainNumber}
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between gap-2 py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-600 dark:text-zinc-400">Train Name:</span>
                      <span className="font-semibold text-right text-zinc-900 dark:text-zinc-100">
                        {currentTrain.trainName} ({currentTrain.trainNameBn})
                      </span>
                    </div>
                    <div className="flex justify-between gap-2 py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-600 dark:text-zinc-400">Route:</span>
                      <span className="font-mono font-medium text-right">
                        {currentTrain.halts[0].stationName} →{' '}
                        {currentTrain.halts[currentTrain.halts.length - 1].stationName}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2 py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-600 dark:text-zinc-400">Scheduled Run:</span>
                      <span className="font-mono tabular-nums font-medium text-right">
                        {currentTrain.departureTime} → {currentTrain.arrivalTime}
                        {currentTrain.overnight ? ' (+1d)' : ''} ({formatDuration(currentTrain.durationMinutes)})
                      </span>
                    </div>
                    <div className="flex justify-between gap-2 py-1.5 border-b border-zinc-100 dark:border-zinc-800">
                      <span className="text-zinc-600 dark:text-zinc-400">Weekly Off-Day:</span>
                      <span className="font-mono text-rose-700 dark:text-rose-400 font-bold">
                        {currentTrain.offDays.length === 0
                          ? 'None (Runs Daily)'
                          : currentTrain.offDays.join(', ')}
                      </span>
                    </div>
                    <div className="flex justify-between gap-2 py-1.5">
                      <span className="text-zinc-600 dark:text-zinc-400">
                        Status ({selectedWeekday}):
                      </span>
                      <span
                        className={`font-mono font-bold uppercase ${
                          currentTrainOperating
                            ? 'text-emerald-700 dark:text-emerald-400'
                            : 'text-rose-700 dark:text-rose-400'
                        }`}
                      >
                        {currentTrainOperating ? 'OPERATING' : 'OFF-DAY'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Data Provenance & Boarding Guidance */}
              <div className="p-3.5 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-xs text-zinc-600 dark:text-zinc-400 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100">
                    Reference Schedule &amp; Tariff Notice ({DATASET_METADATA.version})
                  </span>
                  <p className="mt-1 text-xs leading-relaxed">{DATASET_METADATA.disclaimer}</p>
                </div>
              </div>
            </div>

            {/* Right Workstation Pane (7 cols on desktop): Stepper / Fare Calculator / Summary */}
            <div className="lg:col-span-7 min-w-0 space-y-4">
              {/* View Tab Switcher with Shared-Element Active Indicator */}
              <div
                role="tablist"
                aria-label="Train Detail Inspector"
                className="grid grid-cols-3 gap-1 p-1 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-md text-xs"
              >
                {inspectorTabs.map((tab) => {
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveTab(tab.id)}
                      className={`relative min-h-[40px] py-2 px-2 rounded-md text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors duration-200 active:scale-[0.98] ${
                        isActive
                          ? 'text-white'
                          : 'text-zinc-700 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-zinc-100'
                      }`}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="inspector-tab-pill"
                          transition={TAB_SPRING}
                          className="absolute inset-0 rounded-md bg-emerald-600"
                        />
                      )}
                      <span className="relative z-10 inline-flex items-center gap-1.5 truncate">
                        {tab.icon}
                        <span className="truncate">{isBengali ? tab.labelBn : tab.label}</span>
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Animated Inspector Tab Content */}
              <AnimatePresence mode="wait">
                {activeTab === 'TIMELINE' && (
                  <motion.div
                    key={`timeline-${currentTrain.trainNumber}-${activeSegment.originHalt.stationCode}-${activeSegment.destinationHalt.stationCode}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: TRANSIT_EASE }}
                  >
                    <TrainTimeline
                      train={currentTrain}
                      segment={activeSegment}
                      travelDate={travelDate}
                      isBengali={isBengali}
                    />
                  </motion.div>
                )}

                {activeTab === 'FARE' && (
                  <motion.div
                    key={`fare-${currentTrain.trainNumber}-${activeSegment.distanceKm}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: TRANSIT_EASE }}
                  >
                    <FareCalculator
                      segment={activeSegment}
                      availableClasses={currentTrain.availableClasses}
                      selectedClass={effectiveClass}
                      onSelectClass={(cls) => setSelectedClass(cls)}
                      bookingChannel={bookingChannel}
                      setBookingChannel={setBookingChannel}
                      passengers={passengers}
                      setPassengers={setPassengers}
                      isBengali={isBengali}
                      onProceedToTicket={() => setActiveTab('TICKET')}
                    />
                  </motion.div>
                )}

                {activeTab === 'TICKET' && (
                  <motion.div
                    key={`ticket-${currentTrain.trainNumber}-${effectiveClass}-${bookingChannel}-${passengers}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: TRANSIT_EASE }}
                  >
                    <JourneyCard
                      train={currentTrain}
                      segment={activeSegment}
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
          </div>

          {/* Operational Guidance Section (Luggage, Off-days, Refunds, Helpline) */}
          <section
            aria-label="Bangladesh Railway Operational Guidance"
            className="pt-4 border-t border-zinc-200 dark:border-zinc-800"
          >
            <RailwayInfo isBengali={isBengali} />
          </section>
        </RouteTransition>
      </main>

      {/* Operational Footer */}
      <footer className="mt-auto border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-4 px-3 sm:px-6 transition-colors duration-200">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-600 dark:text-zinc-400">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-mono font-bold text-zinc-900 dark:text-zinc-100">
              RailDesk BD
            </span>
            <span aria-hidden="true">•</span>
            <span>Bangladesh Railway Timetable, Route Stepper &amp; Statutory Fare Calculator</span>
          </div>
          <div className="flex items-center gap-3 font-mono text-[11px] tabular-nums">
            <span>Helpline: 131</span>
            <span aria-hidden="true">•</span>
            <span className="text-emerald-700 dark:text-emerald-400 font-semibold">
              Roster: {DATASET_METADATA.version}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
