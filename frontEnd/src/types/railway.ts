export type SeatClass = 'SHOVAN' | 'S_CHAIR' | 'SNIGDHA' | 'F_BERTH' | 'AC_S' | 'AC_B';

export type BookingChannel = 'ONLINE' | 'COUNTER';

export type WeekdayName =
  | 'Sunday'
  | 'Monday'
  | 'Tuesday'
  | 'Wednesday'
  | 'Thursday'
  | 'Friday'
  | 'Saturday';

export interface Station {
  code: string;
  name: string;
  nameBn: string;
  shortName: string;
  shortNameBn: string;
  division: 'DHAKA' | 'CHATTOGRAM' | 'RAJSHAHI' | 'SYLHET' | 'KHULNA' | 'RANGPUR' | 'MYMENSINGH';
  hub: boolean;
  platforms: number;
}

export interface StationHalt {
  stationCode: string;
  stationName: string;
  stationNameBn: string;
  arrivalTime: string; // "HH:MM" or "--" for origin
  departureTime: string; // "HH:MM" or "--" for terminus
  haltDurationMinutes: number; // 0 for origin/terminus
  distanceKm: number;
  platform: string;
  dayOffset?: 0 | 1; // 1 when stop occurs after midnight on overnight trains
}

export interface Train {
  trainNumber: string;
  trainName: string;
  trainNameBn: string;
  originStationCode: string;
  destinationStationCode: string;
  departureTime: string;
  arrivalTime: string;
  overnight: boolean;
  durationMinutes: number;
  offDays: WeekdayName[]; // Empty array means operates daily (7 days/week)
  totalDistanceKm: number;
  routeType: 'Broad Gauge' | 'Meter Gauge' | 'Dual Gauge';
  availableClasses: SeatClass[];
  halts: StationHalt[];
  scheduleSource: string;
}

export interface RouteSegment {
  train: Train;
  fromIndex: number;
  toIndex: number;
  originHalt: StationHalt;
  destinationHalt: StationHalt;
  departureTime: string;
  arrivalTime: string;
  durationMinutes: number;
  distanceKm: number;
  stopCount: number;
  intermediateStops: number;
  halts: StationHalt[];
  isPartialSegment: boolean;
}

export interface FareBreakdown {
  seatClass: SeatClass;
  className: string;
  classNameBn: string;
  isAc: boolean;
  baseFarePerSeat: number;
  vatRate: number; // 0.15 for AC classes, 0 for Non-AC
  vatAmountPerSeat: number;
  beddingChargePerSeat: number; // ৳ 50 for AC_B and F_BERTH
  serviceChargePerSeat: number; // ৳ 20 for ONLINE e-Ticket, ৳ 0 for COUNTER
  totalPerSeat: number;
  passengers: number;
  grandTotal: number;
}

export type EstimatedRunPhase =
  | 'OFF_DAY'
  | 'SCHEDULED_FUTURE'
  | 'PRE_DEPARTURE'
  | 'AT_STATION'
  | 'IN_TRANSIT'
  | 'COMPLETED';

export type ComputedHaltState = 'passed' | 'at_station' | 'next' | 'upcoming';

export interface TrainProgressEstimate {
  phase: EstimatedRunPhase;
  progressPercent: number;
  currentStationCode: string | null;
  nextStationCode: string | null;
  statusHeadline: string;
  statusDetail: string;
  haltStates: Record<string, ComputedHaltState>;
  referenceTimeLabel: string;
  isSimulated: boolean;
}

export interface TransitCorridor {
  id: string;
  label: string;
  labelBn: string;
  originCode: string;
  destinationCode: string;
  distanceKm: number;
  avgDuration: string;
  frequency: string;
}
