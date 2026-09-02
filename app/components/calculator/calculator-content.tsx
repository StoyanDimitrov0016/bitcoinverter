"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { useForm, useWatch } from "react-hook-form";

import { AccumulationForm } from "../accumulation/accumulation-form";
import { PriceSummaryPanel } from "../accumulation/price-summary-panel";
import { BitcoinConverterPanel } from "../converter/bitcoin-converter-panel";
import { ImpactAnalysisPanel } from "../impact/impact-analysis-panel";
import { SectionHeading } from "../section-heading";

import { parseAccumulationInput } from "@/lib/calculator/calculator.calculations";
import { CONTRIBUTION_DEFAULTS } from "@/lib/calculator/calculator.constants";
import {
  AccumulationSchema,
  type AccumulationFormValues,
  type AccumulationInput,
  type ContributionUnit,
} from "@/lib/calculator/calculator.schemas";

export function CalculatorContent() {
  const hasEditedContributionRef = useRef(false);
  const { control, formState, setValue } = useForm<
    AccumulationFormValues,
    unknown,
    AccumulationInput
  >({
    resolver: zodResolver(AccumulationSchema),
    defaultValues: {
      holding: "0.01",
      holdingUnit: "BTC",
      contribution: "100",
      contributionUnit: "EUR",
    },
    mode: "onChange",
  });
  const formValue = useWatch({ control });
  const input = parseAccumulationInput(formValue);

  const markContributionEdited = () => {
    hasEditedContributionRef.current = true;
  };

  const changeContributionUnit = (nextUnit: ContributionUnit) => {
    if (!hasEditedContributionRef.current) {
      setValue("contribution", CONTRIBUTION_DEFAULTS[nextUnit], {
        shouldDirty: false,
        shouldValidate: true,
      });
    }
    setValue("contributionUnit", nextUnit, { shouldDirty: true, shouldValidate: true });
  };

  return (
    <>
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
            onContributionEdit={markContributionEdited}
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
        <BitcoinConverterPanel />
      </section>
    </>
  );
}
