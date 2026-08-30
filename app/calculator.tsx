"use client";

import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import { AccumulationForm } from "./components/calculator/accumulation-form";
import { BitcoinConverter } from "./components/calculator/bitcoin-converter";
import { CalculatorDataProvider } from "./components/calculator/calculator-data-context";
import { ImpactHorizon } from "./components/calculator/impact-horizon";
import { ImpactSummary } from "./components/calculator/impact-summary";
import { Methodology } from "./components/calculator/methodology";
import { PriceImpactLevels } from "./components/calculator/price-impact-levels";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader } from "./components/site-header";
import { SectionHeading } from "./components/section-heading";
import { useBitcoinPrices } from "./hooks/use-bitcoin-prices";
import { calculateAccumulation, parseAccumulationForm } from "@/lib/bitcoin-calculator.utils";
import {
  AccumulationFormSchema,
  type AccumulationFormValues,
  type ContributionUnit,
} from "@/lib/schemas/calculator.schemas";

export default function Calculator() {
  const { prices, priceState, retry } = useBitcoinPrices();
  const isPriceLoading = priceState === "loading";
  const { control, formState, setValue } = useForm<AccumulationFormValues>({
    defaultValues: {
      holding: "0.01",
      holdingUnit: "BTC",
      contribution: "100",
      contributionUnit: "EUR",
    },
    mode: "onChange",
  });
  const formValue = useWatch({ control });
  const input = z.validate(AccumulationFormSchema, formValue)
    ? parseAccumulationForm(formValue)
    : null;
  const results = input && prices ? calculateAccumulation(input, prices) : null;

  const changeContributionUnit = (nextUnit: ContributionUnit) => {
    const defaults: Record<ContributionUnit, string> = {
      USD: "100",
      EUR: "100",
      BTC: "0.001",
    };
    setValue("contribution", defaults[nextUnit], {
      shouldDirty: true,
      shouldValidate: true,
    });
    setValue("contributionUnit", nextUnit, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <CalculatorDataProvider
      input={input}
      isPriceLoading={isPriceLoading}
      prices={prices}
      results={results}
    >
      <a
        className="fixed start-2 top-2 z-[60] -translate-y-16 rounded-lg bg-accent px-4 py-2 text-accent-foreground transition-transform focus:translate-y-0"
        href="#top"
      >
        Skip to main content
      </a>
      <SiteHeader prices={prices} priceState={priceState} onRetry={() => void retry()} />
      <main
        id="top"
        tabIndex={-1}
        className="mx-auto w-full max-w-7xl space-y-8 px-4 py-6 sm:px-5 sm:py-8"
      >
        <div className="sr-only">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Bitcoin accumulation calculator
          </h1>
          <p className="text-muted">
            See how steady contributions compound, priced against Kraken’s live BTC rate.
          </p>
        </div>
        <section
          aria-labelledby="calculator-section-title"
          className="scroll-mt-32 space-y-3"
          id="calculator"
        >
          <SectionHeading id="calculator-section-title" title="Accumulation calculator" />
          <div className="grid gap-4 lg:grid-cols-2">
            <AccumulationForm
              control={control}
              errors={formState.errors}
              onContributionUnitChange={changeContributionUnit}
            />
            <ImpactSummary />
          </div>
        </section>

        <section
          aria-labelledby="impact-section-title"
          className="scroll-mt-32 space-y-3"
          id="impact"
        >
          <SectionHeading id="impact-section-title" title="Impact analysis" />
          <div className="grid gap-4 lg:grid-cols-2">
            <ImpactHorizon />
            <PriceImpactLevels />
          </div>
        </section>

        <section
          aria-labelledby="converter-section-title"
          className="scroll-mt-32 space-y-3"
          id="converter"
        >
          <SectionHeading id="converter-section-title" title="Bitcoin converter" />
          <BitcoinConverter />
        </section>

        <section
          aria-labelledby="methodology-section-title"
          className="scroll-mt-32 space-y-3"
          id="methodology"
        >
          <SectionHeading id="methodology-section-title" title="Methodology" />
          <Methodology />
        </section>
      </main>
      <SiteFooter />
    </CalculatorDataProvider>
  );
}
