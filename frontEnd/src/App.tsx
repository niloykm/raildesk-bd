import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { TopStatusBar } from './components/TopStatusBar';
import { WorkstationControls } from './components/WorkstationControls';
import { ScheduleTable, ExpandedPanel } from './components/ScheduleTable';
import { RailwayInfo } from './components/RailwayInfo';
import { ScrollProgressBar, RouteTransition } from './components/MotionPrimitives';
import {
  TRAINS,
  TRANSIT_CORRIDORS,
  getBangladeshTimeNow,
  isTrainOperatingOnDate,
} from './data/railway';
import { BookingChannel, SeatClass, TransitCorridor } from './types/railway';

type SearchMode = 'JOURNEY' | 'TRACKER';

function parseRouteState(pathname: string): {
  mode: SearchMode;
  initialPanel: ExpandedPanel | null;
} {
  const clean = pathname.replace(/\/+$/, '') || '/';
  if (clean === '/tracker' || clean === '/trains') {
    return { mode: 'TRACKER', initialPanel: 'STOPS' };
  }
  if (clean === '/fares') {
    return { mode: 'JOURNEY', initialPanel: 'FARE' };
  }
  if (clean === '/pass' || clean === '/summary') {
    return { mode: 'JOURNEY', initialPanel: 'SUMMARY' };
  }
  return { mode: 'JOURNEY', initialPanel: null };
}

function getInitialDarkMode(): boolean {
  try {
    return localStorage.getItem('raildesk-theme-v2') === 'dark';
  } catch {
    return false;
  }
}

