import { Button, Chip, Link } from "@heroui/react";
import { SiBitcoin, SiGithub } from "react-icons/si";

import { formatFiat } from "@/lib/number-format.utils";
import type { BitcoinPrices } from "@/lib/schemas/price.schemas";

const NavigationItems = [
  { href: "#calculator", label: "Calculator" },
  { href: "#impact", label: "Impact" },
  { href: "#converter", label: "Converter" },
  { href: "#methodology", label: "Methodology" },
] as const;

export type PriceState = "loading" | "ready" | "error";

type SiteHeaderProps = {
  prices: BitcoinPrices | null;
  priceState: PriceState;
  onRetry: () => void;
};

export function SiteHeader({ prices, priceState, onRetry }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-center gap-x-6 gap-y-3 px-5 py-3">
        <Link className="mr-auto flex items-center gap-3 font-semibold text-slate-950" href="/">
          <span className="grid size-9 place-items-center rounded-full bg-accent text-lg text-accent-foreground">
            <SiBitcoin aria-hidden="true" size={21} />
          </span>
          BitCoinverter
        </Link>

        <nav
          aria-label="Primary navigation"
          className="order-last flex w-full items-center gap-5 overflow-x-auto border-t border-slate-100 pt-3 text-sm sm:order-none sm:w-auto sm:border-0 sm:pt-0"
        >
          {NavigationItems.map((item) => (
            <Link key={item.href} className="shrink-0 text-slate-600" href={item.href}>
              {item.label}
            </Link>
          ))}
          <div aria-live="polite" className="flex shrink-0 items-center gap-2">
            {prices ? (
              <Chip color="accent" variant="soft">
                <span className="flex items-center gap-2 font-medium">
                  <span>{formatFiat(prices.EUR, "EUR")}</span>
                  <span>{formatFiat(prices.USD, "USD")}</span>
                </span>
              </Chip>
            ) : (
              <Chip color={priceState === "error" ? "danger" : "default"} variant="soft">
                {priceState === "loading" ? "Loading Kraken price…" : "Kraken unavailable"}
              </Chip>
            )}
            {priceState === "error" && (
              <Button size="sm" variant="secondary" onPress={onRetry}>
                Retry
              </Button>
            )}
          </div>
          <Link
            aria-label="View BitCoinverter on GitHub"
            className="grid size-8 shrink-0 place-items-center rounded-full text-slate-700"
            href="https://github.com/StoyanDimitrov0016/BitCoinverter"
            rel="noopener noreferrer"
            target="_blank"
          >
            <SiGithub aria-hidden="true" size={20} />
          </Link>
        </nav>
      </div>
    </header>
  );
}
