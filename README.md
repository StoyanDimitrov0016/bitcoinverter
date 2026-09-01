# BitCoinverter

BitCoinverter is a privacy-friendly Bitcoin calculator for exploring accumulation, portfolio
impact, and BTC, satoshi, EUR, and USD conversions using live Kraken prices.

Live app: [bitcoinverter.vercel.app](https://bitcoinverter.vercel.app)

## Features

- Accumulation calculator with BTC, EUR, and USD inputs
- Impact analysis for contribution timelines and target prices
- Bitcoin, satoshi, and fiat conversions and reference tables
- Live price loading states, responsive layout, and light/dark themes
- Methodology notes explaining the calculations
- No accounts, persisted financial inputs, or analytics

## Architecture

- Next.js App Router with a Server Component page and focused Client Component boundaries
- Kraken prices fetched directly on the server, cached for 60 seconds, and streamed through React
  Suspense
- A Route Handler used only for browser-side retries, avoiding server-to-server API round trips
- Feature-oriented calculator components with shared form and result primitives
- Runtime validation for Kraken and API responses with Zod
- Unit tests for decimal handling, conversions, accumulation, and impact calculations

## Run locally

```bash
npm install
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

The app uses standard Next.js defaults and requires no environment variables. Import the repository
into Vercel and deploy with the detected Next.js preset, or run `npm run build` on any compatible
Node.js host.

Built with Next.js, React, HeroUI, Tailwind CSS, React Hook Form, Zod, and Vitest.
