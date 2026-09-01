import { Card, Form } from "@heroui/react";
import { Controller, useForm, useWatch } from "react-hook-form";
import type { ReactNode } from "react";
import * as z from "zod";

import {
  convertToBitcoin,
  getAmountStep,
  parseConverterForm,
  SATS_PER_BTC,
} from "@/lib/bitcoin-calculator.utils";
import { formatFiat, formatNumber } from "@/lib/number-format.utils";
import { schemaValidationRule } from "@/lib/react-hook-form.utils";
import {
  ConverterFormSchema,
  DecimalAmountInputSchema,
  type ConverterFormValues,
} from "@/lib/schemas/calculator.schemas";
import { useCalculatorData } from "../shared/calculator-data-context";
import { ConverterBitcoinSymbol, SatoshiSymbol } from "../shared/currency-symbol";
import { FiatSkeleton, NumericSkeleton, PendingValue } from "../shared/numeric-skeleton";
import { UnitPicker } from "../shared/unit-picker";
import { ValueField } from "../shared/value-field";
import { SatoshiRatesTable } from "./satoshi-rates-table";

export function BitcoinConverter() {
  const { isPriceLoading, prices } = useCalculatorData();
  const { control, formState } = useForm<ConverterFormValues>({
    defaultValues: { value: "1", unit: "EUR" },
    mode: "onChange",
  });
  const formValue = useWatch({ control });
  const input = z.validate(ConverterFormSchema, formValue) ? parseConverterForm(formValue) : null;
  const bitcoinValue = input && prices ? convertToBitcoin(input, prices) : null;

  return (
    <div className="space-y-4">
      <Card className="py-2">
        <Card.Content className="grid items-start gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <Form className="grid grid-cols-1 gap-3 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
            <Controller
              control={control}
              name="value"
              rules={{
                validate: schemaValidationRule(
                  DecimalAmountInputSchema,
                  "Enter a valid, non-negative amount."
                ),
              }}
              render={({ field }) => (
                <ValueField
                  error={formState.errors.value?.message}
                  label="Amount to convert"
                  step={getAmountStep(formValue.unit ?? "EUR")}
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            <Controller
              control={control}
              name="unit"
              render={({ field }) => (
                <UnitPicker
                  label="Unit"
                  value={field.value}
                  values={["SATS", "EUR", "USD"]}
                  onChange={field.onChange}
                />
              )}
            />
          </Form>
          <div className="grid gap-3 sm:grid-cols-3">
            <Conversion
              label="Bitcoin"
              value={
                <PendingValue
                  fallback={
                    <>
                      <ConverterBitcoinSymbol />
                      <NumericSkeleton width="long" />
                    </>
                  }
                  isLoading={isPriceLoading}
                >
                  {bitcoinValue === null ? null : (
                    <>
                      <ConverterBitcoinSymbol />
                      {formatNumber(bitcoinValue)}
                    </>
                  )}
                </PendingValue>
              }
            />
            {formValue.unit !== "SATS" && (
              <Conversion
                label="Satoshis"
                value={
                  <PendingValue
                    fallback={
                      <>
                        <SatoshiSymbol />
                        <NumericSkeleton width="long" />
                      </>
                    }
                    isLoading={isPriceLoading}
                  >
                    {bitcoinValue === null ? null : (
                      <>
                        <SatoshiSymbol />
                        {formatNumber(bitcoinValue * SATS_PER_BTC, 0)}
                      </>
                    )}
                  </PendingValue>
                }
              />
            )}
            {formValue.unit !== "EUR" && (
              <Conversion
                label="Euro"
                value={
                  <PendingValue
                    fallback={<FiatSkeleton currency="EUR" width="long" />}
                    isLoading={isPriceLoading}
                  >
                    {bitcoinValue === null || !prices
                      ? null
                      : formatFiat(bitcoinValue * prices.EUR, "EUR")}
                  </PendingValue>
                }
              />
            )}
            {formValue.unit !== "USD" && (
              <Conversion
                label="USD"
                value={
                  <PendingValue
                    fallback={<FiatSkeleton currency="USD" width="long" />}
                    isLoading={isPriceLoading}
                  >
                    {bitcoinValue === null || !prices
                      ? null
                      : formatFiat(bitcoinValue * prices.USD, "USD")}
                  </PendingValue>
                }
              />
            )}
          </div>
        </Card.Content>
      </Card>
      <SatoshiRatesTable />
    </div>
  );
}

type ConversionProps = { label: string; value: ReactNode };

function Conversion({ label, value }: ConversionProps) {
  return (
    <div className="rounded-xl bg-surface-secondary p-3">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 flex items-center gap-0.5 font-mono text-lg font-semibold break-all text-foreground tabular-nums">
        {value}
      </p>
    </div>
  );
}
