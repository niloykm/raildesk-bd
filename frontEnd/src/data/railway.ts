import type {
  BookingChannel,
  ComputedHaltState,
  FareBreakdown,
  RouteSegment,
  SeatClass,
  Station,
  StationHalt,
  Train,
  TrainProgressEstimate,
  TransitCorridor,
  WeekdayName,
} from '../types/railway';

export const DATASET_METADATA = {
  version: 'BR-2026.1',
  label: 'Static Reference Roster (BR Intercity)',
  labelBn: 'রেফারেন্স সময়সূচী (বাংলাদেশ রেলওয়ে)',
  officialPortalUrl: 'https://eticket.railway.gov.bd/',
  smsFormat: 'TR <Train_No> to 9999',
  disclaimer:
    'Timetables, operating days, and distance-based fare estimates reflect standard Bangladesh Railway intercity schedules and statutory tariff rules (15% AC VAT, ৳50 berth bedding, ৳20 online fee). Verify live seat inventory and real-time running status via eticket.railway.gov.bd or SMS (TR <No> to 9999).',
} as const;

export const WEEKDAYS: WeekdayName[] = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
];

export const STATIONS: Station[] = [
  { code: 'DA', name: 'Dhaka (Kamalapur)', nameBn: 'ঢাকা (কমলাপুর)', shortName: 'Kamalapur', shortNameBn: 'কমলাপুর', division: 'DHAKA', hub: true, platforms: 9 },
  { code: 'DA_AIR', name: 'Dhaka Biman Bandar', nameBn: 'ঢাকা বিমানবন্দর', shortName: 'Biman Bandar', shortNameBn: 'বিমানবন্দর', division: 'DHAKA', hub: true, platforms: 2 },
  { code: 'JYP', name: 'Joydebpur', nameBn: 'জয়দেবপুর', shortName: 'Joydebpur', shortNameBn: 'জয়দেবপুর', division: 'DHAKA', hub: true, platforms: 4 },
  { code: 'TGI', name: 'Tongi Junction', nameBn: 'টঙ্গী জংশন', shortName: 'Tongi', shortNameBn: 'টঙ্গী', division: 'DHAKA', hub: false, platforms: 3 },
  { code: 'CTG', name: 'Chattogram', nameBn: 'চট্টগ্রাম', shortName: 'Chattogram', shortNameBn: 'চট্টগ্রাম', division: 'CHATTOGRAM', hub: true, platforms: 8 },
  { code: 'FENI', name: 'Feni Junction', nameBn: 'ফেনী জংশন', shortName: 'Feni', shortNameBn: 'ফেনী', division: 'CHATTOGRAM', hub: true, platforms: 3 },
  { code: 'COM', name: 'Cumilla', nameBn: 'কুমিল্লা', shortName: 'Cumilla', shortNameBn: 'কুমিল্লা', division: 'CHATTOGRAM', hub: true, platforms: 3 },
  { code: 'BBA', name: 'Brahmanbaria', nameBn: 'ব্রাহ্মণবাড়িয়া', shortName: 'B.Baria', shortNameBn: 'ব্রাহ্মণবাড়িয়া', division: 'CHATTOGRAM', hub: false, platforms: 2 },
  { code: 'AKH', name: 'Akhaura Junction', nameBn: 'আখাউড়া জংশন', shortName: 'Akhaura', shortNameBn: 'আখাউড়া', division: 'CHATTOGRAM', hub: true, platforms: 4 },
  { code: 'RJ', name: 'Rajshahi', nameBn: 'রাজশাহী', shortName: 'Rajshahi', shortNameBn: 'রাজশাহী', division: 'RAJSHAHI', hub: true, platforms: 4 },
  { code: 'NAT', name: 'Natore', nameBn: 'নাটোর', shortName: 'Natore', shortNameBn: 'নাটোর', division: 'RAJSHAHI', hub: true, platforms: 2 },
  { code: 'ISD_BYP', name: 'Ishwardi Bypass', nameBn: 'ঈশ্বরদী বাইপাস', shortName: 'Ishwardi', shortNameBn: 'ঈশ্বরদী', division: 'RAJSHAHI', hub: true, platforms: 2 },
  { code: 'SYL', name: 'Sylhet', nameBn: 'সিলেট', shortName: 'Sylhet', shortNameBn: 'সিলেট', division: 'SYLHET', hub: true, platforms: 3 },
  { code: 'SRM', name: 'Sreemangal', nameBn: 'শ্রীমঙ্গল', shortName: 'Sreemangal', shortNameBn: 'শ্রীমঙ্গল', division: 'SYLHET', hub: true, platforms: 2 },
  { code: 'KUL', name: 'Kulaura Junction', nameBn: 'কুলাউড়া জংশন', shortName: 'Kulaura', shortNameBn: 'কুলাউড়া', division: 'SYLHET', hub: false, platforms: 2 },
  { code: 'KLN', name: 'Khulna', nameBn: 'খুলনা', shortName: 'Khulna', shortNameBn: 'খুলনা', division: 'KHULNA', hub: true, platforms: 4 },
  { code: 'JSR', name: 'Jashore', nameBn: 'যশোর', shortName: 'Jashore', shortNameBn: 'যশোর', division: 'KHULNA', hub: true, platforms: 2 },
  { code: 'BNP', name: 'Benapole', nameBn: 'বেনাপোল', shortName: 'Benapole', shortNameBn: 'বেনাপোল', division: 'KHULNA', hub: true, platforms: 2 },
  { code: 'RNG', name: 'Rangpur', nameBn: 'রংপুর', shortName: 'Rangpur', shortNameBn: 'রংপুর', division: 'RANGPUR', hub: true, platforms: 3 },
  { code: 'BOG', name: 'Bogura', nameBn: 'বগুড়া', shortName: 'Bogura', shortNameBn: 'বগুড়া', division: 'RAJSHAHI', hub: true, platforms: 2 },
  { code: 'BHN', name: 'Bhanga Junction', nameBn: 'ভাঙ্গা জংশন', shortName: 'Bhanga', shortNameBn: 'ভাঙ্গা', division: 'DHAKA', hub: true, platforms: 4 },
];

