# RailDesk BD — UI/UX Design System

## 1. Aesthetic & Transit Surfaces (60-30-10)
- **60% Canvas**: High-clarity dark canvas (`#09090b` zinc-950 base) or crisp outdoor-legible light canvas (`#f8fafc` slate-50 base).
- **30% Structural Surfaces & Hairlines**: Elevated surface panels (`#18181b` zinc-900 dark / `#ffffff` light) with strict 1px structural borders (`border-zinc-200 dark:border-zinc-800`). Zero blurry neon drop shadows or purple/indigo mesh gradients.
- **10% Primary Accent & Semantic Signals**: Bangladesh Railway emerald (`#059669` emerald-600) for primary actions & operating states; amber (`#d97706` amber-600) for schedule advisories; rose (`#e11d48` rose-600) for weekly maintenance off-days and cancellation deductions.
- **Geometry**: Precision edges (`rounded-md` 6px for buttons, tags, and inputs; `rounded-lg` 8px for containers and timetable panels).

## 2. Typography & Numerical Precision
- **Monospace Primacy**: All train codes (`753`), platform numbers (`PF 2`), departure/arrival timestamps (`14:30`), halt durations (`05m`), kilometer markers (`343 km`), countdowns, and ticket fares (`৳ 415`) MUST use `font-mono tabular-nums`.
- **Bilingual Readiness**: High-contrast legible English + Bengali typography (`Geist` / `Hind Siliguri` + `Geist Mono`).
- **Contrast**: WCAG AA contrast (`>= 4.5:1` for body text and controls; `>= 3:1` for large headings and UI boundaries) in both Dark and Outdoor Light themes.
- **Station Stepper**: Unbroken vertical connection line (`w-0.5 bg-zinc-300 dark:bg-zinc-700`) with circular stop nodes clearly signaling `passed`, `at_station`, `next`, and `upcoming` stops.

## 3. Motion, Ergonomics & Micro-Interactions
- Wrapped in `<MotionConfig reducedMotion="user">` paired with `@media (prefers-reduced-motion: reduce)`.
- Crisp deceleration (`[0.22, 1, 0.36, 1]`, `200ms–320ms`) and controlled springs (`stiffness: 400, damping: 31`) for shared-element `layoutId` active pills and `<AnimatePresence mode="wait">` panel transitions.
- 1-click Origin ⇄ Destination swap button with smooth 180° rotation that preserves selected travel date and class filters.
- Tactile feedback (`active:scale-[0.98]`) and `focus-visible` rings on every interactive control; minimum 44px touch targets on mobile.
