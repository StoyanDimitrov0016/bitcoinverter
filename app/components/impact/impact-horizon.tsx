import { Card } from "@heroui/react";

import {
  calculateImpactHorizon,
  IMPACT_TARGETS,
  type AccumulationResults,
} from "@/lib/bitcoin-calculator.utils";
import {
  formatAccumulationAmount,
  formatFiat,
  formatImpactHorizon,
  formatNumber,
} from "@/lib/number-format.utils";
import type { AccumulationInput } from "@/lib/schemas/calculator.schemas";
import type { BitcoinPrices } from "@/lib/schemas/price.schemas";
import { useCalculatorData } from "../calculator/calculator-data-context";
import { ImpactInfoDialog } from "./impact-info-dialog";
import { HoldingAtReferencePrice } from "./holding-at-reference-price";
import { NumericSkeleton } from "../shared/numeric-skeleton";
import { ResultRow } from "../shared/result";

export function ImpactHorizon() {
  const { input, isPriceLoading, prices, results } = useCalculatorData();
  return (
    <Card>
      <Card.Header className="flex-row items-start justify-between gap-3">
        <Card.Title>How long until you own more BTC</Card.Title>
        <ImpactInfoDialog
          ariaLabel="Explain the accumulation timeline"
          title="How the timeline is calculated"
        >
          <ImpactHorizonExplanation input={input} prices={prices} results={results} />
        </ImpactInfoDialog>
      </Card.Header>
      <Card.Content>
        <dl className="space-y-1">
          {IMPACT_TARGETS.map((target) => {
            const months = results ? calculateImpactHorizon(results, target) : null;
            return (
              <ResultRow
                key={target}
                label={`${target}% more BTC`}
                value={
                  months === null && isPriceLoading ? (
                    <>
                      <NumericSkeleton /> months
                    </>
                  ) : (
                    formatImpactHorizon(months)
                  )
                }
              />
            );
          })}
        </dl>
      </Card.Content>
    </Card>
  );
}

type ImpactHorizonExplanationProps = {
  input: AccumulationInput | null;
  prices: BitcoinPrices | null;
  results: AccumulationResults | null;
};

function ImpactHorizonExplanation({ input, prices, results }: ImpactHorizonExplanationProps) {
  if (results?.currentBtc === 0) {
    return (
      <p>
        A relative timeline needs current BTC holdings above zero. Enter an existing holding to
        compare it with future monthly contributions.
      </p>
    );
  }

  if (!input || !prices || !results) {
    return (
      <p>Enter valid amounts and wait for the live BTC price to see a personalized timeline.</p>
    );
  }

  return (
    <>
      <p>
        This timeline uses today's Kraken reference price for every monthly purchase. You currently
        hold <HoldingAtReferencePrice currentBtc={results.currentBtc} input={input} />.
      </p>
      <p>
        Each row shows how many months of{" "}
        <strong>{formatAccumulationAmount(input.contribution, input.contributionUnit)}</strong>{" "}
        contributions are needed to add that percentage of your current holdings.
      </p>
      <p>
        For example, the 100% row means adding another {formatNumber(results.currentBtc)} BTC. At
        today's reference price ({formatFiat(prices.EUR, "EUR")} / {formatFiat(prices.USD, "USD")}),
        that takes <strong>{formatImpactHorizon(calculateImpactHorizon(results, 100))}</strong>.
      </p>
    </>
  );
}