export const TRANSIT_CORRIDORS: TransitCorridor[] = [
  {
    id: 'corridor-dhk-ctg',
    label: 'Dhaka – Chattogram',
    labelBn: 'ঢাকা – চট্টগ্রাম',
    originCode: 'DA',
    destinationCode: 'CTG',
    distanceKm: 321,
    avgDuration: '5h 20m',
    frequency: '3 bidirectional pairs in roster',
  },
  {
    id: 'corridor-dhk-raj',
    label: 'Dhaka – Rajshahi',
    labelBn: 'ঢাকা – রাজশাহী',
    originCode: 'DA',
    destinationCode: 'RJ',
    distanceKm: 343,
    avgDuration: '5h 40m',
    frequency: '3 bidirectional pairs in roster',
  },
  {
    id: 'corridor-dhk-syl',
    label: 'Dhaka – Sylhet',
    labelBn: 'ঢাকা – সিলেট',
    originCode: 'DA',
    destinationCode: 'SYL',
    distanceKm: 319,
    avgDuration: '6h 35m',
    frequency: '2 bidirectional pairs in roster',
  },
  {
    id: 'corridor-dhk-kln',
    label: 'Dhaka – Khulna',
    labelBn: 'ঢাকা – খুলনা',
    originCode: 'DA',
    destinationCode: 'KLN',
    distanceKm: 260,
    avgDuration: '7h 40m',
    frequency: 'Via Padma Bridge & Jashore',
  },
  {
    id: 'corridor-dhk-rng',
    label: 'Dhaka – Rangpur',
    labelBn: 'ঢাকা – রংপুর',
    originCode: 'DA',
    destinationCode: 'RNG',
    distanceKm: 420,
    avgDuration: '9h 55m',
    frequency: '1 bidirectional pair in roster',
  },
];

export const SEAT_CLASS_META: Record<
  SeatClass,
  {
    name: string;
    nameBn: string;
    ratePerKm: number;
    minBaseFare: number;
    isAc: boolean;
    beddingCharge: number;
    luggageLimitKg: number;
    description: string;
  }
> = {
  SHOVAN: {
    name: 'Shovan (Non-AC)',
    nameBn: 'শোভন',
    ratePerKm: 0.78,
    minBaseFare: 45,
    isAc: false,
    beddingCharge: 0,
    luggageLimitKg: 28,
    description: 'Non-AC standard bench seating (VAT exempt)',
  },
  S_CHAIR: {
    name: 'Shovan Chair (S_CHAIR)',
    nameBn: 'শোভন চেয়ার',
    ratePerKm: 1.08,
    minBaseFare: 55,
    isAc: false,
    beddingCharge: 0,
    luggageLimitKg: 28,
    description: 'Non-AC cushioned 2x2 reclining chair seats (VAT exempt)',
  },
  SNIGDHA: {
    name: 'Snigdha (AC Chair)',
    nameBn: 'স্নিগ্ধা (এসি চেয়ার)',
    ratePerKm: 1.85,
    minBaseFare: 110,
    isAc: true,
    beddingCharge: 0,
    luggageLimitKg: 37.5,
    description: 'Air-conditioned chair coach (+15% statutory VAT)',
  },
  F_BERTH: {
    name: 'First Class Berth',
    nameBn: 'ফার্স্ট ক্লাস বার্থ',
    ratePerKm: 2.15,
    minBaseFare: 150,
    isAc: false,
    beddingCharge: 50,
    luggageLimitKg: 37.5,
    description: 'Non-AC sleeping cabin with ৳50 bedding charge',
  },
  AC_S: {
    name: 'AC Seat (Day Cabin)',
    nameBn: 'এসি সিট',
    ratePerKm: 2.22,
    minBaseFare: 140,
    isAc: true,
    beddingCharge: 0,
    luggageLimitKg: 56,
    description: 'Air-conditioned coupe seating (+15% statutory VAT)',
  },
  AC_B: {
    name: 'AC Berth (Sleeper)',
    nameBn: 'এসি বার্থ',
    ratePerKm: 3.15,
    minBaseFare: 200,
    isAc: true,
    beddingCharge: 50,
    luggageLimitKg: 56,
    description: 'Air-conditioned lockable sleeper cabin (+15% VAT & ৳50 bedding)',
  },
};

export const ONLINE_SERVICE_FEE_BDT = 20;
export const AC_VAT_RATE = 0.15;

export function parseTimeToMinutes(hhmm: string): number {
  const [hStr, mStr] = hhmm.split(':');
  const hours = Number(hStr);
  const minutes = Number(mStr);
  if (Number.isNaN(hours) || Number.isNaN(minutes)) return 0;
  return hours * 60 + minutes;
}

