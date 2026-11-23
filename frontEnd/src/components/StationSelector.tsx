import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapPin, Search, ChevronDown, Check } from 'lucide-react';
import { Station } from '../types/railway';
import { STATIONS } from '../data/railway';
import { TRANSIT_EASE } from './MotionPrimitives';

interface StationSelectorProps {
  label: string;
  labelBn: string;
  selectedStationCode: string;
  onSelectStation: (stationCode: string) => void;
  excludeCode?: string;
  isBengali?: boolean;
}

const HUB_STATIONS = ['DA', 'DA_AIR', 'CTG', 'RJ', 'NAT', 'SYL', 'KLN'];

export const StationSelector: React.FC<StationSelectorProps> = ({
  label,
  labelBn,
  selectedStationCode,
  onSelectStation,
  excludeCode,
  isBengali = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedStation: Station | undefined = STATIONS.find(
    (s: Station) => s.code === selectedStationCode
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const filteredStations = STATIONS.filter((s) => {
    if (excludeCode && s.code === excludeCode) return false;
    if (!query.trim()) return true;
    const q = query.toLowerCase();
    return (
      s.name.toLowerCase().includes(q) ||
      s.nameBn.toLowerCase().includes(q) ||
      (s.shortName && s.shortName.toLowerCase().includes(q)) ||
      s.code.toLowerCase().includes(q) ||
      s.division.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative flex-1 min-w-0" ref={containerRef}>
      <label className="block text-xs font-semibold text-zinc-600 dark:text-zinc-400 uppercase tracking-wider mb-1.5">
        {isBengali ? labelBn : label}
      </label>

      {/* Combobox Trigger (min 44px touch height) */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="w-full min-h-[44px] px-3 bg-white dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-700 rounded-md flex items-center justify-between text-left hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors duration-200 active:scale-[0.99]"
      >
        <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          {selectedStation ? (
            <div className="flex items-center gap-2 truncate">
              <span className="font-semibold text-sm text-zinc-900 dark:text-zinc-100 truncate">
                {isBengali ? selectedStation.nameBn : selectedStation.name}
              </span>
              <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold tabular-nums shrink-0">
                {selectedStation.code}
              </span>
            </div>
          ) : (
            <span className="text-zinc-500 text-sm">Select Station...</span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-zinc-500 dark:text-zinc-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Quick Select Hub Chips (distinct short names — zero duplicate 'Dhaka' chips) */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        <span className="text-[11px] uppercase font-semibold text-zinc-500 dark:text-zinc-400">
          {isBengali ? 'হাব:' : 'Hubs:'}
        </span>
        {HUB_STATIONS.filter((code) => code !== excludeCode).map((code) => {
          const station = STATIONS.find((s) => s.code === code);
          if (!station) return null;
          const isSelected = selectedStationCode === code;
          const chipLabel = isBengali
            ? station.shortNameBn || station.nameBn
            : station.shortName || station.name;
          return (
            <button
              key={code}
              type="button"
              onClick={() => {
                onSelectStation(code);
                setIsOpen(false);
              }}
              aria-pressed={isSelected}
              className={`text-[11px] px-2 py-1 rounded-md transition-colors duration-200 active:scale-[0.98] ${
                isSelected
                  ? 'bg-emerald-600 text-white font-semibold border border-emerald-600'
                  : 'bg-slate-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 border border-zinc-200 dark:border-zinc-700'
              }`}
            >
              {chipLabel}
            </button>
          );
        })}
      </div>

      {/* Dropdown Station List */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: TRANSIT_EASE }}
            role="listbox"
            className="absolute z-40 left-0 right-0 mt-1.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md shadow-xl max-h-72 flex flex-col overflow-hidden"
          >
            <div className="p-2 border-b border-zinc-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 sticky top-0">
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-zinc-500" />
                <input
                  type="text"
                  autoFocus
                  placeholder={
                    isBengali
                      ? 'স্টেশনের নাম বা কোড লিখুন...'
                      : 'Search station name, code, or division...'
                  }
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-md text-xs text-zinc-900 dark:text-zinc-100 placeholder-zinc-500"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-zinc-100 dark:divide-zinc-800">
              {filteredStations.length === 0 ? (
                <div className="p-4 text-center text-xs text-zinc-500 dark:text-zinc-400">
                  No matching railway station found
                </div>
              ) : (
                filteredStations.map((station) => {
                  const isSelected = station.code === selectedStationCode;
                  return (
                    <button
                      key={station.code}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      onClick={() => {
                        onSelectStation(station.code);
                        setIsOpen(false);
                        setQuery('');
                      }}
                      className={`w-full px-3 py-2.5 text-left flex items-center justify-between text-xs transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/40 ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 font-semibold'
                          : 'text-zinc-800 dark:text-zinc-200'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm truncate">
                            {isBengali ? station.nameBn : station.name}
                          </span>
                          <span className="font-mono text-[10px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 font-bold tabular-nums">
                            {station.code}
                          </span>
                        </div>
                        <div className="text-[11px] text-zinc-600 dark:text-zinc-400 flex items-center gap-2 mt-0.5">
                          <span>{station.division} DIVISION</span>
                          {station.platforms && (
                            <span className="font-mono tabular-nums">
                              • {station.platforms} Platform{station.platforms > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
