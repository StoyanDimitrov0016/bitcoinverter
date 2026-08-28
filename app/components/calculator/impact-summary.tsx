import { Card } from "@heroui/react";

import { getImpactBand, type AccumulationResults } from "@/lib/bitcoin-calculator.utils";
import { formatAccumulationAmount, formatFiat, formatNumber } from "@/lib/number-format.utils";
import type { AccumulationInput } from "@/lib/schemas/calculator.schemas";
import type { BitcoinPrices } from "@/lib/schemas/price.schemas";

import { ImpactInfoDialog } from "./impact-info-dialog";
import { Result } from "./result";

type ImpactSummaryProps = {
  input: AccumulationInput | null;
  prices: BitcoinPrices | null;
  results: AccumulationResults | null;
};

export function ImpactSummary({ input, prices, results }: ImpactSummaryProps) {
  return (
    <Card className="overflow-hidden border-orange-200 bg-orange-50/60">
      <Card.Header className="flex-row items-start justify-between gap-3">
        <Card.Title>
          What one year of contributions adds
          <span className="ml-2 text-sm font-normal text-slate-500">at today’s BTC price</span>
        </Card.Title>
        <ImpactInfoDialog
          ariaLabel="Explain the one-year accumulation result"
          title="How this result is calculated"
        >
          {input && prices && results ? (
            <>
              <p>
                You currently hold{" "}
                <strong>{formatAccumulationAmount(input.holding, input.holdingUnit)}</strong>, which
                is <strong>{formatNumber(results.currentBtc)} BTC</strong> at today’s reference
                price.
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
        </ImpactInfoDialog>
      </Card.Header>
      <Card.Content className="grid gap-5 sm:grid-cols-3">
        <Result
          label="Bitcoin added"
          value={results ? `${formatNumber(results.addedBtc)} BTC` : "—"}
        />
        <Result
          label="Net increase"
          value={results && results.currentBtc > 0 ? `${formatNumber(results.impact, 1)}%` : "—"}
        />
        <Result
          label="Impact status"
          value={results && results.currentBtc > 0 ? getImpactBand(results.impact) : "—"}
        />
      </Card.Content>
    </Card>
  );
}