export function formatMinutesToHHMM(totalMinutes: number): string {
  const normalized = ((Math.floor(totalMinutes) % 1440) + 1440) % 1440;
  const h = Math.floor(normalized / 60);
  const m = normalized % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatDuration(minutes: number): string {
  const safe = Math.max(0, Math.round(minutes));
  const h = Math.floor(safe / 60);
  const m = safe % 60;
  return `${h}h ${String(m).padStart(2, '0')}m`;
}

export function computeElapsedMinutes(depTime: string, targetTime: string, dayOffset = 0): number {
  const dep = parseTimeToMinutes(depTime);
  let target = parseTimeToMinutes(targetTime) + dayOffset * 1440;
  if (target < dep) {
    target += 1440;
  }
  return target - dep;
}

function buildTrain(config: Omit<Train, 'departureTime' | 'arrivalTime' | 'durationMinutes' | 'overnight' | 'totalDistanceKm' | 'scheduleSource'>): Train {
  const first = config.halts[0];
  const last = config.halts[config.halts.length - 1];
  const overnight = Boolean(last.dayOffset === 1 || parseTimeToMinutes(last.arrivalTime) < parseTimeToMinutes(first.departureTime));
  const durationMinutes = computeElapsedMinutes(first.departureTime, last.arrivalTime, last.dayOffset ?? 0);

  return {
    ...config,
    departureTime: first.departureTime,
    arrivalTime: last.arrivalTime,
    overnight,
    durationMinutes,
    totalDistanceKm: last.distanceKm,
    scheduleSource: DATASET_METADATA.version,
  };
}

export const TRAINS: Train[] = [
  // ================= DHAKA <-> CHATTOGRAM =================
  buildTrain({
    trainNumber: '702',
    trainName: 'Subarna Express',
    trainNameBn: 'সুবর্ণ এক্সপ্রেস',
    originStationCode: 'DA',
    destinationStationCode: 'CTG',
    offDays: ['Monday'],
    routeType: 'Meter Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR'],
    halts: [
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '--', departureTime: '16:30', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 1' },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '16:53', departureTime: '16:58', haltDurationMinutes: 5, distanceKm: 21, platform: 'PF 2' },
      { stationCode: 'CTG', stationName: 'Chattogram', stationNameBn: 'চট্টগ্রাম', arrivalTime: '21:50', departureTime: '--', haltDurationMinutes: 0, distanceKm: 321, platform: 'PF 1' },
    ],
  }),
  buildTrain({
    trainNumber: '701',
    trainName: 'Subarna Express',
    trainNameBn: 'সুবর্ণ এক্সপ্রেস',
    originStationCode: 'CTG',
    destinationStationCode: 'DA',
    offDays: ['Monday'],
    routeType: 'Meter Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR'],
    halts: [
      { stationCode: 'CTG', stationName: 'Chattogram', stationNameBn: 'চট্টগ্রাম', arrivalTime: '--', departureTime: '07:00', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 1' },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '11:50', departureTime: '11:55', haltDurationMinutes: 5, distanceKm: 300, platform: 'PF 1' },
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '12:20', departureTime: '--', haltDurationMinutes: 0, distanceKm: 321, platform: 'PF 2' },
    ],
  }),
  buildTrain({
    trainNumber: '788',
    trainName: 'Sonar Bangla Express',
    trainNameBn: 'সোনার বাংলা এক্সপ্রেস',
    originStationCode: 'DA',
    destinationStationCode: 'CTG',
    offDays: ['Wednesday'],
    routeType: 'Meter Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'AC_B'],
    halts: [
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '--', departureTime: '07:00', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 3' },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '07:23', departureTime: '07:28', haltDurationMinutes: 5, distanceKm: 21, platform: 'PF 2' },
      { stationCode: 'CTG', stationName: 'Chattogram', stationNameBn: 'চট্টগ্রাম', arrivalTime: '11:55', departureTime: '--', haltDurationMinutes: 0, distanceKm: 321, platform: 'PF 2' },
    ],
  }),
  buildTrain({
    trainNumber: '787',
    trainName: 'Sonar Bangla Express',
    trainNameBn: 'সোনার বাংলা এক্সপ্রেস',
    originStationCode: 'CTG',
    destinationStationCode: 'DA',
    offDays: ['Tuesday'],
    routeType: 'Meter Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'AC_B'],
    halts: [
      { stationCode: 'CTG', stationName: 'Chattogram', stationNameBn: 'চট্টগ্রাম', arrivalTime: '--', departureTime: '17:00', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 2' },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '21:25', departureTime: '21:30', haltDurationMinutes: 5, distanceKm: 300, platform: 'PF 1' },
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '21:55', departureTime: '--', haltDurationMinutes: 0, distanceKm: 321, platform: 'PF 4' },
    ],
  }),
  buildTrain({
    trainNumber: '704',
    trainName: 'Mohanagar Provati',
    trainNameBn: 'মহানগর প্রভাতী',
    originStationCode: 'DA',
    destinationStationCode: 'CTG',
    offDays: [],
    routeType: 'Meter Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN', 'AC_B'],
    halts: [
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '--', departureTime: '07:45', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 2' },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '08:12', departureTime: '08:17', haltDurationMinutes: 5, distanceKm: 21, platform: 'PF 2' },
      { stationCode: 'BBA', stationName: 'Brahmanbaria', stationNameBn: 'ব্রাহ্মণবাড়িয়া', arrivalTime: '09:50', departureTime: '09:55', haltDurationMinutes: 5, distanceKm: 110, platform: 'PF 1' },
      { stationCode: 'AKH', stationName: 'Akhaura Junction', stationNameBn: 'আখাউড়া জংশন', arrivalTime: '10:20', departureTime: '10:25', haltDurationMinutes: 5, distanceKm: 135, platform: 'PF 2' },
      { stationCode: 'COM', stationName: 'Cumilla', stationNameBn: 'কুমিল্লা', arrivalTime: '11:15', departureTime: '11:20', haltDurationMinutes: 5, distanceKm: 180, platform: 'PF 1' },
      { stationCode: 'FENI', stationName: 'Feni Junction', stationNameBn: 'ফেনী জংশন', arrivalTime: '12:05', departureTime: '12:10', haltDurationMinutes: 5, distanceKm: 232, platform: 'PF 2' },
      { stationCode: 'CTG', stationName: 'Chattogram', stationNameBn: 'চট্টগ্রাম', arrivalTime: '14:00', departureTime: '--', haltDurationMinutes: 0, distanceKm: 321, platform: 'PF 3' },
    ],
  }),
  buildTrain({
    trainNumber: '703',
    trainName: 'Mohanagar Godhuli',
    trainNameBn: 'মহানগর গোধূলী',
    originStationCode: 'CTG',
    destinationStationCode: 'DA',
    offDays: [],
    routeType: 'Meter Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN', 'AC_B'],
    halts: [
      { stationCode: 'CTG', stationName: 'Chattogram', stationNameBn: 'চট্টগ্রাম', arrivalTime: '--', departureTime: '15:00', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 3' },
      { stationCode: 'FENI', stationName: 'Feni Junction', stationNameBn: 'ফেনী জংশন', arrivalTime: '16:28', departureTime: '16:33', haltDurationMinutes: 5, distanceKm: 89, platform: 'PF 1' },
      { stationCode: 'COM', stationName: 'Cumilla', stationNameBn: 'কুমিল্লা', arrivalTime: '17:18', departureTime: '17:23', haltDurationMinutes: 5, distanceKm: 141, platform: 'PF 2' },
      { stationCode: 'AKH', stationName: 'Akhaura Junction', stationNameBn: 'আখাউড়া জংশন', arrivalTime: '18:13', departureTime: '18:18', haltDurationMinutes: 5, distanceKm: 186, platform: 'PF 1' },
      { stationCode: 'BBA', stationName: 'Brahmanbaria', stationNameBn: 'ব্রাহ্মণবাড়িয়া', arrivalTime: '18:43', departureTime: '18:48', haltDurationMinutes: 5, distanceKm: 211, platform: 'PF 2' },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '20:55', departureTime: '21:00', haltDurationMinutes: 5, distanceKm: 300, platform: 'PF 1' },
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '21:25', departureTime: '--', haltDurationMinutes: 0, distanceKm: 321, platform: 'PF 3' },
    ],
  }),

  // ================= DHAKA <-> RAJSHAHI =================
  buildTrain({
    trainNumber: '753',
    trainName: 'Silk City Express',
    trainNameBn: 'সিল্ক সিটি এক্সপ্রেস',
    originStationCode: 'DA',
    destinationStationCode: 'RJ',
    offDays: ['Sunday'],
    routeType: 'Broad Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN', 'AC_S'],
    halts: [
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '--', departureTime: '14:30', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 5' },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '14:55', departureTime: '15:00', haltDurationMinutes: 5, distanceKm: 21, platform: 'PF 1' },
      { stationCode: 'JYP', stationName: 'Joydebpur', stationNameBn: 'জয়দেবপুর', arrivalTime: '15:26', departureTime: '15:30', haltDurationMinutes: 4, distanceKm: 40, platform: 'PF 2' },
      { stationCode: 'ISD_BYP', stationName: 'Ishwardi Bypass', stationNameBn: 'ঈশ্বরদী বাইপাস', arrivalTime: '18:35', departureTime: '18:40', haltDurationMinutes: 5, distanceKm: 245, platform: 'PF 1' },
      { stationCode: 'NAT', stationName: 'Natore', stationNameBn: 'নাটোর', arrivalTime: '19:20', departureTime: '19:25', haltDurationMinutes: 5, distanceKm: 295, platform: 'PF 1' },
      { stationCode: 'RJ', stationName: 'Rajshahi', stationNameBn: 'রাজশাহী', arrivalTime: '20:20', departureTime: '--', haltDurationMinutes: 0, distanceKm: 343, platform: 'PF 2' },
    ],
  }),
  buildTrain({
    trainNumber: '754',
    trainName: 'Silk City Express',
    trainNameBn: 'সিল্ক সিটি এক্সপ্রেস',
    originStationCode: 'RJ',
    destinationStationCode: 'DA',
    offDays: ['Sunday'],
    routeType: 'Broad Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN', 'AC_S'],
    halts: [
      { stationCode: 'RJ', stationName: 'Rajshahi', stationNameBn: 'রাজশাহী', arrivalTime: '--', departureTime: '07:30', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 1' },
      { stationCode: 'NAT', stationName: 'Natore', stationNameBn: 'নাটোর', arrivalTime: '08:15', departureTime: '08:20', haltDurationMinutes: 5, distanceKm: 48, platform: 'PF 1' },
      { stationCode: 'ISD_BYP', stationName: 'Ishwardi Bypass', stationNameBn: 'ঈশ্বরদী বাইপাস', arrivalTime: '09:05', departureTime: '09:10', haltDurationMinutes: 5, distanceKm: 98, platform: 'PF 1' },
      { stationCode: 'JYP', stationName: 'Joydebpur', stationNameBn: 'জয়দেবপুর', arrivalTime: '12:15', departureTime: '12:20', haltDurationMinutes: 5, distanceKm: 303, platform: 'PF 3' },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '12:40', departureTime: '12:45', haltDurationMinutes: 5, distanceKm: 322, platform: 'PF 1' },
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '13:10', departureTime: '--', haltDurationMinutes: 0, distanceKm: 343, platform: 'PF 6' },
    ],
  }),
  buildTrain({
    trainNumber: '759',
    trainName: 'Padma Express',
    trainNameBn: 'পদ্মা এক্সপ্রেস',
    originStationCode: 'DA',
    destinationStationCode: 'RJ',
    offDays: ['Tuesday'],
    routeType: 'Broad Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN', 'AC_B'],
    halts: [
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '--', departureTime: '22:45', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 4', dayOffset: 0 },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '23:10', departureTime: '23:15', haltDurationMinutes: 5, distanceKm: 21, platform: 'PF 2', dayOffset: 0 },
      { stationCode: 'ISD_BYP', stationName: 'Ishwardi Bypass', stationNameBn: 'ঈশ্বরদী বাইপাস', arrivalTime: '02:25', departureTime: '02:30', haltDurationMinutes: 5, distanceKm: 245, platform: 'PF 1', dayOffset: 1 },
      { stationCode: 'NAT', stationName: 'Natore', stationNameBn: 'নাটোর', arrivalTime: '03:10', departureTime: '03:15', haltDurationMinutes: 5, distanceKm: 295, platform: 'PF 1', dayOffset: 1 },
      { stationCode: 'RJ', stationName: 'Rajshahi', stationNameBn: 'রাজশাহী', arrivalTime: '04:00', departureTime: '--', haltDurationMinutes: 0, distanceKm: 343, platform: 'PF 1', dayOffset: 1 },
    ],
  }),
  buildTrain({
    trainNumber: '760',
    trainName: 'Padma Express',
    trainNameBn: 'পদ্মা এক্সপ্রেস',
    originStationCode: 'RJ',
    destinationStationCode: 'DA',
    offDays: ['Tuesday'],
    routeType: 'Broad Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN', 'AC_B'],
    halts: [
      { stationCode: 'RJ', stationName: 'Rajshahi', stationNameBn: 'রাজশাহী', arrivalTime: '--', departureTime: '16:00', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 2' },
      { stationCode: 'NAT', stationName: 'Natore', stationNameBn: 'নাটোর', arrivalTime: '16:45', departureTime: '16:50', haltDurationMinutes: 5, distanceKm: 48, platform: 'PF 1' },
      { stationCode: 'ISD_BYP', stationName: 'Ishwardi Bypass', stationNameBn: 'ঈশ্বরদী বাইপাস', arrivalTime: '17:35', departureTime: '17:40', haltDurationMinutes: 5, distanceKm: 98, platform: 'PF 1' },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '21:15', departureTime: '21:20', haltDurationMinutes: 5, distanceKm: 322, platform: 'PF 1' },
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '21:45', departureTime: '--', haltDurationMinutes: 0, distanceKm: 343, platform: 'PF 5' },
    ],
  }),
  buildTrain({
    trainNumber: '769',
    trainName: 'Dhumketu Express',
    trainNameBn: 'ধূমকেতু এক্সপ্রেস',
    originStationCode: 'DA',
    destinationStationCode: 'RJ',
    offDays: ['Thursday'],
    routeType: 'Broad Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN', 'AC_S'],
    halts: [
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '--', departureTime: '06:00', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 7' },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '06:25', departureTime: '06:30', haltDurationMinutes: 5, distanceKm: 21, platform: 'PF 1' },
      { stationCode: 'JYP', stationName: 'Joydebpur', stationNameBn: 'জয়দেবপুর', arrivalTime: '06:55', departureTime: '07:00', haltDurationMinutes: 5, distanceKm: 40, platform: 'PF 2' },
      { stationCode: 'NAT', stationName: 'Natore', stationNameBn: 'নাটোর', arrivalTime: '10:45', departureTime: '10:50', haltDurationMinutes: 5, distanceKm: 295, platform: 'PF 1' },
      { stationCode: 'RJ', stationName: 'Rajshahi', stationNameBn: 'রাজশাহী', arrivalTime: '11:40', departureTime: '--', haltDurationMinutes: 0, distanceKm: 343, platform: 'PF 3' },
    ],
  }),
  buildTrain({
    trainNumber: '770',
    trainName: 'Dhumketu Express',
    trainNameBn: 'ধূমকেতু এক্সপ্রেস',
    originStationCode: 'RJ',
    destinationStationCode: 'DA',
    offDays: ['Friday'],
    routeType: 'Broad Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN', 'AC_S'],
    halts: [
      { stationCode: 'RJ', stationName: 'Rajshahi', stationNameBn: 'রাজশাহী', arrivalTime: '--', departureTime: '23:20', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 2', dayOffset: 0 },
      { stationCode: 'NAT', stationName: 'Natore', stationNameBn: 'নাটোর', arrivalTime: '00:05', departureTime: '00:10', haltDurationMinutes: 5, distanceKm: 48, platform: 'PF 1', dayOffset: 1 },
      { stationCode: 'JYP', stationName: 'Joydebpur', stationNameBn: 'জয়দেবপুর', arrivalTime: '03:50', departureTime: '03:55', haltDurationMinutes: 5, distanceKm: 303, platform: 'PF 2', dayOffset: 1 },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '04:15', departureTime: '04:20', haltDurationMinutes: 5, distanceKm: 322, platform: 'PF 1', dayOffset: 1 },
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '04:45', departureTime: '--', haltDurationMinutes: 0, distanceKm: 343, platform: 'PF 4', dayOffset: 1 },
    ],
  }),

  // ================= DHAKA <-> SYLHET =================
  buildTrain({
    trainNumber: '709',
    trainName: 'Parabat Express',
    trainNameBn: 'পারাবত এক্সপ্রেস',
    originStationCode: 'DA',
    destinationStationCode: 'SYL',
    offDays: ['Tuesday'],
    routeType: 'Meter Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN', 'AC_B'],
    halts: [
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '--', departureTime: '06:30', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 8' },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '06:55', departureTime: '07:00', haltDurationMinutes: 5, distanceKm: 21, platform: 'PF 2' },
      { stationCode: 'BBA', stationName: 'Brahmanbaria', stationNameBn: 'ব্রাহ্মণবাড়িয়া', arrivalTime: '08:45', departureTime: '08:50', haltDurationMinutes: 5, distanceKm: 110, platform: 'PF 1' },
      { stationCode: 'SRM', stationName: 'Sreemangal', stationNameBn: 'শ্রীমঙ্গল', arrivalTime: '11:00', departureTime: '11:06', haltDurationMinutes: 6, distanceKm: 235, platform: 'PF 1' },
      { stationCode: 'KUL', stationName: 'Kulaura Junction', stationNameBn: 'কুলাউড়া জংশন', arrivalTime: '11:55', departureTime: '12:00', haltDurationMinutes: 5, distanceKm: 268, platform: 'PF 2' },
      { stationCode: 'SYL', stationName: 'Sylhet', stationNameBn: 'সিলেট', arrivalTime: '13:00', departureTime: '--', haltDurationMinutes: 0, distanceKm: 319, platform: 'PF 1' },
    ],
  }),
  buildTrain({
    trainNumber: '710',
    trainName: 'Parabat Express',
    trainNameBn: 'পারাবত এক্সপ্রেস',
    originStationCode: 'SYL',
    destinationStationCode: 'DA',
    offDays: ['Tuesday'],
    routeType: 'Meter Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN', 'AC_B'],
    halts: [
      { stationCode: 'SYL', stationName: 'Sylhet', stationNameBn: 'সিলেট', arrivalTime: '--', departureTime: '15:45', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 1' },
      { stationCode: 'KUL', stationName: 'Kulaura Junction', stationNameBn: 'কুলাউড়া জংশন', arrivalTime: '16:40', departureTime: '16:45', haltDurationMinutes: 5, distanceKm: 51, platform: 'PF 2' },
      { stationCode: 'SRM', stationName: 'Sreemangal', stationNameBn: 'শ্রীমঙ্গল', arrivalTime: '17:35', departureTime: '17:41', haltDurationMinutes: 6, distanceKm: 84, platform: 'PF 1' },
      { stationCode: 'BBA', stationName: 'Brahmanbaria', stationNameBn: 'ব্রাহ্মণবাড়িয়া', arrivalTime: '19:50', departureTime: '19:55', haltDurationMinutes: 5, distanceKm: 209, platform: 'PF 1' },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '21:45', departureTime: '21:50', haltDurationMinutes: 5, distanceKm: 298, platform: 'PF 1' },
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '22:15', departureTime: '--', haltDurationMinutes: 0, distanceKm: 319, platform: 'PF 6' },
    ],
  }),
  buildTrain({
    trainNumber: '773',
    trainName: 'Kalni Express',
    trainNameBn: 'কালনী এক্সপ্রেস',
    originStationCode: 'DA',
    destinationStationCode: 'SYL',
    offDays: ['Friday'],
    routeType: 'Meter Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN'],
    halts: [
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '--', departureTime: '14:55', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 2' },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '15:20', departureTime: '15:25', haltDurationMinutes: 5, distanceKm: 21, platform: 'PF 1' },
      { stationCode: 'SRM', stationName: 'Sreemangal', stationNameBn: 'শ্রীমঙ্গল', arrivalTime: '19:25', departureTime: '19:30', haltDurationMinutes: 5, distanceKm: 235, platform: 'PF 2' },
      { stationCode: 'SYL', stationName: 'Sylhet', stationNameBn: 'সিলেট', arrivalTime: '21:30', departureTime: '--', haltDurationMinutes: 0, distanceKm: 319, platform: 'PF 2' },
    ],
  }),
  buildTrain({
    trainNumber: '774',
    trainName: 'Kalni Express',
    trainNameBn: 'কালনী এক্সপ্রেস',
    originStationCode: 'SYL',
    destinationStationCode: 'DA',
    offDays: ['Friday'],
    routeType: 'Meter Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN'],
    halts: [
      { stationCode: 'SYL', stationName: 'Sylhet', stationNameBn: 'সিলেট', arrivalTime: '--', departureTime: '06:15', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 2' },
      { stationCode: 'SRM', stationName: 'Sreemangal', stationNameBn: 'শ্রীমঙ্গল', arrivalTime: '08:10', departureTime: '08:15', haltDurationMinutes: 5, distanceKm: 84, platform: 'PF 1' },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '12:25', departureTime: '12:30', haltDurationMinutes: 5, distanceKm: 298, platform: 'PF 1' },
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '12:55', departureTime: '--', haltDurationMinutes: 0, distanceKm: 319, platform: 'PF 4' },
    ],
  }),

  // ================= DHAKA <-> KHULNA / BENAPOLE (PADMA BRIDGE) =================
  buildTrain({
    trainNumber: '726',
    trainName: 'Sundarban Express',
    trainNameBn: 'সুন্দরবন এক্সপ্রেস',
    originStationCode: 'DA',
    destinationStationCode: 'KLN',
    offDays: ['Wednesday'],
    routeType: 'Broad Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN', 'AC_B'],
    halts: [
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '--', departureTime: '08:00', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 7' },
      { stationCode: 'BHN', stationName: 'Bhanga Junction', stationNameBn: 'ভাঙ্গা জংশন', arrivalTime: '09:20', departureTime: '09:25', haltDurationMinutes: 5, distanceKm: 82, platform: 'PF 2' },
      { stationCode: 'JSR', stationName: 'Jashore', stationNameBn: 'যশোর', arrivalTime: '14:25', departureTime: '14:30', haltDurationMinutes: 5, distanceKm: 205, platform: 'PF 1' },
      { stationCode: 'KLN', stationName: 'Khulna', stationNameBn: 'খুলনা', arrivalTime: '15:40', departureTime: '--', haltDurationMinutes: 0, distanceKm: 260, platform: 'PF 1' },
    ],
  }),
  buildTrain({
    trainNumber: '725',
    trainName: 'Sundarban Express',
    trainNameBn: 'সুন্দরবন এক্সপ্রেস',
    originStationCode: 'KLN',
    destinationStationCode: 'DA',
    offDays: ['Wednesday'],
    routeType: 'Broad Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN', 'AC_B'],
    halts: [
      { stationCode: 'KLN', stationName: 'Khulna', stationNameBn: 'খুলনা', arrivalTime: '--', departureTime: '21:45', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 1', dayOffset: 0 },
      { stationCode: 'JSR', stationName: 'Jashore', stationNameBn: 'যশোর', arrivalTime: '22:55', departureTime: '23:00', haltDurationMinutes: 5, distanceKm: 55, platform: 'PF 2', dayOffset: 0 },
      { stationCode: 'BHN', stationName: 'Bhanga Junction', stationNameBn: 'ভাঙ্গা জংশন', arrivalTime: '05:25', departureTime: '05:30', haltDurationMinutes: 5, distanceKm: 178, platform: 'PF 1', dayOffset: 1 },
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '07:00', departureTime: '--', haltDurationMinutes: 0, distanceKm: 260, platform: 'PF 7', dayOffset: 1 },
    ],
  }),
  buildTrain({
    trainNumber: '796',
    trainName: 'Benapole Express',
    trainNameBn: 'বেনাপোল এক্সপ্রেস',
    originStationCode: 'DA',
    destinationStationCode: 'BNP',
    offDays: ['Wednesday'],
    routeType: 'Broad Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN', 'AC_B'],
    halts: [
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '--', departureTime: '23:45', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 4', dayOffset: 0 },
      { stationCode: 'BHN', stationName: 'Bhanga Junction', stationNameBn: 'ভাঙ্গা জংশন', arrivalTime: '01:05', departureTime: '01:10', haltDurationMinutes: 5, distanceKm: 82, platform: 'PF 1', dayOffset: 1 },
      { stationCode: 'JSR', stationName: 'Jashore', stationNameBn: 'যশোর', arrivalTime: '05:45', departureTime: '05:50', haltDurationMinutes: 5, distanceKm: 250, platform: 'PF 2', dayOffset: 1 },
      { stationCode: 'BNP', stationName: 'Benapole', stationNameBn: 'বেনাপোল', arrivalTime: '07:00', departureTime: '--', haltDurationMinutes: 0, distanceKm: 295, platform: 'PF 1', dayOffset: 1 },
    ],
  }),
  buildTrain({
    trainNumber: '795',
    trainName: 'Benapole Express',
    trainNameBn: 'বেনাপোল এক্সপ্রেস',
    originStationCode: 'BNP',
    destinationStationCode: 'DA',
    offDays: ['Wednesday'],
    routeType: 'Broad Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN', 'AC_B'],
    halts: [
      { stationCode: 'BNP', stationName: 'Benapole', stationNameBn: 'বেনাপোল', arrivalTime: '--', departureTime: '13:00', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 1' },
      { stationCode: 'JSR', stationName: 'Jashore', stationNameBn: 'যশোর', arrivalTime: '14:05', departureTime: '14:10', haltDurationMinutes: 5, distanceKm: 45, platform: 'PF 1' },
      { stationCode: 'BHN', stationName: 'Bhanga Junction', stationNameBn: 'ভাঙ্গা জংশন', arrivalTime: '19:20', departureTime: '19:25', haltDurationMinutes: 5, distanceKm: 213, platform: 'PF 2' },
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '20:45', departureTime: '--', haltDurationMinutes: 0, distanceKm: 295, platform: 'PF 5' },
    ],
  }),

  // ================= DHAKA <-> RANGPUR =================
  buildTrain({
    trainNumber: '771',
    trainName: 'Rangpur Express',
    trainNameBn: 'রংপুর এক্সপ্রেস',
    originStationCode: 'DA',
    destinationStationCode: 'RNG',
    offDays: ['Monday'],
    routeType: 'Broad Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN', 'AC_B'],
    halts: [
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '--', departureTime: '09:10', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 6' },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '09:35', departureTime: '09:40', haltDurationMinutes: 5, distanceKm: 21, platform: 'PF 1' },
      { stationCode: 'BOG', stationName: 'Bogura', stationNameBn: 'বগুড়া', arrivalTime: '15:55', departureTime: '16:00', haltDurationMinutes: 5, distanceKm: 310, platform: 'PF 1' },
      { stationCode: 'RNG', stationName: 'Rangpur', stationNameBn: 'রংপুর', arrivalTime: '19:00', departureTime: '--', haltDurationMinutes: 0, distanceKm: 420, platform: 'PF 2' },
    ],
  }),
  buildTrain({
    trainNumber: '772',
    trainName: 'Rangpur Express',
    trainNameBn: 'রংপুর এক্সপ্রেস',
    originStationCode: 'RNG',
    destinationStationCode: 'DA',
    offDays: ['Sunday'],
    routeType: 'Broad Gauge',
    availableClasses: ['SNIGDHA', 'S_CHAIR', 'SHOVAN', 'AC_B'],
    halts: [
      { stationCode: 'RNG', stationName: 'Rangpur', stationNameBn: 'রংপুর', arrivalTime: '--', departureTime: '20:00', haltDurationMinutes: 0, distanceKm: 0, platform: 'PF 1', dayOffset: 0 },
      { stationCode: 'BOG', stationName: 'Bogura', stationNameBn: 'বগুড়া', arrivalTime: '23:00', departureTime: '23:05', haltDurationMinutes: 5, distanceKm: 110, platform: 'PF 1', dayOffset: 0 },
      { stationCode: 'DA_AIR', stationName: 'Dhaka Biman Bandar', stationNameBn: 'ঢাকা বিমানবন্দর', arrivalTime: '05:25', departureTime: '05:30', haltDurationMinutes: 5, distanceKm: 399, platform: 'PF 2', dayOffset: 1 },
      { stationCode: 'DA', stationName: 'Dhaka (Kamalapur)', stationNameBn: 'ঢাকা (কমলাপুর)', arrivalTime: '06:00', departureTime: '--', haltDurationMinutes: 0, distanceKm: 420, platform: 'PF 5', dayOffset: 1 },
    ],
  }),
];

