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

const POPULAR_STATIONS = ['DA', 'DA_AIR', 'CTG', 'RJ', 'NAT', 'SYL', 'KLN'];

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
      s.shortName.toLowerCase().includes(q) ||
      s.code.toLowerCase().includes(q) ||
      s.division.toLowerCase().includes(q)
    );
  });

  return (
    <div className="relative flex-1 min-w-0" ref={containerRef}>
      <label className="block text-sm font-medium text-slate-700 dark:text-zinc-300 mb-1.5">
        {isBengali ? labelBn : label}
      </label>

      {/* Station Picker Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className="w-full min-h-[48px] px-3.5 bg-white dark:bg-zinc-950 border border-slate-300 dark:border-zinc-700 rounded-lg flex items-center justify-between gap-2 text-left hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors duration-200 active:scale-[0.99]"
      >
        <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
          <MapPin className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          {selectedStation ? (
            <span className="font-semibold text-[15px] text-slate-900 dark:text-zinc-100 truncate">
              {isBengali ? selectedStation.nameBn : selectedStation.name}
            </span>
          ) : (
            <span className="text-slate-500 text-sm">Choose a station</span>
          )}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 dark:text-zinc-400 shrink-0 transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Quick-pick station pills */}
      <div className="flex flex-wrap items-center gap-1.5 mt-2">
        {POPULAR_STATIONS.filter((code) => code !== excludeCode).map((code) => {
          const station = STATIONS.find((s) => s.code === code);
          if (!station) return null;
          const isSelected = selectedStationCode === code;
          const chipLabel = isBengali ? station.shortNameBn : station.shortName;
          return (
            <button
              key={code}
              type="button"
              onClick={() => {
                onSelectStation(code);
                setIsOpen(false);
              }}
              aria-pressed={isSelected}
              className={`text-xs px-2.5 py-1 rounded-md transition-colors duration-200 active:scale-[0.98] ${
                isSelected
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-300 dark:border-emerald-700'
                  : 'bg-slate-100 dark:bg-zinc-800/80 hover:bg-slate-200/80 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 border border-transparent'
              }`}
            >
              {chipLabel}
            </button>
          );
        })}
      </div>

      {/* Searchable Station Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.18, ease: TRANSIT_EASE }}
            role="listbox"
            className="absolute z-40 left-0 right-0 mt-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg shadow-lg max-h-72 flex flex-col overflow-hidden"
          >
            <div className="p-2.5 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-950 sticky top-0">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  autoFocus
                  placeholder={isBengali ? 'স্টেশনের নাম খুঁজুন...' : 'Search station or city...'}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-slate-300 dark:border-zinc-700 rounded-md text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400"
                />
              </div>
            </div>

            <div className="overflow-y-auto flex-1 divide-y divide-slate-100 dark:divide-zinc-800">
              {filteredStations.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-500 dark:text-zinc-400">
                  No matching station found
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
                      className={`w-full px-3.5 py-2.5 text-left flex items-center justify-between gap-2 transition-colors hover:bg-emerald-50 dark:hover:bg-emerald-950/30 ${
                        isSelected
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200 font-semibold'
                          : 'text-slate-800 dark:text-zinc-200'
                      }`}
                    >
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">
                          {isBengali ? station.nameBn : station.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-zinc-400">
                          {station.division.charAt(0) + station.division.slice(1).toLowerCase()} Division
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
