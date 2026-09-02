import { Card, Table } from "@heroui/react";

import { SATS_PER_BTC } from "@/lib/calculator/calculator.constants";
import type { FiatCurrency } from "@/lib/calculator/calculator.schemas";
import { formatBitcoin, formatNumber, formatRateFiat } from "@/lib/number-format.utils";
import { useCalculatorData, type CalculatorData } from "../calculator/calculator-data-context";
import { ConverterBitcoinSymbol, SatoshiSymbol } from "../shared/currency-symbol";
import { FiatSkeleton } from "../shared/numeric-skeleton";
import { UnavailableValue } from "../shared/unavailable-value";

const SATOSHI_AMOUNTS = [
  1, 10, 100, 1_000, 10_000, 100_000, 1_000_000, 10_000_000, 100_000_000,
] as const;

export function SatoshiRatesTable() {
  const state = useCalculatorData();
  return (
    <Card className="pb-2">
      <Card.Content>
        <Table variant="secondary">
          <Table.ScrollContainer>
            <Table.Content aria-label="Common satoshi amounts and their live Bitcoin, USD, and euro equivalents">
              <Table.Header>
                <Table.Column isRowHeader id="satoshis">
                  Satoshis
                </Table.Column>
                <Table.Column id="bitcoin">Bitcoin</Table.Column>
                <Table.Column id="usd">USD</Table.Column>
                <Table.Column id="euro">Euro</Table.Column>
              </Table.Header>
              <Table.Body>
                {SATOSHI_AMOUNTS.map((satoshis) => {
                  const bitcoin = satoshis / SATS_PER_BTC;
                  return (
                    <Table.Row key={satoshis} id={satoshis}>
                      <Table.Cell className="font-mono tabular-nums">
                        <span className="flex items-center gap-0.5">
                          <SatoshiSymbol />
                          {formatNumber(satoshis, 0)}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="font-mono tabular-nums">
                        <span className="flex items-center gap-0.5">
                          <ConverterBitcoinSymbol />
                          {formatBitcoin(bitcoin)}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="font-mono tabular-nums">
                        <SatoshiFiatValue bitcoin={bitcoin} currency="USD" state={state} />
                      </Table.Cell>
                      <Table.Cell className="font-mono tabular-nums">
                        <SatoshiFiatValue bitcoin={bitcoin} currency="EUR" state={state} />
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

type SatoshiFiatValueProps = {
  bitcoin: number;
  currency: FiatCurrency;
  state: CalculatorData;
};

function SatoshiFiatValue({ bitcoin, currency, state }: SatoshiFiatValueProps) {
  if (state.status === "loading") {
    return <FiatSkeleton currency={currency} width="long" />;
  }

  if (state.status === "price-error") {
    return <UnavailableValue />;
  }

  return formatRateFiat(bitcoin * state.prices[currency], currency);
}
