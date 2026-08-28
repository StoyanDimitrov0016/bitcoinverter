"use client";

import { useCallback, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { Check as check, Parse as parse } from "typebox/value";

import { AccumulationForm } from "./components/calculator/accumulation-form";
import { BitcoinConverter } from "./components/calculator/bitcoin-converter";
import { ImpactHorizon } from "./components/calculator/impact-horizon";
import { ImpactSummary } from "./components/calculator/impact-summary";
import { Methodology } from "./components/calculator/methodology";
import { PriceImpactLevels } from "./components/calculator/price-impact-levels";
import { SiteFooter } from "./components/site-footer";
import { SiteHeader, type PriceState } from "./components/site-header";
import { SectionHeading } from "./components/section-heading";
import { calculateAccumulation, parseAccumulationForm } from "@/lib/bitcoin-calculator.utils";
import {
  AccumulationFormSchema,
  type AccumulationFormValues,
  type ContributionUnit,
} from "@/lib/schemas/calculator.schemas";
import { BitcoinPricesSchema, type BitcoinPrices } from "@/lib/schemas/price.schemas";

type CalculatorProps = { initialPrices: BitcoinPrices | null };

export default function Calculator({ initialPrices }: CalculatorProps) {
  const [prices, setPrices] = useState(initialPrices);
  const [priceState, setPriceState] = useState<PriceState>(initialPrices ? "ready" : "error");
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
  const input = check(AccumulationFormSchema, formValue) ? parseAccumulationForm(formValue) : null;
  const results = input && prices ? calculateAccumulation(input, prices) : null;

  const changeContributionUnit = useCallback(
    (nextUnit: ContributionUnit) => {
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
    },
    [setValue]
  );

  const loadPrices = useCallback(async () => {
    setPriceState("loading");
    try {
      const response = await fetch("/api/prices", { cache: "no-store" });
      const payload: unknown = await response.json();
      if (!response.ok) {
        throw new Error("The price service returned an error response");
      }
      setPrices(parse(BitcoinPricesSchema, payload));
      setPriceState("ready");
    } catch {
      setPrices(null);
      setPriceState("error");
    }
  }, []);

  return (
    <>
      <SiteHeader prices={prices} priceState={priceState} onRetry={() => void loadPrices()} />
      <main id="top" className="mx-auto w-full max-w-[1280px] space-y-8 px-5 py-6 sm:py-8">
        <section
          aria-labelledby="calculator-section-title"
          className="scroll-mt-32 space-y-3"
          id="calculator"
        >
          <SectionHeading id="calculator-section-title" title="Accumulation calculator" />
          <div className="grid gap-4 lg:grid-cols-[0.85fr_1.15fr]">
            <AccumulationForm
              control={control}
              errors={formState.errors}
              onContributionUnitChange={changeContributionUnit}
            />
            <div className="space-y-4">
              <ImpactSummary input={input} prices={prices} results={results} />
              {/* Month-by-month holdings can be restored when the detailed schedule is needed. */}
            </div>
          </div>
        </section>

        <section
          aria-labelledby="impact-section-title"
          className="scroll-mt-32 space-y-3"
          id="impact"
        >
          <SectionHeading id="impact-section-title" title="Impact analysis" />
          <div className="grid gap-4 lg:grid-cols-2">
            <ImpactHorizon input={input} prices={prices} results={results} />
            <PriceImpactLevels input={input} prices={prices} results={results} />
          </div>
        </section>

        <section
          aria-labelledby="converter-section-title"
          className="scroll-mt-32 space-y-3"
          id="converter"
        >
          <SectionHeading id="converter-section-title" title="Bitcoin converter" />
          <BitcoinConverter prices={prices} />
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