/**
 * Deterministic calendar weekday lookup (immune to UTC midnight shifts).
 */
export function getWeekdayName(isoDate: string): WeekdayName {
  const parts = isoDate.split('-').map(Number);
  if (parts.length !== 3 || parts.some(Number.isNaN)) {
    return WEEKDAYS[new Date().getDay()];
  }
  const [y, m, d] = parts;
  return WEEKDAYS[new Date(y, m - 1, d).getDay()];
}

export function isTrainOperatingOnDate(train: Train, isoDate: string): boolean {
  if (train.offDays.length === 0) return true;
  const weekday = getWeekdayName(isoDate);
  return !train.offDays.includes(weekday);
}

/**
 * Returns current Bangladesh Standard Time (Asia/Dhaka, UTC+6) date & minute-of-day.
 */
export function getBangladeshTimeNow(): {
  isoDate: string;
  hhmm: string;
  minutesSinceMidnight: number;
  weekday: WeekdayName;
} {
  const now = new Date();
  const fmt = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Dhaka',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  });
  const parts = fmt.formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? '00';
  const y = get('year');
  const m = get('month');
  const d = get('day');
  const h = Number(get('hour')) % 24;
  const min = Number(get('minute'));
  const isoDate = `${y}-${m}-${d}`;
  return {
    isoDate,
    hhmm: `${String(h).padStart(2, '0')}:${String(min).padStart(2, '0')}`,
    minutesSinceMidnight: h * 60 + min,
    weekday: getWeekdayName(isoDate),
  };
}

