import { Button, Chip, Link } from "@heroui/react";
import { SiGithub } from "react-icons/si";

import type { PriceState } from "@/app/hooks/use-bitcoin-prices";
import { formatFiat } from "@/lib/number-format.utils";
import type { BitcoinPrices } from "@/lib/schemas/price.schemas";

import { BitcoinSymbol } from "./calculator/currency-symbol";
import { FiatSkeleton } from "./calculator/numeric-skeleton";
import { ThemeToggle } from "./theme-toggle";

const NavigationItems = [
  { href: "#calculator", label: "Calculator" },
  { href: "#impact", label: "Impact" },
  { href: "#converter", label: "Converter" },
  { href: "#methodology", label: "Methodology" },
] as const;

type SiteHeaderProps = {
  prices: BitcoinPrices | null;
  priceState: PriceState;
  onRetry: () => void;
};

export function SiteHeader({ prices, priceState, onRetry }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-1 gap-y-3 px-4 py-3 sm:gap-x-4 sm:px-5">
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
          {NavigationItems.map((item) => (
            <Link key={item.href} className="shrink-0 text-muted" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ms-auto flex shrink-0 items-center gap-1 sm:gap-2">
          {prices ? (
            <Chip className="w-24 justify-center px-0.5" color="accent" size="sm" variant="soft">
              <span aria-live="polite" className="sr-only">
                {formatFiat(prices.EUR, "EUR")} | {formatFiat(prices.USD, "USD")}
              </span>
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
          ) : (
            <Chip
              className="w-24 justify-center px-0.5"
              color={priceState === "error" ? "danger" : "accent"}
              size="sm"
              variant="soft"
            >
              {priceState === "loading" ? (
                <span className="flex items-center font-mono font-medium">
                  <FiatSkeleton currency="EUR" />
                </span>
              ) : (
                "Kraken unavailable"
              )}
            </Chip>
          )}
          {priceState === "error" && (
            <Button size="sm" variant="secondary" onPress={onRetry}>
              Retry
            </Button>
          )}
          <Link
            aria-label="View BitCoinverter on GitHub"
            className="grid size-7 shrink-0 place-items-center rounded-full text-foreground sm:size-8"
            href="https://github.com/StoyanDimitrov0016/BitCoinverter"
            rel="noopener noreferrer"
            target="_blank"
          >
            <SiGithub aria-hidden="true" className="size-4 sm:size-5" />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
