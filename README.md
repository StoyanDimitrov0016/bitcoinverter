# BitCoinverter

BitCoinverter is a focused Bitcoin calculator for exploring accumulation, portfolio impact, and fiat-to-BTC conversions using live Kraken prices.

Live app: [bitcoinverter.vercel.app](https://bitcoinverter.vercel.app)

## Features

- Accumulation calculator with BTC, EUR, and USD inputs
- Impact analysis for contribution timelines and target prices
- Bitcoin, satoshi, and fiat conversion tables
- Live price loading states, responsive layout, and light/dark themes
- Methodology notes explaining the calculations

## Run locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
npm run check   # formatting, linting, and type checking
npm run build   # production build
```

Built with Next.js, React, HeroUI, Tailwind CSS, React Hook Form, and Zod. Live BTC prices are fetched from Kraken through the app API route.
