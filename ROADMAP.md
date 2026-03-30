# Top 10 Prom — Institutional Rebuild Roadmap

## Phase 0: Foundation ✅ **COMPLETE**
- [x] Project scaffold — Next.js 16.2.1, TypeScript strict, Tailwind 4
- [x] `package.json` name = `top10prom`, all scripts defined
- [x] All production dependencies installed
- [x] Vitest + @testing-library/react testing infrastructure
- [x] `tests/setup.ts` with jest-dom matchers
- [x] `.env.example` — all env vars documented
- [x] `middleware.ts` — 5-tier RBAC (ported from proxy.ts, renamed + fixed)
- [x] Design system: `globals.css` — tokens, glass classes, shimmer, scan keyframes
- [x] `tsconfig.json` — strict + noUncheckedIndexedAccess + exactOptionalPropertyTypes
- [x] `next.config.ts` — CSP, all 8 security headers, image remotePatterns
- [x] `eslint.config.mjs` — zero-any rule, no-console, exhaustive-deps all as errors
- [x] `vitest.config.ts` — jsdom, globals, coverage
- [x] Type system: `types/database.ts` (15 tables), `types/index.ts`, `types/admin.ts`
- [x] `lib/schemas.ts` — all Zod schemas incl. bookingStep0 (event_type), walkIn, appointmentStatus
- [x] `lib/ratelimit.ts` — aiRatelimit, bookingRatelimit, apiRatelimit (Upstash)
- [x] `lib/gemini.ts` — createAriaChat, getAriaSystemPrompt, withExponentialBackoff (no 'use cache')
- [x] `lib/geo.ts` — haversineDistance, sortByProximity, formatDistance
- [x] `lib/supabase/server.ts` — typed createClient for Server Components
- [x] `lib/supabase/browser.ts` — typed createBrowserClient for 'use client'
- [x] `lib/supabase/admin.ts` — service role factory, NO 'use cache'
- [x] `lib/store/shopStore.ts` — Zustand persist, hydration guard, EventType typed
- [x] `lib/actions/auth.ts` — loginAction, signupAction, logoutAction (JWT-aware routing)
- [x] `lib/actions/booking.ts` — submitBookingAction (no `as any`, Phase 1G scaffold)
- [x] `lib/actions/staff.ts` — registerWalkInCustomer (no `as any`, atomic writes)
- [x] `lib/actions/appointments.ts` — updateAppointmentStatus (no `as any`, double guard)
- [x] `lib/actions/owner.ts` — inviteStaffMember, setStaffActiveStatus (no `as any`)
- [x] Core UI: Button (spring physics + reduced motion), Skeleton (min-h only), Input, Badge, Toast, Modal
- [x] `app/layout.tsx` — root layout, Geist fonts
- [x] `app/(main)/layout.tsx` — Navbar, BottomNav (5 tabs), ToastProvider
- [x] `app/(saas)/saas/admin/layout.tsx` — SUPER_ADMIN guard
- [x] `app/(saas)/saas/owner/layout.tsx` — OWNER|SUPER_ADMIN guard
- [x] `app/(saas)/saas/staff/layout.tsx` — OWNER|MANAGER|ASSOCIATE guard, tablet sidebar
- [x] Page stubs: home, login, unauthorized, admin, owner, staff floor hub
- [x] Tests: geo (haversineDistance, sortByProximity, formatDistance)
- [x] Tests: schemas (all schemas — valid/invalid, parent_email invariant)
- [x] Tests: gemini (null when key missing, system prompt content)
- [x] Tests: Button (variants, disabled, loading, onClick)
- [x] Tests: Skeleton (min-h only, shimmer class, aria-busy)
- [x] `npm run check` — 0 errors, 0 warnings, 51/51 tests pass ✅ **PHASE 0 COMPLETE**

