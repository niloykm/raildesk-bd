# RailDesk BD (`raildesk-bd`)

> **Bangladesh Railway Intercity Timetable, Route Stepper, Operating Day Checker & Statutory Fare Calculator**

**RailDesk BD** is a fast, deterministic railway timetable and journey-planning workstation for Bangladesh Railway intercity corridors (formerly prototyped as `NRL`). Built with strict data integrity, segment-accurate distance & fare math, honest schedule provenance, and zero decorative fluff.

---

## Key Capabilities

1. **Bidirectional Intercity Roster (22 Verified Directional Services)**:
   - Major corridors: **Dhaka ⇄ Chattogram** (`701/702 Subarna`, `787/788 Sonar Bangla`, `703/704 Mohanagar`), **Dhaka ⇄ Rajshahi** (`753/754 Silk City`, `759/760 Padma`, `769/770 Dhumketu`), **Dhaka ⇄ Sylhet** (`709/710 Parabat`, `773/774 Kalni`), **Dhaka ⇄ Khulna / Benapole** (`725/726 Sundarban`, `795/796 Benapole` via Padma Bridge), and **Dhaka ⇄ Rangpur** (`771/772 Rangpur Express`).
   - Deterministic duration computation with overnight (`+1d`) rollover handling and weekly off-day filtering.
2. **Segment-Accurate Route & Fare Engine**:
   - Intermediate station pairs (e.g., *Dhaka → Natore* or *Biman Bandar → Cumilla*) compute exact segment distance (`toHalt.distanceKm - fromHalt.distanceKm`), segment departure/arrival times, segment duration, and proportional fares identically across the timetable list, route stepper, fare calculator, and offline journey pass.
   - Statutory Bangladesh Railway fare breakdown: Base Fare + **15% VAT** (AC classes only: `SNIGDHA`, `AC_S`, `AC_B`) + **৳50 Bedding Charge** (berth classes: `AC_B`, `F_BERTH`) + **৳20 Online Service Charge** (Online e-Ticket vs ৳0 Station Counter), with `1–4` passenger multiplier.
3. **Deterministic BST Schedule Stepper & Time Simulator**:
   - Estimates current scheduled position against live **Bangladesh Standard Time (`Asia/Dhaka`, UTC+6)** with an interactive time-preview slider so commuters can inspect every halt, platform, and arrival/departure window without fabricated GPS or seat claims.
4. **Offline-First Printable Journey Pass**:
   - Generates a print-ready boarding summary card with dynamic QR verification payload, live departure countdown, Copy PNR action, and automatic off-day warnings if the selected train does not run on the chosen date.

---

## Tech Stack

- **Frontend**: React 19, TypeScript (strict, zero `any`), Vite 6, Tailwind CSS 4 (`@custom-variant dark`), Framer Motion (`<MotionConfig reducedMotion="user">`), Lucide React, `qrcode`.
- **Governance**: [`DESIGN.md`](./DESIGN.md) • [`ENGINEERING.md`](./ENGINEERING.md)

---

## Local Development

```bash
cd frontEnd
npm install
npm run dev      # Start Vite dev server
npm run build    # Strict tsc --noEmit + production Vite build
npm run lint     # ESLint verification
```
