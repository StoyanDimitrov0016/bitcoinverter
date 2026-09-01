"use client";

import { useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import { AccumulationForm } from "./accumulation-form";
import { BitcoinConverterPanel } from "./bitcoin-converter-panel";
import { ImpactAnalysisPanel } from "./impact-analysis-panel";
import { Methodology } from "./methodology";
import { PriceHeader } from "./price-header";
import { PriceSummaryPanel } from "./price-summary-panel";
import { SiteFooter } from "../site-footer";
import { SectionHeading } from "../section-heading";

import { parseAccumulationForm } from "@/lib/bitcoin-calculator.utils";
import {
  AccumulationFormSchema,
  type AccumulationFormValues,
  type ContributionUnit,
} from "@/lib/schemas/calculator.schemas";

export function CalculatorContent() {
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
            <PriceSummaryPanel input={input} />
          </div>
        </section>

        <section
          aria-labelledby="impact-section-title"
          className="scroll-mt-32 space-y-3"
          id="impact"
        >
          <SectionHeading id="impact-section-title" title="Impact analysis" />
          <ImpactAnalysisPanel input={input} />
        </section>

        <section
          aria-labelledby="converter-section-title"
          className="scroll-mt-32 space-y-3"
          id="converter"
        >
          <SectionHeading id="converter-section-title" title="Bitcoin converter" />
          <BitcoinConverterPanel input={input} />
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