## Phase 1A: Customer Experience — Foundation ✅ **COMPLETE**
- [x] Catalog page with FilterBar + DressCardGrid
- [x] Dress detail page `catalog/[id]`
- [x] `BottomNav` client component with active state + fitting room badge
- [x] `Navbar` client component with auth state
- [x] `app/(main)/layout.tsx` uses `Navbar`, `BottomNav`, `Footer` component imports
- [x] `app/page.tsx` redirects to `/home` (Phase 1D will add CinematicSplash)
- [x] `app/(main)/catalog/page.tsx`
- [x] `app/(main)/fitting-room/page.tsx`
- [x] `app/(main)/book/page.tsx` (Phase 1B stub)
- [x] `app/(main)/profile/page.tsx` (auth-gated, Phase 1C will expand)

## Phase 1B: Booking System ✅ **COMPLETE**
- [x] BookingWizard — 6-step (Step0SelectEvent through Step5Confirm)
- [x] `submitBookingAction` — fully integrated, Zod validated
- [x] Duplicate dress check (`/api/duplicate-check/route.ts`)
- [x] `BookingProgress` step indicators with AnimatePresence

## Phase 1C: Auth ✅ **COMPLETE**
- [x] Login page + `loginAction` form integration
- [x] Signup page + `signupAction` form integration
- [x] Profile page (customer) — avatar, bookings list, quick links, sign out
- [x] Smart post-login routing (already in loginAction)