export const App: React.FC = () => {
  const [darkMode, setDarkMode] = useState<boolean>(getInitialDarkMode);
  const [isBengali, setIsBengali] = useState<boolean>(false);

  // Sync light/dark theme cleanly
  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    try {
      localStorage.setItem('raildesk-theme-v2', darkMode ? 'dark' : 'light');
    } catch {
      // Ignore storage restrictions
    }
    const metaTheme = document.querySelector('meta[name="theme-color"]');
    if (metaTheme) {
      metaTheme.setAttribute('content', darkMode ? '#09090b' : '#f8fafc');
    }
  }, [darkMode]);

  const initialRoute = useMemo(
    () => parseRouteState(typeof window !== 'undefined' ? window.location.pathname : '/'),
    []
  );

  const [routeKey, setRouteKey] = useState<string>(() =>
    typeof window !== 'undefined' ? window.location.pathname || '/' : '/'
  );
  const [mode, setModeState] = useState<SearchMode>(initialRoute.mode);

  // Route, date & passenger preferences
  const [fromStationCode, setFromStationCode] = useState<string>('DA');
  const [toStationCode, setToStationCode] = useState<string>('RJ');
  const [travelDate, setTravelDate] = useState<string>(() => getBangladeshTimeNow().isoDate);
  const [selectedClass, setSelectedClass] = useState<SeatClass | 'ALL'>('ALL');
  const [hideOffDayTrains, setHideOffDayTrains] = useState<boolean>(false);
  const [bookingChannel, setBookingChannel] = useState<BookingChannel>('ONLINE');
  const [passengers, setPassengers] = useState<number>(1);
  const [activeCorridorId, setActiveCorridorId] = useState<string>('corridor-dhk-raj');
  const [selectedTrainNumber, setSelectedTrainNumber] = useState<string>('753');

  // Step 3 progressive disclosure state (cards start collapsed on "/" for calm scannability)
  const [expandedTrainNumber, setExpandedTrainNumber] = useState<string | null>(() =>
    initialRoute.initialPanel ? '753' : null
  );
  const [expandedPanel, setExpandedPanel] = useState<ExpandedPanel>(
    initialRoute.initialPanel ?? 'STOPS'
  );

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
    (nextMode: SearchMode) => {
      setModeState(nextMode);
      if (nextMode === 'TRACKER') {
        setExpandedTrainNumber(selectedTrainNumber);
        setExpandedPanel('STOPS');
        syncUrl('/trains');
      } else {
        setExpandedTrainNumber(null);
        syncUrl('/');
      }
    },
    [selectedTrainNumber, syncUrl]
  );

  useEffect(() => {
    const onPopState = () => {
      const parsed = parseRouteState(window.location.pathname);
      setModeState(parsed.mode);
      if (parsed.initialPanel) {
        setExpandedTrainNumber(selectedTrainNumber);
        setExpandedPanel(parsed.initialPanel);
      } else {
        setExpandedTrainNumber(null);
      }
      setRouteKey(window.location.pathname || '/');
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [selectedTrainNumber]);

  // Matching trains for route search
  const matchingTrains = useMemo(() => {
    return TRAINS.filter((train) => {
      const fromIdx = train.halts.findIndex((h) => h.stationCode === fromStationCode);
      const toIdx = train.halts.findIndex((h) => h.stationCode === toStationCode);
      if (fromIdx === -1 || toIdx === -1 || fromIdx >= toIdx) return false;

      if (selectedClass !== 'ALL' && !train.availableClasses.includes(selectedClass)) {
        return false;
      }

      if (hideOffDayTrains && !isTrainOperatingOnDate(train, travelDate)) {
        return false;
      }

      return true;
    });
  }, [fromStationCode, toStationCode, selectedClass, hideOffDayTrains, travelDate]);

  const displayedTrains = useMemo(() => {
    if (mode === 'TRACKER') {
      const chosen = TRAINS.find((t) => t.trainNumber === selectedTrainNumber) || TRAINS[0];
      return [chosen];
    }
    return matchingTrains;
  }, [mode, selectedTrainNumber, matchingTrains]);

  // Collapse expanded card cleanly if route filter no longer contains it
  useEffect(() => {
    if (
      mode === 'JOURNEY' &&
      expandedTrainNumber &&
      !matchingTrains.some((t) => t.trainNumber === expandedTrainNumber)
    ) {
      setExpandedTrainNumber(null);
    }
  }, [mode, matchingTrains, expandedTrainNumber]);

  const handleToggleTrainPanel = (trainNumber: string, panel: ExpandedPanel) => {
    if (expandedTrainNumber === trainNumber && expandedPanel === panel) {
      setExpandedTrainNumber(null);
      if (mode === 'JOURNEY') syncUrl('/');
      return;
    }
    setSelectedTrainNumber(trainNumber);
    setExpandedTrainNumber(trainNumber);
    setExpandedPanel(panel);
    if (mode === 'JOURNEY') {
      if (panel === 'FARE') syncUrl('/fares');
      else if (panel === 'SUMMARY') syncUrl('/summary');
      else syncUrl('/');
    }
  };

  const handleSelectCorridor = (corridor: TransitCorridor) => {
    setModeState('JOURNEY');
    setFromStationCode(corridor.originCode);
    setToStationCode(corridor.destinationCode);
    setActiveCorridorId(corridor.id);
    setSelectedClass('ALL');
    setExpandedTrainNumber(null);
    syncUrl('/');
  };

  const handleSwapStations = () => {
    const nextFrom = toStationCode;
    const nextTo = fromStationCode;
    setFromStationCode(nextFrom);
    setToStationCode(nextTo);
    setExpandedTrainNumber(null);

    const matchedCorridor = TRANSIT_CORRIDORS.find(
      (c) => c.originCode === nextFrom && c.destinationCode === nextTo
    );
    setActiveCorridorId(matchedCorridor ? matchedCorridor.id : '');
  };

  const handleResetFilters = () => {
    setFromStationCode('DA');
    setToStationCode('RJ');
    setSelectedClass('ALL');
    setHideOffDayTrains(false);
    setActiveCorridorId('corridor-dhk-raj');
    setExpandedTrainNumber(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col font-sans transition-colors duration-200">
      <ScrollProgressBar />

      <TopStatusBar
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        isBengali={isBengali}
        setIsBengali={setIsBengali}
        onNavigateHome={() => {
          setModeState('JOURNEY');
          setExpandedTrainNumber(null);
          syncUrl('/');
        }}
      />

      {/* Calm, Centered 3-Step Passenger Flow */}
      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <RouteTransition routeKey={routeKey.split('/')[1] || 'home'} className="space-y-8">
          {/* Step 1: Route & Day Picker */}
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
            setSelectedTrainNumber={(num) => {
              setSelectedTrainNumber(num);
              if (mode === 'TRACKER') {
                setExpandedTrainNumber(num);
              }
            }}
            activeCorridorId={activeCorridorId}
            onSelectCorridor={handleSelectCorridor}
            onSwapStations={handleSwapStations}
            onResetFilters={handleResetFilters}
            isBengali={isBengali}
          />

          {/* Step 2 & Step 3: Clean Train Cards + Expandable Stops & Fare Details */}
          <ScheduleTable
            trains={displayedTrains}
            fromStationCode={mode === 'JOURNEY' ? fromStationCode : undefined}
            toStationCode={mode === 'JOURNEY' ? toStationCode : undefined}
            travelDate={travelDate}
            expandedTrainNumber={expandedTrainNumber}
            expandedPanel={expandedPanel}
            onToggleTrainPanel={handleToggleTrainPanel}
            selectedClass={selectedClass}
            onSelectClass={(cls) => setSelectedClass(cls)}
            bookingChannel={bookingChannel}
            setBookingChannel={setBookingChannel}
            passengers={passengers}
            setPassengers={setPassengers}
            isBengali={isBengali}
            onResetFilters={handleResetFilters}
            headingOverride={
              mode === 'TRACKER'
                ? isBengali
                  ? 'নির্বাচিত ট্রেনের বিবরণ'
                  : 'Selected Train Schedule'
                : undefined
            }
          />

          {/* Calm Travel Help & FAQs */}
          <section
            aria-label="Helpful Travel Information"
            className="pt-6 border-t border-slate-200 dark:border-zinc-800"
          >
            <RailwayInfo isBengali={isBengali} />
          </section>
        </RouteTransition>
      </main>

      {/* Clean Passenger Footer */}
      <footer className="mt-auto border-t border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 py-5 px-4 sm:px-6 transition-colors duration-200">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 dark:text-zinc-400">
          <p className="text-center sm:text-left">
            <strong className="text-slate-900 dark:text-zinc-100">RailDesk BD</strong> — Reference schedules &amp; fare estimates for Bangladesh Railway intercity trains.
          </p>
          <p className="shrink-0">
            Confirm live seats on{' '}
            <a
              href="https://eticket.railway.gov.bd/"
              target="_blank"
              rel="noreferrer"
              className="font-medium text-emerald-700 dark:text-emerald-400 hover:underline"
            >
              eticket.railway.gov.bd
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
