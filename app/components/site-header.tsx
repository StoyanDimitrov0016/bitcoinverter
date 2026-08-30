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
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-3 px-4 py-3 sm:px-5">
        <Link className="flex shrink-0 items-center gap-3 font-semibold text-foreground" href="/">
          <span className="grid size-9 place-items-center text-[2.25rem]">
            <BitcoinSymbol />
          </span>
          BitCoinverter
        </Link>

        <nav
          aria-label="Primary navigation"
          className="order-last flex w-full items-center justify-start gap-5 overflow-x-auto border-t border-border-secondary pt-3 text-sm sm:order-0 sm:w-auto sm:flex-1 sm:justify-center sm:border-0 sm:pt-0"
        >
          {NavigationItems.map((item) => (
            <Link key={item.href} className="shrink-0 text-muted" href={item.href}>
              {item.label}
            </Link>
          ))}
        </nav>

        <div aria-live="polite" className="ms-auto flex shrink-0 items-center gap-2">
          {prices ? (
            <Chip className="min-w-48 justify-center px-2" color="accent" variant="soft">
              <span className="flex items-center gap-1.5 font-mono font-medium sm:gap-2">
                <span>{formatFiat(prices.EUR, "EUR")}</span>
                <span>{formatFiat(prices.USD, "USD")}</span>
              </span>
            </Chip>
          ) : (
            <Chip
              className="min-w-48 justify-center px-2"
              color={priceState === "error" ? "danger" : "accent"}
              variant="soft"
            >
              {priceState === "loading" ? (
                <span className="flex items-center gap-2 font-mono font-medium">
                  <FiatSkeleton currency="EUR" />
                  <FiatSkeleton currency="USD" />
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
            className="grid size-8 shrink-0 place-items-center rounded-full text-foreground"
            href="https://github.com/StoyanDimitrov0016/BitCoinverter"
            rel="noopener noreferrer"
            target="_blank"
          >
            <SiGithub aria-hidden="true" size={20} />
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
