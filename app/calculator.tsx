"use client";

import { Suspense } from "react";
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
import { BitcoinPricesProvider, useBitcoinPrices, usePriceRetry } from "./hooks/use-bitcoin-prices";

import { calculateAccumulation, parseAccumulationForm } from "@/lib/bitcoin-calculator.utils";
import {
  AccumulationFormSchema,
  type AccumulationFormValues,
  type ContributionUnit,
} from "@/lib/schemas/calculator.schemas";

import type { BitcoinPricesResult } from "@/lib/schemas/price.schemas";

type CalculatorProps = {
  pricesPromise: Promise<BitcoinPricesResult>;
};

export default function Calculator({ pricesPromise }: CalculatorProps) {
  return (
    <BitcoinPricesProvider pricesPromise={pricesPromise}>
      <CalculatorShell />
    </BitcoinPricesProvider>
  );
}

function CalculatorShell() {
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
    <>
      <a
        className="fixed start-2 top-2 z-[60] -translate-y-16 rounded-lg bg-accent px-4 py-2 text-accent-foreground transition-transform focus:translate-y-0"
        href="#top"
      >
        Skip to main content
      </a>
      <PriceHeader />
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
            <Suspense fallback={<ImpactSummaryFallback input={input} />}>
              <ResolvedImpactSummary input={input} />
            </Suspense>
          </div>
        </section>

        <section
          aria-labelledby="impact-section-title"
          className="scroll-mt-32 space-y-3"
          id="impact"
        >
          <SectionHeading id="impact-section-title" title="Impact analysis" />
          <Suspense fallback={<ImpactAnalysisFallback input={input} />}>
            <ResolvedImpactAnalysis input={input} />
          </Suspense>
        </section>

        <section
          aria-labelledby="converter-section-title"
          className="scroll-mt-32 space-y-3"
          id="converter"
        >
          <SectionHeading id="converter-section-title" title="Bitcoin converter" />
          <Suspense fallback={<BitcoinConverterFallback input={input} />}>
            <ResolvedBitcoinConverter input={input} />
          </Suspense>
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
    </>
  );
}

function PriceHeader() {
  const retry = usePriceRetry();

  return (
    <Suspense fallback={<SiteHeader prices={null} priceState="loading" onRetry={retry} />}>
      <ResolvedPriceHeader />
    </Suspense>
  );
}

function ResolvedPriceHeader() {
  const { prices, priceState, retry } = useBitcoinPrices();
  return <SiteHeader prices={prices} priceState={priceState} onRetry={retry} />;
}

type PricePanelProps = {
  input: ReturnType<typeof parseAccumulationForm> | null;
};

type ResolvedImpactSummaryProps = PricePanelProps;
type ImpactSummaryFallbackProps = PricePanelProps;
type ResolvedImpactAnalysisProps = PricePanelProps;
type ImpactAnalysisFallbackProps = PricePanelProps;
type ResolvedBitcoinConverterProps = PricePanelProps;
type BitcoinConverterFallbackProps = PricePanelProps;

function ResolvedImpactSummary({ input }: ResolvedImpactSummaryProps) {
  const { isPriceLoading, prices } = useBitcoinPrices();
  const results = input && prices ? calculateAccumulation(input, prices) : null;

  return (
    <CalculatorDataProvider
      input={input}
      isPriceLoading={isPriceLoading}
      prices={prices}
      results={results}
    >
      <ImpactSummary />
    </CalculatorDataProvider>
  );
}

function ImpactSummaryFallback({ input }: ImpactSummaryFallbackProps) {
  return (
    <CalculatorDataProvider input={input} isPriceLoading prices={null} results={null}>
      <ImpactSummary />
    </CalculatorDataProvider>
  );
}

function ResolvedImpactAnalysis({ input }: ResolvedImpactAnalysisProps) {
  const { isPriceLoading, prices } = useBitcoinPrices();
  const results = input && prices ? calculateAccumulation(input, prices) : null;

  return (
    <CalculatorDataProvider
      input={input}
      isPriceLoading={isPriceLoading}
      prices={prices}
      results={results}
    >
      <div className="grid gap-4 lg:grid-cols-2">
        <ImpactHorizon />
        <PriceImpactLevels />
      </div>
    </CalculatorDataProvider>
  );
}

function ImpactAnalysisFallback({ input }: ImpactAnalysisFallbackProps) {
  return (
    <CalculatorDataProvider input={input} isPriceLoading prices={null} results={null}>
      <div className="grid gap-4 lg:grid-cols-2">
        <ImpactHorizon />
        <PriceImpactLevels />
      </div>
    </CalculatorDataProvider>
  );
}

function ResolvedBitcoinConverter({ input }: ResolvedBitcoinConverterProps) {
  const { isPriceLoading, prices } = useBitcoinPrices();
  const results = input && prices ? calculateAccumulation(input, prices) : null;

  return (
    <CalculatorDataProvider
      input={input}
      isPriceLoading={isPriceLoading}
      prices={prices}
      results={results}
    >
      <BitcoinConverter />
    </CalculatorDataProvider>
  );
}

function BitcoinConverterFallback({ input }: BitcoinConverterFallbackProps) {
  return (
    <CalculatorDataProvider input={input} isPriceLoading prices={null} results={null}>
      <BitcoinConverter />
    </CalculatorDataProvider>
  );
}