/**
 * Single deterministic source of truth for origin->destination segment metrics.
 * Shared across ScheduleTable, TrainTimeline, FareCalculator, and JourneyCard.
 */
export function computeRouteSegment(
  train: Train,
  fromStationCode?: string,
  toStationCode?: string
): RouteSegment {
  const rawFrom = fromStationCode
    ? train.halts.findIndex((h) => h.stationCode === fromStationCode)
    : 0;
  const rawTo = toStationCode
    ? train.halts.findIndex((h) => h.stationCode === toStationCode)
    : train.halts.length - 1;

  const isValidSegment = rawFrom !== -1 && rawTo !== -1 && rawFrom < rawTo;
  const fromIndex = isValidSegment ? rawFrom : 0;
  const toIndex = isValidSegment ? rawTo : train.halts.length - 1;

  const originHalt = train.halts[fromIndex];
  const destinationHalt = train.halts[toIndex];
  const departureTime =
    originHalt.departureTime !== '--' ? originHalt.departureTime : train.departureTime;
  const arrivalTime =
    destinationHalt.arrivalTime !== '--' ? destinationHalt.arrivalTime : train.arrivalTime;

  const startElapsed = computeElapsedMinutes(
    train.departureTime,
    departureTime,
    originHalt.dayOffset ?? 0
  );
  const endElapsed = computeElapsedMinutes(
    train.departureTime,
    arrivalTime,
    destinationHalt.dayOffset ?? 0
  );

  const durationMinutes = Math.max(1, endElapsed - startElapsed);
  const distanceKm = Math.max(1, destinationHalt.distanceKm - originHalt.distanceKm);
  const halts = train.halts.slice(fromIndex, toIndex + 1);

  return {
    train,
    fromIndex,
    toIndex,
    originHalt,
    destinationHalt,
    departureTime,
    arrivalTime,
    durationMinutes,
    distanceKm,
    stopCount: halts.length,
    intermediateStops: Math.max(0, halts.length - 2),
    halts,
    isPartialSegment: fromIndex > 0 || toIndex < train.halts.length - 1,
  };
}

