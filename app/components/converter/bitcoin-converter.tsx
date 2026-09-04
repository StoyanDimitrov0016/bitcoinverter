import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Form } from "@heroui/react";
import { useTranslations } from "next-intl";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { ReactNode } from "react";

import {
  convertToBitcoin,
  getAmountStep,
  parseConverterInput,
} from "@/lib/calculator/calculator.calculations";
import { CONVERTER_UNITS, SATS_PER_BTC } from "@/lib/calculator/calculator.constants";
import {
  ConverterSchema,
  type ConverterFormValues,
  type ConverterInput,
} from "@/lib/calculator/calculator.schemas";
import { formatFiat, formatNumber } from "@/lib/number-format.utils";
import { useCalculatorData, type CalculatorData } from "../calculator/calculator-data-context";
import { ConverterBitcoinSymbol, SatoshiSymbol } from "../shared/currency-symbol";
import { FiatSkeleton, NumericSkeleton } from "../shared/numeric-skeleton";
import { UnavailableValue } from "../shared/unavailable-value";
import { UnitPicker } from "../shared/unit-picker";
import { ValueField } from "../shared/value-field";
import { SatoshiRatesTable } from "./satoshi-rates-table";

export function BitcoinConverter() {
  const t = useTranslations("Converter");
  const tCommon = useTranslations("Common");
  const tValueField = useTranslations("ValueField");
  const calculatorState = useCalculatorData();
  const { control, formState } = useForm<ConverterFormValues, unknown, ConverterInput>({
    resolver: zodResolver(ConverterSchema),
    defaultValues: { value: "1", unit: "EUR" },
    mode: "onTouched",
  });
  const formValue = useWatch({ control });
  const input = parseConverterInput(formValue);

  return (
    <div className="space-y-4">
      <Card className="py-2">
        <Card.Content className="grid items-center gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <Form
            aria-label={t("formAriaLabel")}
            className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3"
          >
            <Controller
              control={control}
              name="value"
              render={({ field }) => (
                <div className="[&_.label]:sr-only">
                  <ValueField
                    error={formState.errors.value ? tValueField("invalidAmount") : undefined}
                    label={t("amountLabel")}
                    step={getAmountStep(formValue.unit ?? "EUR")}
                    value={field.value}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                  />
                </div>
              )}
            />
            <Controller
              control={control}
              name="unit"
              render={({ field }) => (
                <UnitPicker
                  isLabelHidden
                  label={tCommon("unit")}
                  value={field.value}
                  values={CONVERTER_UNITS}
                  onChange={field.onChange}
                />
              )}
            />
          </Form>
          <ConverterValues input={input} state={calculatorState} />
        </Card.Content>
      </Card>
      <SatoshiRatesTable />
    </div>
  );
}

type ConverterValuesProps = {
  input: ConverterInput | null;
  state: CalculatorData;
};

function ConverterValues({ input, state }: ConverterValuesProps) {
  const t = useTranslations("Units");

  if (state.status === "loading") {
    return <LoadingConverterValues />;
  }

  if (state.status !== "ready" || !input) {
    return <UnavailableConverterValues />;
  }

  const bitcoinValue = convertToBitcoin(input, state.prices);
  return (
    <ConversionGrid>
      <Conversion label={t("satoshis")}>
        <SatoshiSymbol />
        {formatNumber(bitcoinValue * SATS_PER_BTC, 0)}
      </Conversion>
      <Conversion label={t("euro")}>
        {formatFiat(bitcoinValue * state.prices.EUR, "EUR")}
      </Conversion>
      <Conversion label={t("usd")}>{formatFiat(bitcoinValue * state.prices.USD, "USD")}</Conversion>
      <Conversion label={t("bitcoin")}>
        <ConverterBitcoinSymbol />
        {formatNumber(bitcoinValue)}
      </Conversion>
    </ConversionGrid>
  );
}

function LoadingConverterValues() {
  const t = useTranslations("Units");

  return (
    <ConversionGrid>
      <Conversion label={t("satoshis")}>
        <SatoshiSymbol />
        <NumericSkeleton width="long" />
      </Conversion>
      <Conversion label={t("euro")}>
        <FiatSkeleton currency="EUR" width="long" />
      </Conversion>
      <Conversion label={t("usd")}>
        <FiatSkeleton currency="USD" width="long" />
      </Conversion>
      <Conversion label={t("bitcoin")}>
        <ConverterBitcoinSymbol />
        <NumericSkeleton width="long" />
      </Conversion>
    </ConversionGrid>
  );
}

function UnavailableConverterValues() {
  const t = useTranslations("Units");

  return (
    <ConversionGrid>
      <Conversion label={t("satoshis")}>
        <UnavailableValue />
      </Conversion>
      <Conversion label={t("euro")}>
        <UnavailableValue />
      </Conversion>
      <Conversion label={t("usd")}>
        <UnavailableValue />
      </Conversion>
      <Conversion label={t("bitcoin")}>
        <UnavailableValue />
      </Conversion>
    </ConversionGrid>
  );
}

type ConversionGridProps = { children: ReactNode };

function ConversionGrid({ children }: ConversionGridProps) {
  return <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">{children}</dl>;
}

type ConversionProps = { children: ReactNode; label: string };

function Conversion({ children, label }: ConversionProps) {
  return (
    <div className="rounded-xl bg-surface-secondary p-3">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 flex items-center gap-0.5 font-mono text-lg font-semibold break-all text-foreground tabular-nums">
        {children}
      </dd>
    </div>
  );
}
