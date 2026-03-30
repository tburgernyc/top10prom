This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# Top 10 Prom

A multi-tenant SaaS digital showroom for luxury prom and bridal boutiques — built to institutional-grade standards.

## Stack

- **Next.js 16.2.1** (App Router) + **React 19** + **TypeScript** (strict)
- **Tailwind CSS 4** with custom design system (onyx/gold/platinum/ivory)
- **Supabase** (Auth + Postgres) with 5-tier RBAC via custom JWT claims
- **Zustand 5** for client state (boutique context, fitting room, wishlist)
- **motion/react 12** — spring physics only, `useReducedMotion()` everywhere
- **GSAP 3** — cinematic splash scroll experience
- **Gemini 2.0 Flash** — Aria AI style concierge
- **Resend** — transactional email (booking confirmations, staff invites)
- **Upstash Redis** — rate limiting (AI, booking, general API)
- **Vitest** + **@testing-library/react** — 51 tests

## Features

- 🛍 **Catalog** — dress browsing with FilterBar, DressDetailPanel, size guide, duplicate-check
- 👗 **Virtual Try-On** — client-side AI simulation with scan animation
- 📅 **Booking Wizard** — 6-step flow with dual email notification (customer + parent)
- 🪞 **Fitting Room** — save & share sessions, QR codes, parent email, voting
- 🤖 **Aria AI Concierge** — Gemini-powered style assistant (prom/wedding aware)
- 💍 **Wedding Module** — bridal party manager, member invite flow
- 🏬 **SaaS Staff Portal** — tablet-optimized calendar, walk-in registration, clienteling CRM
- 👑 **SaaS Owner Portal** — staff management, analytics dashboard, boutique settings
- 🔐 **SaaS Admin** — global boutique management, subscription status, inventory
- 📍 **Store Locator** — map + list view, geolocation, cross-location badge
- 📲 **PWA** — service worker, offline page, web manifest, OG image generation

## Getting Started

```bash
cp .env.example .env.local
# Fill in all values in .env.local

npm install
npm run dev
```

## Scripts

```bash
npm run dev        # Development server
npm run build      # Production build
npm run check      # typecheck + lint + test (must pass 0 errors)
npm run test       # Vitest run
npm run typecheck  # tsc --noEmit
npm run lint       # ESLint --max-warnings 0
```

## Environment Variables

See `.env.example` for all required variables.