/**
 * Deterministic Bangladesh Railway fare calculation engine.
 * Formula: Base (rounded to nearest ৳5) + 15% AC VAT + ৳50 berth bedding (AC_B / F_BERTH) + ৳20 online fee.
 */
export function calculateFareBreakdown(
  distanceKm: number,
  seatClasses: SeatClass[],
  channel: BookingChannel = 'ONLINE',
  passengers = 1
): FareBreakdown[] {
  const safePassengers = Math.min(4, Math.max(1, Math.round(passengers)));
  const safeDistance = Math.max(1, distanceKm);

  return seatClasses.map((sc) => {
    const meta = SEAT_CLASS_META[sc];
    const rawBase = Math.round((safeDistance * meta.ratePerKm) / 5) * 5;
    const baseFarePerSeat = Math.max(meta.minBaseFare, rawBase);
    const vatRate = meta.isAc ? AC_VAT_RATE : 0;
    const vatAmountPerSeat = meta.isAc ? Math.round(baseFarePerSeat * AC_VAT_RATE) : 0;
    const beddingChargePerSeat = meta.beddingCharge;
    const serviceChargePerSeat = channel === 'ONLINE' ? ONLINE_SERVICE_FEE_BDT : 0;
    const totalPerSeat =
      baseFarePerSeat + vatAmountPerSeat + beddingChargePerSeat + serviceChargePerSeat;

    return {
      seatClass: sc,
      className: meta.name,
      classNameBn: meta.nameBn,
      isAc: meta.isAc,
      baseFarePerSeat,
      vatRate,
      vatAmountPerSeat,
      beddingChargePerSeat,
      serviceChargePerSeat,
      totalPerSeat,
      passengers: safePassengers,
      grandTotal: totalPerSeat * safePassengers,
    };
  });
}

