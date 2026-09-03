"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Form, Table } from "@heroui/react";
import { Controller, useForm, useWatch } from "react-hook-form";

import {
  convertToBitcoin,
  getAmountStep,
  parseConverterInput,
} from "@/lib/calculator/calculator.calculations";
import { CONVERTER_UNITS } from "@/lib/calculator/calculator.constants";
import {
  ConverterSchema,
  type ConverterFormValues,
  type ConverterInput,
} from "@/lib/calculator/calculator.schemas";
import { formatBitcoin, formatFiat, formatInteger, formatPercent } from "@/lib/number-format.utils";
import {
  bitcoinForPercentile,
  calculateGlobalPercentile,
} from "@/lib/percentile/percentile.calculations";
import {
  EFFECTIVE_BITCOIN_SUPPLY,
  PERCENTILE_TARGETS,
  RIVER_CUSTODY_REPORT_URL,
  UN_POPULATION_REPORT_URL,
  UBS_WEALTH_REPORT_URL,
  USD_MILLIONAIRES,
  WORLD_POPULATION,
} from "@/lib/percentile/percentile.constants";
import { useCalculatorData, type CalculatorData } from "../calculator/calculator-data-context";
import { ImpactInfoDialog } from "../impact/impact-info-dialog";
import { ConverterBitcoinSymbol } from "../shared/currency-symbol";
import { FiatSkeleton, NumericSkeleton } from "../shared/numeric-skeleton";
import { UnavailableValue } from "../shared/unavailable-value";
import { UnitPicker } from "../shared/unit-picker";
import { ValueField } from "../shared/value-field";

export function PercentileConverter() {
  const state = useCalculatorData();
  const { control, formState } = useForm<ConverterFormValues, unknown, ConverterInput>({
    resolver: zodResolver(ConverterSchema),
    defaultValues: { value: "1000", unit: "EUR" },
    mode: "onTouched",
  });
  const formValue = useWatch({ control });
  const input = parseConverterInput(formValue);

  return (
    <div className="space-y-4">
      <Card className="py-2">
        <Card.Content className="grid items-center gap-8 lg:grid-cols-[0.7fr_1.3fr]">
          <Form
            aria-label="Bitcoin global percentile input"
            className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-3"
          >
            <Controller
              control={control}
              name="value"
              render={({ field }) => (
                <div className="[&_.label]:sr-only">
                  <ValueField
                    error={formState.errors.value?.message}
                    label="Amount to compare"
                    step={getAmountStep(formValue.unit ?? "BTC")}
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
                  label="Unit"
                  value={field.value}
                  values={CONVERTER_UNITS}
                  onChange={field.onChange}
                />
              )}
            />
          </Form>
          <PercentileResult input={input} state={state} />
        </Card.Content>
      </Card>
      <ScarcityStats />
      <PercentileBenchmarks state={state} />
    </div>
  );
}

type PercentileResultProps = {
  input: ConverterInput | null;
  state: CalculatorData;
};

function PercentileResult({ input, state }: PercentileResultProps) {
  const info = (
    <ImpactInfoDialog
      ariaLabel="Explain the Bitcoin percentile estimate"
      title="How this percentile is estimated"
    >
      <p>
        This estimates the maximum number of people who could each hold at least your amount, then
        compares that number with a global population of {formatInteger(WORLD_POPULATION)}.
      </p>
      <p>
        Lost coins cannot be identified with certainty on-chain. Dormant coins may still be
        controlled, so this is an assumption—not an official count.
      </p>
      <p>
        This is a scarcity-based upper bound, not an observed wealth ranking. Real ownership is
        uneven, addresses are not people, and custodians pool funds for many customers.
      </p>
      <p>
        Source:{" "}
        <a
          className="underline underline-offset-2"
          href={RIVER_CUSTODY_REPORT_URL}
          rel="noreferrer"
          target="_blank"
        >
          River Bitcoin Custody Report 2025
        </a>
        ,{" "}
        <a
          className="underline underline-offset-2"
          href={UN_POPULATION_REPORT_URL}
          rel="noreferrer"
          target="_blank"
        >
          UN World Population Prospects 2024
        </a>
        , and{" "}
        <a
          className="underline underline-offset-2"
          href={UBS_WEALTH_REPORT_URL}
          rel="noreferrer"
          target="_blank"
        >
          UBS Global Wealth Report 2025
        </a>
        .
      </p>
    </ImpactInfoDialog>
  );

  if (state.status === "loading") {
    return <ResultShell info={info} primary={<NumericSkeleton width="long" />} />;
  }

  if (state.status !== "ready" || !input) {
    return <ResultShell info={info} primary={<UnavailableValue />} />;
  }

  const result = calculateGlobalPercentile(convertToBitcoin(input, state.prices));

  return (
    <ResultShell info={info} primary={`Top ${formatPercent(result.topPercentile)} of people`} />
  );
}

