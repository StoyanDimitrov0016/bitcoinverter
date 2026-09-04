"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Card, Form, Table } from "@heroui/react";
import { useTranslations } from "next-intl";
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
  USD_MILLIONAIRES,
  WORLD_POPULATION,
} from "@/lib/percentile/percentile.constants";
import { useCalculatorData, type CalculatorData } from "../calculator/calculator-data-context";
import { ImpactInfoDialog } from "../impact/impact-info-dialog";
import { ConverterBitcoinSymbol } from "../shared/currency-symbol";
import { FiatSkeleton, NumericSkeleton } from "../shared/numeric-skeleton";
import { riverReportLink, unReportLink, ubsReportLink } from "../shared/report-links";
import { UnavailableValue } from "../shared/unavailable-value";
import { UnitPicker } from "../shared/unit-picker";
import { ValueField } from "../shared/value-field";

export function PercentileConverter() {
  const t = useTranslations("PercentileConverter");
  const tCommon = useTranslations("Common");
  const tValueField = useTranslations("ValueField");
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
                  label={tCommon("unit")}
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
  const t = useTranslations("PercentileConverter");

  const info = (
    <ImpactInfoDialog ariaLabel={t("infoAriaLabel")} title={t("infoTitle")}>
      <p>{t("explanation1", { population: formatInteger(WORLD_POPULATION) })}</p>
      <p>{t("explanation2")}</p>
      <p>{t("explanation3")}</p>
      <p>
        {t.rich("sources", {
          river: riverReportLink,
          un: unReportLink,
          ubs: ubsReportLink,
        })}
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
    <ResultShell
      info={info}
      primary={t("topOfPeople", { percent: formatPercent(result.topPercentile) })}
    />
  );
}

type ResultShellProps = {
  info: React.ReactNode;
  primary: React.ReactNode;
};

function ResultShell({ info, primary }: ResultShellProps) {
  const t = useTranslations("PercentileConverter");

  return (
    <div className="rounded-xl bg-surface-secondary p-4">
      <div className="flex items-center gap-1">
        <p className="text-sm text-muted">{t("resultLabel")}</p>
        {info}
      </div>
      <p className="mt-1 font-mono text-xl font-semibold break-all text-foreground tabular-nums">
        {primary}
      </p>
    </div>
  );
}

function ScarcityStats() {
  const t = useTranslations("PercentileConverter");

  const stats = [
    { label: t("globalPopulation"), value: formatInteger(WORLD_POPULATION) },
    {
      label: t("averagePerPerson"),
      value: (
        <>
          <ConverterBitcoinSymbol />
          {formatBitcoin(EFFECTIVE_BITCOIN_SUPPLY / WORLD_POPULATION)}
        </>
      ),
    },
    {
      label: t("usdMillionaires"),
      value: `~${formatInteger(USD_MILLIONAIRES)}`,
    },
    {
      label: t("averagePerMillionaire"),
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
  const t = useTranslations("PercentileConverter");
  const tCommon = useTranslations("Common");
  const tUnits = useTranslations("Units");

  return (
    <Card className="pb-2">
      <Card.Content>
        <Table variant="secondary">
          <Table.ScrollContainer>
            <Table.Content aria-label={t("benchmarksAriaLabel")}>
              <Table.Header>
                <Table.Column isRowHeader id="percentile">
                  {t("globalPercentileColumn")}
                </Table.Column>
                <Table.Column id="bitcoin">{tUnits("bitcoin")}</Table.Column>
                <Table.Column id="usd">{tUnits("usd")}</Table.Column>
                <Table.Column id="euro">{tUnits("euro")}</Table.Column>
                <Table.Column id="people">{t("totalPeopleColumn")}</Table.Column>
              </Table.Header>
              <Table.Body>
                {PERCENTILE_TARGETS.map((percent) => {
                  const bitcoin = bitcoinForPercentile(percent);
                  return (
                    <Table.Row key={percent} id={String(percent)}>
                      <Table.Cell className="font-mono tabular-nums">
                        {tCommon("topPercent", { percent: formatPercent(percent) })}
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
