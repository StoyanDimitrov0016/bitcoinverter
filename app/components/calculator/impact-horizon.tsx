import { Card } from "@heroui/react";

import {
  calculateImpactHorizon,
  ImpactTargets,
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

import { ImpactInfoDialog } from "./impact-info-dialog";
import { ResultRow } from "./result";

type ImpactHorizonProps = {
  input: AccumulationInput | null;
  prices: BitcoinPrices | null;
  results: AccumulationResults | null;
};

export function ImpactHorizon({ input, prices, results }: ImpactHorizonProps) {
  return (
    <Card>
      <Card.Header className="flex-row items-start justify-between gap-3">
        <Card.Title>
          How long until you own more BTC
          <span className="ml-2 text-sm font-normal text-slate-500">at today’s BTC price</span>
        </Card.Title>
        <ImpactInfoDialog
          ariaLabel="Explain the accumulation timeline"
          title="How the timeline is calculated"
        >
          {input && prices && results ? (
            <>
              <p>
                You currently hold{" "}
                <strong>{formatAccumulationAmount(input.holding, input.holdingUnit)}</strong>, or{" "}
                <strong>{formatNumber(results.currentBtc)} BTC</strong> at today’s reference price.
              </p>
              <p>
                Each row shows how many months of{" "}
                <strong>
                  {formatAccumulationAmount(input.contribution, input.contributionUnit)}
                </strong>
                contributions are needed to add that percentage of your current holdings.
              </p>
              <p>
                For example, the 100% row means adding another {formatNumber(results.currentBtc)}{" "}
                BTC. At the current reference price ({formatFiat(prices.EUR, "EUR")} /{" "}
                {formatFiat(prices.USD, "USD")}), that takes{" "}
                <strong>{formatImpactHorizon(calculateImpactHorizon(results, 100))}</strong>.
              </p>
            </>
          ) : (
            <p>
              Enter valid amounts and wait for the live BTC price to see a personalized timeline.
            </p>
          )}
        </ImpactInfoDialog>
      </Card.Header>
      <Card.Content className="space-y-1">
        {ImpactTargets.map((target) => {
          const months = results ? calculateImpactHorizon(results, target) : null;
          return (
            <ResultRow
              key={target}
              label={`${target}% more BTC`}
              value={formatImpactHorizon(months)}
            />
          );
        })}
      </Card.Content>
    </Card>
  );
}
