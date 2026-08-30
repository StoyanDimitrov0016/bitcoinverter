import { Card, Meter, Skeleton } from "@heroui/react";
import { TbTriangleFilled } from "react-icons/tb";

import { getImpactBand, ImpactBands } from "@/lib/bitcoin-calculator.utils";
import { formatAccumulationAmount, formatFiat, formatNumber } from "@/lib/number-format.utils";
import { BitcoinSymbol } from "./currency-symbol";
import { useCalculatorData } from "./calculator-data-context";
import { HoldingAtReferencePrice } from "./holding-at-reference-price";
import { ImpactInfoDialog } from "./impact-info-dialog";
import { MonthlyHoldingsDialog } from "./monthly-holdings";
import { NumericSkeleton, PendingValue } from "./numeric-skeleton";
import { Result } from "./result";

const ImpactBandShortLabels = [
  "Negligible",
  "Low",
  "Moderate",
  "Meaningful",
  "High",
  "Extreme",
] as const;

function getImpactStatus(index: number) {
  if (index >= 0) {
    return ImpactBandShortLabels[index];
  }
  return "Unavailable";
}

function getImpactRange(index: number) {
  const impactBand = ImpactBands[index];
  const nextImpactBand = ImpactBands[index + 1];
  if (!impactBand) {
    return "Unavailable";
  }
  if (!nextImpactBand) {
    return `${impactBand.minimum}% or more`;
  }
  if (impactBand.minimum === 0) {
    return `Under ${nextImpactBand.minimum}%`;
  }
  return `${impactBand.minimum}% to under ${nextImpactBand.minimum}%`;
}

export function ImpactSummary() {
  const { input, isPriceLoading, prices, results } = useCalculatorData();
  const currentBand = results && results.currentBtc > 0 ? getImpactBand(results.impact) : null;
  const currentBandIndex = ImpactBands.findIndex((impactBand) => impactBand.label === currentBand);
  const meterValue = currentBandIndex + 1;
  const impactStatus = getImpactStatus(currentBandIndex);
  const isImpactLoading = isPriceLoading && currentBand === null;

  return (
    <Card className="gap-2 overflow-hidden border-accent-soft bg-accent-soft py-3">
      <Card.Header className="flex-row items-start justify-between gap-3">
        <Card.Title>
          What one year of contributions adds
          <span className="ms-2 text-sm font-normal text-muted">at today’s reference price</span>
        </Card.Title>
        <div className="flex shrink-0 items-center gap-1">
          <MonthlyHoldingsDialog />
          <ImpactInfoDialog
            ariaLabel="Explain the one-year accumulation result"
            title="How this result is calculated"
          >
            {input && prices && results ? (
              <>
                <p>
                  You currently hold{" "}
                  <HoldingAtReferencePrice currentBtc={results.currentBtc} input={input} />.
                </p>
                <p>
                  Adding{" "}
                  <strong>
                    {formatAccumulationAmount(input.contribution, input.contributionUnit)}
                  </strong>{" "}
                  every month for 12 months would add{" "}
                  <strong>{formatNumber(results.addedBtc)} BTC</strong>.
                </p>
                <p>
                  That equals a <strong>{formatNumber(results.impact, 1)}% increase</strong> in your
                  current BTC holdings. The same reference price is used for each monthly purchase:{" "}
                  {formatFiat(prices.EUR, "EUR")} / {formatFiat(prices.USD, "USD")}.
                </p>
              </>
            ) : (
              <p>
                Enter valid amounts and wait for the live BTC price to see a personalized example.
              </p>
            )}
            <div className="border-t border-separator pt-3">
              <p>
                <strong>Impact percentage</strong> is the BTC added over 12 months divided by your
                current BTC holdings, multiplied by 100.
              </p>
              <ul className="mt-2 grid gap-x-6 gap-y-1 sm:grid-cols-2">
                {ImpactBands.map((impactBand, index) => (
                  <li key={impactBand.label} className="flex justify-between gap-3">
                    <span>{ImpactBandShortLabels[index]}</span>
                    <span className="font-mono text-foreground">{getImpactRange(index)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </ImpactInfoDialog>
        </div>
      </Card.Header>
      <Card.Content>
        <dl className="grid gap-5 sm:grid-cols-2">
          <Result
            label="Bitcoin added"
            value={
              <PendingValue
                fallback={
                  <>
                    <BitcoinSymbol />
                    <NumericSkeleton width="long" />
                  </>
                }
                isLoading={isPriceLoading}
              >
                {results ? (
                  <>
                    <BitcoinSymbol />
                    {formatNumber(results.addedBtc)}
                  </>
                ) : null}
              </PendingValue>
            }
          />
          <Result
            label="Net increase"
            value={
              <PendingValue
                fallback={
                  <>
                    <NumericSkeleton />%
                  </>
                }
                isLoading={isPriceLoading}
              >
                {results && results.currentBtc > 0 ? `${formatNumber(results.impact, 1)}%` : null}
              </PendingValue>
            }
          />
        </dl>
        <div className="mt-2 border-t border-accent/20 pt-3">
          <div className="mb-2 flex items-center gap-2">
            <span className="text-sm text-muted">Impact scale</span>
            {isImpactLoading ? (
              <Skeleton
                aria-label="Loading impact status"
                animationType="pulse"
                className="h-4 w-16 rounded-sm"
              />
            ) : (
              <strong className="text-sm text-foreground transition-colors duration-300">
                {impactStatus}
              </strong>
            )}
          </div>
          <Meter
            aria-label="Accumulation impact level"
            aria-valuetext={currentBand ?? "Impact unavailable"}
            maxValue={ImpactBands.length}
            minValue={0}
            value={meterValue}
          >
            <Meter.Track className="relative h-2 overflow-visible! bg-linear-to-r from-danger via-warning to-success">
              <Meter.Fill className="relative h-full bg-transparent! transition-[width] duration-500">
                {currentBand ? (
                  <TbTriangleFilled
                    aria-hidden="true"
                    className="absolute end-0 bottom-full size-3 translate-x-1/2 rotate-180 text-foreground"
                  />
                ) : null}
              </Meter.Fill>
            </Meter.Track>
          </Meter>
          <div
            aria-hidden="true"
            className="mt-2 hidden grid-cols-6 gap-2 text-center text-xs text-muted sm:grid"
          >
            {ImpactBandShortLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
          <div
            aria-hidden="true"
            className="mt-2 flex justify-between text-xs text-muted sm:hidden"
          >
            <span>Negligible</span>
            <span>Extreme</span>
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}