## Phase 1D: Cinematic Splash ✅ **COMPLETE**
- [x] `CinematicSplash` — GSAP ScrollSmoother, 4-layer parallax (speeds: 0.3/0.65/1.0/1.4)
- [x] Gold flash (#D4AF37, timeline pos 0.62)
- [x] Mouse parallax on desktop (hover+pointer:fine), disabled during scroll
- [x] `SplashFallback` for reduced-motion / no-JS
- [x] Fix: `<Link>` not `<a>` for internal nav (audit finding)

## Phase 1E: Virtual Try-On ✅ **COMPLETE**
- [x] VirtualTryOn decomposed: PhotoZone, DressPicker, PreviewPane, ProcessingOverlay, ResultOverlay, TryOnActionBar
- [x] PROCESSING_LABELS array (4 phases)
- [x] scan-line CSS animation (already in globals.css)
- [x] No setState-in-effect (all synchronous setState moved into async callbacks)

## Phase 1F: Aria AI Concierge ✅ **COMPLETE**
- [x] `/api/chat/route.ts` — rate limiting (aiRatelimit), exponential backoff
- [x] AriaButton FAB, AriaPanel drawer, AriaBubble message component
- [x] Context-aware system prompt (prom vs wedding) — reads eventType from Zustand
- [x] Graceful degradation when GEMINI_API_KEY missing

## Phase 1G: Notifications ✅ **COMPLETE**
- [x] Resend integration (`lib/email.ts`) — HTML emails, graceful degradation when key missing
- [x] Booking confirmation → customer_email AND parent_email (invariant, both via `Promise.allSettled`)
- [x] Staff invite email with branded HTML template
- [x] `submitBookingAction` — TODO scaffold replaced with real Resend calls

## Phase 2: SaaS — Staff Floor Experience ✅ **COMPLETE**
- [x] Calendar: `StaffCalendarPage` (SSR) + `CalendarAgenda` (client)
- [x] Date navigation via `router.push(?date=YYYY-MM-DD)`
- [x] Appointment card — 96×96 time chip, 48px tap targets
- [x] Status update modal — 2×2 radio grid + sales feedback textarea
- [x] Walk-in form (`WalkInForm.tsx`) wired to `registerWalkInCustomer`
- [x] Clienteling: segments, search, CSV export (Mailchimp columns)
- [x] SMS action button per client row

## Phase 3: SaaS — Owner Portal ✅ **COMPLETE**
- [x] Staff management — invite form + active/deactivate toggle (`StaffInviteForm`, `StaffRow`)
- [x] Analytics dashboard — 90-day KPIs, status breakdown, top schools
- [x] Boutique settings form — lead time, capacity, duration, auto-confirm, notification email
- [x] `updateBoutiqueSettings` server action with Zod validation and double guard

## Phase 4: SaaS — Super Admin ✅ **COMPLETE**
- [x] Global boutique management — activate/deactivate + subscription status toggle (`BoutiqueControlRow`)
- [x] Global inventory view — grouped by boutique, dress + sizes + quantity
- [x] Billing overview — subscription summary KPIs, past-due alert list, full table

## Phase 5: Wedding Module ✅ **COMPLETE**
- [x] `BridalHero` — full-width landing section with bridal CTAs
- [x] `BridalPartyForm` — create party (bride name, date, venue, size, notes)
- [x] `BridalPartyManager` — member list + add form + status advancement flow
- [x] Member invite flow — email sent via Resend when member email is provided
- [x] `WeddingBookingAdapter` — wraps BookingWizard with `eventType='wedding'` Zustand preset
- [x] `/wedding`, `/wedding/party/new`, `/wedding/party/[id]` pages

## Phase 6: PWA & Performance ✅ **COMPLETE**
- [x] Service worker (`public/sw.js`) — static-first, SWR, network-first strategies
- [x] Offline page (`app/(main)/offline/page.tsx`)
- [x] Web App Manifest (`app/manifest.ts`)
- [x] SW registration client component (`components/pwa/ServiceWorkerRegistration.tsx`) wired into root layout
- [x] OG image generation via `next/og` (`/api/og/route.tsx`) — edge runtime, title + subtitle params
- [x] OG image URL set in root layout `openGraph.images`
- [ ] Lighthouse score ≥ 95 all metrics

## Phase 7: Spec Completion ✅ **COMPLETE**

All files from the master spec audit that were missing from Phases 0–6.
`npm run check` verified at 0 errors, 0 warnings, 51/51 tests after each sub-phase.

### Phase A — UI Primitives
- [x] `components/ui/Drawer.tsx` — slide-over panel (bottom/right), spring physics, Escape + backdrop close
- [x] `components/ui/Carousel.tsx` — horizontal scroll with prev/next arrows + dot indicators
- [x] `components/ui/Tooltip.tsx` — accessible tooltip (role="tooltip", aria-describedby), spring fade

### Phase B — Layout Helpers
- [x] `components/layout/ThemeProvider.tsx` — thin context wrapper for future extensibility
- [x] `components/layout/UserMenu.tsx` — dropdown (email, profile, fitting room, wishlist, sign out)
- [x] `components/layout/FittingRoomWidget.tsx` — fixed badge, visible only when fitting room has items
- [x] `components/layout/Navbar.tsx` — added Boutiques link + UserMenu (replaces static avatar)
- [x] `app/(main)/layout.tsx` — added FittingRoomWidget render

### Phase C — Landing Sections
- [x] `components/landing/Hero.tsx` — static hero, spring entry, gold badge pill, dual CTAs
- [x] `components/landing/StatsBar.tsx` — server component, 4-stat grid
- [x] `components/landing/NoDuplicatePromo.tsx` — guarantee pillars with whileInView spring animations
- [x] `components/landing/TrustSection.tsx` — bento grid (styles card, locations, designers, appointments)
- [x] `components/landing/TryOnPromo.tsx` — 3-step grid CTA for virtual try-on
- [x] `components/landing/DesignerStrip.tsx` — CSS marquee scrolling designer names, sr-only a11y
- [x] `components/landing/FeaturedDresses.tsx` — server component, top 6 dresses, falls back to STATIC_DRESSES
- [x] `app/(main)/home/page.tsx` — rewritten to compose all 7 landing sections
- [x] `app/globals.css` — added `@keyframes marquee` + `.animate-marquee` + reduced-motion override

### Phase D — Catalog Completion
- [x] `components/catalog/SizeGuide.tsx` — modal wrapping US + international size chart
- [x] `components/catalog/DuplicateCheck.tsx` — school + event date form → GET /api/duplicate-check
- [x] `components/catalog/AvailabilityForm.tsx` — two-query pattern (dress_inventory → boutiques)
- [x] `components/catalog/DressDetailPanel.tsx` — Carousel, price, color, SizeGuide, DuplicateCheck, AvailabilityForm, add-to-fitting-room
- [x] `components/catalog/FittingRoomSession.tsx` — grid with hydration guard + ShareFittingRoom integration
- [x] `app/(main)/catalog/[id]/page.tsx` — uses DressDetailPanel (server fetch preserved)
- [x] `app/(main)/fitting-room/page.tsx` — uses FittingRoomSession

### Phase E — Social & Sharing
- [x] `components/social/VoteOnDress.tsx` — thumbs up/down with optimistic UI
- [x] `components/social/ShareWithParent.tsx` — parent email form → POST /api/share/parent
- [x] `components/social/ShareFittingRoom.tsx` — share URL + copy + X post + QR code + ShareWithParent
- [x] `app/api/fitting-room/route.ts` — GET (public, by share_token), POST (create), PATCH (update)
- [x] `app/api/share/parent/route.ts` — POST, Zod validation, sendParentShareEmail, rate limit
- [x] `app/api/share/vote/route.ts` — POST, upsert into social_votes, rate limit
- [x] `app/api/admin/analytics/route.ts` — GET, SUPER_ADMIN auth, aggregated appointments + schools
- [x] `app/(main)/share/[token]/page.tsx` — server component, dress grid + VoteOnDress per dress
- [x] `lib/email.ts` — added ParentShareEmailData, buildParentShareHtml, sendParentShareEmail

### Phase F — Location Features
- [x] `components/location/StoreMap.tsx` — static map with normalized lat/lng pin placement
- [x] `components/location/CrossLocationBadge.tsx` — two-query pattern, shows other locations badge
- [x] `components/location/NearestStorePrompt.tsx` — geolocation on button click, localStorage dismiss
- [x] `components/location/StoreLocator.tsx` — search + state filter + map/list toggle (setState in event handlers, not effects)
- [x] `app/(main)/boutiques/page.tsx` — server component, NearestStorePrompt + StoreLocator

### Phase G — Remaining Pages + Admin Store
- [x] `lib/store/adminStore.ts` — Zustand store (no persist), selectedBoutiqueId + analyticsView
- [x] `app/(main)/wishlist/page.tsx` — reads Zustand wishlistIds, hydration guard, DressCard grid
- [x] `app/(main)/prom/page.tsx` — server component + co-located PromEventSetter client component

---

## Known Technical Debt (Do Not Introduce)
- ❌ No `(supabase as any)` casts — all eliminated in Phase 0
- ❌ No raw `<a>` tags for internal navigation (use `<Link>`)
- ❌ No `<img>` tags (use `next/image` Image component)
- ❌ No `console.log` in production paths (only `console.warn` / `console.error`)
- ❌ No `// TODO` without a Phase reference and ROADMAP entry
- ❌ No `'use cache'` on factory functions or module scope
- ❌ No `setState` called synchronously inside `useEffect`
- ❌ No `any` type — `@typescript-eslint/no-explicit-any` is set to `'error'`
- ❌ No `useFormState` (deprecated) — use `useActionState` (React 19)
- ❌ No `backdrop-blur-*` Tailwind utilities outside `.glass-heavy`
- ❌ No subqueries in RLS policies — use JWT claims (O(1) lookups)
- ❌ No shared staff accounts — each person has their own login

## Audit Findings — All Fixed in Phase 0
| Finding | Status |
|---|---|
| `proxy.ts` in wrong location | ✅ Renamed to `middleware.ts` |
| `'use cache'` on Supabase admin factory | ✅ Removed |
| No rate limiting on any endpoint | ✅ `lib/ratelimit.ts` created |
| No test suite | ✅ Vitest + 5 test files |
| `next@16.1.6` CSRF bypass | ✅ Upgraded to 16.2.1 |
| CSP header missing entirely | ✅ Full CSP in `next.config.ts` |
| `(supabase as any)` in 5 action files | ✅ All eliminated |
| `console.log` PII leak in share/parent route | ✅ Not ported |
| `setState` in `useEffect` (3 components) | ✅ Not ported — will fix on Phase 1E |
| Raw `<a href="/catalog/">` in splash | ✅ Not ported — will fix on Phase 1D |
