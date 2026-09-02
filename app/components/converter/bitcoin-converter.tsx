import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Form } from "@heroui/react";
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
  const calculatorState = useCalculatorData();
  const { control, formState } = useForm<ConverterFormValues, unknown, ConverterInput>({
    resolver: zodResolver(ConverterSchema),
    defaultValues: { value: "1", unit: "EUR" },
    mode: "onChange",
  });
  const formValue = useWatch({ control });
  const input = parseConverterInput(formValue);

  return (
    <div className="space-y-4">
      <Card className="py-2">
        <Card.Content className="grid items-center gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <Form
            aria-label="Bitcoin conversion input"
            className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end"
          >
            <Controller
              control={control}
              name="value"
              render={({ field }) => (
                <div className="[&_.label]:sr-only">
                  <ValueField
                    error={formState.errors.value?.message}
                    label="Amount to convert"
                    step={getAmountStep(formValue.unit ?? "EUR")}
                    value={field.value}
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
                  label="Unit"
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
  if (state.status === "loading") {
    return <LoadingConverterValues />;
  }

  if (state.status !== "ready" || !input) {
    return <UnavailableConverterValues />;
  }

  const bitcoinValue = convertToBitcoin(input, state.prices);
  return (
    <ConversionGrid>
      <Conversion label="Satoshis">
        <SatoshiSymbol />
        {formatNumber(bitcoinValue * SATS_PER_BTC, 0)}
      </Conversion>
      <Conversion label="Euro">{formatFiat(bitcoinValue * state.prices.EUR, "EUR")}</Conversion>
      <Conversion label="USD">{formatFiat(bitcoinValue * state.prices.USD, "USD")}</Conversion>
      <Conversion label="Bitcoin">
        <ConverterBitcoinSymbol />
        {formatNumber(bitcoinValue)}
      </Conversion>
    </ConversionGrid>
  );
}

function LoadingConverterValues() {
  return (
    <ConversionGrid>
      <Conversion label="Satoshis">
        <SatoshiSymbol />
        <NumericSkeleton width="long" />
      </Conversion>
      <Conversion label="Euro">
        <FiatSkeleton currency="EUR" width="long" />
      </Conversion>
      <Conversion label="USD">
        <FiatSkeleton currency="USD" width="long" />
      </Conversion>
      <Conversion label="Bitcoin">
        <ConverterBitcoinSymbol />
        <NumericSkeleton width="long" />
      </Conversion>
    </ConversionGrid>
  );
}

function UnavailableConverterValues() {
  return (
    <ConversionGrid>
      <Conversion label="Satoshis">
        <UnavailableValue />
      </Conversion>
      <Conversion label="Euro">
        <UnavailableValue />
      </Conversion>
      <Conversion label="USD">
        <UnavailableValue />
      </Conversion>
      <Conversion label="Bitcoin">
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
