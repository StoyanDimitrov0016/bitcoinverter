# BitCoinverter

BitCoinverter is a bilingual, privacy-friendly Bitcoin calculator for exploring accumulation,
portfolio impact, global scarcity, and BTC, satoshi, EUR, and USD conversions using live Kraken
prices.

Live app: [bitcoinverter.vercel.app](https://bitcoinverter.vercel.app)

## Features

- BTC accumulation planning with recurring contributions in BTC, EUR, or USD
- Impact analysis with current-plan timelines, required monthly plans, and interactive BTC and
  percentage charts
- Scarcity-based global Bitcoin percentile estimates and comparison benchmarks
- BTC, satoshi, EUR, and USD conversion tools and reference tables
- English and Bulgarian interfaces with a persistent language preference
- Responsive light and dark themes with system-theme detection and a persistent preference
- Live price loading, retry, and unavailable states
- Methodology and source notes explaining assumptions, calculations, and limitations
- No accounts, persisted financial inputs, or analytics

## Architecture

- Next.js App Router with statically generated English and Bulgarian routes and focused Client
  Component boundaries
- `next-intl` routing, typed message catalogs, localized metadata, and locale-aware navigation
- Kraken prices fetched directly on the server, cached for 60 seconds, and streamed through React
  Suspense
- A Route Handler used only for browser-side retries, avoiding server-to-server API round trips
- Feature-oriented calculator components with shared form and result primitives
- Runtime validation for Kraken and API responses with Zod
- Translation-catalog parity tests covering message keys and ICU arguments
- Unit tests for price handling, decimal formatting, conversions, accumulation, percentile, and
  impact calculations

## Run locally

Requires Node.js 24 LTS.

```bash
npm ci
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run check   # formatting, linting, type checking, and unit tests
npm run build   # production build
```

`npm run check` runs formatting, linting, type checking, and unit tests.

## Deploy

The app requires no environment variables. Import the repository into Vercel and deploy with the
detected Next.js preset, or run `npm run build` on a Node.js 24 host.

Built with Next.js, React, next-intl, HeroUI, TanStack Charts, Tailwind CSS, React Hook Form, Zod,
and Vitest.
