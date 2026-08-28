import { Card, Form } from "@heroui/react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { Check as check } from "typebox/value";

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
import type { BitcoinPrices } from "@/lib/schemas/price.schemas";

import { UnitPicker } from "./unit-picker";
import { ValueField } from "./value-field";
import { SatoshiRatesTable } from "./satoshi-rates-table";

type BitcoinConverterProps = { prices: BitcoinPrices | null };

export function BitcoinConverter({ prices }: BitcoinConverterProps) {
  const { control, formState } = useForm<ConverterFormValues>({
    defaultValues: { value: "1", unit: "EUR" },
    mode: "onChange",
  });
  const formValue = useWatch({ control });
  const input = check(ConverterFormSchema, formValue) ? parseConverterForm(formValue) : null;
  const bitcoinValue = input && prices ? convertToBitcoin(input, prices) : null;

  return (
    <div className="space-y-4">
      <Card>
        <Card.Content className="grid items-start gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <Form className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3">
            <Controller
              control={control}
              name="value"
              rules={{
                validate: schemaValidationRule(
                  "DecimalAmountInputSchema",
                  DecimalAmountInputSchema
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
              value={bitcoinValue === null ? "—" : `${formatNumber(bitcoinValue)} BTC`}
            />
            {formValue.unit !== "SATS" && (
              <Conversion
                label="Satoshis"
                value={
                  bitcoinValue === null
                    ? "—"
                    : `${formatNumber(bitcoinValue * SATS_PER_BTC, 0)} sats`
                }
              />
            )}
            {formValue.unit !== "EUR" && (
              <Conversion
                label="Euro"
                value={
                  bitcoinValue === null || !prices
                    ? "—"
                    : formatFiat(bitcoinValue * prices.EUR, "EUR")
                }
              />
            )}
            {formValue.unit !== "USD" && (
              <Conversion
                label="US dollar"
                value={
                  bitcoinValue === null || !prices
                    ? "—"
                    : formatFiat(bitcoinValue * prices.USD, "USD")
                }
              />
            )}
          </div>
        </Card.Content>
      </Card>
      {prices && <SatoshiRatesTable prices={prices} />}
    </div>
  );
}

type ConversionProps = { label: string; value: string };

function Conversion({ label, value }: ConversionProps) {
  return (
    <div className="rounded-xl bg-slate-50 p-4">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 break-all text-lg font-semibold tabular-nums text-slate-950">{value}</p>
    </div>
  );
}