/**
 * Deterministic schedule-based run progress calculator using Bangladesh Standard Time (UTC+6)
 * or an optional user-selected simulation minute offset from train departure.
 */
export function estimateTrainProgress(
  train: Train,
  travelDate: string,
  simulatedOffsetMinutes: number | null = null
): TrainProgressEstimate {
  const bstNow = getBangladeshTimeNow();
  const isSimulated = simulatedOffsetMinutes !== null;
  const haltStates: Record<string, ComputedHaltState> = {};

  // Check Off-Day first (unless user is explicitly previewing with simulator)
  if (!isSimulated && !isTrainOperatingOnDate(train, travelDate)) {
    const weekday = getWeekdayName(travelDate);
    for (const h of train.halts) {
      haltStates[h.stationCode] = 'upcoming';
    }
    return {
      phase: 'OFF_DAY',
      progressPercent: 0,
      currentStationCode: null,
      nextStationCode: null,
      statusHeadline: `OFF-DAY (${weekday.toUpperCase()})`,
      statusDetail: `Train #${train.trainNumber} does not operate on ${weekday}s according to the weekly maintenance roster.`,
      haltStates,
      referenceTimeLabel: `${bstNow.hhmm} BST`,
      isSimulated: false,
    };
  }

  // If travelDate is in the future (and not simulating), mark as Scheduled Future
  if (!isSimulated && travelDate > bstNow.isoDate) {
    for (const h of train.halts) {
      haltStates[h.stationCode] = 'upcoming';
    }
    return {
      phase: 'SCHEDULED_FUTURE',
      progressPercent: 0,
      currentStationCode: null,
      nextStationCode: train.halts[0].stationCode,
      statusHeadline: `SCHEDULED (${travelDate})`,
      statusDetail: `Scheduled departure from ${train.halts[0].stationName} at ${train.departureTime} BST.`,
      haltStates,
      referenceTimeLabel: `${bstNow.hhmm} BST`,
      isSimulated: false,
    };
  }

  // Compute elapsed minutes from train origin departure
  const depMin = parseTimeToMinutes(train.departureTime);
  let elapsedFromDep: number;

  if (isSimulated) {
    elapsedFromDep = simulatedOffsetMinutes;
  } else if (travelDate < bstNow.isoDate) {
    // Past travel date: check if an overnight run from yesterday is still completing early this morning
    elapsedFromDep = 1440 - depMin + bstNow.minutesSinceMidnight;
  } else {
    elapsedFromDep = bstNow.minutesSinceMidnight - depMin;
  }

  const refClockMinutes = depMin + elapsedFromDep;
  const referenceTimeLabel = isSimulated
    ? `Simulated ${formatMinutesToHHMM(refClockMinutes)} BST`
    : `${bstNow.hhmm} BST`;

  // Pre-departure
  if (elapsedFromDep < 0) {
    const minsUntil = Math.abs(elapsedFromDep);
    train.halts.forEach((h, i) => {
      haltStates[h.stationCode] = i === 0 ? 'next' : 'upcoming';
    });
    return {
      phase: 'PRE_DEPARTURE',
      progressPercent: 0,
      currentStationCode: null,
      nextStationCode: train.halts[0].stationCode,
      statusHeadline: `DEPARTS IN ${formatDuration(minsUntil).toUpperCase()}`,
      statusDetail: `Scheduled to depart ${train.halts[0].stationName} at ${train.departureTime} BST.`,
      haltStates,
      referenceTimeLabel,
      isSimulated,
    };
  }

  // Completed run
  if (elapsedFromDep >= train.durationMinutes) {
    for (const h of train.halts) {
      haltStates[h.stationCode] = 'passed';
    }
    const last = train.halts[train.halts.length - 1];
    return {
      phase: 'COMPLETED',
      progressPercent: 100,
      currentStationCode: last.stationCode,
      nextStationCode: null,
      statusHeadline: 'SCHEDULED RUN COMPLETED',
      statusDetail: `Scheduled arrival at ${last.stationName} was ${train.arrivalTime} BST.`,
      haltStates,
      referenceTimeLabel,
      isSimulated,
    };
  }

  // Active run: find exact halt or transit segment
  const progressPercent = Math.min(
    99,
    Math.max(1, Math.round((elapsedFromDep / train.durationMinutes) * 100))
  );

  const haltTimings = train.halts.map((h: StationHalt, idx: number) => {
    const arrElapsed =
      idx === 0
        ? 0
        : computeElapsedMinutes(train.departureTime, h.arrivalTime, h.dayOffset ?? 0);
    const depElapsed =
      idx === train.halts.length - 1
        ? train.durationMinutes
        : computeElapsedMinutes(train.departureTime, h.departureTime, h.dayOffset ?? 0);
    return { halt: h, arrElapsed, depElapsed };
  });

  let atStationIdx = -1;
  let nextStationIdx = -1;

  for (let i = 0; i < haltTimings.length; i++) {
    const t = haltTimings[i];
    if (elapsedFromDep >= t.arrElapsed && elapsedFromDep <= t.depElapsed) {
      atStationIdx = i;
      nextStationIdx = Math.min(i + 1, haltTimings.length - 1);
      break;
    }
    if (elapsedFromDep < t.arrElapsed) {
      nextStationIdx = i;
      break;
    }
  }

  if (atStationIdx !== -1) {
    haltTimings.forEach((t, idx) => {
      if (idx < atStationIdx) haltStates[t.halt.stationCode] = 'passed';
      else if (idx === atStationIdx) haltStates[t.halt.stationCode] = 'at_station';
      else if (idx === atStationIdx + 1) haltStates[t.halt.stationCode] = 'next';
      else haltStates[t.halt.stationCode] = 'upcoming';
    });
    const current = haltTimings[atStationIdx].halt;
    const next = haltTimings[nextStationIdx]?.halt;
    return {
      phase: 'AT_STATION',
      progressPercent,
      currentStationCode: current.stationCode,
      nextStationCode: next ? next.stationCode : null,
      statusHeadline: `SCHEDULED HALT: ${current.stationCode}`,
      statusDetail: `Estimated at ${current.stationName} (${current.platform}) until ${current.departureTime} BST.`,
      haltStates,
      referenceTimeLabel,
      isSimulated,
    };
  }

  // In transit between (nextStationIdx - 1) and nextStationIdx
  const prevIdx = Math.max(0, nextStationIdx - 1);
  haltTimings.forEach((t, idx) => {
    if (idx <= prevIdx) haltStates[t.halt.stationCode] = 'passed';
    else if (idx === nextStationIdx) haltStates[t.halt.stationCode] = 'next';
    else haltStates[t.halt.stationCode] = 'upcoming';
  });

  const prevHalt = haltTimings[prevIdx].halt;
  const nextHalt = haltTimings[nextStationIdx].halt;
  const minsToNext = Math.max(1, haltTimings[nextStationIdx].arrElapsed - elapsedFromDep);

  return {
    phase: 'IN_TRANSIT',
    progressPercent,
    currentStationCode: prevHalt.stationCode,
    nextStationCode: nextHalt.stationCode,
    statusHeadline: `EN ROUTE TO ${nextHalt.stationCode}`,
    statusDetail: `Departed ${prevHalt.stationName}; estimated arrival at ${nextHalt.stationName} in ${formatDuration(minsToNext)} (${nextHalt.arrivalTime} BST).`,
    haltStates,
    referenceTimeLabel,
    isSimulated,
  };
}

export const RAILWAY_GUIDELINES = {
  helpline: '131',
  customerCare: '16122',
  smsTrackingCode: 'TR <Train_No> to 9999',
  officialPortal: 'https://eticket.railway.gov.bd/',
  luggageRules: [
    { class: 'AC_B / AC_S', limit: '56 kg per passenger', excessRate: 'Standard tariff per 10 kg' },
    { class: 'SNIGDHA / F_BERTH', limit: '37.5 kg per passenger', excessRate: 'Standard tariff per 10 kg' },
    { class: 'S_CHAIR / SHOVAN', limit: '28 kg per passenger', excessRate: 'Standard tariff per 10 kg' },
  ],
  cancellationRules: [
    { timeframe: 'More than 48 hours before departure', deduction: '৳ 40 (Non-AC) / ৳ 50 (AC) or 25% of fare' },
    { timeframe: 'Between 48 hours and 24 hours', deduction: '50% of ticket fare' },
    { timeframe: 'Between 24 hours and 12 hours', deduction: '75% of ticket fare' },
    { timeframe: 'Less than 12 hours before departure', deduction: 'No refund eligible (100% deduction)' },
  ],
};
