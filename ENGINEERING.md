# RailDesk BD — Engineering Standards

- **Strict TypeScript**: Full end-to-end type safety for `Train`, `Station`, `StationHalt`, `RouteSegment`, `SeatClass`, `FareBreakdown`, `BookingChannel`, and `TrainProgressEstimate`. Zero `any`.
- **Single Source of Truth**: Every component (`ScheduleTable`, `TrainTimeline`, `FareCalculator`, `JourneyCard`) consumes `computeRouteSegment()` and `calculateFareBreakdown()` so segment distances, durations, timings, and fares are 100% consistent across all views.
- **Honest Data Provenance**: Static reference roster timetables and BST (`Asia/Dhaka`, UTC+6) schedule-estimated progress are explicitly labeled as reference estimates — never fabricating live GPS delays, latency pings, or synthetic open seat counts.
- **Resilient Rendering**: Root `<ErrorBoundary>` with recovery + cache-clear actions, self-cleaning `sw.js` kill-switch for legacy caches, and asset-safe SPA rewrites in `vercel.json` so deployments never collapse to a blank screen.
- **Viewport Discipline**: 12-column split workstation on desktop (`>= 1024px`, constrained to `max-w-7xl`) and zero-horizontal-overflow (`scrollWidth <= clientWidth`) single-column layout on mobile (`390x844`).