type ResultShellProps = {
  info: React.ReactNode;
  primary: React.ReactNode;
};

function ResultShell({ info, primary }: ResultShellProps) {
  return (
    <div className="rounded-xl bg-surface-secondary p-4">
      <div className="flex items-center gap-1">
        <p className="text-sm text-muted">Your estimated global percentile</p>
        {info}
      </div>
      <p className="mt-1 font-mono text-xl font-semibold break-all text-foreground tabular-nums">
        {primary}
      </p>
    </div>
  );
}

function ScarcityStats() {
  const stats = [
    { label: "Global population (UN, 2024)", value: formatInteger(WORLD_POPULATION) },
    {
      label: "Average per person",
      value: (
        <>
          <ConverterBitcoinSymbol />
          {formatBitcoin(EFFECTIVE_BITCOIN_SUPPLY / WORLD_POPULATION)}
        </>
      ),
    },
    {
      label: "USD millionaires (UBS report, 2025)",
      value: `~${formatInteger(USD_MILLIONAIRES)}`,
    },
    {
      label: "Average per millionaire",
      value: (
        <>
          <ConverterBitcoinSymbol />
          {formatBitcoin(EFFECTIVE_BITCOIN_SUPPLY / USD_MILLIONAIRES)}
        </>
      ),
    },
  ] as const;

  return (
    <Card className="py-2">
      <Card.Content>
        <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="rounded-xl bg-surface-secondary p-3">
              <dt className="text-sm text-muted">{stat.label}</dt>
              <dd className="mt-1 flex items-center gap-0.5 font-mono text-lg font-semibold break-all text-foreground tabular-nums">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </Card.Content>
    </Card>
  );
}

type PercentileBenchmarksProps = {
  state: CalculatorData;
};

function PercentileBenchmarks({ state }: PercentileBenchmarksProps) {
  return (
    <Card className="pb-2">
      <Card.Content>
        <Table variant="secondary">
          <Table.ScrollContainer>
            <Table.Content aria-label="Bitcoin required for selected scarcity-based global percentiles">
              <Table.Header>
                <Table.Column isRowHeader id="percentile">
                  Global percentile
                </Table.Column>
                <Table.Column id="bitcoin">Bitcoin</Table.Column>
                <Table.Column id="usd">USD</Table.Column>
                <Table.Column id="euro">Euro</Table.Column>
                <Table.Column id="people">Total people</Table.Column>
              </Table.Header>
              <Table.Body>
                {PERCENTILE_TARGETS.map((percent) => {
                  const bitcoin = bitcoinForPercentile(percent);
                  return (
                    <Table.Row key={percent} id={String(percent)}>
                      <Table.Cell className="font-mono tabular-nums">
                        Top {formatPercent(percent)}
                      </Table.Cell>
                      <Table.Cell className="font-mono tabular-nums">
                        <span className="flex items-center gap-0.5">
                          <ConverterBitcoinSymbol />
                          {formatBitcoin(bitcoin)}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="font-mono tabular-nums">
                        <BenchmarkFiatValue bitcoin={bitcoin} currency="USD" state={state} />
                      </Table.Cell>
                      <Table.Cell className="font-mono tabular-nums">
                        <BenchmarkFiatValue bitcoin={bitcoin} currency="EUR" state={state} />
                      </Table.Cell>
                      <Table.Cell className="font-mono tabular-nums">
                        {formatInteger(WORLD_POPULATION * (percent / 100))}
                      </Table.Cell>
                    </Table.Row>
                  );
                })}
              </Table.Body>
            </Table.Content>
          </Table.ScrollContainer>
        </Table>
      </Card.Content>
    </Card>
  );
}

type BenchmarkFiatValueProps = {
  bitcoin: number;
  currency: "EUR" | "USD";
  state: CalculatorData;
};

function BenchmarkFiatValue({ bitcoin, currency, state }: BenchmarkFiatValueProps) {
  if (state.status === "loading") {
    return <FiatSkeleton currency={currency} width="long" />;
  }

  if (state.status !== "ready") {
    return <UnavailableValue />;
  }

  return formatFiat(bitcoin * state.prices[currency], currency);
}
