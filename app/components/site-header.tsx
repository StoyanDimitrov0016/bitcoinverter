import { Button, Chip, Link } from "@heroui/react";
import { SiGithub } from "react-icons/si";

import { formatFiat } from "@/lib/number-format.utils";
import type { BitcoinPrices } from "@/lib/prices/price.schemas";

import { BitcoinSymbol } from "./shared/currency-symbol";
import { FiatSkeleton } from "./shared/numeric-skeleton";
import { ThemeToggle } from "./theme-toggle";

const NAVIGATION_ITEMS = [
  { href: "#calculator", label: "Calculator" },
  { href: "#impact", label: "Impact" },
  { href: "#converter", label: "Converter" },
  { href: "#percentile", label: "Percentile" },
  { href: "#methodology", label: "Methodology" },
] as const;

type HeaderPriceState =
  | { status: "loading" }
  | { status: "error"; retry: () => void }
  | { status: "ready"; prices: BitcoinPrices };

type SiteHeaderProps = { price: HeaderPriceState };

export function SiteHeader({ price }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="layout-container flex flex-wrap items-center gap-x-1 gap-y-3 py-3 sm:gap-x-4">
        <Link
          className="flex shrink-0 items-center gap-1.5 text-sm font-semibold text-foreground sm:gap-3 sm:text-base"
          href="/"
        >
          <span className="grid size-7 place-items-center text-[1.75rem] sm:size-9 sm:text-[2.25rem]">
            <BitcoinSymbol />
          </span>
          BitCoinverter
        </Link>

        <nav
          aria-label="Primary navigation"
          className="order-last flex w-full items-center justify-center gap-4 overflow-x-auto border-t border-border-secondary pt-3 text-sm sm:order-0 sm:w-auto sm:flex-1 sm:gap-5 sm:border-0 sm:pt-0"
        >
          {NAVIGATION_ITEMS.map((item) => (
            <Link key={item.href} className="shrink-0 text-muted" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-2">
          <HeaderPrice price={price} />
          <ThemeToggle />
          <Link
            aria-label="View BitCoinverter on GitHub (opens in a new tab)"
            className="grid size-7 shrink-0 place-items-center rounded-full text-foreground sm:size-8"
            href="https://github.com/StoyanDimitrov0016/BitCoinverter"
            rel="noopener noreferrer"
            target="_blank"
          >
            <SiGithub aria-hidden="true" className="size-4 sm:size-5" />
          </Link>
        </div>
      </div>
    </header>
  );
}

type HeaderPriceProps = { price: HeaderPriceState };

function HeaderPrice({ price }: HeaderPriceProps) {
  if (price.status === "loading") {
    return (
      <Chip className="w-24 justify-center px-0.5" color="accent" size="sm" variant="soft">
        <span className="flex items-center font-mono font-medium">
          <FiatSkeleton currency="EUR" />
        </span>
      </Chip>
    );
  }

  if (price.status === "error") {
    return (
      <>
        <Chip className="w-24 justify-center px-0.5" color="danger" size="sm" variant="soft">
          Kraken unavailable
        </Chip>
        <Button
          aria-label="Retry loading the Kraken price"
          size="sm"
          variant="secondary"
          onPress={price.retry}
        >
          Retry price
        </Button>
      </>
    );
  }

  return <LivePriceTicker prices={price.prices} />;
}

type LivePriceTickerProps = { prices: BitcoinPrices };

function LivePriceTicker({ prices }: LivePriceTickerProps) {
  return (
    <Chip className="w-24 justify-center bg-surface px-0.5 text-accent" size="sm">
      <output aria-atomic="true" className="sr-only">
        Current Kraken Bitcoin prices: {formatFiat(prices.EUR, "EUR")} and{" "}
        {formatFiat(prices.USD, "USD")}
      </output>
      <span aria-hidden="true" className="h-5 overflow-hidden font-mono font-medium">
        <span className="price-ticker-track flex flex-col">
          <span className="flex h-5 items-center justify-center whitespace-nowrap">
            {formatFiat(prices.EUR, "EUR")}
          </span>
          <span className="flex h-5 items-center justify-center whitespace-nowrap">
            {formatFiat(prices.USD, "USD")}
          </span>
          <span className="flex h-5 items-center justify-center whitespace-nowrap">
            {formatFiat(prices.EUR, "EUR")}
          </span>
        </span>
      </span>
    </Chip>
  );
}
