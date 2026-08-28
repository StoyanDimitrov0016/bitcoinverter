import { Card } from "@heroui/react";

import {
  calculatePriceImpactLevel,
  ImpactTargets,
  type AccumulationResults,
} from "@/lib/bitcoin-calculator.utils";
import { formatAccumulationAmount, formatFiat, formatNumber } from "@/lib/number-format.utils";
import type { AccumulationInput } from "@/lib/schemas/calculator.schemas";
import type { BitcoinPrices } from "@/lib/schemas/price.schemas";

import { ImpactInfoDialog } from "./impact-info-dialog";
import { ResultRow } from "./result";

type PriceImpactLevelsProps = {
  input: AccumulationInput | null;
  prices: BitcoinPrices | null;
  results: AccumulationResults | null;
};

export function PriceImpactLevels({ input, prices, results }: PriceImpactLevelsProps) {
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
      <Card.Content className="space-y-1">
        {ImpactTargets.toReversed().map((target) => {
          const level =
            input && results && input.contributionUnit !== "BTC"
              ? calculatePriceImpactLevel(input.contribution, results.currentBtc, target)
              : null;
          return (
            <ResultRow
              key={target}
              label={`Adds ${target}% of current holdings`}
              value={
                level !== null && input && input.contributionUnit !== "BTC"
                  ? formatFiat(level, input.contributionUnit)
                  : "—"
              }
            />
          );
        })}
      </Card.Content>
    </Card>
  );
}

type PriceImpactExplanationProps = PriceImpactLevelsProps & {
  hundredPercentLevel: number | null;
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
        Your contribution is already entered in BTC, so its BTC amount does not change with price.
        Price thresholds are available when the monthly contribution is entered in EUR or USD.
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
