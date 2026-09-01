import { Card } from "@heroui/react";

import {
  calculatePriceImpactLevel,
  IMPACT_TARGETS,
  type AccumulationResults,
} from "@/lib/bitcoin-calculator.utils";
import { formatAccumulationAmount, formatFiat, formatNumber } from "@/lib/number-format.utils";
import type { AccumulationInput } from "@/lib/schemas/calculator.schemas";
import type { BitcoinPrices } from "@/lib/schemas/price.schemas";
import { useCalculatorData } from "../shared/calculator-data-context";
import { ImpactInfoDialog } from "./impact-info-dialog";
import { FiatSkeleton, PendingValue } from "../shared/numeric-skeleton";
import { ResultRow } from "../shared/result";

export function PriceImpactLevels() {
  const { input, isPriceLoading, prices, results } = useCalculatorData();
  const contributionCurrency = input?.contributionUnit === "USD" ? "USD" : "EUR";
  const hundredPercentLevel =
    input && results && input.contributionUnit !== "BTC"
      ? calculatePriceImpactLevel(input.contribution, results.currentBtc, 100)
      : null;

  return (
    <Card>
      <Card.Header className="flex-row items-start justify-between gap-3">
        <Card.Title>BTC price needed for each yearly increase</Card.Title>
        <ImpactInfoDialog
          ariaLabel="Explain the BTC price thresholds"
          title="How the price thresholds are calculated"
        >
          <PriceImpactExplanation
            hundredPercentLevel={hundredPercentLevel}
            input={input}
            prices={prices}
            results={results}
          />
        </ImpactInfoDialog>
      </Card.Header>
      <Card.Content>
        <dl className="space-y-1">
          {IMPACT_TARGETS.toReversed().map((target) => {
            const level =
              input && results && input.contributionUnit !== "BTC"
                ? calculatePriceImpactLevel(input.contribution, results.currentBtc, target)
                : null;
            return (
              <ResultRow
                key={target}
                label={`Adds ${target}% of current holdings`}
                value={
                  <PendingValue
                    fallback={<FiatSkeleton currency={contributionCurrency} width="long" />}
                    isLoading={isPriceLoading && input?.contributionUnit !== "BTC"}
                  >
                    {level !== null && input && input.contributionUnit !== "BTC"
                      ? formatFiat(level, input.contributionUnit)
                      : null}
                  </PendingValue>
                }
              />
            );
          })}
        </dl>
      </Card.Content>
    </Card>
  );
}

type PriceImpactExplanationProps = {
  hundredPercentLevel: number | null;
  input: AccumulationInput | null;
  prices: BitcoinPrices | null;
  results: AccumulationResults | null;
};

function PriceImpactExplanation({
  hundredPercentLevel,
  input,
  prices,
  results,
}: PriceImpactExplanationProps) {
  if (!input || !prices || !results) {
    return (
      <p>Enter valid amounts and wait for the live BTC price to see personalized thresholds.</p>
    );
  }

  if (input.contributionUnit === "BTC") {
    return (
      <p>
        Your contribution is already in BTC, so price doesn’t change its amount. Thresholds appear
        once the monthly contribution is set to EUR or USD.
      </p>
    );
  }

  return (
    <>
      <p>
        You currently hold <strong>{formatNumber(results.currentBtc)} BTC</strong> and contribute
        <strong>
          {" "}
          {formatAccumulationAmount(input.contribution, input.contributionUnit)}
        </strong>{" "}
        each month.
      </p>
      <p>
        Each row shows the BTC price at which 12 months of contributions would add that share of
        your current holdings. For example, the 100% threshold is
        <strong>
          {" "}
          {hundredPercentLevel === null
            ? "—"
            : formatFiat(hundredPercentLevel, input.contributionUnit)}
        </strong>
        ; at that price, your annual contributions would buy another{" "}
        {formatNumber(results.currentBtc)} BTC.
      </p>
      <p>
        Today’s reference price is {formatFiat(prices.EUR, "EUR")} / {formatFiat(prices.USD, "USD")}
        . These thresholds are mathematical scenarios, not price forecasts.
      </p>
    </>
  );
}
